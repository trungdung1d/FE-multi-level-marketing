document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    const menuRoot = document.querySelector(".menu-root");
    const toggleBtn = document.querySelector(".menu-toggle");

    if (!menu || !menuRoot || !toggleBtn) return;

    /* Toggle menu mobile */
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleBtn.classList.toggle("open");
        menuRoot.classList.toggle("open");
    });

    /* Xử lý click submenu bằng event delegation (hỗ trợ nested) */
    // Khởi tạo aria-expanded cho accessibility
    menu.querySelectorAll('.has-submenu > a').forEach(a => a.setAttribute('aria-expanded', 'false'));

    menuRoot.addEventListener('click', (e) => {
        const link = e.target.closest('.has-submenu > a');
        if (!link || !menuRoot.contains(link)) return;

        e.preventDefault();
        e.stopPropagation();

        const parentLi = link.parentElement;

        // Đóng các submenu cùng cấp
        const siblings = parentLi.parentElement.children;
        [...siblings].forEach(li => {
            if (li !== parentLi) {
                li.classList.remove('open');
                const siblingLink = li.querySelector(':scope > a');
                if (siblingLink) siblingLink.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle submenu hiện tại và cập nhật aria-expanded
        const isOpen = parentLi.classList.toggle('open');
        link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Click ra ngoài đóng menu */
    document.addEventListener("click", () => {
        menuRoot.classList.remove("open");
        toggleBtn.classList.remove("open");
        menu.querySelectorAll(".has-submenu.open").forEach(li => {
            li.classList.remove("open");
        });
    });
});
