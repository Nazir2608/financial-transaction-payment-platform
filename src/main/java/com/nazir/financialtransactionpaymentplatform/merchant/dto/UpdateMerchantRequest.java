package com.nazir.financialtransactionpaymentplatform.merchant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateMerchantRequest {

    @NotBlank(message = "name is required")
    @Size(max = 150, message = "name must not exceed 150 characters")
    public String name;

    @NotBlank(message = "email is required")
    @Email(message = "Invalid email")
    public String email;

    @NotBlank(message = "Phone is required")
    @Size(min = 10, max = 20, message = "phone must be between 10 and 20 characters")
    public String phone;

    @NotBlank(message = "Business name is required")
    @Size(max = 200, message = "business name must not exceed 200 characters")
    public String businessName;
}