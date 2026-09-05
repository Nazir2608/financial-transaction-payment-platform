# API Conventions

Base path:

```text
/api/v1
```

## HTTP methods

- POST — create/action
- GET — read
- PATCH — partial update
- PUT — full replacement when actually required
- DELETE — only where deletion is semantically safe

## Error shape

Target standard:

```json
{
  "timestamp": "2026-09-05T10:00:00Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "path": "/api/v1/payments",
  "traceId": "..."
}
```

## Resource identifiers

Use public business-safe identifiers such as:

```text
MER-100001
CUS-100001
ORD-100001
PAY-100001
REF-100001
TXN-100001
```

Internal database primary keys can remain implementation details.
