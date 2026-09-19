/* ============================================
   FINCORE API CLIENT
   ============================================ */

const API_BASE_URL = "";


/**
 * Generic API request.
 */
async function apiRequest(
    endpoint,
    options = {}
) {

    const config = {
        method: options.method || "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    };


    if (options.body !== undefined) {

        config.body =
            typeof options.body === "string"
                ? options.body
                : JSON.stringify(options.body);

    }


    const response =
        await fetch(
            API_BASE_URL + endpoint,
            config
        );


    const contentType =
        response.headers.get("content-type") || "";


    let data;


    if (contentType.includes("application/json")) {

        data = await response.json();

    } else {

        data = await response.text();

    }


    if (!response.ok) {

        let message =
            `Request failed with HTTP ${response.status}`;

        if (data && typeof data === "object") {

            message =
                data.message ||
                data.error ||
                message;

        } else if (data) {

            message = data;

        }

        throw new Error(message);
    }


    return data;
}


/* ============================================
   HEALTH
   ============================================ */

const healthApi = {

    check() {

        return apiRequest(
            "/api/v1/health"
        );

    }

};


/* ============================================
   MERCHANT
   ============================================ */

const merchantApi = {

    getAll() {

        return apiRequest(
            "/api/v1/merchants"
        );

    },

    getById(id) {

        return apiRequest(
            `/api/v1/merchants/${id}`
        );

    },

    create(data) {

        return apiRequest(
            "/api/v1/merchants",
            {
                method: "POST",
                body: data
            }
        );

    },

    update(id, data) {

        return apiRequest(
            `/api/v1/merchants/${id}`,
            {
                method: "PUT",
                body: data
            }
        );

    },

    updateStatus(id, status) {

        return apiRequest(
            `/api/v1/merchants/${id}/status`,
            {
                method: "PATCH",
                body: {
                    status: status
                }
            }
        );

    },

    delete(id) {

        return apiRequest(
            `/api/v1/merchants/${id}`,
            {
                method: "DELETE"
            }
        );

    }

};


/* ============================================
   CUSTOMER
   ============================================ */

const customerApi = {

    getAll: () =>
        apiRequest("/api/v1/customers"),

    getById: (customerId) =>
        apiRequest(`/api/v1/customers/${customerId}`),

    create: (data) =>
        apiRequest("/api/v1/customers", {
            method: "POST",
            body: data
        }),

    update: (customerId, data) =>
        apiRequest(`/api/v1/customers/${customerId}`, {
            method: "PUT",
            body: data
        }),

    updateStatus: (customerId, status) =>
        apiRequest(
            `/api/v1/customers/${customerId}/status`,
            {
                method: "PATCH",
                body: {
                    status: status
                }
            }
        ),

    delete: (customerId) =>
        apiRequest(`/api/v1/customers/${customerId}`, {
            method: "DELETE"
        })
};


/* ============================================
   ACCOUNT
   ============================================ */

const accountApi = {

    getAll: () =>
        apiRequest("/api/v1/accounts"),

    getById: (accountId) =>
        apiRequest(`/api/v1/accounts/${accountId}`),

    getByMerchant: (merchantId) =>
        apiRequest(`/api/v1/accounts/merchant/${merchantId}`),

    getBalance: (accountId) =>
        apiRequest(`/api/v1/accounts/${accountId}/balance`),

    create: (data) =>
        apiRequest("/api/v1/accounts", {
            method: "POST",
            body: data
        })
};


/* ============================================
   ORDER
   ============================================ */

const orderApi = {

    getAll: () =>
        apiRequest("/api/v1/orders"),

    getById: (orderId) =>
        apiRequest(`/api/v1/orders/${orderId}`),

    getByMerchant: (merchantId) =>
        apiRequest(
            `/api/v1/orders/merchant/${merchantId}`
        ),

    getByCustomer: (customerId) =>
        apiRequest(
            `/api/v1/orders/customer/${customerId}`
        ),

    create: (data) =>
        apiRequest("/api/v1/orders", {
            method: "POST",
            body: data
        }),

    updateStatus: (orderId, status) =>
        apiRequest(
            `/api/v1/orders/${orderId}/status`,
            {
                method: "PATCH",
                body: {
                    status: status
                }
            }
        )
};


/* ============================================
   PAYMENT
   ============================================ */

const paymentApi = {

    getAll: () =>
        apiRequest("/api/v1/payments"),

    getById: (paymentId) =>
        apiRequest(`/api/v1/payments/${paymentId}`),

    create: (data) =>
        apiRequest("/api/v1/payments", {
            method: "POST",
            body: data
        }),

    updateStatus: (paymentId, status) =>
        apiRequest(
            `/api/v1/payments/${paymentId}/status`,
            {
                method: "PATCH",
                body: {
                    status: status
                }
            }
        ),

    process: (paymentId) =>
        apiRequest(
            `/api/v1/payments/${paymentId}/process`,
            {
                method: "POST"
            }
        )
};

/* ============================================
   TRANSACTION
   ============================================ */

const transactionApi = {

    getAll: () =>
        apiRequest("/api/v1/transactions"),

    getById: (transactionId) =>
        apiRequest(
            `/api/v1/transactions/${transactionId}`
        ),

    getByPayment: (paymentId) =>
        apiRequest(
            `/api/v1/transactions/payment/${paymentId}`
        ),

    create: (data) =>
        apiRequest("/api/v1/transactions", {
            method: "POST",
            body: data
        }),

    updateStatus: (transactionId, status) =>
        apiRequest(
            `/api/v1/transactions/${transactionId}/status`,
            {
                method: "PATCH",
                body: {
                    status: status
                }
            }
        )
};


/* ============================================
   LEDGER
   ============================================ */

const ledgerApi = {

    getAll() {

        return apiRequest(
            "/api/v1/ledger-entries"
        );

    },

    getById(id) {

        return apiRequest(
            `/api/v1/ledger-entries/${id}`
        );

    },

    getByTransaction(transactionId) {

        return apiRequest(
            `/api/v1/ledger-entries/transaction/${transactionId}`
        );

    },

    getByAccount(accountId) {

        return apiRequest(
            `/api/v1/ledger-entries/account/${accountId}`
        );

    },

    getBalance(accountId) {

        return apiRequest(
            `/api/v1/ledger-entries/account/${accountId}/balance`
        );

    },

    create(data) {

        return apiRequest(
            "/api/v1/ledger-entries",
            {
                method: "POST",
                body: data
            }
        );

    }

};