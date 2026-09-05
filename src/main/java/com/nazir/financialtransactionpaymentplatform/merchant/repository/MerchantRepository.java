package com.nazir.financialtransactionpaymentplatform.merchant.repository;

import com.nazir.financialtransactionpaymentplatform.merchant.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant,UUID>{
    boolean existsByEmailAndDeletedFalse(String email);

    List<Merchant> findAllByDeletedFalse();

    Optional<Merchant> findByIdAndDeletedFalse(UUID merchantId);

}
