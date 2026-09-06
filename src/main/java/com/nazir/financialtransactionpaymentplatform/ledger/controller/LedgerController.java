package com.nazir.financialtransactionpaymentplatform.ledger.controller;

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
    public LedgerEntryResponse createLedgerEntry(@Valid @RequestBody CreateLedgerEntryRequest request) {
        return service.createLedgerEntry(request);
    }

    @GetMapping
    public List<LedgerEntryResponse> getAllLedgerEntries() {
        return service.getAllLedgerEntries();
    }

    @GetMapping("/{ledgerEntryId}")
    public LedgerEntryResponse getLedgerEntry(@PathVariable UUID ledgerEntryId) {
        return service.getLedgerEntry(ledgerEntryId);
    }

    @GetMapping("/transaction/{transactionId}")
    public List<LedgerEntryResponse> getByTransaction(@PathVariable UUID transactionId) {
        return service.getByTransaction(transactionId);
    }

    @GetMapping("/account/{accountId}")
    public List<LedgerEntryResponse> getByAccount(@PathVariable UUID accountId) {
        return service.getByAccount(accountId);
    }

    @GetMapping("/account/{accountId}/balance")
    public BigDecimal getAccountBalance(@PathVariable UUID accountId) {
        return service.getAccountBalance(accountId);
    }
}