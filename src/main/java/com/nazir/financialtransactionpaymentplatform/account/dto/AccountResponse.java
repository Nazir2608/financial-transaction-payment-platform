package com.nazir.financialtransactionpaymentplatform.account.dto;

import com.nazir.financialtransactionpaymentplatform.account.entity.Account;
import com.nazir.financialtransactionpaymentplatform.account.entity.AccountStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AccountResponse(

        UUID accountId,
        UUID merchantId,
        BigDecimal balance,
        AccountStatus status,
        Instant createdAt,
        Instant updatedAt

) {

    public static AccountResponse from(Account account) {

        return new AccountResponse(
                account.getId(),
                account.getMerchantId(),
                account.getBalance(),
                account.getStatus(),
                account.getCreatedAt(),
                account.getUpdatedAt()
        );
    }
}