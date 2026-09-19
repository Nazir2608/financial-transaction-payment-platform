// ============================================================
// FINCORE - Order Management
// ============================================================

let orders = [];
let orderSearchTerm = "";


// ============================================================
// PAGE
// ============================================================

async function renderOrdersPage() {

    const page = document.getElementById("page-orders");

    if (!page) {
        console.error("Order page element not found.");
        return;
    }

    page.innerHTML = `
        <div class="page-header">

            <div>
                <h1>Orders</h1>

                <p>
                    Manage customer orders and payment lifecycle.
                </p>
            </div>

            <button
                class="btn btn-primary"
                onclick="openOrderCreateModal()">

                <span>＋</span>
                Create Order

            </button>

        </div>


        <div class="content-card">

            <div class="toolbar">

                <div class="search-box">

                    <span class="search-icon">⌕</span>

                    <input
                        type="text"
                        id="order-search"
                        placeholder="Search order number, merchant or customer..."
                        oninput="handleOrderSearch(this.value)"
                    />

                </div>


                <div class="toolbar-actions">

                    <button
                        class="btn btn-secondary"
                        onclick="loadOrders()">

                        ↻ Refresh

                    </button>

                </div>

            </div>


            <div id="orders-table-container">

                <div class="loading-state">
                    Loading orders...
                </div>

            </div>

        </div>


        <!-- ==================================================
             CREATE ORDER MODAL
             ================================================== -->

        <div
            id="order-modal"
            class="order-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeOrderModal()">
            </div>


            <div class="modal-content">

                <div class="modal-header">

                    <div>

                        <h2>
                            Create Order
                        </h2>

                        <p>
                            Create a new customer order.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeOrderModal()">

                        ×

                    </button>

                </div>


                <form
                    id="order-form"
                    onsubmit="handleOrderSubmit(event)">

                    <div class="form-grid">

                        <div class="form-group">

                            <label for="order-number">

                                Order Number
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="order-number"
                                maxlength="50"
                                placeholder="ORD-10001"
                                required
                            />

                        </div>


                        <div class="form-group">

                            <label for="order-currency">

                                Currency
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="order-currency"
                                maxlength="3"
                                minlength="3"
                                value="INR"
                                placeholder="INR"
                                style="text-transform: uppercase;"
                                required
                            />

                        </div>


                        <div class="form-group full-width">

                            <label for="order-merchant-id">

                                Merchant ID
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="order-merchant-id"
                                placeholder="Enter merchant UUID"
                                required
                            />

                        </div>


                        <div class="form-group full-width">

                            <label for="order-customer-id">

                                Customer ID
                                <span class="required">*</span>

                            </label>

                            <input
                                type="text"
                                id="order-customer-id"
                                placeholder="Enter customer UUID"
                                required
                            />

                        </div>


                        <div class="form-group">

                            <label for="order-amount">

                                Amount
                                <span class="required">*</span>

                            </label>

                            <input
                                type="number"
                                id="order-amount"
                                min="0.01"
                                step="0.01"
                                placeholder="1500.00"
                                required
                            />

                        </div>

                    </div>


                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            onclick="closeOrderModal()">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="btn btn-primary"
                            id="order-submit-btn">

                            Create Order

                        </button>

                    </div>

                </form>

            </div>

        </div>


        <!-- ==================================================
             ORDER DETAILS MODAL
             ================================================== -->

        <div
            id="order-details-modal"
            class="order-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeOrderDetailsModal()">
            </div>


            <div class="modal-content modal-lg">

                <div class="modal-header">

                    <div>

                        <h2>
                            Order Details
                        </h2>

                        <p>
                            Order information and payment lifecycle.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeOrderDetailsModal()">

                        ×

                    </button>

                </div>


                <div id="order-details-content">

                    <div class="loading-state">
                        Loading...
                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        onclick="closeOrderDetailsModal()">

                        Close

                    </button>

                </div>

            </div>

        </div>
    `;


    await loadOrders();
}


// ============================================================
// LOAD ORDERS
// ============================================================

async function loadOrders() {

    const container =
        document.getElementById(
            "orders-table-container"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading orders...
        </div>
    `;


    try {

        orders = await orderApi.getAll();

        console.log(
            "Orders loaded successfully:",
            orders
        );

        renderOrdersTable();

    } catch (error) {

        console.error(
            "Failed to load orders:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load orders
                </h3>


                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong"
                    )}
                </p>


                <button
                    class="btn btn-secondary"
                    onclick="loadOrders()">

                    Retry

                </button>

            </div>
        `;


        showToast(
            error.message ||
            "Failed to load orders",
            "error"
        );
    }
}


// ============================================================
// TABLE
// ============================================================

function renderOrdersTable() {

    const container =
        document.getElementById(
            "orders-table-container"
        );

    if (!container) {
        return;
    }


    const filteredOrders =
        getFilteredOrders();


    if (filteredOrders.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ${orders.length === 0 ? "O" : "⌕"}
                </div>


                <h3>

                    ${
                        orders.length === 0
                            ? "No orders found"
                            : "No matching orders"
                    }

                </h3>


                <p>

                    ${
                        orders.length === 0
                            ? "Create your first order to get started."
                            : "Try a different search term."
                    }

                </p>


                ${
                    orders.length === 0
                        ? `
                            <button
                                class="btn btn-primary"
                                onclick="openOrderCreateModal()">

                                ＋ Create Order

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
                            Order
                        </th>

                        <th>
                            Merchant
                        </th>

                        <th>
                            Customer
                        </th>

                        <th>
                            Amount
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

                    ${filteredOrders
                        .map(order =>
                            renderOrderRow(order)
                        )
                        .join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ============================================================
// ORDER ROW
// ============================================================

function renderOrderRow(order) {

    const orderId =
        order.orderId ||
        order.id;

    const orderNumber =
        order.orderNumber ||
        "-";

    const merchantId =
        order.merchantId ||
        extractNestedId(order.merchant);

    const customerId =
        order.customerId ||
        extractNestedId(order.customer);

    const amount =
        order.amount ?? 0;

    const currency =
        order.currency ||
        "INR";

    const status =
        order.status ||
        "CREATED";


    return `

        <tr>

            <td>

                <div class="table-primary">

                    <strong>
                        ${escapeHtml(orderNumber)}
                    </strong>

                    <span class="table-secondary">
                        ${shortId(orderId)}
                    </span>

                </div>

            </td>


            <td>

                <span class="monospace">
                    ${shortId(merchantId)}
                </span>

            </td>


            <td>

                <span class="monospace">
                    ${shortId(customerId)}
                </span>

            </td>


            <td>

                <strong>
                    ${formatOrderAmount(amount, currency)}
                </strong>

            </td>


            <td>

                ${statusBadge(status)}

            </td>


            <td>

                ${formatDate(order.createdAt)}

            </td>


            <td class="text-right">

                <div class="action-buttons">

                    <button
                        class="btn btn-icon"
                        title="View order"
                        onclick="viewOrder('${orderId}')">

                        👁

                    </button>


                    <button
                        class="btn btn-icon"
                        title="Change status"
                        onclick="changeOrderStatus('${orderId}')">

                        ⇄

                    </button>

                </div>

            </td>

        </tr>
    `;
}


// ============================================================
// HELPER
// ============================================================

function extractNestedId(value) {

    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    return value.id || "";
}


function formatOrderAmount(amount, currency) {

    const numericAmount =
        Number(amount || 0);


    if (currency === "INR") {
        return formatCurrency(numericAmount);
    }


    return `${currency} ${numericAmount.toFixed(2)}`;
}


// ============================================================
// SEARCH
// ============================================================

function handleOrderSearch(value) {

    orderSearchTerm =
        (value || "")
            .trim()
            .toLowerCase();


    renderOrdersTable();
}


function getFilteredOrders() {

    if (!orderSearchTerm) {
        return orders;
    }


    return orders.filter(order => {

        const orderId =
            String(
                order.orderId ||
                order.id ||
                ""
            ).toLowerCase();


        const orderNumber =
            String(
                order.orderNumber ||
                ""
            ).toLowerCase();


        const merchantId =
            String(
                order.merchantId ||
                extractNestedId(order.merchant) ||
                ""
            ).toLowerCase();


        const customerId =
            String(
                order.customerId ||
                extractNestedId(order.customer) ||
                ""
            ).toLowerCase();


        const status =
            String(
                order.status ||
                ""
            ).toLowerCase();


        return (
            orderId.includes(orderSearchTerm) ||
            orderNumber.includes(orderSearchTerm) ||
            merchantId.includes(orderSearchTerm) ||
            customerId.includes(orderSearchTerm) ||
            status.includes(orderSearchTerm)
        );
    });
}


// ============================================================
// CREATE ORDER MODAL
// ============================================================

function openOrderCreateModal() {

    const modal =
        document.getElementById(
            "order-modal"
        );


    if (!modal) {
        return;
    }


    document.getElementById(
        "order-number"
    ).value = "";


    document.getElementById(
        "order-merchant-id"
    ).value = "";


    document.getElementById(
        "order-customer-id"
    ).value = "";


    document.getElementById(
        "order-amount"
    ).value = "";


    document.getElementById(
        "order-currency"
    ).value = "INR";


    modal.classList.remove("hidden");


    setTimeout(() => {

        document.getElementById(
            "order-number"
        )?.focus();

    }, 100);
}


// ============================================================
// CREATE ORDER
// ============================================================

async function handleOrderSubmit(event) {

    event.preventDefault();


    const form =
        event.target;


    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    const orderNumber =
        document.getElementById(
            "order-number"
        ).value.trim();


    const merchantId =
        document.getElementById(
            "order-merchant-id"
        ).value.trim();


    const customerId =
        document.getElementById(
            "order-customer-id"
        ).value.trim();


    const amount =
        document.getElementById(
            "order-amount"
        ).value;


    const currency =
        document.getElementById(
            "order-currency"
        ).value
            .trim()
            .toUpperCase();


    const request = {

        orderNumber,
        merchantId,
        customerId,
        amount,
        currency

    };


    const submitButton =
        document.getElementById(
            "order-submit-btn"
        );


    try {

        submitButton.disabled = true;

        submitButton.textContent =
            "Creating...";


        await orderApi.create(
            request
        );


        showToast(
            "Order created successfully",
            "success"
        );


        closeOrderModal();


        await loadOrders();


    } catch (error) {

        console.error(
            "Order creation failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to create order",
            "error"
        );


    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Create Order";
    }
}


// ============================================================
// VIEW ORDER
// ============================================================

async function viewOrder(orderId) {

    const modal =
        document.getElementById(
            "order-details-modal"
        );


    const content =
        document.getElementById(
            "order-details-content"
        );


    if (!modal || !content) {
        return;
    }


    modal.classList.remove("hidden");


    content.innerHTML = `

        <div class="loading-state">
            Loading order...
        </div>
    `;


    try {

        const order =
            await orderApi.getById(
                orderId
            );


        renderOrderDetails(order);


    } catch (error) {

        console.error(
            "Failed to load order:",
            error
        );


        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load order
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
// ORDER DETAILS
// ============================================================

function renderOrderDetails(order) {

    const content =
        document.getElementById(
            "order-details-content"
        );


    if (!content) {
        return;
    }


    const orderId =
        order.orderId ||
        order.id;


    const merchantId =
        order.merchantId ||
        extractNestedId(order.merchant);


    const customerId =
        order.customerId ||
        extractNestedId(order.customer);


    const amount =
        order.amount ?? 0;


    const currency =
        order.currency ||
        "INR";


    content.innerHTML = `

        <div class="order-summary-card">

            <div>

                <span class="order-summary-label">
                    Order Amount
                </span>


                <div class="order-summary-value">

                    ${formatOrderAmount(
                        amount,
                        currency
                    )}

                </div>

            </div>


            <div>

                ${statusBadge(order.status)}

            </div>

        </div>


        <div class="details-grid">

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
                    Order Number
                </span>


                <span class="detail-value">
                    ${escapeHtml(
                        order.orderNumber || "-"
                    )}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Merchant ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(
                        merchantId || "-"
                    )}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Customer ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(
                        customerId || "-"
                    )}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Amount
                </span>


                <span class="detail-value">
                    ${formatOrderAmount(
                        amount,
                        currency
                    )}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Currency
                </span>


                <span class="detail-value">
                    ${escapeHtml(currency)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Status
                </span>


                <span class="detail-value">
                    ${statusBadge(order.status)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Created At
                </span>


                <span class="detail-value">
                    ${formatDate(order.createdAt)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Updated At
                </span>


                <span class="detail-value">
                    ${formatDate(order.updatedAt)}
                </span>

            </div>

        </div>
    `;
}


// ============================================================
// CHANGE STATUS
// ============================================================

async function changeOrderStatus(orderId) {

    let order;


    try {

        order =
            await orderApi.getById(
                orderId
            );

    } catch (error) {

        showToast(
            error.message ||
            "Unable to load order",
            "error"
        );

        return;
    }


    const currentStatus =
        order.status;


    const nextStatus =
        getSuggestedOrderStatus(
            currentStatus
        );


    if (!nextStatus) {

        showToast(
            `Order cannot transition from ${currentStatus}`,
            "error"
        );

        return;
    }


    const confirmed =
        confirm(
            `Change order status from ${currentStatus} to ${nextStatus}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        setLoading(true);


        await orderApi.updateStatus(
            orderId,
            nextStatus
        );


        setLoading(false);


        showToast(
            `Order status changed to ${nextStatus}`,
            "success"
        );


        await loadOrders();


    } catch (error) {

        setLoading(false);


        console.error(
            "Order status update failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to update order status",
            "error"
        );
    }
}


// ============================================================
// STATUS FLOW
// ============================================================

function getSuggestedOrderStatus(status) {

    switch (status) {

        case "CREATED":
            return "PENDING_PAYMENT";

        case "PENDING_PAYMENT":
            return "PAID";

        case "PAID":
            return "COMPLETED";

        default:
            return null;
    }
}


// ============================================================
// CLOSE MODALS
// ============================================================

function closeOrderModal() {

    const modal =
        document.getElementById(
            "order-modal"
        );


    if (modal) {
        modal.classList.add("hidden");
    }
}


function closeOrderDetailsModal() {

    const modal =
        document.getElementById(
            "order-details-modal"
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


        closeOrderModal();

        closeOrderDetailsModal();
    }
);