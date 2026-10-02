package com.nazir.financialtransactionpaymentplatform.payment.provider;

import com.nazir.financialtransactionpaymentplatform.payment.provider.PaymentProvider;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentStatus;

import java.util.Objects;

public class MockPaymentProvider implements PaymentProvider {

    @Override
    public ProviderPaymentResponse processPayment(ProviderPaymentRequest request) {
        Objects.requireNonNull(request, "Payment request must not be null");

        if (request.amount() == null || request.amount().signum() <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }

        if (request.paymentId() == null || request.paymentId().isBlank()) {
            throw new IllegalArgumentException("Payment ID must not be blank");
        }

        String providerReferenceId = "MOCK-" + request.paymentId();

        return new ProviderPaymentResponse(providerReferenceId, ProviderPaymentStatus.SUCCESS, "Mock payment processed successfully");
    }
}