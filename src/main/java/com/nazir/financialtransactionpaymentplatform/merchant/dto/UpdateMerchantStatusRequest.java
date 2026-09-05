package com.nazir.financialtransactionpaymentplatform.merchant.dto;

import com.nazir.financialtransactionpaymentplatform.merchant.entity.MerchantStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateMerchantStatusRequest {

    @NotNull(message = "status is required")
    public MerchantStatus status;
}
