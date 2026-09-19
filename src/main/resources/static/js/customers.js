// ============================================================
// FINCORE - Customer Management
// ============================================================

let customers = [];
let customerSearchTerm = "";


// ============================================================
// PAGE RENDER
// ============================================================

async function renderCustomersPage() {
    const page = document.getElementById("page-customers");

    if (!page) {
        console.error("Customer page element not found.");
        return;
    }

    page.innerHTML = `
        <div class="page-header">
            <div>
                <h1>Customers</h1>
                <p>Manage customers registered on the FINCORE platform.</p>
            </div>

            <button class="btn btn-primary" onclick="openCustomerCreateModal()">
                <span>＋</span>
                Add Customer
            </button>
        </div>

        <div class="content-card">
            <div class="toolbar">

                <div class="search-box">
                    <span class="search-icon">⌕</span>

                    <input
                        type="text"
                        id="customer-search"
                        placeholder="Search by name, email or phone..."
                        oninput="handleCustomerSearch(this.value)"
                    />
                </div>

                <div class="toolbar-actions">
                    <button
                        class="btn btn-secondary"
                        onclick="loadCustomers()">
                        ↻ Refresh
                    </button>
                </div>

            </div>

            <div id="customers-table-container">
                <div class="loading-state">
                    Loading customers...
                </div>
            </div>
        </div>

        <!-- Customer Modal -->
        <div id="customer-modal" class="customer-modal hidden">
            <div class="modal-backdrop" onclick="closeCustomerModal()"></div>

            <div class="modal-content">

                <div class="modal-header">
                    <div>
                        <h2 id="customer-modal-title">Add Customer</h2>
                        <p id="customer-modal-subtitle">
                            Create a new customer.
                        </p>
                    </div>

                    <button
                        class="modal-close"
                        onclick="closeCustomerModal()">
                        ×
                    </button>
                </div>

                <form
                    id="customer-form"
                    onsubmit="handleCustomerSubmit(event)">

                    <input
                        type="hidden"
                        id="customer-id"
                    />

                    <div class="form-grid">

                        <div class="form-group">
                            <label for="customer-name">
                                Name <span class="required">*</span>
                            </label>

                            <input
                                type="text"
                                id="customer-name"
                                name="name"
                                maxlength="150"
                                placeholder="Enter customer name"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="customer-email">
                                Email <span class="required">*</span>
                            </label>

                            <input
                                type="email"
                                id="customer-email"
                                name="email"
                                maxlength="255"
                                placeholder="customer@example.com"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="customer-phone">
                                Phone <span class="required">*</span>
                            </label>

                            <input
                                type="tel"
                                id="customer-phone"
                                name="phone"
                                maxlength="10"
                                pattern="[0-9]{10}"
                                placeholder="10 digit mobile number"
                                required
                            />
                        </div>

                    </div>

                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            onclick="closeCustomerModal()">
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="btn btn-primary"
                            id="customer-submit-btn">
                            Create Customer
                        </button>

                    </div>

                </form>
            </div>
        </div>

        <!-- Customer Details Modal -->
       <div id="customer-details-modal" class="customer-modal hidden">
            <div
                class="modal-backdrop"
                onclick="closeCustomerDetailsModal()">
            </div>

            <div class="modal-content modal-lg">

                <div class="modal-header">

                    <div>
                        <h2>Customer Details</h2>
                        <p>Customer information and account status.</p>
                    </div>

                    <button
                        class="modal-close"
                        onclick="closeCustomerDetailsModal()">
                        ×
                    </button>

                </div>

                <div id="customer-details-content">
                    Loading...
                </div>

                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        onclick="closeCustomerDetailsModal()">
                        Close
                    </button>

                </div>

            </div>
        </div>
    `;

    await loadCustomers();
}


// ============================================================
// LOAD CUSTOMERS
// ============================================================

async function loadCustomers() {

    const container = document.getElementById(
        "customers-table-container"
    );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="loading-state">
            Loading customers...
        </div>
    `;

    try {

        customers = await customerApi.getAll();

        console.log(
            "Customers loaded successfully:",
            customers
        );

        renderCustomersTable();

    } catch (error) {

        console.error(
            "Failed to load customers:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠</div>

                <h3>Unable to load customers</h3>

                <p>
                    ${escapeHtml(
                        error.message || "Something went wrong"
                    )}
                </p>

                <button
                    class="btn btn-secondary"
                    onclick="loadCustomers()">
                    Retry
                </button>
            </div>
        `;

        showToast(
            error.message || "Failed to load customers",
            "error"
        );
    }
}


// ============================================================
// TABLE
// ============================================================

function renderCustomersTable() {

    const container = document.getElementById(
        "customers-table-container"
    );

    if (!container) {
        return;
    }

    const filteredCustomers = getFilteredCustomers();

    if (filteredCustomers.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ${customers.length === 0 ? "C" : "⌕"}
                </div>

                <h3>
                    ${
                        customers.length === 0
                            ? "No customers found"
                            : "No matching customers"
                    }
                </h3>

                <p>
                    ${
                        customers.length === 0
                            ? "Create your first customer to get started."
                            : "Try a different search term."
                    }
                </p>

                ${
                    customers.length === 0
                        ? `
                            <button
                                class="btn btn-primary"
                                onclick="openCustomerCreateModal()">
                                ＋ Add Customer
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
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th class="text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>

                    ${filteredCustomers
                        .map(customer => renderCustomerRow(customer))
                        .join("")}

                </tbody>

            </table>

        </div>
    `;
}


function renderCustomerRow(customer) {

    const customerId =
        customer.customerId || customer.id;

    const name =
        customer.name || "-";

    const email =
        customer.email || "-";

    const phone =
        customer.phone || "-";

    const status =
        customer.status || "ACTIVE";

    const createdAt =
        customer.createdAt;

    return `
        <tr>

            <td>
                <div class="table-primary">

                    <strong>
                        ${escapeHtml(name)}
                    </strong>

                    <span class="table-secondary">
                        ${shortId(customerId)}
                    </span>

                </div>
            </td>

            <td>
                ${escapeHtml(email)}
            </td>

            <td>
                ${escapeHtml(phone)}
            </td>

            <td>
                ${statusBadge(status)}
            </td>

            <td>
                ${formatDate(createdAt)}
            </td>

            <td class="text-right">

                <div class="action-buttons">

                    <button
                        class="btn btn-icon"
                        title="View"
                        onclick="viewCustomer('${customerId}')">
                        👁
                    </button>

                    <button
                        class="btn btn-icon"
                        title="Edit"
                        onclick="openCustomerEditModal('${customerId}')">
                        ✎
                    </button>

                    <button
                        class="btn btn-icon"
                        title="Change Status"
                        onclick="changeCustomerStatus('${customerId}')">
                        ⇄
                    </button>

                    <button
                        class="btn btn-icon btn-danger"
                        title="Delete"
                        onclick="deleteCustomer('${customerId}')">
                        🗑
                    </button>

                </div>

            </td>

        </tr>
    `;
}


// ============================================================
// SEARCH
// ============================================================

function handleCustomerSearch(value) {

    customerSearchTerm =
        (value || "").trim().toLowerCase();

    renderCustomersTable();
}


function getFilteredCustomers() {

    if (!customerSearchTerm) {
        return customers;
    }

    return customers.filter(customer => {

        const name =
            String(customer.name || "").toLowerCase();

        const email =
            String(customer.email || "").toLowerCase();

        const phone =
            String(customer.phone || "").toLowerCase();

        const id =
            String(
                customer.customerId ||
                customer.id ||
                ""
            ).toLowerCase();

        return (
            name.includes(customerSearchTerm) ||
            email.includes(customerSearchTerm) ||
            phone.includes(customerSearchTerm) ||
            id.includes(customerSearchTerm)
        );
    });
}


// ============================================================
// CREATE MODAL
// ============================================================

function openCustomerCreateModal() {

    const modal =
        document.getElementById("customer-modal");

    if (!modal) {
        return;
    }

    document.getElementById(
        "customer-modal-title"
    ).textContent = "Add Customer";

    document.getElementById(
        "customer-modal-subtitle"
    ).textContent = "Create a new customer.";

    document.getElementById(
        "customer-submit-btn"
    ).textContent = "Create Customer";

    document.getElementById(
        "customer-id"
    ).value = "";

    document.getElementById(
        "customer-name"
    ).value = "";

    document.getElementById(
        "customer-email"
    ).value = "";

    document.getElementById(
        "customer-phone"
    ).value = "";

    modal.classList.remove("hidden");

    setTimeout(() => {
        document.getElementById(
            "customer-name"
        )?.focus();
    }, 100);
}


// ============================================================
// EDIT MODAL
// ============================================================

async function openCustomerEditModal(customerId) {

    try {

        setLoading(true);

        const customer =
            await customerApi.getById(customerId);

        setLoading(false);

        const modal =
            document.getElementById("customer-modal");

        if (!modal) {
            return;
        }

        document.getElementById(
            "customer-modal-title"
        ).textContent = "Edit Customer";

        document.getElementById(
            "customer-modal-subtitle"
        ).textContent =
            "Update customer information.";

        document.getElementById(
            "customer-submit-btn"
        ).textContent = "Save Changes";

        document.getElementById(
            "customer-id"
        ).value =
            customer.customerId || customer.id;

        document.getElementById(
            "customer-name"
        ).value =
            customer.name || "";

        document.getElementById(
            "customer-email"
        ).value =
            customer.email || "";

        document.getElementById(
            "customer-phone"
        ).value =
            customer.phone || "";

        modal.classList.remove("hidden");

        setTimeout(() => {
            document.getElementById(
                "customer-name"
            )?.focus();
        }, 100);

    } catch (error) {

        setLoading(false);

        console.error(
            "Failed to load customer:",
            error
        );

        showToast(
            error.message || "Failed to load customer",
            "error"
        );
    }
}


// ============================================================
// SUBMIT CREATE / UPDATE
// ============================================================

async function handleCustomerSubmit(event) {

    event.preventDefault();

    const form =
        event.target;

    if (!form.checkValidity()) {

        form.reportValidity();

        return;
    }

    const customerId =
        document.getElementById(
            "customer-id"
        ).value;

    const request = {

        name: document.getElementById(
            "customer-name"
        ).value.trim(),

        email: document.getElementById(
            "customer-email"
        ).value.trim(),

        phone: document.getElementById(
            "customer-phone"
        ).value.trim()
    };

    const submitButton =
        document.getElementById(
            "customer-submit-btn"
        );

    try {

        submitButton.disabled = true;

        submitButton.textContent =
            customerId
                ? "Saving..."
                : "Creating...";

        if (customerId) {

            await customerApi.update(
                customerId,
                request
            );

            showToast(
                "Customer updated successfully",
                "success"
            );

        } else {

            await customerApi.create(
                request
            );

            showToast(
                "Customer created successfully",
                "success"
            );
        }

        closeCustomerModal();

        await loadCustomers();

    } catch (error) {

        console.error(
            "Customer save failed:",
            error
        );

        showToast(
            error.message ||
            "Failed to save customer",
            "error"
        );

    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            customerId
                ? "Save Changes"
                : "Create Customer";
    }
}


// ============================================================
// VIEW CUSTOMER
// ============================================================

async function viewCustomer(customerId) {

    const modal =
        document.getElementById(
            "customer-details-modal"
        );

    const content =
        document.getElementById(
            "customer-details-content"
        );

    if (!modal || !content) {
        return;
    }

    modal.classList.remove("hidden");

    content.innerHTML = `
        <div class="loading-state">
            Loading customer...
        </div>
    `;

    try {

        const customer =
            await customerApi.getById(customerId);

        renderCustomerDetails(customer);

    } catch (error) {

        console.error(
            "Failed to load customer details:",
            error
        );

        content.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ⚠
                </div>

                <h3>
                    Unable to load customer
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


function renderCustomerDetails(customer) {

    const content =
        document.getElementById(
            "customer-details-content"
        );

    if (!content) {
        return;
    }

    const customerId =
        customer.customerId ||
        customer.id;

    content.innerHTML = `

        <div class="details-grid">

            <div class="detail-item">
                <span class="detail-label">
                    Customer ID
                </span>

                <span class="detail-value monospace">
                    ${escapeHtml(customerId || "-")}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">
                    Name
                </span>

                <span class="detail-value">
                    ${escapeHtml(customer.name || "-")}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">
                    Email
                </span>

                <span class="detail-value">
                    ${escapeHtml(customer.email || "-")}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">
                    Phone
                </span>

                <span class="detail-value">
                    ${escapeHtml(customer.phone || "-")}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">
                    Status
                </span>

                <span class="detail-value">
                    ${statusBadge(customer.status)}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">
                    Created At
                </span>

                <span class="detail-value">
                    ${formatDate(customer.createdAt)}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">
                    Updated At
                </span>

                <span class="detail-value">
                    ${formatDate(customer.updatedAt)}
                </span>
            </div>

        </div>
    `;
}


// ============================================================
// CHANGE STATUS
// ============================================================

async function changeCustomerStatus(customerId) {

    try {

        const customer =
            await customerApi.getById(customerId);

        const currentStatus =
            customer.status || "ACTIVE";

        const newStatus =
            currentStatus === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        const confirmed =
            confirm(
                `Change customer status from ${currentStatus} to ${newStatus}?`
            );

        if (!confirmed) {
            return;
        }

        setLoading(true);

        await customerApi.updateStatus(
            customerId,
            newStatus
        );

        setLoading(false);

        showToast(
            `Customer status changed to ${newStatus}`,
            "success"
        );

        await loadCustomers();

    } catch (error) {

        setLoading(false);

        console.error(
            "Customer status update failed:",
            error
        );

        showToast(
            error.message ||
            "Failed to update customer status",
            "error"
        );
    }
}


// ============================================================
// DELETE CUSTOMER
// ============================================================

async function deleteCustomer(customerId) {

    let customer;

    try {

        customer =
            await customerApi.getById(customerId);

    } catch (error) {

        showToast(
            error.message ||
            "Unable to load customer",
            "error"
        );

        return;
    }

    const customerName =
        customer.name ||
        customer.email ||
        shortId(customerId);

    const confirmed =
        confirm(
            `Delete customer "${customerName}"?\n\n` +
            `This will perform a soft delete.`
        );

    if (!confirmed) {
        return;
    }

    try {

        setLoading(true);

        await customerApi.delete(
            customerId
        );

        setLoading(false);

        showToast(
            "Customer deleted successfully",
            "success"
        );

        await loadCustomers();

    } catch (error) {

        setLoading(false);

        console.error(
            "Customer deletion failed:",
            error
        );

        showToast(
            error.message ||
            "Failed to delete customer",
            "error"
        );
    }
}


// ============================================================
// CLOSE MODALS
// ============================================================

function closeCustomerModal() {

    const modal =
        document.getElementById(
            "customer-modal"
        );

    if (modal) {
        modal.classList.add("hidden");
    }
}


function closeCustomerDetailsModal() {

    const modal =
        document.getElementById(
            "customer-details-modal"
        );

    if (modal) {
        modal.classList.add("hidden");
    }
}


// ============================================================
// KEYBOARD HANDLING
// ============================================================

document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
        return;
    }

    closeCustomerModal();
    closeCustomerDetailsModal();
});