package com.nazir.financialtransactionpaymentplatform.merchant.controller;

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
    public MerchantResponse createMerchant(@Valid @RequestBody CreateMerchantRequest request) {
        return service.createMerchant(request);
    }

    @GetMapping
    public List<MerchantResponse> findMerchants() {
        return service.getMerchants();
    }

    @GetMapping("/{merchantId}")
    public MerchantResponse findMerchantById(@PathVariable UUID merchantId) {
        return service.getMerchant(merchantId);
    }

    @PatchMapping("/{merchantId}/status")
    public MerchantResponse updateMerchantStatus(@PathVariable("merchantId") UUID merchantId, @Valid @RequestBody UpdateMerchantStatusRequest request) {
        return service.updateMerchantStatus(merchantId, request);
    }

    @PutMapping("/{merchantId}")
    public MerchantResponse updateMerchant(@PathVariable UUID merchantId, @Valid @RequestBody UpdateMerchantRequest request) {
        System.out.println("update request received!!!");
        return service.updateMerchant(merchantId, request);
    }

    @DeleteMapping("/{merchantId}")
    public ResponseEntity<String> deleteMerchant(@PathVariable UUID merchantId) {
        return service.deleteMerchant(merchantId);
    }

}
