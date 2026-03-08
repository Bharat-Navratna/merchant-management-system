# Merchant Management System

Backend server for managing merchants, KYB verification, status transitions, audit history, and webhook notifications.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT
- Zod
- Jest
- Supertest

## Project Structure

```
src/
  config/       # Environment and app configuration
  controllers/  # Request handlers
  db/           # Database connection and pool
  middleware/   # Auth, error handling, validation
  routes/       # Express route definitions
  services/     # Business logic
  utils/        # Shared utilities
migrations/     # SQL migration files
scripts/        # Migration runner and utilities
tests/          # Jest + Supertest tests
```

## Setup

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

Copy the example env file and update the values:

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

### 6. Start the server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

### 7. Run tests

```bash
npm test
```

## API Endpoints

### Health Check

- `GET /api/health` — Server status
