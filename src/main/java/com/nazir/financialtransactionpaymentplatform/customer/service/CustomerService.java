package com.nazir.financialtransactionpaymentplatform.customer.service;

import com.nazir.financialtransactionpaymentplatform.customer.dto.*;
import com.nazir.financialtransactionpaymentplatform.customer.entity.Customer;
import com.nazir.financialtransactionpaymentplatform.customer.repository.CustomerRepository;
import com.nazir.financialtransactionpaymentplatform.common.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public CustomerResponse createCustomer(CreateCustomerRequest request) {

        if (repository.existsByEmailAndDeletedFalse(request.email)) {
            throw new IllegalArgumentException("Customer with email already exists");
        }

        Customer customer = new Customer();

        customer.setName(request.name);
        customer.setEmail(request.email);
        customer.setPhone(request.phone);

        Customer savedCustomer = repository.save(customer);

        return CustomerResponse.from(savedCustomer);
    }

    public List<CustomerResponse> getCustomers() {

        return repository.findAllByDeletedFalse()
                .stream()
                .map(CustomerResponse::from)
                .toList();
    }

    public CustomerResponse getCustomer(UUID customerId) {

        Customer customer = repository.findByIdAndDeletedFalse(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

        return CustomerResponse.from(customer);
    }

    public CustomerResponse updateCustomer(UUID customerId, UpdateCustomerRequest request) {

        Customer customer = repository.findByIdAndDeletedFalse(customerId).orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found: " + customerId));

        if (!customer.getEmail().equals(request.email) && repository.existsByEmailAndDeletedFalse(request.email)) {
            throw new IllegalArgumentException("Customer with email already exists");
        }

        customer.setName(request.name);
        customer.setEmail(request.email);
        customer.setPhone(request.phone);

        Customer savedCustomer = repository.save(customer);

        return CustomerResponse.from(savedCustomer);
    }

    public CustomerResponse updateCustomerStatus(UUID customerId, UpdateCustomerStatusRequest request) {

        Customer customer = repository.findByIdAndDeletedFalse(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

        customer.setStatus(request.status);

        Customer savedCustomer = repository.save(customer);

        return CustomerResponse.from(savedCustomer);
    }

    public ResponseEntity<String> deleteCustomer(UUID customerId) {

        Customer customer = repository.findByIdAndDeletedFalse(customerId).orElseThrow(() ->
                        new ResourceNotFoundException("Customer not found: " + customerId));

        customer.setDeleted(true);

        repository.save(customer);

        return ResponseEntity.ok("Customer deleted successfully");
    }
}