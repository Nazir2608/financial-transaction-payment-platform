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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentProcessingService {

    private final PaymentService paymentService;
    private final AccountService accountService;
    private final TransactionService transactionService;
    private final LedgerService ledgerService;

    public PaymentProcessingService(
            PaymentService paymentService,
            AccountService accountService,
            TransactionService transactionService,
            LedgerService ledgerService) {

        this.paymentService = paymentService;
        this.accountService = accountService;
        this.transactionService = transactionService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public void processPayment(UUID paymentId) {

        // 1. Get Payment
        Payment payment = paymentService.getPaymentEntity(paymentId);

        // 2. Payment must be SUCCESS
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new IllegalArgumentException(
                    "Payment must be SUCCESS before processing"
            );
        }

        // 3. Get Order from Payment
        Order order = payment.getOrder();

        // 4. Verify payment amount matches order amount
        if (payment.getAmount().compareTo(order.getAmount()) != 0) {
            throw new IllegalArgumentException(
                    "Payment amount does not match order amount"
            );
        }

        // 5. Get Merchant Account
        Account account =
                accountService.getAccountEntityByMerchantId(
                        order.getMerchant().getId()
                );

        // 6. Create Transaction
        CreateTransactionRequest transactionRequest =
                new CreateTransactionRequest(
                        payment.getId(),
                        payment.getAmount(),
                        TransactionType.DEBIT
                );

        TransactionResponse transaction =
                transactionService.createTransaction(
                        transactionRequest
                );

        // 7. Mark Transaction SUCCESS
        transactionService.updateStatus(
                transaction.transactionId(),
                new UpdateTransactionStatusRequest(
                        TransactionStatus.SUCCESS
                )
        );

        // 8. Create Ledger CREDIT
        CreateLedgerEntryRequest ledgerRequest =
                new CreateLedgerEntryRequest(
                        account.getId(),
                        transaction.transactionId(),
                        payment.getAmount(),
                        LedgerEntryType.CREDIT,
                        "Payment received for order "
                                + order.getOrderNumber()
                );

        ledgerService.createLedgerEntry(ledgerRequest);
    }
}