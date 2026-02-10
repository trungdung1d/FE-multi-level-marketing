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

/* Slice banner & Product */
const slideTrack = document.querySelector(".slide-track");
const slideDots = document.querySelector(".slide-dots");
const prevBtn = document.querySelector(".slide-btn.prev");
const nextBtn = document.querySelector(".slide-btn.next");
const productGrid = document.querySelector(".products-grid");

let slides = [];
let products = [];
let currentIndex = 0;
let autoSlideTimer = null;

// Load data từ file JSON
fetch("/data.json")
    .then(res => res.json())
    .then(data => {
        slides = data.slides || [];
        products = data.products || [];

        if (slides.length) renderSlides(slides);
        if (products.length) renderProducts(products);
        if (slides.length > 1) startAutoSlide();
    })
    .catch(err => console.error("Load slide data error:", err));

function renderSlides(slides) {
    slideTrack.innerHTML = "";
    slideDots.innerHTML = "";

    slides.forEach((slide, index) => {
        const slideEl = document.createElement("div");
        slideEl.className = "slide-item" + (index === 0 ? " active" : "");

        slideEl.style.background = `
            linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.15)),
            url('${slide.image}') center / cover no-repeat
        `;

        slideEl.innerHTML = `
            <div class="slide-text">
                <span class="slide-tag">${slide.subtitle}</span>
                <h2>${slide.title}</h2>
                <p>${slide.description}</p>
            </div>
        `;

        slideTrack.appendChild(slideEl);

        const dot = document.createElement("span");
        dot.className = "dot" + (index === 0 ? " active" : "");
        dot.addEventListener("click", () => goToSlide(index));
        slideDots.appendChild(dot);
    });
}


function goToSlide(index) {
    const items = slideTrack.querySelectorAll(".slide-item");
    const dots = slideDots.querySelectorAll(".dot");

    slideTrack.style.transform = `translateX(-${index * 100}%)`;

    items.forEach((item, i) => {
        item.classList.toggle("active", i === index);
        dots[i].classList.toggle("active", i === index);
    });

    currentIndex = index;
    resetAutoSlide();
}


function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
}

function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
}

if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlide);

function renderProducts(products) {
    productGrid.innerHTML = "";

    products.forEach(p => {
        const hasSale = p.sale_price && p.sale_price < p.price;
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image"
                 style="background-image:url('${p.image}')">
                 <span class="product-badge">${p.tag}</span>
            </div>

            <div class="product-content">
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc}</div>

                <div class="product-footer">
                     <div class="product-price-group">
                    ${hasSale
                ? `<span class="price-old">${p.price.toLocaleString()} ${p.currency}</span>
                           <span class="price-sale">${p.sale_price.toLocaleString()} ${p.currency}</span>`
                : `<span class="price-normal">${p.price.toLocaleString()} ${p.currency}</span>`
            }
                </div>
                    
                </div>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

// Chat
const chatToggle = document.getElementById("chatToggle");
const chatbot = document.getElementById("chatbot");
const chatClose = document.getElementById("chatClose");
const icon = chatToggle.querySelector("i");

// Mở / đóng chat bằng toggle
chatToggle.addEventListener("click", () => {
    const isOpen = chatbot.classList.toggle("open");

    icon.className = isOpen
        ? "fa-solid fa-xmark"
        : "fa-solid fa-comments";
});

// Đóng chat bằng nút X trên header
chatClose.addEventListener("click", () => {
    chatbot.classList.remove("open");
    icon.className = "fa-solid fa-comments";
});



