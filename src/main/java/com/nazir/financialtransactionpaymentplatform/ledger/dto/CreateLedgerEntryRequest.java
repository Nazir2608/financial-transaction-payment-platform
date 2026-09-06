package com.nazir.financialtransactionpaymentplatform.ledger.dto;

import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntryType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateLedgerEntryRequest(

        @NotNull
        UUID accountId,

        @NotNull
        UUID transactionId,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        @NotNull
        LedgerEntryType type,

        String description
) {
}