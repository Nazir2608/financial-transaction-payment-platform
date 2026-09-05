# START HERE

## Step 1

Start PostgreSQL:

```bash
docker compose up -d postgres
```

## Step 2

Run:

```bash
./mvnw spring-boot:run
```

## Step 3

Call:

```bash
curl http://localhost:8080/api/v1/health
```

## Step 4

Read `DEVELOPMENT.md`, especially V0 and V1.

## Step 5

Implement Merchant Management before touching payments.

### First feature target

```text
POST /api/v1/merchants
        ↓
MerchantController
        ↓
CreateMerchantRequest
        ↓
MerchantService
        ↓
Merchant
        ↓
MerchantRepository
        ↓
PostgreSQL
        ↓
MerchantResponse
```

### Rule

Do not add Redis, Kafka, microservices, or fraud logic yet. Earn each technology by reaching the phase where its problem appears.
