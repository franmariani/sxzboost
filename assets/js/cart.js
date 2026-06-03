/**
 * SXZBOOST - Shopping Cart Module
 * Fully functional cart with localStorage persistence
 */

(function() {
  'use strict';

  // ==========================================
  // STATE
  // ==========================================
  let cart = [];
  const CART_STORAGE_KEY = 'sxzboost_cart';

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const cartIcon = document.getElementById('cart-icon');
  const cartPanel = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartClose = document.getElementById('cart-close');
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartCount = document.getElementById('cart-count');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastMessage = document.getElementById('toast-message');

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    loadCart();
    bindEvents();
    renderCart();
  }

  // ==========================================
  // EVENT BINDING
  // ==========================================
  function bindEvents() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', handleAddToCart);
    });

    // Cart panel toggle
    if (cartIcon) {
      cartIcon.addEventListener('click', openCart);
      cartIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCart();
        }
      });
    }

    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isCartOpen()) {
        closeCart();
      }
    });

    // Checkout & clear
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
  }

  // ==========================================
  // CART OPERATIONS
  // ==========================================
  function handleAddToCart(e) {
    const btn = e.currentTarget;
    const item = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price, 10),
      img: btn.dataset.img,
      qty: 1
    };

    addToCart(item);
    showToast('check', `${item.name} agregado al carrito`);
    
    // Update form service field
    const servicioInput = document.getElementById('servicio');
    if (servicioInput) {
      servicioInput.value = item.name;
    }
  }

  function addToCart(newItem) {
    const existing = cart.find(item => item.id === newItem.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(newItem);
    }
    saveCart();
    renderCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  }

  function updateQty(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart();
    renderCart();
  }

  function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    saveCart();
    renderCart();
    showToast('trash', 'Carrito vaciado');
  }

  // ==========================================
  // PERSISTENCE
  // ==========================================
  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('localStorage no disponible');
    }
  }

  function loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        cart = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('localStorage no disponible');
      cart = [];
    }
  }

  // ==========================================
  // RENDERING
  // ==========================================
  function renderCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update badge
    if (cartCount) {
      cartCount.textContent = totalQty;
      cartCount.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    // Show/hide empty state and footer
    if (cartEmpty) cartEmpty.style.display = cart.length === 0 ? 'flex' : 'none';
    if (cartFooter) cartFooter.style.display = cart.length === 0 ? 'none' : 'block';

    // Render items
    if (cartItems) {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
              <span>${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Eliminar ${item.name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('');

      // Bind item events
      cartItems.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const action = e.currentTarget.dataset.action;
          updateQty(id, action === 'inc' ? 1 : -1);
        });
      });

      cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.id;
          const item = cart.find(i => i.id === id);
          removeFromCart(id);
          showToast('trash', item ? `${item.name} eliminado` : 'Item eliminado');
        });
      });
    }

    // Update totals
    if (cartSubtotal) cartSubtotal.textContent = formatPrice(totalPrice);
    if (cartTotal) cartTotal.textContent = `Total: ${formatPrice(totalPrice)}`;
  }

  // ==========================================
  // CART PANEL TOGGLE
  // ==========================================
  function openCart() {
    if (cartPanel) {
      cartPanel.setAttribute('aria-hidden', 'false');
    }
    if (cartOverlay) {
      cartOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    // Focus management
    if (cartClose) setTimeout(() => cartClose.focus(), 100);
  }

  function closeCart() {
    if (cartPanel) {
      cartPanel.setAttribute('aria-hidden', 'true');
    }
    if (cartOverlay) {
      cartOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    // Return focus
    if (cartIcon) setTimeout(() => cartIcon.focus(), 100);
  }

  function isCartOpen() {
    return cartPanel && cartPanel.getAttribute('aria-hidden') === 'false';
  }

  // ==========================================
  // CHECKOUT
  // ==========================================
  function handleCheckout() {
    if (cart.length === 0) {
      showToast('alert', 'El carrito está vacío');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Build checkout URL with cart data - redirect to checkout2 (multiple payment methods)
    const cartParam = encodeURIComponent(JSON.stringify(cart));
    window.location.href = `checkout.html?cart=${cartParam}&total=${total}`;
  }

  // ==========================================
  // TOAST NOTIFICATION
  // ==========================================
  let toastTimeout;
  function showToast(type, message) {
    if (!toast || !toastMessage) return;
    
    clearTimeout(toastTimeout);
    
    const icons = {
      check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ffcc" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4757" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      alert: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa502" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    };
    
    if (toastIcon) toastIcon.innerHTML = icons[type] || icons.check;
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');
    
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 3000);
  }

  // ==========================================
  // UTILITIES
  // ==========================================
  function formatPrice(price) {
    return '$' + price.toLocaleString('es-AR');
  }

  // ==========================================
  // PUBLIC API
  // ==========================================
  window.SXZCart = {
    getCart: () => [...cart],
    getTotal: () => cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
    addItem: addToCart,
    removeItem: removeFromCart,
    clear: clearCart,
    open: openCart,
    close: closeCart
  };

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
