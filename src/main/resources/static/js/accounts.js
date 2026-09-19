// ============================================================
// FINCORE - Account Management
// ============================================================

let accounts = [];
let accountSearchTerm = "";


// ============================================================
// PAGE
// ============================================================

async function renderAccountsPage() {

    const page = document.getElementById("page-accounts");

    if (!page) {
        console.error("Account page element not found.");
        return;
    }

    page.innerHTML = `
        <div class="page-header">

            <div>
                <h1>Accounts</h1>

                <p>
                    Manage merchant financial accounts and balances.
                </p>
            </div>

            <button
                class="btn btn-primary"
                onclick="openAccountCreateModal()">

                <span>＋</span>
                Create Account

            </button>

        </div>


        <div class="content-card">

            <div class="toolbar">

                <div class="search-box">

                    <span class="search-icon">⌕</span>

                    <input
                        type="text"
                        id="account-search"
                        placeholder="Search by account ID or merchant ID..."
                        oninput="handleAccountSearch(this.value)"
                    />

                </div>


                <div class="toolbar-actions">

                    <button
                        class="btn btn-secondary"
                        onclick="loadAccounts()">

                        ↻ Refresh

                    </button>

                </div>

            </div>


            <div id="accounts-table-container">

                <div class="loading-state">
                    Loading accounts...
                </div>

            </div>

        </div>


        <!-- ==================================================
             CREATE ACCOUNT MODAL
             ================================================== -->

        <div
            id="account-modal"
            class="account-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeAccountModal()">
            </div>


            <div class="modal-content">

                <div class="modal-header">

                    <div>

                        <h2>
                            Create Account
                        </h2>

                        <p>
                            Create a financial account for a merchant.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeAccountModal()">

                        ×

                    </button>

                </div>


                <form
                    id="account-form"
                    onsubmit="handleAccountSubmit(event)">

                    <div class="form-grid">

                        <div class="form-group full-width">

                            <label for="account-merchant-id">

                                Merchant ID
                                <span class="required">*</span>

                            </label>


                            <input
                                type="text"
                                id="account-merchant-id"
                                placeholder="Enter merchant UUID"
                                required
                            />


                            <small class="form-help">
                                Each merchant can have one account.
                            </small>

                        </div>

                    </div>


                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            onclick="closeAccountModal()">

                            Cancel

                        </button>


                        <button
                            type="submit"
                            class="btn btn-primary"
                            id="account-submit-btn">

                            Create Account

                        </button>

                    </div>

                </form>

            </div>

        </div>


        <!-- ==================================================
             ACCOUNT DETAILS MODAL
             ================================================== -->

        <div
            id="account-details-modal"
            class="account-modal hidden">

            <div
                class="modal-backdrop"
                onclick="closeAccountDetailsModal()">
            </div>


            <div class="modal-content modal-lg">

                <div class="modal-header">

                    <div>

                        <h2>
                            Account Details
                        </h2>

                        <p>
                            Financial account information.
                        </p>

                    </div>


                    <button
                        class="modal-close"
                        onclick="closeAccountDetailsModal()">

                        ×

                    </button>

                </div>


                <div id="account-details-content">

                    <div class="loading-state">
                        Loading...
                    </div>

                </div>


                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        onclick="closeAccountDetailsModal()">

                        Close

                    </button>

                </div>

            </div>

        </div>
    `;


    await loadAccounts();
}


// ============================================================
// LOAD ACCOUNTS
// ============================================================

async function loadAccounts() {

    const container =
        document.getElementById(
            "accounts-table-container"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading accounts...
        </div>
    `;


    try {

        accounts =
            await accountApi.getAll();


        console.log(
            "Accounts loaded successfully:",
            accounts
        );


        renderAccountsTable();

    } catch (error) {

        console.error(
            "Failed to load accounts:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load accounts
                </h3>


                <p>
                    ${escapeHtml(
                        error.message ||
                        "Something went wrong"
                    )}
                </p>


                <button
                    class="btn btn-secondary"
                    onclick="loadAccounts()">

                    Retry

                </button>

            </div>
        `;


        showToast(
            error.message ||
            "Failed to load accounts",
            "error"
        );
    }
}


// ============================================================
// TABLE
// ============================================================

function renderAccountsTable() {

    const container =
        document.getElementById(
            "accounts-table-container"
        );

    if (!container) {
        return;
    }


    const filteredAccounts =
        getFilteredAccounts();


    if (filteredAccounts.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ${accounts.length === 0 ? "A" : "⌕"}
                </div>


                <h3>

                    ${
                        accounts.length === 0
                            ? "No accounts found"
                            : "No matching accounts"
                    }

                </h3>


                <p>

                    ${
                        accounts.length === 0
                            ? "Create an account for a merchant to get started."
                            : "Try a different search term."
                    }

                </p>


                ${
                    accounts.length === 0
                        ? `
                            <button
                                class="btn btn-primary"
                                onclick="openAccountCreateModal()">

                                ＋ Create Account

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
                            Account
                        </th>

                        <th>
                            Merchant ID
                        </th>

                        <th>
                            Balance
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

                    ${filteredAccounts
                        .map(account =>
                            renderAccountRow(account)
                        )
                        .join("")}

                </tbody>

            </table>

        </div>
    `;
}


// ============================================================
// ACCOUNT ROW
// ============================================================

function renderAccountRow(account) {

    const accountId =
        account.accountId ||
        account.id;

    const merchantId =
        account.merchantId;

    const balance =
        account.balance ?? 0;

    const status =
        account.status ||
        "ACTIVE";

    return `

        <tr>

            <td>

                <div class="table-primary">

                    <strong>
                        ${shortId(accountId)}
                    </strong>


                    <span class="table-secondary">
                        ${escapeHtml(accountId || "-")}
                    </span>

                </div>

            </td>


            <td>

                <span class="monospace">
                    ${shortId(merchantId)}
                </span>

            </td>


            <td>

                <strong class="balance-value">

                    ${formatCurrency(balance)}

                </strong>

            </td>


            <td>

                ${statusBadge(status)}

            </td>


            <td>

                ${formatDate(account.createdAt)}

            </td>


            <td class="text-right">

                <div class="action-buttons">

                    <button
                        class="btn btn-icon"
                        title="View account"
                        onclick="viewAccount('${accountId}')">

                        👁

                    </button>


                    <button
                        class="btn btn-icon"
                        title="View balance"
                        onclick="viewAccountBalance('${accountId}')">

                        ₹

                    </button>

                </div>

            </td>

        </tr>
    `;
}


// ============================================================
// SEARCH
// ============================================================

function handleAccountSearch(value) {

    accountSearchTerm =
        (value || "")
            .trim()
            .toLowerCase();


    renderAccountsTable();
}


function getFilteredAccounts() {

    if (!accountSearchTerm) {
        return accounts;
    }


    return accounts.filter(account => {

        const accountId =
            String(
                account.accountId ||
                account.id ||
                ""
            ).toLowerCase();


        const merchantId =
            String(
                account.merchantId ||
                ""
            ).toLowerCase();


        const status =
            String(
                account.status ||
                ""
            ).toLowerCase();


        return (
            accountId.includes(accountSearchTerm) ||
            merchantId.includes(accountSearchTerm) ||
            status.includes(accountSearchTerm)
        );
    });
}


// ============================================================
// CREATE ACCOUNT
// ============================================================

function openAccountCreateModal() {

    const modal =
        document.getElementById(
            "account-modal"
        );

    if (!modal) {
        return;
    }


    document.getElementById(
        "account-merchant-id"
    ).value = "";


    modal.classList.remove("hidden");


    setTimeout(() => {

        document.getElementById(
            "account-merchant-id"
        )?.focus();

    }, 100);
}


// ============================================================
// CREATE SUBMIT
// ============================================================

async function handleAccountSubmit(event) {

    event.preventDefault();


    const form =
        event.target;


    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }


    const merchantId =
        document.getElementById(
            "account-merchant-id"
        ).value.trim();


    const submitButton =
        document.getElementById(
            "account-submit-btn"
        );


    try {

        submitButton.disabled = true;

        submitButton.textContent =
            "Creating...";


        await accountApi.create({
            merchantId: merchantId
        });


        showToast(
            "Account created successfully",
            "success"
        );


        closeAccountModal();


        await loadAccounts();


    } catch (error) {

        console.error(
            "Account creation failed:",
            error
        );


        showToast(
            error.message ||
            "Failed to create account",
            "error"
        );


    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Create Account";
    }
}


// ============================================================
// VIEW ACCOUNT
// ============================================================

async function viewAccount(accountId) {

    const modal =
        document.getElementById(
            "account-details-modal"
        );

    const content =
        document.getElementById(
            "account-details-content"
        );


    if (!modal || !content) {
        return;
    }


    modal.classList.remove("hidden");


    content.innerHTML = `

        <div class="loading-state">
            Loading account...
        </div>
    `;


    try {

        const account =
            await accountApi.getById(
                accountId
            );


        renderAccountDetails(account);


    } catch (error) {

        console.error(
            "Failed to load account:",
            error
        );


        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>


                <h3>
                    Unable to load account
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
// ACCOUNT DETAILS
// ============================================================

function renderAccountDetails(account) {

    const content =
        document.getElementById(
            "account-details-content"
        );


    if (!content) {
        return;
    }


    const accountId =
        account.accountId ||
        account.id;


    content.innerHTML = `

        <div class="account-balance-card">

            <div>

                <span class="account-balance-label">
                    Current Balance
                </span>


                <div class="account-balance-value">

                    ${formatCurrency(
                        account.balance ?? 0
                    )}

                </div>

            </div>


            <div class="account-balance-icon">
                ₹
            </div>

        </div>


        <div class="details-grid">

            <div class="detail-item">

                <span class="detail-label">
                    Account ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(accountId || "-")}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Merchant ID
                </span>


                <span class="detail-value monospace">
                    ${escapeHtml(
                        account.merchantId || "-"
                    )}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Status
                </span>


                <span class="detail-value">

                    ${statusBadge(
                        account.status
                    )}

                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Created At
                </span>


                <span class="detail-value">
                    ${formatDate(
                        account.createdAt
                    )}
                </span>

            </div>


            <div class="detail-item">

                <span class="detail-label">
                    Updated At
                </span>


                <span class="detail-value">
                    ${formatDate(
                        account.updatedAt
                    )}
                </span>

            </div>

        </div>
    `;
}


// ============================================================
// BALANCE
// ============================================================

async function viewAccountBalance(accountId) {

    try {

        setLoading(true);


        const balance =
            await accountApi.getBalance(
                accountId
            );


        setLoading(false);


        showToast(
            `Current balance: ${formatCurrency(balance)}`,
            "success"
        );


    } catch (error) {

        setLoading(false);


        console.error(
            "Failed to fetch account balance:",
            error
        );


        showToast(
            error.message ||
            "Failed to fetch balance",
            "error"
        );
    }
}


// ============================================================
// CLOSE MODALS
// ============================================================

function closeAccountModal() {

    const modal =
        document.getElementById(
            "account-modal"
        );


    if (modal) {
        modal.classList.add("hidden");
    }
}


function closeAccountDetailsModal() {

    const modal =
        document.getElementById(
            "account-details-modal"
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


        closeAccountModal();

        closeAccountDetailsModal();
    }
);