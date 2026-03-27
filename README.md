# 🚀 SXZBOOST

### *Landing Page de Optimización Gaming & E-commerce*

Plataforma web profesional orientada a servicios de mantenimiento y optimización de equipos de alto rendimiento. El proyecto integra un flujo completo de venta, desde la selección de servicios hasta la pasarela de pagos segura.

---

## 💻 Resumen del Proyecto

Este sitio ha sido desarrollado con un enfoque en **rendimiento y seguridad**. Utiliza una arquitectura moderna que separa la lógica visual de la lógica de procesamiento de pagos.

| Característica | Detalle Técnico |
| :--- | :--- |
| **Frontend** | `Vanilla JavaScript` (ES6+), `HTML5` Semántico, `CSS3` con Glassmorphism. |
| **Seguridad** | `OWASP Compliance`: `CSP`, `HSTS`, `X-Frame-Options` y ocultamiento de llaves. |
| **Backend** | `Cloudflare Workers` (Serverless) para la creación de preferencias de pago. |
| **Pagos** | Integración con `Mercado Pago SDK` y `PayPal Smart Buttons`. |
| **Deployment** | `CI/CD` mediante `Cloudflare Pages`. |

---

📂 Estructura de Archivos

```text
sxzboost/
├── assets/
│   ├── css/        # Estilos visuales (style.css)
│   └── js/         # Lógica de carrito (cart.js) y global (main.js)
├── functions/      # Serverless Functions (create-preference.js)
├── img/            # Catálogo de imágenes y banners
├── _headers        # Configuración de seguridad HTTP
├── index.html      # Home y servicios
└── checkout.html   # Pasarela de pagos y resumen
```


🛠️ Tecnologías Utilizadas

Lenguajes: JavaScript puro (sin frameworks pesados), CSS3, HTML5.

Seguridad: Implementación de Content Security Policy (CSP) para prevenir ataques XSS.

Integraciones: * API de WhatsApp Business para contacto directo.

Mercado Pago & PayPal para transacciones internacionales y locales.

🚀 Instalación Local

Si deseas probar el proyecto en tu entorno local:

Clona el repositorio:

git clone https://github.com/franmariani/sxzboost.git


Navega a la carpeta:

cd sxzboost


Ejecuta un servidor:
Puedes usar la extensión Live Server de VS Code para previsualizar el sitio.

📈 Roadmap (Próximas Mejoras)

[ ] Implementación de base de datos para gestión dinámica de stock.

[ ] Panel de control para el administrador (Dashboard).

[ ] Sistema de tickets para soporte técnico post-venta.

![ezgif-6ae0974f95c87f30](https://github.com/user-attachments/assets/879fcaaa-71d1-4057-8d6f-f08f0276dfd6)



© 2026 Franco Mariani · Cybersecurity Student

