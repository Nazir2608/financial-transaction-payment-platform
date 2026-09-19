// ============================================================
// FINCORE - Payment Management
// ============================================================

let payments = [];
let paymentSearchTerm = "";


// ============================================================
// PAGE
// ============================================================

async function renderPaymentsPage() {

    const page = document.getElementById("page-payments");

    if (!page) {
        console.error("Payment page element not found.");
        return;
    }

    page.innerHTML = `
        <div class="page-header">

            <div>
                <h1>Payments</h1>

                <p>
                    Manage payments and process successful transactions.
                </p>
            </div>

            <button
                class="btn btn-primary"
                onclick="openPaymentCreateModal()">

                <span>＋</span>
                Create Payment

            </button>

        </div>


        <div class="content-card">

            <div class="toolbar">

                <div class="search-box">

                    <span class="search-icon">⌕</span>

                    <input
                        type="text"
                        id="payment-search"
                        placeholder="Search payment, order or method..."
                        oninput="handlePaymentSearch(this.value)"
                    />

                </div>


                <div class="toolbar-actions">

                    <button
                        class="btn btn-secondary"
                        onclick="loadPayments()">

                        ↻ Refresh

                    </button>

                </div>

            </div>


            <div id="payments-table-container">

                <div class="loading-state">
                    Loading payments...
                </div>

            </div>

        </div>


        <!-- ==================================================
             CREATE PAYMENT MODAL
             ================================================== -->

        <div
            id="payment-modal"
            class="payment-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closePaymentModal()">
            </div>


            <div class="modal-content">

                <div class="modal-header">

                    <div>

                        <h2>
                            Create Payment
                        </h2>

                        <p>
                            Create a payment against an order.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closePaymentModal()">

                        ×

                    </button>

                </div>


                <form
                    id="payment-form"
                    onsubmit="handlePaymentSubmit(event)">

                    <div class="form-grid">

                        <div class="form-group full-width">

                            <label for="payment-order-id">

                                Order ID
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="payment-order-id"
                                placeholder="Enter order UUID"
                                required
                            />

                            <small class="form-help">
                                Payment will be created for this order.
                            </small>

                        </div>


                        <div class="form-group">

                            <label for="payment-amount">

                                Amount
                                <span class="required">*</span>

                            </label>

                            <input
                                type="number"
                                id="payment-amount"
                                min="0.01"
                                step="0.01"
                                placeholder="1500.00"
                                required
                            />

                        </div>


                        <div class="form-group">

                            <label for="payment-method">

                                Payment Method
                                <span class="required">*</span>

                            </label>

                            <select
                                id="payment-method"
                                required>

                                <option value="">
                                    Select method
                                </option>

                                <option value="UPI">
                                    UPI
                                </option>

                                <option value="CARD">
                                    Card
                                </option>

                                <option value="NET_BANKING">
                                    Net Banking
                                </option>

                                <option value="WALLET">
                                    Wallet
                                </option>

                                <option value="BANK_TRANSFER">
                                    Bank Transfer
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            onclick="closePaymentModal()">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="btn btn-primary"
                            id="payment-submit-btn">

                            Create Payment

                        </button>

                    </div>

                </form>

            </div>

        </div>


        <!-- ==================================================
             PAYMENT DETAILS MODAL
             ================================================== -->

        <div
            id="payment-details-modal"
            class="payment-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closePaymentDetailsModal()">
            </div>


            <div class="modal-content modal-lg">

                <div class="modal-header">

                    <div>

                        <h2>
                            Payment Details
                        </h2>

                        <p>
                            Payment status and processing information.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closePaymentDetailsModal()">

                        ×

                    </button>

                </div>


                <div id="payment-details-content">

                    <div class="loading-state">
                        Loading...
                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        onclick="closePaymentDetailsModal()">

                        Close

                    </button>

                </div>

            </div>

        </div>
    `;


    await loadPayments();
}


// ============================================================
// LOAD PAYMENTS
// ============================================================

async function loadPayments() {

    const container =
        document.getElementById(
            "payments-table-container"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading payments...
        </div>
    `;


    try {

        payments = await paymentApi.getAll();

        console.log(
            "Payments loaded successfully:",
            payments
        );

        renderPaymentsTable();

    } catch (error) {

        console.error(
            "Failed to load payments:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load payments
                </h3>


                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong"
                    )}
                </p>


                <button
                    class="btn btn-secondary"
                    onclick="loadPayments()">

                    Retry

                </button>

            </div>
        `;


        showToast(
            error.message ||
            "Failed to load payments",
            "error"
        );
    }
}


// ============================================================
// TABLE
// ============================================================

function renderPaymentsTable() {

    const container =
        document.getElementById(
            "payments-table-container"
        );

    if (!container) {
        return;
    }


    const filteredPayments =
        getFilteredPayments();


    if (filteredPayments.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ${payments.length === 0 ? "P" : "⌕"}
                </div>


                <h3>

                    ${
                        payments.length === 0
                            ? "No payments found"
                            : "No matching payments"
                    }

                </h3>


                <p>

                    ${
                        payments.length === 0
                            ? "Create your first payment to get started."
                            : "Try a different search term."
                    }

                </p>


                ${
                    payments.length === 0
                        ? `
                            <button
                                class="btn btn-primary"
                                onclick="openPaymentCreateModal()">

                                ＋ Create Payment

                            </button>
                          `
                        : ""
                }

            </div>
        `;

        return;
    }


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>
                            Payment
                        </th>

                        <th>
                            Order
                        </th>

                        <th>
                            Amount
                        </th>

                        <th>
                            Method
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Created
                        </th>

                        <th class="text-right">
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${filteredPayments
                        .map(payment =>
                            renderPaymentRow(payment)
                        )
                        .join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ============================================================
// PAYMENT ROW
// ============================================================

function renderPaymentRow(payment) {

    const paymentId =
        payment.paymentId ||
        payment.id;

    const orderId =
        payment.orderId ||
        extractPaymentOrderId(payment.order);

    const amount =
        payment.amount ?? 0;

    const status =
        payment.status ||
        "PENDING";

    const paymentMethod =
        payment.paymentMethod ||
        "-";


    return `

        <tr>

            <td>

                <div class="table-primary">

                    <strong>
                        ${shortId(paymentId)}
                    </strong>

                    <span class="table-secondary">
                        ${escapeHtml(paymentId || "-")}
                    </span>

                </div>

            </td>


            <td>

                <span class="monospace">
                    ${shortId(orderId)}
                </span>

            </td>


            <td>

                <strong>
                    ${formatCurrency(amount)}
                </strong>

            </td>


            <td>

                <span class="payment-method-badge">
                    ${escapeHtml(paymentMethod)}
                </span>

            </td>


            <td>

                ${statusBadge(status)}

            </td>


            <td>

                ${formatDate(payment.createdAt)}

            </td>


            <td class="text-right">

                <div class="action-buttons">

                    <button
                        class="btn btn-icon"
                        title="View payment"
                        onclick="viewPayment('${paymentId}')">

                        👁

                    </button>


                    ${
                        status === "PENDING"
                            ? `
                                <button
                                    class="btn btn-icon"
                                    title="Mark successful"
                                    onclick="markPaymentSuccessful('${paymentId}')">

                                    ✓

                                </button>
                              `
                            : ""
                    }


                    ${
                        status === "SUCCESS"
                            ? `
                                <button
                                    class="btn btn-icon btn-process"
                                    title="Process payment"
                                    onclick="processPayment('${paymentId}')">

                                    ▶

                                </button>
                              `
                            : ""
                    }


                    ${
                        status === "PENDING"
                            ? `
                                <button
                                    class="btn btn-icon btn-danger"
                                    title="Mark failed"
                                    onclick="markPaymentFailed('${paymentId}')">

                                    ✕

                                </button>
                              `
                            : ""
                    }

                </div>

            </td>

        </tr>
    `;
}


// ============================================================
// HELPERS
// ============================================================

function extractPaymentOrderId(order) {

    if (!order) {
        return "";
    }

    if (typeof order === "string") {
        return order;
    }

    return order.id || "";
}


// ============================================================
// SEARCH
// ============================================================

function handlePaymentSearch(value) {

    paymentSearchTerm =
        (value || "")
            .trim()
            .toLowerCase();


    renderPaymentsTable();
}


function getFilteredPayments() {

    if (!paymentSearchTerm) {
        return payments;
    }


    return payments.filter(payment => {

        const paymentId =
            String(
                payment.paymentId ||
                payment.id ||
                ""
            ).toLowerCase();


        const orderId =
            String(
                payment.orderId ||
                extractPaymentOrderId(payment.order) ||
                ""
            ).toLowerCase();


        const paymentMethod =
            String(
                payment.paymentMethod ||
                ""
            ).toLowerCase();


        const status =
            String(
                payment.status ||
                ""
            ).toLowerCase();


        return (
            paymentId.includes(paymentSearchTerm) ||
            orderId.includes(paymentSearchTerm) ||
            paymentMethod.includes(paymentSearchTerm) ||
            status.includes(paymentSearchTerm)
        );
    });
}


// ============================================================
// CREATE PAYMENT
// ============================================================

function openPaymentCreateModal() {

    const modal =
        document.getElementById(
            "payment-modal"
        );


    if (!modal) {
        return;
    }


    document.getElementById(
        "payment-order-id"
    ).value = "";


    document.getElementById(
        "payment-amount"
    ).value = "";


    document.getElementById(
        "payment-method"
    ).value = "";


    modal.classList.remove("hidden");


    setTimeout(() => {

        document.getElementById(
            "payment-order-id"
        )?.focus();

    }, 100);
}


// ============================================================
// CREATE PAYMENT SUBMIT
// ============================================================

async function handlePaymentSubmit(event) {

    event.preventDefault();


    const form =
        event.target;


    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    const orderId =
        document.getElementById(
            "payment-order-id"
        ).value.trim();


    const amount =
        document.getElementById(
            "payment-amount"
        ).value;


    const paymentMethod =
        document.getElementById(
            "payment-method"
        ).value;


    const request = {

        orderId,
        amount,
        paymentMethod

    };


    const submitButton =
        document.getElementById(
            "payment-submit-btn"
        );


    try {

        submitButton.disabled = true;

        submitButton.textContent =
            "Creating...";


        await paymentApi.create(
            request
        );


        showToast(
            "Payment created successfully",
            "success"
        );


        closePaymentModal();


        await loadPayments();


    } catch (error) {

        console.error(
            "Payment creation failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to create payment",
            "error"
        );


    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Create Payment";
    }
}


// ============================================================
// VIEW PAYMENT
// ============================================================

async function viewPayment(paymentId) {

    const modal =
        document.getElementById(
            "payment-details-modal"
        );


    const content =
        document.getElementById(
            "payment-details-content"
        );


    if (!modal || !content) {
        return;
    }


    modal.classList.remove("hidden");


    content.innerHTML = `

        <div class="loading-state">
            Loading payment...
        </div>
    `;


    try {

        const payment =
            await paymentApi.getById(
                paymentId
            );


        renderPaymentDetails(payment);


    } catch (error) {

        console.error(
            "Failed to load payment:",
            error
        );


        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load payment
                </h3>


                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong"
                    )}
                </p>

            </div>
        `;
    }
}


// ============================================================
// PAYMENT DETAILS
// ============================================================

function renderPaymentDetails(payment) {

    const content =
        document.getElementById(
            "payment-details-content"
        );


    if (!content) {
        return;
    }


    const paymentId =
        payment.paymentId ||
        payment.id;


    const orderId =
        payment.orderId ||
        extractPaymentOrderId(payment.order);


    const amount =
        payment.amount ?? 0;


    const status =
        payment.status ||
        "PENDING";


    const paymentMethod =
        payment.paymentMethod ||
        "-";


    content.innerHTML = `

        <div class="payment-summary-card">

            <div>

                <span class="payment-summary-label">
                    Payment Amount
                </span>


                <div class="payment-summary-value">

                    ${formatCurrency(amount)}

                </div>

            </div>


            <div>

                ${statusBadge(status)}

            </div>

        </div>


        <div class="details-grid">

            <div class="detail-item">

                <span class="detail-label">
                    Payment ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(paymentId || "-")}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Order ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(orderId || "-")}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Amount
                </span>


                <span class="detail-value">
                    ${formatCurrency(amount)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Payment Method
                </span>


                <span class="detail-value">
                    ${escapeHtml(paymentMethod)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Status
                </span>


                <span class="detail-value">
                    ${statusBadge(status)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Created At
                </span>


                <span class="detail-value">
                    ${formatDate(payment.createdAt)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Updated At
                </span>


                <span class="detail-value">
                    ${formatDate(payment.updatedAt)}
                </span>

            </div>

        </div>


        ${
            status === "SUCCESS"
                ? `
                    <div class="payment-processing-info">

                        <strong>
                            Payment ready for processing
                        </strong>

                        <p>
                            Processing this payment will create
                            a transaction and ledger entry.
                        </p>

                    </div>
                  `
                : ""
        }
    `;
}


// ============================================================
// MARK PAYMENT SUCCESS
// ============================================================

async function markPaymentSuccessful(paymentId) {

    const confirmed =
        confirm(
            "Mark this payment as SUCCESS?"
        );


    if (!confirmed) {
        return;
    }


    try {

        setLoading(true);


        await paymentApi.updateStatus(
            paymentId,
            "SUCCESS"
        );


        setLoading(false);


        showToast(
            "Payment marked as SUCCESS",
            "success"
        );


        await loadPayments();


    } catch (error) {

        setLoading(false);


        console.error(
            "Payment status update failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to update payment status",
            "error"
        );
    }
}


// ============================================================
// MARK PAYMENT FAILED
// ============================================================

async function markPaymentFailed(paymentId) {

    const confirmed =
        confirm(
            "Mark this payment as FAILED?"
        );


    if (!confirmed) {
        return;
    }


    try {

        setLoading(true);


        await paymentApi.updateStatus(
            paymentId,
            "FAILED"
        );


        setLoading(false);


        showToast(
            "Payment marked as FAILED",
            "success"
        );


        await loadPayments();


    } catch (error) {

        setLoading(false);


        console.error(
            "Payment status update failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to update payment status",
            "error"
        );
    }
}


// ============================================================
// PROCESS PAYMENT
// ============================================================

async function processPayment(paymentId) {

    const confirmed =
        confirm(
            "Process this successful payment?\n\n" +
            "This will create the transaction and " +
            "ledger entry and update the merchant balance."
        );


    if (!confirmed) {
        return;
    }


    try {

        setLoading(true);


        await paymentApi.process(
            paymentId
        );


        setLoading(false);


        showToast(
            "Payment processed successfully",
            "success"
        );


        await loadPayments();


    } catch (error) {

        setLoading(false);


        console.error(
            "Payment processing failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to process payment",
            "error"
        );
    }
}


// ============================================================
// CLOSE MODALS
// ============================================================

function closePaymentModal() {

    const modal =
        document.getElementById(
            "payment-modal"
        );


    if (modal) {
        modal.classList.add("hidden");
    }
}


function closePaymentDetailsModal() {

    const modal =
        document.getElementById(
            "payment-details-modal"
        );


    if (modal) {
        modal.classList.add("hidden");
    }
}


// ============================================================
// ESCAPE KEY
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        closePaymentModal();

        closePaymentDetailsModal();
    }
);