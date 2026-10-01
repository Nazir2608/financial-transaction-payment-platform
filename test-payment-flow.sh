#!/bin/bash

set -e

BASE_URL="http://localhost:8080/api/v1"

echo "=========================================="
echo " FINANCIAL TRANSACTION PAYMENT PLATFORM"
echo " PHASE 2 - IDEMPOTENT PAYMENT PROCESSING"
echo "=========================================="

# ============================================================
# Helper
# ============================================================

check_id() {
    local name="$1"
    local id="$2"

    if [ -z "$id" ] || [ "$id" = "null" ]; then
        echo ""
        echo "❌ $name failed."
        echo "Stopping test because required ID was not returned."
        exit 1
    fi
}

check_http_status() {
    local name="$1"
    local status="$2"
    local expected="$3"

    if [ "$status" != "$expected" ]; then
        echo ""
        echo "❌ $name failed."
        echo "Expected HTTP status: $expected"
        echo "Actual HTTP status:   $status"
        exit 1
    fi
}


# ============================================================
# 1. CREATE MERCHANT
# ============================================================

echo ""
echo "1️⃣ Creating Merchant..."

MERCHANT_RESPONSE=$(curl -s -X POST "$BASE_URL/merchants" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test Merchant",
    "email": "merchant-'$(date +%s)'@example.com",
    "phone": "9876543210",
    "businessName": "Test Merchant Pvt Ltd"
  }')

echo "$MERCHANT_RESPONSE" | jq .

MERCHANT_ID=$(echo "$MERCHANT_RESPONSE" | jq -r '.merchantId')

check_id "Merchant creation" "$MERCHANT_ID"

echo "✅ Merchant ID: $MERCHANT_ID"


# ============================================================
# 2. CREATE CUSTOMER
# ============================================================

echo ""
echo "2️⃣ Creating Customer..."

CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/customers" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test Customer",
    "email": "customer-'$(date +%s)'@example.com",
    "phone": "9999999999"
  }')

echo "$CUSTOMER_RESPONSE" | jq .

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | jq -r '.customerId')

check_id "Customer creation" "$CUSTOMER_ID"

echo "✅ Customer ID: $CUSTOMER_ID"


# ============================================================
# 3. CREATE MERCHANT ACCOUNT
# ============================================================

echo ""
echo "3️⃣ Creating Merchant Account..."

ACCOUNT_RESPONSE=$(curl -s -X POST "$BASE_URL/accounts" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"merchantId\": \"$MERCHANT_ID\"
  }")

echo "$ACCOUNT_RESPONSE" | jq .

ACCOUNT_ID=$(echo "$ACCOUNT_RESPONSE" | jq -r '.accountId')

check_id "Account creation" "$ACCOUNT_ID"

echo "✅ Account ID: $ACCOUNT_ID"


# ============================================================
# 4. CREATE ORDER
# ============================================================

echo ""
echo "4️⃣ Creating Order..."

ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/orders" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"merchantId\": \"$MERCHANT_ID\",
    \"customerId\": \"$CUSTOMER_ID\",
    \"amount\": 1500.00,
    \"currency\": \"INR\"
  }")

echo "$ORDER_RESPONSE" | jq .

ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.orderId')

check_id "Order creation" "$ORDER_ID"

echo "✅ Order ID: $ORDER_ID"


# ============================================================
# 5. CREATE PAYMENT
# ============================================================

echo ""
echo "5️⃣ Creating Payment..."

PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/payments" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"orderId\": \"$ORDER_ID\",
    \"amount\": 1500.00,
    \"paymentMethod\": \"CARD\"
  }")

echo "$PAYMENT_RESPONSE" | jq .

PAYMENT_ID=$(echo "$PAYMENT_RESPONSE" | jq -r '.paymentId')

check_id "Payment creation" "$PAYMENT_ID"

echo "✅ Payment ID: $PAYMENT_ID"


# ============================================================
# 6. UPDATE PAYMENT STATUS → SUCCESS
# ============================================================

echo ""
echo "6️⃣ Updating Payment Status → SUCCESS..."

PAYMENT_STATUS_RESPONSE=$(curl -s -X PATCH \
  "$BASE_URL/payments/$PAYMENT_ID/status" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "status": "SUCCESS"
  }')

echo "$PAYMENT_STATUS_RESPONSE" | jq .

PAYMENT_FINAL_STATUS=$(echo "$PAYMENT_STATUS_RESPONSE" | jq -r '.status')

if [ "$PAYMENT_FINAL_STATUS" != "SUCCESS" ]; then
    echo ""
    echo "❌ Payment status update failed."
    echo "Expected: SUCCESS"
    echo "Actual:   $PAYMENT_FINAL_STATUS"
    exit 1
fi

echo "✅ Payment status: SUCCESS"


# ============================================================
# 7. PROCESS PAYMENT - FIRST REQUEST
# ============================================================

echo ""
echo "7️⃣ Processing Payment - FIRST REQUEST..."

PROCESS_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  "$BASE_URL/payments/$PAYMENT_ID/process" \
  -H "Accept: application/json")

PROCESS_STATUS=$(echo "$PROCESS_RESPONSE" | tail -n 1)
PROCESS_BODY=$(echo "$PROCESS_RESPONSE" | sed '$d')

echo "HTTP Status: $PROCESS_STATUS"

if [ -n "$PROCESS_BODY" ]; then
    echo "$PROCESS_BODY" | jq . 2>/dev/null || echo "$PROCESS_BODY"
fi

check_http_status "First payment processing" "$PROCESS_STATUS" "200"

echo "✅ First processing request completed."


# ============================================================
# 8. PROCESS PAYMENT - SECOND REQUEST
# ============================================================

echo ""
echo "8️⃣ Processing SAME Payment - SECOND REQUEST..."

PROCESS_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  "$BASE_URL/payments/$PAYMENT_ID/process" \
  -H "Accept: application/json")

PROCESS_STATUS=$(echo "$PROCESS_RESPONSE" | tail -n 1)
PROCESS_BODY=$(echo "$PROCESS_RESPONSE" | sed '$d')

echo "HTTP Status: $PROCESS_STATUS"

if [ -n "$PROCESS_BODY" ]; then
    echo "$PROCESS_BODY" | jq . 2>/dev/null || echo "$PROCESS_BODY"
fi

check_http_status "Second payment processing" "$PROCESS_STATUS" "200"

echo "✅ Second processing request completed."
echo "✅ Same payment processed twice without error."


# ============================================================
# 9. VERIFY TRANSACTION
# ============================================================

echo ""
echo "9️⃣ Checking Transactions..."

TRANSACTION_RESPONSE=$(curl -s \
  -H "Accept: application/json" \
  "$BASE_URL/transactions/payment/$PAYMENT_ID")

echo "$TRANSACTION_RESPONSE" | jq .

TRANSACTION_COUNT=$(echo "$TRANSACTION_RESPONSE" | jq 'length')

echo "Transaction count: $TRANSACTION_COUNT"

if [ "$TRANSACTION_COUNT" -ne 1 ]; then
    echo ""
    echo "❌ IDEMPOTENCY FAILED."
    echo "Expected transactions: 1"
    echo "Actual transactions:   $TRANSACTION_COUNT"
    exit 1
fi

echo "✅ Exactly ONE transaction exists."


# ============================================================
# 10. VERIFY TRANSACTION DETAILS
# ============================================================

TRANSACTION_ID=$(echo "$TRANSACTION_RESPONSE" | jq -r '.[0].transactionId')
TRANSACTION_AMOUNT=$(echo "$TRANSACTION_RESPONSE" | jq -r '.[0].amount')
TRANSACTION_TYPE=$(echo "$TRANSACTION_RESPONSE" | jq -r '.[0].type')
TRANSACTION_STATUS=$(echo "$TRANSACTION_RESPONSE" | jq -r '.[0].status')

check_id "Transaction" "$TRANSACTION_ID"

if [ "$TRANSACTION_AMOUNT" != "1500.00" ]; then
    echo "❌ Transaction amount incorrect."
    echo "Expected: 1500.00"
    echo "Actual:   $TRANSACTION_AMOUNT"
    exit 1
fi

if [ "$TRANSACTION_TYPE" != "DEBIT" ]; then
    echo "❌ Transaction type incorrect."
    echo "Expected: DEBIT"
    echo "Actual:   $TRANSACTION_TYPE"
    exit 1
fi

if [ "$TRANSACTION_STATUS" != "SUCCESS" ]; then
    echo "❌ Transaction status incorrect."
    echo "Expected: SUCCESS"
    echo "Actual:   $TRANSACTION_STATUS"
    exit 1
fi

echo "✅ Transaction ID: $TRANSACTION_ID"
echo "✅ Transaction amount: ₹$TRANSACTION_AMOUNT"
echo "✅ Transaction type: $TRANSACTION_TYPE"
echo "✅ Transaction status: $TRANSACTION_STATUS"


# ============================================================
# 11. VERIFY LEDGER
# ============================================================

echo ""
echo "1️⃣1️⃣ Checking Ledger Entries..."

LEDGER_RESPONSE=$(curl -s \
  -H "Accept: application/json" \
  "$BASE_URL/ledger-entries/transaction/$TRANSACTION_ID")

echo "$LEDGER_RESPONSE" | jq .

LEDGER_COUNT=$(echo "$LEDGER_RESPONSE" | jq 'length')

echo "Ledger count: $LEDGER_COUNT"

if [ "$LEDGER_COUNT" -ne 1 ]; then
    echo ""
    echo "❌ IDEMPOTENCY FAILED."
    echo "Expected ledger entries: 1"
    echo "Actual ledger entries:   $LEDGER_COUNT"
    exit 1
fi

echo "✅ Exactly ONE ledger entry exists."


# ============================================================
# 12. VERIFY LEDGER DETAILS
# ============================================================

LEDGER_ID=$(echo "$LEDGER_RESPONSE" | jq -r '.[0].ledgerEntryId')
LEDGER_ACCOUNT_ID=$(echo "$LEDGER_RESPONSE" | jq -r '.[0].accountId')
LEDGER_TRANSACTION_ID=$(echo "$LEDGER_RESPONSE" | jq -r '.[0].transactionId')
LEDGER_AMOUNT=$(echo "$LEDGER_RESPONSE" | jq -r '.[0].amount')
LEDGER_TYPE=$(echo "$LEDGER_RESPONSE" | jq -r '.[0].type')

check_id "Ledger" "$LEDGER_ID"

if [ "$LEDGER_ACCOUNT_ID" != "$ACCOUNT_ID" ]; then
    echo "❌ Ledger account mismatch."
    echo "Expected: $ACCOUNT_ID"
    echo "Actual:   $LEDGER_ACCOUNT_ID"
    exit 1
fi

if [ "$LEDGER_TRANSACTION_ID" != "$TRANSACTION_ID" ]; then
    echo "❌ Ledger transaction mismatch."
    echo "Expected: $TRANSACTION_ID"
    echo "Actual:   $LEDGER_TRANSACTION_ID"
    exit 1
fi

if [ "$LEDGER_AMOUNT" != "1500.00" ]; then
    echo "❌ Ledger amount incorrect."
    echo "Expected: 1500.00"
    echo "Actual:   $LEDGER_AMOUNT"
    exit 1
fi

if [ "$LEDGER_TYPE" != "CREDIT" ]; then
    echo "❌ Ledger type incorrect."
    echo "Expected: CREDIT"
    echo "Actual:   $LEDGER_TYPE"
    exit 1
fi

echo "✅ Ledger ID: $LEDGER_ID"
echo "✅ Ledger account matches Account"
echo "✅ Ledger transaction matches Transaction"
echo "✅ Ledger amount: ₹$LEDGER_AMOUNT"
echo "✅ Ledger type: CREDIT"


# ============================================================
# 13. CHECK MERCHANT ACCOUNT
# ============================================================

echo ""
echo "1️⃣3️⃣ Checking Merchant Account..."

ACCOUNT_CHECK_RESPONSE=$(curl -s \
  -H "Accept: application/json" \
  "$BASE_URL/accounts/$ACCOUNT_ID")

echo "$ACCOUNT_CHECK_RESPONSE" | jq .

ACCOUNT_BALANCE=$(echo "$ACCOUNT_CHECK_RESPONSE" | jq -r '.balance')

echo "Account balance: ₹$ACCOUNT_BALANCE"

if [ "$ACCOUNT_BALANCE" != "1500.00" ]; then
    echo ""
    echo "❌ IDEMPOTENCY FAILED."
    echo "Expected account balance: ₹1500.00"
    echo "Actual account balance:   ₹$ACCOUNT_BALANCE"
    echo ""
    echo "The payment may have been processed more than once."
    exit 1
fi

echo "✅ Account balance: ₹1500"


# ============================================================
# 14. CHECK BALANCE ENDPOINT
# ============================================================

echo ""
echo "1️⃣4️⃣ Checking Account Balance Endpoint..."

BALANCE_RESPONSE=$(curl -s \
  -H "Accept: application/json" \
  "$BASE_URL/accounts/$ACCOUNT_ID/balance")

echo "$BALANCE_RESPONSE" | jq .

BALANCE=$(echo "$BALANCE_RESPONSE" | jq -r '.')

if [ "$BALANCE" != "1500.00" ]; then
    echo ""
    echo "❌ Balance endpoint returned incorrect balance."
    echo "Expected: ₹1500.00"
    echo "Actual:   ₹$BALANCE"
    exit 1
fi

echo "✅ Balance endpoint: ₹1500"


# ============================================================
# FINAL SUMMARY
# ============================================================

echo ""
echo "=========================================="
echo " PHASE 2 IDEMPOTENCY TEST PASSED ✅"
echo "=========================================="

echo "Merchant ID:     $MERCHANT_ID"
echo "Customer ID:     $CUSTOMER_ID"
echo "Account ID:      $ACCOUNT_ID"
echo "Order ID:        $ORDER_ID"
echo "Payment ID:      $PAYMENT_ID"
echo "Transaction ID:  $TRANSACTION_ID"
echo "Ledger ID:       $LEDGER_ID"

echo ""
echo "=========================================="
echo " IDEMPOTENCY VERIFICATION"
echo "=========================================="

echo "Payment processed:       2 times"
echo "Transactions created:    1"
echo "Ledger entries created:  1"
echo "Account balance:         ₹1500"

echo ""
echo "=========================================="
echo " EXPECTED BUSINESS FLOW"
echo "=========================================="

echo "Customer"
echo "   ↓"
echo "Order ₹1500 INR"
echo "   ↓"
echo "Payment ₹1500 SUCCESS"
echo "   ↓"
echo "Process Payment #1"
echo "   ↓"
echo "Transaction SUCCESS"
echo "   ↓"
echo "Ledger CREDIT ₹1500"
echo "   ↓"
echo "Account ₹1500"
echo ""
echo "Process Payment #2"
echo "   ↓"
echo "Transaction already exists"
echo "   ↓"
echo "NO new Transaction"
echo "NO new Ledger"
echo "NO balance change"
echo ""
echo "Final Balance = ₹1500"

echo ""
echo "=========================================="
echo " ALL IDEMPOTENCY CHECKS PASSED ✅"
echo "=========================================="