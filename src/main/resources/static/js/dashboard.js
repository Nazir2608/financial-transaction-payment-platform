/* ============================================
   FINCORE DASHBOARD
   ============================================ */

async function loadDashboard() {

    try {

        setLoading(
            true,
            "Loading dashboard..."
        );

        const results =
            await Promise.allSettled([

                merchantApi.getAll(),

                customerApi.getAll(),

                orderApi.getAll(),

                paymentApi.getAll(),

                accountApi.getAll(),

                transactionApi.getAll(),

                ledgerApi.getAll()

            ]);

        const [
            merchantResult,
            customerResult,
            orderResult,
            paymentResult,
            accountResult,
            transactionResult,
            ledgerResult
        ] = results;

        updateDashboardCount(
            "dashboardMerchantCount",
            merchantResult
        );

        updateDashboardCount(
            "dashboardCustomerCount",
            customerResult
        );

        updateDashboardCount(
            "dashboardOrderCount",
            orderResult
        );

        updateDashboardCount(
            "dashboardPaymentCount",
            paymentResult
        );

        updateDashboardCount(
            "dashboardAccountCount",
            accountResult
        );

        updateDashboardCount(
            "dashboardTransactionCount",
            transactionResult
        );

        updateDashboardCount(
            "dashboardLedgerCount",
            ledgerResult
        );

        logDashboardApiError(
            "Merchants",
            merchantResult
        );

        logDashboardApiError(
            "Customers",
            customerResult
        );

        logDashboardApiError(
            "Orders",
            orderResult
        );

        logDashboardApiError(
            "Payments",
            paymentResult
        );

        logDashboardApiError(
            "Accounts",
            accountResult
        );

        logDashboardApiError(
            "Transactions",
            transactionResult
        );

        logDashboardApiError(
            "Ledger",
            ledgerResult
        );

        if (
            transactionResult.status ===
            "fulfilled"
        ) {

            renderRecentTransactions(
                transactionResult.value
            );

        } else {

            const tbody =
                document.getElementById(
                    "recentTransactionsTable"
                );

            if (tbody) {

                tbody.innerHTML =
                    emptyTable(
                        6,
                        "Unable to load transactions"
                    );

            }

        }

        const failedApis =
            results.filter(
                result =>
                    result.status ===
                    "rejected"
            );

        const systemStatus =
            document.getElementById(
                "dashboardSystemStatus"
            );

        if (systemStatus) {

            if (failedApis.length === 0) {

                systemStatus.textContent =
                    "Healthy";

                systemStatus.style.color =
                    "#16a34a";

            } else {

                systemStatus.textContent =
                    `${failedApis.length} API issue${
                        failedApis.length > 1
                            ? "s"
                            : ""
                    }`;

                systemStatus.style.color =
                    "#dc2626";

            }

        }

    } catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );

    } finally {

        setLoading(false);

    }

}


function updateDashboardCount(
    elementId,
    result
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    if (
        result.status ===
        "fulfilled"
    ) {

        const data =
            result.value;

        if (Array.isArray(data)) {

            element.textContent =
                data.length;

        } else {

            element.textContent =
                "-";

        }

    } else {

        element.textContent =
            "ERR";

    }

}


function logDashboardApiError(
    apiName,
    result
) {

    if (
        result.status !==
        "rejected"
    ) {

        return;

    }

    console.error(
        `Dashboard API failed: ${apiName}`,
        result.reason
    );

}


function renderRecentTransactions(
    transactions
) {

    const tbody =
        document.getElementById(
            "recentTransactionsTable"
        );

    if (!tbody) {
        return;
    }

    if (
        !Array.isArray(transactions) ||
        transactions.length === 0
    ) {

        tbody.innerHTML =
            emptyTable(
                6,
                "No transactions found"
            );

        return;

    }

    const recent =
        [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )
            .slice(0, 10);

    tbody.innerHTML =
        recent.map(
            transaction => `

                <tr>

                    <td>
                        <span
                            class="copyable"
                            onclick="copyToClipboard('${escapeHtml(transaction.transactionId)}')"
                        >
                            ${escapeHtml(
                                shortId(
                                    transaction.transactionId
                                )
                            )}
                        </span>
                    </td>

                    <td>
                        ${escapeHtml(
                            shortId(
                                transaction.paymentId
                            )
                        )}
                    </td>

                    <td>
                        ${formatCurrency(
                            transaction.amount
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            transaction.type
                        )}
                    </td>

                    <td>
                        ${statusBadge(
                            transaction.status
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            transaction.createdAt
                        )}
                    </td>

                </tr>

            `
        )
        .join("");

}


async function checkApiHealth() {

    const apiStatus =
        document.getElementById(
            "apiStatus"
        );

    if (!apiStatus) {
        return;
    }

    try {

        await healthApi.check();

        apiStatus.innerHTML = `
            <span class="status-dot"></span>
            API Connected
        `;

    } catch (error) {

        apiStatus.innerHTML = `
            <span
                class="status-dot"
                style="background:#dc2626"
            ></span>
            API Offline
        `;

    }

}