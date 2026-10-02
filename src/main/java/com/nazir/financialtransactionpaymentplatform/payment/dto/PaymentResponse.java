package com.nazir.financialtransactionpaymentplatform.payment.dto;

import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PaymentResponse(
        UUID paymentId,
        UUID orderId,
        BigDecimal amount,
        String currency,
        String paymentMethod,
        PaymentStatus status,
        String providerReferenceId,
        Instant createdAt,
        Instant updatedAt
) {

    public static PaymentResponse from(Payment payment) {

        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getProviderReferenceId(),
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}