package com.nazir.financialtransactionpaymentplatform.payment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public class CreatePaymentRequest {

    @NotNull
    public UUID orderId;

    @NotNull
    @DecimalMin(value = "0.01")
    public BigDecimal amount;

    @NotBlank
    public String paymentMethod;
}