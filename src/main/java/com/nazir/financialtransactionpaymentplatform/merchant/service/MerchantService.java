package com.nazir.financialtransactionpaymentplatform.merchant.service;

import com.nazir.financialtransactionpaymentplatform.common.exception.DuplicateResourceException;
import com.nazir.financialtransactionpaymentplatform.merchant.dto.CreateMerchantRequest;
import com.nazir.financialtransactionpaymentplatform.merchant.dto.MerchantResponse;
import com.nazir.financialtransactionpaymentplatform.merchant.entity.Merchant;
import com.nazir.financialtransactionpaymentplatform.merchant.repository.MerchantRepository;
import org.springframework.stereotype.Service;

@Service
public class MerchantService {

    private final MerchantRepository repository;

    public MerchantService(MerchantRepository repository) {
        this.repository = repository;
    }

    public MerchantResponse createMerchant(CreateMerchantRequest request) {

        if (repository.existsByEmail(request.email)) {
            throw new DuplicateResourceException("Merchant with email already exists");
        }

        Merchant merchant = new Merchant();

        merchant.setName(request.name);
        merchant.setEmail(request.email);
        merchant.setPhone(request.phone);
        merchant.setBusinessName(request.businessName);

        Merchant savedMerchant = repository.save(merchant);

        return MerchantResponse.from(savedMerchant);

    }

}
