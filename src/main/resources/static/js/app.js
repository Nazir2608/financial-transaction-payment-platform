/* ============================================
   FINCORE APPLICATION
   ============================================ */

const pageNames = {

    dashboard: "Dashboard",

    merchants: "Merchants",

    customers: "Customers",

    accounts: "Accounts",

    orders: "Orders",

    payments: "Payments",

    transactions: "Transactions",

    ledger: "Ledger",

    "api-console": "API Console",

    concurrency: "Concurrency Testing"

};


/* ============================================
   NAVIGATION
   ============================================ */

function navigateToPage(pageName) {

    console.log("Navigating to:", pageName);


    /*
     * Hide all pages.
     */

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.remove("active");

    });


    /*
     * Show selected page.
     */

    const target =
        document.getElementById(
            `page-${pageName}`
        );


    if (!target) {

        console.error(
            `Page not found: page-${pageName}`
        );

        return;
    }


    target.classList.add("active");


    /*
     * Update sidebar active state.
     */

    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {

        item.classList.remove("active");


        if (
            item.dataset.page === pageName
        ) {

            item.classList.add("active");

        }

    });


    /*
     * Update breadcrumb.
     */

    const breadcrumb =
        document.getElementById(
            "breadcrumb"
        );


    if (breadcrumb) {

        breadcrumb.textContent =
            pageNames[pageName] ||
            pageName;

    }


    /*
     * Close mobile sidebar.
     */

    const sidebar =
        document.querySelector(".sidebar");


    if (sidebar) {

        sidebar.classList.remove(
            "mobile-open"
        );

    }


    /*
     * Load page-specific content.
     */

    switch (pageName) {

        case "dashboard":

            loadDashboard();

            break;


        case "merchants":

            renderMerchantsPage();

            break;

        case "customers":
                renderCustomersPage();
                break;

        case "accounts":
                renderAccountsPage();
                break;

        case "orders":
                renderOrdersPage();
                break;
        case "payments":
                renderPaymentsPage();
                break;
        case "transactions":
            renderTransactionsPage();
            break;

        default:

            console.log(
                `Page "${pageName}" is not implemented yet.`
            );

            break;

    }

}


/* ============================================
   NAVIGATION EVENT HANDLING
   ============================================ */

function setupNavigation() {

    document.addEventListener(
        "click",
        event => {

            const target =
                event.target.closest(
                    "[data-page]"
                );


            if (!target) {

                return;

            }


            const pageName =
                target.dataset.page;


            if (!pageName) {

                return;

            }


            navigateToPage(
                pageName
            );

        }
    );

}


/* ============================================
   REFRESH BUTTON
   ============================================ */

function setupRefresh() {

    const button =
        document.getElementById(
            "refreshButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        async () => {

            const activePage =
                document.querySelector(
                    ".page.active"
                );


            if (
                activePage &&
                activePage.id ===
                "page-dashboard"
            ) {

                await loadDashboard();

            }


            await checkApiHealth();


            showToast(
                "Page refreshed"
            );

        }
    );

}


/* ============================================
   MOBILE MENU
   ============================================ */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (!button || !sidebar) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }
    );

}


/* ============================================
   APPLICATION INITIALIZATION
   ============================================ */

async function initializeApp() {

    console.log(
        "Initializing FINCORE Admin UI..."
    );


    /*
     * Setup UI event handlers.
     */

    setupNavigation();

    setupRefresh();

    setupMobileMenu();


    /*
     * Check backend.
     */

    await checkApiHealth();


    /*
     * Load dashboard.
     */

    await loadDashboard();


    console.log(
        "FINCORE Admin UI initialized successfully."
    );

}


/* ============================================
   START APPLICATION
   ============================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);