const productList = document.querySelector("#product-list");
const cartItems = document.querySelector("#cart-items");
const emptyCartMsg = document.querySelector("#empty-cart");
const cartTotalWrapper = document.querySelector("#cart-total");
const totalPrice = document.querySelector("#total-price");
const checkOutBtn = document.querySelector("#checkout-btn");

let products = [];
let cart = [];

// 🔹 LocalStorage key
const CART_STORAGE_KEY = "shopping-cart";

// ---------- LOAD PRODUCTS ----------
async function loadProduct() {
  try {
    const res = await fetch("products.json");

    if (!res.ok) {
      throw new Error("Failed to load products data!!");
    }

    products = await res.json();

    // Make sure price is a number (just in case JSON has strings)
    products = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    renderProducts(products);
  } catch (error) {
    console.log(error);
    productList.innerHTML = `<p class="text-red-400">Failed to load products. Please try again later.</p>`;
  }
}

// ---------- LOCAL STORAGE HELPERS ----------
function saveCartToLocal() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCartFromLocal() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      // ensure data is valid: id, name, price, quantity
      cart = parsed.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity) || 0,
      })).filter(item => item.quantity > 0);
    }
  } catch (err) {
    console.error("Failed to parse cart from localStorage:", err);
  }
}

// ---------- RENDER PRODUCTS ----------
function renderProducts(products) {
  productList.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "bg-slate-800 rounded-xl p-4 shadow-lg flex flex-col";

    const desc = product.description || product.desc || "";

    card.innerHTML = `
      <h3 class="font-semibold mb-1">${product.name}</h3>
      <p class="text-sm text-slate-300 mb-2">
        ${desc}
      </p>
      <p class="font-bold mb-3">₹${product.price}</p>
      <button
        class="mt-auto w-full py-2 text-sm font-medium rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition"
      >
        Add to Cart
      </button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => addToCart(product.id));

    productList.appendChild(card);
  });
}

// ---------- ADD TO CART ----------
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCartToLocal();   // ✅ save after change
  renderCart();
}

// ---------- RENDER CART ----------
function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMsg.classList.remove("hidden");
    cartItems.appendChild(emptyCartMsg);
    cartTotalWrapper.classList.add("hidden");
    checkOutBtn.disabled = true;
    totalPrice.textContent = "₹0.00"; // reset total
    return;
  }

  emptyCartMsg.classList.add("hidden");
  cartTotalWrapper.classList.remove("hidden");
  checkOutBtn.disabled = false;

  cart.forEach((item) => {
    const row = document.createElement("div");

    row.className =
      "flex items-center justify-between gap-2 bg-slate-900/60 rounded-lg px-3 py-2 text-sm";

    row.innerHTML = `
      <div>
        <p class="font-medium">${item.name}</p>
        <p class="text-xs text-slate-400">
          ₹${item.price} × ${item.quantity}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs">-</button>
        <span class="w-6 text-center">${item.quantity}</span>
        <button class="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-xs">+</button>
        <button class="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-xs">x</button>
      </div>
    `;

    const [minusBtn, plusBtn, removeBtn] = row.querySelectorAll("button");

    minusBtn.addEventListener("click", () => changeQuantity(item.id, -1));
    plusBtn.addEventListener("click", () => changeQuantity(item.id, 1));
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    cartItems.appendChild(row);
  });

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  totalPrice.textContent = `₹${total.toFixed(2)}`;
}

// ---------- REMOVE / CHANGE QTY ----------
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCartToLocal();   // ✅ save after change
  renderCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCartToLocal(); // ✅ save after change
    renderCart();
  }
}

// ---------- CHECKOUT ----------
function setupCheckout() {
  checkOutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    alert("Checkout successful!");
    cart = [];
    saveCartToLocal();   // ✅ clear from localStorage
    renderCart();
  });
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
  loadCartFromLocal();  // ✅ load previous cart
  renderCart();         // ✅ show it
  setupCheckout();
});
