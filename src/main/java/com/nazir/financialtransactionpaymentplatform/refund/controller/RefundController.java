package com.nazir.financialtransactionpaymentplatform.refund.controller;

import com.nazir.financialtransactionpaymentplatform.refund.dto.CreateRefundRequest;
import com.nazir.financialtransactionpaymentplatform.refund.dto.RefundResponse;
import com.nazir.financialtransactionpaymentplatform.refund.service.RefundService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class RefundController {

    private final RefundService refundService;

    public RefundController(RefundService refundService) {
        this.refundService = refundService;
    }

    @PostMapping("/payments/{paymentId}/refunds")
    public RefundResponse createRefund(@PathVariable UUID paymentId, @Valid @RequestBody CreateRefundRequest request) {
        return RefundResponse.from(refundService.createRefund(paymentId, request));
    }

    @GetMapping("/refunds/{refundId}")
    public RefundResponse getRefund(@PathVariable UUID refundId) {
        return RefundResponse.from(refundService.getRefund(refundId));
    }

    @GetMapping("/payments/{paymentId}/refunds")
    public List<RefundResponse> getRefundsByPayment(@PathVariable UUID paymentId) {
        return refundService.getRefundsByPayment(paymentId)
                .stream()
                .map(RefundResponse::from)
                .toList();
    }

    @GetMapping("/refunds")
    public List<RefundResponse> getAllRefunds() {
        return refundService.getAllRefunds()
                .stream()
                .map(RefundResponse::from)
                .toList();
    }
}