// ============================================================
// FINCORE - Ledger Management
// ============================================================

let ledgerEntries = [];
let ledgerSearchTerm = "";
let ledgerTypeFilter = "";


// ============================================================
// PAGE
// ============================================================

async function renderLedgerPage() {

    const page = document.getElementById("page-ledger");

    if (!page) {
        console.error("Ledger page element not found.");
        return;
    }

    page.innerHTML = `
        <div class="page-header">

            <div>
                <h1>Ledger</h1>

                <p>
                    View financial ledger entries and account balances.
                </p>
            </div>

            <button
                class="btn btn-secondary"
                onclick="loadLedgerEntries()">

                ↻ Refresh

            </button>

        </div>


        <!-- ==================================================
             LEDGER SUMMARY
             ================================================== -->

        <div class="ledger-summary-grid">

            <div class="ledger-stat-card">

                <div class="ledger-stat-icon">
                    L
                </div>

                <div>

                    <span class="ledger-stat-label">
                        Total Entries
                    </span>

                    <strong
                        id="ledger-total-count"
                        class="ledger-stat-value">
                        -
                    </strong>

                </div>

            </div>


            <div class="ledger-stat-card credit-card">

                <div class="ledger-stat-icon">
                    +
                </div>

                <div>

                    <span class="ledger-stat-label">
                        Total Credits
                    </span>

                    <strong
                        id="ledger-total-credit"
                        class="ledger-stat-value">
                        ₹0.00
                    </strong>

                </div>

            </div>


            <div class="ledger-stat-card debit-card">

                <div class="ledger-stat-icon">
                    −
                </div>

                <div>

                    <span class="ledger-stat-label">
                        Total Debits
                    </span>

                    <strong
                        id="ledger-total-debit"
                        class="ledger-stat-value">
                        ₹0.00
                    </strong>

                </div>

            </div>


            <div class="ledger-stat-card balance-card">

                <div class="ledger-stat-icon">
                    ₹
                </div>

                <div>

                    <span class="ledger-stat-label">
                        Net Movement
                    </span>

                    <strong
                        id="ledger-net-movement"
                        class="ledger-stat-value">
                        ₹0.00
                    </strong>

                </div>

            </div>

        </div>


        <!-- ==================================================
             LEDGER TABLE
             ================================================== -->

        <div class="content-card">

            <div class="toolbar">

                <div class="search-box">

                    <span class="search-icon">
                        ⌕
                    </span>

                    <input
                        type="text"
                        id="ledger-search"
                        placeholder="Search ledger, account or transaction..."
                        oninput="handleLedgerSearch(this.value)"
                    />

                </div>


                <div class="toolbar-actions">

                    <select
                        id="ledger-type-filter"
                        onchange="handleLedgerTypeFilter(this.value)">

                        <option value="">
                            All Types
                        </option>

                        <option value="CREDIT">
                            Credit
                        </option>

                        <option value="DEBIT">
                            Debit
                        </option>

                    </select>


                    <button
                        class="btn btn-secondary"
                        onclick="loadLedgerEntries()">

                        ↻ Refresh

                    </button>

                </div>

            </div>


            <div id="ledger-table-container">

                <div class="loading-state">
                    Loading ledger...
                </div>

            </div>

        </div>


        <!-- ==================================================
             LEDGER DETAILS MODAL
             ================================================== -->

        <div
            id="ledger-details-modal"
            class="ledger-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeLedgerDetailsModal()">
            </div>


            <div class="modal-content modal-lg">

                <div class="modal-header">

                    <div>

                        <h2>
                            Ledger Entry
                        </h2>

                        <p>
                            Financial accounting and audit information.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeLedgerDetailsModal()">

                        ×

                    </button>

                </div>


                <div id="ledger-details-content">

                    <div class="loading-state">
                        Loading...
                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        onclick="closeLedgerDetailsModal()">

                        Close

                    </button>

                </div>

            </div>

        </div>


        <!-- ==================================================
             ACCOUNT BALANCE MODAL
             ================================================== -->

        <div
            id="ledger-account-balance-modal"
            class="ledger-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeLedgerBalanceModal()">
            </div>


            <div class="modal-content">

                <div class="modal-header">

                    <div>

                        <h2>
                            Account Balance
                        </h2>

                        <p>
                            Balance calculated from ledger entries.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeLedgerBalanceModal()">

                        ×

                    </button>

                </div>


                <div id="ledger-account-balance-content">

                    <div class="loading-state">
                        Loading...
                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        onclick="closeLedgerBalanceModal()">

                        Close

                    </button>

                </div>

            </div>

        </div>
    `;


    await loadLedgerEntries();
}


// ============================================================
// LOAD LEDGER
// ============================================================

async function loadLedgerEntries() {

    const container =
        document.getElementById(
            "ledger-table-container"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading ledger...
        </div>
    `;


    try {

        ledgerEntries =
            await ledgerApi.getAll();


        console.log(
            "Ledger entries loaded successfully:",
            ledgerEntries
        );


        updateLedgerSummary();

        renderLedgerTable();

    } catch (error) {

        console.error(
            "Failed to load ledger:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load ledger
                </h3>


                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong"
                    )}
                </p>


                <button
                    class="btn btn-secondary"
                    onclick="loadLedgerEntries()">

                    Retry

                </button>

            </div>
        `;


        showToast(
            error.message ||
            "Failed to load ledger",
            "error"
        );
    }
}


// ============================================================
// SUMMARY
// ============================================================

function updateLedgerSummary() {

    const totalCount =
        document.getElementById(
            "ledger-total-count"
        );


    const totalCredit =
        document.getElementById(
            "ledger-total-credit"
        );


    const totalDebit =
        document.getElementById(
            "ledger-total-debit"
        );


    const netMovement =
        document.getElementById(
            "ledger-net-movement"
        );


    let credit = 0;
    let debit = 0;


    ledgerEntries.forEach(entry => {

        const amount =
            Number(entry.amount || 0);


        if (entry.type === "CREDIT") {
            credit += amount;
        }


        if (entry.type === "DEBIT") {
            debit += amount;
        }
    });


    const net =
        credit - debit;


    if (totalCount) {
        totalCount.textContent =
            ledgerEntries.length;
    }


    if (totalCredit) {
        totalCredit.textContent =
            formatCurrency(credit);
    }


    if (totalDebit) {
        totalDebit.textContent =
            formatCurrency(debit);
    }


    if (netMovement) {
        netMovement.textContent =
            formatCurrency(net);
    }
}


// ============================================================
// TABLE
// ============================================================

function renderLedgerTable() {

    const container =
        document.getElementById(
            "ledger-table-container"
        );


    if (!container) {
        return;
    }


    const filteredEntries =
        getFilteredLedgerEntries();


    if (filteredEntries.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ${ledgerEntries.length === 0 ? "L" : "⌕"}
                </div>


                <h3>

                    ${
                        ledgerEntries.length === 0
                            ? "No ledger entries found"
                            : "No matching ledger entries"
                    }

                </h3>


                <p>

                    ${
                        ledgerEntries.length === 0
                            ? "Ledger entries will appear after successful payment processing."
                            : "Try a different search or type filter."
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
                            Ledger Entry
                        </th>

                        <th>
                            Account
                        </th>

                        <th>
                            Transaction
                        </th>

                        <th>
                            Amount
                        </th>

                        <th>
                            Type
                        </th>

                        <th>
                            Description
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

                    ${filteredEntries
                        .map(entry =>
                            renderLedgerRow(entry)
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

function renderLedgerRow(entry) {

    const ledgerEntryId =
        entry.ledgerEntryId ||
        entry.id;

    const accountId =
        entry.accountId ||
        "";

    const transactionId =
        entry.transactionId ||
        "";

    const amount =
        entry.amount ?? 0;

    const type =
        entry.type ||
        "-";

    const description =
        entry.description ||
        "-";


    return `
        <tr>

            <td>

                <div class="table-primary">

                    <strong>
                        ${shortId(ledgerEntryId)}
                    </strong>

                    <span class="table-secondary">
                        ${escapeHtml(
                            ledgerEntryId || "-"
                        )}
                    </span>

                </div>

            </td>


            <td>

                <span class="monospace">
                    ${shortId(accountId)}
                </span>

            </td>


            <td>

                <span class="monospace">
                    ${shortId(transactionId)}
                </span>

            </td>


            <td>

                <strong>
                    ${formatCurrency(amount)}
                </strong>

            </td>


            <td>

                <span class="ledger-type ${String(type).toLowerCase()}">

                    ${
                        type === "CREDIT"
                            ? "+"
                            : type === "DEBIT"
                                ? "−"
                                : ""
                    }

                    ${escapeHtml(type)}

                </span>

            </td>


            <td>

                <span
                    class="ledger-description"
                    title="${escapeHtml(description)}">

                    ${escapeHtml(description)}

                </span>

            </td>


            <td>

                ${formatDate(entry.createdAt)}

            </td>


            <td class="text-right">

                <div class="action-buttons">

                    <button
                        class="btn btn-icon"
                        title="View ledger entry"
                        onclick="viewLedgerEntry('${ledgerEntryId}')">

                        👁

                    </button>


                    <button
                        class="btn btn-icon"
                        title="View account balance"
                        onclick="viewLedgerAccountBalance('${accountId}')">

                        ₹

                    </button>

                </div>

            </td>

        </tr>
    `;
}


// ============================================================
// SEARCH / FILTER
// ============================================================

function handleLedgerSearch(value) {

    ledgerSearchTerm =
        (value || "")
            .trim()
            .toLowerCase();


    renderLedgerTable();
}


function handleLedgerTypeFilter(value) {

    ledgerTypeFilter =
        value || "";


    renderLedgerTable();
}


function getFilteredLedgerEntries() {

    return ledgerEntries.filter(entry => {

        const ledgerEntryId =
            String(
                entry.ledgerEntryId ||
                entry.id ||
                ""
            ).toLowerCase();


        const accountId =
            String(
                entry.accountId ||
                ""
            ).toLowerCase();


        const transactionId =
            String(
                entry.transactionId ||
                ""
            ).toLowerCase();


        const description =
            String(
                entry.description ||
                ""
            ).toLowerCase();


        const type =
            String(
                entry.type ||
                ""
            ).toLowerCase();


        const matchesSearch =
            !ledgerSearchTerm ||
            ledgerEntryId.includes(ledgerSearchTerm) ||
            accountId.includes(ledgerSearchTerm) ||
            transactionId.includes(ledgerSearchTerm) ||
            description.includes(ledgerSearchTerm);


        const matchesType =
            !ledgerTypeFilter ||
            type === ledgerTypeFilter.toLowerCase();


        return (
            matchesSearch &&
            matchesType
        );
    });
}


// ============================================================
// VIEW LEDGER ENTRY
// ============================================================

async function viewLedgerEntry(ledgerEntryId) {

    const modal =
        document.getElementById(
            "ledger-details-modal"
        );


    const content =
        document.getElementById(
            "ledger-details-content"
        );


    if (!modal || !content) {
        return;
    }


    modal.classList.remove("hidden");


    content.innerHTML = `
        <div class="loading-state">
            Loading ledger entry...
        </div>
    `;


    try {

        const entry =
            await ledgerApi.getById(
                ledgerEntryId
            );


        renderLedgerDetails(entry);

    } catch (error) {

        console.error(
            "Failed to load ledger entry:",
            error
        );


        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load ledger entry
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
// LEDGER DETAILS
// ============================================================

function renderLedgerDetails(entry) {

    const content =
        document.getElementById(
            "ledger-details-content"
        );


    if (!content) {
        return;
    }


    const ledgerEntryId =
        entry.ledgerEntryId ||
        entry.id;


    const accountId =
        entry.accountId ||
        "-";


    const transactionId =
        entry.transactionId ||
        "-";


    const amount =
        entry.amount ?? 0;


    const type =
        entry.type ||
        "-";


    const description =
        entry.description ||
        "-";


    content.innerHTML = `

        <div class="ledger-summary-card">

            <div>

                <span class="ledger-summary-label">
                    Ledger Amount
                </span>


                <div class="ledger-summary-value">

                    ${formatCurrency(amount)}

                </div>

            </div>


            <div>

                <span class="ledger-type large ${String(type).toLowerCase()}">

                    ${
                        type === "CREDIT"
                            ? "+"
                            : type === "DEBIT"
                                ? "−"
                                : ""
                    }

                    ${escapeHtml(type)}

                </span>

            </div>

        </div>


        <div class="details-grid">

            <div class="detail-item">

                <span class="detail-label">
                    Ledger Entry ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(
                        ledgerEntryId || "-"
                    )}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Account ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(accountId)}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Transaction ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(transactionId)}
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
                    Created At
                </span>


                <span class="detail-value">
                    ${formatDate(entry.createdAt)}
                </span>

            </div>


            <div
                class="detail-item detail-item-full">

                <span class="detail-label">
                    Description
                </span>


                <span class="detail-value">
                    ${escapeHtml(description)}
                </span>

            </div>

        </div>
    `;
}


// ============================================================
// ACCOUNT BALANCE
// ============================================================

async function viewLedgerAccountBalance(accountId) {

    if (!accountId) {

        showToast(
            "Account ID is not available",
            "error"
        );

        return;
    }


    const modal =
        document.getElementById(
            "ledger-account-balance-modal"
        );


    const content =
        document.getElementById(
            "ledger-account-balance-content"
        );


    if (!modal || !content) {
        return;
    }


    modal.classList.remove("hidden");


    content.innerHTML = `
        <div class="loading-state">
            Calculating account balance...
        </div>
    `;


    try {

        const balance =
            await ledgerApi.getBalance(
                accountId
            );


        content.innerHTML = `

            <div class="ledger-account-balance">

                <span class="ledger-account-balance-label">
                    Account Balance
                </span>


                <strong class="ledger-account-balance-value">
                    ${formatCurrency(balance)}
                </strong>


                <span class="ledger-account-id">
                    ${escapeHtml(accountId)}
                </span>

            </div>

        `;

    } catch (error) {

        console.error(
            "Failed to load account balance:",
            error
        );


        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to calculate balance
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
// CLOSE MODALS
// ============================================================

function closeLedgerDetailsModal() {

    const modal =
        document.getElementById(
            "ledger-details-modal"
        );


    if (modal) {
        modal.classList.add("hidden");
    }
}


function closeLedgerBalanceModal() {

    const modal =
        document.getElementById(
            "ledger-account-balance-modal"
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


        closeLedgerDetailsModal();

        closeLedgerBalanceModal();
    }
);