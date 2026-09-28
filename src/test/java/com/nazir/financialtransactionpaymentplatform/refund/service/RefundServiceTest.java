package com.nazir.financialtransactionpaymentplatform.refund.service;

import com.nazir.financialtransactionpaymentplatform.common.exception.BusinessException;
import com.nazir.financialtransactionpaymentplatform.ledger.service.LedgerService;
import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;
import com.nazir.financialtransactionpaymentplatform.payment.repository.PaymentRepository;
import com.nazir.financialtransactionpaymentplatform.refund.dto.CreateRefundRequest;
import com.nazir.financialtransactionpaymentplatform.refund.entity.Refund;
import com.nazir.financialtransactionpaymentplatform.refund.entity.RefundStatus;
import com.nazir.financialtransactionpaymentplatform.refund.repository.RefundRepository;
import com.nazir.financialtransactionpaymentplatform.transaction.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefundServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private RefundRepository refundRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private LedgerService ledgerService;

    @InjectMocks
    private RefundService refundService;

    private UUID paymentId;
    private Payment payment;

    @BeforeEach
    void setUp() {
        paymentId = UUID.randomUUID();
        payment = mock(Payment.class);
        when(paymentRepository.findByIdForUpdate(paymentId)).thenReturn(Optional.of(payment));

    }

    @Test
    void shouldRejectRefundExceedingRemainingAmount() {
        when(payment.getStatus()).thenReturn(PaymentStatus.SUCCESS);

        when(payment.getAmount()).thenReturn(new BigDecimal("2000.00"));
        // Given: payment = 2000, already refunded = 1902
        when(refundRepository.findByIdempotencyKey("refund-limit-test"))
                .thenReturn(Optional.empty());

        when(refundRepository.sumAmountByPaymentIdAndStatus(
                paymentId, RefundStatus.SUCCESS))
                .thenReturn(new BigDecimal("1902.00"));

        CreateRefundRequest request = new CreateRefundRequest(
                new BigDecimal("99.00"),
                "Refund limit test",
                "refund-limit-test"
        );

        // When / Then: only 98 remains, so 99 must be rejected
        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> refundService.createRefund(paymentId, request)
        );

        assertEquals(
                "Refund amount exceeds the remaining refundable amount: 98.00",
                exception.getMessage()
        );

        // A rejected refund must not create financial records or touch the ledger.
        verify(refundRepository, never()).saveAndFlush(any(Refund.class));
        verify(transactionRepository, never()).saveAndFlush(any());
        verify(ledgerService, never()).createLedgerEntryForMerchant(
                any(), any(), any(), any(), any()
        );
    }

    @Test
    void shouldReturnExistingRefundForSameIdempotencyRequest() {
        // Given
        String key = "refund-idempotency-test";
        UUID refundId = UUID.randomUUID();

        Payment existingPayment = mock(Payment.class);
        when(existingPayment.getId()).thenReturn(paymentId);

        Refund existingRefund = mock(Refund.class);
        when(existingRefund.getPayment()).thenReturn(existingPayment);
        when(existingRefund.getAmount()).thenReturn(new BigDecimal("100.00"));
        when(existingRefund.getReason()).thenReturn("Customer requested refund");

        when(refundRepository.findByIdempotencyKey(key))
                .thenReturn(Optional.of(existingRefund));

        CreateRefundRequest request = new CreateRefundRequest(
                new BigDecimal("100.00"),
                "Customer requested refund",
                key
        );

        // When
        Refund result = refundService.createRefund(paymentId, request);

        // Then
        assertSame(existingRefund, result);

        verify(refundRepository, never()).saveAndFlush(any(Refund.class));
        verify(transactionRepository, never()).saveAndFlush(any());
        verifyNoInteractions(ledgerService);
    }

    @Test
    void shouldRejectSameIdempotencyKeyWithDifferentAmount() {
        // Given
        String key = "refund-conflict-test";

        Payment existingPayment = mock(Payment.class);
        when(existingPayment.getId()).thenReturn(paymentId);

        Refund existingRefund = mock(Refund.class);
        when(existingRefund.getPayment()).thenReturn(existingPayment);
        when(existingRefund.getAmount()).thenReturn(new BigDecimal("100.00"));

        when(refundRepository.findByIdempotencyKey(key))
                .thenReturn(Optional.of(existingRefund));

        CreateRefundRequest request = new CreateRefundRequest(
                new BigDecimal("50.00"),
                "Customer requested refund",
                key
        );

        // When / Then
        assertThrows(
                BusinessException.class,
                () -> refundService.createRefund(paymentId, request)
        );

        verify(refundRepository, never()).saveAndFlush(any(Refund.class));
        verify(transactionRepository, never()).saveAndFlush(any());
        verifyNoInteractions(ledgerService);
    }
}