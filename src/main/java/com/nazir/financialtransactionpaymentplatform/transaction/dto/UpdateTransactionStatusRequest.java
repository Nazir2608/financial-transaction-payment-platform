package com.nazir.financialtransactionpaymentplatform.transaction.dto;

import com.nazir.financialtransactionpaymentplatform.transaction.entity.TransactionStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTransactionStatusRequest(

        @NotNull
        TransactionStatus status) {
}