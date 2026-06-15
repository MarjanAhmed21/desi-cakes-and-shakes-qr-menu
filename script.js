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
const qtyInput = document.getElementById("quantity");
const plusBtn = document.getElementById("plus-btn");
const minusBtn = document.getElementById("minus-btn");
const addCartBtn = document.getElementById("add-cart-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

if (!cartItems || !cartTotal) {
  console.warn("Cart UI missing from HTML");
}

let selectedItem = null;

function openModal(product) {


    

  modalImg.src = product.img;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.desc;
  modalPrice.textContent = product.price;

  modalSizes.innerHTML = "";


  selectedItem = product;

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

  qtyInput.value = 1;

}


function saveBasket() {
    localStorage.setItem("basket", JSON.stringify(basket));
}

plusBtn.onclick = () => {

    if(Number(qtyInput.value) < 50){

        qtyInput.value++;

    }

};

minusBtn.onclick = () => {

    if(Number(qtyInput.value) > 1){

        qtyInput.value--;

    }

};



let basket = JSON.parse(localStorage.getItem("basket")) || [];

addCartBtn.onclick = () => {

    const existing = basket.find(
    item => item.name === selectedItem.name
);

if (existing) {

    existing.quantity += Number(qtyInput.value);

} else {

    basket.push({

        ...selectedItem,

        quantity: Number(qtyInput.value)

    });

}
    
    saveBasket();
    syncCartUI();
    renderCart();

    modal.classList.remove("active");

    openCart();

    console.log(basket);

};


closeBtn.onclick = () => {
  modal.classList.remove("active");
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
};


function updateCartUI() {
    const count = basket.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = count;
}

syncCartUI();



function syncCartUI() {
    const totalQty = basket.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById("cart-count").textContent = totalQty;

    const checkoutBtn = document.getElementById("checkout-btn");

    checkoutBtn.disabled = totalQty === 0;
    checkoutBtn.style.opacity = totalQty === 0 ? "0.5" : "1";
    checkoutBtn.style.pointerEvents = totalQty === 0 ? "none" : "auto";
}





function changeQty(index, amount) {
  basket[index].quantity += amount;

  if (basket[index].quantity <= 0) {
    basket.splice(index, 1);
  }

  localStorage.setItem("basket", JSON.stringify(basket));

  updateCartUI();
  renderCart();
}

function removeItem(index) {
  basket.splice(index, 1);

  localStorage.setItem("basket", JSON.stringify(basket));

  updateCartUI();
  renderCart();
}


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



const searchInput = document.getElementById("search-input");

searchInput.addEventListener("focus", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

searchInput.addEventListener("input", () => {

  const searchTerm = searchInput.value.toLowerCase();

  document.querySelectorAll(".menu-section").forEach(section => {

    const cards = section.querySelectorAll(".item-card");
    let visibleCards = 0;

    cards.forEach(card => {

      const title = card.querySelector("h3").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();

      if (
        title.includes(searchTerm) ||
        desc.includes(searchTerm)
      ) {
        card.style.display = "flex";
        visibleCards++;
      } else {
        card.style.display = "none";
      }

    });

    // Hide empty categories
    if (visibleCards === 0) {
      section.style.display = "none";
    } else {
      section.style.display = "block";
    }
    

  });

  

});


function updateCartUI() {
  const count = basket.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  localStorage.setItem("basket", JSON.stringify(basket));
}

function renderCart() {

  cartItems.innerHTML = "";

  if (basket.length === 0) {

    cartItems.innerHTML =
        "<p>Your basket is empty.</p>";

    cartTotal.textContent = "0.00";

    return;

}

  let total = 0;

  basket.forEach((item, index) => {

    const price = parseFloat(item.price.replace("£", ""));
    total += price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
<div>

<strong>${item.name}</strong><br>

£${price.toFixed(2)}

<div class="cart-qty">
<button onclick="changeQty(${index}, -1)">−</button>

<span>${item.quantity}</span>

<button onclick="changeQty(${index}, 1)">+</button>
</div>

<textarea
class="item-note"
placeholder="Add a note (optional)..."
oninput="updateNote(${index}, this.value)"
>${item.note || ""}</textarea>

</div>

<button onclick="removeItem(${index})">🗑️</button>
`;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);



}



function changeQty(index, amount) {
  basket[index].quantity += amount;

  if (basket[index].quantity <= 0) {
    basket.splice(index, 1);
  }

  updateCartUI();
  renderCart();
}

function removeItem(index) {
  basket.splice(index, 1);
  updateCartUI();
  renderCart();
}

function updateNote(index, value) {
  basket[index].note = value;
  localStorage.setItem("basket", JSON.stringify(basket));
}


const cartIcon = document.getElementById("cart-nav");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");

cartIcon.onclick = openCart;
cartClose.onclick = closeCart;
cartOverlay.onclick = closeCart;

function openCart() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  renderCart();
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
}

document.getElementById("checkout-btn").onclick = () => {

  let message = "Order:\n\n";
  let total = 0;

  basket.forEach(item => {

    const price = parseFloat(item.price.replace("£", ""));
    const subtotal = price * item.quantity;

    total += subtotal;

    message += `${item.name} x${item.quantity} - £${subtotal.toFixed(2)}\n`;

    if (item.note) {
      message += `Note: ${item.note}\n`;
    }

    message += "\n";
  });

  message += `Total: £${total.toFixed(2)}\n`;

  const phone = "447882265112";

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};