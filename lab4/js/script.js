// SmartLine - клієнтські скрипти (Лабораторна робота 4, варіант 1)
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("page-home")) {
    initFallingPhones();
    initResponsiveNav();
  }
  if (document.body.classList.contains("page-catalog")) {
    initNewBadges();
    initSearch();
  }
  if (document.body.classList.contains("page-feedback")) {
    initDetailsTooltip();
  }
});

/* ---------- 1. Головна: падаючі зображення товарів на фоні блоку з назвою ---------- */
const CATALOG_IMAGES = [
  "images/iphone-16-pro.png", "images/galaxy-s25.png", "images/pixel-9.jpg", "images/xiaomi-14.jpg",
  "images/oneplus-13.png", "images/motorola-edge-50.png", "images/nothing-phone-3a.png", "images/sony-xperia-1.png",
];

// Висота великої літери у назві магазину (cap height), виміряна через Canvas API
function capitalLetterHeight(el) {
  const style = getComputedStyle(el);
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const m = ctx.measureText("S");
  return m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
}

function initFallingPhones() {
  const header = document.querySelector(".site-header");
  const title = header.querySelector("h1");
  const layer = document.createElement("div");
  layer.className = "falling-layer";
  layer.setAttribute("aria-hidden", "true");
  header.prepend(layer);

  const maxHeight = Math.floor(2 * capitalLetterHeight(title)); // не більше подвоєної висоти великої літери
  header.dataset.maxPhoneHeight = maxHeight;

  function dropPhone() {
    const img = document.createElement("img");
    img.src = CATALOG_IMAGES[Math.floor(Math.random() * CATALOG_IMAGES.length)];
    img.alt = "";
    img.className = "falling-phone";
    img.style.height = `${maxHeight}px`;
    img.style.left = `${Math.random() * 95}%`;
    const duration = 4000 + Math.random() * 3000;
    layer.append(img);
    const fall = img.animate(
      [
        { transform: `translateY(-${maxHeight}px) rotate(0deg)`, opacity: 0 },
        { opacity: 0.55, offset: 0.15 },
        { transform: `translateY(${header.offsetHeight}px) rotate(${Math.random() > 0.5 ? 25 : -25}deg)`, opacity: 0.55 },
      ],
      { duration, easing: "ease-in" }
    );
    fall.onfinish = () => img.remove();
  }

  dropPhone();
  setInterval(dropPhone, 900); // періодично
}

/* ---------- 5. Головна: орієнтація меню залежно від ширини екрану ---------- */
function initResponsiveNav() {
  const nav = document.getElementById("main-nav");
  const update = () => {
    const width = Math.min(window.innerWidth, screen.width);
    const narrow = width <= 768;
    nav.classList.toggle("nav--vertical", narrow);
    nav.classList.toggle("nav--horizontal", !narrow);
    nav.closest(".site-header").classList.toggle("has-vertical-nav", narrow);
  };
  update();
  window.addEventListener("resize", update);
}

/* ---------- 2. Каталог: самодрукування «Новинка!» біля нещодавно доданих товарів ---------- */
const NEW_PRODUCT_DAYS = 30;

function initNewBadges() {
  const now = new Date();
  document.querySelectorAll(".product[data-added]").forEach((product) => {
    const added = new Date(product.dataset.added);
    const days = (now - added) / (1000 * 60 * 60 * 24);
    if (days < 0 || days > NEW_PRODUCT_DAYS) return;
    const caption = product.querySelector("figcaption");
    const badge = document.createElement("span");
    badge.className = "new-badge";
    caption.append(" ", badge);
    typeText(badge, "Новинка!", 200, 3000);
  });
}

// Друкує текст по одній літері; після паузи стирає і друкує знову
function typeText(el, text, delay, pause) {
  let i = 0;
  el.textContent = "";
  el.classList.add("typing");
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i === text.length) {
      clearInterval(timer);
      el.classList.remove("typing");
      setTimeout(() => typeText(el, text, delay, pause), pause);
    }
  }, delay);
}

/* ---------- 3. Каталог: пошук товарів за назвою ---------- */
function initSearch() {
  const input = document.getElementById("search");
  const items = [...document.querySelectorAll(".products > li")];
  const count = document.getElementById("search-count");
  const empty = document.getElementById("search-empty");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    for (const li of items) {
      const name = li.querySelector("figcaption b").textContent.toLowerCase();
      const match = name.includes(query);
      li.hidden = !match;
      if (match) shown++;
    }
    count.textContent = query ? `Знайдено: ${shown} з ${items.length}` : "";
    empty.hidden = shown !== 0;
  });
}

/* ---------- 4. Зворотній зв'язок: підсвічування поля «Детально» та підказка ---------- */
function initDetailsTooltip() {
  const field = document.getElementById("details");
  const wrapper = document.createElement("span");
  wrapper.className = "details-wrapper";
  field.before(wrapper);
  wrapper.append(field);

  const tip = document.createElement("span");
  tip.className = "tooltip";
  tip.id = "details-tip";
  tip.setAttribute("role", "tooltip");
  tip.textContent = "Ваша думка для нас важлива! Конкретизуйте мету звернення, будь ласка";
  wrapper.append(tip);
  field.setAttribute("aria-describedby", tip.id);

  field.addEventListener("mouseenter", () => {
    field.classList.add("is-hovered");
    tip.classList.add("visible");
  });
  field.addEventListener("mouseleave", () => {
    field.classList.remove("is-hovered");
    tip.classList.remove("visible");
  });
}
