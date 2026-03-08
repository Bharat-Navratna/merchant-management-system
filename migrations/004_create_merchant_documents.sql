CREATE TABLE IF NOT EXISTS merchant_documents (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_reference TEXT NOT NULL,
    is_uploaded BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ NULL,
    verified_by BIGINT NULL REFERENCES operators(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT merchant_documents_type_check CHECK (
        document_type IN ('BUSINESS_REGISTRATION', 'OWNER_IDENTITY', 'BANK_ACCOUNT_PROOF')
    ),
    CONSTRAINT unique_merchant_document_type UNIQUE (merchant_id, document_type)
);

CREATE INDEX IF NOT EXISTS idx_merchant_documents_merchant_id ON merchant_documents(merchant_id);
CREATE INDEX IF NOT EXISTS idx_merchant_documents_type ON merchant_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_merchant_documents_verified ON merchant_documents(is_verified);