package com.nazir.financialtransactionpaymentplatform.payment.provider.dto;

import java.math.BigDecimal;

public record ProviderPaymentRequest(
        String paymentId,
        BigDecimal amount,
        String currency,
        String paymentMethod,
        String idempotencyKey
) {
}