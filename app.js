/* ==========================================================================
   NERDY MISFITS — FRIENDLY "MISFITS CREW" TAB & CATALOG ENGINE
   ========================================================================== */

(function () {
  const catalog = window.NERDY_CATALOG || { categories: [], products: [] };
  const allCategories = catalog.categories || [];
  const allProducts = catalog.products || [];

  // Build Category Lookup & Parent -> Children Hierarchy
  const categoryById = {};
  const childrenByParentId = {};

  allCategories.forEach((cat) => {
    categoryById[cat.id] = cat;
    if (!cat.parentId) {
      if (!childrenByParentId[cat.id]) childrenByParentId[cat.id] = [];
    } else {
      if (!childrenByParentId[cat.parentId]) childrenByParentId[cat.parentId] = [];
      childrenByParentId[cat.parentId].push(cat);
    }
  });

  function expandCategoryIds(rootIds) {
    const set = new Set();
    rootIds.forEach((id) => {
      set.add(id);
      (childrenByParentId[id] || []).forEach((child) => set.add(child.id));
    });
    return set;
  }

  // Enrich all 526 products with friendly category labels & descriptions
  allProducts.forEach((p) => {
    const catNames = (p.categoryIds || [])
      .map((cid) => (categoryById[cid] ? categoryById[cid].name : null))
      .filter(Boolean);

    p.primaryCategoryName = catNames.length > 0 ? catNames.join(' • ') : 'Misfit Exclusive';

    if (!p.desc || p.desc.trim() === '') {
      const lower = p.name.toLowerCase();
      if (lower.includes('dragon')) {
        p.smartDesc = `Articulated 3D-printed ${p.name} crafted in North Port, FL with silky multi-color PLA.`;
      } else if (lower.includes('clicker') || lower.includes('fidget') || lower.includes('keychain')) {
        p.smartDesc = `Pocket-sized tactile ${p.name} from Pixel's Tiny Smiles collection. Fun, durable, and satisfying.`;
      } else {
        p.smartDesc = `Hand-finished 3D-printed ${p.name} crafted by the Nerdy Misfits crew in North Port, Florida.`;
      }
    } else {
      p.smartDesc = p.desc.replace(/<[^>]*>?/gm, '').trim();
    }
  });

  // ========================================================================
  // 1. THE 5 MISFITS CREW GREMLIN DEFINITIONS (FROM UPLOADED SHEET)
  // ========================================================================
  const CREW_PROFILES = {
    glitch: {
      id: 'glitch',
      name: 'GLITCH',
      role: 'THE NERDY MISFIT • PIXEL BUDDY: BIT',
      buddy: 'PIXEL BUDDY: BIT ⭐',
      color: 'var(--glitch-green)',
      badgeBg: 'var(--glitch-green)',
      sprite: 'assets/crew_glitch.png',
      avatar: 'assets/avatar_glitch.png',
      loves: 'Tech, video games, and late-night rabbit holes.',
      power: 'System Override — can hack, fix, or glitch anything.',
      quote: '“Welcome to the Nerdy Misfits workshop! Hover or click any of our crew members circled around the logo—each of us hosts our own tab of 3D-printed treasures!”',
      btnLabel: 'Jump to Featured Picks ↓',
      btnAction: () => document.getElementById('glitchFeaturedAnchor').scrollIntoView({ behavior: 'smooth' })
    },
    pixel: {
      id: 'pixel',
      name: 'PIXEL',
      role: 'THE GAME GOBLIN • PIXEL BUDDY: 8-BIT',
      buddy: 'PIXEL BUDDY: 8-BIT 👾',
      color: 'var(--pixel-purple)',
      badgeBg: 'var(--pixel-purple)',
      sprite: 'assets/crew_pixel.png',
      avatar: 'assets/avatar_pixel.png',
      loves: 'Retro games, snacks, and beating everyone.',
      power: 'Extra Life — respawns when it counts.',
      quote: '“Speedrunner & chaos enjoyer reporting in! My tab is packed with mechanical keyboard clickers, sensory fidgets, keychains, magnets, and tabletop dice towers!”',
      btnLabel: "Open Pixel's Arcade Tab →",
      btnAction: () => switchCrewTab('pixel'),
      bannerTitle: "Pixel’s Arcade: Clickers, Fidgets & Gaming Gear",
      rootCatIds: ['Q65HXJOBIFHCUYY437SUOZS7', 'TAZ4GVCDOX2HBTXL4P5J3DLY', 'THLCGOV4DJ34MVEDM2BCAGRW'],
      subFilterPills: [
        { label: "All Pixel's Picks", id: 'all' },
        { label: '🕹️ Clickers (36)', id: 'QOC3NNHCCMGI32RIV52XHX43' },
        { label: '🌀 Fidgets (22)', id: 'CTFX2XXA34VD7UAPWQAYWNJ7' },
        { label: '🎲 Gaming & Dice Towers (13)', id: 'TAZ4GVCDOX2HBTXL4P5J3DLY' },
        { label: '🔑 Keychains (32)', id: 'XAOUDJVAQLDYFFB7KKXHC42D' },
        { label: '🧲 Magnets (13)', id: 'XBGNXVNT2ZMCD47GQACWN5GJ' }
      ]
    },
    zap: {
      id: 'zap',
      name: 'ZAP',
      role: 'THE TECH WIZARD • PIXEL BUDDY: SPARK',
      buddy: 'PIXEL BUDDY: SPARK ⚡',
      color: 'var(--zap-olive)',
      badgeBg: 'var(--zap-olive)',
      sprite: 'assets/crew_zap.png',
      avatar: 'assets/avatar_zap.png',
      loves: 'Coding, inventions, and explaining complex things simply.',
      power: 'Brain Zap — supercharges brains & tech.',
      quote: '“Smart, sarcastic, and knows just enough to be dangerous! Enter my Beast Lair for 146 articulated dragons, 37 dinosaurs, and 161 print-in-place critters.”',
      btnLabel: "Open Zap's Beast Lair Tab →",
      btnAction: () => switchCrewTab('zap'),
      bannerTitle: "Zap’s Beast Lair: 146 Dragons, Dinos & Articulated Critters",
      rootCatIds: ['Y5S6IHG5LHAHHVF3AMNBXOZZ', '3VFMJ3TDDU55SK7Y6EVQUDP2', 'MKQM5ZY7OOZJVEHWEVQ52T77'],
      subFilterPills: [
        { label: 'All Beasts & Critters', id: 'all' },
        { label: '🐉 All Dragons (146)', id: 'Y5S6IHG5LHAHHVF3AMNBXOZZ' },
        { label: '🎭 Character Dragons (38)', id: '26CK2PGR4ONJ73IEK37ONNR7' },
        { label: '🦖 Dinosaurs (37)', id: '3VFMJ3TDDU55SK7Y6EVQUDP2' },
        { label: '🐸 Frogs & Reptiles (41)', id: 'TKAS6EFG4NPP4V2WXA2MTFIA' },
        { label: '🐢 Turtles & Sea Life (50)', id: '56RVMZOFOGG7GO4X24FG6KBQ' },
        { label: '🦊 Mammals & Birds (72)', id: 'IGGLXWUT43NRF7UCSZDKJ5HQ' }
      ]
    },
    booksy: {
      id: 'booksy',
      name: 'BOOKSY',
      role: 'THE BOOKWORM • PIXEL BUDDY: SHADOW',
      buddy: 'PIXEL BUDDY: SHADOW 🐈‍⬛',
      color: 'var(--booksy-plum)',
      badgeBg: 'var(--booksy-plum)',
      sprite: 'assets/crew_booksy.png',
      avatar: 'assets/avatar_booksy.png',
      loves: 'Books, tea, and conspiracies.',
      power: 'Lore Keeper — remembers everything.',
      quote: '“Quiet, wise Lore Keeper here! Browse my cozy library of BookTok & ACOTAR reading counters, LED lightboxes, coasters, wine holders, and holiday decor.”',
      btnLabel: "Open Booksy's Cozy Nook Tab →",
      btnAction: () => switchCrewTab('booksy'),
      bannerTitle: "Booksy’s Cozy Nook: BookTok, Home Decor & Holidays",
      rootCatIds: ['3UTAJTGHFGTUNYWTO5TDHFXW', 'ZIZGOWXK4TMOXXVBKSZIQBE2', 'MWPAJD4SIKTGY5UOWH7ZLQLC'],
      subFilterPills: [
        { label: "All Booksy's Picks", id: 'all' },
        { label: '📚 BookTok & Reading (9)', id: '3UTAJTGHFGTUNYWTO5TDHFXW' },
        { label: '💡 LED Lamps & Lighting (14)', id: 'VYGYQTXWAATMIW3MSSQOKDHQ' },
        { label: '☕ Coasters & Wine (26)', id: 'MDXEYACPTNRGOIQFZWZEKWIK' },
        { label: '🎃 Halloween (21)', id: 'B6YN6EFMLKBMGWK7P6EBMU2U' },
        { label: '🎄 Christmas & Holidays (69)', id: 'MWPAJD4SIKTGY5UOWH7ZLQLC' }
      ]
    },
    inky: {
      id: 'inky',
      name: 'INKY',
      role: 'THE CREATIVE MISFIT • PIXEL BUDDY: SPLAT',
      buddy: 'PIXEL BUDDY: SPLAT 🎨',
      color: 'var(--inky-blue)',
      badgeBg: 'var(--inky-blue)',
      sprite: 'assets/crew_inky.png',
      avatar: 'assets/avatar_inky.png',
      loves: 'Drawing, comics, music, and caffeine.',
      power: 'Ink Blast — brings ideas to life.',
      quote: '“Artist. Dreamer. Story maker! Step into my Custom 3D Print Studio to design a personalized print in your favorite colors, or browse our HueForge 3D Wall Art!”',
      btnLabel: "Open Inky's Custom Studio Tab →",
      btnAction: () => switchCrewTab('inky')
    }
  };

  // ========================================================================
  // 2. INTERACTIVE CIRCLE SPOTLIGHT & TAB SWITCHING
  // ========================================================================
  window.previewCrewMember = function (crewKey) {
    const profile = CREW_PROFILES[crewKey];
    if (!profile) return;

    document.getElementById('spotImg').src = profile.sprite;
    document.getElementById('spotImg').alt = profile.name;
    const spotName = document.getElementById('spotName');
    spotName.textContent = profile.name;
    spotName.style.color = profile.color;

    document.getElementById('spotRole').textContent = profile.role;
    document.getElementById('spotQuote').textContent = profile.quote;
    document.getElementById('spotLoves').textContent = profile.loves;
    document.getElementById('spotPower').textContent = profile.power;

    const btn = document.getElementById('spotActionBtn');
    btn.innerHTML = `<span>${profile.btnLabel}</span>`;
    btn.onclick = profile.btnAction;
  };

  let activeGremlinKey = 'pixel';
  let activeGremlinSubCat = 'all';
  let gremlinVisibleCount = 20;

  window.switchCrewTab = function (tabKey) {
    // Update Tab Bar active state
    document.querySelectorAll('.crew-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-crew') === tabKey);
    });

    // Hide all tab panels
    document.querySelectorAll('.tab-view-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    if (tabKey === 'glitch') {
      document.getElementById('view-glitch').classList.add('active');
      previewCrewMember('glitch');
    } else if (tabKey === 'inky') {
      document.getElementById('view-inky').classList.add('active');
    } else if (tabKey === 'markets') {
      document.getElementById('view-markets').classList.add('active');
    } else if (CREW_PROFILES[tabKey]) {
      activeGremlinKey = tabKey;
      activeGremlinSubCat = 'all';
      gremlinVisibleCount = 20;
      setupGremlinShopTab(tabKey);
      document.getElementById('view-gremlin-shop').classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function setupGremlinShopTab(crewKey) {
    const profile = CREW_PROFILES[crewKey];
    if (!profile) return;

    const banner = document.getElementById('gremlinHostBanner');
    banner.style.borderColor = profile.color;

    document.getElementById('hostBannerImg').src = profile.sprite;
    const badge = document.getElementById('hostBannerBadge');
    badge.textContent = `${profile.name} • ${profile.role.split('•')[0].trim()}`;
    badge.style.background = profile.badgeBg;
    badge.style.color = '#ffffff';

    document.getElementById('hostBuddyBadge').textContent = profile.buddy;
    document.getElementById('hostBannerTitle').textContent = profile.bannerTitle;
    document.getElementById('hostBannerSpeech').textContent = profile.quote;

    renderGremlinSubcatPills(profile);
    renderActiveGremlinProducts();
  }

  function renderGremlinSubcatPills(profile) {
    const container = document.getElementById('hostSubcatPills');
    container.innerHTML = (profile.subFilterPills || [])
      .map(
        (pill) => `
        <button type="button" class="filter-chip ${activeGremlinSubCat === pill.id ? 'active' : ''}"
                onclick="selectGremlinSubCat('${pill.id}')">
          ${escapeHtml(pill.label)}
        </button>
      `
      )
      .join('');
  }

  window.selectGremlinSubCat = function (subId) {
    activeGremlinSubCat = subId;
    gremlinVisibleCount = 20;
    const profile = CREW_PROFILES[activeGremlinKey];
    if (profile) renderGremlinSubcatPills(profile);
    renderActiveGremlinProducts();
  };

  window.renderActiveGremlinProducts = function () {
    const profile = CREW_PROFILES[activeGremlinKey];
    if (!profile) return;

    const stockMode = document.getElementById('gremlinStockSelect').value;
    const sortMode = document.getElementById('gremlinSortSelect').value;

    const allowedIds =
      activeGremlinSubCat === 'all'
        ? expandCategoryIds(profile.rootCatIds)
        : expandCategoryIds([activeGremlinSubCat]);

    let list = allProducts.filter((p) => {
      const inCat = (p.categoryIds || []).some((cid) => allowedIds.has(cid));
      if (!inCat) return false;
      if (stockMode === 'instock' && p.outOfStock) return false;
      if (stockMode === 'print' && !p.outOfStock) return false;
      return true;
    });

    sortProductList(list, sortMode);

    const slice = list.slice(0, gremlinVisibleCount);
    document.getElementById('gremlinResultsCount').innerHTML = `Showing <strong>${slice.length}</strong> of <strong>${list.length}</strong> creations in ${profile.name}’s Tab`;
    document.getElementById('gremlinProductGrid').innerHTML = slice.map(renderProductCardHtml).join('');
    document.getElementById('gremlinLoadMoreBtn').style.display =
      gremlinVisibleCount < list.length ? 'inline-flex' : 'none';
  };

  window.loadMoreGremlinItems = function () {
    gremlinVisibleCount += 20;
    renderActiveGremlinProducts();
  };

  // ========================================================================
  // 3. RENDER PRODUCT CARDS (SHARED ACROSS GLITCH, PIXEL, ZAP, BOOKSY, INKY)
  // ========================================================================
  function renderProductCardHtml(p) {
    let badgeHtml = '';
    if (p.outOfStock) {
      badgeHtml = `<span class="stock-pill print-order">🎨 Print-to-Order</span>`;
    } else if (p.lowStock) {
      badgeHtml = `<span class="stock-pill low">🔥 Only ${p.stock || 1} Left</span>`;
    } else {
      badgeHtml = `<span class="stock-pill ready">⚡ Ready to Ship</span>`;
    }

    const mediaHtml = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />`
      : `
        <div class="product-placeholder">
          <img src="assets/icon.png" alt="Nerdy Misfits" style="background:#000;" />
          <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-secondary);font-weight:700;">Photo Coming Soon</span>
        </div>
      `;

    return `
      <article class="product-card">
        <div class="product-media" onclick="openQuickView('${p.id}')">
          ${badgeHtml}
          ${mediaHtml}
        </div>
        <div class="product-body">
          <div class="product-cat">${escapeHtml(p.primaryCategoryName)}</div>
          <h3 class="product-title" onclick="openQuickView('${p.id}')">${escapeHtml(p.name)}</h3>
          <p class="product-desc">${escapeHtml(p.smartDesc)}</p>
          <div class="product-footer">
            <span class="product-price">${p.priceFormatted}</span>
            <button type="button" class="btn-add-friendly" onclick="addToCart('${p.id}')">
              ${p.outOfStock ? '+ Print Order' : '+ Add to Stash'}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function sortProductList(arr, sortMode) {
    arr.sort((a, b) => {
      if (sortMode === 'price-asc') return a.price - b.price;
      if (sortMode === 'price-desc') return b.price - a.price;
      if (sortMode === 'name-asc') return a.name.localeCompare(b.name);
      const scoreA = (a.image ? 10 : 0) + (a.desc ? 4 : 0) + (!a.outOfStock ? 2 : 0);
      const scoreB = (b.image ? 10 : 0) + (b.desc ? 4 : 0) + (!b.outOfStock ? 2 : 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return b.price - a.price;
    });
  }

  // ========================================================================
  // 4. POPULATE GLITCH'S FEATURED PICKS, INKY'S WALL ART & MASTER CATALOG
  // ========================================================================
  function initAllViews() {
    // 1. Glitch's Top 12 Featured Fan-Favorites
    const featuredIds = [
      '64H2JO36TJOKGRQAVH6ELPNV', // The Exploited Wall Art
      'BOHQY3NXXPZF6QONQ2ZXLIQF', // Behold The Wizard DiceTower
      '6I5NXDY6IJLNSYCVHIZ35EOD', // Viking Dragon Wine Holder
      '4X5S4JAOITI2OL7WAZWEBNY5', // Butterfly fae dragon
      'GWN233QSTUNLLMIJNSUK5VIA', // ACOTAR Lamp
      '7FC75LRJNDI2GEAW3WKTPOZU', // Dragon Lamp
      'JHQQO3UDMSJMCCJWA3RXRUGI', // Raven Wall Art
      'BYBVGTBGS5IZBRR6FF7JA7ES', // Omen Owl Dice Tower
      'YU4V57OQDG7ZYF6GVTKBQBRF', // Skeleton Raptor
      'BGXNBFKZ5GGMVF3N2PEAPXSQ'  // Reading Hoard Book Counter
    ];

    const featuredItems = featuredIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean);

    // Add 2 more in-stock items with images to make an even 12-card grid
    allProducts.forEach((p) => {
      if (featuredItems.length < 12 && p.image && !p.outOfStock && !featuredItems.includes(p)) {
        featuredItems.push(p);
      }
    });

    document.getElementById('glitchFeaturedGrid').innerHTML = featuredItems
      .map(renderProductCardHtml)
      .join('');

    // 2. Inky's Wall Art & Creative Decor Grid
    const inkyIds = expandCategoryIds(['Z7HUVYNTMDRYTLBOR4Q7WCMO', 'VYGYQTXWAATMIW3MSSQOKDHQ', 'MDXEYACPTNRGOIQFZWZEKWIK']);
    const inkyItems = allProducts.filter((p) => (p.categoryIds || []).some((c) => inkyIds.has(c)));
    sortProductList(inkyItems, 'featured');
    document.getElementById('inkyArtGrid').innerHTML = inkyItems.slice(0, 16).map(renderProductCardHtml).join('');

    // 3. Populate Master Category Dropdown (Tab 6)
    const masterSelect = document.getElementById('masterCatSelect');
    allCategories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = `${cat.parentId ? '— ' : ''}${cat.name} (${cat.count})`;
      masterSelect.appendChild(opt);
    });

    renderMasterCatalog(true);
  }

  let masterVisibleCount = 24;
  window.renderMasterCatalog = function (resetCount) {
    if (resetCount) masterVisibleCount = 24;
    const catVal = document.getElementById('masterCatSelect').value;
    const sortVal = document.getElementById('masterSortSelect').value;

    const allowed = catVal === 'all' ? null : expandCategoryIds([catVal]);
    const list = allProducts.filter((p) => {
      if (!allowed) return true;
      return (p.categoryIds || []).some((cid) => allowed.has(cid));
    });

    sortProductList(list, sortVal);
    const slice = list.slice(0, masterVisibleCount);
    document.getElementById('masterCatalogGrid').innerHTML = slice.map(renderProductCardHtml).join('');
    document.getElementById('masterLoadMoreBtn').style.display =
      masterVisibleCount < list.length ? 'inline-flex' : 'none';
  };

  window.loadMoreMasterItems = function () {
    masterVisibleCount += 24;
    renderMasterCatalog(false);
  };

  // ========================================================================
  // 5. INSTANT HEADER SEARCH
  // ========================================================================
  const searchInput = document.getElementById('globalSearchInput');
  const searchDropdown = document.getElementById('searchDropdown');

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length < 2) {
      searchDropdown.classList.remove('active');
      return;
    }

    const q = val.toLowerCase();
    const matches = allProducts
      .filter((p) => `${p.name} ${p.primaryCategoryName} ${p.smartDesc}`.toLowerCase().includes(q))
      .slice(0, 8);

    if (matches.length === 0) {
      searchDropdown.innerHTML = `
        <div style="padding:12px 14px;font-size:0.85rem;color:var(--ink-secondary);">
          No match for "<strong>${escapeHtml(val)}</strong>" — <a href="javascript:void(0)" onclick="switchCrewTab('inky');document.getElementById('searchDropdown').classList.remove('active');" style="color:var(--inky-blue);font-weight:700;text-decoration:underline;">ask Inky to custom print it!</a>
        </div>
      `;
    } else {
      searchDropdown.innerHTML = matches
        .map(
          (m) => `
          <div class="search-result-item" onclick="openQuickView('${m.id}');document.getElementById('searchDropdown').classList.remove('active');">
            <img class="search-result-thumb" src="${m.image || 'assets/circle_logo.png'}" alt="${escapeHtml(m.name)}" />
            <div style="flex:1;min-width:0;">
              <div style="font-weight:800;font-size:0.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(m.name)}</div>
              <div style="font-size:0.74rem;color:var(--ink-secondary);">${escapeHtml(m.primaryCategoryName)}</div>
            </div>
            <strong style="font-family:var(--font-mono);color:var(--glitch-green);font-size:0.88rem;">${m.priceFormatted}</strong>
          </div>
        `
        )
        .join('');
    }
    searchDropdown.classList.add('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-wrap')) {
      searchDropdown.classList.remove('active');
    }
  });

  // ========================================================================
  // 6. QUICK-VIEW MODAL, INKY'S STUDIO & CART DRAWER
  // ========================================================================
  window.openQuickView = function (productId) {
    const p = allProducts.find((item) => item.id === productId);
    if (!p) return;

    document.getElementById('qvMediaContainer').innerHTML = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<div class="product-placeholder"><img src="assets/circle_logo.png" alt="" /></div>`;

    document.getElementById('qvStockBadge').textContent = p.outOfStock
      ? '🎨 PRINT-TO-ORDER (3–5 DAYS)'
      : '⚡ READY TO SHIP';
    document.getElementById('qvCategoryTag').textContent = p.primaryCategoryName.toUpperCase();
    document.getElementById('qvTitle').textContent = p.name;
    document.getElementById('qvPrice').textContent = p.priceFormatted;
    document.getElementById('qvDesc').textContent = p.smartDesc;

    const addBtn = document.getElementById('qvAddBtn');
    addBtn.textContent = `+ Add to My Stash (${p.priceFormatted})`;
    addBtn.onclick = () => {
      const color = document.getElementById('qvColorSelect').value;
      addToCart(p.id, color);
      closeQuickView();
    };

    document.getElementById('quickViewModalBackdrop').classList.add('open');
  };

  window.closeQuickView = function () {
    document.getElementById('quickViewModalBackdrop').classList.remove('open');
  };

  // Inky Studio Builder
  let studioState = {
    title: 'Custom Articulated Dragon',
    price: 15,
    color: 'Glitch Lime & Obsidian Silk',
    note: ''
  };

  window.selectStudioType = function (btn) {
    document.querySelectorAll('#studioTypeGrid .choice-card-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    studioState.title = btn.getAttribute('data-title');
    studioState.price = parseFloat(btn.getAttribute('data-price')) || 15;
    updateStudioPreview();
  };

  window.selectStudioColor = function (btn) {
    document.querySelectorAll('#studioSwatchGrid .swatch-pill-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    studioState.color = btn.getAttribute('data-color');
    updateStudioPreview();
  };

  window.updateStudioPreview = function () {
    studioState.note = document.getElementById('studioNotesInput').value.trim();
    document.getElementById('previewBuildTitle').textContent = studioState.title;
    document.getElementById('previewFilamentText').textContent = studioState.color;
    document.getElementById('previewNoteText').textContent = studioState.note || 'Standard Workshop Finish';
    document.getElementById('previewTotalPrice').textContent = `$${studioState.price.toFixed(2)}`;
  };

  window.addCustomStudioBuildToCart = function () {
    cart.push({
      uid: 'custom-' + Date.now(),
      name: `Inky Custom: ${studioState.title}`,
      price: studioState.price,
      image: 'assets/avatar_inky.png',
      meta: `${studioState.color}${studioState.note ? ' • ' + studioState.note : ''}`,
      qty: 1
    });
    renderCart();
    toggleCartDrawer(true);
    showToast(`🎨 Inky added "${studioState.title}" to your Stash!`);
  };

  // Cart State
  let cart = [
    {
      uid: 'init-1',
      id: '4X5S4JAOITI2OL7WAZWEBNY5',
      name: 'Butterfly fae dragon',
      price: 15.0,
      image: 'https://140844618.cdn6.editmysite.com/uploads/1/4/0/8/140844618/B5EFYOVICPAOPGMHNR2BCRSC.jpeg?width=640&optimize=medium',
      meta: 'As Pictured • Ready to Ship',
      qty: 1
    }
  ];

  document.getElementById('openCartBtn').onclick = () => toggleCartDrawer(true);

  window.toggleCartDrawer = function (open) {
    document.getElementById('cartDrawerBackdrop').classList.toggle('open', open);
  };

  window.addToCart = function (productId, colorChoice) {
    const p = allProducts.find((item) => item.id === productId);
    if (!p) return;

    const meta = colorChoice || (p.outOfStock ? 'Print-to-Order (3–5d)' : 'Ready to Ship');
    const existing = cart.find((c) => c.id === p.id && c.meta === meta);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        uid: p.id + '-' + Date.now(),
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image || 'assets/circle_logo.png',
        meta,
        qty: 1
      });
    }
    renderCart();
    showToast(`🎒 Added "${p.name}" to your Stash!`);
  };

  window.changeCartQty = function (uid, delta) {
    const item = cart.find((c) => c.uid === uid);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((c) => c.uid !== uid);
    }
    renderCart();
  };

  function renderCart() {
    const totalCount = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    document.getElementById('cartCountBadge').textContent = totalCount;
    document.getElementById('cartSubtotalText').textContent = `$${subtotal.toFixed(2)}`;

    const bundleText = document.getElementById('bundleMeterText');
    if (subtotal >= 25) {
      bundleText.innerHTML = `🎉 <strong>UNLOCKED!</strong> Free Mystery Pixel Buddy Mini included!`;
    } else {
      bundleText.innerHTML = `Add <strong>$${(25 - subtotal).toFixed(2)}</strong> more for a <strong>FREE Mystery Pixel Buddy Mini!</strong> 🎁`;
    }

    const container = document.getElementById('cartItemsContainer');
    if (cart.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:30px 10px;color:var(--ink-secondary);">Your Stash is empty! Pick a Gremlin tab to explore.</div>`;
      return;
    }

    container.innerHTML = cart
      .map(
        (item) => `
        <div style="display:flex;align-items:center;gap:10px;background:var(--bg-card);border:1.5px solid rgba(255,255,255,0.12);border-radius:var(--radius-md);padding:10px;">
          <img src="${item.image}" alt="" style="width:52px;height:52px;border-radius:8px;object-fit:cover;" />
          <div style="flex:1;min-width:0;">
            <div style="font-weight:800;font-size:0.88rem;color:var(--text-bright);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(item.name)}</div>
            <div style="font-size:0.74rem;color:var(--text-secondary);margin-bottom:4px;">${escapeHtml(item.meta)}</div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border-radius:99px;padding:1px 8px;">
                <button type="button" onclick="changeCartQty('${item.uid}', -1)" style="font-weight:900;">−</button>
                <span style="font-family:var(--font-mono);font-size:0.78rem;">${item.qty}</span>
                <button type="button" onclick="changeCartQty('${item.uid}', 1)" style="font-weight:900;">+</button>
              </div>
              <strong style="font-family:var(--font-mono);color:var(--neon-green);">$${(item.price * item.qty).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      `
      )
      .join('');
  }

  window.setPickup = function (label) {
    document.getElementById('headerFulfillmentPill').textContent = `📍 ${label}`;
    document.getElementById('cartFulfillmentSelect').value = label;
    showToast(`📍 Pickup set to: ${label}`);
  };

  window.handleSquareCheckout = async function () {
    if (!cart.length) {
      showToast('Your Stash is empty!');
      return;
    }

    const fulfillment = document.getElementById('cartFulfillmentSelect').value;
    const btn = document.getElementById('squareCheckoutBtn');
    if (btn) btn.innerHTML = '<span>Connecting to Square...</span>';

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, fulfillment })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
    } catch (_) {
      // Fallback when running on local static server before Square API token is added
    }

    if (btn) btn.innerHTML = '<span>Checkout with Square →</span>';
    // Fallback to opening the first cart item's real Square product page
    const firstWithId = cart.find((c) => c.id);
    const matchedProd = firstWithId ? allProducts.find((p) => p.id === firstWithId.id) : null;
    if (matchedProd && matchedProd.link) {
      showToast('Opening Square Storefront Checkout...');
      window.open(matchedProd.link, '_blank', 'noopener');
    } else {
      window.open('https://nerdy-misfits.square.site/', '_blank', 'noopener');
    }
  };

  // ========================================================================
  // 7. PORTAL — "STILL ALIVE" (CAKE?) AUDIO PLAYER
  // ========================================================================
  const cakeAudio = document.getElementById('stillAliveAudio');
  const cakeHomeBtn = document.getElementById('cakeHomeBtn');
  const cakeHeaderBtn = document.getElementById('cakeHeaderBtn');

  function syncCakeUI(isPlaying) {
    if (cakeHomeBtn) {
      cakeHomeBtn.classList.toggle('playing', isPlaying);
      cakeHomeBtn.innerHTML = isPlaying ? '<span>🎂 Still Alive (Pause)</span>' : '<span>🎂 Cake?</span>';
    }
    if (cakeHeaderBtn) {
      cakeHeaderBtn.classList.toggle('playing', isPlaying);
      cakeHeaderBtn.innerHTML = isPlaying ? '<span>🎂 Playing...</span>' : '<span>🎂 Cake?</span>';
    }
  }

  window.toggleCakeSong = function () {
    if (!cakeAudio) return;
    if (cakeAudio.paused) {
      cakeAudio.play().then(() => {
        syncCakeUI(true);
      }).catch((err) => {
        console.error(err);
      });
    } else {
      cakeAudio.pause();
      syncCakeUI(false);
    }
  };

  if (cakeAudio) {
    cakeAudio.addEventListener('ended', () => {
      syncCakeUI(false);
    });
  }

  window.showToast = function (msg) {
    const container = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'friendly-toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  initAllViews();
  renderCart();
})();
