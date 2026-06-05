let menuData = {};

// ========================
// CATEGORY SCROLL SYSTEM
// ========================

const links = document.querySelectorAll(".category-scroll a");
const sections = document.querySelectorAll(".menu-section");
const OFFSET = 70;

function setActive(id) {
  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + id) {
      link.classList.add("active");
    }
  });
}

let clickLocked = false;
let unlockTimeout;

// CLICK SCROLL
links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    clickLocked = true;
    clearTimeout(unlockTimeout);

    unlockTimeout = setTimeout(() => {
      clickLocked = false;
    }, 1200);

    const id = link.getAttribute("href").replace("#", "");
    const section = document.getElementById(id);

    const y =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });

    setActive(id);
  });
});

// SCROLL OBSERVER
const observer = new IntersectionObserver((entries) => {
  if (clickLocked) return;

  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    setActive(entry.target.id);
  });
}, {
  threshold: 0.4,
  rootMargin: "-80px 0px -50% 0px"
});

sections.forEach(section => observer.observe(section));


// ========================
// RENDER SYSTEM (FIXED)
// ========================

function renderMenu(category, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const items = menuData[category];

  if (!items) return;

  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <img src="${product.img}" alt="${product.alt}">
      <div class="item-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <span>${product.price}</span>
      </div>
    `;

    // CLICK POPUP HOOK (for next step)
    card.addEventListener("click", () => {
      openModal(product);
    });

    grid.appendChild(card);
  });
}


// ========================
// LOAD MENU.JSON
// ========================

fetch("menu.json")
  .then(res => res.json())
  .then(data => {
    menuData = data;

    renderMenu("mains", "mains-grid");
    renderMenu("cakes", "cakes-grid");
    renderMenu("milkshakes", "shakes-grid");

    renderMenu("drinks", "drinks-grid");
    renderMenu("desserts", "desserts-grid");
    renderMenu("sweets", "sweets-grid");
    renderMenu("matchas", "matchas-grid");
  });


// ========================
// MODAL 
// ========================

const modal = document.getElementById("product-modal");

const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");

const modalSizes = document.getElementById("modal-sizes");

const closeModalBtn = document.getElementById("close-modal");

function openModal(product) {

    console.log("CLICKED", product);

  modalImg.src = product.img;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.desc;
  modalPrice.textContent = product.price;

  modalSizes.innerHTML = "";

  // MILKSHAKE SIZE OPTIONS
  if (
    product.name.toLowerCase().includes("milkshake")
  ) {

    const regular = document.createElement("button");
    regular.className = "size-btn active";
    regular.textContent = "Regular";

    const large = document.createElement("button");
    large.className = "size-btn";
    large.textContent = "Large (+£1)";

    regular.addEventListener("click", () => {

      regular.classList.add("active");
      large.classList.remove("active");

      modalPrice.textContent = product.price;
    });

    large.addEventListener("click", () => {

      large.classList.add("active");
      regular.classList.remove("active");

      const currentPrice =
        parseFloat(product.price.replace("£", ""));

      modalPrice.textContent =
        "£" + (currentPrice + 1).toFixed(2);
    });

    modalSizes.appendChild(regular);
    modalSizes.appendChild(large);
  }

  modal.classList.add("active");
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {

  if (e.target === modal) {
    modal.classList.remove("active");
  }

});