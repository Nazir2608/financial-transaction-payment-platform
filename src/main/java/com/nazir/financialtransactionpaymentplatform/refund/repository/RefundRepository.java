package com.nazir.financialtransactionpaymentplatform.refund.repository;

import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.refund.entity.Refund;
import com.nazir.financialtransactionpaymentplatform.refund.entity.RefundStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefundRepository extends JpaRepository<Refund, UUID> {

    Optional<Refund> findByIdempotencyKey(String idempotencyKey);

    List<Refund> findByPayment_Id(UUID paymentId);

    List<Refund> findByPayment_IdAndStatus(UUID paymentId, RefundStatus status);

    @Query("""
    SELECT COALESCE(SUM(r.amount), 0)
    FROM Refund r
    WHERE r.payment.id = :paymentId
      AND r.status = :status
    """)
    BigDecimal sumAmountByPaymentIdAndStatus(@Param("paymentId") UUID paymentId, @Param("status") RefundStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Payment p WHERE p.id = :paymentId")
    Optional<Payment> findByIdForUpdate(@Param("paymentId") UUID paymentId);

}