package com.nazir.financialtransactionpaymentplatform.ledger.dto;

import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntry;
import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntryType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record LedgerEntryResponse(

        UUID ledgerEntryId,
        UUID accountId,
        UUID transactionId,
        BigDecimal amount,
        LedgerEntryType type,
        String description,
        Instant createdAt

) {

    public static LedgerEntryResponse from(LedgerEntry entry) {

        return new LedgerEntryResponse(
                entry.getId(),
                entry.getAccountId(),
                entry.getTransactionId(),
                entry.getAmount(),
                entry.getType(),
                entry.getDescription(),
                entry.getCreatedAt()
        );
    }
}