package com.nazir.financialtransactionpaymentplatform.payment.provider;

import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PaymentProviderConfigTest {

    @Autowired
    private PaymentProvider paymentProvider;

    @Test
    void shouldRegisterMockPaymentProviderBean() {
        assertNotNull(paymentProvider);
        assertInstanceOf(MockPaymentProvider.class, paymentProvider);
    }

    @Test
    void shouldProcessPaymentThroughInjectedProvider() {
        ProviderPaymentRequest request = new ProviderPaymentRequest(
                "PAY-1001",
                new BigDecimal("1500.00"),
                "INR",
                "UPI",
                "idem-1001"
        );

        ProviderPaymentResponse response = paymentProvider.processPayment(request);
        assertEquals(ProviderPaymentStatus.SUCCESS, response.status());
        assertEquals("MOCK-PAY-1001", response.providerReferenceId());
    }
}