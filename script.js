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

// CLICK
links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    clickLocked = true;

    clearTimeout(unlockTimeout);
    unlockTimeout = setTimeout(() => {
      clickLocked = false;
    }, 1200); // unlock after scroll finishes

    const id = link.getAttribute("href").replace("#", "");
    const section = document.getElementById(id);

    const OFFSET = 70;

    const y =
      section.getBoundingClientRect().top +
      window.pageYOffset -
      OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });

    setActive(id); // immediately lock correct highlight
  });
});

// SCROLL (ONLY ONE SYSTEM — IntersectionObserver)
const observer = new IntersectionObserver((entries) => {
  if (clickLocked) return; // 🚨 STOP OVERRIDING CLICK SELECTION

  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    setActive(entry.target.id);
  });
}, {
  root: null,
  threshold: 0.4,
  rootMargin: "-80px 0px -50% 0px"
});

sections.forEach(section => observer.observe(section));



function renderMenu(category, gridId, data) {
  const grid = document.getElementById(gridId);

  data[category].forEach(item => {
    const card = document.createElement("div");
    card.className = `item-card ${item.class}`;

    card.innerHTML = `
      <img src="${item.img}" alt="${item.alt}">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <span>${item.price}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

fetch("menu.json")
  .then(res => res.json())
  .then(data => {

    renderMenu("drinks", "drinks-grid", data);
    renderMenu("desserts", "desserts-grid", data);
    renderMenu("sweets", "sweets-grid", data);

  });

