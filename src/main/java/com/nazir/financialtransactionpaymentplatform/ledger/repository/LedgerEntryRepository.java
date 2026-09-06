package com.nazir.financialtransactionpaymentplatform.ledger.repository;

import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {

    List<LedgerEntry> findAllByTransactionId(UUID transactionId);

    List<LedgerEntry> findAllByAccountId(UUID accountId);
}