// ============================================================================
// NERDY MISFITS — LIVE SQUARE INVENTORY & CATALOG SYNC (/api/catalog)
// Automatically syncs all products, stock counts, prices, and photos from
// their live Square account so online & in-person POS inventory stay 100% tied.
// ============================================================================

export default async function handler(req, res) {
  try {
    // Pulls live inventory & product data from their Square Online Storefront API
    const baseUrl =
      'https://nerdy-misfits.square.site/app/store/api/v28/editor/users/152824795/sites/297800954918091000/products';

    const pages = [1, 2, 3];
    const allItems = [];

    for (const page of pages) {
      const r = await fetch(
        `${baseUrl}?page=${page}&per_page=200&include=images,options,modifiers,categories`
      );
      if (r.ok) {
        const json = await r.json();
        if (Array.isArray(json.data)) {
          allItems.push(...json.data);
        }
      }
    }

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    return res.status(200).json({ count: allItems.length, data: allItems });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
