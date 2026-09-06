package com.nazir.financialtransactionpaymentplatform.account.repository;

import com.nazir.financialtransactionpaymentplatform.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByMerchantId(UUID merchantId);

    boolean existsByMerchantId(UUID merchantId);
}