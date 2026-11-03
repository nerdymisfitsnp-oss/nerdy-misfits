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
        p.smartDesc = `Pocket-sized tactile ${p.name} from Fokal's Sensory & Clicker collection. Fun, durable, and satisfying.`;
      } else {
        p.smartDesc = `Hand-finished 3D-printed ${p.name} crafted by the Nerdy Misfits crew in North Port, Florida.`;
      }
    } else {
      p.smartDesc = p.desc.replace(/<[^>]*>?/gm, '').trim();
    }
  });

  // ========================================================================
  // 1. THE 7 MISFITS CREW PROFILES + SIDEKICKS & COMPANIONS
  // ========================================================================
  const CREW_PROFILES = {
    glitch: {
      id: 'glitch',
      name: 'GLITCH',
      role: 'THE NERDY MISFIT • SIDEKICK: BIT ⭐',
      buddy: 'SIDEKICK: BIT ⭐',
      color: 'var(--glitch-green)',
      badgeBg: 'var(--glitch-green)',
      sprite: 'assets/crew_glitch.png',
      avatar: 'assets/avatar_glitch.png',
      loves: 'Tech, video games, and late-night rabbit holes.',
      power: 'System Override — can hack, fix, or glitch anything.',
      quote: '“Clever, curious, and always debugging the system! Hover or click any of our 7 Misfits Crew members rotating around the logo—each of us hosts our own tab of 3D-printed treasures & games!”',
      btnLabel: 'Jump to Featured Picks ↓',
      btnAction: () => document.getElementById('glitchFeaturedAnchor').scrollIntoView({ behavior: 'smooth' })
    },
    fokal: {
      id: 'fokal',
      name: 'FOKAL',
      role: 'THE SENSORY MISFIT 🎧🌀',
      buddy: 'SUPER STRENGTH: EMBRACE THE SPECTRUM 🌈',
      color: 'var(--neon-pink)',
      badgeBg: 'var(--neon-pink)',
      sprite: 'assets/crew_fokal.png',
      avatar: 'assets/avatar_fokal.png',
      loves: 'Fidgets, textures, stims, and anything sensory.',
      power: 'Feel Everything • Super Strength: Embrace the spectrum • Turns overwhelm into good vibes.',
      quote: '“Fidget. Focus. Feel everything. Embrace the textures, stim, and good vibes! My tab is packed with mechanical keyboard clickers, tactile sensory fidgets, pocket keychains, and 3D magnets!”',
      btnLabel: "Open Fokal's Sensory & Clickers Tab →",
      btnAction: () => switchCrewTab('fokal'),
      bannerTitle: "Fokal’s Sensory Zone: Clickers, Fidgets, Keychains & Magnets",
      rootCatIds: ['Q65HXJOBIFHCUYY437SUOZS7', 'THLCGOV4DJ34MVEDM2BCAGRW'],
      subFilterPills: [
        { label: "All Fokal's Sensory Picks", id: 'all' },
        { label: '🕹️ Mechanical Clickers (36)', id: 'QOC3NNHCCMGI32RIV52XHX43' },
        { label: '🌀 Sensory Fidgets (22)', id: 'CTFX2XXA34VD7UAPWQAYWNJ7' },
        { label: '🔑 Pocket Keychains (32)', id: 'XAOUDJVAQLDYFFB7KKXHC42D' },
        { label: '🧲 Tactile Magnets (13)', id: 'XBGNXVNT2ZMCD47GQACWN5GJ' }
      ]
    },
    pixel: {
      id: 'pixel',
      name: 'PIXEL',
      role: 'THE GAME GOBLIN • SIDEKICK: 8-BIT 👾',
      buddy: 'SIDEKICK: 8-BIT 👾',
      color: 'var(--pixel-purple)',
      badgeBg: 'var(--pixel-purple)',
      sprite: 'assets/crew_pixel.png',
      avatar: 'assets/avatar_pixel.png',
      loves: 'Retro games, snacks, and beating everyone.',
      power: 'Extra Life — respawns when it counts.',
      quote: '“Speedrunner. High-score chaser. Chaos enjoyer! Me and 8-Bit are wiring up playable Nerdy Misfits browser mini-games right now—visit our Arcade tab to see what’s coming soon!”',
      btnLabel: "Open Pixel's Mini-Games Arcade →",
      btnAction: () => switchCrewTab('pixel')
    },
    crit: {
      id: 'crit',
      name: 'CRIT & SPARK',
      role: 'THE GAME MASTER & MISCHIEVOUS DRAGON 🐉🎲',
      buddy: 'COMPANION: SPARK THE DRAGON 🔥',
      color: 'var(--neon-volt)',
      badgeBg: '#99cc00',
      sprite: 'assets/crew_crit.png',
      avatar: 'assets/avatar_crit.png',
      loves: 'Tabletop RPGs, lore, dice, epic campaigns, shiny things, snacks, and mayhem.',
      power: 'Critical Influence — can bend fate (and rules) • Spark breathes chaos (and fire).',
      quote: '“Story weaver. Dungeon builder. Rules are suggestions! Join me and my mischievous dragon Spark to explore 146 articulated dragons, character dragons, and tabletop RPG dice towers!”',
      btnLabel: "Open Crit & Spark's Tab →",
      btnAction: () => switchCrewTab('crit'),
      bannerTitle: "Crit & Spark’s Sanctum: 146 Dragons, Character Dragons & Tabletop RPG Gear",
      rootCatIds: ['Y5S6IHG5LHAHHVF3AMNBXOZZ', 'TAZ4GVCDOX2HBTXL4P5J3DLY'],
      subFilterPills: [
        { label: 'All Dragons & RPG Loot', id: 'all' },
        { label: '🐉 All Dragons (146)', id: 'Y5S6IHG5LHAHHVF3AMNBXOZZ' },
        { label: '🎭 Character Dragons (38)', id: '26CK2PGR4ONJ73IEK37ONNR7' },
        { label: '🎲 Dice Towers & RPG Gaming (13)', id: 'TAZ4GVCDOX2HBTXL4P5J3DLY' }
      ]
    },
    justus: {
      id: 'justus',
      name: 'JUSTUS',
      role: 'THE BEAST MASTER • NEMAIN, GROG & BOLT 🐺🐗',
      buddy: 'BEAST CREW: NEMAIN, GROG & BOLT 🐺',
      color: '#ff9f1c',
      badgeBg: '#d97706',
      sprite: 'assets/crew_justus.png',
      avatar: 'assets/avatar_justus.png',
      loves: 'Animals, mead, and being left alone.',
      power: 'Beast Bond — commands and protects with his crew (Nemain the Raven, Grog the Wolf & Bolt the Boar).',
      quote: '“Half-dwarf. Half-orc. All attitude. Loyal to my beasts—enter the Beast Lair for 198+ articulated dinosaurs, wolves, boars, reptiles, frogs, sea creatures, and wild critters!”',
      btnLabel: "Open Justus's Beast Lair →",
      btnAction: () => switchCrewTab('justus'),
      bannerTitle: "Justus’s Beast Lair: Dinosaurs, Wolves, Reptiles, Sea Life & Wild Critters",
      rootCatIds: ['3VFMJ3TDDU55SK7Y6EVQUDP2', 'MKQM5ZY7OOZJVEHWEVQ52T77', 'Y5S6IHG5LHAHHVF3AMNBXOZZ'],
      subFilterPills: [
        { label: "All Justus's Beasts", id: 'all' },
        { label: '🐺 Mammals, Wolves & Birds (72)', id: 'IGGLXWUT43NRF7UCSZDKJ5HQ' },
        { label: '🦖 Dinosaurs (37)', id: '3VFMJ3TDDU55SK7Y6EVQUDP2' },
        { label: '🐸 Frogs & Reptiles (41)', id: 'TKAS6EFG4NPP4V2WXA2MTFIA' },
        { label: '🐢 Turtles & Sea Life (50)', id: '56RVMZOFOGG7GO4X24FG6KBQ' },
        { label: '🐉 Dragons (146)', id: 'Y5S6IHG5LHAHHVF3AMNBXOZZ' }
      ]
    },
    booksy: {
      id: 'booksy',
      name: 'BOOKSY',
      role: 'THE BOOKWORM • SIDEKICK: SHADOW 🐈‍⬛',
      buddy: 'SIDEKICK: SHADOW 🐈‍⬛',
      color: 'var(--booksy-plum)',
      badgeBg: 'var(--booksy-plum)',
      sprite: 'assets/crew_booksy.png',
      avatar: 'assets/avatar_booksy.png',
      loves: 'Books, tea, and conspiracies.',
      power: 'Lore Keeper — remembers everything.',
      quote: '“Quiet. Wise. Collects stories and random facts! Browse my cozy library of BookTok & ACOTAR reading counters, LED lightboxes, coasters, wine holders, and holiday decor.”',
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
      role: 'THE CREATIVE MISFIT • SIDEKICK: SPLAT 🎨',
      buddy: 'SIDEKICK: SPLAT 🎨',
      color: 'var(--inky-blue)',
      badgeBg: 'var(--inky-blue)',
      sprite: 'assets/crew_inky.png',
      avatar: 'assets/avatar_inky.png',
      loves: 'Drawing, comics, music, and caffeine.',
      power: 'Ink Blast — brings ideas to life.',
      quote: '“Artist. Dreamer. Story maker. Sees magic in the margins! Step into my Custom 3D Print Studio to design a personalized print in your favorite colors, or browse our HueForge 3D Wall Art!”',
      btnLabel: "Open Inky's Custom Studio Tab →",
      btnAction: () => switchCrewTab('inky')
    }
  };

  // ========================================================================
  // 2. INTERACTIVE CIRCLE SPOTLIGHT & TAB SWITCHING
  // ========================================================================
  let lastPreviewedCrew = 'glitch';

  window.previewCrewMember = function (crewKey) {
    if (lastPreviewedCrew === crewKey) return;
    const profile = CREW_PROFILES[crewKey];
    if (!profile) return;
    lastPreviewedCrew = crewKey;

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

  let activeGremlinKey = 'fokal';
  let activeGremlinSubCat = 'all';
  let gremlinVisibleCount = 20;

  window.switchCrewTab = function (tabKey) {
    // Update Tab Bar active state & center active pill on mobile horizontal strip
    document.querySelectorAll('.crew-tab-btn').forEach((btn) => {
      const isMatch = btn.getAttribute('data-crew') === tabKey;
      btn.classList.toggle('active', isMatch);
      if (isMatch && btn.scrollIntoView) {
        try {
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (_) {}
      }
    });

    // Hide all tab panels
    document.querySelectorAll('.tab-view-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    if (tabKey === 'glitch') {
      document.getElementById('view-glitch').classList.add('active');
      previewCrewMember('glitch');
    } else if (tabKey === 'pixel') {
      document.getElementById('view-pixel').classList.add('active');
    } else if (tabKey === 'inky') {
      document.getElementById('view-inky').classList.add('active');
    } else if (tabKey === 'markets') {
      document.getElementById('view-markets').classList.add('active');
    } else if (tabKey === 'admin') {
      document.getElementById('view-admin').classList.add('active');
    } else if (CREW_PROFILES[tabKey]) {
      activeGremlinKey = tabKey;
      activeGremlinSubCat = 'all';
      gremlinVisibleCount = 20;
      setupGremlinShopTab(tabKey);
      document.getElementById('view-gremlin-shop').classList.add('active');
    }

    if (tabKey !== 'admin' && typeof window.trackAnalyticsEvent === 'function') {
      window.trackAnalyticsEvent('tab_view', tabKey, null);
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
    if (typeof window.trackAnalyticsEvent === 'function') {
      window.trackAnalyticsEvent('product_view', activeGremlinKey || 'glitch', p.name);
    }
  };

  window.closeQuickView = function () {
    document.getElementById('quickViewModalBackdrop').classList.remove('open');
  };

  // Inky Studio Builder
  let studioState = {
    title: 'Custom Articulated Dragon',
    price: 15,
    color: 'Glitch Lime & Obsidian Silk',
    customColors: '',
    scale: 'Standard Workshop Scale',
    finish: 'Dual/Tri-Color Silk PLA',
    engrave: '',
    refLink: '',
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
    const sizeEl = document.getElementById('studioSizeSelect');
    const finishEl = document.getElementById('studioFinishSelect');
    const customColorEl = document.getElementById('studioCustomColorsInput');
    const engraveEl = document.getElementById('studioEngraveInput');
    const refEl = document.getElementById('studioRefLinkInput');
    const noteEl = document.getElementById('studioNotesInput');

    studioState.scale = sizeEl ? sizeEl.value : 'Standard Workshop Scale';
    studioState.finish = finishEl ? finishEl.value : 'Dual/Tri-Color Silk PLA';
    studioState.customColors = customColorEl ? customColorEl.value.trim() : '';
    studioState.engrave = engraveEl ? engraveEl.value.trim() : '';
    studioState.refLink = refEl ? refEl.value.trim() : '';
    studioState.note = noteEl ? noteEl.value.trim() : '';

    const activeColorText = studioState.customColors
      ? `${studioState.color} (${studioState.customColors})`
      : studioState.color;

    document.getElementById('previewBuildTitle').textContent = studioState.title;

    const scaleFinishNode = document.getElementById('previewScaleFinishText');
    if (scaleFinishNode) {
      scaleFinishNode.textContent = `${studioState.scale} • ${studioState.finish}`;
    }

    document.getElementById('previewFilamentText').textContent = activeColorText;

    const engraveNode = document.getElementById('previewEngraveText');
    if (engraveNode) {
      engraveNode.textContent = studioState.engrave || 'None';
    }

    const refNode = document.getElementById('previewRefText');
    if (refNode) {
      refNode.textContent = studioState.refLink || 'None';
    }

    document.getElementById('previewNoteText').textContent =
      studioState.note || 'Standard Workshop Finish (Ready for your custom notes above)';
    document.getElementById('previewTotalPrice').textContent = `$${studioState.price.toFixed(2)}`;
  };

  window.addCustomStudioBuildToCart = function () {
    updateStudioPreview();
    const parts = [
      `${studioState.scale} (${studioState.finish})`,
      studioState.customColors ? `${studioState.color} [${studioState.customColors}]` : studioState.color
    ];
    if (studioState.engrave) parts.push(`Engrave: "${studioState.engrave}"`);
    if (studioState.refLink) parts.push(`Ref: ${studioState.refLink}`);
    if (studioState.note) parts.push(`Notes: ${studioState.note}`);

    cart.push({
      uid: 'custom-' + Date.now(),
      name: `Inky Custom: ${studioState.title}`,
      price: studioState.price,
      image: 'assets/avatar_inky.png',
      meta: parts.join(' • '),
      qty: 1
    });
    renderCart();
    toggleCartDrawer(true);
    showToast(`🎨 Inky added "${studioState.title}" with your custom specs to your Stash!`);
    if (typeof window.trackAnalyticsEvent === 'function') {
      window.trackAnalyticsEvent('add_to_cart', 'inky', `Inky Custom: ${studioState.title}`);
    }
  };

  // Cart State (Starts empty each time visited)
  let cart = [];

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
    if (typeof window.trackAnalyticsEvent === 'function') {
      window.trackAnalyticsEvent('add_to_cart', activeGremlinKey || 'glitch', p.name);
    }
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

  function getCartTotals() {
    const totalCount = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const fulfillmentEl = document.getElementById('cartFulfillmentSelect');
    const fulfillment = fulfillmentEl ? fulfillmentEl.value : '🚚 US Shipping';
    const isShipping = fulfillment.includes('Shipping');
    const shipping = cart.length === 0 ? 0 : (isShipping ? 5.99 : 0);
    const totalCharged = subtotal + shipping;
    const freeMiniUnlocked = subtotal >= 25;
    return { totalCount, subtotal, shipping, totalCharged, fulfillment, isShipping, freeMiniUnlocked };
  }

  function renderCart() {
    const { totalCount, subtotal, shipping, totalCharged, isShipping, freeMiniUnlocked } = getCartTotals();

    document.getElementById('cartCountBadge').textContent = totalCount;
    document.getElementById('cartSubtotalText').textContent = `$${subtotal.toFixed(2)}`;

    const shipEl = document.getElementById('cartShippingText');
    const shipLabelEl = document.getElementById('cartShippingLabel');
    if (shipLabelEl) {
      shipLabelEl.textContent = isShipping ? 'US Standard Shipping:' : 'SWFL Booth Pickup:';
    }
    if (shipEl) {
      shipEl.textContent = !isShipping && cart.length > 0 ? 'Booth Pickup ($0.00)' : `$${shipping.toFixed(2)}`;
      shipEl.style.color = !isShipping && cart.length > 0 ? 'var(--glitch-green)' : 'inherit';
    }

    const totalEl = document.getElementById('cartTotalChargedText');
    if (totalEl) {
      totalEl.textContent = `$${totalCharged.toFixed(2)}`;
    }

    const bundleText = document.getElementById('bundleMeterText');
    if (freeMiniUnlocked) {
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
    renderCart();
    showToast(`📍 Pickup set to: ${label}`);
  };

  const ORDER_NOTIFY_EDGE_URL = 'https://axavvrqyzpwsczpiwmua.supabase.co/functions/v1/misfits-order-email';

  window.sendMisfitOrderNotification = async function (orderPayload) {
    try {
      const res = await fetch(ORDER_NOTIFY_EDGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {
      // Fallback to local serverless route if edge function is unreachable
    }
    try {
      const res2 = await fetch('/api/order-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res2.ok) {
        return await res2.json();
      }
    } catch (_) {}
    return null;
  };

  window.handleSquareCheckout = async function () {
    if (!cart.length) {
      showToast('Your Stash is empty!');
      return;
    }

    const custName = (document.getElementById('cartCustName')?.value || '').trim();
    const custEmail = (document.getElementById('cartCustEmail')?.value || '').trim();
    const custPhone = (document.getElementById('cartCustPhone')?.value || '').trim();
    const custAddress = (document.getElementById('cartCustAddress')?.value || '').trim();

    if (!custName || !custEmail || !custPhone) {
      showToast('📋 Please enter your Name, Email, and Phone Number before checkout!');
      if (!custName) document.getElementById('cartCustName')?.focus();
      else if (!custPhone) document.getElementById('cartCustPhone')?.focus();
      else document.getElementById('cartCustEmail')?.focus();
      return;
    }

    const { subtotal, shipping, totalCharged, fulfillment, isShipping, freeMiniUnlocked } = getCartTotals();
    if (isShipping && !custAddress) {
      showToast('📦 Please enter your US Shipping Address!');
      document.getElementById('cartCustAddress')?.focus();
      return;
    }

    const orderId = `NM-${Date.now().toString().slice(-6)}`;
    const customer = {
      name: custName,
      email: custEmail,
      phone: custPhone,
      address: custAddress || fulfillment
    };

    const orderPayload = {
      orderId,
      notifyEmail: 'nerdymisfitsnp@gmail.com',
      customer,
      fulfillment,
      items: cart,
      subtotal,
      shipping,
      totalCharged,
      freeMiniUnlocked,
      paymentStatus: 'Initiated Checkout (Square)'
    };

    const btn = document.getElementById('squareCheckoutBtn');
    if (btn) btn.innerHTML = '<span>Sending Order Details &amp; Connecting...</span>';

    if (typeof window.trackAnalyticsEvent === 'function') {
      window.trackAnalyticsEvent('checkout_started', activeGremlinKey || 'glitch', `Order ${orderId}`);
    }

    // Dispatch order email notification to nerdymisfitsnp@gmail.com + log to Supabase
    await window.sendMisfitOrderNotification(orderPayload);

    const checkoutBody = JSON.stringify({
      orderId,
      items: cart,
      fulfillment,
      customer,
      subtotal,
      shipping,
      totalCharged,
      freeMiniUnlocked
    });

    const checkoutEndpoints = ['/api/checkout', 'https://www.nerdymisfits.com/api/checkout'];
    for (const endpoint of checkoutEndpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: checkoutBody
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        }
      } catch (_) {
        // Try next endpoint if running on local static server
      }
    }

    if (btn) btn.innerHTML = '<span>Checkout with Square →</span>';
    showToast(`✅ Order ${orderId} ($${totalCharged.toFixed(2)}) received! We've logged your order and will send your Square invoice shortly.`);
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

  // ========================================================================
  // 8. ADMIN LOGIN (TOP-LEFT LOGO), FULFILLMENT QUEUE, RECORDS & ANALYTICS
  // ========================================================================
  const SUPABASE_REST_URL = 'https://axavvrqyzpwsczpiwmua.supabase.co/rest/v1';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4YXZ2cnF5enB3c2N6cGl3bXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMTA4MDksImV4cCI6MjEwNzU4NjgwOX0.XvOWwBlOBjGYxkQrD8eZvnaWaKb0qMW9HVtWhlnI6Yo';

  const ADMIN_EMAIL = 'nerdymisfitsnp@gmail.com';
  const ADMIN_PASS = 'notyours';

  // Visitor Session ID for live traffic & conversion tracking
  let visitorSessionId = sessionStorage.getItem('nm_visitor_session');
  if (!visitorSessionId) {
    visitorSessionId = 'sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    sessionStorage.setItem('nm_visitor_session', visitorSessionId);
  }

  window.trackAnalyticsEvent = function (eventType, tabOrPage, productName) {
    const deviceType = window.innerWidth <= 780 ? 'Mobile' : 'Desktop';
    fetch(`${SUPABASE_REST_URL}/misfits_analytics_events`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        session_id: visitorSessionId,
        event_type: eventType,
        tab_or_page: tabOrPage || 'glitch',
        product_name: productName || null,
        device_type: deviceType
      })
    }).catch(() => {});
  };

  // Track initial landing page view once per session load
  window.trackAnalyticsEvent('page_view', 'glitch', null);

  let adminOrdersCache = [];
  let adminAnalyticsCache = [];
  let activeAdminSubTab = 'unfulfilled';

  window.handleLogoAdminClick = function (event) {
    if (event) event.stopPropagation();
    if (sessionStorage.getItem('nm_admin_authenticated') === 'true') {
      openAdminDashboard();
    } else {
      const errEl = document.getElementById('adminLoginError');
      if (errEl) errEl.style.display = 'none';
      document.getElementById('adminLoginModalBackdrop').classList.add('open');
      setTimeout(() => {
        document.getElementById('adminEmailInput')?.focus();
      }, 60);
    }
  };

  window.closeAdminLoginModal = function () {
    document.getElementById('adminLoginModalBackdrop').classList.remove('open');
  };

  window.submitAdminLogin = function (event) {
    if (event) event.preventDefault();
    const emailVal = (document.getElementById('adminEmailInput')?.value || '').trim().toLowerCase();
    const passVal = document.getElementById('adminPasswordInput')?.value || '';
    const errEl = document.getElementById('adminLoginError');

    if (emailVal === ADMIN_EMAIL && passVal === ADMIN_PASS) {
      sessionStorage.setItem('nm_admin_authenticated', 'true');
      if (errEl) errEl.style.display = 'none';
      closeAdminLoginModal();
      showToast('🔓 Welcome to Nerdy Misfits Command Center!');
      openAdminDashboard();
    } else {
      if (errEl) {
        errEl.textContent = 'Invalid admin email or password. Please try again.';
        errEl.style.display = 'block';
      }
    }
  };

  window.adminLogout = function () {
    sessionStorage.removeItem('nm_admin_authenticated');
    document.getElementById('adminPasswordInput').value = '';
    showToast('🔒 Logged out of Admin Command Center.');
    switchCrewTab('glitch');
  };

  function openAdminDashboard() {
    switchCrewTab('admin');
    refreshAdminData();
  }

  window.switchAdminSubTab = function (subKey) {
    activeAdminSubTab = subKey;
    document.getElementById('adminTabBtnUnfulfilled').classList.toggle('active', subKey === 'unfulfilled');
    document.getElementById('adminTabBtnFulfilled').classList.toggle('active', subKey === 'fulfilled');
    document.getElementById('adminTabBtnAnalytics').classList.toggle('active', subKey === 'analytics');

    document.getElementById('adminPanelUnfulfilled').style.display = subKey === 'unfulfilled' ? 'block' : 'none';
    document.getElementById('adminPanelFulfilled').style.display = subKey === 'fulfilled' ? 'block' : 'none';
    document.getElementById('adminPanelAnalytics').style.display = subKey === 'analytics' ? 'block' : 'none';
  };

  window.refreshAdminData = async function () {
    try {
      const [ordersRes, analyticsRes] = await Promise.all([
        fetch(`${SUPABASE_REST_URL}/misfits_orders?select=*&order=created_at.desc`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        }),
        fetch(`${SUPABASE_REST_URL}/misfits_analytics_events?select=*&order=created_at.desc&limit=500`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        })
      ]);

      if (ordersRes.ok) {
        adminOrdersCache = await ordersRes.json();
      }
      if (analyticsRes.ok) {
        adminAnalyticsCache = await analyticsRes.json();
      }
    } catch (_) {
      // Fallback if offline
    }

    renderAdminOrders();
    renderAdminAnalytics();
  };

  window.toggleOrderFulfilled = async function (orderId, isFulfilled) {
    const nowIso = isFulfilled ? new Date().toISOString() : null;
    const newStatus = isFulfilled ? 'Fulfilled' : 'Pending Fulfillment';

    // Optimistic UI update
    const target = adminOrdersCache.find((o) => o.order_id === orderId || String(o.id) === String(orderId));
    if (target) {
      target.fulfilled = isFulfilled;
      target.fulfilled_at = nowIso;
      target.status = newStatus;
    }
    renderAdminOrders();
    renderAdminAnalytics();

    showToast(
      isFulfilled
        ? `✅ Order ${orderId} marked FILLED & moved to Previous Orders Record!`
        : `↩️ Order ${orderId} returned to Orders Needing Fulfilled.`
    );

    try {
      await fetch(`${SUPABASE_REST_URL}/misfits_orders?order_id=eq.${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          fulfilled: isFulfilled,
          fulfilled_at: nowIso,
          status: newStatus
        })
      });
    } catch (_) {}
  };

  function formatAdminDate(isoStr) {
    if (!isoStr) return 'Just now';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function renderSingleOrderCard(order, isFulfilledTab) {
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsHtml = items
      .map(
        (it) => `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px 10px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
          <div>
            <strong style="color:#fff;font-size:0.86rem;">${escapeHtml(it.name || '3D Print Item')}</strong>
            <span style="font-family:var(--font-mono);font-size:0.76rem;color:var(--neon-cyan);margin-left:6px;">×${it.qty || 1}</span>
            <div style="font-size:0.74rem;color:var(--text-secondary);">${escapeHtml(it.meta || 'Standard Workshop Finish')}</div>
          </div>
          <strong style="font-family:var(--font-mono);color:var(--neon-green);font-size:0.86rem;">
            $${(Number(it.price || 0) * Number(it.qty || 1)).toFixed(2)}
          </strong>
        </div>
      `
      )
      .join('');

    const totalNum = Number(order.total_charged || 0);
    const subNum = Number(order.subtotal || totalNum);
    const shipNum = Number(order.shipping_cost || 0);

    return `
      <div class="admin-order-card ${isFulfilledTab ? 'fulfilled-record' : ''}">
        <!-- Left Checkbox Column: Click to Mark Filled / Unfilled -->
        <label class="admin-check-wrap" title="${isFulfilledTab ? 'Uncheck to move back to Needs Fulfilled' : 'Check to mark order Filled & move to Previous Orders'}">
          <input
            type="checkbox"
            ${order.fulfilled ? 'checked' : ''}
            onchange="toggleOrderFulfilled('${escapeHtml(order.order_id)}', this.checked)"
          />
          <span>${order.fulfilled ? '✅ Filled' : 'Mark Filled'}</span>
        </label>

        <!-- Center Order Details & Customer Info -->
        <div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
            <span style="font-family:var(--font-mono);font-size:0.95rem;font-weight:900;color:var(--neon-green);background:rgba(57,255,20,0.12);padding:3px 10px;border-radius:8px;border:1px solid var(--neon-green);">
              #${escapeHtml(order.order_id)}
            </span>
            <span style="font-size:0.8rem;color:var(--text-secondary);">
              🕒 Ordered: ${formatAdminDate(order.created_at)}
            </span>
            <span class="host-pill" style="background:rgba(0,229,255,0.14);color:var(--neon-cyan);border-color:var(--neon-cyan);">
              ${escapeHtml(order.fulfillment || '🚚 US Shipping')}
            </span>
            ${
              order.free_mystery_mini
                ? `<span class="host-pill" style="background:rgba(255,0,168,0.18);color:#ff85df;border-color:var(--neon-pink);">🎁 Include Free Mystery Mini</span>`
                : ''
            }
            ${
              order.fulfilled && order.fulfilled_at
                ? `<span class="host-pill" style="background:rgba(57,255,20,0.2);color:var(--neon-green);border-color:var(--neon-green);">✓ Filled ${formatAdminDate(order.fulfilled_at)}</span>`
                : ''
            }
          </div>

          <!-- Customer Contact Bar -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(190px, 1fr));gap:10px;padding:10px 12px;background:rgba(0,0,0,0.35);border-radius:10px;border:1px solid rgba(255,255,255,0.1);margin-bottom:12px;font-size:0.82rem;">
            <div>
              <span style="color:var(--text-secondary);display:block;font-size:0.72rem;">CUSTOMER NAME</span>
              <strong style="color:#fff;">👤 ${escapeHtml(order.customer_name || 'Guest Customer')}</strong>
            </div>
            <div>
              <span style="color:var(--text-secondary);display:block;font-size:0.72rem;">EMAIL &amp; PHONE</span>
              <a href="mailto:${escapeHtml(order.customer_email || '')}" style="color:var(--neon-cyan);font-weight:700;text-decoration:underline;">
                ${escapeHtml(order.customer_email || 'No email')}
              </a>
              ${
                order.customer_phone
                  ? `<div style="color:#e2e8f0;font-family:var(--font-mono);font-size:0.76rem;">📞 ${escapeHtml(order.customer_phone)}</div>`
                  : ''
              }
            </div>
            <div>
              <span style="color:var(--text-secondary);display:block;font-size:0.72rem;">SHIPPING ADDRESS / PICKUP NOTES</span>
              <strong style="color:#ffd166;">📍 ${escapeHtml(order.shipping_address || order.fulfillment || 'See fulfillment')}</strong>
            </div>
          </div>

          <!-- Ordered Items List -->
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${itemsHtml || '<div style="font-size:0.8rem;color:var(--text-secondary);">No line items recorded.</div>'}
          </div>
        </div>

        <!-- Right Column: Financial Breakdown -->
        <div style="min-width:165px;text-align:right;background:rgba(0,0,0,0.35);padding:12px 14px;border-radius:12px;border:1px solid rgba(57,255,20,0.28);">
          <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-secondary);text-transform:uppercase;">
            Total Charged
          </div>
          <div style="font-family:var(--font-mono);font-size:1.55rem;font-weight:900;color:var(--neon-green);margin:2px 0 6px;">
            $${totalNum.toFixed(2)}
          </div>
          <div style="font-size:0.75rem;color:var(--text-secondary);border-top:1px solid rgba(255,255,255,0.1);padding-top:6px;">
            <div>Subtotal: $${subNum.toFixed(2)}</div>
            <div>Shipping: $${shipNum.toFixed(2)}</div>
          </div>
        </div>
      </div>
    `;
  }

  window.renderAdminOrders = function () {
    const qUnfulfilled = (document.getElementById('adminSearchUnfulfilled')?.value || '').trim().toLowerCase();
    const qFulfilled = (document.getElementById('adminSearchFulfilled')?.value || '').trim().toLowerCase();

    const allUnfulfilled = adminOrdersCache.filter((o) => !o.fulfilled);
    const allFulfilled = adminOrdersCache.filter((o) => Boolean(o.fulfilled));

    const unfulfilledBadge = document.getElementById('adminUnfulfilledCountBadge');
    const fulfilledBadge = document.getElementById('adminFulfilledCountBadge');
    if (unfulfilledBadge) unfulfilledBadge.textContent = allUnfulfilled.length;
    if (fulfilledBadge) fulfilledBadge.textContent = allFulfilled.length;

    const filteredUnfulfilled = allUnfulfilled.filter((o) => {
      if (!qUnfulfilled) return true;
      const blob = `${o.order_id} ${o.customer_name} ${o.customer_email} ${o.customer_phone} ${o.shipping_address} ${JSON.stringify(o.items || [])}`.toLowerCase();
      return blob.includes(qUnfulfilled);
    });

    const filteredFulfilled = allFulfilled.filter((o) => {
      if (!qFulfilled) return true;
      const blob = `${o.order_id} ${o.customer_name} ${o.customer_email} ${o.customer_phone} ${o.shipping_address} ${JSON.stringify(o.items || [])}`.toLowerCase();
      return blob.includes(qFulfilled);
    });

    const unfulfilledEl = document.getElementById('adminUnfulfilledList');
    if (unfulfilledEl) {
      unfulfilledEl.innerHTML =
        filteredUnfulfilled.length > 0
          ? filteredUnfulfilled.map((o) => renderSingleOrderCard(o, false)).join('')
          : `<div class="studio-card" style="text-align:center;padding:36px 20px;border-color:rgba(57,255,20,0.35);">
               <div style="font-size:2rem;margin-bottom:6px;">🎉</div>
               <h3 style="font-family:var(--font-display);font-size:1.3rem;font-weight:900;color:var(--neon-green);">All Caught Up! Zero Orders Waiting for Fulfillment</h3>
               <p style="font-size:0.86rem;color:var(--text-secondary);margin-top:4px;">Every order has been packed and checked off into your Previous Orders record.</p>
             </div>`;
    }

    const fulfilledEl = document.getElementById('adminFulfilledList');
    if (fulfilledEl) {
      fulfilledEl.innerHTML =
        filteredFulfilled.length > 0
          ? filteredFulfilled.map((o) => renderSingleOrderCard(o, true)).join('')
          : `<div class="studio-card" style="text-align:center;padding:36px 20px;border-color:rgba(255,255,255,0.18);">
               <h3 style="font-family:var(--font-display);font-size:1.2rem;font-weight:800;">No Fulfilled Orders Match Your Filter Yet</h3>
               <p style="font-size:0.84rem;color:var(--text-secondary);margin-top:4px;">Check the "Mark Filled" box on any active order to move it into this permanent record.</p>
             </div>`;
    }
  };

  window.exportFulfilledOrdersCsv = function () {
    const rows = [
      ['Order ID', 'Created At', 'Fulfilled At', 'Customer Name', 'Email', 'Phone', 'Fulfillment', 'Address', 'Subtotal', 'Shipping', 'Total Charged', 'Items']
    ];
    adminOrdersCache.forEach((o) => {
      const itemsSummary = (Array.isArray(o.items) ? o.items : [])
        .map((i) => `${i.name} (x${i.qty || 1})`)
        .join('; ');
      rows.push([
        o.order_id || '',
        o.created_at || '',
        o.fulfilled_at || (o.fulfilled ? 'Fulfilled' : 'Pending'),
        o.customer_name || '',
        o.customer_email || '',
        o.customer_phone || '',
        o.fulfillment || '',
        o.shipping_address || '',
        Number(o.subtotal || 0).toFixed(2),
        Number(o.shipping_cost || 0).toFixed(2),
        Number(o.total_charged || 0).toFixed(2),
        itemsSummary
      ]);
    });

    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nerdy-misfits-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Exported Nerdy Misfits Order Records to CSV!');
  };

  window.renderAdminAnalytics = function () {
    const events = adminAnalyticsCache || [];
    const orders = adminOrdersCache || [];

    const uniqueSessions = new Set(events.map((e) => e.session_id).filter(Boolean));
    const totalVisitors = Math.max(uniqueSessions.size, orders.length, 1);
    const totalPageViews = events.filter((e) => e.event_type === 'page_view' || e.event_type === 'tab_view').length || totalVisitors;

    const engagedSessions = new Set(
      events
        .filter((e) => e.event_type === 'tab_view' || e.event_type === 'product_view' || e.event_type === 'add_to_cart')
        .map((e) => e.session_id)
    ).size;

    const cartSessions = new Set(
      events.filter((e) => e.event_type === 'add_to_cart' || e.event_type === 'checkout_started').map((e) => e.session_id)
    ).size;

    const totalOrdersCount = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_charged || 0), 0);
    const aov = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

    const cartRatePct = Math.min(100, (Math.max(cartSessions, totalOrdersCount) / totalVisitors) * 100);
    const conversionRatePct = Math.min(100, (totalOrdersCount / totalVisitors) * 100);
    const engagedRatePct = Math.min(100, (Math.max(engagedSessions, cartSessions, totalOrdersCount) / totalVisitors) * 100);

    const kpiVis = document.getElementById('kpiTotalVisitors');
    const kpiViews = document.getElementById('kpiTotalPageViews');
    const kpiCart = document.getElementById('kpiCartRate');
    const kpiCartSub = document.getElementById('kpiCartSubtext');
    const kpiConv = document.getElementById('kpiConversionRate');
    const kpiConvSub = document.getElementById('kpiConversionSubtext');
    const kpiRev = document.getElementById('kpiTotalRevenue');
    const kpiAov = document.getElementById('kpiAovSubtext');

    if (kpiVis) kpiVis.textContent = `${totalVisitors} Visitors`;
    if (kpiViews) kpiViews.textContent = `${totalPageViews} Total Page & Tab Views`;
    if (kpiCart) kpiCart.textContent = `${cartRatePct.toFixed(1)}%`;
    if (kpiCartSub) kpiCartSub.textContent = `${Math.max(cartSessions, totalOrdersCount)} of ${totalVisitors} visitors added to Stash`;
    if (kpiConv) kpiConv.textContent = `${conversionRatePct.toFixed(1)}%`;
    if (kpiConvSub) kpiConvSub.textContent = `${totalOrdersCount} Orders from ${totalVisitors} Visitors (Industry avg: 2.1%)`;
    if (kpiRev) kpiRev.textContent = `$${totalRevenue.toFixed(2)}`;
    if (kpiAov) kpiAov.textContent = `Avg Order Value (AOV): $${aov.toFixed(2)} across ${totalOrdersCount} orders`;

    // Render Conversion Funnel
    const funnelEl = document.getElementById('adminFunnelContainer');
    if (funnelEl) {
      const funnelSteps = [
        { label: '1. Unique Site Visitors (Landed on Site)', count: totalVisitors, pct: 100, color: 'var(--neon-cyan)' },
        { label: '2. Explored Misfits Crew Tabs / Products', count: Math.max(engagedSessions, totalOrdersCount), pct: engagedRatePct, color: 'var(--pixel-purple)' },
        { label: '3. Added 3D Creation to Stash (Cart)', count: Math.max(cartSessions, totalOrdersCount), pct: cartRatePct, color: 'var(--neon-pink)' },
        { label: '4. Completed Order (Converted Customers)', count: totalOrdersCount, pct: conversionRatePct, color: 'var(--neon-green)' }
      ];

      funnelEl.innerHTML = funnelSteps
        .map(
          (step) => `
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.84rem;font-weight:700;margin-bottom:4px;">
              <span>${step.label}</span>
              <span style="font-family:var(--font-mono);color:${step.color};">${step.count} (${step.pct.toFixed(1)}%)</span>
            </div>
            <div style="width:100%;height:12px;background:#0b0d14;border-radius:99px;overflow:hidden;border:1px solid rgba(255,255,255,0.12);">
              <div style="width:${Math.max(step.pct, 4)}%;height:100%;background:${step.color};border-radius:99px;"></div>
            </div>
          </div>
        `
        )
        .join('');
    }

    // Render Crew Tab Traffic Breakdown
    const tabLabels = {
      glitch: "🟢 Glitch's Hub (Home)",
      fokal: "💖 Fokal's Sensory & Clickers",
      crit: "🎲 Crit & Spark (Dragons/RPG)",
      justus: "🐺 Justus's Beast Lair",
      booksy: "📚 Booksy's Cozy Nook",
      inky: "🎨 Inky's Custom Studio",
      pixel: "🟣 Pixel's Mini-Games Arcade",
      markets: '📍 SWFL Markets & All 526'
    };

    const tabCounts = {};
    Object.keys(tabLabels).forEach((k) => (tabCounts[k] = 0));
    events.forEach((e) => {
      const k = (e.tab_or_page || 'glitch').toLowerCase();
      if (tabCounts[k] !== undefined) tabCounts[k] += 1;
    });

    const maxTabCount = Math.max(...Object.values(tabCounts), 1);
    const crewBarsEl = document.getElementById('adminCrewTrafficBars');
    if (crewBarsEl) {
      crewBarsEl.innerHTML = Object.entries(tabLabels)
        .sort((a, b) => tabCounts[b[0]] - tabCounts[a[0]])
        .map(([key, label]) => {
          const count = tabCounts[key];
          const pct = Math.round((count / maxTabCount) * 100);
          return `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:3px;">
                <strong>${label}</strong>
                <span style="font-family:var(--font-mono);color:var(--neon-cyan);">${count} interactions</span>
              </div>
              <div style="width:100%;height:8px;background:#0b0d14;border-radius:99px;overflow:hidden;">
                <div style="width:${Math.max(pct, 6)}%;height:100%;background:linear-gradient(90deg, var(--neon-green), var(--neon-cyan));border-radius:99px;"></div>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // Device Split
    const mobileCount = events.filter((e) => e.device_type === 'Mobile').length;
    const desktopCount = events.length - mobileCount;
    const mobilePct = events.length ? Math.round((mobileCount / events.length) * 100) : 55;
    const desktopPct = 100 - mobilePct;
    const deviceBox = document.getElementById('adminDeviceSplitBox');
    if (deviceBox) {
      deviceBox.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span>📱 <strong>Mobile Traffic:</strong> ${mobilePct}% (${mobileCount} events)</span>
          <span>💻 <strong>Desktop Traffic:</strong> ${desktopPct}% (${desktopCount} events)</span>
        </div>
      `;
    }

    // Recent Events Table
    const recentEl = document.getElementById('adminRecentEventsTable');
    if (recentEl) {
      const recentSlice = events.slice(0, 15);
      recentEl.innerHTML = `
        <table style="width:100%;border-collapse:collapse;font-size:0.82rem;text-align:left;">
          <thead>
            <tr style="border-bottom:1.5px solid rgba(255,255,255,0.15);color:var(--text-secondary);font-family:var(--font-mono);font-size:0.72rem;">
              <th style="padding:8px 10px;">TIME</th>
              <th style="padding:8px 10px;">SESSION</th>
              <th style="padding:8px 10px;">EVENT</th>
              <th style="padding:8px 10px;">CREW TAB</th>
              <th style="padding:8px 10px;">ITEM / ORDER</th>
              <th style="padding:8px 10px;">DEVICE</th>
            </tr>
          </thead>
          <tbody>
            ${recentSlice
              .map(
                (ev) => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
                <td style="padding:8px 10px;color:var(--text-secondary);">${formatAdminDate(ev.created_at)}</td>
                <td style="padding:8px 10px;font-family:var(--font-mono);font-size:0.75rem;color:var(--neon-cyan);">${escapeHtml(ev.session_id)}</td>
                <td style="padding:8px 10px;font-weight:800;color:${
                  ev.event_type === 'checkout_started'
                    ? 'var(--neon-green)'
                    : ev.event_type === 'add_to_cart'
                    ? 'var(--neon-pink)'
                    : '#fff'
                };">${escapeHtml(ev.event_type.toUpperCase())}</td>
                <td style="padding:8px 10px;">${escapeHtml(ev.tab_or_page || 'glitch')}</td>
                <td style="padding:8px 10px;color:#ffd166;">${escapeHtml(ev.product_name || '—')}</td>
                <td style="padding:8px 10px;">${escapeHtml(ev.device_type || 'Desktop')}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;
    }
  };

  initAllViews();
  renderCart();

  // Automatically sync live stock & prices from Square (/api/catalog) in the background
  fetch('/api/catalog')
    .then((r) => (r.ok ? r.json() : null))
    .then((live) => {
      if (!live || !Array.isArray(live.data)) return;
      const byId = {};
      live.data.forEach((item) => {
        byId[item.site_product_id || item.id] = item;
      });
      allProducts.forEach((p) => {
        const remote = byId[p.id];
        if (remote) {
          if (remote.inventory) {
            p.outOfStock = Boolean(remote.inventory.all_variants_out_of_stock);
            p.lowStock = Boolean(remote.inventory.lowest_IS_low_stock);
            p.stock = remote.inventory.total ?? p.stock;
          }
          if (remote.price && remote.price.regular_low_with_modifiers_subunits) {
            p.price = remote.price.regular_low_with_modifiers_subunits / 100;
            p.priceFormatted = remote.price.regular_low_with_modifiers_formatted || `$${p.price.toFixed(2)}`;
          }
        }
      });
      initAllViews();
    })
    .catch(() => {});
})();
