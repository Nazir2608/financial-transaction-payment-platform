package com.nazir.financialtransactionpaymentplatform.account.service;

import com.nazir.financialtransactionpaymentplatform.account.dto.AccountResponse;
import com.nazir.financialtransactionpaymentplatform.account.dto.CreateAccountRequest;
import com.nazir.financialtransactionpaymentplatform.account.entity.Account;
import com.nazir.financialtransactionpaymentplatform.account.repository.AccountRepository;
import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public AccountResponse createAccount(CreateAccountRequest request) {
        if (accountRepository.existsByMerchantId(request.merchantId())) {
            log.warn("Account creation failed. Account already exists for merchantId={}", request.merchantId());
            throw new IllegalArgumentException("Account already exists for merchant: " + request.merchantId());
        }
        Account account = new Account();
        account.setMerchantId(request.merchantId());
        Account savedAccount = accountRepository.save(account);
        log.info("Account created successfully. accountId={}, merchantId={}", savedAccount.getId(), request.merchantId());
        return AccountResponse.from(savedAccount);
    }

    public AccountResponse getAccount(UUID accountId) {
        log.debug("Fetching account by accountId={}", accountId);
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountId));
        log.debug("Account found successfully. accountId={}", accountId);
        return AccountResponse.from(account);
    }

    public AccountResponse getAccountByMerchant(UUID merchantId) {
        log.debug("Fetching account for merchantId={}", merchantId);
        Account account = accountRepository.findByMerchantId(merchantId).orElseThrow(() -> new ResourceNotFoundException("Account not found for merchant: " + merchantId));
        log.debug("Account found for merchantId={}, accountId={}", merchantId, account.getId());
        return AccountResponse.from(account);
    }

    public BigDecimal getBalance(UUID accountId) {
        log.debug("Fetching balance for accountId={}", accountId);
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountId));
        log.debug("Balance fetched successfully for accountId={}", accountId);
        return account.getBalance();
    }

    public Account getAccountEntityByMerchantId(UUID merchantId) {
        log.debug("Fetching account entity for merchantId={}", merchantId);
        return accountRepository.findByMerchantId(merchantId).orElseThrow(() -> new ResourceNotFoundException("Account not found for merchant: " + merchantId));
    }
}