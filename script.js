/* ==========================================================
   Ebony's Skin Therapy & Spa — storefront script
   Edit PRODUCTS and TREATMENTS below to change what's for sale.
   ========================================================== */

const CURRENCY = "USD";
const LOCALE = "en-US";

// shape: "dropper" | "jar" | "pump" | "tube" | "flacon" | "round" | "oil" | "candle"
const PRODUCTS = [
  { id: "glow-serum",    name: "Golden Glow Vitamin C Serum", category: "skincare", shape: "dropper", price: 58, size: "30 ml",  tag: "Bestseller", bg: "#ead9bf", color: "#c99a5b", desc: "Brightens dark spots and evens tone." },
  { id: "silk-cream",    name: "Shea Silk Moisture Cream",    category: "skincare", shape: "jar",     price: 64, size: "50 ml",  bg: "#efe3d2", color: "#f6efe3", desc: "Deep 24-hour hydration with raw shea." },
  { id: "cleanser",      name: "Honey Oat Gentle Cleanser",   category: "skincare", shape: "pump",    price: 36, size: "150 ml", bg: "#e6d6be", color: "#d8b98c", desc: "Soft, low-foam daily cleanse." },
  { id: "eye-balm",      name: "Cocoa Bright Eye Balm",       category: "skincare", shape: "tube",    price: 42, size: "15 ml",  tag: "New", bg: "#dfcbb1", color: "#6b4b38", desc: "Smooths and brightens under-eyes." },
  { id: "ebony-noir",    name: "Ebony Noir Eau de Parfum",    category: "perfume",  shape: "flacon",  price: 128, size: "50 ml", tag: "Signature", bg: "#2a211b", color: "#1a1410", desc: "Oud, black vanilla and amber." },
  { id: "velvet-rose",   name: "Velvet Rose Eau de Parfum",   category: "perfume",  shape: "round",   price: 118, size: "50 ml", bg: "#e9d3cb", color: "#c98d86", desc: "Damask rose, peony and musk." },
  { id: "amber-dusk",    name: "Amber Dusk Perfume Oil",      category: "perfume",  shape: "oil",     price: 74, size: "10 ml",  bg: "#e3cba6", color: "#b07a3a", desc: "Roll-on amber, sandalwood and tonka." },
  { id: "body-mist",     name: "Ebony Bloom Body Mist",       category: "perfume",  shape: "pump",    price: 46, size: "200 ml", bg: "#ecdccc", color: "#e3c3a5", desc: "Light jasmine and neroli veil." },
  { id: "body-oil",      name: "Radiance Body Oil",           category: "therapy",  shape: "oil",     price: 52, size: "100 ml", tag: "Spa Favourite", bg: "#e7d4b6", color: "#c99a5b", desc: "Shimmering oil for luminous skin." },
  { id: "body-scrub",    name: "Brown Sugar Body Polish",     category: "therapy",  shape: "jar",     price: 44, size: "200 g",  bg: "#dccab0", color: "#a4794f", desc: "Exfoliates for soft, glowing skin." },
  { id: "clay-mask",     name: "Black Clay Detox Mask",       category: "therapy",  shape: "jar",     price: 48, size: "75 ml",  bg: "#d6c7b3", color: "#2a211b", desc: "Purifies pores and calms the skin." },
  { id: "spa-candle",    name: "Sanctuary Spa Candle",        category: "therapy",  shape: "candle",  price: 38, size: "220 g",  bg: "#efe3d2", color: "#14100d", desc: "Our treatment-room scent, at home." },
];

const TREATMENTS = [
  { id: "radiance-facial", name: "Signature Radiance Facial",  duration: "75 min", price: 120, desc: "Our hero treatment: double cleanse, enzyme exfoliation, extractions, sculpting massage and a vitamin C mask for an instant glow." },
  { id: "hyperpig",        name: "Even-Tone Therapy",          duration: "60 min", price: 140, desc: "Targeted treatment for hyperpigmentation and dark spots using gentle, melanin-safe peels and brightening actives." },
  { id: "acne-clear",      name: "Clear Skin Treatment",       duration: "60 min", price: 110, desc: "Deep pore cleanse, high-frequency and a calming clay mask to clear breakouts and soothe inflammation." },
  { id: "body-ritual",     name: "Ebony Body Glow Ritual",     duration: "90 min", price: 165, desc: "Brown sugar polish, warm shea wrap and full-body massage with our Radiance Body Oil." },
  { id: "massage",         name: "Relaxing Aromatherapy Massage", duration: "60 min", price: 95, desc: "Slow, flowing massage with warm oils to release tension and quiet the mind." },
];

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY }).format(n);
const byId = id => PRODUCTS.find(p => p.id === id);
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Product illustrations (inline SVG, no image files needed) ---------- */
function productSVG(p) {
  const c = p.color;
  const gold = "url(#gold-" + p.id + ")";
  const glass = "url(#glass-" + p.id + ")";
  const dark = isDark(c);
  const label = dark ? "#dfc495" : "#14100d";
  const defs = `
    <defs>
      <linearGradient id="gold-${p.id}" x1="0" x2="1">
        <stop offset="0" stop-color="#8f6f42"/><stop offset=".45" stop-color="#ead5a8"/><stop offset="1" stop-color="#8f6f42"/>
      </linearGradient>
      <linearGradient id="glass-${p.id}" x1="0" x2="1">
        <stop offset="0" stop-color="${shade(c, -18)}"/><stop offset=".35" stop-color="${shade(c, 14)}"/><stop offset="1" stop-color="${shade(c, -26)}"/>
      </linearGradient>
    </defs>`;
  const name = (y, size, ls = 2, fill = label) =>
    `<text x="50" y="${y}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="${size}" letter-spacing="${ls}" fill="${fill}">EBONY</text>`;
  const shapes = {
    dropper: `
      <rect x="40" y="10" width="20" height="26" rx="9" fill="#14100d"/>
      <rect x="37" y="34" width="26" height="10" rx="2" fill="${gold}"/>
      <rect x="28" y="44" width="44" height="74" rx="8" fill="${glass}"/>
      <rect x="33" y="70" width="34" height="26" fill="#f7f1e8" opacity=".85"/>
      ${name(86, 6.5, .8, "#14100d")}`,
    jar: `
      <rect x="18" y="58" width="64" height="16" rx="3" fill="${gold}"/>
      <rect x="20" y="74" width="60" height="42" rx="8" fill="${glass}"/>
      ${name(99, 9)}`,
    pump: `
      <rect x="44" y="10" width="26" height="6" rx="3" fill="#14100d"/>
      <rect x="46" y="14" width="8" height="16" fill="#14100d"/>
      <rect x="38" y="28" width="24" height="12" rx="2" fill="${gold}"/>
      <rect x="28" y="40" width="44" height="78" rx="10" fill="${glass}"/>
      ${name(82, 8)}`,
    tube: `
      <path d="M32 14 H68 L64 92 H36 Z" fill="${glass}"/>
      <rect x="34" y="92" width="32" height="24" rx="3" fill="${gold}"/>
      <rect x="32" y="12" width="36" height="5" fill="${shade(c, -30)}"/>
      ${name(56, 6.5, 1)}`,
    flacon: `
      <rect x="36" y="14" width="28" height="22" rx="3" fill="${gold}"/>
      <rect x="44" y="36" width="12" height="8" fill="${gold}"/>
      <rect x="20" y="44" width="60" height="72" rx="6" fill="${glass}" stroke="#c6a26a" stroke-opacity=".6"/>
      <path d="M24 48 L40 48 L28 108 L24 108 Z" fill="#fff" opacity=".12"/>
      ${name(82, 10)}
      <text x="50" y="94" text-anchor="middle" font-family="Jost, sans-serif" font-size="4" letter-spacing="1.5" fill="${label}" opacity=".8">NOIR</text>`,
    round: `
      <rect x="40" y="16" width="20" height="24" rx="3" fill="${gold}"/>
      <rect x="45" y="40" width="10" height="8" fill="${gold}"/>
      <circle cx="50" cy="82" r="34" fill="${glass}" stroke="#fff" stroke-opacity=".4"/>
      <ellipse cx="38" cy="70" rx="8" ry="14" fill="#fff" opacity=".2"/>
      ${name(86, 9)}`,
    oil: `
      <rect x="42" y="12" width="16" height="28" rx="3" fill="${gold}"/>
      <rect x="34" y="40" width="32" height="78" rx="6" fill="${glass}"/>
      <rect x="38" y="66" width="24" height="28" fill="#f7f1e8" opacity=".85"/>
      ${name(83, 5, .6, "#14100d")}`,
    candle: `
      <path d="M50 30 C46 38 46 44 50 46 C54 44 54 38 50 30 Z" fill="#e7b25b"/>
      <rect x="49" y="44" width="2" height="8" fill="#14100d"/>
      <rect x="22" y="52" width="56" height="64" rx="4" fill="${glass}"/>
      <rect x="22" y="52" width="56" height="6" fill="${gold}"/>
      ${name(90, 9)}`,
  };
  return `<svg viewBox="0 0 100 124" role="img" aria-label="${escapeHtml(p.name)}">${defs}${shapes[p.shape] || shapes.jar}</svg>`;
}

function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * (pct > 0 ? 255 - v : v))));
  return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, "0")).join("");
}
function isDark(hex) {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) < 110;
}

/* ---------- Shop grid ---------- */
const CAT_LABEL = { skincare: "Skincare", perfume: "Perfume", therapy: "Body & Therapy" };

function renderProducts(filter = "all") {
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  $("#product-grid").innerHTML = list.map((p, i) => `
    <article class="product" style="animation-delay:${i * 60}ms">
      <div class="product-media" style="background:${p.bg}">
        ${p.tag ? `<span class="product-tag">${escapeHtml(p.tag)}</span>` : ""}
        ${productSVG(p)}
        <button class="quick-add" data-add="${p.id}">Add to Bag</button>
      </div>
      <span class="product-cat">${CAT_LABEL[p.category]}</span>
      <h3>${escapeHtml(p.name)}</h3>
      <p class="product-desc">${escapeHtml(p.desc)}</p>
      <p class="product-price">${money(p.price)}<small>· ${escapeHtml(p.size)}</small></p>
    </article>`).join("");
}

function setFilter(filter) {
  $$(".filter").forEach(b => {
    const on = b.dataset.filter === filter;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on);
  });
  renderProducts(filter);
}

/* ---------- Cart (saved in the browser) ---------- */
const CART_KEY = "ebony-cart";
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY)) || {};
    return Object.fromEntries(Object.entries(saved).filter(([id, q]) => byId(id) && q > 0));
  } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
}

function addToCart(id) {
  const p = byId(id);
  if (!p) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  toast(`${p.name} added to your bag`);
  const badge = $(".cart-count");
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
}
function setQty(id, q) {
  if (q <= 0) delete cart[id]; else cart[id] = q;
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const count = entries.reduce((n, [, q]) => n + q, 0);
  const total = entries.reduce((n, [id, q]) => n + byId(id).price * q, 0);
  $(".cart-count").textContent = count;
  $("#cart-total").textContent = money(total);
  $("#checkout-btn").disabled = count === 0;
  $("#cart-items").innerHTML = entries.length ? entries.map(([id, q]) => {
    const p = byId(id);
    return `
      <div class="cart-item">
        <div class="cart-thumb" style="background:${p.bg}">${productSVG(p)}</div>
        <div>
          <h4>${escapeHtml(p.name)}</h4>
          <span class="muted">${escapeHtml(p.size)}</span><br>
          <div class="qty">
            <button data-qty="${id}" data-d="-1" aria-label="Decrease quantity">−</button>
            <span>${q}</span>
            <button data-qty="${id}" data-d="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span>${money(p.price * q)}</span>
          <button class="remove" data-remove="${id}">Remove</button>
        </div>
      </div>`;
  }).join("") : `
    <div class="cart-empty">
      <p>Your bag is empty</p>
      <span>Discover something beautiful.</span>
    </div>`;
}

function openCart() {
  $(".cart").classList.add("open");
  $(".cart").setAttribute("aria-hidden", "false");
  $(".overlay").hidden = false;
  document.body.style.overflow = "hidden";
  $(".cart-close").focus();
}
function closeCart() {
  $(".cart").classList.remove("open");
  $(".cart").setAttribute("aria-hidden", "true");
  $(".overlay").hidden = true;
  document.body.style.overflow = "";
}

/* ---------- Spa treatments & booking ---------- */
function renderTreatments() {
  $("#treatment-list").innerHTML = TREATMENTS.map(t => `
    <div class="treatment reveal">
      <div>
        <span class="treatment-meta">${escapeHtml(t.duration)}</span>
        <h3>${escapeHtml(t.name)}</h3>
      </div>
      <span class="treatment-price">${money(t.price)}</span>
      <p>${escapeHtml(t.desc)}</p>
      <button class="treatment-book" data-book="${t.id}">Book this treatment</button>
    </div>`).join("");
  $("#treatment-select").innerHTML = `<option value="">Choose a treatment</option>` +
    TREATMENTS.map(t => `<option value="${t.id}">${escapeHtml(t.name)} — ${t.duration} · ${money(t.price)}</option>`).join("");
}

function setupBooking() {
  const form = $("#booking-form");
  const date = form.elements.date;
  date.min = new Date(Date.now() + 864e5).toISOString().split("T")[0];

  form.addEventListener("submit", e => {
    e.preventDefault();
    const msg = $(".form-msg", form);
    let ok = true;
    $$("[required]", form).forEach(f => {
      const bad = !f.checkValidity();
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      msg.textContent = "Please complete the highlighted fields.";
      msg.classList.add("error");
      return;
    }
    const t = TREATMENTS.find(x => x.id === form.elements.treatment.value);
    const first = form.elements.name.value.trim().split(" ")[0];
    const when = new Date(date.value + "T00:00").toLocaleDateString(LOCALE, { weekday: "long", month: "long", day: "numeric" });
    msg.classList.remove("error");
    msg.textContent = `Thank you, ${first}. Your request for ${t.name} on ${when} at ${form.elements.time.value} has been received — we'll confirm by email shortly.`;
    form.reset();
  });
  form.addEventListener("input", e => e.target.classList.remove("invalid"));
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(text) {
  const el = $(".toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------- Scroll reveal ---------- */
function setupReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => io.observe(el));
}

/* ---------- Init & events ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderTreatments();
  renderCart();
  setupBooking();
  setupReveal();
  $("#year").textContent = new Date().getFullYear();

  document.addEventListener("click", e => {
    const t = e.target.closest("button, a");
    if (!t) return;

    if (t.dataset.add) addToCart(t.dataset.add);
    else if (t.dataset.qty) setQty(t.dataset.qty, (cart[t.dataset.qty] || 0) + Number(t.dataset.d));
    else if (t.dataset.remove) setQty(t.dataset.remove, 0);
    else if (t.dataset.book) {
      $("#treatment-select").value = t.dataset.book;
      $("#booking-form").scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (t.dataset.filter) setFilter(t.dataset.filter);
    if (t.matches(".cart-btn")) openCart();
    if (t.matches(".cart-close")) closeCart();
    if (t.matches(".menu-toggle")) {
      const open = t.getAttribute("aria-expanded") !== "true";
      t.setAttribute("aria-expanded", open);
      $(".mobile-nav").hidden = !open;
    }
    if (t.closest(".mobile-nav")) {
      $(".menu-toggle").setAttribute("aria-expanded", "false");
      $(".mobile-nav").hidden = true;
    }
    if (t.id === "checkout-btn") {
      closeCart();
      toast("Checkout coming soon — connect your payment provider");
    }
  });

  $(".overlay").addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

  $("#newsletter-form").addEventListener("submit", e => {
    e.preventDefault();
    $(".newsletter-msg").textContent = "Welcome to the Ebony Circle — check your inbox for your 10% code.";
    e.target.reset();
  });

  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
