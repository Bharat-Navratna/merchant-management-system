CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id BIGSERIAL PRIMARY KEY,
    subscription_id BIGINT NOT NULL REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMPTZ NULL,
    next_attempt_at TIMESTAMPTZ NULL,
    last_error TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT webhook_deliveries_status_check CHECK (
        status IN ('PENDING', 'SUCCESS', 'FAILED')
    ),
    CONSTRAINT webhook_deliveries_event_type_check CHECK (
        event_type IN ('MERCHANT_APPROVED', 'MERCHANT_SUSPENDED')
    )
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_subscription_id 
ON webhook_deliveries(subscription_id);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status 
ON webhook_deliveries(status);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_next_attempt_at 
ON webhook_deliveries(next_attempt_at);