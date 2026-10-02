package com.nazir.financialtransactionpaymentplatform.payment.service;

import com.nazir.financialtransactionpaymentplatform.payment.dto.PaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.entity.Payment;
import com.nazir.financialtransactionpaymentplatform.payment.entity.PaymentStatus;
import com.nazir.financialtransactionpaymentplatform.payment.provider.PaymentProvider;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentRequest;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentResponse;
import com.nazir.financialtransactionpaymentplatform.payment.provider.dto.ProviderPaymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
@Slf4j
public class PaymentOrchestrationService {

    private final PaymentProvider paymentProvider;
    private final PaymentService paymentService;
    private final PaymentProcessingService paymentProcessingService;

    public PaymentOrchestrationService(
            PaymentProvider paymentProvider,
            PaymentService paymentService,
            PaymentProcessingService paymentProcessingService) {

        this.paymentProvider = paymentProvider;
        this.paymentService = paymentService;
        this.paymentProcessingService = paymentProcessingService;
    }

    public PaymentResponse processPayment(UUID paymentId) {

        log.info("Starting payment orchestration. paymentId={}", paymentId);

        Payment payment = paymentService.getPaymentEntity(paymentId);

        // If already successful, resume internal processing without
        // making another provider call.
        if (payment.getStatus() == PaymentStatus.SUCCESS) {

            log.info(
                    "Payment already successful. Resuming internal processing. paymentId={}",
                    paymentId
            );

            paymentProcessingService.processPayment(paymentId);

            return PaymentResponse.from(
                    paymentService.getPaymentEntity(paymentId)
            );
        }

        // Do not submit failed or refunded payments again.
        if (payment.getStatus() == PaymentStatus.FAILED
                || payment.getStatus() == PaymentStatus.REFUNDED) {

            log.info(
                    "Payment is terminal. Skipping provider call. paymentId={}, status={}",
                    paymentId,
                    payment.getStatus()
            );

            return PaymentResponse.from(payment);
        }

        ProviderPaymentRequest providerRequest = new ProviderPaymentRequest(
                payment.getId().toString(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getPaymentMethod(),
                payment.getIdempotencyKey()
        );

        log.info(
                "Calling payment provider. paymentId={}, currency={}",
                paymentId,
                payment.getCurrency()
        );

        // This external call is deliberately outside a database transaction.
        ProviderPaymentResponse providerResponse =
                Objects.requireNonNull(
                        paymentProvider.processPayment(providerRequest),
                        "Payment provider returned a null response"
                );

        Objects.requireNonNull(
                providerResponse.status(),
                "Payment provider returned a null status"
        );

        PaymentStatus paymentStatus = mapProviderStatus(
                providerResponse.status()
        );

        PaymentResponse updatedPayment =
                paymentService.updatePaymentFromProvider(
                        paymentId,
                        paymentStatus,
                        providerResponse.providerReferenceId()
                );

        log.info(
                "Provider result persisted. paymentId={}, providerStatus={}, paymentStatus={}",
                paymentId,
                providerResponse.status(),
                paymentStatus
        );

        // Only confirmed provider success enters transaction/ledger processing.
        if (providerResponse.status() == ProviderPaymentStatus.SUCCESS) {

            paymentProcessingService.processPayment(paymentId);

            log.info(
                    "Payment orchestration completed. paymentId={}",
                    paymentId
            );
        }

        return updatedPayment;
    }

    private PaymentStatus mapProviderStatus(
            ProviderPaymentStatus providerStatus) {

        return switch (providerStatus) {
            case SUCCESS -> PaymentStatus.SUCCESS;
            case DECLINED, FAILED -> PaymentStatus.FAILED;
            case PENDING -> PaymentStatus.PENDING;
        };
    }
}