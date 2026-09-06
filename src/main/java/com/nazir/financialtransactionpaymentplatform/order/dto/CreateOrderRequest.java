package com.nazir.financialtransactionpaymentplatform.order.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateOrderRequest {

    @NotNull(message = "Merchant ID is required")
    public UUID merchantId;

    @NotNull(message = "Customer ID is required")
    public UUID customerId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    public BigDecimal amount;

    @NotNull(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must contain exactly 3 characters")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a valid 3-letter uppercase code")
    public String currency;
}