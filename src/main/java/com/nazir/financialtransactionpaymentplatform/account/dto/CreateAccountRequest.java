package com.nazir.financialtransactionpaymentplatform.account.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateAccountRequest(

        @NotNull(message = "Merchant ID is required")
        UUID merchantId

) {
}