package com.nazir.financialtransactionpaymentplatform.transaction.repository;

import com.nazir.financialtransactionpaymentplatform.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    List<Transaction> findAllByPaymentId(UUID paymentId);

    boolean existsByPaymentId(UUID paymentId);
}