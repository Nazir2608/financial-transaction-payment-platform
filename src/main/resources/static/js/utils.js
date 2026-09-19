/* ============================================
   FINCORE UI UTILITIES
   ============================================ */


/**
 * Escape HTML to prevent accidental HTML injection.
 */
function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/**
 * Format currency.
 */
function formatCurrency(value) {

    const amount =
        Number(value || 0);

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    ).format(amount);
}


/**
 * Format date.
 */
function formatDate(value) {

    if (!value) {
        return "-";
    }

    try {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        ).format(new Date(value));

    } catch (error) {

        return value;

    }
}


/**
 * Short UUID.
 */
function shortId(value, length = 8) {

    if (!value) {
        return "-";
    }

    return String(value).substring(
        0,
        length
    ) + "...";
}


/**
 * Status badge.
 */
function statusBadge(status) {

    if (!status) {
        return "";
    }

    const normalized =
        String(status).toUpperCase();


    let className =
        "badge-neutral";


    if (
        normalized === "SUCCESS" ||
        normalized === "ACTIVE" ||
        normalized === "COMPLETED" ||
        normalized === "PAID"
    ) {

        className =
            "badge-success";

    } else if (
        normalized === "PENDING" ||
        normalized === "PROCESSING" ||
        normalized === "CREATED" ||
        normalized === "PENDING_PAYMENT"
    ) {

        className =
            "badge-warning";

    } else if (
        normalized === "FAILED" ||
        normalized === "CANCELLED" ||
        normalized === "INACTIVE"
    ) {

        className =
            "badge-danger";

    } else {

        className =
            "badge-info";

    }


    return `
        <span class="badge ${className}">
            ${escapeHtml(normalized)}
        </span>
    `;
}


/**
 * Show toast.
 */
function showToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "toastContainer"
        );


    if (!container) {
        return;
    }


    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type}`;


    toast.textContent =
        message;


    container.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3500);
}


/**
 * Loading state.
 */
function setLoading(
    loading,
    text = "Processing..."
) {

    const overlay =
        document.getElementById(
            "loadingOverlay"
        );

    if (!overlay) {
        return;
    }


    const loadingText =
        overlay.querySelector(
            ".loading-text"
        );


    if (loadingText) {

        loadingText.textContent =
            text;

    }


    if (loading) {

        overlay.classList.remove(
            "hidden"
        );

    } else {

        overlay.classList.add(
            "hidden"
        );

    }

}


/**
 * Copy text.
 */
async function copyToClipboard(
    value
) {

    try {

        await navigator.clipboard.writeText(
            value
        );

        showToast(
            "Copied to clipboard"
        );

    } catch (error) {

        showToast(
            "Unable to copy",
            "error"
        );

    }

}


/**
 * Format JSON.
 */
function formatJson(value) {

    try {

        if (typeof value === "string") {

            value =
                JSON.parse(value);

        }

        return JSON.stringify(
            value,
            null,
            2
        );

    } catch (error) {

        return String(value);

    }

}


/**
 * Create empty table message.
 */
function emptyTable(
    colspan,
    message = "No data found"
) {

    return `
        <tr>
            <td
                colspan="${colspan}"
                class="empty-state"
            >
                ${escapeHtml(message)}
            </td>
        </tr>
    `;

}