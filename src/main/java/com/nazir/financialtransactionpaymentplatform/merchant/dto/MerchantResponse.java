package com.nazir.financialtransactionpaymentplatform.merchant.dto;

import com.nazir.financialtransactionpaymentplatform.merchant.entity.Merchant;
import com.nazir.financialtransactionpaymentplatform.merchant.entity.MerchantStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MerchantResponse {
    UUID merchantId;
    String name;
    String email;
    String phone;
    String businessName;
    MerchantStatus status;
    Instant createdAt;


    public static MerchantResponse from(Merchant merchant){
        return new MerchantResponse(
                merchant.getId(),
                merchant.getName(),
                merchant.getEmail(),
                merchant.getPhone(),
                merchant.getBusinessName(),
                merchant.getStatus(),
                merchant.getCreatedAt()

        );
    }
}