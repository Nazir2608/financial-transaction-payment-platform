package com.nazir.financialtransactionpaymentplatform.merchant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class CreateMerchantRequest {

    @NotBlank(message="name is required")
    @Size(max = 150)
    public String name;

    @NotBlank(message = "email is required")
    @Email(message = "Invalid email")
    public String email;

    @NotBlank(message = "Phone is required")
    @Size(min = 10, max = 20)
    public String phone;

    @NotBlank(message = "Business name is required")
    @Size(max = 200)
    public String businessName;
}
