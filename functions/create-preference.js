/* =========================
    PRODUCTOS CANÓNICOS
   ========================= */
const PRODUCTS = {
    limpieza_fisica_sin_gpu: { title: "Limpieza física profunda (SIN GPU)", price: 50000 },
    optimizacion_so_bios: { title: "Optimización S.O & BIOS", price: 50000 },
    optimizacion_windows_gaming: { title: "Optimización Windows & Gaming (ONLINE)", price: 40000 },
    formateo_windows: { title: "Formateo e instalación de Windows", price: 5000 },
    limpieza_gpu: { title: "Limpieza de GPU", price: 5 },
    ensamble_pc: { title: "Ensamble de PC", price: 30000 },
    rtx_3060: { title: "Placa de Video RTX 3060", price: 350000 },
    ram_16gb: { title: "Memoria RAM 16GB", price: 45000 },
    ssd_1tb_nvme: { title: "SSD 1TB NVMe", price: 60000 }
};

/* =========================
    GET → PayPal config
   ========================= */
export async function onRequestGet({ env }) {
    return new Response(
    JSON.stringify({
        clientId: env.PAYPAL_CLIENT_ID || null,
        currency: env.PAYPAL_CURRENCY || "USD"
    }),
    { headers: { "Content-Type": "application/json" } }
    );
}

/* =========================
    POST → MercadoPago (Mejorado)
   ========================= */
export async function onRequestPost({ request, env }) {
    try {
    const body = await request.json();

    // Log para depuración (si tu entorno lo permite)
    // console.log("create-preference body:", JSON.stringify(body));

    const { items } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: "Carrito inválido", details: "items vacío o no es array" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const invalidItems = [];
    const mpItems = [];

    for (const item of items) {
      // item esperado: { id: "limpieza_fisica_sin_gpu", qty: 1 }
        if (!item || typeof item.id !== "string" || item.id.trim() === "") {
        invalidItems.push({ item, reason: "id vacío o no es string" });
        continue;
        }

        const product = PRODUCTS[item.id];
        if (!product) {
        invalidItems.push({ item, reason: `id no encontrado en PRODUCTS: '${item.id}'` });
        continue;
        }

        const qty = Number(item.qty ?? 1);
        if (!Number.isFinite(qty) || qty <= 0) {
        invalidItems.push({ item, reason: "qty no numérica o <= 0" });
        continue;
        }

        const unit_price = Number(product.price);
        if (!Number.isFinite(unit_price) || unit_price <= 0) {
        invalidItems.push({ item, reason: `precio inválido en PRODUCTS para '${item.id}': ${product.price}` });
        continue;
        }

        mpItems.push({
        title: product.title,
        quantity: Math.max(1, Math.floor(qty)),
        currency_id: "ARS",
        unit_price: unit_price
        });
    }

    if (invalidItems.length > 0) {
      // devolvemos los ítems inválidos para que el front pueda mostrarlos
        return new Response(JSON.stringify({ error: "Producto inválido", invalidItems }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const origin = request.headers.get("origin") || ("https://" + (request.headers.get("host") || ""));

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        items: mpItems,
        back_urls: {
            success: `${origin}/success.html`,
            failure: `${origin}/failure.html`,
            pending: `${origin}/pending.html`
        },
        auto_return: "approved"
        })
    });

    if (!mpRes.ok) {
        const text = await mpRes.text();
        return new Response(JSON.stringify({ error: "MP API error", details: text }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const preference = await mpRes.json();
    return new Response(JSON.stringify({ init_point: preference.init_point, sandbox_init_point: preference.sandbox_init_point }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
    return new Response(JSON.stringify({ error: "Error creando preferencia", message: e && e.message ? e.message : String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
