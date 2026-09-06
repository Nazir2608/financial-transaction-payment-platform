package com.nazir.financialtransactionpaymentplatform.payment.dto;

import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;
import jakarta.validation.constraints.NotNull;

public class UpdatePaymentStatusRequest {

    @NotNull(message = "Status is required")
    public PaymentStatus status;
}