package com.nazir.financialtransactionpaymentplatform.transaction.controller;

import com.nazir.financialtransactionpaymentplatform.common.response.ApiResponse;
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
    public ApiResponse<TransactionResponse> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        TransactionResponse response = service.createTransaction(request);
        return ApiResponse.success(response, "Transaction created successfully");
    }

    @GetMapping
    public ApiResponse<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> responses = service.getAllTransactions();
        return ApiResponse.success(responses, "Transactions fetched successfully");
    }

    @GetMapping("/{transactionId}")
    public ApiResponse<TransactionResponse> getTransaction(@PathVariable UUID transactionId) {
        TransactionResponse response = service.getTransaction(transactionId);
        return ApiResponse.success(response, "Transaction fetched successfully");
    }

    @GetMapping("/payment/{paymentId}")
    public ApiResponse<List<TransactionResponse>> getTransactionsByPayment(@PathVariable UUID paymentId) {
        List<TransactionResponse> responses = service.getTransactionsByPayment(paymentId);
        return ApiResponse.success(responses, "Transactions fetched successfully for payment");
    }

    @PatchMapping("/{transactionId}/status")
    public ApiResponse<TransactionResponse> updateStatus(@PathVariable UUID transactionId, @Valid @RequestBody UpdateTransactionStatusRequest request) {
        TransactionResponse response = service.updateStatus(transactionId, request);
        return ApiResponse.success(response, "Transaction status updated successfully");
    }
}