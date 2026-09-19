// ============================================================
// FINCORE - Transaction Management
// ============================================================

let transactions = [];
let transactionSearchTerm = "";


// ============================================================
// PAGE
// ============================================================

async function renderTransactionsPage() {

    const page = document.getElementById("page-transactions");

    if (!page) {
        console.error("Transaction page element not found.");
        return;
    }

    page.innerHTML = `
        <div class="page-header">

            <div>
                <h1>Transactions</h1>

                <p>
                    Monitor payment transactions and their processing status.
                </p>
            </div>

            <button
                class="btn btn-secondary"
                onclick="loadTransactions()">

                ↻ Refresh

            </button>

        </div>


        <div class="content-card">

            <div class="toolbar">

                <div class="search-box">

                    <span class="search-icon">⌕</span>

                    <input
                        type="text"
                        id="transaction-search"
                        placeholder="Search transaction, payment or reference..."
                        oninput="handleTransactionSearch(this.value)"
                    />

                </div>


                <div class="toolbar-actions">

                    <div class="transaction-filter">

                        <select
                            id="transaction-status-filter"
                            onchange="handleTransactionStatusFilter(this.value)">

                            <option value="">
                                All Statuses
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="SUCCESS">
                                Success
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>

                        </select>

                    </div>


                    <button
                        class="btn btn-secondary"
                        onclick="loadTransactions()">

                        ↻ Refresh

                    </button>

                </div>

            </div>


            <div id="transactions-table-container">

                <div class="loading-state">
                    Loading transactions...
                </div>

            </div>

        </div>


        <!-- ==================================================
             TRANSACTION DETAILS
             ================================================== -->

        <div
            id="transaction-details-modal"
            class="transaction-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeTransactionDetailsModal()">
            </div>


            <div class="modal-content modal-lg">

                <div class="modal-header">

                    <div>

                        <h2>
                            Transaction Details
                        </h2>

                        <p>
                            Transaction processing and audit information.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeTransactionDetailsModal()">

                        ×

                    </button>

                </div>


                <div id="transaction-details-content">

                    <div class="loading-state">
                        Loading...
                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        onclick="closeTransactionDetailsModal()">

                        Close

                    </button>

                </div>

            </div>

        </div>


        <!-- ==================================================
             UPDATE STATUS MODAL
             ================================================== -->

        <div
            id="transaction-status-modal"
            class="transaction-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeTransactionStatusModal()">
            </div>


            <div class="modal-content">

                <div class="modal-header">

                    <div>

                        <h2>
                            Update Transaction
                        </h2>

                        <p>
                            Change the transaction processing status.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeTransactionStatusModal()">

                        ×

                    </button>

                </div>


                <div class="transaction-status-body">

                    <div class="status-transition">

                        <span
                            id="transaction-current-status"
                            class="status-transition-current">
                        </span>

                        <span class="status-arrow">
                            →
                        </span>

                        <select
                            id="transaction-new-status">

                            <option value="SUCCESS">
                                SUCCESS
                            </option>

                            <option value="FAILED">
                                FAILED
                            </option>

                        </select>

                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        type="button"
                        class="btn btn-secondary"
                        onclick="closeTransactionStatusModal()">

                        Cancel

                    </button>


                    <button
                        type="button"
                        class="btn btn-primary"
                        id="transaction-status-submit"
                        onclick="submitTransactionStatus()">

                        Update Status

                    </button>

                </div>

            </div>

        </div>
    `;


    await loadTransactions();
}


// ============================================================
// LOAD TRANSACTIONS
// ============================================================

async function loadTransactions() {

    const container =
        document.getElementById(
            "transactions-table-container"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading transactions...
        </div>
    `;


    try {

        transactions =
            await transactionApi.getAll();


        console.log(
            "Transactions loaded successfully:",
            transactions
        );


        renderTransactionsTable();

    } catch (error) {

        console.error(
            "Failed to load transactions:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load transactions
                </h3>


                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong"
                    )}
                </p>


                <button
                    class="btn btn-secondary"
                    onclick="loadTransactions()">

                    Retry

                </button>

            </div>
        `;


        showToast(
            error.message ||
            "Failed to load transactions",
            "error"
        );
    }
}


// ============================================================
// TABLE
// ============================================================

function renderTransactionsTable() {

    const container =
        document.getElementById(
            "transactions-table-container"
        );

    if (!container) {
        return;
    }


    const filteredTransactions =
        getFilteredTransactions();


    if (filteredTransactions.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ${transactions.length === 0 ? "T" : "⌕"}
                </div>


                <h3>

                    ${
                        transactions.length === 0
                            ? "No transactions found"
                            : "No matching transactions"
                    }

                </h3>


                <p>

                    ${
                        transactions.length === 0
                            ? "Transactions will appear here after payments are processed."
                            : "Try a different search or status filter."
                    }

                </p>

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
                            Transaction
                        </th>

                        <th>
                            Payment
                        </th>

                        <th>
                            Amount
                        </th>

                        <th>
                            Type
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Reference
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

                    ${filteredTransactions
                        .map(transaction =>
                            renderTransactionRow(transaction)
                        )
                        .join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ============================================================
// ROW
// ============================================================

function renderTransactionRow(transaction) {

    const transactionId =
        transaction.transactionId ||
        transaction.id;

    const paymentId =
        transaction.paymentId ||
        "";

    const amount =
        transaction.amount ?? 0;

    const type =
        transaction.type ||
        "-";

    const status =
        transaction.status ||
        "PENDING";

    const reference =
        transaction.reference ||
        "-";


    return `
        <tr>

            <td>

                <div class="table-primary">

                    <strong>
                        ${shortId(transactionId)}
                    </strong>

                    <span class="table-secondary">
                        ${escapeHtml(transactionId || "-")}
                    </span>

                </div>

            </td>


            <td>

                <span class="monospace">
                    ${shortId(paymentId)}
                </span>

            </td>


            <td>

                <strong>
                    ${formatCurrency(amount)}
                </strong>

            </td>


            <td>

                <span class="transaction-type ${String(type).toLowerCase()}">
                    ${escapeHtml(type)}
                </span>

            </td>


            <td>

                ${statusBadge(status)}

            </td>


            <td>

                <span class="monospace transaction-reference">
                    ${escapeHtml(reference)}
                </span>

            </td>


            <td>

                ${formatDate(transaction.createdAt)}

            </td>


            <td class="text-right">

                <div class="action-buttons">

                    <button
                        class="btn btn-icon"
                        title="View transaction"
                        onclick="viewTransaction('${transactionId}')">

                        👁

                    </button>


                    ${
                        status === "PENDING"
                            ? `
                                <button
                                    class="btn btn-icon"
                                    title="Update status"
                                    onclick="openTransactionStatusModal('${transactionId}', '${status}')">

                                    ⇄

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
// SEARCH / FILTER
// ============================================================

let transactionStatusFilter = "";


function handleTransactionSearch(value) {

    transactionSearchTerm =
        (value || "")
            .trim()
            .toLowerCase();


    renderTransactionsTable();
}


function handleTransactionStatusFilter(value) {

    transactionStatusFilter =
        value || "";


    renderTransactionsTable();
}


function getFilteredTransactions() {

    return transactions.filter(transaction => {

        const transactionId =
            String(
                transaction.transactionId ||
                transaction.id ||
                ""
            ).toLowerCase();


        const paymentId =
            String(
                transaction.paymentId ||
                ""
            ).toLowerCase();


        const reference =
            String(
                transaction.reference ||
                ""
            ).toLowerCase();


        const type =
            String(
                transaction.type ||
                ""
            ).toLowerCase();


        const status =
            String(
                transaction.status ||
                ""
            ).toLowerCase();


        const matchesSearch =
            !transactionSearchTerm ||
            transactionId.includes(transactionSearchTerm) ||
            paymentId.includes(transactionSearchTerm) ||
            reference.includes(transactionSearchTerm) ||
            type.includes(transactionSearchTerm);


        const matchesStatus =
            !transactionStatusFilter ||
            status === transactionStatusFilter.toLowerCase();


        return (
            matchesSearch &&
            matchesStatus
        );
    });
}


// ============================================================
// VIEW TRANSACTION
// ============================================================

async function viewTransaction(transactionId) {

    const modal =
        document.getElementById(
            "transaction-details-modal"
        );


    const content =
        document.getElementById(
            "transaction-details-content"
        );


    if (!modal || !content) {
        return;
    }


    modal.classList.remove("hidden");


    content.innerHTML = `
        <div class="loading-state">
            Loading transaction...
        </div>
    `;


    try {

        const transaction =
            await transactionApi.getById(
                transactionId
            );


        renderTransactionDetails(transaction);

    } catch (error) {

        console.error(
            "Failed to load transaction:",
            error
        );


        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load transaction
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
// DETAILS
// ============================================================

function renderTransactionDetails(transaction) {

    const content =
        document.getElementById(
            "transaction-details-content"
        );


    if (!content) {
        return;
    }


    const transactionId =
        transaction.transactionId ||
        transaction.id;


    const paymentId =
        transaction.paymentId ||
        "-";


    const amount =
        transaction.amount ?? 0;


    const type =
        transaction.type ||
        "-";


    const status =
        transaction.status ||
        "PENDING";


    const reference =
        transaction.reference ||
        "-";


    content.innerHTML = `

        <div class="transaction-summary-card">

            <div>

                <span class="transaction-summary-label">
                    Transaction Amount
                </span>


                <div class="transaction-summary-value">

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
                    Transaction ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(transactionId || "-")}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Payment ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(paymentId)}
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
                    Type
                </span>


                <span class="detail-value">
                    ${escapeHtml(type)}
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
                    Reference
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(reference)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Created At
                </span>


                <span class="detail-value">
                    ${formatDate(transaction.createdAt)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Updated At
                </span>


                <span class="detail-value">
                    ${formatDate(transaction.updatedAt)}
                </span>

            </div>

        </div>


        ${
            status === "SUCCESS"
                ? `
                    <div class="transaction-success-info">

                        <strong>
                            Transaction completed
                        </strong>

                        <p>
                            This transaction has been successfully
                            processed and can be referenced by its
                            transaction ID.
                        </p>

                    </div>
                  `
                : ""
        }
    `;
}


// ============================================================
// STATUS MODAL
// ============================================================

let selectedTransactionId = null;


async function openTransactionStatusModal(
    transactionId,
    currentStatus
) {

    selectedTransactionId =
        transactionId;


    const modal =
        document.getElementById(
            "transaction-status-modal"
        );


    const currentStatusElement =
        document.getElementById(
            "transaction-current-status"
        );


    const newStatusSelect =
        document.getElementById(
            "transaction-new-status"
        );


    if (
        !modal ||
        !currentStatusElement ||
        !newStatusSelect
    ) {
        return;
    }


    currentStatusElement.innerHTML =
        statusBadge(currentStatus);


    if (currentStatus === "PENDING") {

        newStatusSelect.innerHTML = `
            <option value="SUCCESS">
                SUCCESS
            </option>

            <option value="FAILED">
                FAILED
            </option>
        `;

    } else {

        newStatusSelect.innerHTML = `
            <option value="">
                No valid transition
            </option>
        `;

        newStatusSelect.disabled = true;
    }


    modal.classList.remove("hidden");
}


async function submitTransactionStatus() {

    if (!selectedTransactionId) {
        return;
    }


    const newStatus =
        document.getElementById(
            "transaction-new-status"
        ).value;


    if (!newStatus) {
        return;
    }


    const confirmed =
        confirm(
            `Change transaction status to ${newStatus}?`
        );


    if (!confirmed) {
        return;
    }


    const submitButton =
        document.getElementById(
            "transaction-status-submit"
        );


    try {

        submitButton.disabled = true;

        submitButton.textContent =
            "Updating...";


        await transactionApi.updateStatus(
            selectedTransactionId,
            newStatus
        );


        showToast(
            `Transaction marked as ${newStatus}`,
            "success"
        );


        closeTransactionStatusModal();


        await loadTransactions();


    } catch (error) {

        console.error(
            "Transaction status update failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to update transaction status",
            "error"
        );


    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Update Status";
    }
}


// ============================================================
// CLOSE MODALS
// ============================================================

function closeTransactionDetailsModal() {

    const modal =
        document.getElementById(
            "transaction-details-modal"
        );


    if (modal) {
        modal.classList.add("hidden");
    }
}


function closeTransactionStatusModal() {

    const modal =
        document.getElementById(
            "transaction-status-modal"
        );


    if (modal) {
        modal.classList.add("hidden");
    }


    selectedTransactionId = null;
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


        closeTransactionDetailsModal();

        closeTransactionStatusModal();
    }
);