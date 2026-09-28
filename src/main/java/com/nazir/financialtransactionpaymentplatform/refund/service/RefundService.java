package com.nazir.financialtransactionpaymentplatform.refund.service;

import com.nazir.financialtransactionpaymentplatform.common.exception.BusinessException;
import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import com.nazir.financialtransactionpaymentplatform.ledger.entity.LedgerEntryType;
import com.nazir.financialtransactionpaymentplatform.ledger.service.LedgerService;
import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;
import com.nazir.financialtransactionpaymentplatform.payment.repository.PaymentRepository;
import com.nazir.financialtransactionpaymentplatform.refund.dto.CreateRefundRequest;
import com.nazir.financialtransactionpaymentplatform.refund.entity.Refund;
import com.nazir.financialtransactionpaymentplatform.refund.entity.RefundStatus;
import com.nazir.financialtransactionpaymentplatform.refund.repository.RefundRepository;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.Transaction;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionStatus;
import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionType;
import com.nazir.financialtransactionpaymentplatform.transaction.repository.TransactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class RefundService {

    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final TransactionRepository transactionRepository;
    private final LedgerService ledgerService;

    public RefundService(PaymentRepository paymentRepository, RefundRepository refundRepository, TransactionRepository transactionRepository, LedgerService ledgerService) {
        this.paymentRepository = paymentRepository;
        this.refundRepository = refundRepository;
        this.transactionRepository = transactionRepository;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public Refund createRefund(UUID paymentId, CreateRefundRequest request) {

        // 1. Lock the payment row.
        Payment payment = paymentRepository.findByIdForUpdate(paymentId).orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));

        // 2. Handle an idempotent retry.
        Refund existing = refundRepository.findByIdempotencyKey(request.idempotencyKey()).orElse(null);

        if (existing != null) {

            boolean sameRequest = existing.getPayment().getId().equals(paymentId)
                    && existing.getAmount().compareTo(request.amount()) == 0
                    && java.util.Objects.equals(
                    existing.getReason(),
                    request.reason()
            );

            if (!sameRequest) {
                throw new BusinessException("Idempotency key was already used for a different refund request");
            }

            return existing;
        }

        // 3. A refund can only be made against a successful payment.
        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BusinessException("Only successful payments can be refunded");
        }

        // 4. Validate the requested amount.
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Refund amount must be greater than zero");
        }

        // 5. Calculate the amount already successfully refunded.
        BigDecimal alreadyRefunded = refundRepository.sumAmountByPaymentIdAndStatus(paymentId, RefundStatus.SUCCESS);

        if (alreadyRefunded == null) {
            alreadyRefunded = BigDecimal.ZERO;
        }

        BigDecimal refundableAmount = payment.getAmount().subtract(alreadyRefunded);

        if (request.amount().compareTo(refundableAmount) > 0) {
            throw new BusinessException("Refund amount exceeds the remaining refundable amount: " + refundableAmount);
        }

        // 6. Get the merchant and currency from the original order.
        var order = payment.getOrder();
        UUID merchantId = order.getMerchant().getId();

        // 7. Create the refund record.
        Refund refund = new Refund();
        refund.setPayment(payment);
        refund.setAmount(request.amount());
        refund.setCurrency(order.getCurrency());
        refund.setReason(request.reason());
        refund.setIdempotencyKey(request.idempotencyKey());
        refund.setStatus(RefundStatus.PENDING);

        Refund savedRefund = refundRepository.saveAndFlush(refund);

        // 8. Create the refund transaction.
        Transaction transaction = new Transaction();
        transaction.setPaymentId(paymentId);
        transaction.setRefundId(savedRefund.getId());
        transaction.setAmount(request.amount());
        transaction.setType(TransactionType.REFUND);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setReference("REF-" + UUID.randomUUID());

        Transaction savedTransaction = transactionRepository.saveAndFlush(transaction);

        // 9. Debit the merchant ledger.
        // This locks the account and rejects insufficient balances.
        ledgerService.createLedgerEntryForMerchant(merchantId, savedTransaction.getId(), request.amount(), LedgerEntryType.DEBIT, "Refund for payment " + paymentId);

        // 10. Mark the transaction and refund successful.
        savedTransaction.setStatus(TransactionStatus.SUCCESS);
        savedRefund.setStatus(RefundStatus.SUCCESS);

        transactionRepository.save(savedTransaction);
        Refund completedRefund = refundRepository.save(savedRefund);

        log.info("Refund completed. refundId={}, paymentId={}, transactionId={}, amount={}", completedRefund.getId(), paymentId, savedTransaction.getId(), completedRefund.getAmount());

        return completedRefund;
    }

    @Transactional(readOnly = true)
    public Refund getRefund(UUID refundId) {
        return refundRepository.findById(refundId).orElseThrow(() -> new ResourceNotFoundException("Refund not found: " + refundId));
    }

    @Transactional(readOnly = true)
    public List<Refund> getRefundsByPayment(UUID paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new ResourceNotFoundException("Payment not found: " + paymentId);
        }
        return refundRepository.findByPayment_Id(paymentId);
    }

    @Transactional(readOnly = true)
    public List<Refund> getAllRefunds() {
        return refundRepository.findAll();
    }
}