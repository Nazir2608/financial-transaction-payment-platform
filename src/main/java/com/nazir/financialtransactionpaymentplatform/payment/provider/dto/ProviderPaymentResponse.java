package com.nazir.financialtransactionpaymentplatform.payment.provider.dto;

public record ProviderPaymentResponse(
        String providerReferenceId,
        ProviderPaymentStatus status,
        String message
) {
}