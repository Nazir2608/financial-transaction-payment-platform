package com.nazir.financialtransactionpaymentplatform.order.repository;

import com.nazir.financialtransactionpaymentplatform.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByIdAndDeletedFalse(UUID orderId);

    List<Order> findAllByDeletedFalse();

    List<Order> findAllByMerchantIdAndDeletedFalse(UUID merchantId);

    List<Order> findAllByCustomerIdAndDeletedFalse(UUID customerId);

    boolean existsByOrderNumber(String orderNumber);
}