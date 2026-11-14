/* ============================================================
   NEO-CLIP — APP LOGIC
   ============================================================ */

const tabs = document.querySelectorAll('.tab-btn');

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  tabs.forEach(t => t.classList.toggle('active', t.dataset.view === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'catalog') renderCatalog(true);
  if (id === 'customer') renderCustomerDash();
  if (id === 'barber') renderBarberDash();
  if (id === 'ladder') renderLadder();
  if (id === 'chat') renderChatPage();
}
tabs.forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));

/* ============================================================
   CONSTANTS
   ============================================================ */
let session = null;
let previewBarber = 'Kelechi N.';

const CATEGORY_COLORS = {
  'Skin Fade': '#8b5cf6', 'Low Fade': '#22d3ee', 'High Fade': '#ec4899',
  'Drop Fade': '#6366f1', 'Taper': '#a855f7', 'Textured Crop': '#14b8a6',
  'Buzz Cut': '#64748b', 'Pompadour': '#f59e0b', 'Quiff': '#f43f5e', 'Locs': '#10b981'
};
const CATEGORIES = Object.keys(CATEGORY_COLORS);

const MODIFIERS = ['Classic','Modern','Textured','Sharp','Soft','Bold','Clean','Natural','Sculpted','Signature','Gradient','Precision','Urban','Executive','Sport','Vintage','Contemporary','Futuristic','Minimalist','Premium'];

const MODIFIER_COLORS = {
  'Classic': '#8b5cf6', 'Modern': '#22d3ee', 'Textured': '#14b8a6', 'Sharp': '#f43f5e',
  'Soft': '#a78bfa', 'Bold': '#ec4899', 'Clean': '#06b6d4', 'Natural': '#10b981',
  'Sculpted': '#6366f1', 'Signature': '#f59e0b', 'Gradient': '#7c3aed', 'Precision': '#e11d48',
  'Urban': '#0891b2', 'Executive': '#9333ea', 'Sport': '#0d9488', 'Vintage': '#b45309',
  'Contemporary': '#db2777', 'Futuristic': '#059669', 'Minimalist': '#64748b', 'Premium': '#eab308'
};

const MODIFIER_BUMP = {
  'Classic': 0, 'Modern': 100, 'Textured': 200, 'Sharp': 150, 'Soft': 0,
  'Bold': 250, 'Clean': 50, 'Natural': 0, 'Sculpted': 300, 'Signature': 500,
  'Gradient': 200, 'Precision': 300, 'Urban': 150, 'Executive': 400, 'Sport': 100,
  'Vintage': 100, 'Contemporary': 250, 'Futuristic': 400, 'Minimalist': 0, 'Premium': 800
};

const DEFAULT_PRICES = {
  'Skin Fade': 3500, 'Low Fade': 3000, 'High Fade': 4000, 'Drop Fade': 3800,
  'Taper': 2800, 'Textured Crop': 3200, 'Buzz Cut': 2000, 'Pompadour': 4500,
  'Quiff': 4200, 'Locs': 6000
};

/* Black hair / barbering photo pool — Pexels */
const BLACK_HAIR_POOL = [
  '4625626', '18503633', '35157693', '20302333', '7388971',
  '7389090', '34579697', '18372355', '6024237', '4625642',
  '1805600', '3993449', '3998415', '1300402', '1319460',
  '2076930', '2378454', '1570809', '1848568', '1805601'
];

function pexelsUrl(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;
}

const FALLBACK_IMG = pexelsUrl('4625626');

/* ============================================================
   CATALOG
   ============================================================ */
const CATALOG = (() => {
  const styles = [];
  let id = 1;
  CATEGORIES.forEach((cat, catIdx) => {
    MODIFIERS.forEach((mod, modIdx) => {
      const maint = ['High Fade','Pompadour','Quiff'].includes(cat) ? 'High upkeep'
                  : ['Buzz Cut','Skin Fade','Low Fade'].includes(cat) ? 'Low upkeep'
                  : 'Medium upkeep';
      styles.push({
        id: id++,
        name: `${mod} ${cat}`,
        category: cat,
        modifier: mod,
        color: CATEGORY_COLORS[cat],
        modColor: MODIFIER_COLORS[mod],
        image: pexelsUrl(BLACK_HAIR_POOL[(catIdx * 11 + modIdx) % BLACK_HAIR_POOL.length]),
        maintenance: maint,
        duration: 40 + ((id * 7) % 35),
        popularity: (4 + ((id * 13) % 10) / 10).toFixed(1)
      });
    });
  });
  return styles;
})();

const SERVICES = { 'Signature cut': 3500, 'Junior cut': 2500, 'Elite cut': 5000 };

/* ============================================================
   BARBERS — each with their own price schedule
   ============================================================ */
const BARBERS = {
  'Kelechi N.': {
    area: 'Gwarinpa', specialty: 'Skin Fade', rating: 4.9, cuts: 212,
    discount: 10, cum: 0, earned: 84500,
    wallet: 84500, walletWeek: 12400, walletTotal: 284500,
    prices: { ...DEFAULT_PRICES },
    walletTx: [], payments: []
  },
  'Amara S.': {
    area: 'Wuse II', specialty: 'Linework', rating: 4.94, cuts: 391,
    discount: 5, cum: 0, earned: 161000,
    wallet: 161000, walletWeek: 22000, walletTotal: 512000,
    prices: {
      'Skin Fade': 4000, 'Low Fade': 3500, 'High Fade': 4500, 'Drop Fade': 4300,
      'Taper': 3200, 'Textured Crop': 3700, 'Buzz Cut': 2500, 'Pompadour': 5000,
      'Quiff': 4700, 'Locs': 6500
    },
    walletTx: [], payments: []
  },
  'Tunde A.': {
    area: 'Maitama', specialty: 'Locs', rating: 4.91, cuts: 366,
    discount: 0, cum: 0, earned: 143000,
    wallet: 143000, walletWeek: 18700, walletTotal: 398000,
    prices: {
      'Skin Fade': 3200, 'Low Fade': 2800, 'High Fade': 3700, 'Drop Fade': 3500,
      'Taper': 2500, 'Textured Crop': 2900, 'Buzz Cut': 1800, 'Pompadour': 4100,
      'Quiff': 3900, 'Locs': 5500
    },
    walletTx: [], payments: []
  }
};

const LEVELS = [
  { name: 'Starter', need: 0, reach: 0, perk: 'Standard discovery in nearby search.' },
  { name: 'Bronze Reach', need: 2000, reach: 12, perk: 'More impressions in nearby results.' },
  { name: 'Silver Reach', need: 5000, reach: 28, perk: 'Priority placement above unboosted barbers.' },
  { name: 'Gold Reach', need: 10000, reach: 52, perk: 'Featured slot in weekly discovery.' },
  { name: 'Platinum Reach', need: 20000, reach: 100, perk: 'Top of nearby discovery plus creator access.' }
];

const NGN = n => '₦' + Math.round(n).toLocaleString('en-NG');
const levelIdx = c => { let i = 0; LEVELS.forEach((l, x) => { if (c >= l.need) i = x; }); return i; };

function getStylePrice(style, barberName) {
  const b = BARBERS[barberName];
  if (!b) return 0;
  const base = (b.prices && b.prices[style.category]) || DEFAULT_PRICES[style.category] || 3000;
  return base + (MODIFIER_BUMP[style.modifier] || 0);
}

function ensureBarberPrices(name) {
  const b = BARBERS[name];
  if (!b.prices) b.prices = { ...DEFAULT_PRICES };
  CATEGORIES.forEach(cat => {
    if (typeof b.prices[cat] !== 'number') b.prices[cat] = DEFAULT_PRICES[cat];
  });
}
Object.keys(BARBERS).forEach(ensureBarberPrices);

/* ============================================================
   LOGIN
   ============================================================ */
function setLoginTab(type) {
  document.getElementById('login-tab-customer').className =
    'flex-1 rounded-lg px-4 py-2 text-sm font-bold transition ' +
    (type === 'customer' ? 'bg-violet-500' : 'text-violet-100/65');
  document.getElementById('login-tab-barber').className =
    'flex-1 rounded-lg px-4 py-2 text-sm font-bold transition ' +
    (type === 'barber' ? 'bg-violet-500' : 'text-violet-100/65');
  document.getElementById('customer-login-form').classList.toggle('hidden-form', type !== 'customer');
  document.getElementById('barber-login-form').classList.toggle('hidden-form', type !== 'barber');
}

document.getElementById('customer-login-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('cl-name').value.trim();
  const phone = document.getElementById('cl-phone').value.trim();
  const area = document.getElementById('cl-area').value;
  if (!name || !phone) return;
  session = { type: 'customer', name, phone, area, wallet: 0 };
  applySession();
  showView('customer');
});

document.getElementById('barber-login-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('bl-name').value.trim();
  const phone = document.getElementById('bl-phone').value.trim();
  const area = document.getElementById('bl-area').value;
  const specialty = document.getElementById('bl-specialty').value;
  if (!name || !phone) return;
  if (!BARBERS[name]) {
    BARBERS[name] = {
      area, specialty, rating: 4.8, cuts: 0, discount: 10,
      cum: 0, earned: 0, wallet: 0, walletWeek: 0, walletTotal: 0,
      prices: { ...DEFAULT_PRICES }, walletTx: [], payments: []
    };
    ensureBarberPrices(name);
  }
  session = { type: 'barber', name, phone, area, specialty };
  applySession();
  showView('barber');
});

function applySession() {
  if (!session) return;
  document.getElementById('header-user').classList.remove('hidden');
  document.getElementById('header-user').classList.add('flex');
  document.getElementById('header-user-name').textContent = session.name;
  document.getElementById('header-user-badge').textContent =
    session.type === 'barber' ? 'BARBER' : 'CUSTOMER';
  document.getElementById('header-login-btn').classList.add('hidden-form');

  if (session.type === 'customer') {
    document.getElementById('customer-gate').classList.add('hidden-form');
    document.getElementById('customer-dashboard').classList.remove('hidden-form');
    document.getElementById('cust-welcome-name').textContent = session.name.split(' ')[0];
    document.getElementById('cust-area').textContent = session.area;
    renderCustomerDash();
  } else {
    document.getElementById('barber-gate').classList.add('hidden-form');
    document.getElementById('barber-dashboard').classList.remove('hidden-form');
    document.getElementById('barb-welcome-name').textContent = session.name.split(' ')[0];
    document.getElementById('barb-area').textContent = session.area;
    document.getElementById('barb-specialty').textContent = session.specialty;
    renderBarberDash();
  }
  lucide.createIcons();
}

function logout() {
  session = null;
  document.getElementById('header-user').classList.add('hidden');
  document.getElementById('header-user').classList.remove('flex');
  document.getElementById('header-login-btn').classList.remove('hidden-form');
  document.getElementById('customer-gate').classList.remove('hidden-form');
  document.getElementById('customer-dashboard').classList.add('hidden-form');
  document.getElementById('barber-gate').classList.remove('hidden-form');
  document.getElementById('barber-dashboard').classList.add('hidden-form');
  showView('overview');
}

/* ============================================================
   STYLE CATALOG
   ============================================================ */
let catalogFilter = 'all';
let catalogSearchTerm = '';
let catalogPage = 0;
const PAGE_SIZE = 24;
let selectedStyle = null;

function renderFilters() {
  const wrap = document.getElementById('catalog-filters');
  const all = `<button class="filter-chip ${catalogFilter === 'all' ? 'active' : ''} rounded-full border border-violet-300/25 px-3 py-1.5 text-xs font-semibold" onclick="setFilter('all')">All 200</button>`;
  const cats = CATEGORIES.map(c =>
    `<button class="filter-chip ${catalogFilter === c ? 'active' : ''} rounded-full border border-violet-300/25 px-3 py-1.5 text-xs font-semibold" onclick="setFilter('${c}')">${c}</button>`
  ).join('');
  wrap.innerHTML = all + cats;
}

function populateCatalogBarberSelect() {
  const sel = document.getElementById('catalog-barber');
  if (!sel) return;
  sel.innerHTML = Object.keys(BARBERS).map(n =>
    `<option ${n === previewBarber ? 'selected' : ''}>${n}</option>`
  ).join('');
}

function setPreviewBarber(name) {
  previewBarber = name;
  renderCatalog();
}

function setFilter(cat) {
  catalogFilter = cat;
  renderFilters();
  renderCatalog(true);
}

function catalogSearch(val) {
  catalogSearchTerm = val;
  renderCatalog(true);
}

function filteredCatalog() {
  return CATALOG.filter(s => {
    if (catalogFilter !== 'all' && s.category !== catalogFilter) return false;
    if (catalogSearchTerm) {
      const q = catalogSearchTerm.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function styleCard(s) {
  const isSel = selectedStyle && selectedStyle.id === s.id;
  const price = getStylePrice(s, previewBarber);
  return `
    <article class="group glass rounded-xl overflow-hidden card-hover cursor-pointer ${isSel ? 'ring-2 ring-cyan-400 glow-cyan' : ''}" onclick="openStyleModal(${s.id})">
      <div style="height:3px;background:linear-gradient(90deg,${s.modColor},${s.color})"></div>
      <div class="h-40 overflow-hidden relative">
        <img src="${s.image}" alt="${s.name}" loading="lazy"
             class="style-card-img w-full h-full object-cover"
             onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>
        <span class="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-extrabold text-black shadow-lg" style="background:${s.modColor}">${s.modifier.toUpperCase()}</span>
        <span class="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-cyan-200">${s.popularity}★</span>
        ${isSel ? `<span class="absolute bottom-2 right-2 rounded-full bg-cyan-400 text-black px-2 py-0.5 text-[9px] font-bold">SELECTED</span>` : ''}
      </div>
      <div class="p-3">
        <p class="font-bold text-sm truncate"><span style="color:${s.modColor}">${s.modifier}</span> ${s.category}</p>
        <p class="text-[11px] text-violet-100/60 truncate">${s.maintenance} · ${s.duration} min</p>
        <div class="mt-2 flex items-center justify-between">
          <span class="text-sm font-bold text-cyan-200">${NGN(price)}</span>
          <span class="text-[10px] text-violet-100/45">${previewBarber.split(' ')[0]}</span>
        </div>
      </div>
    </article>
  `;
}

function renderCatalog(reset = false) {
  if (reset) catalogPage = 0;
  populateCatalogBarberSelect();
  renderFilters();
  const filtered = filteredCatalog();
  const shown = filtered.slice(0, (catalogPage + 1) * PAGE_SIZE);

  document.getElementById('catalog-grid').innerHTML = shown.map(styleCard).join('');
  document.getElementById('catalog-count').textContent = `Showing ${shown.length} of ${filtered.length} styles · prices for ${previewBarber}`;

  const btn = document.getElementById('catalog-load-more');
  if (shown.length >= filtered.length) {
    btn.classList.add('hidden-form');
  } else {
    btn.classList.remove('hidden-form');
    btn.textContent = `Load more (${filtered.length - shown.length} remaining)`;
  }
  lucide.createIcons();
}

function loadMoreStyles() {
  catalogPage++;
  renderCatalog(false);
}

let modalStyle = null;

function openStyleModal(id) {
  modalStyle = CATALOG.find(s => s.id === id);
  if (!modalStyle) return;

  const img = document.getElementById('style-modal-img');
  img.src = modalStyle.image;
  img.alt = modalStyle.name;
  img.onerror = function () { this.onerror = null; this.src = FALLBACK_IMG; };

  document.getElementById('style-modal-cat').textContent =
    `${modalStyle.modifier.toUpperCase()} · ${modalStyle.category.toUpperCase()}`;
  document.getElementById('style-modal-name').textContent = modalStyle.name;
  document.getElementById('style-modal-price').textContent =
    NGN(getStylePrice(modalStyle, previewBarber));
  document.getElementById('style-modal-duration').textContent = modalStyle.duration + ' min';
  document.getElementById('style-modal-pop').textContent = modalStyle.popularity + '★';
  document.getElementById('style-modal-maint').textContent =
    modalStyle.maintenance + ' · priced for ' + previewBarber;
  document.getElementById('style-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeStyleModal() {
  document.getElementById('style-modal').classList.add('hidden');
  modalStyle = null;
}

function selectStyleFromModal() {
  if (!modalStyle) return;
  selectedStyle = modalStyle;
  renderCatalog();
  closeStyleModal();
  if (session && session.type === 'customer') renderCustomerDash();
  addBookingNote(`Style selected: ${selectedStyle.name}`);
}

/* ============================================================
   CUSTOMER DASHBOARD
   ============================================================ */
function renderCustomerDash() {
  if (!session || session.type !== 'customer') return;

  document.getElementById('cust-wallet-balance').textContent = NGN(session.wallet || 0);

  if (selectedStyle) {
    const price = getStylePrice(selectedStyle, previewBarber);
    document.getElementById('selected-style-name').textContent = selectedStyle.name;
    document.getElementById('selected-style-meta').textContent =
      `${selectedStyle.category} · ${NGN(price)} · ${selectedStyle.duration} min`;
  } else {
    document.getElementById('selected-style-name').textContent = 'No style selected';
    document.getElementById('selected-style-meta').textContent = 'Browse the catalog to pick a style';
  }

  const styleForPrice = selectedStyle || CATALOG.find(s => s.name === 'Classic Skin Fade');

  const barberList = document.getElementById('customer-barbers');
  barberList.innerHTML = Object.keys(BARBERS).map(name => {
    const b = BARBERS[name];
    const stylePrice = getStylePrice(styleForPrice, name);
    const discAmt = Math.round(stylePrice * b.discount / 100);
    const total = stylePrice - discAmt;
    return `
      <div class="rounded-xl border border-violet-300/15 bg-black/20 p-3 flex flex-wrap items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center glow-sm">
          <span class="font-bold text-sm">${name.charAt(0)}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-sm">${name} <span class="text-[10px] text-cyan-200">· verified</span></p>
          <p class="text-[11px] text-violet-100/60">${b.area} · ${b.rating}★ · ${b.cuts} cuts · ${b.specialty}</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-bold text-cyan-200">${NGN(total)}</p>
          ${discAmt ? `<p class="text-[10px] text-emerald-300">${b.discount}% off</p>` : `<p class="text-[10px] text-violet-100/40">no discount</p>`}
        </div>
        <button onclick="bookAndPay('${name}')" class="clip-button rounded-lg px-3 py-1.5 text-xs font-bold">Book &amp; pay</button>
        <button onclick="openChat('${name}')" class="ghost-button rounded-lg px-3 py-1.5 text-xs font-bold"><i data-lucide="message-circle" class="w-3 inline"></i></button>
      </div>
    `;
  }).join('');

  const chatList = document.getElementById('customer-chat-list');
  chatList.innerHTML = Object.keys(BARBERS).map(name => {
    const lastMsg = (CHATS[name] && CHATS[name].length) ? CHATS[name][CHATS[name].length - 1] : null;
    return `
      <button onclick="openChat('${name}')" class="w-full rounded-xl border border-violet-300/15 bg-black/20 p-3 flex items-center gap-3 hover:bg-violet-500/10 transition text-left">
        <div class="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center">
          <span class="font-bold text-xs">${name.charAt(0)}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-sm">${name}</p>
          <p class="text-[11px] text-violet-100/55 truncate">${lastMsg ? lastMsg.text : 'Tap to start a chat'}</p>
        </div>
        <i data-lucide="message-circle" class="w-4 text-fuchsia-300"></i>
      </button>
    `;
  }).join('');

  lucide.createIcons();
}

function addBookingNote(text) {
  const list = document.getElementById('customer-bookings');
  if (!list) return;
  const li = document.createElement('li');
  li.className = 'rounded-lg bg-black/20 p-2 text-sm';
  li.textContent = text;
  if (list.querySelector('li.text-violet-100\\/45')) list.innerHTML = '';
  list.prepend(li);
  while (list.children.length > 6) list.removeChild(list.lastChild);
}

function addDemoCredits() {
  if (!session || session.type !== 'customer') return;
  session.wallet = (session.wallet || 0) + 500;
  document.getElementById('cust-wallet-balance').textContent = NGN(session.wallet);
  addBookingNote('+500 demo credits added');
}

function bookAndPay(barberName) {
  if (!session || session.type !== 'customer') { showView('login'); return; }

  const b = BARBERS[barberName];
  const style = selectedStyle || CATALOG.find(s => s.name === 'Classic Skin Fade');
  const gross = getStylePrice(style, barberName);
  const discAmt = Math.round(gross * b.discount / 100);
  const total = gross - discAmt;
  const before = levelIdx(b.cum);

  b.cum += discAmt;
  b.earned += total;
  b.wallet = (b.wallet || 0) + total;
  b.walletWeek = (b.walletWeek || 0) + total;
  b.walletTotal = (b.walletTotal || 0) + total;

  const ref = 'CLIP-' + Math.random().toString(36).slice(2, 7).toUpperCase();
  b.walletTx.unshift({ type: 'credit', amount: total, from: session.name, service: style.name, ref, time: 'just now' });
  b.payments.unshift({ service: style.name, gross, disc: discAmt, total, ref });
  b.cuts++;

  const after = levelIdx(b.cum);
  addBookingNote(`${style.name} with ${barberName} · ${NGN(total)} paid on Clip · ref ${ref}`);
  if (after > before) addBookingNote(`${barberName} unlocked ${LEVELS[after].name} (+${LEVELS[after].reach}% reach)`);

  renderCustomerDash();
}

/* ============================================================
   BARBER DASHBOARD
   ============================================================ */
function renderBarberDash() {
  if (!session || session.type !== 'barber') return;
  const b = BARBERS[session.name];
  if (!b) return;

  document.getElementById('wallet-balance').textContent = NGN(b.wallet || 0);
  document.getElementById('wallet-week').textContent = NGN(b.walletWeek || 0);
  document.getElementById('wallet-total').textContent = NGN(b.walletTotal || 0);

  const txEl = document.getElementById('wallet-tx');
  if (b.walletTx && b.walletTx.length) {
    txEl.innerHTML = b.walletTx.slice(0, 8).map(t => `
      <li class="rounded-lg bg-white/5 p-2 flex items-center justify-between gap-2">
        <div class="min-w-0">
          <p class="font-bold text-emerald-300">+${NGN(t.amount)}</p>
          <p class="text-[10px] text-violet-100/55 truncate">${t.service} · ${t.ref}</p>
        </div>
        <span class="text-[10px] text-violet-100/45 shrink-0">${t.time}</span>
      </li>
    `).join('');
  } else {
    txEl.innerHTML = '<li class="text-violet-100/40 text-xs">No transactions yet.</li>';
  }

  const i = levelIdx(b.cum);
  const next = LEVELS[i + 1];
  document.getElementById('barb-tier').textContent = LEVELS[i].name;
  document.getElementById('barb-reach').textContent = LEVELS[i].reach ? '+' + LEVELS[i].reach + '% reach' : 'Base reach';
  document.getElementById('barb-cum').textContent = NGN(b.cum);
  document.getElementById('barb-next').textContent = next ? 'Next: ' + NGN(next.need) : 'Top tier';
  const pct = next ? Math.max(0, Math.min(100, ((b.cum - LEVELS[i].need) / (next.need - LEVELS[i].need)) * 100)) : 100;
  document.getElementById('barb-bar').style.width = pct + '%';

  const chatList = document.getElementById('barber-chat-list');
  const customerChats = CHATS[session.name] || [];
  if (customerChats.length) {
    chatList.innerHTML = `
      <button onclick="openChat('${session.name}')" class="w-full rounded-xl border border-violet-300/15 bg-black/20 p-3 flex items-center gap-3 hover:bg-violet-500/10 transition text-left">
        <div class="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 grid place-items-center"><i data-lucide="user" class="w-4"></i></div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-sm">Customer chat</p>
          <p class="text-[11px] text-violet-100/55 truncate">${customerChats[customerChats.length - 1].text}</p>
        </div>
        <i data-lucide="message-circle" class="w-4 text-cyan-300"></i>
      </button>
    `;
  } else {
    chatList.innerHTML = '<p class="text-xs text-violet-100/45">No messages yet. Customers can chat with you from the catalog.</p>';
  }

  renderBarberPrices();
  lucide.createIcons();
}

function renderBarberPrices() {
  if (!session || session.type !== 'barber') return;
  const b = BARBERS[session.name];
  const editor = document.getElementById('price-editor');
  if (!editor) return;
  editor.innerHTML = CATEGORIES.map(cat => `
    <label class="block">
      <span class="text-[11px] text-violet-100/70">${cat}</span>
      <input type="number" data-category="${cat}" value="${b.prices[cat]}" min="500" step="100"
             class="input-dark mt-1 w-full rounded-lg px-3 py-2 text-sm">
    </label>
  `).join('');
}

function saveBarberPrices() {
  if (!session || session.type !== 'barber') return;
  const b = BARBERS[session.name];
  const inputs = document.querySelectorAll('#price-editor input[data-category]');
  let changed = 0;
  inputs.forEach(input => {
    const cat = input.dataset.category;
    const val = parseInt(input.value);
    if (!isNaN(val) && val >= 500 && b.prices[cat] !== val) {
      b.prices[cat] = val;
      changed++;
    }
  });
  document.getElementById('price-status').textContent =
    changed
      ? `${changed} price${changed === 1 ? '' : 's'} saved. Customers see your new prices immediately.`
      : 'No changes to save.';
  renderCatalog();
  renderBarberDash();
}

function withdrawWallet() {
  if (!session || session.type !== 'barber') return;
  const b = BARBERS[session.name];
  if (!b || !b.wallet) { document.getElementById('wallet-status').textContent = 'No funds to withdraw yet.'; return; }
  const amount = b.wallet;
  b.walletTx.unshift({ type: 'withdraw', amount, from: 'Bank withdrawal', service: 'Bank •••• 1123',
    ref: 'WDR-' + Math.random().toString(36).slice(2, 7).toUpperCase(), time: 'just now' });
  b.wallet = 0;
  document.getElementById('wallet-status').textContent = `Demo withdrawal of ${NGN(amount)} queued to bank •••• 1123.`;
  renderBarberDash();
}

function addWalletFunds() {
  if (!session || session.type !== 'barber') return;
  const b = BARBERS[session.name];
  b.wallet = (b.wallet || 0) + 10000;
  b.walletWeek = (b.walletWeek || 0) + 10000;
  b.walletTotal = (b.walletTotal || 0) + 10000;
  b.walletTx.unshift({ type: 'credit', amount: 10000, from: 'Demo top-up', service: 'Demo deposit',
    ref: 'DEMO-' + Math.random().toString(36).slice(2, 6).toUpperCase(), time: 'just now' });
  renderBarberDash();
}

function toggleAvailability() {
  const b = document.getElementById('availability-btn');
  b.textContent = b.textContent === 'Available now' ? 'Currently busy' : 'Available now';
}

/* ============================================================
   CHAT
   ============================================================ */
const CHATS = {
  'Kelechi N.': [{ from: 'barber', text: 'Hey! Thanks for reaching out. What style are you thinking?', time: '10:30' }],
  'Amara S.': [{ from: 'barber', text: 'Hi! I specialize in linework. Send me your face shape and I can suggest options.', time: '09:15' }],
  'Tunde A.': [{ from: 'barber', text: 'Ready when you are!', time: '11:00' }]
};
let activeChat = null;

function openChat(barberName) {
  if (!session) { showView('login'); return; }
  activeChat = barberName;
  document.getElementById('chat-with').textContent = barberName;
  document.getElementById('chat-avatar').textContent = barberName.charAt(0);
  if (!CHATS[barberName]) CHATS[barberName] = [];
  renderChatMessages();
  document.getElementById('chat-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('chat-input').focus(), 100);
}

function renderChatMessages() {
  if (!activeChat) return;
  const isBarber = session && session.type === 'barber';
  const msgs = CHATS[activeChat] || [];
  const container = document.getElementById('chat-messages');
  if (!msgs.length) {
    container.innerHTML = '<p class="text-center text-xs text-violet-100/45 mt-8">No messages yet. Say hi 👋</p>';
  } else {
    container.innerHTML = msgs.map(m => {
      const isMine = (m.from === 'barber' && isBarber) || (m.from === 'customer' && !isBarber);
      return `
        <div class="flex ${isMine ? 'justify-end' : 'justify-start'}">
          <div class="max-w-[80%] rounded-2xl px-3 py-2 text-sm ${isMine ? 'chat-bubble-out' : 'chat-bubble-in'}">
            ${m.text}
            <span class="block text-[10px] opacity-55 mt-1">${m.time}</span>
          </div>
        </div>
      `;
    }).join('');
  }
  container.scrollTop = container.scrollHeight;
}

function sendChat() {
  if (!activeChat || !session) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  const time = new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  CHATS[activeChat].push({ from: session.type, text, time });
  input.value = '';
  renderChatMessages();

  setTimeout(() => {
    const replies = ['Sounds good!', 'When works for you?', 'I have a 3 PM slot.', 'That style would suit you.', 'Pay on Clip to confirm?', 'I can do that.'];
    CHATS[activeChat].push({
      from: session.type === 'customer' ? 'barber' : 'customer',
      text: replies[Math.floor(Math.random() * replies.length)],
      time: new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
    });
    renderChatMessages();
  }, 1400);
}

function closeChat() {
  document.getElementById('chat-modal').classList.add('hidden');
  activeChat = null;
  if (session && session.type === 'customer') renderCustomerDash();
  if (session && session.type === 'barber') renderBarberDash();
}

function renderChatPage() {
  const gate = document.getElementById('chat-gate');
  const list = document.getElementById('chat-list-view');
  if (!session) { gate.classList.remove('hidden-form'); list.classList.add('hidden-form'); return; }
  gate.classList.add('hidden-form');
  list.classList.remove('hidden-form');
  const names = session.type === 'barber' ? [session.name] : Object.keys(BARBERS);
  list.innerHTML = names.map(name => {
    const b = BARBERS[name];
    const last = (CHATS[name] && CHATS[name].length) ? CHATS[name][CHATS[name].length - 1] : null;
    return `
      <button onclick="openChat('${name}')" class="w-full rounded-xl border border-violet-300/15 bg-black/20 p-4 flex items-center gap-3 hover:bg-violet-500/10 transition text-left card-hover">
        <div class="h-11 w-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center glow-sm">
          <span class="font-bold text-sm">${name.charAt(0)}</span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-sm">${name} <span class="text-[10px] text-violet-100/55">· ${b.area}</span></p>
          <p class="text-xs text-violet-100/55 truncate">${last ? last.text : 'Tap to start a chat'}</p>
        </div>
        <i data-lucide="message-circle" class="w-5 text-fuchsia-300"></i>
      </button>
    `;
  }).join('');
  lucide.createIcons();
}

/* ============================================================
   LADDER
   ============================================================ */
function getActiveBarberForLadder() {
  if (session && session.type === 'barber' && BARBERS[session.name]) return session.name;
  return Object.keys(BARBERS)[0];
}

function renderLadder() {
  const name = getActiveBarberForLadder();
  const b = BARBERS[name];
  const i = levelIdx(b.cum);
  const next = LEVELS[i + 1];

  document.getElementById('ld-level').textContent = LEVELS[i].name;
  document.getElementById('ld-perk').textContent = LEVELS[i].perk;
  document.getElementById('ld-reach').textContent = LEVELS[i].reach ? '+' + LEVELS[i].reach + '% reach' : 'Base reach';
  document.getElementById('ld-cum').textContent = NGN(b.cum);
  document.getElementById('ld-next').textContent = next ? 'Next: ' + NGN(next.need) : 'Top tier reached';
  const pct = next ? Math.max(0, Math.min(100, ((b.cum - LEVELS[i].need) / (next.need - LEVELS[i].need)) * 100)) : 100;
  document.getElementById('ld-bar').style.width = pct + '%';

  document.getElementById('ld-ladder').innerHTML = LEVELS.map((l, x) => {
    const unlocked = b.cum >= l.need;
    const isCur = x === i;
    const border = isCur ? 'border-cyan-300/50 bg-cyan-300/10 glow-cyan'
      : unlocked ? 'border-emerald-300/30 bg-emerald-300/5'
      : 'border-violet-300/15 bg-black/15';
    const badge = isCur ? 'bg-cyan-300/25 text-cyan-100'
      : unlocked ? 'bg-emerald-300/15 text-emerald-200'
      : 'bg-white/5 text-violet-100/45';
    return `
      <div class="rounded-xl border ${border} p-3 flex flex-wrap items-center gap-3">
        <span class="grid h-7 w-7 place-items-center rounded-lg bg-black/25 font-mono text-xs">${x}</span>
        <div class="min-w-[130px]">
          <p class="text-sm font-bold">${l.name}</p>
          <p class="text-xs text-violet-100/60">${NGN(l.need)} cumulative discount</p>
        </div>
        <span class="text-sm font-bold text-fuchsia-300">${l.reach ? '+' + l.reach + '% reach' : 'Base reach'}</span>
        <span class="ml-auto rounded-full px-2 py-1 text-[10px] font-bold ${badge}">${isCur ? 'CURRENT' : unlocked ? 'UNLOCKED' : 'LOCKED'}</span>
        <p class="w-full text-xs text-violet-100/60">${l.perk}</p>
      </div>
    `;
  }).join('');

  if (session && session.type === 'barber' && session.name === name) {
    const slider = document.getElementById('ld-slider');
    slider.value = b.discount;
    document.getElementById('ld-slider-value').textContent = b.discount + '%';
    const sample = Math.round(SERVICES['Signature cut'] * b.discount / 100);
    document.getElementById('ld-example').textContent = NGN(SERVICES['Signature cut'] - sample);
    document.getElementById('ld-example-disc').textContent = NGN(sample);
  }
}

function setDiscount(v) {
  const name = getActiveBarberForLadder();
  if (session && session.type === 'barber' && session.name === name) {
    BARBERS[name].discount = +v;
    renderLadder();
    renderBarberDash();
  }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  renderCatalog(true);
  setLoginTab('customer');
  renderLadder();
});
