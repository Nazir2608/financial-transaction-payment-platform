package com.nazir.financialtransactionpaymentplatform.merchant.controller;

import com.nazir.financialtransactionpaymentplatform.common.response.ApiResponse;
import com.nazir.financialtransactionpaymentplatform.merchant.dto.CreateMerchantRequest;
import com.nazir.financialtransactionpaymentplatform.merchant.dto.MerchantResponse;
import com.nazir.financialtransactionpaymentplatform.merchant.dto.UpdateMerchantRequest;
import com.nazir.financialtransactionpaymentplatform.merchant.dto.UpdateMerchantStatusRequest;
import com.nazir.financialtransactionpaymentplatform.merchant.service.MerchantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/merchants")
public class MerchantController {

    private final MerchantService service;


    public MerchantController(MerchantService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MerchantResponse> createMerchant(@Valid @RequestBody CreateMerchantRequest request) {
        MerchantResponse response = service.createMerchant(request);
        return ApiResponse.success(response, "Merchant created successfully");

    }

    @GetMapping
    public ApiResponse<List<MerchantResponse>> findMerchants() {
        List<MerchantResponse> responses = service.getMerchants();
        return ApiResponse.success(responses,"Merchants fetched successfully");
    }

    @GetMapping("/{merchantId}")
    public ApiResponse<MerchantResponse> findMerchantById(@PathVariable UUID merchantId) {
        MerchantResponse response = service.getMerchant(merchantId);
        return ApiResponse.success(response,"Merchant fetched successfully");
    }

    @PatchMapping("/{merchantId}/status")
    public ApiResponse<MerchantResponse> updateMerchantStatus(@PathVariable("merchantId") UUID merchantId, @Valid @RequestBody UpdateMerchantStatusRequest request) {
        MerchantResponse response = service.updateMerchantStatus(merchantId, request);
        return ApiResponse.success(response,"Merchant Status updated successfully");

    }

    @PutMapping("/{merchantId}")
    public ApiResponse<MerchantResponse> updateMerchant(@PathVariable UUID merchantId, @Valid @RequestBody UpdateMerchantRequest request) {
        MerchantResponse response = service.updateMerchant(merchantId, request);
        return ApiResponse.success(response,"Merchant updated successfully");
    }

    @DeleteMapping("/{merchantId}")
    public ApiResponse<String> deleteMerchant(@PathVariable UUID merchantId) {
        String response = service.deleteMerchant(merchantId);
        return ApiResponse.success(response);
    }

}
