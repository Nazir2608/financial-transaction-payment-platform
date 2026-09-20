package com.nazir.financialtransactionpaymentplatform.payment.controller;

import com.nazir.financialtransactionpaymentplatform.common.response.ApiResponse;
import com.nazir.financialtransactionpaymentplatform.payment.dto.CreatePaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.dto.PaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.dto.UpdatePaymentStatusRequest;
import com.nazir.financialtransactionpaymentplatform.payment.service.PaymentProcessingService;
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
    private final PaymentProcessingService paymentProcessingService;

    public PaymentController(PaymentService service, PaymentProcessingService paymentProcessingService) {
        this.service = service;
        this.paymentProcessingService = paymentProcessingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<PaymentResponse> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        PaymentResponse response = service.createPayment(request);
        return ApiResponse.success(response, "Payment created successfully");
    }

    @GetMapping
    public ApiResponse<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> responses = service.getAllPayments();
        return ApiResponse.success(responses, "Payments fetched successfully");
    }

    @GetMapping("/{paymentId}")
    public ApiResponse<PaymentResponse> getPayment(@PathVariable UUID paymentId) {
        PaymentResponse response = service.getPayment(paymentId);
        return ApiResponse.success(response, "Payment fetched successfully");
    }

    @GetMapping("/order/{orderId}")
    public ApiResponse<List<PaymentResponse>> getPaymentsByOrder(@PathVariable UUID orderId) {
        List<PaymentResponse> responses = service.getPaymentsByOrder(orderId);
        return ApiResponse.success(responses, "Payments fetched successfully for order");
    }

    @PatchMapping("/{paymentId}/status")
    public ApiResponse<PaymentResponse> updatePaymentStatus(@PathVariable UUID paymentId, @Valid @RequestBody UpdatePaymentStatusRequest request) {
        PaymentResponse response = service.updatePaymentStatus(paymentId, request);
        return ApiResponse.success(response, "Payment status updated successfully");
    }

    @PostMapping("/{paymentId}/process")
    public ApiResponse<String> processPayment(@PathVariable UUID paymentId) {
        paymentProcessingService.processPayment(paymentId);
        return ApiResponse.success("Payment processed successfully");
    }
}