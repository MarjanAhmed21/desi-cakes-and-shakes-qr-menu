let menuData = {};

// ========================
// CATEGORY SCROLL SYSTEM
// ========================

const links = document.querySelectorAll(".category-scroll a");
const sections = document.querySelectorAll(".menu-section");
const OFFSET = 125;

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



const closeBtn = document.getElementById("modal-close");


function openModal(product) {


    

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




closeBtn.onclick = () => {
  modal.classList.remove("active");
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
};


modal.addEventListener("click", (e) => {

  if (e.target === modal) {
    modal.classList.remove("active");
  }

});





const imageViewer = document.getElementById("image-viewer");
const viewerImg = document.getElementById("viewer-img");

// Open full image
modalImg.addEventListener("click", () => {
  viewerImg.src = modalImg.src;
  imageViewer.classList.add("active");
});

// Close when clicked
imageViewer.addEventListener("click", () => {
  imageViewer.classList.remove("active");
});



// =========================
// SEARCH DROPDOWN
// =========================

const searchInput = document.getElementById("search-input");


// Create dropdown

const searchDropdown = document.createElement("div");

searchDropdown.className = "search-dropdown";

searchInput.parentElement.appendChild(searchDropdown);


// Get all menu items

function getMenuItems() {

  return Array.from(document.querySelectorAll(".item-card")).map(card => {

    const titleElement = card.querySelector("h3");

    return {
      element: card,
      title: titleElement ? titleElement.textContent.trim() : ""
    };

  });

}


// Search

searchInput.addEventListener("input", () => {

  const searchTerm = searchInput.value.toLowerCase().trim();

  searchDropdown.innerHTML = "";

  if (searchTerm === "") {

    searchDropdown.style.display = "none";
searchInput.parentElement.classList.remove("search-open");

    return;

  }


  const menuItems = getMenuItems();


  // Only match the START of the item name

  const matches = menuItems.filter(item =>
    item.title.toLowerCase().startsWith(searchTerm)
  );


  if (matches.length === 0) {

    searchDropdown.style.display = "none";
searchInput.parentElement.classList.remove("search-open");

    return;

  }


  matches.forEach(item => {

    const result = document.createElement("div");

    result.className = "search-result";

    result.textContent = item.title;


    result.addEventListener("click", () => {

  // Close dropdown
  searchDropdown.style.display = "none";
  searchInput.parentElement.classList.remove("search-open");

  // Clear search
  searchInput.value = "";

  // Calculate distance to the item
  const itemPosition = item.element.getBoundingClientRect().top;

  const distance = Math.abs(
    itemPosition - (window.innerHeight / 2)
  );

  // Scroll to item
  item.element.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  // Highlight item
  item.element.style.outline = "3px solid #e4087f";
  item.element.style.outlineOffset = "4px";

  // Calculate wait time based on scroll distance
  const scrollTime = Math.min(
    Math.max(distance * 0.8, 400),
    1500
  );

  // Open modal after scrolling
  setTimeout(() => {

    item.element.style.outline = "";
    item.element.style.outlineOffset = "";

    // Open the existing item modal
    item.element.click();

  }, scrollTime);

});


    searchDropdown.appendChild(result);

  });

searchDropdown.style.display = "block";
searchInput.parentElement.classList.add("search-open");

});


// Hide dropdown when clicking elsewhere

document.addEventListener("click", (event) => {

  if (
    event.target !== searchInput &&
    !searchDropdown.contains(event.target)
  ) {

    searchDropdown.style.display = "none";
searchInput.parentElement.classList.remove("search-open");

  }

});