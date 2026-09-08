package com.nazir.financialtransactionpaymentplatform.payment.service;

import com.nazir.financialtransactionpaymentplatform.account.entity.Account;
import com.nazir.financialtransactionpaymentplatform.account.service.AccountService;
import com.nazir.financialtransactionpaymentplatform.ledger.dto.CreateLedgerEntryRequest;
import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntryType;
import com.nazir.financialtransactionpaymentplatform.ledger.service.LedgerService;
import com.nazir.financialtransactionpaymentplatform.order.entity.Order;
import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;
import com.nazir.financialtransactionpaymentplatform.transaction.dto.CreateTransactionRequest;
import com.nazir.financialtransactionpaymentplatform.transaction.dto.TransactionResponse;
import com.nazir.financialtransactionpaymentplatform.transaction.dto.UpdateTransactionStatusRequest;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionStatus;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionType;
import com.nazir.financialtransactionpaymentplatform.transaction.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
public class PaymentProcessingService {

    private final PaymentService paymentService;
    private final AccountService accountService;
    private final TransactionService transactionService;
    private final LedgerService ledgerService;

    public PaymentProcessingService(PaymentService paymentService, AccountService accountService, TransactionService transactionService, LedgerService ledgerService) {
        this.paymentService = paymentService;
        this.accountService = accountService;
        this.transactionService = transactionService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public void processPayment(UUID paymentId) {

        log.info("Starting payment processing. paymentId={}", paymentId);

        // 1. Get Payment
        Payment payment = paymentService.getPaymentForProcessing(paymentId);

        log.debug("Payment retrieved. paymentId={}, status={}", paymentId, payment.getStatus());

        // 2. Payment must be SUCCESS
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            log.warn("Payment processing rejected. paymentId={}, status={}",paymentId, payment.getStatus());
            throw new IllegalArgumentException("Payment must be SUCCESS before processing");
        }

        if (transactionService.existsByPaymentId(paymentId)) {
            return;
        }

        // 3. Get Order from Payment
        Order order = payment.getOrder();

        log.debug("Order retrieved for payment. paymentId={}, orderNumber={}", paymentId, order.getOrderNumber());

        // 4. Verify payment amount matches order amount
        if (payment.getAmount().compareTo(order.getAmount()) != 0) {
            log.warn("Payment amount validation failed. paymentId={}, orderNumber={}", paymentId, order.getOrderNumber());
            throw new IllegalArgumentException("Payment amount does not match order amount");
        }

        log.debug("Payment amount validated successfully. paymentId={}, orderNumber={}", paymentId, order.getOrderNumber());

        // 5. Get Merchant Account
        UUID merchantId = order.getMerchant().getId();
        Account account = accountService.getAccountEntityByMerchantId(merchantId);
        log.debug("Merchant account retrieved. merchantId={}, accountId={}", merchantId, account.getId());

        // 6. Create Transaction
        CreateTransactionRequest transactionRequest = new CreateTransactionRequest(payment.getId(),payment.getAmount(), TransactionType.DEBIT);
        log.debug("Creating transaction for payment. paymentId={}", paymentId);
        TransactionResponse transaction = transactionService.createTransaction(transactionRequest);
        log.info("Transaction created. paymentId={}, transactionId={}", paymentId, transaction.transactionId());

        // 7. Mark Transaction SUCCESS
        transactionService.updateStatus(transaction.transactionId(), new UpdateTransactionStatusRequest(TransactionStatus.SUCCESS));
        log.info("Transaction marked SUCCESS. paymentId={}, transactionId={}", paymentId, transaction.transactionId());

        // 8. Create Ledger CREDIT
        CreateLedgerEntryRequest ledgerRequest = new CreateLedgerEntryRequest(account.getId(), transaction.transactionId(), payment.getAmount(),LedgerEntryType.CREDIT, "Payment received for order " + order.getOrderNumber());

        log.debug("Creating ledger CREDIT entry. paymentId={}, transactionId={}, accountId={}", paymentId, transaction.transactionId(), account.getId());

        ledgerService.createLedgerEntry(ledgerRequest);

        log.info("Payment processing completed successfully. paymentId={}, transactionId={}", paymentId, transaction.transactionId());
    }
}