package com.nazir.financialtransactionpaymentplatform.merchant.controller;

import com.nazir.financialtransactionpaymentplatform.merchant.dto.CreateMerchantRequest;
import com.nazir.financialtransactionpaymentplatform.merchant.dto.MerchantResponse;
import com.nazir.financialtransactionpaymentplatform.merchant.service.MerchantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchants")
public class MerchantController {

    private final MerchantService service;


    public MerchantController(MerchantService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MerchantResponse createMerchant(@Valid @RequestBody CreateMerchantRequest request){
        return service.createMerchant(request);
    }
}
