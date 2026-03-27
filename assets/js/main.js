/**
 * main.js
 * Script global del sitio (No checkout)
 * Mantiene lógica general, UI helpers y redirección a WhatsApp.
 */

(function () {
  'use strict';

  /* ==========================================
     1. CONFIGURACIÓN GLOBAL
     ========================================== */

  const WA_META = document.querySelector('meta[name="sxz-whatsapp"]');
  const WHATSAPP_NUMBER = WA_META?.content || '5491112345678';
  const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

  function buildWhatsappMessage(serviceName) {
    const service = serviceName || 'General';
    return encodeURIComponent(`Hola! Quisiera consultar por el servicio: ${service}. Gracias.`);
  }


  /* ==========================================
     2. EVENTOS DE BOTONES WHATSAPP
     ========================================== */

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ws');
    if (!btn) return;

    e.preventDefault();

    // Dinámico: Obtiene el h3 de la tarjeta para no escribir el servicio a mano
    const card = btn.closest('.card');
    const serviceName = card ? card.querySelector('h3')?.textContent : 'General';

    const url = `${WHATSAPP_BASE}?text=${buildWhatsappMessage(serviceName)}`;
    window.open(url, '_blank');
  });


  /* ==========================================
     3. NORMALIZAR ALTURA DE CARDS (UI Helper)
     ========================================== */

  function normalizeCardHeights() {
    const footers = document.querySelectorAll('.card-footer');
    if (!footers.length) return;

    let maxHeight = 0;
    footers.forEach(f => {
      f.style.minHeight = 'auto';
      maxHeight = Math.max(maxHeight, f.offsetHeight);
    });

    footers.forEach(f => {
      f.style.minHeight = `${maxHeight}px`;
    });
  }


  /* ==========================================
     4. FORMULARIO DE CONTACTO
     ========================================== */

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const msg = document.getElementById('formMessage');

      // Validación estándar de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailRegex.test(emailInput.value)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
      }

      if (msg) {
        msg.textContent = '¡Mensaje enviado! Te responderemos a la brevedad.';
        msg.classList.remove('sr-only');
      }

      form.reset();
    });
  }


  /* ==========================================
     5. INICIALIZACIÓN
     ========================================== */

  document.addEventListener('DOMContentLoaded', () => {
    normalizeCardHeights();
    initContactForm();
  });

  // Re-calcular alturas si la ventana cambia de tamaño por el usuario
  window.addEventListener('resize', normalizeCardHeights);

})();