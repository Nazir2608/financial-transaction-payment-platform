/* ============================================
   FINCORE MERCHANT MANAGEMENT
   ============================================ */


/**
 * Render Merchant page.
 */
function renderMerchantsPage() {

    const page =
        document.getElementById(
            "page-merchants"
        );

    if (!page) {
        return;
    }


    page.innerHTML = `

        <!-- ==================================
             PAGE HEADER
             ================================== -->

        <div class="page-header">

            <div>

                <h1>
                    Merchants
                </h1>

                <p>
                    Manage businesses using the FINCORE platform.
                </p>

            </div>


            <button
                class="primary-button"
                id="createMerchantButton"
            >
                + Create Merchant
            </button>

        </div>


        <!-- ==================================
             TOOLBAR
             ================================== -->

        <div class="toolbar">

            <div class="toolbar-left">

                <input
                    type="text"
                    id="merchantSearch"
                    class="search-input"
                    placeholder="Search merchants..."
                >

            </div>


            <div class="toolbar-right">

                <button
                    class="secondary-button"
                    id="refreshMerchantsButton"
                >
                    ↻ Refresh
                </button>

            </div>

        </div>


        <!-- ==================================
             MERCHANT TABLE
             ================================== -->

        <div class="table-card">

            <div class="table-wrapper">

                <table>

                    <thead>

                    <tr>

                        <th>
                            Merchant
                        </th>

                        <th>
                            Email
                        </th>

                        <th>
                            Phone
                        </th>

                        <th>
                            Business
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Created
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                    </thead>


                    <tbody
                        id="merchantsTableBody"
                    >

                    <tr>

                        <td
                            colspan="7"
                            class="empty-state"
                        >
                            Loading merchants...
                        </td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </div>


        <!-- ==================================
             CREATE / EDIT MODAL
             ================================== -->

        <div
            id="merchantModal"
            class="modal-overlay hidden"
        >

            <div class="modal">

                <div class="modal-header">

                    <div
                        class="modal-title"
                        id="merchantModalTitle"
                    >
                        Create Merchant
                    </div>


                    <button
                        class="modal-close"
                        id="closeMerchantModal"
                    >
                        ×
                    </button>

                </div>


                <div class="modal-body">

                    <form
                        id="merchantForm"
                    >

                        <input
                            type="hidden"
                            id="merchantId"
                        >


                        <div class="form-grid">

                            <div class="form-group">

                                <label class="form-label">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    id="merchantName"
                                    class="form-input"
                                    placeholder="John Doe"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label class="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="merchantEmail"
                                    class="form-input"
                                    placeholder="john@example.com"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label class="form-label">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    id="merchantPhone"
                                    class="form-input"
                                    placeholder="9876543210"
                                    required
                                >

                            </div>


                            <div class="form-group">

                                <label class="form-label">
                                    Business Name
                                </label>

                                <input
                                    type="text"
                                    id="merchantBusinessName"
                                    class="form-input"
                                    placeholder="ABC Store Pvt Ltd"
                                    required
                                >

                            </div>

                        </div>


                        <div class="form-actions">

                            <button
                                type="button"
                                class="secondary-button"
                                id="cancelMerchantButton"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                class="primary-button"
                            >
                                Save Merchant
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>


        <!-- ==================================
             DETAILS MODAL
             ================================== -->

        <div
            id="merchantDetailsModal"
            class="modal-overlay hidden"
        >

            <div class="modal">

                <div class="modal-header">

                    <div class="modal-title">
                        Merchant Details
                    </div>


                    <button
                        class="modal-close"
                        id="closeMerchantDetailsModal"
                    >
                        ×
                    </button>

                </div>


                <div
                    class="modal-body"
                    id="merchantDetailsBody"
                >
                    Loading...
                </div>

            </div>

        </div>

    `;


    setupMerchantEvents();

    loadMerchants();
}


/**
 * Merchant state.
 */
let merchants = [];


/**
 * Load merchants.
 */
async function loadMerchants() {

    const tbody =
        document.getElementById(
            "merchantsTableBody"
        );


    if (!tbody) {
        return;
    }


    try {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-state"
                >
                    Loading merchants...
                </td>
            </tr>
        `;


        merchants =
            await merchantApi.getAll();


        if (!Array.isArray(merchants)) {

            merchants = [];

        }


        renderMerchantsTable(
            merchants
        );


    } catch (error) {

        console.error(
            "Failed to load merchants:",
            error
        );


        tbody.innerHTML =
            emptyTable(
                7,
                error.message ||
                "Unable to load merchants"
            );


        showToast(
            "Unable to load merchants",
            "error"
        );

    }

}


/**
 * Render merchant table.
 */
function renderMerchantsTable(
    data
) {

    const tbody =
        document.getElementById(
            "merchantsTableBody"
        );


    if (!tbody) {
        return;
    }


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        tbody.innerHTML =
            emptyTable(
                7,
                "No merchants found"
            );

        return;

    }


    tbody.innerHTML =
        data.map(
            merchant => `

                <tr>

                    <td>

                        <div>
                            <strong>
                                ${escapeHtml(
                                    merchant.name
                                )}
                            </strong>
                        </div>

                        <div
                            style="
                                font-size:9px;
                                color:#9ca3af;
                                margin-top:3px;
                            "
                        >
                            ${escapeHtml(
                                shortId(
                                    merchant.id ||
                                    merchant.merchantId
                                )
                            )}
                        </div>

                    </td>


                    <td>
                        ${escapeHtml(
                            merchant.email
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            merchant.phone
                        )}
                    </td>


                    <td>
                        ${escapeHtml(
                            merchant.businessName
                        )}
                    </td>


                    <td>
                        ${statusBadge(
                            merchant.status
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            merchant.createdAt
                        )}
                    </td>


                    <td>

                        <div
                            style="
                                display:flex;
                                gap:6px;
                            "
                        >

                            <button
                                class="secondary-button"
                                onclick="viewMerchant('${merchant.id || merchant.merchantId}')"
                            >
                                View
                            </button>


                            <button
                                class="secondary-button"
                                onclick="editMerchant('${merchant.id || merchant.merchantId}')"
                            >
                                Edit
                            </button>

                        </div>

                    </td>

                </tr>

            `
        )
        .join("");

}


/**
 * Setup Merchant events.
 */
function setupMerchantEvents() {

    const createButton =
        document.getElementById(
            "createMerchantButton"
        );


    createButton?.addEventListener(
        "click",
        () => {

            openCreateMerchantModal();

        }
    );


    const refreshButton =
        document.getElementById(
            "refreshMerchantsButton"
        );


    refreshButton?.addEventListener(
        "click",
        async () => {

            await loadMerchants();

            showToast(
                "Merchants refreshed"
            );

        }
    );


    const closeButton =
        document.getElementById(
            "closeMerchantModal"
        );


    closeButton?.addEventListener(
        "click",
        closeMerchantModal
    );


    const cancelButton =
        document.getElementById(
            "cancelMerchantButton"
        );


    cancelButton?.addEventListener(
        "click",
        closeMerchantModal
    );


    const detailsClose =
        document.getElementById(
            "closeMerchantDetailsModal"
        );


    detailsClose?.addEventListener(
        "click",
        closeMerchantDetailsModal
    );


    const form =
        document.getElementById(
            "merchantForm"
        );


    form?.addEventListener(
        "submit",
        handleMerchantSubmit
    );


    const search =
        document.getElementById(
            "merchantSearch"
        );


    search?.addEventListener(
        "input",
        event => {

            const value =
                event.target.value
                    .trim()
                    .toLowerCase();


            if (!value) {

                renderMerchantsTable(
                    merchants
                );

                return;

            }


            const filtered =
                merchants.filter(
                    merchant => {

                        return [

                            merchant.name,

                            merchant.email,

                            merchant.phone,

                            merchant.businessName,

                            merchant.status

                        ]
                            .filter(Boolean)
                            .some(
                                field =>
                                    String(field)
                                        .toLowerCase()
                                        .includes(value)
                            );

                    }
                );


            renderMerchantsTable(
                filtered
            );

        }
    );


    /*
     * Close modal when clicking outside.
     */

    document
        .getElementById(
            "merchantModal"
        )
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "merchantModal"
                ) {

                    closeMerchantModal();

                }

            }
        );


    document
        .getElementById(
            "merchantDetailsModal"
        )
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target.id ===
                    "merchantDetailsModal"
                ) {

                    closeMerchantDetailsModal();

                }

            }
        );

}


/**
 * Open create modal.
 */
function openCreateMerchantModal() {

    const form =
        document.getElementById(
            "merchantForm"
        );


    form?.reset();


    document.getElementById(
        "merchantId"
    ).value = "";


    document.getElementById(
        "merchantModalTitle"
    ).textContent =
        "Create Merchant";


    document.getElementById(
        "merchantModal"
    ).classList.remove(
        "hidden"
    );

}


/**
 * Open edit modal.
 */
async function editMerchant(
    merchantId
) {

    try {

        setLoading(
            true,
            "Loading merchant..."
        );


        const merchant =
            await merchantApi.getById(
                merchantId
            );


        document.getElementById(
            "merchantId"
        ).value =
            merchant.id ||
            merchant.merchantId;


        document.getElementById(
            "merchantName"
        ).value =
            merchant.name || "";


        document.getElementById(
            "merchantEmail"
        ).value =
            merchant.email || "";


        document.getElementById(
            "merchantPhone"
        ).value =
            merchant.phone || "";


        document.getElementById(
            "merchantBusinessName"
        ).value =
            merchant.businessName || "";


        document.getElementById(
            "merchantModalTitle"
        ).textContent =
            "Edit Merchant";


        document.getElementById(
            "merchantModal"
        ).classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            error.message ||
            "Unable to load merchant",
            "error"
        );

    } finally {

        setLoading(false);

    }

}


/**
 * Submit create/update form.
 */
async function handleMerchantSubmit(
    event
) {

    event.preventDefault();


    const merchantId =
        document.getElementById(
            "merchantId"
        ).value;


    const request = {

        name:
            document.getElementById(
                "merchantName"
            ).value.trim(),

        email:
            document.getElementById(
                "merchantEmail"
            ).value.trim(),

        phone:
            document.getElementById(
                "merchantPhone"
            ).value.trim(),

        businessName:
            document.getElementById(
                "merchantBusinessName"
            ).value.trim()

    };


    try {

        setLoading(
            true,
            merchantId
                ? "Updating merchant..."
                : "Creating merchant..."
        );


        if (merchantId) {

            await merchantApi.update(
                merchantId,
                request
            );


            showToast(
                "Merchant updated successfully"
            );

        } else {

            await merchantApi.create(
                request
            );


            showToast(
                "Merchant created successfully"
            );

        }


        closeMerchantModal();

        await loadMerchants();


    } catch (error) {

        console.error(
            "Merchant save failed:",
            error
        );


        showToast(
            error.message ||
            "Unable to save merchant",
            "error"
        );

    } finally {

        setLoading(false);

    }

}


/**
 * Close merchant modal.
 */
function closeMerchantModal() {

    document.getElementById(
        "merchantModal"
    )?.classList.add(
        "hidden"
    );

}


/**
 * View merchant.
 */
async function viewMerchant(
    merchantId
) {

    try {

        setLoading(
            true,
            "Loading merchant details..."
        );


        const merchant =
            await merchantApi.getById(
                merchantId
            );


        const id =
            merchant.id ||
            merchant.merchantId;


        const detailsBody =
            document.getElementById(
                "merchantDetailsBody"
            );


        detailsBody.innerHTML = `

            <div class="detail-grid">

                <div class="detail-item">

                    <div class="detail-label">
                        Merchant ID
                    </div>

                    <div class="detail-value copyable"
                        onclick="copyToClipboard('${escapeHtml(id)}')"
                    >
                        ${escapeHtml(id)}
                    </div>

                </div>


                <div class="detail-item">

                    <div class="detail-label">
                        Name
                    </div>

                    <div class="detail-value">
                        ${escapeHtml(
                            merchant.name
                        )}
                    </div>

                </div>


                <div class="detail-item">

                    <div class="detail-label">
                        Status
                    </div>

                    <div class="detail-value">
                        ${statusBadge(
                            merchant.status
                        )}
                    </div>

                </div>


                <div class="detail-item">

                    <div class="detail-label">
                        Email
                    </div>

                    <div class="detail-value">
                        ${escapeHtml(
                            merchant.email
                        )}
                    </div>

                </div>


                <div class="detail-item">

                    <div class="detail-label">
                        Phone
                    </div>

                    <div class="detail-value">
                        ${escapeHtml(
                            merchant.phone
                        )}
                    </div>

                </div>


                <div class="detail-item">

                    <div class="detail-label">
                        Business Name
                    </div>

                    <div class="detail-value">
                        ${escapeHtml(
                            merchant.businessName
                        )}
                    </div>

                </div>


                <div class="detail-item">

                    <div class="detail-label">
                        Created At
                    </div>

                    <div class="detail-value">
                        ${formatDate(
                            merchant.createdAt
                        )}
                    </div>

                </div>


                <div class="detail-item">

                    <div class="detail-label">
                        Updated At
                    </div>

                    <div class="detail-value">
                        ${formatDate(
                            merchant.updatedAt
                        )}
                    </div>

                </div>

            </div>


            <div class="form-actions">

                <button
                    class="secondary-button"
                    onclick="editMerchant('${escapeHtml(id)}')"
                >
                    Edit
                </button>


                <button
                    class="secondary-button"
                    onclick="changeMerchantStatus('${escapeHtml(id)}')"
                >
                    Change Status
                </button>


                <button
                    class="danger-button"
                    onclick="deleteMerchant('${escapeHtml(id)}')"
                >
                    Delete
                </button>

            </div>

        `;


        document.getElementById(
            "merchantDetailsModal"
        ).classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(
            error
        );


        showToast(
            error.message ||
            "Unable to load merchant",
            "error"
        );

    } finally {

        setLoading(false);

    }

}


/**
 * Close details modal.
 */
function closeMerchantDetailsModal() {

    document.getElementById(
        "merchantDetailsModal"
    )?.classList.add(
        "hidden"
    );

}


/**
 * Change merchant status.
 */
async function changeMerchantStatus(
    merchantId
) {

    const status =
        window.prompt(
            "Enter new status:\n\nACTIVE\nINACTIVE\nSUSPENDED"
        );


    if (!status) {
        return;
    }


    const normalized =
        status.trim().toUpperCase();


    if (
        ![
            "ACTIVE",
            "INACTIVE",
            "SUSPENDED"
        ].includes(normalized)
    ) {

        showToast(
            "Invalid merchant status",
            "error"
        );

        return;

    }


    try {

        setLoading(
            true,
            "Updating merchant status..."
        );


        await merchantApi.updateStatus(
            merchantId,
            normalized
        );


        showToast(
            "Merchant status updated"
        );


        closeMerchantDetailsModal();

        await loadMerchants();


    } catch (error) {

        console.error(
            error
        );


        showToast(
            error.message ||
            "Unable to update status",
            "error"
        );

    } finally {

        setLoading(false);

    }

}


/**
 * Delete merchant.
 */
async function deleteMerchant(
    merchantId
) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this merchant?\n\nThis will perform a soft delete."
        );


    if (!confirmed) {
        return;
    }


    try {

        setLoading(
            true,
            "Deleting merchant..."
        );


        await merchantApi.delete(
            merchantId
        );


        showToast(
            "Merchant deleted successfully"
        );


        closeMerchantDetailsModal();

        await loadMerchants();


    } catch (error) {

        console.error(
            error
        );


        showToast(
            error.message ||
            "Unable to delete merchant",
            "error"
        );

    } finally {

        setLoading(false);

    }

}