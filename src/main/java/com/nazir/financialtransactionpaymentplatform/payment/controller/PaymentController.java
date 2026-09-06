package com.nazir.financialtransactionpaymentplatform.payment.controller;

import com.nazir.financialtransactionpaymentplatform.payment.dto.CreatePaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.dto.PaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.dto.UpdatePaymentStatusRequest;
import com.nazir.financialtransactionpaymentplatform.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        return service.createPayment(request);
    }

    @GetMapping("/{paymentId}")
    public PaymentResponse getPayment(@PathVariable UUID paymentId) {
        return service.getPayment(paymentId);
    }

    @GetMapping("/order/{orderId}")
    public List<PaymentResponse> getPaymentsByOrder(@PathVariable UUID orderId) {
        return service.getPaymentsByOrder(orderId);
    }

    @PatchMapping("/{paymentId}/status")
    public PaymentResponse updatePaymentStatus(@PathVariable UUID paymentId, @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return service.updatePaymentStatus(paymentId, request);
    }
}