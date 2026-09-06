package com.nazir.financialtransactionpaymentplatform.transaction.dto;

import com.nazir.financialtransactionpaymentplatform.transaction.entity.Transaction;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionStatus;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransactionResponse(

        UUID transactionId,
        UUID paymentId,
        BigDecimal amount,
        TransactionType type,
        TransactionStatus status,
        String reference,
        Instant createdAt,
        Instant updatedAt

) {

    public static TransactionResponse from(Transaction transaction) {

        return new TransactionResponse(
                transaction.getId(),
                transaction.getPaymentId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getStatus(),
                transaction.getReference(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }
}