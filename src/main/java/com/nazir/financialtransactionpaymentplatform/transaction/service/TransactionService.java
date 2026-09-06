package com.nazir.financialtransactionpaymentplatform.transaction.service;

import com.nazir.financialtransactionpaymentplatform.transaction.dto.CreateTransactionRequest;
import com.nazir.financialtransactionpaymentplatform.transaction.dto.TransactionResponse;
import com.nazir.financialtransactionpaymentplatform.transaction.dto.UpdateTransactionStatusRequest;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.Transaction;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionStatus;
import com.nazir.financialtransactionpaymentplatform.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public TransactionResponse createTransaction(CreateTransactionRequest request) {

        Transaction transaction = new Transaction();

        transaction.setPaymentId(request.paymentId());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());

        transaction.setReference("TXN-" + UUID.randomUUID());

        Transaction saved = transactionRepository.save(transaction);

        return TransactionResponse.from(saved);
    }

    public List<TransactionResponse> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(TransactionResponse::from)
                .toList();
    }

    public TransactionResponse getTransaction(UUID transactionId) {

        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() ->
                new RuntimeException("Transaction not found: " + transactionId));

        return TransactionResponse.from(transaction);
    }

    public List<TransactionResponse> getTransactionsByPayment(UUID paymentId) {

        return transactionRepository
                .findAllByPaymentId(paymentId)
                .stream()
                .map(TransactionResponse::from)
                .toList();
    }

    public TransactionResponse updateStatus(
            UUID transactionId,
            UpdateTransactionStatusRequest request) {

        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() ->
                new RuntimeException("Transaction not found: " + transactionId));

        validateStatusTransition(transaction.getStatus(), request.status());

        transaction.setStatus(request.status());

        Transaction saved = transactionRepository.save(transaction);

        return TransactionResponse.from(saved);
    }

    private void validateStatusTransition(TransactionStatus currentStatus, TransactionStatus newStatus) {

        if (currentStatus == newStatus) {

            throw new IllegalArgumentException("Transaction is already in status: " + currentStatus);
        }

        boolean valid = switch (currentStatus) {

            case PENDING -> newStatus == TransactionStatus.SUCCESS || newStatus == TransactionStatus.FAILED;

            case SUCCESS, FAILED -> false;
        };

        if (!valid) {
            throw new IllegalArgumentException("Invalid transaction status transition: " + currentStatus + " -> " + newStatus);
        }
    }
}