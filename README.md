# Financial Transaction & Payment Platform

A production-oriented learning project for building a financial transaction and payment platform from scratch with Java, Spring Boot, PostgreSQL, Redis, Kafka, microservices, security, fraud/risk, webhooks, notifications, analytics, testing, and observability.

> **Project short name:** FINCORE  
> **Repository:** `financial-transaction-payment-platform`  
> **Base package:** `com.nazir.financialtransactionpaymentplatform`

## Architecture

```text
                         ┌──────────────────────┐
                         │       FINCORE        │
                         │                      │
                         │ Financial Transaction│
                         │ & Payment Platform   │
                         └──────────┬───────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │       CLIENTS        │
                         │                      │
                         │ Web / Mobile / API   │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │     API GATEWAY      │
                         │                      │
                         │ Auth / Rate Limit    │
                         │ Routing / Logging    │
                         └──────────┬───────────┘
                                    ↓
              ┌─────────────────────┼─────────────────────┐
              ↓                     ↓                     ↓
     ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
     │ Merchant       │    │ Order          │    │ Customer       │
     │ Service        │    │ Service        │    │ Service        │
     └────────────────┘    └────────────────┘    └────────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ↓
                         ┌──────────────────────┐
                         │   PAYMENT SERVICE    │
                         │                      │
                         │ Payment API          │
                         │ State Machine        │
                         │ Payment Processing   │
                         │ Idempotency          │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 ↓                  ↓                  ↓
        ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
        │  PostgreSQL    │  │     Redis      │  │   PROVIDERS    │
        │                │  │                │  │                │
        │ Payments       │  │ Cache          │  │ UPI            │
        │ Orders         │  │ Idempotency    │  │ Card           │
        │ Transactions   │  │ Rate Limit     │  │ Net Banking    │
        │ Refunds        │  │ Distributed    │  │ Wallet         │
        │ Audit Logs     │  │ Lock           │  │                │
        └────────────────┘  └────────────────┘  └────────────────┘
                                    │
                                    ↓
                         ┌──────────────────────┐
                         │        KAFKA         │
                         │                      │
                         │ payment.events      │
                         │ refund.events        │
                         │ fraud.events         │
                         └──────────┬───────────┘
                                    ↓
          ┌─────────────────────────┼─────────────────────────┐
          ↓                         ↓                         ↓
 ┌────────────────┐       ┌────────────────┐       ┌────────────────┐
 │ Fraud Service  │       │ Webhook Service│       │ Notification   │
 │                │       │                │       │ Service        │
 │ Risk Score     │       │ Merchant Hook  │       │ Email / SMS    │
 │ Fraud Check    │       │ Signature      │       │ Push           │
 └───────┬────────┘       └────────────────┘       └────────────────┘
         │
         ↓
 ┌────────────────────┐
 │ Analytics Service  │
 │                    │
 │ Reports            │
 │ Metrics            │
 │ Dashboard          │
 │ AI / Risk Analysis │
 └────────────────────┘
```

## Development philosophy

We will **not** start with microservices. The system evolves deliberately:

```text
V0  Foundation
 ↓
V1  Merchant + Customer
 ↓
V2  Order + Payment
 ↓
V3  Payment Processing
 ↓
V4  Transactions + Idempotency + Concurrency
 ↓
V5  Refunds + Ledger + Audit
 ↓
V6  Security + Webhooks
 ↓
V7  Redis + Performance
 ↓
V8  Kafka + Event Driven
 ↓
V9  Microservices
 ↓
V10 Reliability + Observability + Production
 ↓
V11 Fraud + Risk Engine
 ↓
V12 Analytics + AI
```

Each phase follows:

**Business problem → HLD → database design → API contract → implementation → tests → failure scenario → fix → refactor → interview questions.**

## Initial technology stack

- Java 21
- Spring Boot
- Spring Web MVC
- Spring Data JPA / Hibernate
- PostgreSQL
- Maven
- Docker / Docker Compose
- JUnit 5 / Mockito
- Redis — introduced in V7
- Kafka — introduced in V8
- Spring Security — introduced in V6
- Testcontainers — introduced as integration testing grows

## First milestone

The first working slice is intentionally small:

```text
GET /api/v1/health
        ↓
HealthController
        ↓
HTTP 200
```

Then V0 evolves into domain and database foundations.

## Local setup

### Prerequisites

- JDK 21
- Maven 3.9+
- Docker Desktop / Docker Engine

### Start PostgreSQL

```bash
docker compose up -d postgres
```

### Run the application

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
mvnw.cmd spring-boot:run
```

### Verify

```bash
curl http://localhost:8080/api/v1/health
```

Expected:

```json
{
  "status": "UP",
  "service": "financial-transaction-payment-platform"
}
```

## Git workflow

Recommended branches:

```text
main
 └── develop
      ├── feature/v0-foundation
      ├── feature/v1-merchant-customer
      ├── feature/v2-order-payment
      └── ...
```

Commit examples:

```text
feat: add payment creation api
feat: add merchant validation
test: add payment idempotency tests
refactor: extract payment provider strategy
docs: update v4 concurrency design
```

## Documentation

- `DEVELOPMENT.md` — master development plan, APIs, payloads, classes, database, decisions, and interview topics.
- `docs/architecture/` — architecture decisions and diagrams.
- `docs/api/` — API contracts as the project grows.
- `docs/database/` — schema and ERD notes.
- `docs/adr/` — Architecture Decision Records.

## Important learning rule

Do not blindly copy code. For every important component, answer:

1. What problem does it solve?
2. Why is it needed?
3. What happens without it?
4. What failure can still happen?
5. How would this behave under concurrent requests?
6. What changes when the application becomes distributed?
