CREATE TABLE IF NOT EXISTS merchants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    pricing_tier VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_KYB',
    created_by BIGINT NULL REFERENCES operators(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT merchants_status_check CHECK (status IN ('PENDING_KYB', 'ACTIVE', 'SUSPENDED'))
);

CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_merchants_city ON merchants(city);
CREATE INDEX IF NOT EXISTS idx_merchants_contact_email ON merchants(contact_email);
CREATE INDEX IF NOT EXISTS idx_merchants_name ON merchants(name);