package com.nazir.financialtransactionpaymentplatform.customer.repository;

import com.nazir.financialtransactionpaymentplatform.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByIdAndDeletedFalse(UUID customerId);

    List<Customer> findAllByDeletedFalse();

    boolean existsByEmailAndDeletedFalse(String email);

}
