package com.nazir.financialtransactionpaymentplatform.account.service;

import com.nazir.financialtransactionpaymentplatform.account.dto.AccountResponse;
import com.nazir.financialtransactionpaymentplatform.account.dto.CreateAccountRequest;
import com.nazir.financialtransactionpaymentplatform.account.entity.Account;
import com.nazir.financialtransactionpaymentplatform.account.repository.AccountRepository;
import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountResponse createAccount(CreateAccountRequest request) {

        if (accountRepository.existsByMerchantId(request.merchantId())) {
            throw new IllegalArgumentException("Account already exists for merchant: " + request.merchantId());
        }

        Account account = new Account();

        account.setMerchantId(request.merchantId());

        Account savedAccount = accountRepository.save(account);

        return AccountResponse.from(savedAccount);
    }

    public AccountResponse getAccount(UUID accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountId));
        return AccountResponse.from(account);
    }

    public AccountResponse getAccountByMerchant(UUID merchantId) {
        Account account = accountRepository.findByMerchantId(merchantId).orElseThrow(() -> new ResourceNotFoundException("Account not found for merchant: " + merchantId));
        return AccountResponse.from(account);
    }

    public BigDecimal getBalance(UUID accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountId));
        return account.getBalance();
    }
}