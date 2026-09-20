package com.nazir.financialtransactionpaymentplatform.payment.service;

import com.nazir.financialtransactionpaymentplatform.common.exception.BusinessException;
import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import com.nazir.financialtransactionpaymentplatform.order.entity.Order;
import com.nazir.financialtransactionpaymentplatform.order.repository.OrderRepository;
import com.nazir.financialtransactionpaymentplatform.payment.dto.CreatePaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.dto.PaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.dto.UpdatePaymentStatusRequest;
import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;
import com.nazir.financialtransactionpaymentplatform.payment.repository.PaymentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        log.info("Creating payment. orderId={}, idempotencyKey={}", request.getOrderId(), request.getIdempotencyKey());

        // 1. Check for duplicate request
        Optional<Payment> existingPayment = paymentRepository.findByIdempotencyKey(request.getIdempotencyKey());

        if (existingPayment.isPresent()) {
            Payment payment = existingPayment.get();
            log.info("Duplicate payment request detected. paymentId={}, idempotencyKey={}", payment.getId(), request.getIdempotencyKey());
            return PaymentResponse.from(payment);
        }

        // 2. Find order
        Order order = orderRepository.findById(request.getOrderId()).orElseThrow(() -> {
                    log.warn("Order not found. orderId={}", request.getOrderId());
                    return new ResourceNotFoundException("Order not found: " + request.getOrderId());
        });

        // 3. Create payment
        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setIdempotencyKey(request.getIdempotencyKey());

        // 4. Save
        Payment savedPayment = paymentRepository.save(payment);

        log.info("Payment created successfully. paymentId={}, orderId={}", savedPayment.getId(), request.getOrderId());

        return PaymentResponse.from(savedPayment);
    }

    public PaymentResponse getPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));
        return PaymentResponse.from(payment);
    }

    public List<PaymentResponse> getPaymentsByOrder(UUID orderId) {
        return paymentRepository.findAllByOrderId(orderId).stream().map(PaymentResponse::from).toList();
    }

    public PaymentResponse updatePaymentStatus(UUID paymentId, UpdatePaymentStatusRequest request) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));

        PaymentStatus currentStatus = payment.getStatus();
        PaymentStatus newStatus = request.status;

        validateStatusTransition(currentStatus, newStatus);

        payment.setStatus(newStatus);

        Payment savedPayment = paymentRepository.save(payment);

        return PaymentResponse.from(savedPayment);
    }

    private void validateStatusTransition(PaymentStatus currentStatus, PaymentStatus newStatus) {

        if (currentStatus == newStatus) {
            throw new BusinessException("Payment is already in status: " + currentStatus);
        }

        boolean valid = switch (currentStatus) {
            case PENDING -> newStatus == PaymentStatus.SUCCESS || newStatus == PaymentStatus.FAILED;
            case SUCCESS -> newStatus == PaymentStatus.REFUNDED;
            case FAILED, REFUNDED -> false;
        };

        if (!valid) {
            throw new BusinessException("Invalid payment status transition: " + currentStatus + " -> " + newStatus);
        }
    }

    public Payment getPaymentEntity(UUID paymentId) {
        return paymentRepository.findById(paymentId).orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));
    }

    public Payment getPaymentForProcessing(UUID paymentId) {
        return paymentRepository.findByIdForUpdate(paymentId).orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream().map(PaymentResponse::from).toList();
    }
}