package com.nazir.financialtransactionpaymentplatform.ledger.service;

import com.nazir.financialtransactionpaymentplatform.account.entity.Account;
import com.nazir.financialtransactionpaymentplatform.account.entity.AccountStatus;
import com.nazir.financialtransactionpaymentplatform.account.repository.AccountRepository;
import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import com.nazir.financialtransactionpaymentplatform.ledger.dto.CreateLedgerEntryRequest;
import com.nazir.financialtransactionpaymentplatform.ledger.dto.LedgerEntryResponse;
import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntry;
import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntryType;
import com.nazir.financialtransactionpaymentplatform.ledger.repository.LedgerEntryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class LedgerService {

    private final LedgerEntryRepository ledgerEntryRepository;
    private final AccountRepository accountRepository;

    public LedgerService(LedgerEntryRepository ledgerEntryRepository, AccountRepository accountRepository) {
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public LedgerEntryResponse createLedgerEntry(CreateLedgerEntryRequest request) {

        Account account = accountRepository.findById(request.accountId()).orElseThrow(() -> new ResourceNotFoundException("Account not found: " + request.accountId()));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new IllegalArgumentException("Account is not active");
        }

        BigDecimal currentBalance = account.getBalance();

        BigDecimal newBalance;

        if (request.type() == LedgerEntryType.CREDIT) {
            newBalance = currentBalance.add(request.amount());
        } else {
            newBalance = currentBalance.subtract(request.amount());
            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Insufficient account balance");
            }
        }
        account.setBalance(newBalance);
        accountRepository.save(account);

        LedgerEntry entry = new LedgerEntry();

        entry.setAccountId(request.accountId());
        entry.setTransactionId(request.transactionId());
        entry.setAmount(request.amount());
        entry.setType(request.type());
        entry.setDescription(request.description());

        LedgerEntry saved = ledgerEntryRepository.save(entry);

        return LedgerEntryResponse.from(saved);
    }

    public List<LedgerEntryResponse> getAllLedgerEntries() {
        return ledgerEntryRepository.findAll()
                .stream()
                .map(LedgerEntryResponse::from)
                .toList();
    }

    public LedgerEntryResponse getLedgerEntry(UUID ledgerEntryId) {
        LedgerEntry entry = ledgerEntryRepository.findById(ledgerEntryId).orElseThrow(() -> new RuntimeException("Ledger entry not found: " + ledgerEntryId));
        return LedgerEntryResponse.from(entry);
    }

    public List<LedgerEntryResponse> getByTransaction(UUID transactionId) {
        return ledgerEntryRepository
                .findAllByTransactionId(transactionId)
                .stream()
                .map(LedgerEntryResponse::from)
                .toList();
    }

    public List<LedgerEntryResponse> getByAccount(UUID accountId) {
        return ledgerEntryRepository
                .findAllByAccountId(accountId)
                .stream()
                .map(LedgerEntryResponse::from)
                .toList();
    }

    public BigDecimal getAccountBalance(UUID accountId) {
        return ledgerEntryRepository
                .findAllByAccountId(accountId)
                .stream()
                .map(entry -> {

                    if (entry.getType() == com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntryType.CREDIT) {
                        return entry.getAmount();
                    } else {
                        return entry.getAmount().negate();
                    }
                }).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}