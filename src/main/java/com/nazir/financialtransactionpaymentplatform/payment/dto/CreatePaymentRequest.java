package com.nazir.financialtransactionpaymentplatform.payment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class CreatePaymentRequest {

    @NotNull
    private UUID orderId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;

    @NotBlank
    private String paymentMethod;

    @NotBlank
    private String idempotencyKey;

    @NotBlank
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a 3-letter uppercase code")
    private String currency;
}