# FINCORE — Development Master Plan

> **Project:** Financial Transaction & Payment Platform  
> **Short name:** FINCORE  
> **Repository:** `financial-transaction-payment-platform`  
> **Base package:** `com.nazir.financialtransactionpaymentplatform`  
> **Architecture:** Modular Monolith → Event-Driven → Microservices  
> **Primary stack:** Java 21, Spring Boot 3.5.5, Spring Data JPA, Hibernate, PostgreSQL, Docker  
> **Purpose:** Long-running fintech/backend/system-design learning project — not a CRUD demo.

---

# 1. Project Vision

FINCORE is being developed as a realistic financial transaction and payment platform.

The project is intentionally developed in stages so that every stage teaches a production-grade backend concept:

```text
Domain Modeling
      ↓
REST APIs
      ↓
Database Transactions
      ↓
Concurrency
      ↓
Idempotency
      ↓
Financial Consistency
      ↓
Security
      ↓
Distributed Events
      ↓
Resilience
      ↓
Observability
      ↓
Microservices
      ↓
Production Deployment
```

The goal is not to implement every technology immediately.

The goal is to understand **why each technology is needed, what problem it solves, and what trade-offs it introduces.**

---

# 2. Current Technology Stack

## Backend

- Java 21
- Spring Boot 3.5.5
- Spring Web
- Spring Data JPA
- Hibernate
- Jakarta Validation
- Lombok
- Spring Transaction Management

## Database

- PostgreSQL
- Docker
- JPA/Hibernate
- Database constraints
- Pessimistic locking

## Frontend

A lightweight static UI is available under:

```text
src/main/resources/static/
```

Current UI areas:

```text
Dashboard
Merchants
Customers
Accounts
Orders
Payments
Transactions
Ledger
API Console
```

Concurrency UI is intentionally deferred.

## Planned infrastructure

```text
Redis
Kafka
Testcontainers
Docker
Spring Security
OpenAPI / Swagger
Micrometer / Actuator
Distributed tracing
CI/CD
```

---

# 3. Core Business Model

FINCORE currently models this financial flow:

```text
Customer
   ↓
Order
   ↓
Payment
   ↓
Transaction
   ↓
Ledger Entry
   ↓
Merchant Account
   ↓
Balance
```

For a successful payment of ₹1500:

```text
Payment ₹1500 SUCCESS
        ↓
Transaction ₹1500 SUCCESS
        ↓
Ledger CREDIT ₹1500
        ↓
Merchant Account
₹0 → ₹1500
```

For a successful refund of ₹500:

```text
Refund ₹500 SUCCESS
        ↓
Refund Transaction ₹500
        ↓
Ledger DEBIT ₹500
        ↓
Merchant Account
₹1500 → ₹1000
```

---

# 4. High-Level Architecture Evolution

## Phase 0 — Foundation

```text
Client
  ↓
Spring Boot
  ↓
PostgreSQL
```

Focus:

- project setup
- configuration
- health API
- PostgreSQL
- package conventions
- common exceptions
- standard API response

---

## Phase 1 — Core Domains

```text
Client
  ↓
REST Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

Domains:

```text
Merchant
Customer
Order
Payment
Account
```

---

## Phase 2 — Financial Core

```text
Order
  ↓
Payment
  ↓
Payment Processing
  ↓
Transaction
  ↓
Ledger
  ↓
Merchant Account
```

Focus:

- payment lifecycle
- transaction state
- ledger consistency
- account balance
- transactional boundaries

---

## Phase 3 — Reliability

```text
API Request
    ↓
Validation
    ↓
Idempotency
    ↓
Concurrency Control
    ↓
Database Transaction
    ↓
Financial Operation
```

Focus:

- idempotency
- duplicate protection
- pessimistic locking
- race conditions
- retries
- concurrent requests
- failure handling

---

## Phase 4 — Refunds & Financial Recovery

```text
Successful Payment
        ↓
Refund Request
        ↓
Refund Validation
        ↓
Refund Transaction
        ↓
Ledger DEBIT
        ↓
Merchant Balance
```

Focus:

- full refunds
- partial refunds
- cumulative refund limits
- refund idempotency
- concurrent refunds
- financial rollback/recovery

---

## Phase 5 — Security & External Integration

```text
Client
  ↓
Authentication
  ↓
Authorization
  ↓
API
  ↓
Provider / Webhook
```

Focus:

- JWT
- roles
- authentication
- authorization
- webhook signature verification
- webhook idempotency

---

## Phase 6 — Distributed Architecture

```text
Payment Service
      ↓
    Kafka
      ↓
 ┌────┼─────────────┐
 ↓    ↓             ↓
Fraud Webhook   Notification
              ↓
           Analytics
```

Focus:

- Kafka
- events
- consumer groups
- retries
- DLQ
- outbox pattern
- eventual consistency

---

## Phase 7 — Production Engineering

Focus:

- Redis
- caching
- rate limiting
- resilience
- metrics
- tracing
- structured logging
- correlation IDs
- Docker
- CI/CD
- Testcontainers
- graceful shutdown

---

## Phase 8 — Microservices

Target services:

```text
api-gateway
merchant-service
customer-service
order-service
payment-service
refund-service
webhook-service
notification-service
fraud-service
analytics-service
```

Important rule:

> Do not split the application into microservices until the modular-monolith boundaries are understood.

---

# 5. Current Implementation Status

## Foundation

- [x] Maven project
- [x] Java 21
- [x] Spring Boot application
- [x] PostgreSQL
- [x] Docker database setup
- [x] Application configuration
- [x] Health API
- [x] Common exception hierarchy
- [x] Global exception handler
- [x] Standard API response

## Core Business Domains

- [x] Merchant
- [x] Customer
- [x] Order
- [x] Payment
- [x] Account
- [x] Transaction
- [x] Ledger

## Payment Reliability

- [x] Payment processing
- [x] Payment lifecycle hardening
- [x] Transaction state transitions
- [x] Idempotency
- [x] Concurrent same-payment processing
- [x] Concurrent different-payment processing
- [x] Pessimistic account locking
- [x] Database uniqueness protection
- [x] Concurrency testing

## UI

- [x] Dashboard
- [x] Merchant UI
- [x] Customer UI
- [x] Account UI
- [x] Order UI
- [x] Payment UI
- [x] Transaction UI
- [x] Ledger UI
- [x] API Console
- [ ] Concurrency UI

## Next

- [ ] Refund system
- [ ] Refund idempotency
- [ ] Refund concurrency
- [ ] Financial failure / rollback handling
- [ ] Database indexes and constraints review
- [ ] Spring Security
- [ ] Authorization / roles
- [ ] Swagger / OpenAPI
- [ ] Unit testing
- [ ] Integration testing
- [ ] Testcontainers
- [ ] Redis
- [ ] Kafka
- [ ] Outbox pattern
- [ ] Retry / DLQ
- [ ] Webhooks
- [ ] Observability
- [ ] Docker production configuration
- [ ] CI/CD
- [ ] Microservices
- [ ] Fraud / risk
- [ ] Analytics / AI

---

# 6. Completed Financial Flow

The current successful payment flow is:

```text
Customer
   ↓
Order CREATED
   ↓
Payment PENDING
   ↓
Payment PROCESSING
   ↓
Payment SUCCESS
   ↓
Transaction SUCCESS
   ↓
Ledger CREDIT
   ↓
Merchant Account Balance Updated
```

The system protects the financial operation using:

```text
Idempotency
     +
Database Unique Constraints
     +
Pessimistic Locking
     +
Transactional Boundaries
```

---

# 7. Completed Concurrency Model

For two different payments belonging to the same merchant:

```text
Payment A ₹1500 ──┐
                  ├── Merchant Account
Payment B ₹2000 ──┘
```

Expected:

```text
Final Balance = ₹3500
```

The account is locked at the database level before balance modification.

Concept:

```text
Thread A
   ↓
SELECT ... FOR UPDATE
   ↓
Balance = 0
   ↓
Balance = 1500
   ↓
COMMIT

Thread B
   ↓
waits for lock
   ↓
reads Balance = 1500
   ↓
Balance = 3500
   ↓
COMMIT
```

This prevents lost updates.

---

# 8. Payment Idempotency

Idempotency protects against client retries and duplicate API requests.

Example:

```http
POST /api/v1/payments/{paymentId}/process
Idempotency-Key: abc-123
```

First request:

```text
Key not found
    ↓
Process payment
    ↓
Persist result
```

Retry:

```text
Same key
   ↓
Existing request/result
   ↓
Do not execute financial operation again
```

Important distinction:

```text
Idempotency
    =
same logical request should not execute twice
```

while:

```text
Concurrency control
    =
multiple simultaneous requests must not corrupt state
```

FINCORE uses both.

---

# 9. Payment Lifecycle

Current payment lifecycle:

```text
PENDING
   ↓
PROCESSING
   ↓
SUCCESS
```

or:

```text
PENDING
   ↓
PROCESSING
   ↓
FAILED
```

Valid transitions must be enforced in the service layer.

Invalid transitions must never silently succeed.

Examples:

```text
SUCCESS → PROCESSING   ❌
SUCCESS → FAILED       ❌
FAILED  → SUCCESS      ❌
```

The lifecycle is now treated as a business state machine rather than a free-form status field.

---

# 10. NEXT — Refund System

The next major development milestone is:

> **Refund Management**

This is the next business capability because the payment core is now stable enough to support money flowing in the opposite direction.

---

## 10.1 Refund business flow

```text
PAYMENT SUCCESS
      ↓
Refund Request
      ↓
Validate Payment
      ↓
Validate Refund Amount
      ↓
Check Refundable Amount
      ↓
Create Refund
      ↓
PROCESSING
      ↓
Refund Transaction
      ↓
Ledger DEBIT
      ↓
Merchant Account Balance
      ↓
SUCCESS
```

---

## 10.2 Full refund

Payment:

```text
₹1500
```

Refund:

```text
₹1500
```

Result:

```text
Refunded = ₹1500
Remaining refundable amount = ₹0
```

---

## 10.3 Partial refund

Payment:

```text
₹1500
```

Refund:

```text
₹500
```

Result:

```text
Refunded = ₹500
Remaining refundable amount = ₹1000
```

Another:

```text
Refund ₹700
```

Result:

```text
Total refunded = ₹1200
Remaining refundable = ₹300
```

---

## 10.4 Refund validation

The service must enforce:

```text
Payment must exist
Payment must be SUCCESS
Refund amount must be > 0
Refund amount must not exceed refundable amount
Currency must match
Payment must not be permanently non-refundable
```

Core formula:

```text
refundableAmount =
    paymentAmount - successfulRefundAmount
```

Example:

```text
Payment amount          = ₹1500
Successful refunds      = ₹400
-------------------------------
Refundable amount       = ₹1100
```

---

# 11. Refund Domain Model

Recommended package:

```text
refund/
├── controller/
│   └── RefundController.java
│
├── dto/
│   ├── CreateRefundRequest.java
│   └── RefundResponse.java
│
├── entity/
│   └── Refund.java
│
├── repository/
│   └── RefundRepository.java
│
├── service/
│   └── RefundService.java
│
└── enum/
    └── RefundStatus.java
```

---

# 12. Refund Entity

Conceptual model:

```text
Refund
 ├── id
 ├── paymentId
 ├── amount
 ├── currency
 ├── status
 ├── reason
 ├── idempotencyKey
 ├── createdAt
 └── updatedAt
```

Use:

```java
BigDecimal
```

for monetary amounts.

Never use:

```java
double
float
```

for financial calculations.

---

# 13. Refund Status

Recommended states:

```text
PENDING
PROCESSING
SUCCESS
FAILED
```

Valid transitions:

```text
PENDING
   ↓
PROCESSING
   ↓
SUCCESS
```

or:

```text
PENDING
   ↓
PROCESSING
   ↓
FAILED
```

---

# 14. Refund API

## Create refund

```http
POST /api/v1/payments/{paymentId}/refunds
Idempotency-Key: refund-unique-key
Content-Type: application/json
```

Request:

```json
{
  "amount": 500.00,
  "reason": "CUSTOMER_REQUEST"
}
```

Response:

```json
{
  "success": true,
  "message": "Refund created successfully",
  "data": {
    "refundId": "...",
    "paymentId": "...",
    "amount": 500.00,
    "status": "PENDING"
  },
  "timestamp": "2026-09-20T..."
}
```

---

## Get refund

```http
GET /api/v1/refunds/{refundId}
```

---

## Get refunds for payment

```http
GET /api/v1/payments/{paymentId}/refunds
```

---

## Get all refunds

```http
GET /api/v1/refunds
```

---

# 15. Refund Concurrency

This is a critical financial test.

Payment:

```text
₹1500
```

Two concurrent refund requests:

```text
Request A → ₹1000
Request B → ₹1000
```

The system must never produce:

```text
Total refunded = ₹2000 ❌
```

Correct behavior:

```text
Total successful refunds <= ₹1500
```

Possible result:

```text
Request A → SUCCESS ₹1000
Request B → FAILED
Reason: Refundable amount is ₹500
```

The exact winner is determined by transaction/lock timing, not by application assumptions.

---

# 16. Refund Idempotency

Two requests:

```text
Request A
Idempotency-Key: REF-123

Request B
Idempotency-Key: REF-123
```

must represent the same logical operation.

Expected:

```text
One refund
One financial operation
Same logical result returned to retry
```

Database protection should complement application checks.

---

# 17. Refund Transaction + Ledger

Successful refund:

```text
Refund SUCCESS
      ↓
Transaction
      ↓
TransactionType = REFUND
      ↓
LedgerEntry
      ↓
LedgerType = DEBIT
      ↓
Merchant Account balance decreases
```

Example:

```text
Before refund:
Account = ₹1500

Refund = ₹500

Ledger:
DEBIT ₹500

After refund:
Account = ₹1000
```

The refund and its financial effects must be designed around a clear transaction boundary.

---

# 18. Refund Testing Strategy

Every refund feature should eventually have:

```text
Unit Test
   ↓
Controller Test
   ↓
Repository Test
   ↓
Integration Test
   ↓
Concurrency Test
   ↓
Failure Test
```

Critical scenarios:

```text
Successful full refund
Successful partial refund
Refund amount > payment amount
Refund amount > remaining refundable amount
Refund on PENDING payment
Refund on FAILED payment
Duplicate refund request
Concurrent refund requests
Database failure
Ledger failure
Retry after failure
```

---

# 19. After Refund — Financial Failure Handling

Once refunds work, the next milestone is:

> **Financial Failure / Rollback Handling**

We need to verify scenarios such as:

```text
Payment SUCCESS
     ↓
Transaction SUCCESS
     ↓
Ledger operation fails
```

We must prevent inconsistent states such as:

```text
Payment = SUCCESS
Transaction = SUCCESS
Ledger = missing
Account balance = incorrect
```

Similarly:

```text
Refund = SUCCESS
Transaction = SUCCESS
Ledger = missing
```

must not be possible.

Study:

- `@Transactional`
- transaction boundaries
- rollback behavior
- checked vs unchecked exceptions
- `REQUIRES_NEW`
- propagation
- isolation
- database constraints
- partial failure
- compensation

---

# 20. Database Optimization

After the financial workflows are stable, review:

## Constraints

```text
UNIQUE
NOT NULL
CHECK
FOREIGN KEY
```

## Important indexes

Examples:

```text
merchant.email
customer.email
order.order_number
order.merchant_id
order.customer_id
payment.order_id
transaction.payment_id
ledger_entry.account_id
ledger_entry.transaction_id
refund.payment_id
idempotency_records.key
```

Indexes should be added based on actual query patterns.

---

# 21. Security

Next major infrastructure milestone:

```text
Authentication
      ↓
Authorization
      ↓
Business API
```

Implement:

```text
Spring Security
JWT
Users
Roles
Password hashing
Authentication
Authorization
```

Example roles:

```text
ADMIN
MERCHANT
CUSTOMER
OPERATIONS
```

Never store raw passwords.

---

# 22. Webhooks

Payment providers commonly communicate through webhooks.

Flow:

```text
Provider
   ↓
Webhook
   ↓
Signature Verification
   ↓
Event Idempotency
   ↓
Validate Event
   ↓
Update Payment
   ↓
Publish Domain Event
```

API:

```http
POST /api/v1/webhooks/providers/{provider}
X-Signature: <signature>
```

Webhook event should contain a unique event ID.

Duplicate webhook:

```text
Event EVT-123
    ↓
Already processed
    ↓
Do not apply financial effect twice
```

---

# 23. Redis

Redis should be introduced only when its use case is clear.

Potential uses:

```text
Caching
Rate limiting
Distributed coordination
Hot data
Short-lived state
```

Example cache keys:

```text
merchant:{merchantId}
payment:{paymentId}
```

Study:

```text
cache-aside
TTL
cache invalidation
stale data
cache stampede
```

Do not make Redis the source of truth for financial balances.

PostgreSQL remains authoritative for financial state.

---

# 24. Kafka

After the transactional core is stable:

```text
Payment Service
      ↓
Kafka
      ↓
 ┌────┼─────────────┐
 ↓    ↓             ↓
Fraud Webhook   Notification
      ↓
  Analytics
```

Study:

```text
Topic
Partition
Partition Key
Offset
Consumer Group
At-least-once delivery
Ordering
Retry
DLQ
Consumer idempotency
```

---

# 25. Outbox Pattern

Do not directly rely on:

```text
Database commit
      +
Kafka publish
```

as two unrelated operations.

Potential failure:

```text
DB COMMIT ✓
Kafka PUBLISH ✗
```

Now the database says the payment succeeded but the event was never published.

Outbox pattern:

```text
Business Transaction
       ↓
Database
 ┌───────────────┐
 │ Payment       │
 │ Transaction   │
 │ Ledger        │
 │ Outbox Event  │
 └───────────────┘
       ↓
Commit
       ↓
Outbox Publisher
       ↓
Kafka
```

This is a major system-design interview concept.

---

# 26. Microservices

Only after the modular monolith is understood.

Target:

```text
                    API Gateway
                         |
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
 Merchant            Customer            Order
 Service             Service             Service
                         |
                         ↓
                   Payment Service
                         |
              ┌──────────┼──────────┐
              ↓          ↓          ↓
           Refund      Fraud     Webhook
           Service     Service    Service
              |
              ↓
        Notification
              |
              ↓
          Analytics
```

Possible communication:

```text
REST
gRPC
Kafka
```

Choose based on the use case rather than using one technology everywhere.

---

# 27. Production Engineering

Implement:

```text
Timeouts
Retries
Circuit Breaker
Bulkhead
Rate Limiting
Load Balancing
Health Checks
Readiness
Liveness
Graceful Shutdown
```

Observability:

```text
Structured Logging
Correlation ID
Metrics
Distributed Tracing
Actuator
```

---

# 28. Testing Strategy

Every important feature should have:

## Unit Test

Test business logic in isolation.

## Controller/API Test

Test:

```text
HTTP request
HTTP status
request validation
response contract
```

## Repository Test

Test:

```text
JPA query
database constraint
locking behavior
```

## Integration Test

Test:

```text
Controller
 → Service
 → Repository
 → PostgreSQL
```

## Concurrency Test

Test:

```text
multiple requests
same resource
same time
```

## Failure Test

Test:

```text
database failure
provider failure
timeout
duplicate request
duplicate event
```

---

# 29. Testcontainers

Replace local assumptions in integration tests with:

```text
JUnit
  ↓
Testcontainers
  ↓
PostgreSQL
  ↓
Spring Boot
```

Later:

```text
PostgreSQL Container
Redis Container
Kafka Container
```

This gives reproducible integration tests.

---

# 30. Observability

Introduce:

```text
Spring Boot Actuator
Micrometer
Prometheus
Grafana
OpenTelemetry
```

Track:

```text
payment.success.count
payment.failure.count
payment.processing.time
refund.success.count
refund.failure.count
api.request.count
api.request.latency
database.connection.pool
kafka.consumer.lag
```

---

# 31. Fraud / Risk Engine

Later:

```text
Payment
   ↓
Risk Engine
   ↓
Risk Score
   ↓
┌────────┬──────────┬─────────┐
LOW      MEDIUM      HIGH
 ↓         ↓           ↓
Process  Verify     Reject/
                    Review
```

Potential factors:

```text
Amount
Velocity
Failed attempts
Merchant risk
Payment method
Device
Location
Historical behavior
```

This should be treated as a separate business capability, not mixed directly into payment CRUD logic.

---

# 32. Analytics / AI

Later capabilities:

```text
Transaction Dashboard
Success Rate
Failure Rate
Payment Method Distribution
Merchant Statistics
Refund Analytics
Anomaly Detection
Risk Insights
```

AI should be introduced only where it provides a meaningful use case.

---

# 33. Recommended Package Structure

Current modular monolith:

```text
src/main/java/com/nazir/financialtransactionpaymentplatform/

├── FinancialTransactionPaymentPlatformApplication.java
│
├── common/
│   ├── exception/
│   ├── response/
│   ├── validation/
│   └── util/
│
├── health/
│
├── merchant/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── customer/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── order/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── payment/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   ├── service/
│   ├── processor/
│   └── provider/
│
├── account/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── transaction/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── ledger/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── refund/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── idempotency/
├── webhook/
├── security/
└── audit/
```

---

# 34. Responsibility of Each Layer

| Layer | Responsibility |
|---|---|
| Controller | HTTP/API boundary |
| Request DTO | External input contract |
| Response DTO | External output contract |
| ApiResponse | Standard successful API envelope |
| Service | Business use cases |
| Entity | Persistent domain state |
| Repository | Database access |
| Processor | Payment processing abstraction |
| Provider Client | External provider integration |
| Mapper | Entity ↔ DTO conversion |
| Exception | Business/technical error representation |
| Validator | Input/business validation |
| Event | Asynchronous integration message |
| Consumer | Event handling |
| Idempotency Service | Duplicate request protection |
| Webhook Verifier | Authenticity verification |
| Risk Engine | Fraud/risk decision |
| Audit Service | Business activity history |

---

# 35. Database Evolution

## Current core

```text
merchants
customers
orders
payments
accounts
transactions
ledger_entries
```

## Reliability

```text
idempotency_records
payment_attempts
```

## Refund

```text
refunds
```

## Security

```text
users
roles
user_roles
```

## Webhooks

```text
webhook_events
```

## Risk

```text
risk_assessments
fraud_rules
fraud_events
```

## Events

```text
outbox_events
```

Use database migrations for production schema evolution.

Recommended future migration tool:

```text
Flyway
```

---

# 36. Definition of Done

A feature is not complete merely because the endpoint works.

For each major feature:

- [ ] API contract documented
- [ ] Request validation
- [ ] Business validation
- [ ] Correct HTTP status codes
- [ ] Standard success response
- [ ] Exception handling
- [ ] Database constraints reviewed
- [ ] Indexes reviewed
- [ ] Transaction boundary reviewed
- [ ] Unit tests
- [ ] Integration tests
- [ ] Concurrency test where applicable
- [ ] Failure scenarios tested
- [ ] Logging added
- [ ] UI/API Console verified
- [ ] Documentation updated
- [ ] README progress updated
- [ ] Git commit created

---

# 37. Interview Preparation

Each phase should produce interview knowledge, not just code.

## Core backend

- Why DTOs?
- Entity vs DTO?
- Why service layer?
- Why repository abstraction?
- JPA lifecycle?
- Lazy vs eager loading?
- N+1 problem?
- Optimistic vs pessimistic locking?

## Transactions

- What is ACID?
- What is transaction isolation?
- What happens during rollback?
- What is propagation?
- When should `REQUIRES_NEW` be used?
- What happens when two requests update the same row?

## Payment

- Why is payment a separate domain from order?
- How do you model payment states?
- How do you prevent invalid transitions?
- How do you integrate payment providers?
- Strategy vs Adapter?

## Idempotency

- What is an idempotent API?
- Why can retries create duplicate payments?
- Why is application-level checking alone insufficient?
- How does a unique constraint help?
- How do you handle concurrent idempotency requests?

## Refunds

- How do you calculate refundable amount?
- How do you prevent over-refunding?
- How do you handle concurrent refunds?
- How do you make refunds idempotent?
- How do you maintain ledger consistency?

## Kafka

- Kafka vs REST?
- What is a partition?
- What is a consumer group?
- What is at-least-once delivery?
- How do you handle duplicate events?
- What is DLQ?
- What is the Outbox Pattern?

## Distributed systems

- How do you handle service failure?
- Timeout vs retry?
- Circuit breaker?
- Eventual consistency?
- Distributed tracing?
- Correlation IDs?

---

# 38. Development Rules

## Rule 1 — Build incrementally

Do not implement ten technologies at once.

Preferred:

```text
Feature
 ↓
Understand
 ↓
Implement
 ↓
Test
 ↓
Break it intentionally
 ↓
Fix it
 ↓
Document
```

## Rule 2 — Financial state is authoritative in PostgreSQL

Redis, Kafka and caches must not become the source of truth for financial balances.

## Rule 3 — Protect money with database guarantees

Do not rely only on Java `if` checks.

Use:

```text
Transactions
Constraints
Locks
Unique indexes
```

## Rule 4 — Test concurrency explicitly

A normal unit test cannot prove concurrent correctness.

## Rule 5 — Keep business logic out of controllers

Controller:

```text
HTTP → DTO → Service
```

Service:

```text
Business rules
```

Repository:

```text
Database
```

## Rule 6 — Do not introduce microservices prematurely

First understand the domain boundaries inside the modular monolith.

---

# 39. Current Roadmap

```text
FOUNDATION
    ↓
Merchant
    ↓
Customer
    ↓
Order
    ↓
Payment
    ↓
Account
    ↓
Transaction
    ↓
Ledger
    ↓
Payment Processing
    ↓
Payment Lifecycle
    ↓
Global Exceptions
    ↓
Standard API Response
    ↓
Idempotency
    ↓
Concurrency
    ↓
★ REFUND SYSTEM ★
    ↓
Refund Idempotency
    ↓
Refund Concurrency
    ↓
Financial Failure / Rollback
    ↓
DB Constraints + Indexes
    ↓
Spring Security
    ↓
Authorization
    ↓
Swagger / OpenAPI
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Testcontainers
    ↓
Webhooks
    ↓
Redis
    ↓
Kafka
    ↓
Outbox
    ↓
Retry + DLQ
    ↓
Observability
    ↓
Docker
    ↓
CI/CD
    ↓
Microservices
    ↓
Fraud / Risk
    ↓
Analytics / AI
```

---

# 40. Immediate Development Target

## NEXT FEATURE: REFUND MANAGEMENT

Build in this order:

```text
1. RefundStatus
       ↓
2. Refund Entity
       ↓
3. CreateRefundRequest
       ↓
4. RefundResponse
       ↓
5. RefundRepository
       ↓
6. RefundService
       ↓
7. RefundController
       ↓
8. Refund validation
       ↓
9. Refund transaction
       ↓
10. Ledger DEBIT
       ↓
11. Account balance update
       ↓
12. Refund idempotency
       ↓
13. Concurrent refund protection
       ↓
14. Integration tests
       ↓
15. Failure tests
```

The first API will be:

```http
POST /api/v1/payments/{paymentId}/refunds
```

Example:

```json
{
  "amount": 500.00,
  "reason": "CUSTOMER_REQUEST"
}
```

The implementation should preserve all previously completed guarantees:

```text
Validation
+
Standard API Response
+
Exception Handling
+
Transaction Safety
+
Idempotency
+
Concurrency Safety
+
Ledger Consistency
```

---

# 41. Final Target Architecture

The final learning architecture is:

```text
                         ┌─────────────────┐
                         │   API Gateway   │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        Merchant Service    Customer Service     Order Service
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                         Payment Service
                                  │
              ┌───────────────────┼───────────────────┐
              ▼                   ▼                   ▼
        Refund Service       Risk/Fraud          Webhook Service
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                                Kafka
                                  │
                ┌─────────────────┼─────────────────┐
                ▼                 ▼                 ▼
          Notification        Analytics          Audit
                │
                ▼
              Redis
                │
                ▼
            PostgreSQL
```

The architecture should evolve toward this target rather than being built in full on day one.

---

# 42. Current Status Summary

```text
FINCORE
│
├── Core Domain                 ✅
├── REST APIs                   ✅
├── PostgreSQL                  ✅
├── JPA/Hibernate               ✅
├── Account + Ledger            ✅
├── Payment Processing          ✅
├── Payment Lifecycle            ✅
├── Global Exceptions           ✅
├── Standard API Response       ✅
├── Idempotency                 ✅
├── Concurrent Processing       ✅
├── Static Management UI        ✅
│
├── Refund System               ⏭ NEXT
├── Refund Concurrency          ⏳
├── Financial Rollback          ⏳
├── DB Optimization             ⏳
├── Security                    ⏳
├── Webhooks                    ⏳
├── Redis                       ⏳
├── Kafka                       ⏳
├── Outbox                      ⏳
├── Testing                     ⏳
├── Observability               ⏳
├── Microservices               ⏳
├── Fraud/Risk                  ⏳
└── Analytics/AI               ⏳
```

**Next coding milestone: Refund Management.**
