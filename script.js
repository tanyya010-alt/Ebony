/* ==========================================================
   Ebony's Skin Therapy & Spa — storefront script
   Products live in products.js (generated from data/catalog.csv).
   Edit TREATMENTS below to change the spa menu.
   ========================================================== */

const CURRENCY = "NGN";
const LOCALE = "en-NG";
const PAGE_SIZE = 12;

const TREATMENTS = [
  { id: "radiance-facial", name: "Signature Radiance Facial",  duration: "75 min", price: 45000, desc: "Our hero treatment: double cleanse, enzyme exfoliation, extractions, sculpting massage and a vitamin C mask for an instant glow." },
  { id: "hyperpig",        name: "Even-Tone Therapy",          duration: "60 min", price: 55000, desc: "Targeted treatment for hyperpigmentation and dark spots using gentle, melanin-safe peels and brightening actives." },
  { id: "acne-clear",      name: "Clear Skin Treatment",       duration: "60 min", price: 40000, desc: "Deep pore cleanse, high-frequency and a calming clay mask to clear breakouts and soothe inflammation." },
  { id: "body-ritual",     name: "Ebony Body Glow Ritual",     duration: "90 min", price: 65000, desc: "Brown sugar polish, warm shea wrap and full-body massage with nourishing body oil." },
  { id: "massage",         name: "Relaxing Aromatherapy Massage", duration: "60 min", price: 35000, desc: "Slow, flowing massage with warm oils to release tension and quiet the mind." },
];

/* ---------- Helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(n);
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
  // Brand name printed on the bottle, shrunk to fit the label width.
  const brand = escapeHtml(p.brand.toUpperCase());
  const name = (y, size, ls = 2, fill = label, maxW = 40) => {
    const n = p.brand.length;
    if (n * (0.62 * size + ls) > maxW) {
      ls = Math.min(ls, 0.4);
      size = Math.max(3.2, (maxW / n - ls) / 0.62);
    }
    return `<text x="50" y="${y}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="${size.toFixed(2)}" letter-spacing="${ls}" fill="${fill}">${brand}</text>`;
  };
  const shapes = {
    dropper: `
      <rect x="40" y="10" width="20" height="26" rx="9" fill="#14100d"/>
      <rect x="37" y="34" width="26" height="10" rx="2" fill="${gold}"/>
      <rect x="28" y="44" width="44" height="74" rx="8" fill="${glass}"/>
      <rect x="33" y="70" width="34" height="26" fill="#f7f1e8" opacity=".85"/>
      ${name(86, 6.5, .8, "#14100d", 31)}`,
    jar: `
      <rect x="18" y="58" width="64" height="16" rx="3" fill="${gold}"/>
      <rect x="20" y="74" width="60" height="42" rx="8" fill="${glass}"/>
      ${name(99, 9, 2, label, 54)}`,
    pump: `
      <rect x="44" y="10" width="26" height="6" rx="3" fill="#14100d"/>
      <rect x="46" y="14" width="8" height="16" fill="#14100d"/>
      <rect x="38" y="28" width="24" height="12" rx="2" fill="${gold}"/>
      <rect x="28" y="40" width="44" height="78" rx="10" fill="${glass}"/>
      ${name(82, 8, 2, label, 38)}`,
    tube: `
      <path d="M32 14 H68 L64 92 H36 Z" fill="${glass}"/>
      <rect x="34" y="92" width="32" height="24" rx="3" fill="${gold}"/>
      <rect x="32" y="12" width="36" height="5" fill="${shade(c, -30)}"/>
      ${name(56, 6.5, 1, label, 28)}`,
    flacon: `
      <rect x="36" y="14" width="28" height="22" rx="3" fill="${gold}"/>
      <rect x="44" y="36" width="12" height="8" fill="${gold}"/>
      <rect x="20" y="44" width="60" height="72" rx="6" fill="${glass}" stroke="#c6a26a" stroke-opacity=".6"/>
      <path d="M24 48 L40 48 L28 108 L24 108 Z" fill="#fff" opacity=".12"/>
      ${name(82, 10, 2, label, 50)}
      <text x="50" y="94" text-anchor="middle" font-family="Jost, sans-serif" font-size="4" letter-spacing="1.5" fill="${label}" opacity=".8">PARFUM</text>`,
    round: `
      <rect x="40" y="16" width="20" height="24" rx="3" fill="${gold}"/>
      <rect x="45" y="40" width="10" height="8" fill="${gold}"/>
      <circle cx="50" cy="82" r="34" fill="${glass}" stroke="#fff" stroke-opacity=".4"/>
      <ellipse cx="38" cy="70" rx="8" ry="14" fill="#fff" opacity=".2"/>
      ${name(86, 9, 2, label, 52)}`,
    oil: `
      <rect x="42" y="12" width="16" height="28" rx="3" fill="${gold}"/>
      <rect x="34" y="40" width="32" height="78" rx="6" fill="${glass}"/>
      <rect x="38" y="66" width="24" height="28" fill="#f7f1e8" opacity=".85"/>
      ${name(83, 5, .6, "#14100d", 22)}`,
    candle: `
      <path d="M50 30 C46 38 46 44 50 46 C54 44 54 38 50 30 Z" fill="#e7b25b"/>
      <rect x="49" y="44" width="2" height="8" fill="#14100d"/>
      <rect x="22" y="52" width="56" height="64" rx="4" fill="${glass}"/>
      <rect x="22" y="52" width="56" height="6" fill="${gold}"/>
      ${name(90, 9, 2, label, 50)}`,
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
const CAT_LABEL = { skincare: "Skincare", perfume: "Perfumes", body: "Body Care" };
const TIER_TAG = { "Luxury": "Luxury", "Ultra-luxury": "Niche Luxury" };
const shop = { cat: "all", type: "all", q: "", sort: "featured", shown: PAGE_SIZE };

function matches(p) {
  if (shop.cat !== "all" && p.category !== shop.cat) return false;
  if (shop.type !== "all" && p.type !== shop.type) return false;
  if (!shop.q) return true;
  const hay = `${p.name} ${p.brand} ${p.type} ${p.tier}`.toLowerCase();
  return shop.q.toLowerCase().split(/\s+/).every(w => hay.includes(w));
}

function sorted(list) {
  const by = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "name": (a, b) => a.name.localeCompare(b.name),
  }[shop.sort];
  return by ? [...list].sort(by) : list;
}

function renderSubFilters() {
  const box = $("#sub-filters");
  if (shop.cat === "all") { box.innerHTML = ""; return; }
  const types = [...new Set(PRODUCTS.filter(p => p.category === shop.cat).map(p => p.type))];
  box.innerHTML = types.length < 2 ? "" : ["all", ...types].map(t => `
    <button class="chip${shop.type === t ? " active" : ""}" data-type="${escapeHtml(t)}">${t === "all" ? "All " + CAT_LABEL[shop.cat] : escapeHtml(t)}</button>`).join("");
}

function renderProducts() {
  const all = sorted(PRODUCTS.filter(matches));
  const list = all.slice(0, shop.shown);
  $("#product-grid").innerHTML = list.length ? list.map((p, i) => `
    <article class="product" style="animation-delay:${(i % PAGE_SIZE) * 50}ms">
      <div class="product-media" style="background:${p.bg}">
        ${TIER_TAG[p.tier] ? `<span class="product-tag">${TIER_TAG[p.tier]}</span>` : ""}
        ${productSVG(p)}
        <button class="quick-add" data-add="${p.id}">Add to Bag</button>
      </div>
      <span class="product-cat">${escapeHtml(p.brand)} · ${escapeHtml(p.type)}</span>
      <h3>${escapeHtml(p.name)}</h3>
      <p class="product-price">${money(p.price)}</p>
    </article>`).join("") : `<p class="no-results">No products match “${escapeHtml(shop.q)}”. Try another brand or product name.</p>`;
  $("#result-count").textContent = `${all.length} product${all.length === 1 ? "" : "s"}`;
  const more = $("#show-more");
  more.hidden = all.length <= shop.shown;
  more.textContent = `Show more (${all.length - list.length} more)`;
}

function setFilter(cat) {
  shop.cat = cat;
  shop.type = "all";
  shop.shown = PAGE_SIZE;
  $$(".filter").forEach(b => {
    const on = b.dataset.filter === cat;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on);
  });
  renderSubFilters();
  renderProducts();
}

/* ---------- Cart (saved in the browser) ---------- */
const CART_KEY = "ebony-cart-v2";
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
          <span class="muted">${escapeHtml(p.type)}</span><br>
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
  const featured = byId($("#feature-add").dataset.add);
  if (featured) $("#feature-add").textContent = `Add to Bag — ${money(featured.price)}`;

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
    if (t.dataset.type) { shop.type = t.dataset.type; shop.shown = PAGE_SIZE; renderSubFilters(); renderProducts(); }
    if (t.id === "show-more") { shop.shown += PAGE_SIZE; renderProducts(); }
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

  $("#shop-search").addEventListener("input", e => { shop.q = e.target.value.trim(); shop.shown = PAGE_SIZE; renderProducts(); });
  $("#shop-sort").addEventListener("change", e => { shop.sort = e.target.value; renderProducts(); });
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
