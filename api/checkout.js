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
    const { items = [], fulfillment = 'Free US Shipping' } = req.body || {};

    if (!items.length) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const lineItems = items.map((item) => ({
      name: item.name,
      quantity: String(item.qty || 1),
      note: `${item.meta || ''} | Fulfillment: ${fulfillment}`.trim(),
      base_price_money: {
        amount: Math.round(Number(item.price) * 100), // Square uses cents
        currency: 'USD'
      }
    }));

    const idempotencyKey = `nm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

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
            line_items: lineItems
          },
          checkout_options: {
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

    return res.status(200).json({ url: data.payment_link.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
