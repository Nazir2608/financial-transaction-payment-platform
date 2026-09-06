package com.nazir.financialtransactionpaymentplatform.order.controller;

import com.nazir.financialtransactionpaymentplatform.order.dto.CreateOrderRequest;
import com.nazir.financialtransactionpaymentplatform.order.dto.OrderResponse;
import com.nazir.financialtransactionpaymentplatform.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return service.createOrder(request);
    }
}