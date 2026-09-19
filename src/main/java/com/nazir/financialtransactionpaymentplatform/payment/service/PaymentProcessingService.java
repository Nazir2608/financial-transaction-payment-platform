package com.nazir.financialtransactionpaymentplatform.payment.service;

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
    private final TransactionService transactionService;
    private final LedgerService ledgerService;

    public PaymentProcessingService(PaymentService paymentService, TransactionService transactionService, LedgerService ledgerService) {
        this.paymentService = paymentService;
        this.transactionService = transactionService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public void processPayment(UUID paymentId) {

        log.info("Starting payment processing. paymentId={}", paymentId);

        // 1. Get payment with pessimistic lock
        Payment payment = paymentService.getPaymentForProcessing(paymentId);

        log.debug("Payment retrieved. paymentId={}, status={}", paymentId, payment.getStatus());

        // 2. Payment must be SUCCESS
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            log.warn("Payment processing rejected. paymentId={}, status={}", paymentId, payment.getStatus());
            throw new IllegalArgumentException("Payment must be SUCCESS before processing");
        }

        // 3. Idempotency check
        if (transactionService.existsByPaymentId(paymentId)) {
            log.info("Payment already processed. Skipping duplicate processing. paymentId={}", paymentId);
            return;
        }

        // 4. Get order from payment
        Order order = payment.getOrder();

        log.debug("Order retrieved for payment. paymentId={}, orderNumber={}", paymentId, order.getOrderNumber());

        // 5. Validate payment amount against order amount
        if (payment.getAmount().compareTo(order.getAmount()) != 0) {

            log.warn("Payment amount validation failed. paymentId={}, orderNumber={}, paymentAmount={}, orderAmount={}", paymentId, order.getOrderNumber(), payment.getAmount(), order.getAmount());

            throw new IllegalArgumentException("Payment amount does not match order amount");
        }

        log.debug("Payment amount validated successfully. paymentId={}, orderNumber={}", paymentId, order.getOrderNumber());

        // 6. Get merchant ID
        UUID merchantId = order.getMerchant().getId();

        log.debug("Merchant identified for payment. paymentId={}, merchantId={}", paymentId, merchantId);

        // 7. Create transaction
        CreateTransactionRequest transactionRequest = new CreateTransactionRequest(payment.getId(), payment.getAmount(), TransactionType.DEBIT);

        log.debug("Creating transaction for payment. paymentId={}, amount={}", paymentId, payment.getAmount());

        TransactionResponse transaction = transactionService.createTransaction(transactionRequest);

        log.info("Transaction created. paymentId={}, transactionId={}", paymentId, transaction.transactionId());

        // 8. Mark transaction SUCCESS
        transactionService.updateStatus(transaction.transactionId(), new UpdateTransactionStatusRequest(TransactionStatus.SUCCESS));

        log.info("Transaction marked SUCCESS. paymentId={}, transactionId={}", paymentId, transaction.transactionId());

        // 9. Create ledger entry
        // LedgerService acquires the pessimistic lock on the merchant account.
        ledgerService.createLedgerEntryForMerchant(merchantId, transaction.transactionId(), payment.getAmount(), LedgerEntryType.CREDIT, "Payment received for order " + order.getOrderNumber());

        log.info("Payment processing completed successfully. paymentId={}, transactionId={}", paymentId, transaction.transactionId());
    }
}