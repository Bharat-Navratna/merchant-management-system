# Merchant Management System

A backend service for managing merchants on a payment platform. Merchants must complete KYB (Know Your Business) verification before they can accept payments. The system enforces strict status transition rules, tracks document verification, maintains an immutable audit history, and delivers webhook notifications to external subscribers.

## Key Features

- **Operator Authentication** : JWT-based login with access and refresh tokens, automatic lockout after failed attempts
- **Merchant CRUD** : Create, read, update, and delete merchant records with role-based access control
- **KYB Document Management** : Upload and verify required business documents per merchant
- **Status Transition Engine** : Rule-enforced status changes with document verification checks
- **Immutable Status History** : Append-only audit log of every merchant status change
- **Webhook Subscriptions** : Admin-managed webhook registration for external integrations
- **Background Webhook Delivery** : Asynchronous delivery with signed payloads and retry on failure
- **Input Validation** : All incoming data validated with Zod schemas
- **Secure Password Hashing** : Passwords hashed using bcrypt with salt rounds

## Tech Stack

- Node.js (v20+)
- Express.js (4.x)
- PostgreSQL (v15+)
- JWT for authentication
- Zod for input validation
- bcrypt for password hashing
- Jest + Supertest for testing

## Merchant Lifecycle

Merchants progress through three statuses:

```
PENDING_KYB  →  ACTIVE
PENDING_KYB  →  SUSPENDED
ACTIVE       →  SUSPENDED
SUSPENDED    →  ACTIVE
```

**Activation Rule:** A merchant cannot transition to `ACTIVE` unless all three required KYB documents are uploaded and verified:

1. Business Registration
2. Owner Identity Document
3. Bank Account Proof

Any other status transition (e.g., `ACTIVE → PENDING_KYB`) is rejected with a clear error message.

## Database Schema

| Table | Purpose |
|---|---|
| `operators` | System users (admin and operator roles) |
| `refresh_tokens` | Hashed refresh tokens with expiry and revocation |
| `merchants` | Merchant records with status and pricing tier |
| `merchant_documents` | KYB documents linked to merchants |
| `merchant_status_history` | Immutable log of all status transitions |
| `webhook_subscriptions` | Registered webhook endpoints |
| `webhook_deliveries` | Delivery attempts with status and retry tracking |

## Project Structure

```
src/
  config/       # Environment and app configuration
  controllers/  # Request handlers
  db/           # Database connection and pool
  middleware/   # Auth, error handling, validation
  routes/       # Express route definitions
  services/     # Business logic
  validators/   # Zod validation schemas
  utils/        # Shared utilities (JWT, signatures)
  workers/      # Background job processors
migrations/     # SQL migration files
scripts/        # Migration runner and seed utilities
tests/          # Jest + Supertest tests
```

## Setup Instructions

### Prerequisites

- Node.js v20 or higher
- PostgreSQL 15+

### 1. Clone the repository

```bash
git clone <repository-url>
cd merchant-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials and JWT secrets.

### 4. Create the database

```sql
CREATE DATABASE merchant_management_system;
```

### 5. Run migrations

```bash
npm run migrate
```

### 6. Seed the admin operator

```bash
npm run seed
```

This creates an admin user with email `admin@yqnpay.com` and password `Admin123!`.

## Environment Variables

```
NODE_ENV                        # development | test | production
PORT                            # Server port (default: 5000)

DB_HOST                         # PostgreSQL host
DB_PORT                         # PostgreSQL port
DB_NAME                         # Database name
DB_USER                         # Database user
DB_PASSWORD                     # Database password

JWT_ACCESS_SECRET               # Secret for signing access tokens
JWT_REFRESH_SECRET              # Secret for signing refresh tokens
JWT_ACCESS_EXPIRES_IN           # Access token expiry (default: 15m)
JWT_REFRESH_EXPIRES_IN          # Refresh token expiry (default: 7d)

LOGIN_MAX_ATTEMPTS              # Max failed logins before lockout (default: 5)
LOGIN_LOCK_MINUTES              # Lockout duration in minutes (default: 15)

WEBHOOK_MAX_RETRIES             # Max delivery attempts (default: 3)
WEBHOOK_RETRY_INTERVAL_SECONDS  # Delay between retries in seconds (default: 60)
```

## Running the Application

### Start the API server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

### Start the webhook worker

```bash
npm run worker:webhooks
```

The worker polls for pending webhook deliveries and processes them in the background.

## Running Tests

```bash
npm test
```

Tests use a real PostgreSQL database. Ensure your `.env` is configured before running.

## API Endpoints

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
