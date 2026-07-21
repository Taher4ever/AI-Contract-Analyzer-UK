-- Stripe delivers webhooks at-least-once and retries on non-2xx responses,
-- so the same invoice.paid event can arrive more than once. Without a
-- uniqueness guarantee on stripe_id, a retry would insert a duplicate
-- payment row. The webhook handler upserts on this constraint instead of
-- inserting.
alter table public.payments add constraint payments_stripe_id_key unique (stripe_id);
