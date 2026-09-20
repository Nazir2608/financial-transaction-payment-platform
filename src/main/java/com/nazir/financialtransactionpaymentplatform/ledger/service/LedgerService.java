package com.nazir.financialtransactionpaymentplatform.ledger.service;

import com.nazir.financialtransactionpaymentplatform.account.entity.Account;
import com.nazir.financialtransactionpaymentplatform.account.entity.AccountStatus;
import com.nazir.financialtransactionpaymentplatform.account.repository.AccountRepository;
import com.nazir.financialtransactionpaymentplatform.common.exception.BusinessException;
import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import com.nazir.financialtransactionpaymentplatform.ledger.dto.CreateLedgerEntryRequest;
import com.nazir.financialtransactionpaymentplatform.ledger.dto.LedgerEntryResponse;
import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntry;
import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntryType;
import com.nazir.financialtransactionpaymentplatform.ledger.repository.LedgerEntryRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class LedgerService {

    private final LedgerEntryRepository ledgerEntryRepository;
    private final AccountRepository accountRepository;

    public LedgerService(LedgerEntryRepository ledgerEntryRepository, AccountRepository accountRepository) {
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public LedgerEntryResponse createLedgerEntry(CreateLedgerEntryRequest request) {
        log.info("Creating ledger entry. accountId={}, transactionId={}, amount={}, type={}", request.accountId(), request.transactionId(), request.amount(), request.type());
        // Lock the account row before reading/updating the balance.
        Account account = accountRepository.findByIdForUpdate(request.accountId()).orElseThrow(() -> {
            return new ResourceNotFoundException("Account not found: " + request.accountId());
        });

        log.debug("Account locked for ledger processing. accountId={}, currentBalance={}", account.getId(), account.getBalance());

        if (account.getStatus() != AccountStatus.ACTIVE) {
            log.warn("Ledger creation failed. Account is not active. accountId={}, status={}", account.getId(), account.getStatus());
            throw new BusinessException("Account is not active: " + account.getId());
        }

        BigDecimal currentBalance = account.getBalance();

        BigDecimal newBalance;

        if (request.type() == LedgerEntryType.CREDIT) {
            newBalance = currentBalance.add(request.amount());
            log.debug("Applying CREDIT. accountId={}, currentBalance={}, amount={}, newBalance={}", account.getId(), currentBalance, request.amount(), newBalance);

        } else {
            newBalance = currentBalance.subtract(request.amount());
            log.debug("Applying DEBIT. accountId={}, currentBalance={}, amount={}, newBalance={}", account.getId(), currentBalance, request.amount(), newBalance);
        }

        account.setBalance(newBalance);
        accountRepository.save(account);

        log.info("Account balance updated. accountId={}, oldBalance={}, newBalance={}", account.getId(), currentBalance, newBalance);

        LedgerEntry ledgerEntry = new LedgerEntry();

        ledgerEntry.setAccountId(account.getId());
        ledgerEntry.setTransactionId(request.transactionId());
        ledgerEntry.setAmount(request.amount());
        ledgerEntry.setType(request.type());
        ledgerEntry.setDescription(request.description());

        LedgerEntry savedLedgerEntry = ledgerEntryRepository.save(ledgerEntry);

        log.info("Ledger entry created successfully. ledgerEntryId={}, accountId={}, transactionId={}, amount={}, type={}", savedLedgerEntry.getId(), savedLedgerEntry.getAccountId(), savedLedgerEntry.getTransactionId(), savedLedgerEntry.getAmount(), savedLedgerEntry.getType());

        return LedgerEntryResponse.from(savedLedgerEntry);
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

    @Transactional
    public LedgerEntryResponse createLedgerEntryForMerchant(UUID merchantId, UUID transactionId, BigDecimal amount, LedgerEntryType type, String description) {

        log.info("Creating ledger entry for merchant. merchantId={}, transactionId={}, amount={}, type={}", merchantId, transactionId, amount, type);

        Account account = accountRepository.findByMerchantIdForUpdate(merchantId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found for merchant: " + merchantId));

        log.debug("Account locked successfully. merchantId={}, accountId={}, currentBalance={}", merchantId, account.getId(), account.getBalance());

        if (account.getStatus() != AccountStatus.ACTIVE) {
            log.warn("Ledger creation failed. Account is not active. accountId={}, status={}", account.getId(), account.getStatus());

            throw new BusinessException("Account is not active: " + account.getId());
        }

        BigDecimal currentBalance = account.getBalance();

        BigDecimal newBalance;

        if (type == LedgerEntryType.CREDIT) {
            newBalance = currentBalance.add(amount);

            log.debug("Applying CREDIT. accountId={}, currentBalance={}, amount={}, newBalance={}", account.getId(), currentBalance, amount, newBalance);

        } else {
            newBalance = currentBalance.subtract(amount);

            log.debug("Applying DEBIT. accountId={}, currentBalance={}, amount={}, newBalance={}", account.getId(), currentBalance, amount, newBalance);
        }

        account.setBalance(newBalance);

        accountRepository.save(account);

        log.info("Account balance updated. accountId={}, oldBalance={}, newBalance={}", account.getId(), currentBalance, newBalance);

        LedgerEntry ledgerEntry = new LedgerEntry();

        ledgerEntry.setAccountId(account.getId());
        ledgerEntry.setTransactionId(transactionId);
        ledgerEntry.setAmount(amount);
        ledgerEntry.setType(type);
        ledgerEntry.setDescription(description);

        LedgerEntry savedLedgerEntry = ledgerEntryRepository.save(ledgerEntry);

        log.info("Ledger entry created successfully. ledgerEntryId={}, accountId={}, transactionId={}, amount={}, type={}",
                savedLedgerEntry.getId(),
                savedLedgerEntry.getAccountId(),
                savedLedgerEntry.getTransactionId(),
                savedLedgerEntry.getAmount(),
                savedLedgerEntry.getType()
        );

        return LedgerEntryResponse.from(savedLedgerEntry);
    }
}