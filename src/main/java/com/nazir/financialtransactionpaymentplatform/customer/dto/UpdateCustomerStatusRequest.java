package com.nazir.financialtransactionpaymentplatform.customer.dto;

import com.nazir.financialtransactionpaymentplatform.customer.entity.CustomerStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateCustomerStatusRequest {

    @NotNull(message = "Status is required")
    public CustomerStatus status;
}