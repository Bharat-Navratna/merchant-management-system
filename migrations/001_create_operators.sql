CREATE TABLE IF NOT EXISTS operators (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'OPERATOR',
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT operators_role_check CHECK (role IN ('ADMIN', 'OPERATOR'))
);

CREATE INDEX IF NOT EXISTS idx_operators_email ON operators(email);