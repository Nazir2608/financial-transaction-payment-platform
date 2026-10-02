package com.nazir.financialtransactionpaymentplatform.payment.provider.mock;

import com.nazir.financialtransactionpaymentplatform.payment.provider.MockPaymentProvider;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class MockPaymentProviderTest {

    private MockPaymentProvider mockPaymentProvider;

    @BeforeEach
    void setUp() {
        mockPaymentProvider = new MockPaymentProvider();
    }

    @Test
    void shouldReturnSuccessForValidPaymentRequest() {
        // Arrange
        ProviderPaymentRequest request = validRequest();
        // Act
        ProviderPaymentResponse response = mockPaymentProvider.processPayment(request);
        // Assert
        assertNotNull(response);
        assertEquals(ProviderPaymentStatus.SUCCESS, response.status());
        assertEquals("MOCK-PAY-1001", response.providerReferenceId());
        assertEquals("Mock payment processed successfully", response.message());
    }

    @Test
    void shouldGenerateDeterministicProviderReference() {
        // Arrange
        ProviderPaymentRequest request = validRequest();

        // Act
        ProviderPaymentResponse firstResponse = mockPaymentProvider.processPayment(request);

        ProviderPaymentResponse secondResponse = mockPaymentProvider.processPayment(request);
        // Assert
        assertEquals(firstResponse.providerReferenceId(), secondResponse.providerReferenceId());
    }

    @Test
    void shouldRejectNullRequest() {
        assertThrows(NullPointerException.class, () -> mockPaymentProvider.processPayment(null)
        );
    }

    @Test
    void shouldRejectNullAmount() {
        ProviderPaymentRequest request = new ProviderPaymentRequest(
                "PAY-1001",
                null,
                "INR",
                "UPI",
                "idem-1001"
        );
        assertThrows(IllegalArgumentException.class, () -> mockPaymentProvider.processPayment(request));
    }

    @Test
    void shouldRejectZeroAmount() {
        ProviderPaymentRequest request = new ProviderPaymentRequest(
                "PAY-1001",
                BigDecimal.ZERO,
                "INR",
                "UPI",
                "idem-1001"
        );

        assertThrows(IllegalArgumentException.class, () -> mockPaymentProvider.processPayment(request));
    }

    @Test
    void shouldRejectNegativeAmount() {
        ProviderPaymentRequest request = new ProviderPaymentRequest(
                "PAY-1001",
                new BigDecimal("-100.00"),
                "INR",
                "UPI",
                "idem-1001"
        );

        assertThrows(IllegalArgumentException.class, () -> mockPaymentProvider.processPayment(request));
    }

    @Test
    void shouldRejectBlankPaymentId() {
        ProviderPaymentRequest request = new ProviderPaymentRequest(
                " ",
                new BigDecimal("1500.00"),
                "INR",
                "UPI",
                "idem-1001"
        );
        assertThrows(IllegalArgumentException.class, () -> mockPaymentProvider.processPayment(request));
    }

    private ProviderPaymentRequest validRequest() {
        return new ProviderPaymentRequest(
                "PAY-1001",
                new BigDecimal("1500.00"),
                "INR",
                "UPI",
                "idem-1001"
        );
    }
}