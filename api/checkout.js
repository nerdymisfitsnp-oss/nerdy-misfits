// ============================================================================
// NERDY MISFITS — LIVE SQUARE CHECKOUT API ENDPOINT (/api/checkout)
// Connects your custom website cart ("My Stash") directly to Square POS,
// Square Inventory, and Square Payouts via Square's CreatePaymentLink API.
//
// Required Environment Variables (from https://developer.squareup.com/apps):
//   - SQUARE_ACCESS_TOKEN : Your Production Square Access Token
//   - SQUARE_LOCATION_ID  : Your North Port Square Location ID
// ============================================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  let locationId = process.env.SQUARE_LOCATION_ID;

  if (!accessToken) {
    return res.status(400).json({
      error: 'Missing SQUARE_ACCESS_TOKEN environment variable.'
    });
  }

  try {
    // Automatically look up the active Square Location ID if SQUARE_LOCATION_ID was not manually set
    if (!locationId) {
      const locRes = await fetch('https://connect.squareup.com/v2/locations', {
        headers: {
          'Square-Version': '2024-10-17',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (locRes.ok) {
        const locData = await locRes.json();
        const activeLoc =
          (locData.locations || []).find((l) => l.status === 'ACTIVE') ||
          (locData.locations || [])[0];
        if (activeLoc?.id) {
          locationId = activeLoc.id;
        }
      }
    }

    if (!locationId) {
      return res.status(400).json({
        error: 'Could not determine Square Location ID.'
      });
    }
    const {
      orderId = `NM-${Date.now().toString().slice(-6)}`,
      items = [],
      fulfillment = 'US Shipping',
      customer = {},
      subtotal = 0,
      shipping = 0,
      totalCharged = 0
    } = req.body || {};

    if (!items.length) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const customerTag = customer.name
      ? `Customer: ${customer.name} (${customer.phone || ''} / ${customer.email || ''})`
      : '';

    const lineItems = items.map((item) => ({
      name: String(item.name || 'Nerdy Misfits Creation').slice(0, 250),
      quantity: String(item.qty || 1),
      note: `${item.meta || ''} | Fulfillment: ${fulfillment} ${customerTag}`.trim().slice(0, 480),
      base_price_money: {
        amount: Math.round(Number(item.price) * 100), // Square uses cents
        currency: 'USD'
      }
    }));

    if (Number(shipping) > 0) {
      lineItems.push({
        name: 'US Standard Shipping (North Port Workshop)',
        quantity: '1',
        note: String(customer.address || fulfillment).slice(0, 480),
        base_price_money: {
          amount: Math.round(Number(shipping) * 100),
          currency: 'USD'
        }
      });
    }

    const idempotencyKey = `nm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Note: Do NOT pass customer.phone into pre_populated_data.buyer_phone_number
    // because Square strictly rejects non-E.164 phone numbers with 400 Bad Request.
    // Customer contact info is already included in the order note, Supabase, and email alert.
    const squareResponse = await fetch(
      'https://connect.squareup.com/v2/online-checkout/payment-links',
      {
        method: 'POST',
        headers: {
          'Square-Version': '2024-10-17',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idempotency_key: idempotencyKey,
          order: {
            location_id: locationId,
            reference_id: String(orderId).slice(0, 38),
            line_items: lineItems
          },
          checkout_options: {
            redirect_url: `https://www.nerdymisfits.com/?paid_order=${encodeURIComponent(orderId)}`,
            ask_for_shipping_address: fulfillment.includes('Shipping'),
            accepted_payment_methods: {
              apple_pay: true,
              google_pay: true,
              cash_app_pay: true,
              afterpay_clearpay: true
            }
          }
        })
      }
    );

    const data = await squareResponse.json();

    if (!squareResponse.ok || !data.payment_link?.url) {
      return res.status(500).json({
        error: data.errors?.[0]?.detail || 'Failed to create Square payment link'
      });
    }

    return res.status(200).json({
      url: data.payment_link.url,
      squareOrderId: data.payment_link.order_id || null,
      squarePaymentLinkId: data.payment_link.id || null
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
