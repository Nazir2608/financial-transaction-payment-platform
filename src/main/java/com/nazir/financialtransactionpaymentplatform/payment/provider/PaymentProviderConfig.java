package com.nazir.financialtransactionpaymentplatform.payment.provider;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentProviderConfig {

    @Bean
    @ConditionalOnProperty(name = "fincore.payment.provider", havingValue = "mock", matchIfMissing = true)
    public PaymentProvider paymentProvider() {
        return new MockPaymentProvider();
    }
}