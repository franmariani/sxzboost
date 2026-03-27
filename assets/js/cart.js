/**
 * cart.js
 * Gestión del carrito de compras de SXZBOOST
 */

(function () {
    'use strict';

    // Captura de elementos
    const cartIcon = document.getElementById('cart-icon');
    const cartPanel = document.getElementById('cart-panel');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = [];

    function updateCart() {
        // Si no existen los contenedores visuales, no hacemos nada
        if (!cartItemsContainer || !cartTotal || !cartCount) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += item.price * item.qty;
            count += item.qty;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
                <div class="cart-item-info">
                    <h5 style="margin:0; font-size: 0.9rem;">${item.name}</h5>
                    <p style="margin:0; font-size: 0.8rem;">$${item.price.toLocaleString()}</p>
                </div>
                <button class="btn-remove" data-index="${index}" style="background:none; border:none; color:red; cursor:pointer; font-size:1.2rem;">&times;</button>
            `;
            cartItemsContainer.appendChild(div);
        });

        cartTotal.textContent = total.toLocaleString();
        cartCount.textContent = count;

        // Re-asignar listeners para borrar items
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.onclick = function() {
                const idx = this.dataset.index;
                cart.splice(idx, 1);
                updateCart();
            };
        });
    }

    // Agregar al carrito - Usamos delegación de eventos para evitar errores
    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('btn-add')) {
            const btn = e.target;
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                img: btn.dataset.img,
                qty: 1
            };

            if (!product.id || isNaN(product.price)) return;

            cart.push(product);
            updateCart();
            
            // Abrir el panel automáticamente para dar feedback
            if (cartPanel) cartPanel.classList.add('active');
        }
    });

    // Ir al Checkout (Protegido con IF para evitar el error "null")
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Agregá al menos un ítem al carrito.');
            const itemsParam = encodeURIComponent(JSON.stringify(cart));
            window.location.href = `checkout.html?cart=${itemsParam}`;
        });
    }

    // Toggle Panel (Cerrar y abrir el carrito)
    if (cartIcon && cartPanel) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartPanel.classList.toggle('active');
        });
    }

})();