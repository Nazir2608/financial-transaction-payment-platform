package com.nazir.financialtransactionpaymentplatform.account.controller;

import com.nazir.financialtransactionpaymentplatform.account.dto.AccountResponse;
import com.nazir.financialtransactionpaymentplatform.account.dto.CreateAccountRequest;
import com.nazir.financialtransactionpaymentplatform.account.service.AccountService;
import com.nazir.financialtransactionpaymentplatform.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
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
    public ApiResponse<AccountResponse> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        AccountResponse response = service.createAccount(request);
        return ApiResponse.success(response,"Account created successfully");
    }

    @GetMapping
    public ApiResponse<List<AccountResponse>> getAllAccounts() {
         List<AccountResponse> responses= service.getAllAccounts();
         return ApiResponse.success(responses,"Fetched All Account successfully");
    }

    @GetMapping("/{accountId}")
    public ApiResponse<AccountResponse> getAccount(@PathVariable UUID accountId) {
        AccountResponse response= service.getAccount(accountId);
         return ApiResponse.success(response,"Account fetched based on account id");
    }

    @GetMapping("/merchant/{merchantId}")
    public ApiResponse<AccountResponse> getAccountByMerchant(@PathVariable UUID merchantId) {
        AccountResponse response= service.getAccountByMerchant(merchantId);
        return ApiResponse.success(response,"Account fetched based on merchant id");
    }

    @GetMapping("/{accountId}/balance")
    public ApiResponse<BigDecimal> getBalance(@PathVariable UUID accountId) {
        BigDecimal response= service.getBalance(accountId);
        return ApiResponse.success(response);
    }
}