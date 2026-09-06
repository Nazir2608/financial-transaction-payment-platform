package com.nazir.financialtransactionpaymentplatform.order.dto;

import com.nazir.financialtransactionpaymentplatform.order.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateOrderStatusRequest {

    @NotNull(message = "Status is required")
    public OrderStatus status;
}
