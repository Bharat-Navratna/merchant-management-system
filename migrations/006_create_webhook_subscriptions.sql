CREATE TABLE IF NOT EXISTS webhook_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    target_url TEXT NOT NULL,
    secret TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_subscriptions_is_active 
ON webhook_subscriptions(is_active);