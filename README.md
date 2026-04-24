# Fintech Merchant API

Production-grade REST API for merchant onboarding, KYB verification, and webhook event delivery.

---

- **Operator Authentication** : JWT-based login with access and refresh tokens, automatic lockout after failed attempts
- **Merchant CRUD** : Create, read, update, and delete merchant records with role-based access control
- **KYB Document Management** : Upload and verify required business documents per merchant
- **Status Transition Engine** : Rule-enforced status changes with document verification checks
- **Immutable Status History** : Append-only audit log of every merchant status change
- **Webhook Subscriptions** : Admin-managed webhook registration for external integrations
- **Background Webhook Delivery** : Asynchronous delivery with signed payloads and retry on failure
- **Input Validation** : All incoming data validated with Zod schemas
- **Secure Password Hashing** : Passwords hashed using bcrypt with salt rounds

## Why this project

Fintech platforms that accept payments from third-party merchants face a regulatory and operational challenge: they must verify the legitimacy of each merchant before allowing them to transact. This process is called **KYB (Know Your Business)**, the business-to-business equivalent of the consumer KYC process.


- Node.js (v24.13.1)
- Express.js (4.22.1)
- PostgreSQL (16.13)
- JWT for authentication
- Zod for input validation
- bcrypt for password hashing
- Jest + Supertest for testing

This API models a realistic merchant onboarding lifecycle:

1. An operator creates a merchant record
2. The merchant submits three required documents (business registration, owner identity, bank account proof)
3. Operators review and verify each document
4. Once all three are verified, the merchant can be **activated**
5. Active merchants can be **suspended** and re-activated, with every transition logged in an immutable audit trail

**Why webhook delivery is architecturally interesting:** Downstream systems (payment processors, compliance tools, notification services) need to react to merchant status changes. Rather than polling, clients register a URL and receive signed HTTP callbacks. Because delivery is unreliable (target URLs go down, network blips happen), the system enqueues each delivery to PostgreSQL and a background worker processes them with configurable retry logic, forming a lightweight, dependency-free message queue pattern.

---

## Tech stack

| Technology | Purpose | Why chosen |
|---|---|---|
| Node.js 20 + Express | HTTP server and routing | Widely adopted, minimal overhead, large ecosystem |
| PostgreSQL 16 | Relational database | ACID transactions for state machine correctness; rich query support |
| `pg` (node-postgres) | DB driver + connection pool | Lightweight, no ORM overhead, full SQL control |
| JWT (access + refresh) | Authentication | Stateless auth with token rotation; refresh tokens stored and revocable |
| bcrypt | Password hashing | Industry-standard adaptive hashing; protects against brute-force |
| Zod | Input validation | Schema-first validation with TypeScript-friendly inference |
| swagger-jsdoc + swagger-ui-express | OpenAPI docs | Docs live next to the code; always in sync with routes |
| express-rate-limit | Rate limiting | Per-route throttling without a Redis dependency |
| Jest + supertest | Testing | First-class Node test runner; supertest drives real HTTP requests |
| Docker + Docker Compose | Containerisation | Single-command local setup; mirrors production topology |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  HTTP Request                                                   │
│       │                                                         │
│       ▼                                                         │
│  Rate Limiter (authLimiter / apiLimiter / webhookLimiter)       │
│       │                                                         │
│       ▼                                                         │
│  Express Router  (/api/auth, /api/merchants, /api/webhooks)     │
│       │                                                         │
│       ▼                                                         │
│  Auth Middleware  (verifies JWT, sets req.user)                 │
│       │                                                         │
│       ▼                                                         │
│  Validation Middleware  (Zod schemas)                           │
│       │                                                         │
│       ▼                                                         │
│  Controller  (parses req, calls service, sends response)        │
│       │                                                         │
│       ▼                                                         │
│  Service  (business logic, state machine, transactions)         │
│       │                                                         │
│       ▼                                                         │
│  PostgreSQL  (pg connection pool)                               │
└─────────────────────────────────────────────────────────────────┘

Status change event flow:

  PATCH /merchants/:id/status
       │
       ▼
  status.service.js  ──► enqueueWebhookDeliveries()
                               │
                               ▼
                        webhook_deliveries table  (status = PENDING)
                               │
                               ▼
                        webhook.worker.js  (runs every 30 s)
                               │
                               ▼
                        POST to each registered target URL
                        (HMAC-SHA256 signed, with retry logic)
```

---

## Features

- **KYB state machine**: merchants progress through a strict sequence of statuses; every transition is validated and logged in an append-only history table
- **JWT authentication with refresh tokens**: 15-minute access tokens, 7-day refresh tokens with rotation and revocation; account lockout after 5 failed login attempts
- **Webhook delivery worker**: status change events are enqueued in PostgreSQL and delivered asynchronously with configurable retries and HMAC-SHA256 payload signing
- **Database migrations**: ordered SQL migration files; run with `npm run migrate`
- **Docker Compose**: one command spins up PostgreSQL + the app with migrations auto-applied
- **Swagger / OpenAPI docs**: full interactive documentation at `/api/docs`
- **Rate limiting**: 5 req/15 min on auth, 100 req/15 min on merchant APIs, 20 req/min on webhooks
- **Jest integration tests**: end-to-end tests against a real database covering auth, merchants, KYB flow, and webhooks

---

## KYB status transitions

```
  PENDING_KYB ──────────────────────────────► ACTIVE
       │            (all 3 docs verified)       │
       │                                        │
       └──────────────────────────────────────► SUSPENDED ─────► ACTIVE
              (any time)                                  (re-activation)
```

Valid transitions:

| From | To | Condition |
|---|---|---|
| `PENDING_KYB` | `ACTIVE` | All 3 KYB documents verified |
| `PENDING_KYB` | `SUSPENDED` | None |
| `ACTIVE` | `SUSPENDED` | None |
| `SUSPENDED` | `ACTIVE` | None |

Every status change is recorded in `merchant_status_history` with the operator who made it, the reason, and a timestamp. This table is append-only.

---

## API endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new operator account |
| `POST` | `/api/auth/login` | Public | Login; returns access + refresh tokens |
| `POST` | `/api/auth/logout` | Public | Revoke a refresh token |
| `POST` | `/api/auth/refresh` | Public | Exchange refresh token for new token pair |
| `GET` | `/api/health` | Public | Health check |
| `POST` | `/api/merchants` | Bearer | Create a merchant |
| `GET` | `/api/merchants` | Bearer | List merchants (filterable by status, city, category, search) |
| `GET` | `/api/merchants/:id` | Bearer | Get merchant by ID |
| `PATCH` | `/api/merchants/:id` | Bearer | Update merchant fields |
| `DELETE` | `/api/merchants/:id` | Bearer (ADMIN) | Delete a merchant |
| `PATCH` | `/api/merchants/:id/status` | Bearer | Transition merchant status |
| `POST` | `/api/merchants/:id/documents` | Bearer | Upload a KYB document |
| `GET` | `/api/merchants/:id/documents` | Bearer | List KYB documents for a merchant |
| `PATCH` | `/api/merchants/:id/documents/:docId/verify` | Bearer | Verify a KYB document |
| `POST` | `/api/webhooks` | Bearer (ADMIN) | Register a webhook subscription |
| `GET` | `/api/webhooks` | Bearer (ADMIN) | List webhook subscriptions |
| `DELETE` | `/api/webhooks/:id` | Bearer (ADMIN) | Delete a webhook subscription |
| `GET` | `/api/docs` | Public | Swagger UI |

---

## Getting started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- Node.js 20+ and npm (only needed for local development without Docker)

### Run with Docker Compose (recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Bharat-Navratna/fintech-merchant-api.git
cd fintech-merchant-api

# 2. Create your environment file
cp .env.example .env
# Edit .env: set strong values for DB_PASSWORD, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

# 3. Start the stack (Postgres + app; migrations and seed run automatically)
docker compose up --build

# API available at http://localhost:3000
# Swagger docs  at http://localhost:3000/api/docs
```

### Run locally (without Docker)

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
# Edit .env: DB_HOST should point to your local Postgres instance

# 3. Run migrations
npm run migrate

# 4. Seed the default admin operator
npm run seed

# 5. Start the development server
npm run dev
```

---

## Running tests

Tests run against a **real PostgreSQL database** configured via `.env`. Each test file isolates its own data using `beforeAll` / `afterAll` setup and teardown.

```bash
# Run the full test suite
npm test

# Run with code coverage report
npm run test:coverage

# Watch mode (re-runs on file changes)
npm run test:watch
```

---

## Environment variables


### Health

- `GET /api/health` : Server status check

### Authentication

- `POST /api/auth/login` : Login with email and password
- `POST /api/auth/refresh` : Refresh access token

### Merchants

- `POST /api/merchants` : Create a new merchant
- `GET /api/merchants` : List merchants (supports filters: status, city, category, search)
- `GET /api/merchants/:id` : Get merchant by ID
- `PATCH /api/merchants/:id` : Update merchant details
- `DELETE /api/merchants/:id` : Delete merchant (admin only)

### KYB Documents

- `POST /api/merchants/:merchantId/documents` : Upload a document
- `GET /api/merchants/:merchantId/documents` : List documents for a merchant
- `PATCH /api/merchants/:merchantId/documents/:documentId/verify` : Verify a document

### Status Management

- `PATCH /api/merchants/:id/status` : Change merchant status

### Webhooks

- `POST /api/webhooks` : Register a webhook subscription (admin only)
- `GET /api/webhooks` : List webhook subscriptions (admin only)
- `DELETE /api/webhooks/:id` : Delete a webhook subscription (admin only)

## Webhook System

External systems can register a webhook URL through the admin API. When a merchant status changes to `ACTIVE` or `SUSPENDED`, the system enqueues a delivery for every active subscription.

Each webhook request includes an HMAC SHA256 signature in the `X-YQN-Signature` header, computed using the subscriber's secret key. Recipients should verify this signature to authenticate the payload.

Failed deliveries are retried up to 3 times with a configurable interval between attempts.

### Example Webhook Payload

```json
{
  "merchantId": 4,
  "name": "Atlas Pharmacy",
  "status": "ACTIVE",
  "eventType": "MERCHANT_APPROVED",
  "changedBy": 1,
  "reason": "KYB approved",
  "occurredAt": "2026-03-08T12:00:00.000Z"
}
```

### Webhook Event Types

- `MERCHANT_APPROVED` : Merchant status changed to ACTIVE
- `MERCHANT_SUSPENDED` : Merchant status changed to SUSPENDED

## Security Considerations

- Passwords are hashed using bcrypt with salt rounds before storage
- JWT access tokens expire after 15 minutes; refresh tokens after 7 days
- All incoming request data is validated using Zod schemas
- Sensitive configuration values are stored in environment variables (never hardcoded)
- Role-based authorization restricts admin actions (delete merchant, manage webhooks, change pricing tier)
- Refresh tokens are hashed (SHA256) before database storage
- Account lockout protects against brute-force login attempts

## Design Decisions

- **Separation of concerns** : Controllers handle HTTP, services contain business logic, validators enforce input constraints
- **Database transactions** : Status transitions use explicit BEGIN/COMMIT/ROLLBACK to ensure atomicity
- **Background worker** : Webhook delivery runs in a separate process to avoid blocking API requests
- **Immutable audit log** : Status history table is append-only with no UPDATE or DELETE operations
- **Token rotation** : Refresh tokens are revoked and replaced on each use to limit replay attacks

## Future Improvements

- Exponential backoff for webhook retries
- Pagination and sorting for merchant lists
- Rate limiting on authentication endpoints
- Webhook signature verification helper library for subscribers
- Soft delete for merchants instead of hard delete
- Request logging middleware for observability
=======
| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | Yes | `development` | Runtime environment (`development`, `test`, `production`) |
| `PORT` | Yes | — | Port the HTTP server listens on |
| `API_URL` | No | `http://localhost:PORT/api` | Base URL shown in Swagger UI |
| `DB_HOST` | Yes | — | PostgreSQL host |
| `DB_PORT` | Yes | — | PostgreSQL port |
| `DB_NAME` | Yes | — | Database name |
| `DB_USER` | Yes | — | Database user |
| `DB_PASSWORD` | Yes | — | Database password |
| `JWT_ACCESS_SECRET` | Yes | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | — | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Yes | — | Access token lifetime (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Yes | — | Refresh token lifetime (e.g. `7d`) |
| `LOGIN_MAX_ATTEMPTS` | No | `5` | Failed login attempts before account lockout |
| `LOGIN_LOCK_MINUTES` | No | `15` | Lockout duration in minutes |
| `WEBHOOK_MAX_RETRIES` | No | `3` | Maximum delivery attempts per webhook event |
| `WEBHOOK_RETRY_INTERVAL_SECONDS` | No | `60` | Delay between delivery retries |
