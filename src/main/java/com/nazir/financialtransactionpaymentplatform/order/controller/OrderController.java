package com.nazir.financialtransactionpaymentplatform.order.controller;

import com.nazir.financialtransactionpaymentplatform.order.dto.CreateOrderRequest;
import com.nazir.financialtransactionpaymentplatform.order.dto.OrderResponse;
import com.nazir.financialtransactionpaymentplatform.order.dto.UpdateOrderStatusRequest;
import com.nazir.financialtransactionpaymentplatform.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return service.getAllOrders();
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable UUID orderId) {
        return service.getOrder(orderId);
    }

    @GetMapping("/merchant/{merchantId}")
    public List<OrderResponse> getOrdersByMerchantId(@PathVariable UUID merchantId) {
        return service.getOrdersByMerchantId(merchantId);
    }


    @GetMapping("/customer/{customerId}")
    public List<OrderResponse> getOrdersByCustomerId(@PathVariable UUID customerId) {
        return service.getOrdersByCustomerId(customerId);
    }

    @PatchMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(@PathVariable UUID orderId, @Valid @RequestBody UpdateOrderStatusRequest request) {
        System.out.println("Request reached!!");
        return service.updateOrderStatus(orderId, request);
    }

}