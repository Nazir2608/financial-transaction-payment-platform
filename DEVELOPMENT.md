# FINCORE — Development Master Plan

## 1. Project identity

**Project:** Financial Transaction & Payment Platform  
**Short name:** FINCORE  
**Repository:** `financial-transaction-payment-platform`  
**Base package:** `com.nazir.financialtransactionpaymentplatform`

This project is designed as a long-running backend/system-design learning project, not a CRUD demo.

---

# 2. Master business flow

```text
Customer
  ↓
Merchant
  ↓
Create Order
  ↓
Create Payment
  ↓
Authentication
  ↓
Validation
  ↓
Idempotency Check
  ↓
Payment Created
  ↓
Payment Processing
  ↓
Payment Provider
  ↓
Verify Payment
  ↓
SUCCESS / FAILED
  ↓
Database Transaction
  ↓
Payment Event
  ↓
Kafka
  ↓
Fraud Check
  ↓
Webhook
  ↓
Notification
  ↓
Analytics
  ↓
Audit Log
  ↓
Merchant Dashboard
```

Refund flow:

```text
SUCCESS PAYMENT
      ↓
Refund Request
      ↓
Authentication
      ↓
Validate
      ↓
Idempotency Check
      ↓
Refund Transaction
      ↓
Payment Provider
      ↓
Verify Refund
      ↓
REFUNDED / FAILED
      ↓
Kafka
      ↓
Webhook
      ↓
Notification
      ↓
Analytics
      ↓
Audit Log
```

---

# 3. HLD evolution

## V0 — Foundation

```text
Client
  ↓
Spring Boot
  ↓
PostgreSQL
```

Goal: establish the application, conventions, configuration, health endpoint, database connectivity, and documentation.

## V1 — Merchant + Customer

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
- Merchant
- Customer

## V2 — Order + Payment

```text
Customer
  ↓
Order
  ↓
Payment
  ↓
Payment Status = CREATED
```

## V3 — Payment Processing

```text
Payment
  ↓
Validation
  ↓
Payment Processor
  ↓
Provider Adapter
  ↓
Provider
  ↓
SUCCESS / FAILED
```

Introduce Strategy/Adapter patterns and payment state transitions.

## V4 — Transactions + Idempotency + Concurrency

```text
Request
  ↓
Idempotency-Key
  ↓
Duplicate check
  ↓
Transaction
  ↓
Payment update
  ↓
Commit
```

Study:
- ACID
- transaction boundaries
- isolation levels
- unique constraints
- optimistic locking
- pessimistic locking
- race conditions
- retries

## V5 — Refund + Ledger + Audit

```text
SUCCESS PAYMENT
  ↓
Refund validation
  ↓
Refund transaction
  ↓
Provider
  ↓
Refund result
  ↓
Ledger / transaction record
  ↓
Audit
```

## V6 — Security + Webhooks

```text
Client
  ↓
Authentication
  ↓
Authorization
  ↓
API
```

Webhook:

```text
Provider
  ↓
Webhook
  ↓
Signature verification
  ↓
Idempotency
  ↓
Event processing
```

## V7 — Redis

Use Redis for:
- cache
- idempotency records where appropriate
- rate limiting
- distributed locks
- hot merchant/payment lookups

## V8 — Kafka

```text
Payment Service
  ↓
Kafka
  ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓
Fraud        Webhook      Notification
Consumer     Consumer      Consumer
                     ↓
                 Analytics
```

Study:
- topic
- partition
- key
- offset
- consumer group
- retries
- dead-letter topic
- at-least-once delivery
- ordering
- consumer idempotency
- outbox pattern

## V9 — Microservices

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

Do not split services until the monolith boundaries are understood.

## V10 — Production Engineering

Add:
- load balancing
- retries
- timeouts
- circuit breaker
- bulkhead
- rate limiting
- health checks
- structured logging
- correlation IDs
- metrics
- tracing
- Docker
- CI/CD
- Testcontainers
- graceful shutdown

## V11 — Fraud + Risk

```text
Payment
  ↓
Risk Engine
  ↓
Risk Score
  ↓
LOW → process
MEDIUM → additional verification
HIGH → reject/review
```

Factors:
- amount
- velocity
- historical behavior
- failed attempts
- merchant risk
- device
- location
- payment method

## V12 — Analytics + AI

Build:
- transaction dashboard
- success/failure rate
- payment-method distribution
- merchant statistics
- refund analytics
- anomaly detection
- risk insights

---

# 4. Phase-wise API development

## V0 — Foundation APIs

### Health

```http
GET /api/v1/health
```

Response:

```json
{
  "status": "UP",
  "service": "financial-transaction-payment-platform"
}
```

Classes:

```text
HealthController
```

Why:
- verifies application availability
- first REST endpoint
- later becomes the basis for health/readiness concepts

---

# V1 — Merchant APIs

## Create merchant

```http
POST /api/v1/merchants
Content-Type: application/json
```

Payload:

```json
{
  "name": "Demo Store",
  "email": "merchant@example.com",
  "phone": "9876543210",
  "businessName": "Demo Store Pvt Ltd"
}
```

Response:

```json
{
  "merchantId": "MER-100001",
  "name": "Demo Store",
  "email": "merchant@example.com",
  "status": "ACTIVE",
  "createdAt": "2026-09-05T10:00:00Z"
}
```

Classes:

```text
MerchantController
MerchantService
MerchantRepository
Merchant
MerchantStatus
CreateMerchantRequest
MerchantResponse
```

Why:
- merchant owns the payment relationship
- establishes domain/entity/service/repository separation
- introduces validation and API DTOs

## Get merchant

```http
GET /api/v1/merchants/{merchantId}
```

## Update merchant

```http
PATCH /api/v1/merchants/{merchantId}
```

Payload:

```json
{
  "name": "Updated Demo Store",
  "phone": "9876543211"
}
```

---

# V1 — Customer APIs

## Create customer

```http
POST /api/v1/customers
```

Payload:

```json
{
  "name": "Nazir",
  "email": "customer@example.com",
  "phone": "9876543210"
}
```

Response:

```json
{
  "customerId": "CUS-100001",
  "name": "Nazir",
  "email": "customer@example.com",
  "status": "ACTIVE"
}
```

Classes:

```text
CustomerController
CustomerService
CustomerRepository
Customer
CustomerStatus
CreateCustomerRequest
CustomerResponse
```

---

# V2 — Order APIs

## Create order

```http
POST /api/v1/orders
```

Payload:

```json
{
  "merchantId": "MER-100001",
  "customerId": "CUS-100001",
  "amount": 1500.00,
  "currency": "INR",
  "description": "Order for electronics"
}
```

Response:

```json
{
  "orderId": "ORD-100001",
  "merchantId": "MER-100001",
  "customerId": "CUS-100001",
  "amount": 1500.00,
  "currency": "INR",
  "status": "CREATED"
}
```

Classes:

```text
OrderController
OrderService
OrderRepository
Order
OrderStatus
CreateOrderRequest
OrderResponse
Money
Currency
```

Why `Money`:
- monetary values need explicit amount/currency semantics
- avoid floating-point money calculations
- use `BigDecimal` for amount

---

# V2 — Payment Creation APIs

## Create payment

```http
POST /api/v1/payments
Idempotency-Key: 8b9f3a12-...
```

Payload:

```json
{
  "orderId": "ORD-100001",
  "amount": 1500.00,
  "currency": "INR",
  "method": "UPI"
}
```

Response:

```json
{
  "paymentId": "PAY-100001",
  "orderId": "ORD-100001",
  "amount": 1500.00,
  "currency": "INR",
  "method": "UPI",
  "status": "CREATED",
  "createdAt": "2026-09-05T10:10:00Z"
}
```

Classes:

```text
PaymentController
PaymentService
PaymentRepository
Payment
PaymentStatus
PaymentMethod
CreatePaymentRequest
PaymentResponse
```

Initial status:

```text
CREATED
```

---

# V3 — Payment Processing APIs

## Process payment

```http
POST /api/v1/payments/{paymentId}/process
```

Payload:

```json
{
  "provider": "MOCK_UPI"
}
```

Response:

```json
{
  "paymentId": "PAY-100001",
  "status": "PROCESSING"
}
```

Provider abstraction:

```text
PaymentProcessor
    ↓
UpiPaymentProcessor
CardPaymentProcessor
NetBankingPaymentProcessor
WalletPaymentProcessor
```

Provider adapter:

```text
PaymentProviderClient
    ↓
MockPaymentProviderClient
```

Why:
- Strategy pattern allows payment method-specific behavior
- Adapter isolates external provider contracts
- business logic should not depend directly on provider SDKs

## Get payment

```http
GET /api/v1/payments/{paymentId}
```

Response:

```json
{
  "paymentId": "PAY-100001",
  "orderId": "ORD-100001",
  "status": "SUCCESS",
  "amount": 1500.00,
  "currency": "INR",
  "method": "UPI"
}
```

---

# V4 — Idempotency

All mutation APIs should progressively support:

```http
Idempotency-Key: <unique-client-key>
```

Example:

```http
POST /api/v1/payments
Idempotency-Key: 01JEXAMPLEABC
```

First request:

```text
key not found
  ↓
process
  ↓
store result
```

Retry:

```text
same key
  ↓
existing result
  ↓
return same logical result
```

Classes:

```text
IdempotencyService
IdempotencyRecord
IdempotencyRepository
IdempotencyKeyValidator
```

Database rule:

```text
UNIQUE(idempotency_key)
```

Study race condition:

```text
Request A ──┐
            ├─ check key → both see "not found"
Request B ──┘
            ↓
       duplicate work
```

Then solve with database constraints and correct transaction handling.

---

# V5 — Refund APIs

## Create refund

```http
POST /api/v1/payments/{paymentId}/refunds
Idempotency-Key: refund-unique-key
```

Full refund:

```json
{
  "amount": 1500.00,
  "reason": "CUSTOMER_REQUEST"
}
```

Partial refund:

```json
{
  "amount": 500.00,
  "reason": "PARTIAL_RETURN"
}
```

Response:

```json
{
  "refundId": "REF-100001",
  "paymentId": "PAY-100001",
  "amount": 500.00,
  "status": "REFUND_PENDING"
}
```

Classes:

```text
RefundController
RefundService
RefundRepository
Refund
RefundStatus
CreateRefundRequest
RefundResponse
Transaction
TransactionType
```

Validation:
- payment must be refundable
- refund amount > 0
- cumulative refunds <= payment amount
- duplicate refund requests must be protected

---

# V5 — Transaction APIs

## Payment transaction history

```http
GET /api/v1/payments/{paymentId}/transactions
```

Response:

```json
{
  "paymentId": "PAY-100001",
  "transactions": [
    {
      "transactionId": "TXN-100001",
      "type": "PAYMENT",
      "amount": 1500.00,
      "status": "SUCCESS"
    },
    {
      "transactionId": "TXN-100002",
      "type": "REFUND",
      "amount": 500.00,
      "status": "SUCCESS"
    }
  ]
}
```

---

# V6 — Security APIs

Authentication:

```http
POST /api/v1/auth/login
```

Payload:

```json
{
  "username": "merchant-admin",
  "password": "change-me"
}
```

Response:

```json
{
  "accessToken": "<JWT>",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

Later merchant API authentication:

```http
Authorization: Bearer <token>
```

Security classes:

```text
SecurityConfig
JwtAuthenticationFilter
JwtTokenService
AuthenticationController
AuthenticationService
User
Role
```

Do not store raw passwords.

---

# V6 — Webhook APIs

## Provider webhook

```http
POST /api/v1/webhooks/providers/{provider}
X-Signature: <signature>
```

Payload:

```json
{
  "eventId": "EVT-100001",
  "eventType": "PAYMENT_SUCCESS",
  "providerPaymentId": "PROV-12345",
  "paymentId": "PAY-100001",
  "status": "SUCCESS",
  "timestamp": "2026-09-05T10:20:00Z"
}
```

Flow:

```text
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

Classes:

```text
WebhookController
WebhookService
WebhookSignatureVerifier
WebhookEvent
WebhookEventRepository
```

---

# V7 — Redis

No new business API is required just to introduce Redis.

Apply Redis to:

```text
GET /api/v1/merchants/{id}
GET /api/v1/payments/{id}
```

Possible cache:

```text
merchant:{merchantId}
payment:{paymentId}
```

Study:
- cache-aside
- TTL
- invalidation
- stale data
- cache stampede

Rate limiting can later protect APIs such as:

```text
POST /payments
POST /refunds
POST /webhooks
```

---

# V8 — Kafka Events

Domain events:

```text
payment.events
refund.events
fraud.events
```

Payment event example:

```json
{
  "eventId": "EVT-100001",
  "eventType": "PAYMENT_SUCCESS",
  "aggregateId": "PAY-100001",
  "occurredAt": "2026-09-05T10:20:00Z",
  "payload": {
    "paymentId": "PAY-100001",
    "orderId": "ORD-100001",
    "amount": 1500.00,
    "currency": "INR"
  }
}
```

Consumers:

```text
FraudEventConsumer
WebhookEventConsumer
NotificationEventConsumer
AnalyticsEventConsumer
```

---

# V9 — Microservice APIs

## Payment Service

```text
POST /payments
GET  /payments/{id}
POST /payments/{id}/process
POST /payments/{id}/refunds
GET  /payments/{id}/transactions
```

## Merchant Service

```text
POST /merchants
GET  /merchants/{id}
PATCH /merchants/{id}
```

## Customer Service

```text
POST /customers
GET  /customers/{id}
PATCH /customers/{id}
```

## Order Service

```text
POST /orders
GET  /orders/{id}
```

## Webhook Service

```text
POST /webhooks/providers/{provider}
GET  /webhooks/events/{eventId}
```

## Notification Service

Internal/event-driven initially:

```text
Kafka → NotificationEventConsumer
```

## Fraud Service

Internal/event-driven:

```text
Kafka → FraudEventConsumer
```

## Analytics Service

Internal/event-driven:

```text
Kafka → AnalyticsEventConsumer
```

---

# 5. Core domain model

Initial entities:

```text
Merchant
Customer
Order
Payment
PaymentAttempt
Transaction
Refund
AuditLog
```

Supporting concepts:

```text
Money
Currency
PaymentStatus
PaymentMethod
TransactionType
TransactionStatus
RefundStatus
```

Later:

```text
IdempotencyRecord
WebhookEvent
RiskAssessment
FraudRule
Notification
```

---

# 6. Recommended package structure

Initial modular monolith:

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
│   └── HealthController.java
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
├── refund/
├── transaction/
├── idempotency/
├── webhook/
├── security/
└── audit/
```

Later, when services are separated, each top-level domain becomes an independently deployable service.

---

# 7. Why these classes exist

| Class | Responsibility |
|---|---|
| Controller | HTTP/API boundary |
| Request DTO | External input contract |
| Response DTO | External output contract |
| Service | Business use cases |
| Entity | Persistent domain state |
| Repository | Database access |
| Processor | Payment processing abstraction |
| Provider Client | External provider integration |
| Mapper | Entity ↔ DTO conversion |
| Exception | Business/technical error representation |
| Validator | Input/business validation |
| Event | Asynchronous domain/integration message |
| Consumer | Kafka event handling |
| Idempotency Service | Duplicate request protection |
| Webhook Verifier | Authenticity verification |
| Risk Engine | Fraud/risk decision |
| Audit Service | Immutable business activity history |

---

# 8. Database evolution

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

Use migrations rather than manually changing production schema.

---

# 9. Important technical concepts by phase

| Phase | Main concepts |
|---|---|
| V0 | Maven, Spring Boot, configuration, REST |
| V1 | DTO, validation, JPA, relationships |
| V2 | domain modelling, money, BigDecimal |
| V3 | Strategy, Adapter, state machine |
| V4 | transactions, ACID, locking, idempotency |
| V5 | ledger concepts, refunds, audit |
| V6 | JWT, authorization, HMAC, webhooks |
| V7 | Redis, caching, TTL, rate limiting |
| V8 | Kafka, events, consumer groups, retries |
| V9 | microservices, service boundaries |
| V10 | resilience, observability, deployment |
| V11 | risk engine, fraud rules |
| V12 | analytics, anomaly detection, AI |

---

# 10. Testing strategy

Every feature should eventually have:

```text
Unit Test
   ↓
Controller/API Test
   ↓
Repository/DB Test
   ↓
Integration Test
   ↓
Concurrency Test
   ↓
Failure Test
```

Critical scenarios:

```text
duplicate payment request
duplicate refund request
duplicate webhook
provider timeout
provider success but response lost
database failure
Kafka publish failure
Kafka consumer retry
concurrent refund
cache unavailable
Redis unavailable
payment provider unavailable
```

---

# 11. Definition of done

A phase is not complete just because the endpoint works.

For each feature:

- [ ] API contract documented
- [ ] Request validation
- [ ] Business validation
- [ ] Correct HTTP status codes
- [ ] Exception handling
- [ ] Database constraints
- [ ] Transaction boundary reviewed
- [ ] Unit tests
- [ ] Integration tests
- [ ] Failure scenarios tested
- [ ] Logging added
- [ ] Documentation updated
- [ ] README progress updated
- [ ] Git commit created

---

# 12. Interview preparation

At the end of each phase, answer questions such as:

### V2

- Why `BigDecimal` instead of `double`?
- Why separate Order and Payment?
- What is the payment state machine?
- Why use DTOs?

### V4

- What is idempotency?
- How can duplicate payments occur?
- How does a unique DB constraint help?
- Optimistic vs pessimistic locking?
- What transaction isolation level is appropriate?
- What happens when two requests update the same payment?

### V6

- How do you verify a webhook?
- What is HMAC?
- How do you prevent replay attacks?
- How do you make webhook processing idempotent?

### V8

- Kafka vs REST?
- What is a consumer group?
- How do you handle duplicate events?
- What happens when the consumer crashes after DB update but before acknowledging Kafka?
- What is the outbox pattern?

### V9

- Why split services?
- How do you choose service boundaries?
- How do services communicate?
- What happens when Payment Service is unavailable?

### V10

- Retry vs timeout?
- Circuit breaker?
- Distributed tracing?
- Correlation ID?
- How would you scale Payment Service?

---

# 13. First development target

Do not implement the whole architecture immediately.

Start here:

```text
V0
 ↓
Project setup
 ↓
Health API
 ↓
PostgreSQL connection
 ↓
Common error response
 ↓
Project conventions
 ↓
Merchant domain
```

The first real business feature will be:

```text
POST /api/v1/merchants
```

Then:

```text
POST /api/v1/customers
        ↓
POST /api/v1/orders
        ↓
POST /api/v1/payments
        ↓
POST /api/v1/payments/{id}/process
```

That gives us our first complete vertical slice.

---

# 14. Current implementation status

```text
[✓] Repository structure
[✓] Maven project
[✓] Java 21 configuration
[✓] Spring Boot application
[✓] Health endpoint
[✓] PostgreSQL Docker setup
[✓] README
[✓] Development roadmap
[ ] Merchant
[ ] Customer
[ ] Order
[ ] Payment
[ ] Processing
[ ] Idempotency
[ ] Refund
[ ] Security
[ ] Webhooks
[ ] Redis
[ ] Kafka
[ ] Microservices
[ ] Fraud
[ ] Analytics
```

**Next coding milestone: V0 → V1 Merchant Management.**
