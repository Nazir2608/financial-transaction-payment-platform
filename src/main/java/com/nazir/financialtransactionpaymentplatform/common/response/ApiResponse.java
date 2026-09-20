package com.nazir.financialtransactionpaymentplatform.common.response;

import java.time.Instant;

public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        Instant timestamp
) {

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(
                true,
                message,
                data,
                Instant.now()
        );
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Request successful");
    }
}