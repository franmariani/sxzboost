# 🚀 SXZBOOST

<p align="center">
  <img src="logo.png" alt="SXZBOOST Logo" width="180">
</p>

<p align="center">
  <b>Landing Page de Optimización Gaming & E-commerce</b><br>
  Servicios de mantenimiento y optimización de equipos de alto rendimiento.
</p>

<p align="center">
  <a href="#-características">Características</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-estructura">Estructura</a> •
  <a href="#-instalación">Instalación</a> •
  <a href="#-variables-de-entorno">Variables</a> •
  <a href="#-uso">Uso</a>
</p>

---

## 📋 Características

| Módulo | Descripción |
|--------|-------------|
| **🛒 Carrito de Compras** | Agregado dinámico de servicios y hardware con persistencia en `localStorage`. |
| **💳 Pasarela de Pagos** | Integración con **MercadoPago** (checkout local) y **PayPal** (Smart Buttons). |
| **🏦 Transferencia/Crypto** | Alias de MercadoPago y wallet USDT (BEP20) con botón de envío de comprobante vía WhatsApp. |
| **📱 WhatsApp Directo** | Botón flotante y enlaces dinámicos por servicio para contacto inmediato. |
| **📐 Diseño Responsive** | Glassmorphism, gradientes y layout adaptativo para mobile y desktop. |
| **🔒 Seguridad** | CSP, HSTS, X-Frame-Options y ocultamiento de API keys en backend serverless. |

---

## 🛠 Tech Stack

| Capa | Tecnología |
|------|------------|
| **Frontend** | Vanilla JavaScript (ES6+), HTML5 Semántico, CSS3 |
| **Backend** | Cloudflare Workers (Serverless) |
| **Pagos** | MercadoPago SDK, PayPal Smart Buttons |
| **Deploy** | Cloudflare Pages |
| **Estilos** | Glassmorphism, CSS Grid, Flexbox |

---

## 📁 Estructura

```text
sxzboost/
├── assets/
│   ├── css/
│   │   └── style.css          # Estilos globales, carrito, checkout
│   └── js/
│       ├── cart.js            # Lógica del carrito (add/remove/checkout)
│       └── main.js            # UI helpers, formulario, WhatsApp
├── functions/
│   └── create-preference.js   # Cloudflare Worker: MP & PayPal config
├── img/                       # Imágenes de productos, logos, fondos
├── index.html                 # Home: servicios, hardware, contacto
├── checkout2.html             # Pasarela de pagos (MP, PayPal, Bank, Crypto)
├── success.html               # Pago aprobado
├── pending.html               # Pago pendiente
├── failure.html               # Pago rechazado
├── _headers                   # Headers de seguridad HTTP
└── README.md
```

---

## ⚡ Instalación

1. **Cloná el repositorio:**

```bash
git clone https://github.com/franmariani/sxzboost.git
cd sxzboost
```

2. **Serví localmente:**

Podés usar cualquier servidor estático. Algunas opciones:

```bash
# Con Python 3
python -m http.server 8080

# Con Node.js (npx)
npx serve .

# Con VS Code: extensión "Live Server"
```

3. **Abrí en el navegador:**

```
http://localhost:8080
```

---

## 🔐 Variables de Entorno

Configurá estas variables en tu entorno de **Cloudflare Workers** (Dashboard → Workers & Pages → Settings → Variables):

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `MP_ACCESS_TOKEN` | Access Token de MercadoPago (modo producción o sandbox) | ✅ Sí |
| `PAYPAL_CLIENT_ID` | Client ID de la app PayPal (modo sandbox o live) | ✅ Sí |
| `PAYPAL_CURRENCY` | Moneda para PayPal (default: `USD`) | ❌ No |

> ⚠️ **Nunca expongas estas keys en el frontend.** El Worker las inyecta de forma segura.

---

## 🚀 Uso

### Flujo de Compra

1. En `index.html`, el usuario agrega servicios o hardware al carrito.
2. El carrito se despliega desde el ícono flotante (esquina superior derecha).
3. Al hacer clic en **"Ir al Checkout"**, se serializa el carrito en la URL y se redirige a `checkout2.html`.
4. En el checkout, el usuario elige el método de pago:
   - **MercadoPago**: redirección al checkout seguro.
   - **PayPal**: botón inteligente con conversión ARS → USD.
   - **Transferencia**: copia el alias y envía comprobante por WhatsApp.
   - **Crypto (USDT BEP20)**: copia la dirección de wallet y envía comprobante por WhatsApp.

### WhatsApp

El número de contacto se configura vía meta tag en cada página:

```html
<meta name="sxz-whatsapp" content="5491123981806">
```

---

## 📸 Vista Previa

| Home | Checkout |
|------|----------|
| Servicios, hardware y carrito | Pasarela con múltiples métodos de pago |

---

## 🗺 Roadmap

- [ ] Base de datos para gestión dinámica de stock
- [ ] Panel de administrador (Dashboard)
- [ ] Sistema de tickets para soporte técnico post-venta
- [ ] Modo oscuro/claro toggle
- [ ] Notificaciones push de estado de pago

---

## 📝 Licencia

Este proyecto es de uso personal/comercial para **SXZBOOST**.

---

<p align="center">
  <b>© 2026 SXZBOOST · Buenos Aires, Argentina</b><br>
  Desarrollado por <a href="https://github.com/franmariani">Franco Mariani</a>
</p>
