# Database Evolution Plan

## V1

```text
merchants
customers
```

## V2

```text
orders
payments
```

## V3/V4

```text
payment_attempts
idempotency_records
```

## V5

```text
transactions
refunds
audit_logs
```

## V6+

```text
users
roles
webhook_events
```

## V11+

```text
risk_assessments
fraud_rules
fraud_events
```

Use schema migrations as the project grows. Avoid relying on `ddl-auto=create` or destructive automatic schema generation for serious development.
