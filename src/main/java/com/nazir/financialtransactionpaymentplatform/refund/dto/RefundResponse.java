package com.nazir.financialtransactionpaymentplatform.refund.dto;

import com.nazir.financialtransactionpaymentplatform.refund.entity.Refund;
import com.nazir.financialtransactionpaymentplatform.refund.entity.RefundStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record RefundResponse(
        UUID refundId,
        UUID paymentId,
        BigDecimal amount,
        String currency,
        RefundStatus status,
        String reason,
        String idempotencyKey,
        Instant createdAt,
        Instant updatedAt
) {

    public static RefundResponse from(Refund refund) {
        return new RefundResponse(
                refund.getId(),
                refund.getPayment().getId(),
                refund.getAmount(),
                refund.getCurrency(),
                refund.getStatus(),
                refund.getReason(),
                refund.getIdempotencyKey(),
                refund.getCreatedAt(),
                refund.getUpdatedAt()
        );
    }
}