package com.nazir.financialtransactionpaymentplatform.customer.controller;

import com.nazir.financialtransactionpaymentplatform.customer.dto.*;
import com.nazir.financialtransactionpaymentplatform.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        return service.createCustomer(request);
    }

    @GetMapping
    public List<CustomerResponse> getCustomers() {
        return service.getCustomers();
    }

    @GetMapping("/{customerId}")
    public CustomerResponse getCustomer(@PathVariable UUID customerId) {
        return service.getCustomer(customerId);
    }

    @PutMapping("/{customerId}")
    public CustomerResponse updateCustomer(@PathVariable UUID customerId, @Valid @RequestBody UpdateCustomerRequest request) {
        return service.updateCustomer(customerId, request);
    }

    @PatchMapping("/{customerId}/status")
    public CustomerResponse updateCustomerStatus(@PathVariable UUID customerId, @Valid @RequestBody UpdateCustomerStatusRequest request) {
        return service.updateCustomerStatus(customerId, request);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<String> deleteCustomer(@PathVariable UUID customerId) {
        return service.deleteCustomer(customerId);
    }
}