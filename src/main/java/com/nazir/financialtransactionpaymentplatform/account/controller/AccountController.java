package com.nazir.financialtransactionpaymentplatform.account.controller;

import com.nazir.financialtransactionpaymentplatform.account.dto.AccountResponse;
import com.nazir.financialtransactionpaymentplatform.account.dto.CreateAccountRequest;
import com.nazir.financialtransactionpaymentplatform.account.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return service.createAccount(request);
    }

    @GetMapping("/{accountId}")
    public AccountResponse getAccount(@PathVariable UUID accountId) {
        return service.getAccount(accountId);
    }

    @GetMapping("/merchant/{merchantId}")
    public AccountResponse getAccountByMerchant(@PathVariable UUID merchantId) {
        return service.getAccountByMerchant(merchantId);
    }

    @GetMapping("/{accountId}/balance")
    public BigDecimal getBalance(@PathVariable UUID accountId) {
        return service.getBalance(accountId);
    }
}