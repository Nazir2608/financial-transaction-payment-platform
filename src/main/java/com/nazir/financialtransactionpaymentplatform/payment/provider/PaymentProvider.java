package com.nazir.financialtransactionpaymentplatform.payment.provider;

import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentResponse;

public interface PaymentProvider {
    ProviderPaymentResponse processPayment(ProviderPaymentRequest request);
}