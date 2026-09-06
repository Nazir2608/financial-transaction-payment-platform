package com.nazir.financialtransactionpaymentplatform.order.dto;

import com.nazir.financialtransactionpaymentplatform.order.entity.Order;
import com.nazir.financialtransactionpaymentplatform.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    public UUID orderId;
    public String orderNumber;

    public UUID merchantId;
    public UUID customerId;

    public BigDecimal amount;
    public String currency;

    public OrderStatus status;

    public Instant createdAt;
    public Instant updatedAt;

    public static OrderResponse from(Order order) {

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getMerchant().getId(),
                order.getCustomer().getId(),
                order.getAmount(),
                order.getCurrency(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}