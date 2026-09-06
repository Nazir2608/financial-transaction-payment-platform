package com.nazir.financialtransactionpaymentplatform.transaction.dto;

import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionRequest(

        @NotNull
        UUID paymentId,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        @NotNull
        TransactionType type
) {
}