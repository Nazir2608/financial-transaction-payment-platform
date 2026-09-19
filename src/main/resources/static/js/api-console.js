// ============================================================
// FINCORE - API Console
// ============================================================

let apiConsoleHistory = [];


// ============================================================
// PAGE
// ============================================================

function renderApiConsolePage() {

    const page = document.getElementById("page-api-console");

    if (!page) {
        console.error("API Console page element not found.");
        return;
    }


    page.innerHTML = `
        <div class="page-header">

            <div>
                <h1>API Console</h1>

                <p>
                    Test FINCORE REST APIs directly from the browser.
                </p>
            </div>

        </div>


        <div class="api-console-layout">

            <!-- ==================================================
                 REQUEST BUILDER
                 ================================================== -->

            <div class="content-card api-request-card">

                <div class="api-console-card-header">

                    <div>

                        <h2>
                            Request
                        </h2>

                        <p>
                            Configure and send an API request.
                        </p>

                    </div>


                    <button
                        class="btn btn-secondary"
                        onclick="clearApiConsole()">

                        Clear

                    </button>

                </div>


                <!-- QUICK ENDPOINTS -->

                <div class="api-quick-section">

                    <div class="api-section-label">
                        Quick Endpoints
                    </div>


                    <div class="api-quick-buttons">

                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('health')">

                            Health

                        </button>


                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('merchants')">

                            Merchants

                        </button>


                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('customers')">

                            Customers

                        </button>


                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('accounts')">

                            Accounts

                        </button>


                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('orders')">

                            Orders

                        </button>


                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('payments')">

                            Payments

                        </button>


                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('transactions')">

                            Transactions

                        </button>


                        <button
                            class="api-quick-btn"
                            onclick="loadApiTemplate('ledger')">

                            Ledger

                        </button>

                    </div>

                </div>


                <!-- METHOD + URL -->

                <div class="api-request-line">

                    <select
                        id="api-method"
                        onchange="handleApiMethodChange()">

                        <option value="GET">
                            GET
                        </option>

                        <option value="POST">
                            POST
                        </option>

                        <option value="PUT">
                            PUT
                        </option>

                        <option value="PATCH">
                            PATCH
                        </option>

                        <option value="DELETE">
                            DELETE
                        </option>

                    </select>


                    <input
                        id="api-url"
                        type="text"
                        value="/api/v1/health"
                        placeholder="/api/v1/..."
                    />


                    <button
                        class="btn btn-primary api-send-btn"
                        id="api-send-btn"
                        onclick="sendApiConsoleRequest()">

                        ▶ Send

                    </button>

                </div>


                <!-- HEADERS -->

                <div class="api-console-section">

                    <div class="api-console-section-header">

                        <div>

                            <h3>
                                Headers
                            </h3>

                            <span>
                                Optional HTTP headers
                            </span>

                        </div>


                        <button
                            class="btn btn-small btn-secondary"
                            onclick="addApiHeaderRow()">

                            + Add Header

                        </button>

                    </div>


                    <div id="api-headers-container">

                        <div class="api-header-row">

                            <input
                                type="text"
                                class="api-header-key"
                                placeholder="Header name"
                            />

                            <input
                                type="text"
                                class="api-header-value"
                                placeholder="Header value"
                            />

                            <button
                                class="api-remove-header"
                                onclick="removeApiHeaderRow(this)">

                                ×

                            </button>

                        </div>

                    </div>

                </div>


                <!-- BODY -->

                <div
                    class="api-console-section"
                    id="api-body-section">

                    <div class="api-console-section-header">

                        <div>

                            <h3>
                                Request Body
                            </h3>

                            <span>
                                JSON payload
                            </span>

                        </div>


                        <button
                            class="btn btn-small btn-secondary"
                            onclick="formatApiRequestBody()">

                            Format JSON

                        </button>

                    </div>


                    <textarea
                        id="api-request-body"
                        class="api-json-editor"
                        spellcheck="false"
                        placeholder='{
  "example": "value"
}'></textarea>

                </div>


                <!-- HISTORY -->

                <div class="api-console-section">

                    <div class="api-console-section-header">

                        <div>

                            <h3>
                                Request History
                            </h3>

                            <span>
                                Current browser session
                            </span>

                        </div>


                        <button
                            class="btn btn-small btn-secondary"
                            onclick="clearApiHistory()">

                            Clear History

                        </button>

                    </div>


                    <div id="api-history-container">

                        <div class="api-history-empty">
                            No requests yet.
                        </div>

                    </div>

                </div>

            </div>


            <!-- ==================================================
                 RESPONSE
                 ================================================== -->

            <div class="content-card api-response-card">

                <div class="api-console-card-header">

                    <div>

                        <h2>
                            Response
                        </h2>

                        <p>
                            Server response.
                        </p>

                    </div>


                    <div
                        id="api-response-meta"
                        class="api-response-meta">
                    </div>

                </div>


                <div
                    id="api-response-status"
                    class="api-response-status empty">

                    Send a request to see the response.

                </div>


                <div class="api-response-tabs">

                    <button
                        class="api-response-tab active"
                        onclick="showApiResponseTab('body')">

                        Body

                    </button>


                    <button
                        class="api-response-tab"
                        onclick="showApiResponseTab('headers')">

                        Headers

                    </button>

                </div>


                <div
                    id="api-response-body-tab"
                    class="api-response-tab-content active">

                    <div class="api-response-toolbar">

                        <span>
                            JSON Response
                        </span>


                        <button
                            class="btn btn-small btn-secondary"
                            onclick="copyApiResponse()">

                            Copy

                        </button>

                    </div>


                    <pre
                        id="api-response-body"
                        class="api-response-editor">No response yet.</pre>

                </div>


                <div
                    id="api-response-headers-tab"
                    class="api-response-tab-content">

                    <pre
                        id="api-response-headers"
                        class="api-response-editor">No response yet.</pre>

                </div>

            </div>

        </div>
    `;


    renderApiHistory();
}


// ============================================================
// QUICK TEMPLATES
// ============================================================

const API_TEMPLATES = {

    health: {
        method: "GET",
        url: "/api/v1/health",
        body: ""
    },


    merchants: {
        method: "GET",
        url: "/api/v1/merchants",
        body: ""
    },


    customers: {
        method: "GET",
        url: "/api/v1/customers",
        body: ""
    },


    accounts: {
        method: "GET",
        url: "/api/v1/accounts",
        body: ""
    },


    orders: {
        method: "GET",
        url: "/api/v1/orders",
        body: ""
    },


    payments: {
        method: "GET",
        url: "/api/v1/payments",
        body: ""
    },


    transactions: {
        method: "GET",
        url: "/api/v1/transactions",
        body: ""
    },


    ledger: {
        method: "GET",
        url: "/api/v1/ledger-entries",
        body: ""
    }

};


function loadApiTemplate(templateName) {

    const template =
        API_TEMPLATES[templateName];


    if (!template) {
        return;
    }


    document.getElementById(
        "api-method"
    ).value = template.method;


    document.getElementById(
        "api-url"
    ).value = template.url;


    document.getElementById(
        "api-request-body"
    ).value = template.body;


    handleApiMethodChange();


    showToast(
        `${templateName} endpoint loaded`,
        "success"
    );
}


// ============================================================
// METHOD
// ============================================================

function handleApiMethodChange() {

    const method =
        document.getElementById(
            "api-method"
        )?.value;


    const bodySection =
        document.getElementById(
            "api-body-section"
        );


    if (!bodySection) {
        return;
    }


    const bodySupported =
        ["POST", "PUT", "PATCH"]
            .includes(method);


    bodySection.style.display =
        bodySupported
            ? ""
            : "none";
}


// ============================================================
// SEND REQUEST
// ============================================================

async function sendApiConsoleRequest() {

    const method =
        document.getElementById(
            "api-method"
        ).value;


    const url =
        document.getElementById(
            "api-url"
        ).value.trim();


    const bodyText =
        document.getElementById(
            "api-request-body"
        ).value.trim();


    if (!url) {

        showToast(
            "Please enter an API URL",
            "error"
        );

        return;
    }


    let body;


    if (
        ["POST", "PUT", "PATCH"]
            .includes(method) &&
        bodyText
    ) {

        try {

            body =
                JSON.parse(bodyText);

        } catch (error) {

            showToast(
                "Request body contains invalid JSON",
                "error"
            );

            return;
        }
    }


    const headers =
        collectApiHeaders();


    const sendButton =
        document.getElementById(
            "api-send-btn"
        );


    const startTime =
        performance.now();


    try {

        sendButton.disabled = true;

        sendButton.textContent =
            "Sending...";


        const options = {
            method,
            headers
        };


        if (body !== undefined) {

            options.body =
                JSON.stringify(body);
        }


        const response =
            await fetch(
                API_BASE_URL + url,
                options
            );


        const endTime =
            performance.now();


        const duration =
            Math.round(
                endTime - startTime
            );


        const responseText =
            await response.text();


        let responseData =
            responseText;


        try {

            responseData =
                responseText
                    ? JSON.parse(responseText)
                    : "";

        } catch {
            // Keep response as text.
        }


        const responseHeaders = {};

        response.headers.forEach(
            (value, key) => {

                responseHeaders[key] =
                    value;
            }
        );


        renderApiResponse(
            response.status,
            response.statusText,
            duration,
            responseData,
            responseHeaders
        );


        addApiHistory({
            method,
            url,
            status: response.status,
            duration,
            body
        });


    } catch (error) {

        const endTime =
            performance.now();


        const duration =
            Math.round(
                endTime - startTime
            );


        renderApiNetworkError(
            error,
            duration
        );


        addApiHistory({
            method,
            url,
            status: "ERROR",
            duration,
            body
        });


    } finally {

        sendButton.disabled = false;

        sendButton.textContent =
            "▶ Send";
    }
}


// ============================================================
// HEADERS
// ============================================================

function collectApiHeaders() {

    const rows =
        document.querySelectorAll(
            ".api-header-row"
        );


    const headers = {};


    rows.forEach(row => {

        const key =
            row.querySelector(
                ".api-header-key"
            )?.value.trim();


        const value =
            row.querySelector(
                ".api-header-value"
            )?.value.trim();


        if (key) {
            headers[key] = value;
        }

    });


    return headers;
}


function addApiHeaderRow(
    key = "",
    value = ""
) {

    const container =
        document.getElementById(
            "api-headers-container"
        );


    if (!container) {
        return;
    }


    const row =
        document.createElement("div");


    row.className =
        "api-header-row";


    row.innerHTML = `

        <input
            type="text"
            class="api-header-key"
            placeholder="Header name"
            value="${escapeHtml(key)}"
        />


        <input
            type="text"
            class="api-header-value"
            placeholder="Header value"
            value="${escapeHtml(value)}"
        />


        <button
            class="api-remove-header"
            onclick="removeApiHeaderRow(this)">

            ×

        </button>

    `;


    container.appendChild(row);
}


function removeApiHeaderRow(button) {

    const row =
        button.closest(
            ".api-header-row"
        );


    if (row) {
        row.remove();
    }
}


// ============================================================
// REQUEST BODY
// ============================================================

function formatApiRequestBody() {

    const textarea =
        document.getElementById(
            "api-request-body"
        );


    if (!textarea) {
        return;
    }


    const value =
        textarea.value.trim();


    if (!value) {
        return;
    }


    try {

        const json =
            JSON.parse(value);


        textarea.value =
            JSON.stringify(
                json,
                null,
                2
            );


        showToast(
            "JSON formatted",
            "success"
        );

    } catch {

        showToast(
            "Invalid JSON",
            "error"
        );
    }
}


// ============================================================
// RESPONSE
// ============================================================

function renderApiResponse(
    status,
    statusText,
    duration,
    data,
    headers
) {

    const statusElement =
        document.getElementById(
            "api-response-status"
        );


    const metaElement =
        document.getElementById(
            "api-response-meta"
        );


    const bodyElement =
        document.getElementById(
            "api-response-body"
        );


    const headersElement =
        document.getElementById(
            "api-response-headers"
        );


    const success =
        status >= 200 &&
        status < 300;


    statusElement.className =
        `api-response-status ${
            success
                ? "success"
                : "error"
        }`;


    statusElement.innerHTML = `

        <span class="api-status-code">
            ${status}
        </span>

        <span>
            ${escapeHtml(statusText || "")}
        </span>

    `;


    metaElement.innerHTML = `

        <span>
            ${duration} ms
        </span>

        <span>
            ${success ? "Success" : "Error"}
        </span>

    `;


    if (
        typeof data === "object" &&
        data !== null
    ) {

        bodyElement.textContent =
            JSON.stringify(
                data,
                null,
                2
            );

    } else {

        bodyElement.textContent =
            data || "(empty response)";
    }


    headersElement.textContent =
        Object.entries(headers)
            .map(
                ([key, value]) =>
                    `${key}: ${value}`
            )
            .join("\n") ||
        "(no response headers)";
}


function renderApiNetworkError(
    error,
    duration
) {

    const statusElement =
        document.getElementById(
            "api-response-status"
        );


    const metaElement =
        document.getElementById(
            "api-response-meta"
        );


    const bodyElement =
        document.getElementById(
            "api-response-body"
        );


    const headersElement =
        document.getElementById(
            "api-response-headers"
        );


    statusElement.className =
        "api-response-status error";


    statusElement.innerHTML = `

        <span class="api-status-code">
            ERROR
        </span>

        <span>
            Network request failed
        </span>
    `;


    metaElement.innerHTML = `
        <span>${duration} ms</span>
    `;


    bodyElement.textContent =
        error.message ||
        "Unable to connect to the server.";


    headersElement.textContent =
        "(no response headers)";
}


// ============================================================
// RESPONSE TABS
// ============================================================

function showApiResponseTab(tab) {

    const bodyTab =
        document.getElementById(
            "api-response-body-tab"
        );


    const headersTab =
        document.getElementById(
            "api-response-headers-tab"
        );


    const tabs =
        document.querySelectorAll(
            ".api-response-tab"
        );


    tabs.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    if (tab === "body") {

        bodyTab.classList.add("active");

        tabs[0]?.classList.add("active");

    } else {

        headersTab.classList.add("active");

        tabs[1]?.classList.add("active");
    }
}


// ============================================================
// COPY RESPONSE
// ============================================================

async function copyApiResponse() {

    const response =
        document.getElementById(
            "api-response-body"
        )?.textContent;


    if (!response) {
        return;
    }


    try {

        await copyToClipboard(
            response
        );


        showToast(
            "Response copied",
            "success"
        );

    } catch {

        showToast(
            "Unable to copy response",
            "error"
        );
    }
}


// ============================================================
// HISTORY
// ============================================================

function addApiHistory(request) {

    apiConsoleHistory.unshift({
        ...request,
        timestamp: new Date()
    });


    if (apiConsoleHistory.length > 10) {

        apiConsoleHistory =
            apiConsoleHistory.slice(0, 10);
    }


    renderApiHistory();
}


function renderApiHistory() {

    const container =
        document.getElementById(
            "api-history-container"
        );


    if (!container) {
        return;
    }


    if (apiConsoleHistory.length === 0) {

        container.innerHTML = `

            <div class="api-history-empty">
                No requests yet.
            </div>
        `;

        return;
    }


    container.innerHTML =
        apiConsoleHistory
            .map(
                (request, index) => `

                    <button
                        class="api-history-item"
                        onclick="loadApiHistory(${index})">

                        <span
                            class="api-history-method ${request.method.toLowerCase()}">

                            ${request.method}

                        </span>


                        <span
                            class="api-history-url">

                            ${escapeHtml(
                                request.url
                            )}

                        </span>


                        <span
                            class="api-history-status ${
                                request.status >= 200 &&
                                request.status < 300
                                    ? "success"
                                    : "error"
                            }">

                            ${request.status}

                        </span>

                    </button>
                `
            )
            .join("");
}


function loadApiHistory(index) {

    const request =
        apiConsoleHistory[index];


    if (!request) {
        return;
    }


    document.getElementById(
        "api-method"
    ).value = request.method;


    document.getElementById(
        "api-url"
    ).value = request.url;


    document.getElementById(
        "api-request-body"
    ).value =
        request.body
            ? JSON.stringify(
                request.body,
                null,
                2
            )
            : "";


    handleApiMethodChange();
}


function clearApiHistory() {

    apiConsoleHistory = [];

    renderApiHistory();

    showToast(
        "Request history cleared",
        "success"
    );
}


// ============================================================
// CLEAR CONSOLE
// ============================================================

function clearApiConsole() {

    document.getElementById(
        "api-method"
    ).value = "GET";


    document.getElementById(
        "api-url"
    ).value = "/api/v1/health";


    document.getElementById(
        "api-request-body"
    ).value = "";


    document.getElementById(
        "api-response-status"
    ).className =
        "api-response-status empty";


    document.getElementById(
        "api-response-status"
    ).textContent =
        "Send a request to see the response.";


    document.getElementById(
        "api-response-meta"
    ).innerHTML = "";


    document.getElementById(
        "api-response-body"
    ).textContent =
        "No response yet.";


    document.getElementById(
        "api-response-headers"
    ).textContent =
        "No response yet.";


    const headersContainer =
        document.getElementById(
            "api-headers-container"
        );


    headersContainer.innerHTML = `

        <div class="api-header-row">

            <input
                type="text"
                class="api-header-key"
                placeholder="Header name"
            />

            <input
                type="text"
                class="api-header-value"
                placeholder="Header value"
            />

            <button
                class="api-remove-header"
                onclick="removeApiHeaderRow(this)">

                ×

            </button>

        </div>
    `;


    handleApiMethodChange();
}