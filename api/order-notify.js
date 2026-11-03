// ============================================================================
// NERDY MISFITS — ORDER EMAIL NOTIFICATION ENDPOINT (/api/order-notify)
// Sends instant order notification emails to nerdymisfitsnp@gmail.com with:
//   - Order ID & Timestamp
//   - Total Charged to Customer + Itemized Breakdown (Subtotal + Shipping)
//   - Customer Info (Name, Email, Phone Number, Shipping Address / Pickup Notes)
//   - Ordered Items & Free Bonus Status
// ============================================================================

const DEFAULT_NOTIFY_EMAIL = 'nerdymisfitsnp@gmail.com';
const SUPABASE_EDGE_URL = 'https://axavvrqyzpwsczpiwmua.supabase.co/functions/v1/misfits-order-email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const targetEmail = body.notifyEmail || process.env.ORDER_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

    // 1. Forward to Supabase Edge Function (saves to public.misfits_orders & triggers email relay)
    try {
      const edgeRes = await fetch(SUPABASE_EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, notifyEmail: targetEmail })
      });
      if (edgeRes.ok) {
        const edgeData = await edgeRes.json();
        return res.status(200).json(edgeData);
      }
    } catch (_) {
      // Fallback to direct relay below if Edge Function is unreachable
    }

    // 2. Direct fallback via FormSubmit AJAX relay to nerdymisfitsnp@gmail.com
    const orderId = body.orderId || `NM-${Date.now().toString().slice(-6)}`;
    const customer = body.customer || {};
    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = Number(body.subtotal || 0);
    const shipping = Number(body.shipping || 0);
    const totalCharged = Number(body.totalCharged ?? subtotal + shipping);

    const itemsSummary = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (x${i.qty || 1}) @ $${Number(i.price || 0).toFixed(2)} = $${(
            Number(i.price || 0) * Number(i.qty || 1)
          ).toFixed(2)} [${i.meta || 'Standard'}]`
      )
      .join('\n');

    const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://nerdymisfits.com',
        Referer: 'https://nerdymisfits.com/'
      },
      body: JSON.stringify({
        _subject: `👾 New Nerdy Misfits Order ${orderId} — $${totalCharged.toFixed(2)} (${customer.name || 'Guest'})`,
        _template: 'table',
        _captcha: 'false',
        Order_ID: orderId,
        Total_Charged_To_Customer: `$${totalCharged.toFixed(2)} USD`,
        Charge_Breakdown: `Subtotal: $${subtotal.toFixed(2)} | Shipping: $${shipping.toFixed(2)} | Total: $${totalCharged.toFixed(2)}`,
        Customer_Name: customer.name || 'Not Provided',
        Customer_Email: customer.email || 'Not Provided',
        Customer_Phone: customer.phone || 'Not Provided',
        Fulfillment_Method: body.fulfillment || '🚚 US Shipping',
        Shipping_Address_Or_Pickup_Notes: customer.address || 'Same as fulfillment',
        Free_Mystery_Mini_Unlocked: body.freeMiniUnlocked ? 'YES (Order >= $25)' : 'No',
        Items_Ordered: itemsSummary || 'None'
      })
    });

    const fsData = await fsRes.json().catch(() => ({}));
    return res.status(200).json({
      ok: true,
      orderId,
      recipient: targetEmail,
      totalCharged: `$${totalCharged.toFixed(2)}`,
      relayResponse: fsData
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
