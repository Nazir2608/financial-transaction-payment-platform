package com.nazir.financialtransactionpaymentplatform.order.controller;

import com.nazir.financialtransactionpaymentplatform.common.response.ApiResponse;
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
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = service.createOrder(request);
        return ApiResponse.success(response, "Order created successfully");
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> responses = service.getAllOrders();
        return ApiResponse.success(responses, "Orders fetched successfully");

    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable UUID orderId) {
        OrderResponse response = service.getOrder(orderId);
        return ApiResponse.success(response, "Order fetched successfully");

    }

    @GetMapping("/merchant/{merchantId}")
    public ApiResponse<List<OrderResponse>> getOrdersByMerchantId(@PathVariable UUID merchantId) {
        List<OrderResponse> responses = service.getOrdersByMerchantId(merchantId);
        return ApiResponse.success(responses, "Orders fetched successfully based on merchant id");

    }


    @GetMapping("/customer/{customerId}")
    public ApiResponse<List<OrderResponse>> getOrdersByCustomerId(@PathVariable UUID customerId) {
        List<OrderResponse> responses = service.getOrdersByCustomerId(customerId);
        return ApiResponse.success(responses, "Orders fetched successfully based on customer id");

    }

    @PatchMapping("/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable UUID orderId, @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = service.updateOrderStatus(orderId, request);
        return ApiResponse.success(response, "Order status updated successfully");
    }

}