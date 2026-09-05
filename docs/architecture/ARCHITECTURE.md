# FINCORE Architecture

## Target architecture

The target architecture is shown in the root README.

## Architectural principle

Start as a modular monolith:

```text
Controller
   ↓
Application/Service
   ↓
Domain
   ↓
Repository
   ↓
PostgreSQL
```

Then introduce infrastructure only when a concrete problem justifies it:

```text
Redis → caching/idempotency/rate limiting/locks
Kafka → asynchronous integration and event-driven workflows
Microservices → independent scaling/deployment and bounded contexts
```

## Core invariants

1. Money is represented with `BigDecimal` plus explicit currency.
2. Payment state transitions must be explicit and validated.
3. Mutation APIs progressively become idempotent.
4. Database constraints are part of correctness.
5. External providers are isolated behind adapters.
6. Events must be safe to process more than once.
7. Auditability is a first-class requirement.
