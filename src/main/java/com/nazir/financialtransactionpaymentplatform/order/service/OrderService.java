package com.nazir.financialtransactionpaymentplatform.order.service;

import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import com.nazir.financialtransactionpaymentplatform.customer.entity.Customer;
import com.nazir.financialtransactionpaymentplatform.customer.repository.CustomerRepository;
import com.nazir.financialtransactionpaymentplatform.merchant.entity.Merchant;
import com.nazir.financialtransactionpaymentplatform.merchant.repository.MerchantRepository;
import com.nazir.financialtransactionpaymentplatform.order.dto.CreateOrderRequest;
import com.nazir.financialtransactionpaymentplatform.order.dto.OrderResponse;
import com.nazir.financialtransactionpaymentplatform.order.entity.Order;
import com.nazir.financialtransactionpaymentplatform.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MerchantRepository merchantRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository, MerchantRepository merchantRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.merchantRepository = merchantRepository;
        this.customerRepository = customerRepository;
    }

    public OrderResponse createOrder(CreateOrderRequest request) {

        Merchant merchant = merchantRepository.findByIdAndDeletedFalse(request.merchantId)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant not found: " + request.merchantId));

        Customer customer = customerRepository.findByIdAndDeletedFalse(request.customerId).orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found: " + request.customerId));

        Order order = new Order();

        order.setOrderNumber(generateOrderNumber());
        order.setMerchant(merchant);
        order.setCustomer(customer);
        order.setAmount(request.amount);
        order.setCurrency(request.currency);

        Order savedOrder = orderRepository.save(order);

        return OrderResponse.from(savedOrder);
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}