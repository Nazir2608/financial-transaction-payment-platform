package com.nazir.financialtransactionpaymentplatform.ledger.controller;

import com.nazir.financialtransactionpaymentplatform.common.response.ApiResponse;
import com.nazir.financialtransactionpaymentplatform.ledger.dto.CreateLedgerEntryRequest;
import com.nazir.financialtransactionpaymentplatform.ledger.dto.LedgerEntryResponse;
import com.nazir.financialtransactionpaymentplatform.ledger.service.LedgerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ledger-entries")
public class LedgerController {

    private final LedgerService service;

    public LedgerController(LedgerService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LedgerEntryResponse> createLedgerEntry(@Valid @RequestBody CreateLedgerEntryRequest request) {
        LedgerEntryResponse response = service.createLedgerEntry(request);
        return ApiResponse.success(response, "Ledger entry created successfully");
    }

    @GetMapping
    public ApiResponse<List<LedgerEntryResponse>> getAllLedgerEntries() {
        List<LedgerEntryResponse> responses = service.getAllLedgerEntries();
        return ApiResponse.success(responses, "Ledger entries fetched successfully");
    }

    @GetMapping("/{ledgerEntryId}")
    public ApiResponse<LedgerEntryResponse> getLedgerEntry(@PathVariable UUID ledgerEntryId) {
        LedgerEntryResponse response = service.getLedgerEntry(ledgerEntryId);
        return ApiResponse.success(response, "Ledger entry fetched successfully");
    }

    @GetMapping("/transaction/{transactionId}")
    public ApiResponse<List<LedgerEntryResponse>> getByTransaction(@PathVariable UUID transactionId) {
        List<LedgerEntryResponse> responses = service.getByTransaction(transactionId);
        return ApiResponse.success(responses, "Ledger entries fetched successfully for transaction");
    }

    @GetMapping("/account/{accountId}")
    public ApiResponse<List<LedgerEntryResponse>> getByAccount(@PathVariable UUID accountId) {
        List<LedgerEntryResponse> responses = service.getByAccount(accountId);
        return ApiResponse.success(responses, "Ledger entries fetched successfully for account");
    }

    @GetMapping("/account/{accountId}/balance")
    public ApiResponse<BigDecimal> getAccountBalance(@PathVariable UUID accountId) {
        BigDecimal balance = service.getAccountBalance(accountId);
        return ApiResponse.success(balance, "Account balance fetched successfully");
    }
}