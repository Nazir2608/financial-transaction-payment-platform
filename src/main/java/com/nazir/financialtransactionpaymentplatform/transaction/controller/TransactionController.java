package com.nazir.financialtransactionpaymentplatform.transaction.controller;

import com.nazir.financialtransactionpaymentplatform.transaction.dto.CreateTransactionRequest;
import com.nazir.financialtransactionpaymentplatform.transaction.dto.TransactionResponse;
import com.nazir.financialtransactionpaymentplatform.transaction.dto.UpdateTransactionStatusRequest;
import com.nazir.financialtransactionpaymentplatform.transaction.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        return service.createTransaction(request);
    }

    @GetMapping
    public List<TransactionResponse> getAllTransactions() {
        return service.getAllTransactions();
    }

    @GetMapping("/{transactionId}")
    public TransactionResponse getTransaction(@PathVariable UUID transactionId) {
        return service.getTransaction(transactionId);
    }

    @GetMapping("/payment/{paymentId}")
    public List<TransactionResponse> getTransactionsByPayment(@PathVariable UUID paymentId) {
        return service.getTransactionsByPayment(paymentId);
    }

    @PatchMapping("/{transactionId}/status")
    public TransactionResponse updateStatus(@PathVariable UUID transactionId, @Valid @RequestBody UpdateTransactionStatusRequest request) {
        return service.updateStatus(transactionId, request);
    }
}