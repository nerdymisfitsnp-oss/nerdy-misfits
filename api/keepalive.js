// ============================================================================
// NERDY MISFITS — SUPABASE HEARTBEAT & LEADS API (/api/keepalive)
// 1. Triggered daily by Vercel Cron ("0 9 * * *") so your Free Supabase
//    database stays active 24/7 and never pauses!
// 2. Also accepts POST requests to save VIP email signups or Custom Print notes.
// ============================================================================

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      ok: true,
      message: 'Supabase keys not configured yet (running in standalone Square mode).'
    });
  }

  try {
    if (req.method === 'POST') {
      const { type, email, payload } = req.body || {};
      const table = type === 'custom_print' ? 'custom_print_requests' : 'vip_subscribers';
      const bodyData = type === 'custom_print' ? payload : { email };

      const r = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(bodyData)
      });

      return res.status(r.ok ? 200 : 400).json({ ok: r.ok });
    }

    // GET request (Daily Keep-Alive Ping)
    const ping = await fetch(`${supabaseUrl}/rest/v1/market_schedule?select=id&limit=1`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      }
    });

    return res.status(200).json({ ok: ping.ok, timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
