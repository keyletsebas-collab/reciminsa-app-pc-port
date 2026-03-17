/* =============================================
   SIDEBAR.JS – Toggle & navigation
   ============================================= */

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isOpen = sidebar.classList.contains('open');

    if (isOpen) {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
    } else {
        sidebar.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// Close sidebar on wide screens (no mobile)
function isMobile() {
    return window.innerWidth <= 768;
}

function closeSidebarIfMobile() {
    if (isMobile()) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
    }
}

// Highlight active nav link
function setActiveNav(pageName) {
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) link.classList.add('active');
    });
}
