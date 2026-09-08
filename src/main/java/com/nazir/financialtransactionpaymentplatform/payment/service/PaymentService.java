package com.nazir.financialtransactionpaymentplatform.payment.service;

import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import com.nazir.financialtransactionpaymentplatform.order.entity.Order;
import com.nazir.financialtransactionpaymentplatform.order.repository.OrderRepository;
import com.nazir.financialtransactionpaymentplatform.payment.dto.CreatePaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.dto.PaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.dto.UpdatePaymentStatusRequest;
import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;
import com.nazir.financialtransactionpaymentplatform.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {

        Order order = orderRepository.findById(request.orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + request.orderId));

        Payment payment = new Payment();

        payment.setOrder(order);
        payment.setAmount(request.amount);
        payment.setPaymentMethod(request.paymentMethod);
        payment.setStatus(PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);

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
            throw new IllegalArgumentException("Payment is already in status: " + currentStatus);
        }

        boolean valid = switch (currentStatus) {
            case PENDING -> newStatus == PaymentStatus.SUCCESS || newStatus == PaymentStatus.FAILED;
            case SUCCESS -> newStatus == PaymentStatus.REFUNDED;
            case FAILED, REFUNDED -> false;
        };

        if (!valid) {
            throw new IllegalArgumentException("Invalid payment status transition: " + currentStatus + " -> " + newStatus);
        }
    }

    public Payment getPaymentEntity(UUID paymentId) {
        return paymentRepository.findById(paymentId).orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));
    }

    public Payment getPaymentForProcessing(UUID paymentId) {
        return paymentRepository.findByIdForUpdate(paymentId).orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
    }
}