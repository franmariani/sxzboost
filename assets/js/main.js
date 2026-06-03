/**
 * SXZBOOST - Main JavaScript
 * Animations, form handling, and interactions
 */

(function() {
  'use strict';

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    initScrollReveal();
    initFormHandling();
    initSmoothScroll();
    initHeaderBehavior();
    initParallaxEffect();
  }

  // ==========================================
  // SCROLL REVEAL ANIMATION
  // ==========================================
  function initScrollReveal() {
    const sections = document.querySelectorAll('.section-reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after revealing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
      observer.observe(section);
    });

    // Hero is always visible
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('visible');
  }

  // ==========================================
  // FORM HANDLING
  // ==========================================
  function initFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const servicioInput = document.getElementById('servicio');
    const commentsInput = document.getElementById('comments');
    const formMessage = document.getElementById('formMessage');

    // Real-time validation
    nameInput?.addEventListener('blur', () => validateField(nameInput, 'name-error', validateName));
    emailInput?.addEventListener('blur', () => validateField(emailInput, 'email-error', validateEmail));
    phoneInput?.addEventListener('blur', () => validateField(phoneInput, 'phone-error', validatePhone));

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      clearErrors();

      // Validate all fields
      let isValid = true;
      if (!validateField(nameInput, 'name-error', validateName)) isValid = false;
      if (!validateField(emailInput, 'email-error', validateEmail)) isValid = false;
      if (!validateField(phoneInput, 'phone-error', validatePhone)) isValid = false;

      if (!isValid) {
        showFormMessage('Por favor corregí los errores del formulario.', 'error');
        return;
      }

      // Build WhatsApp message
      const message = buildWhatsAppMessage({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        servicio: servicioInput?.value.trim() || 'No especificado',
        comments: commentsInput?.value.trim() || ''
      });

      // Show success
      showFormMessage('¡Solicitud enviada! Te redirigimos a WhatsApp...', 'success');

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/5491123981806?text=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        form.reset();
      }, 800);
    });
  }

  // Validation helpers
  function validateField(input, errorId, validator) {
    if (!input) return false;
    const errorEl = document.getElementById(errorId);
    const error = validator(input.value.trim());
    
    if (error) {
      input.style.borderColor = 'var(--error)';
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      input.style.borderColor = '';
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      el.style.borderColor = '';
    });
  }

  function validateName(value) {
    if (!value) return 'El nombre es obligatorio.';
    if (value.length < 2) return 'Mínimo 2 caracteres.';
    if (!/^[a-zA-Z\s\u00C0-\u00FF]+$/.test(value)) return 'Solo letras y espacios.';
    return '';
  }

  function validateEmail(value) {
    if (!value) return 'El email es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email no válido.';
    return '';
  }

  function validatePhone(value) {
    if (!value) return 'El teléfono es obligatorio.';
    if (!/^\+?[\d\s\-()]{7,}$/.test(value)) return 'Teléfono no válido.';
    return '';
  }

  function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide after 5s
    setTimeout(() => {
      formMessage.className = 'form-message sr-only';
      formMessage.textContent = '';
    }, 5000);
  }

  function buildWhatsAppMessage(data) {
    let msg = `¡Hola! Necesito más info sobre los siguientes servicios de SXZBOOST:\n\n`;
    msg += `👤 *Nombre:* ${data.name}\n`;
    msg += `📧 *Email:* ${data.email}\n`;
    msg += `📱 *Teléfono:* ${data.phone}\n`;
    msg += `🛠️ *Servicio:* ${data.servicio}\n`;
    
    if (data.comments) {
      msg += `📝 *Comentarios:* ${data.comments}\n`;
    }
    
    // Add cart info if available
    if (window.SXZCart) {
      const cart = window.SXZCart.getCart();
      if (cart.length > 0) {
        const total = window.SXZCart.getTotal();
        msg += `\n🛒 *Carrito:*\n`;
        cart.forEach(item => {
          msg += `- ${item.name} x${item.qty}: $${(item.price * item.qty).toLocaleString('es-AR')}\n`;
        });
        msg += `\n💰 *Total:* $${total.toLocaleString('es-AR')}\n`;
      }
    }
    
    msg += `\nQuedo atento, ¡gracias!`;
    return msg;
  }

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ==========================================
  // HEADER BEHAVIOR
  // ==========================================
  function initHeaderBehavior() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    if (!hero || !heroBg) return;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      const heroHeight = hero.offsetHeight;
      const scrollProgress = Math.min(currentScroll / heroHeight, 1);

      // Sutil fade del fondo en scroll
      heroBg.style.opacity = 0.4 * (1 - scrollProgress * 0.7);
    }, { passive: true });
  }

  // ==========================================
  // PARALLAX EFFECT
  // ==========================================
  function initParallaxEffect() {
    const heroInner = document.querySelector('.hero-inner');
    if (!heroInner) return;

    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      
      heroInner.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ==========================================
  // UTILITY: Throttle function
  // ==========================================
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
