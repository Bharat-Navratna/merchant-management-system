CREATE TABLE IF NOT EXISTS merchant_status_history (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    old_status VARCHAR(30) NOT NULL,
    new_status VARCHAR(30) NOT NULL,
    changed_by BIGINT NULL REFERENCES operators(id) ON DELETE SET NULL,
    reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT merchant_status_history_old_status_check CHECK (
        old_status IN ('PENDING_KYB', 'ACTIVE', 'SUSPENDED')
    ),
    CONSTRAINT merchant_status_history_new_status_check CHECK (
        new_status IN ('PENDING_KYB', 'ACTIVE', 'SUSPENDED')
    )
);

CREATE INDEX IF NOT EXISTS idx_merchant_status_history_merchant_id 
ON merchant_status_history(merchant_id);

CREATE INDEX IF NOT EXISTS idx_merchant_status_history_created_at 
ON merchant_status_history(created_at);