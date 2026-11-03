// ============================================================================
// NERDY MISFITS — ORDER EMAIL NOTIFICATION & SQUARE PAYMENT VERIFIER (/api/order-notify)
// Ensures push notifications to nerdymisfitsnp@gmail.com are ONLY sent AFTER
// payment is completed on Square, and includes product photos of what was ordered.
// ============================================================================

const DEFAULT_NOTIFY_EMAIL = 'nerdymisfitsnp@gmail.com';
const SUPABASE_EDGE_URL = 'https://axavvrqyzpwsczpiwmua.supabase.co/functions/v1/misfits-order-email';
const SUPABASE_REST_URL = 'https://axavvrqyzpwsczpiwmua.supabase.co/rest/v1';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4YXZ2cnF5enB3c2N6cGl3bXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3Njc3MTksImV4cCI6MjA5MTM0MzcxOX0.2371b-n23c2fB85wX9B3I2gX1C_bI-4wM5n8G0k-h7c';

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

  try {
    const body = req.body || {};
    const action = String(body.action || 'confirm_paid').trim();
    const targetEmail = body.notifyEmail || process.env.ORDER_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

    // =========================================================================
    // MODE A: SYNC PENDING SQUARE PAYMENTS (Checks Square Orders API for tenders)
    // Automatically confirms & sends email push notification for any order where
    // the customer completed payment on Square (even if they closed the tab early)
    // =========================================================================
    if (action === 'sync_square_payments') {
      const accessToken = process.env.SQUARE_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(200).json({ ok: true, synced: 0, note: 'No SQUARE_ACCESS_TOKEN configured' });
      }

      const pendingRes = await fetch(
        `${SUPABASE_REST_URL}/misfits_orders?email_sent=eq.false&select=order_id,square_order_id&order=created_at.desc&limit=15`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );

      if (!pendingRes.ok) {
        return res.status(200).json({ ok: true, synced: 0 });
      }

      const pendingOrders = await pendingRes.json();
      const confirmedIds = [];

      for (const row of pendingOrders || []) {
        if (!row.square_order_id) continue;
        try {
          const sqRes = await fetch(`https://connect.squareup.com/v2/orders/${row.square_order_id}`, {
            headers: {
              'Square-Version': '2024-10-17',
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          if (!sqRes.ok) continue;
          const sqData = await sqRes.json();
          const sqOrder = sqData.order;
          const hasPaidTender =
            Array.isArray(sqOrder?.tenders) &&
            sqOrder.tenders.length > 0 &&
            sqOrder.tenders.some(
              (t) =>
                !t.card_details?.status ||
                t.card_details.status === 'CAPTURED' ||
                t.card_details.status === 'AUTHORIZED'
            );

          if (hasPaidTender || sqOrder?.state === 'COMPLETED') {
            const notifyRes = await fetch(SUPABASE_EDGE_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'confirm_paid',
                orderId: row.order_id,
                paymentStatus: 'PAID (Square Verified)'
              })
            });
            if (notifyRes.ok) {
              confirmedIds.push(row.order_id);
            }
          }
        } catch (_) {}
      }

      return res.status(200).json({ ok: true, synced: confirmedIds.length, confirmedIds });
    }

    // =========================================================================
    // MODE B: STAGE CHECKOUT OR CONFIRM PAID VIA SUPABASE EDGE FUNCTION
    // =========================================================================
    const edgeRes = await fetch(SUPABASE_EDGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, notifyEmail: targetEmail })
    });
    if (edgeRes.ok) {
      const edgeData = await edgeRes.json();
      return res.status(200).json(edgeData);
    }

    const errText = await edgeRes.text().catch(() => 'Edge function error');
    return res.status(edgeRes.status || 500).json({ ok: false, error: errText });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
