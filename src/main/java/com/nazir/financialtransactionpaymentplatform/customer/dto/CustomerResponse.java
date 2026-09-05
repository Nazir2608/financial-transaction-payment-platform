package com.nazir.financialtransactionpaymentplatform.customer.dto;

import com.nazir.financialtransactionpaymentplatform.customer.entity.Customer;
import com.nazir.financialtransactionpaymentplatform.customer.entity.CustomerStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CustomerResponse {

    private UUID customerId;
    private String name;
    private String email;
    private String phone;
    private CustomerStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    public static CustomerResponse from(Customer customer) {

        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getStatus(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }
}