document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu");
    if (!menu) return;

    // Lấy tất cả mục có submenu
    const submenuParents = menu.querySelectorAll(".has-submenu > a");

    submenuParents.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const parentLi = link.parentElement;
            const submenu = parentLi.querySelector(".submenu");

            if (!submenu) return;

            // Đóng các submenu cùng cấp
            const siblings = parentLi.parentElement.children;
            [...siblings].forEach(li => {
                if (li !== parentLi) {
                    li.classList.remove("open");
                }
            });

            // Toggle submenu hiện tại
            parentLi.classList.toggle("open");
        });
    });

    // Click ra ngoài thì đóng toàn bộ menu con
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target)) {
            menu.querySelectorAll(".open").forEach(li => {
                li.classList.remove("open");
            });
        }
    });
});
