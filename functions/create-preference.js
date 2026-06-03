/**
 * Cloudflare Pages Function - MercadoPago Integration
 * Creates a payment preference for the checkout process
 * 
 * Environment variables needed (set in Cloudflare Dashboard):
 * - MP_ACCESS_TOKEN: Your MercadoPago access token
 * - MP_PUBLIC_KEY: Your MercadoPago public key (optional, for frontend)
 */

export async function onRequestPost(context) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const body = await context.request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Items array is required' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    // Get access token from environment
    const accessToken = context.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      // Development fallback - return mock response
      console.warn('MP_ACCESS_TOKEN not configured, returning sandbox URL');
      return new Response(
        JSON.stringify({
          id: 'mock-preference-id',
          init_point: null,
          sandbox_init_point: 'https://www.mercadopago.com.ar',
          warning: 'Modo desarrollo: configurá MP_ACCESS_TOKEN en Cloudflare Dashboard'
        }),
        { headers: corsHeaders, status: 200 }
      );
    }

    // Build the preference payload
    const preference = {
      items: items.map(item => ({
        title: item.title,
        unit_price: item.unit_price,
        quantity: item.quantity,
        currency_id: item.currency_id || 'ARS'
      })),
      back_urls: {
        success: `${context.request.headers.get('origin') || 'https://sxzboost.pages.dev'}/success.html`,
        failure: `${context.request.headers.get('origin') || 'https://sxzboost.pages.dev'}/failure.html`,
        pending: `${context.request.headers.get('origin') || 'https://sxzboost.pages.dev'}/pending.html`
      },
      auto_return: 'approved',
      external_reference: `sxzboost-${Date.now()}`,
      notification_url: `${context.request.headers.get('origin') || 'https://sxzboost.pages.dev'}/api/webhook`
    };

    // Call MercadoPago API
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    if (!mpResponse.ok) {
      const errorData = await mpResponse.json();
      console.error('MercadoPago error:', errorData);
      return new Response(
        JSON.stringify({ 
          error: 'Error creating preference',
          details: errorData.message || 'Unknown error'
        }),
        { headers: corsHeaders, status: 500 }
      );
    }

    const data = await mpResponse.json();

    return new Response(
      JSON.stringify({
        id: data.id,
        init_point: data.init_point,
        sandbox_init_point: data.sandbox_init_point
      }),
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
}

// Also handle OPTIONS for CORS
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    },
    status: 204
  });
}
