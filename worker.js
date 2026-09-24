export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/manifest.json')
      return new Response(MANIFEST, { headers: {'Content-Type':'application/manifest+json','Cache-Control':'public,max-age=86400'} });
    if (url.pathname === '/sw.js')
      return new Response(SW_JS, { headers: {'Content-Type':'application/javascript','Cache-Control':'no-cache'} });
    if (url.pathname === '/icon.svg')
      return new Response(ICON_SVG, { headers: {'Content-Type':'image/svg+xml','Cache-Control':'public,max-age=86400'} });
    return new Response(APP_HTML, { headers: {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-cache'} });
  }
};

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="100" fill="#0a2342"/><text x="256" y="365" font-size="310" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">&#x1F420;</text></svg>`;

const MANIFEST = JSON.stringify({
  name: 'AquaTracker',
  short_name: 'AquaTracker',
  description: 'Aquarium tracking and management',
  start_url: '/',
  display: 'standalone',
  background_color: '#0a2342',
  theme_color: '#0a2342',
  icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
});

const SW_JS = `
const CACHE = 'aq-v2';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { var rc = r.clone(); caches.open(CACHE).then(c => c.put(e.request, rc)); }
      return r;
    }).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(r => {
    if (r.ok) { var rc = r.clone(); caches.open(CACHE).then(c => c.put(e.request, rc)); }
    return r;
  })));
});
`;

const APP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#0a2342">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="AquaTracker">
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/icon.svg">
<title>AquaTracker</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
<style>
:root {
  --deep:#0a2342; --mid:#1a6b8a; --surf:#4db8d4; --accent:#7fffd4;
  --bg:#f0f8ff; --card:#fff; --text:#1a2333; --muted:#6b7a8d;
  --ok:#3ab87a; --warn:#e8a838; --danger:#e05252;
  --r:8px; --sh:0 2px 8px rgba(0,0,0,.10);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.nav{background:var(--deep);color:#fff;display:flex;align-items:center;gap:12px;padding:0 16px;height:54px;position:sticky;top:0;z-index:100}
.logo{font-size:17px;font-weight:700;white-space:nowrap}
.nav-r{display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;padding:4px 0}
.nav select{background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.3);border-radius:6px;padding:5px 8px;font-size:13px;max-width:200px}
.nav select option{background:var(--deep)}
.tabs{display:flex;background:var(--mid);overflow-x:auto;padding:0 8px}
.prev-bar{background:#fef3d5;border-bottom:2px solid #e8a838;padding:8px 16px;font-size:13px;color:#7a4f00;display:flex;align-items:center;gap:10px}
.prev-bar strong{font-weight:700}
.prev-bar .btn-del-prev{background:none;border:1px solid #c8870a;color:#7a4f00;border-radius:4px;padding:3px 10px;font-size:12px;cursor:pointer}
.tab{background:none;border:none;color:rgba(255,255,255,.7);padding:11px 14px;font-size:13px;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent;transition:.15s;font-family:inherit}
.tab:hover{color:#fff}
.tab.on{color:#fff;border-bottom-color:var(--accent)}
.panel{display:none;padding:18px;max-width:980px;margin:0 auto}
.panel.on{display:block}
.card{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);padding:18px;margin-bottom:14px}
.ctitle{font-size:15px;font-weight:700;color:var(--deep);margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.frow{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:10px}
.fg{display:flex;flex-direction:column;gap:3px}
label{font-size:12px;color:var(--muted);font-weight:600}
input,select,textarea{border:1px solid #d0dae4;border-radius:6px;padding:7px 9px;font-size:13px;font-family:inherit;background:#fff;transition:border-color .15s;width:100%}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--surf)}
textarea{resize:vertical;min-height:60px}
.btn{border:none;border-radius:6px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;transition:opacity .15s;display:inline-flex;align-items:center;gap:5px;font-family:inherit}
.btn:hover{opacity:.85}
.bp{background:var(--surf);color:#fff}
.bd{background:var(--danger);color:#fff}
.bg{background:#eef2f6;color:var(--text)}
.bs{padding:4px 10px;font-size:12px}
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#f5f8fb;color:var(--muted);font-weight:600;text-align:left;padding:7px 9px;white-space:nowrap}
td{padding:7px 9px;border-top:1px solid #eef0f3;vertical-align:middle}
tr:hover td{background:#f9fbfc}
.pill{display:inline-block;border-radius:20px;padding:2px 9px;font-size:11px;font-weight:700}
.pok{background:#d4f5e5;color:#1a7a4a}
.pwarn{background:#fef3d5;color:#8a5a00}
.pdanger{background:#fde0e0;color:#a01818}
.pmuted{background:#eef0f3;color:var(--muted)}
.trow{border-left:4px solid transparent}
.tover{border-left-color:var(--danger)}
.tsoon{border-left-color:var(--warn)}
.tok{border-left-color:var(--ok)}
.chart-wrap{position:relative;height:260px;margin-top:12px}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;align-items:center;justify-content:center;padding:14px}
.overlay.on{display:flex}
.mbox{background:#fff;border-radius:var(--r);padding:22px;width:100%;max-width:520px;max-height:92vh;overflow-y:auto}
.mtitle{font-size:16px;font-weight:700;color:var(--deep);margin-bottom:14px}
.mact{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
.empty-s{text-align:center;padding:40px 16px;color:var(--muted)}
.empty-s h2{color:var(--deep);margin-bottom:8px;font-size:20px}
.empty-s p{margin-bottom:18px;font-size:14px}
.dgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:14px}
.scard{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);padding:14px 18px}
.slbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.sval{font-size:24px;font-weight:700;color:var(--deep);margin-top:2px}
.ssub{font-size:11px;color:var(--muted);margin-top:1px}
.cok{background:#d4f5e5;border-radius:var(--r);padding:10px 14px;color:#1a7a4a;font-weight:600;margin-bottom:12px;font-size:14px}
.cwarn{background:#fde0e0;border-radius:var(--r);padding:10px 14px;color:#a01818;font-weight:600;margin-bottom:12px;font-size:14px}
.cinfo{background:#e8f4fb;border-radius:var(--r);padding:10px 14px;color:#1a5a7a;font-weight:600;margin-bottom:12px;font-size:14px}
.emsg{color:var(--muted);font-size:13px;padding:4px 0}
.bl-bar{background:#eef0f3;border-radius:20px;height:10px;overflow:hidden;margin:6px 0 4px}
.bl-fill{height:100%;border-radius:20px;transition:width .3s}
.cfg-box{background:#f5f8fb;border-radius:6px;padding:8px 12px;font-size:12px;color:var(--muted);margin-top:6px}
.cfg-sep{height:1px;background:#eef0f3;margin:8px 0}
@media(max-width:600px){
  .logo{font-size:14px}
  .panel{padding:10px}
  .tab{padding:9px 10px;font-size:12px}
  .frow{grid-template-columns:1fr}
}
</style>
</head>
<body>

<nav class="nav">
  <span class="logo">&#x1F420; AquaTracker</span>
  <div class="nav-r">
    <select id="t_sel" title="Switch active tank"></select>
    <button class="btn bg bs" onclick="do_add_tank()">+ Tank</button>
    <button class="btn bg bs" onclick="do_add_preview()">&#x1F9EA; Preview</button>
    <button class="btn bg bs" onclick="do_export()">Export</button>
    <label class="btn bg bs" style="cursor:pointer">Import<input type="file" id="imp_file" accept=".json" style="display:none" onchange="do_import(this)"></label>
    <button class="btn bg bs" onclick="do_settings()">&#x2699; Units</button>
  </div>
</nav>

<div class="tabs">
  <button class="tab on" data-t="dash">Dashboard</button>
  <button class="tab" data-t="life">My Tank</button>
  <button class="tab" data-t="wlog">Logs</button>
  <button class="tab" data-t="maint">Maintenance</button>
  <button class="tab" data-t="recs">Recommendations</button>
  <button class="tab" data-t="tools">Toolkit</button>
  <button class="tab" data-t="howto">How To</button>
</div>

<div id="prev_bar" class="prev-bar" style="display:none">
  &#x1F9EA; <strong>Preview Tank</strong> &mdash; This tank is for testing only and is excluded from exports.
  <button class="btn-del-prev" onclick="do_del_preview()">Delete Preview</button>
</div>

<div id="p-dash"  class="panel on"></div>
<div id="p-life"  class="panel"></div>
<div id="p-wlog"  class="panel"></div>
<div id="p-maint" class="panel"></div>
<div id="p-recs"  class="panel"></div>
<div id="p-tools" class="panel"></div>
<div id="p-howto" class="panel"></div>

<div id="ov" class="overlay" onclick="if(event.target===this)cm()">
  <div class="mbox" id="mb"></div>
</div>

<script>
// ===== SPECIES DATABASE (63 species) =====
// bioload: 1=very low, 2=low, 3=medium, 4=high, 5=very high
// level: Beginner / Intermediate / Advanced
// hard_reason: why non-beginners should research first (omit for Beginner)
var SP = {
  betta:             {name:'Betta',              tmin:72,tmax:86,pmin:6.0,pmax:8.0,gmin:1, gmax:15,bioload:2,size_in:3,  min_gal:5,  level:'Beginner',     note:'Keep males alone or in a sorority.',
    incompat:{betta:'Two male bettas fight to the death.',guppy:'Bettas attack guppies for their long flowing fins.',tiger_barb:'Tiger barbs will relentlessly nip betta fins.',serpae_tetra:'Serpae tetras are fin nippers — dangerous for a betta.',black_skirt_tetra:'Black skirt tetras are known fin nippers.',blue_gourami:'Blue gouramis often bully and injure bettas.',dwarf_puffer:'Dwarf puffers bite at betta fins.'}},
  neon_tetra:        {name:'Neon Tetra',          tmin:70,tmax:77,pmin:4.0,pmax:7.5,gmin:1, gmax:12,bioload:1,size_in:1.5,min_gal:10, level:'Beginner',     note:'School of 6+. Sensitive to nitrates.'},
  cardinal_tetra:    {name:'Cardinal Tetra',      tmin:73,tmax:79,pmin:4.5,pmax:7.5,gmin:1, gmax:12,bioload:1,size_in:2,  min_gal:20, level:'Intermediate', hard_reason:'More sensitive to water chemistry than neon tetras. Needs consistently soft, acidic water.',note:'School of 6+. Similar to neon tetra.'},
  guppy:             {name:'Guppy',               tmin:63,tmax:82,pmin:7.0,pmax:8.5,gmin:8, gmax:30,bioload:2,size_in:2,  min_gal:10, level:'Beginner',     note:'Hardy livebearer. Prefers hard water.'},
  molly:             {name:'Molly',               tmin:72,tmax:82,pmin:7.0,pmax:8.5,gmin:15,gmax:35,bioload:3,size_in:4,  min_gal:20, level:'Beginner',     note:'Needs hard water. Shimmies in soft water.'},
  platy:             {name:'Platy',               tmin:68,tmax:79,pmin:7.0,pmax:8.2,gmin:14,gmax:30,bioload:2,size_in:2.5,min_gal:15, level:'Beginner',     note:'Hardy livebearer. Avoid acidic water.'},
  corydoras:         {name:'Corydoras',           tmin:70,tmax:81,pmin:6.0,pmax:8.0,gmin:2, gmax:15,bioload:2,size_in:2.5,min_gal:20, level:'Beginner',     note:'Group of 4+. Fine sand substrate needed.'},
  angelfish:         {name:'Angelfish',           tmin:75,tmax:86,pmin:6.0,pmax:7.4,gmin:0, gmax:15,bioload:3,size_in:6,  min_gal:30, level:'Intermediate', hard_reason:'Grows large (6 in body, taller with fins). May eat small fish. Needs tall tank.',note:'Tall tank needed. May eat small fish.',
    incompat:{tiger_barb:'Tiger barbs nip angelfish flowing fins.',serpae_tetra:'Serpae tetras nip angelfish fins.',black_skirt_tetra:'Black skirt tetras nip angelfish fins.',neon_tetra:'Angelfish eat small tetras in the wild — risky pairing.',cardinal_tetra:'Angelfish eat small tetras in the wild.',ember_tetra:'Angelfish will eat tiny ember tetras.',chili_rasbora:'Angelfish will eat micro fish like chili rasboras.',guppy:'Angelfish eat guppies — both occupy mid-water and angels grow too large.',endlers_livebearer:'Angelfish eat small livebearers like endlers.',cherry_shrimp:'Angelfish may eat cherry shrimp, especially smaller ones.',ghost_shrimp:'Angelfish eat ghost shrimp.'}},
  discus:            {name:'Discus',              tmin:80,tmax:86,pmin:4.5,pmax:7.0,gmin:1, gmax:8, bioload:4,size_in:8,  min_gal:55, level:'Advanced',     hard_reason:'Requires expert-level care. Extremely sensitive to all water parameters. Daily water changes often needed.',note:'Expert level. Needs pristine water quality.'},
  ram_cichlid:       {name:'Ram Cichlid',         tmin:81,tmax:86,pmin:4.0,pmax:7.0,gmin:1, gmax:10,bioload:2,size_in:3,  min_gal:20, level:'Intermediate', hard_reason:'Very sensitive to water quality and temperature drops. Not forgiving of new-tank mistakes.',note:'Very sensitive to water quality issues.'},
  african_cichlid:   {name:'African Cichlid',     tmin:75,tmax:81,pmin:7.5,pmax:8.5,gmin:12,gmax:25,bioload:4,size_in:5,  min_gal:55, level:'Intermediate', hard_reason:'Aggressive. Requires alkaline hard water and specific rockwork setup. Overstocking is deliberate.',note:'Alkaline hard water essential.',
    incompat:{neon_tetra:'African cichlids eat small tetras.',cardinal_tetra:'African cichlids eat small tetras.',guppy:'African cichlids attack and eat guppies.',corydoras:'African cichlids harass and injure corydoras.',discus:'Opposite water needs — discus need soft acid water, cichlids need hard alkaline.',angelfish:'African cichlids are too aggressive for angelfish.',ram_cichlid:'Different water chemistry — cichlids need alkaline hard water, rams need soft acid.',betta:'African cichlids are too aggressive for bettas.',cherry_shrimp:'African cichlids eat shrimp.',amano_shrimp:'African cichlids eat shrimp.',ghost_shrimp:'African cichlids eat shrimp.',crystal_shrimp:'African cichlids eat shrimp.',blue_velvet_shrimp:'African cichlids eat shrimp.',snowball_shrimp:'African cichlids eat shrimp.',bamboo_shrimp:'African cichlids eat shrimp.',ember_tetra:'African cichlids eat small fish.',chili_rasbora:'African cichlids eat micro fish.',harlequin_rasbora:'African cichlids eat small fish.',zebra_danio:'African cichlids attack danios.',endlers_livebearer:'African cichlids eat small livebearers.',honey_gourami:'African cichlids are too aggressive for honey gouramis.',dwarf_gourami:'African cichlids are too aggressive for dwarf gouramis.',panda_corydoras:'African cichlids harass corydoras.',pygmy_corydoras:'African cichlids eat tiny corydoras.',otocinclus:'African cichlids harass and injure otocinclus.'}},
  goldfish:          {name:'Goldfish',            tmin:50,tmax:72,pmin:7.0,pmax:8.0,gmin:6, gmax:16,bioload:5,size_in:12, min_gal:40, level:'Beginner',     note:'Cold water. Very high bioload. Needs large tank. Not compatible with tropical fish.'},
  cherry_shrimp:     {name:'Cherry Shrimp',       tmin:65,tmax:80,pmin:6.2,pmax:8.0,gmin:4, gmax:8, bioload:1,size_in:1.5,min_gal:5,  level:'Beginner',     inv:true, note:'Forgiving. Avoid copper-based medications.'},
  crystal_shrimp:    {name:'Crystal Shrimp',      tmin:62,tmax:72,pmin:5.5,pmax:6.5,gmin:4, gmax:6, bioload:1,size_in:1.2,min_gal:10, level:'Advanced',     inv:true, hard_reason:'Requires RO water with remineralizer. Narrow pH and GH range. Very sensitive to any parameter shift.',note:'Advanced keeper. RO water + remineralizer.'},
  hillstream_loach:  {name:'Hillstream Loach',    tmin:62,tmax:72,pmin:6.5,pmax:7.5,gmin:4, gmax:8, bioload:1,size_in:3,  min_gal:20, level:'Intermediate', hard_reason:'Needs very high flow, strong oxygenation, and cooler water. Standard setups do not suit them.',note:'Needs very high flow and oxygenation.'},
  nerite_snail:      {name:'Nerite Snail',        tmin:72,tmax:82,pmin:6.5,pmax:8.0,gmin:6, gmax:15,bioload:1,size_in:1,  min_gal:5,  level:'Beginner',     inv:true, note:'Great algae eater. Needs calcium for shell.'},
  mystery_snail:     {name:'Mystery Snail',       tmin:72,tmax:82,pmin:6.5,pmax:8.0,gmin:5, gmax:15,bioload:1,size_in:2,  min_gal:5,  level:'Beginner',     inv:true, note:'Peaceful. Supplement calcium for shell health.'},
  zebra_danio:       {name:'Zebra Danio',         tmin:64,tmax:75,pmin:6.0,pmax:8.0,gmin:2, gmax:20,bioload:2,size_in:2,  min_gal:10, level:'Beginner',     note:'Active schooler of 6+. Very hardy beginner fish.'},
  harlequin_rasbora: {name:'Harlequin Rasbora',   tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:1, gmax:12,bioload:1,size_in:2,  min_gal:10, level:'Beginner',     note:'School of 6+. Peaceful community fish.'},
  rummy_nose_tetra:  {name:'Rummy Nose Tetra',    tmin:75,tmax:82,pmin:5.5,pmax:7.0,gmin:1, gmax:10,bioload:1,size_in:2,  min_gal:20, level:'Intermediate', hard_reason:'Red nose fades quickly with any water quality issue. Sensitive to nitrates and pH. Needs aged, soft water.',note:'School of 8+. Red head intensifies in good water.'},
  black_skirt_tetra: {name:'Black Skirt Tetra',   tmin:70,tmax:81,pmin:6.0,pmax:7.5,gmin:4, gmax:15,bioload:2,size_in:2.5,min_gal:20, level:'Beginner',     note:'School of 6+. May nip long-finned tankmates.',
    incompat:{betta:'Black skirt tetras nip long fins — dangerous for bettas.',guppy:'Black skirt tetras target guppy tails.',angelfish:'Black skirt tetras may nip angelfish fins.'}},
  dwarf_gourami:     {name:'Dwarf Gourami',       tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:4, gmax:10,bioload:2,size_in:3.5,min_gal:15, level:'Beginner',     note:'Males territorial with each other. Peaceful otherwise.'},
  kuhli_loach:       {name:'Kuhli Loach',         tmin:74,tmax:86,pmin:5.5,pmax:7.0,gmin:1, gmax:10,bioload:2,size_in:4,  min_gal:20, level:'Beginner',     note:'Nocturnal. Needs hiding spots and soft substrate.'},
  bristlenose_pleco: {name:'Bristlenose Pleco',   tmin:73,tmax:81,pmin:6.5,pmax:7.5,gmin:2, gmax:20,bioload:4,size_in:5,  min_gal:30, level:'Beginner',     note:'Great algae eater. Needs driftwood in diet.'},
  otocinclus:        {name:'Otocinclus',          tmin:72,tmax:79,pmin:6.0,pmax:7.5,gmin:4, gmax:15,bioload:1,size_in:2,  min_gal:10, level:'Intermediate', hard_reason:'Often starve if insufficient algae. Sensitive initially. Keep in groups of 4+.',note:'Groups of 4+. Feeds on soft algae and blanched veg.'},
  ember_tetra:       {name:'Ember Tetra',         tmin:73,tmax:84,pmin:5.0,pmax:7.0,gmin:1, gmax:10,bioload:1,size_in:0.8,min_gal:10, level:'Beginner',     note:'Tiny nano fish. School of 8+. Loves planted tanks.'},
  chili_rasbora:     {name:'Chili Rasbora',       tmin:68,tmax:82,pmin:4.0,pmax:7.0,gmin:1, gmax:8, bioload:1,size_in:0.7,min_gal:5,  level:'Intermediate', hard_reason:'Tiny fish needing soft, acidic water. Sensitive to hard water and high pH.',note:'Micro fish (0.7 in). School of 10+. Nano tank gem.'},
  white_cloud_minnow:{name:'White Cloud Minnow',  tmin:59,tmax:72,pmin:6.0,pmax:8.0,gmin:5, gmax:19,bioload:1,size_in:1.5,min_gal:10, level:'Beginner',     note:'Cold water fish. Do not keep with tropical species.'},
  swordtail:         {name:'Swordtail',           tmin:65,tmax:82,pmin:7.0,pmax:8.3,gmin:12,gmax:30,bioload:3,size_in:5,  min_gal:20, level:'Beginner',     note:'Active jumper - use a lid. Males aggressive together.'},
  tiger_barb:        {name:'Tiger Barb',          tmin:68,tmax:79,pmin:6.0,pmax:7.0,gmin:5, gmax:15,bioload:2,size_in:3,  min_gal:20, level:'Intermediate', hard_reason:'Notorious fin nippers. Must be kept in large groups (8+) or they terrorise tankmates.',note:'Semi-aggressive fin nipper. Keep 8+ to spread chasing.',
    incompat:{betta:'Tiger barbs will relentlessly nip betta fins.',angelfish:'Tiger barbs nip angelfish flowing fins.',guppy:'Tiger barbs target guppy tails.',endlers_livebearer:'Tiger barbs nip fins of endler livebearers.',dwarf_gourami:'Tiger barbs nip the soft fins of dwarf gouramis.',honey_gourami:'Tiger barbs nip honey gourami fins.',pearl_gourami:'Tiger barbs nip pearl gourami fins.',swordtail:'Tiger barbs target the long tail fins of swordtails.'}},
  endlers_livebearer:{name:'Endler Livebearer',   tmin:72,tmax:82,pmin:6.5,pmax:8.5,gmin:10,gmax:30,bioload:1,size_in:1.5,min_gal:5,  level:'Beginner',     note:'Hardy livebearer. Males are brilliantly colored.'},
  electric_blue_ram: {name:'Electric Blue Ram',   tmin:78,tmax:85,pmin:5.0,pmax:7.0,gmin:1, gmax:8, bioload:2,size_in:3,  min_gal:20, level:'Advanced',     hard_reason:'Selectively bred variety with weaker immunity. Extremely sensitive to temperature swings and poor water quality.',note:'Very temperature sensitive. Needs stable warm water.'},
  boesemani_rainbow: {name:'Boesemani Rainbow',   tmin:75,tmax:86,pmin:7.0,pmax:8.0,gmin:9, gmax:19,bioload:3,size_in:4.5,min_gal:55, level:'Intermediate', hard_reason:'Grows to 4.5 inches and needs a school of 6+ in a 55g+ tank. Specific water chemistry needed.',note:'School of 6+. Active swimmer. Grows to 4.5 inches.'},
  amano_shrimp:      {name:'Amano Shrimp',        tmin:65,tmax:80,pmin:6.0,pmax:8.0,gmin:4, gmax:12,bioload:1,size_in:2,  min_gal:10, level:'Beginner',     inv:true, note:'Best algae-eating shrimp. Safe with most fish.'},
  panda_corydoras:   {name:'Panda Corydoras',     tmin:68,tmax:77,pmin:6.0,pmax:7.4,gmin:2, gmax:12,bioload:1,size_in:2,  min_gal:15, level:'Beginner',     note:'Smaller cory species. Cooler water. Group of 4+.'},
  red_cherry_barb:   {name:'Red Cherry Barb',     tmin:72,tmax:79,pmin:6.0,pmax:7.5,gmin:5, gmax:19,bioload:2,size_in:2,  min_gal:20, level:'Beginner',     note:'Peaceful despite the barb name. Males are bright red.'},
  honey_gourami:     {name:'Honey Gourami',       tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:4, gmax:10,bioload:1,size_in:2,  min_gal:10, level:'Beginner',     note:'Very peaceful and shy. Good beginner community fish.'},
  // --- Additional species ---
  oscar:                {name:'Oscar',                 tmin:74,tmax:81,pmin:6.0,pmax:8.0,gmin:5, gmax:20,bioload:5,size_in:14, min_gal:75,  level:'Intermediate', hard_reason:'Grows to 14 inches and produces enormous waste. Needs 75g+ and frequent large water changes.',note:'Highly intelligent. Very messy feeder. Needs 75g minimum.',
    incompat:{neon_tetra:'Oscars eat small fish — neons are prey.',cardinal_tetra:'Oscars eat small tetras.',guppy:'Oscars eat guppies.',corydoras:'Oscars often eat or injure corydoras.',cherry_shrimp:'Oscars eat shrimp.',amano_shrimp:'Oscars eat shrimp.',ghost_shrimp:'Oscars eat shrimp.',angelfish:'Oscars are too large and aggressive for angels.',discus:'Oscars are too aggressive and messy for discus.',ember_tetra:'Oscars eat tiny fish like ember tetras.',chili_rasbora:'Oscars eat micro fish.',endlers_livebearer:'Oscars eat small livebearers.',harlequin_rasbora:'Oscars eat small rasboras.',zebra_danio:'Oscars eat small fish — danios are prey.',rummy_nose_tetra:'Oscars eat small tetras.',black_skirt_tetra:'Oscars eat tetras.',lemon_tetra:'Oscars eat small tetras.',glowlight_tetra:'Oscars eat small tetras.',serpae_tetra:'Oscars eat small tetras.',honey_gourami:'Oscars are too large and aggressive for honey gouramis.',dwarf_gourami:'Oscars are too large and aggressive for dwarf gouramis.',sparkling_gourami:'Oscars eat tiny fish like sparkling gouramis.',crystal_shrimp:'Oscars eat shrimp.',blue_velvet_shrimp:'Oscars eat shrimp.',snowball_shrimp:'Oscars eat shrimp.',bamboo_shrimp:'Oscars eat shrimp.',nerite_snail:'Oscars harass and injure snails.',mystery_snail:'Oscars harass and injure snails.',otocinclus:'Oscars eat small catfish like otocinclus.',african_dwarf_frog:'Oscars eat African dwarf frogs.',panda_corydoras:'Oscars eat or injure small corydoras.',pygmy_corydoras:'Oscars eat tiny corydoras.',celestial_pearl_danio:'Oscars eat nano fish like CPDs.',red_cherry_barb:'Oscars eat small fish like cherry barbs.'}},
  convict_cichlid:      {name:'Convict Cichlid',       tmin:68,tmax:82,pmin:6.5,pmax:8.0,gmin:9, gmax:20,bioload:3,size_in:5,  min_gal:30,  level:'Intermediate', hard_reason:'Extremely aggressive, especially when breeding. Will attack fish twice its size. Best as a species pair.',note:'Hardy but aggressive. Prolific breeder.',
    incompat:{neon_tetra:'Convicts are extremely aggressive — will kill small tetras.',cardinal_tetra:'Convicts will kill small tetras.',guppy:'Convicts attack and kill guppies.',molly:'Convicts are too aggressive for mollies.',platy:'Convicts are too aggressive for platys.',corydoras:'Convicts harass and injure corydoras.',honey_gourami:'Convicts are too aggressive for honey gouramis.',cherry_shrimp:'Convicts eat shrimp.',amano_shrimp:'Convicts eat shrimp.',angelfish:'Convicts are extremely aggressive — will attack and injure angelfish.',betta:'Convicts will attack and injure bettas.',dwarf_gourami:'Convicts are too aggressive for dwarf gouramis.',pearl_gourami:'Convicts are too aggressive for pearl gouramis.',sparkling_gourami:'Convicts eat tiny fish like sparkling gouramis.',ember_tetra:'Convicts will kill small fish like ember tetras.',chili_rasbora:'Convicts will kill micro fish.',harlequin_rasbora:'Convicts are too aggressive for rasboras.',zebra_danio:'Convicts are too aggressive for danios.',rummy_nose_tetra:'Convicts will kill small tetras.',lemon_tetra:'Convicts attack small tetras.',glowlight_tetra:'Convicts attack small tetras.',black_skirt_tetra:'Convicts are too aggressive for tetras.',serpae_tetra:'Convicts attack all small fish.',endlers_livebearer:'Convicts attack small livebearers.',swordtail:'Convicts are too aggressive for swordtails.',otocinclus:'Convicts harass and injure otocinclus.',ghost_shrimp:'Convicts eat shrimp.',blue_velvet_shrimp:'Convicts eat shrimp.',snowball_shrimp:'Convicts eat shrimp.',crystal_shrimp:'Convicts eat shrimp.',panda_corydoras:'Convicts harass and injure corydoras.',pygmy_corydoras:'Convicts eat or injure tiny corydoras.',red_cherry_barb:'Convicts are too aggressive for small barbs.',african_dwarf_frog:'Convicts attack African dwarf frogs.'}},
  firemouth_cichlid:    {name:'Firemouth Cichlid',     tmin:75,tmax:86,pmin:6.5,pmax:8.0,gmin:5, gmax:25,bioload:3,size_in:5,  min_gal:30,  level:'Intermediate', hard_reason:'Semi-aggressive, especially when breeding. Pair bond strongly and defend territory vigorously.',note:'Brilliant red throat display. Semi-aggressive when breeding.',
    incompat:{neon_tetra:'Firemouths eat small tetras, especially during breeding.',cardinal_tetra:'Firemouths eat small tetras.',ember_tetra:'Firemouths eat tiny fish.',chili_rasbora:'Firemouths eat micro fish.',cherry_shrimp:'Firemouths eat shrimp.',amano_shrimp:'Firemouths eat shrimp.',ghost_shrimp:'Firemouths eat shrimp.',blue_velvet_shrimp:'Firemouths eat shrimp.',snowball_shrimp:'Firemouths eat shrimp.',otocinclus:'Firemouths harass and may injure otocinclus.',pygmy_corydoras:'Firemouths eat tiny corydoras.',celestial_pearl_danio:'Firemouths eat nano fish.'}},
  clown_loach:          {name:'Clown Loach',           tmin:77,tmax:86,pmin:6.0,pmax:7.5,gmin:5, gmax:12,bioload:3,size_in:12, min_gal:75,  level:'Intermediate', hard_reason:'Sold small but grows to 12 inches over years. Needs a school of 5+ and a large tank long term.',note:'Grows very large slowly. Great snail eater. School of 5+.',
    incompat:{nerite_snail:'Clown loaches eat snails — nerites will not survive.',mystery_snail:'Clown loaches eat snails.',assassin_snail:'Clown loaches eat snails.',trumpet_snail:'Clown loaches eat snails.',ramshorn_snail:'Clown loaches eat snails.'}},
  yoyo_loach:           {name:'Yo-yo Loach',           tmin:75,tmax:86,pmin:6.0,pmax:7.5,gmin:3, gmax:12,bioload:2,size_in:3,  min_gal:20,  level:'Beginner',     note:'Active snail eater. Playful and social. Keep in groups of 4+.',
    incompat:{nerite_snail:'Yo-yo loaches eat snails.',mystery_snail:'Yo-yo loaches eat snails.',assassin_snail:'Yo-yo loaches eat snails.',trumpet_snail:'Yo-yo loaches eat snails.',ramshorn_snail:'Yo-yo loaches eat snails.'}},
  siamese_algae_eater:  {name:'Siamese Algae Eater',   tmin:75,tmax:79,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:2,size_in:5,  min_gal:30,  level:'Beginner',     note:'One of the few fish that eats black beard algae. Peaceful. Best in schools or alone.'},
  red_tail_shark:       {name:'Red-tail Black Shark',  tmin:72,tmax:79,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:2,size_in:6,  min_gal:30,  level:'Intermediate', hard_reason:'Highly territorial with own kind and similar-shaped fish. Only one per tank. Aggression increases with age.',note:'Only one per tank. Territorial with similar-shaped fish.',
    incompat:{red_tail_shark:'Two red-tail sharks cannot share a tank — the dominant one will bully or kill the other.',flying_fox:'Red-tail sharks aggressively defend territory against similarly shaped fish like the flying fox.',siamese_algae_eater:'Red-tail sharks may persistently chase siamese algae eaters due to their similar elongated shape.'}},
  pearl_gourami:        {name:'Pearl Gourami',         tmin:77,tmax:82,pmin:6.0,pmax:8.0,gmin:5, gmax:25,bioload:2,size_in:4.5,min_gal:30,  level:'Beginner',     note:'Peaceful and beautiful. One of the best community gouramis. Hardy.'},
  blue_gourami:         {name:'Blue Gourami',          tmin:72,tmax:82,pmin:6.0,pmax:8.5,gmin:5, gmax:35,bioload:2,size_in:5,  min_gal:20,  level:'Beginner',     note:'Very hardy and adaptable. Males can be aggressive with each other. Keep one male.',
    incompat:{betta:'Blue gouramis often bully and injure bettas.'}},
  sparkling_gourami:    {name:'Sparkling Gourami',     tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:5, gmax:15,bioload:1,size_in:1.5,min_gal:10,  level:'Beginner',     note:'Tiny gourami that makes audible clicking sounds. Peaceful nano fish.'},
  congo_tetra:          {name:'Congo Tetra',           tmin:73,tmax:82,pmin:6.0,pmax:7.5,gmin:3, gmax:18,bioload:2,size_in:3.5,min_gal:30,  level:'Beginner',     note:'Large, spectacular tetra. Males develop flowing fins. School of 6+.'},
  serpae_tetra:         {name:'Serpae Tetra',          tmin:72,tmax:79,pmin:5.5,pmax:7.5,gmin:5, gmax:15,bioload:1,size_in:1.5,min_gal:20,  level:'Intermediate', hard_reason:'Notorious fin nippers with slow or long-finned fish. Must be in large groups (8+) to reduce nipping behavior.',note:'School of 8+. Do not keep with slow or long-finned fish.',
    incompat:{betta:'Serpae tetras are known fin nippers — dangerous for bettas.',angelfish:'Serpae tetras nip angelfish fins.',guppy:'Serpae tetras target guppy tails.',endlers_livebearer:'Serpae tetras nip fins of endler livebearers.'}},
  lemon_tetra:          {name:'Lemon Tetra',           tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:5, gmax:20,bioload:1,size_in:1.5,min_gal:15,  level:'Beginner',     note:'Peaceful schooler of 6+. Yellow color intensifies in good water.'},
  glowlight_tetra:      {name:'Glowlight Tetra',       tmin:72,tmax:80,pmin:5.5,pmax:7.5,gmin:4, gmax:15,bioload:1,size_in:1.5,min_gal:10,  level:'Beginner',     note:'Peaceful schooler of 6+. Bright orange stripe glows under aquarium lighting.'},
  rosy_barb:            {name:'Rosy Barb',             tmin:64,tmax:75,pmin:6.5,pmax:7.5,gmin:5, gmax:19,bioload:2,size_in:4,  min_gal:30,  level:'Beginner',     note:'Cooler water barb. Active schooler of 6+. Males turn rosy-red when breeding.'},
  pygmy_corydoras:      {name:'Pygmy Corydoras',       tmin:68,tmax:77,pmin:6.0,pmax:7.8,gmin:2, gmax:15,bioload:1,size_in:1,  min_gal:10,  level:'Beginner',     note:'Tiny cory (1 in). Mid-water swimmer unlike most corys. Group of 8+.'},
  neon_rainbowfish:     {name:'Neon Rainbowfish',      tmin:72,tmax:82,pmin:7.0,pmax:8.0,gmin:8, gmax:18,bioload:2,size_in:2.5,min_gal:20,  level:'Beginner',     note:'Vivid red and blue coloration. Active schooler of 6+. Easy to keep.'},
  celestial_pearl_danio:{name:'Celestial Pearl Danio', tmin:73,tmax:79,pmin:6.5,pmax:7.5,gmin:2, gmax:15,bioload:1,size_in:1,  min_gal:10,  level:'Intermediate', hard_reason:'Shy and easily outcompeted for food. Needs a calm, planted nano setup away from boisterous fish.',note:'Stunning nano fish. Calm planted tank only. School of 8+.'},
  pearl_danio:          {name:'Pearl Danio',           tmin:64,tmax:77,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:1,size_in:2,  min_gal:15,  level:'Beginner',     note:'Hardy active schooler. Very forgiving beginner fish. Group of 6+.'},
  african_dwarf_frog:   {name:'African Dwarf Frog',    tmin:72,tmax:82,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:1,size_in:1.5,min_gal:10,  level:'Beginner',     note:'Fully aquatic amphibian. Peaceful. Must surface for air. Avoid strong flow.'},
  dwarf_puffer:         {name:'Dwarf Puffer',          tmin:74,tmax:82,pmin:6.5,pmax:7.5,gmin:5, gmax:15,bioload:2,size_in:1,  min_gal:5,   level:'Advanced',     hard_reason:'Nips fins of any tankmate including its own kind. Needs live snails or frozen foods — will not eat dry food.',note:'Keep alone or in species tank. Needs live snails or frozen food.',
    incompat:{betta:'Dwarf puffers bite betta fins.',guppy:'Dwarf puffers nip guppy fins and tails.',angelfish:'Dwarf puffers bite at fins.',tiger_barb:'Both species are aggressive — conflict is inevitable.',cherry_shrimp:'Puffers eat shrimp.',amano_shrimp:'Puffers eat shrimp.',ghost_shrimp:'Puffers eat shrimp.',nerite_snail:'Puffers eat snails.',mystery_snail:'Puffers eat snails.'}},
  scarlet_badis:        {name:'Scarlet Badis',         tmin:72,tmax:82,pmin:6.5,pmax:7.5,gmin:5, gmax:15,bioload:1,size_in:0.8,min_gal:5,   level:'Intermediate', hard_reason:'Refuses dry food in most cases. Needs live or frozen micro foods. Males highly territorial with each other.',note:'Micro fish. Needs live or frozen food. One male per tank.'},
  clown_killifish:      {name:'Clown Killifish',       tmin:72,tmax:79,pmin:5.5,pmax:7.0,gmin:1, gmax:10,bioload:1,size_in:1.5,min_gal:5,   level:'Intermediate', hard_reason:'Needs soft, slightly acidic water. Surface-dwelling and will jump — a tight-fitting lid is essential.',note:'Beautiful surface fish. Must have a tight lid — it jumps.'},
  peacock_cichlid:      {name:'Peacock Cichlid',       tmin:76,tmax:82,pmin:7.8,pmax:8.5,gmin:10,gmax:25,bioload:3,size_in:6,  min_gal:55,  level:'Advanced',     hard_reason:'Requires Lake Malawi water chemistry: very alkaline and hard. Still shows cichlid territorial behavior.',note:'Stunning Lake Malawi cichlid. Less aggressive than mbuna.',
    incompat:{neon_tetra:'Peacock cichlids eat small tetras.',cardinal_tetra:'Peacock cichlids eat small tetras.',ember_tetra:'Peacock cichlids eat tiny fish.',chili_rasbora:'Peacock cichlids eat micro fish.',guppy:'Peacock cichlids eat guppies.',endlers_livebearer:'Peacock cichlids eat small livebearers.',cherry_shrimp:'Peacock cichlids eat shrimp.',amano_shrimp:'Peacock cichlids eat shrimp.',ghost_shrimp:'Peacock cichlids eat shrimp.',blue_velvet_shrimp:'Peacock cichlids eat shrimp.',discus:'Opposite water needs — discus need soft acidic water, peacocks need hard alkaline.',ram_cichlid:'Opposite water needs — rams need soft acidic water, peacocks need hard alkaline.'}},
  flying_fox:           {name:'Flying Fox',            tmin:72,tmax:79,pmin:6.0,pmax:7.5,gmin:5, gmax:15,bioload:2,size_in:5,  min_gal:30,  level:'Intermediate', hard_reason:'Territorial with own kind and similar-shaped fish. Often confused with false siamese algae eater which is more aggressive.',note:'Good algae eater. One per tank unless very large.',
    incompat:{flying_fox:'Flying foxes are territorial with each other — keep only one unless the tank is very large (100g+).',red_tail_shark:'Flying foxes and red-tail sharks compete aggressively for the same territory.'}},
  bolivian_ram:         {name:'Bolivian Ram',          tmin:72,tmax:79,pmin:6.5,pmax:7.5,gmin:5, gmax:15,bioload:2,size_in:3.5,min_gal:20,  level:'Beginner',     note:'Hardier and more forgiving than German Blue Ram. Great beginner cichlid.'},
  // --- Shrimp ---
  ghost_shrimp:         {name:'Ghost Shrimp',          tmin:65,tmax:80,pmin:6.5,pmax:8.0,gmin:3, gmax:15,bioload:1,size_in:1.5,min_gal:5,   level:'Beginner',     inv:true, note:'Very cheap and hardy. Great tank cleaners. Avoid copper-based meds.'},
  blue_velvet_shrimp:   {name:'Blue Velvet Shrimp',    tmin:65,tmax:80,pmin:6.5,pmax:8.0,gmin:4, gmax:12,bioload:1,size_in:1.5,min_gal:5,   level:'Beginner',     inv:true, note:'Color variant of Neocaridina. Same easy care as Cherry Shrimp.'},
  snowball_shrimp:      {name:'Snowball Shrimp',        tmin:65,tmax:80,pmin:6.5,pmax:8.0,gmin:4, gmax:12,bioload:1,size_in:1.5,min_gal:5,   level:'Beginner',     inv:true, note:'White Neocaridina variant. Beginner-friendly. Avoid copper meds.'},
  bamboo_shrimp:        {name:'Bamboo Shrimp',          tmin:72,tmax:82,pmin:6.5,pmax:7.5,gmin:3, gmax:12,bioload:1,size_in:3,  min_gal:20,  level:'Intermediate', inv:true, hard_reason:'Filter feeder — needs good flow and fine particles in the water. Will starve without regular feeding of powdered food.',note:'Fan-feeds from the current. Needs good water flow and fine food.'},
  // --- Snails ---
  assassin_snail:       {name:'Assassin Snail',        tmin:70,tmax:80,pmin:7.0,pmax:8.0,gmin:5, gmax:15,bioload:1,size_in:1,  min_gal:10,  level:'Beginner',     inv:true, note:'Hunts and eats pest snails. Peaceful with fish and shrimp.'},
  trumpet_snail:        {name:'Malaysian Trumpet Snail',tmin:65,tmax:82,pmin:7.0,pmax:8.0,gmin:5, gmax:20,bioload:1,size_in:1,  min_gal:5,   level:'Beginner',     inv:true, note:'Burrows in substrate and aerates it. Multiplies quickly if overfed.'},
  ramshorn_snail:       {name:'Ramshorn Snail',         tmin:65,tmax:82,pmin:7.0,pmax:8.0,gmin:5, gmax:15,bioload:1,size_in:1,  min_gal:5,   level:'Beginner',     inv:true, note:'Eats algae and decaying plant matter. Can multiply rapidly if overfed.'},
  // --- Turtles ---
  red_eared_slider:     {name:'Red-eared Slider',       tmin:72,tmax:80,pmin:6.5,pmax:8.0,gmin:5, gmax:20,bioload:5,size_in:12, min_gal:120, level:'Intermediate', eats_fish:true, hard_reason:'Grows to 10-12 inches and needs 120g+ as an adult. Requires a dry basking area with UVB lighting, a powerful external filter, and regular large water changes. Cannot be kept with fish.',note:'Semi-aquatic. Needs basking dock + UVB light. Very heavy bioload.'},
  indian_flapshell:     {name:'Indian Flapshell Turtle',tmin:72,tmax:82,pmin:6.5,pmax:8.0,gmin:5, gmax:20,bioload:4,size_in:9,  min_gal:75,  level:'Intermediate', eats_fish:true, hard_reason:'Soft-shelled turtle that can bite. Needs deep water, a basking area, and a powerful filter. Omnivore needing varied diet.',note:'Soft shell. Semi-aquatic. Needs deep water and basking area.'},
  painted_turtle:       {name:'Painted Turtle',         tmin:60,tmax:75,pmin:6.5,pmax:8.0,gmin:5, gmax:20,bioload:4,size_in:7,  min_gal:75,  level:'Intermediate', eats_fish:true, hard_reason:'Prefers cooler water. Needs basking area with UVB, powerful filtration, and varied diet including live food and vegetation.',note:'Cooler water turtle. Needs basking area and UVB lighting.'},
};
// assign livestock types (override per species, default Fish)
['cherry_shrimp','crystal_shrimp','amano_shrimp','ghost_shrimp','blue_velvet_shrimp','snowball_shrimp','bamboo_shrimp'].forEach(function(k){ if(SP[k]) SP[k].type='Shrimp'; });
['nerite_snail','mystery_snail','assassin_snail','trumpet_snail','ramshorn_snail'].forEach(function(k){ if(SP[k]) SP[k].type='Snail'; });
['african_dwarf_frog'].forEach(function(k){ if(SP[k]) SP[k].type='Amphibian'; });
['red_eared_slider','indian_flapshell','painted_turtle'].forEach(function(k){ if(SP[k]) SP[k].type='Turtle'; });
Object.keys(SP).forEach(function(k){ if(!SP[k].type) SP[k].type='Fish'; });

// ===== PLANT DATABASE (20 species) =====
var PL = {
  // ── Anubias ──
  anubias:               {group:'Anubias',            name:'Anubias (Generic)',         tmin:60,tmax:84,light:'Low',   co2:false,diff:'Easy',    note:'Attach to hardscape. Burying rhizome causes rot.'},
  anubias_barteri:       {group:'Anubias',            name:'Anubias Barteri',           tmin:60,tmax:84,light:'Low',   co2:false,diff:'Easy',    note:'Large oval leaves. Robust and undemanding. Attach to hardscape.'},
  anubias_nana:          {group:'Anubias',            name:'Anubias Nana',              tmin:60,tmax:84,light:'Low',   co2:false,diff:'Easy',    note:'Most popular Anubias. Compact and very hardy. Great for midground.'},
  anubias_nana_petite:   {group:'Anubias',            name:'Anubias Nana Petite',       tmin:60,tmax:84,light:'Low',   co2:false,diff:'Easy',    note:'Tiny variant of Nana. Ideal for nano tanks and small driftwood.'},
  anubias_coffeefolia:   {group:'Anubias',            name:'Anubias Coffeefolia',       tmin:60,tmax:84,light:'Low',   co2:false,diff:'Easy',    note:'Deeply ridged dark leaves with brown new growth. Striking midground.'},
  anubias_congensis:     {group:'Anubias',            name:'Anubias Congensis',         tmin:62,tmax:84,light:'Low',   co2:false,diff:'Easy',    note:'Long narrow leaves. Less common but very hardy.'},
  // ── Bucephalandra ──
  bucephalandra:         {group:'Bucephalandra',      name:'Bucephalandra',             tmin:68,tmax:86,light:'Low',   co2:false,diff:'Easy',    note:'Many color variants. Attach to hardscape. Slow grower.'},
  // ── Cryptocoryne ──
  cryptocoryne:          {group:'Cryptocoryne',       name:'Cryptocoryne (Generic)',    tmin:68,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Melts when moved. Will recover within weeks.'},
  crypt_wendtii:         {group:'Cryptocoryne',       name:'Crypt. Wendtii',            tmin:68,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Most common Crypt. Comes in green and bronze. Very adaptable.'},
  crypt_parva:           {group:'Cryptocoryne',       name:'Crypt. Parva',              tmin:68,tmax:82,light:'Low',   co2:false,diff:'Medium',  note:'Smallest Crypt. Very slow grower. Excellent foreground plant.'},
  crypt_balansae:        {group:'Cryptocoryne',       name:'Crypt. Balansae',           tmin:68,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Tall plant with long ruffled leaves. Good background plant.'},
  crypt_spiralis:        {group:'Cryptocoryne',       name:'Crypt. Spiralis',           tmin:68,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Narrow spiraling leaves. Tall background plant.'},
  crypt_lucens:          {group:'Cryptocoryne',       name:'Crypt. Lucens',             tmin:68,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Compact and sturdy. Green leaves with reddish undersides.'},
  crypt_undulata:        {group:'Cryptocoryne',       name:'Crypt. Undulata',           tmin:68,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Wavy-edged leaves. Reddish-brown tone in lower light.'},
  // ── Swords & Rosettes ──
  amazon_sword:          {group:'Swords & Rosettes',  name:'Amazon Sword',              tmin:60,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Classic background plant. Heavy root feeder — use root tabs.'},
  echinodorus_parviflorus:{group:'Swords & Rosettes', name:'Black Amazon Sword',        tmin:60,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Darker and more compact than the standard Amazon Sword.'},
  echinodorus_osiris:    {group:'Swords & Rosettes',  name:'Melon Sword',               tmin:60,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Large reddish-brown leaves. Statement background plant. Root feeder.'},
  dwarf_lily:            {group:'Swords & Rosettes',  name:'Dwarf Lily',                tmin:68,tmax:82,light:'Medium',co2:false,diff:'Medium',  note:'Grows from a bulb. Produces broad lily-pad leaves above water.'},
  vallisneria:           {group:'Swords & Rosettes',  name:'Vallisneria',               tmin:60,tmax:86,light:'Medium',co2:false,diff:'Easy',    note:'Spreads via runners. Tall grass-like background plant.'},
  vallisneria_nana:      {group:'Swords & Rosettes',  name:'Vallisneria Nana',          tmin:60,tmax:86,light:'Medium',co2:false,diff:'Easy',    note:'Shorter and narrower than standard Val. Good for medium tanks.'},
  sagittaria_subulata:   {group:'Swords & Rosettes',  name:'Sagittaria Subulata',       tmin:60,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Grass-like spreader. Easy alternative to dwarf hairgrass.'},
  blyxa_japonica:        {group:'Swords & Rosettes',  name:'Blyxa Japonica',            tmin:68,tmax:82,light:'Medium',co2:false,diff:'Medium',  note:'Grass-like rosette with a reddish hue. Benefits from CO2.'},
  // ── Java Fern ──
  java_fern:             {group:'Java Fern',          name:'Java Fern',                 tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Tie to driftwood or hardscape. Never bury the rhizome.'},
  java_fern_narrow:      {group:'Java Fern',          name:'Java Fern Narrow Leaf',     tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Slender leaves. Same care as standard Java Fern.'},
  java_fern_windelov:    {group:'Java Fern',          name:'Java Fern Windelov',        tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Lacy trident-tipped leaves. Stunning attached to hardscape.'},
  java_fern_trident:     {group:'Java Fern',          name:'Java Fern Trident',         tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Deeply lobed finger-like leaves. Less common but very easy.'},
  bolbitis_heudelotii:   {group:'Java Fern',          name:'Bolbitis (African Fern)',   tmin:68,tmax:80,light:'Medium',co2:false,diff:'Medium',  note:'Delicate translucent green leaves. Attach to hardscape. Needs water flow.'},
  // ── Mosses ──
  java_moss:             {group:'Mosses',             name:'Java Moss',                 tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Great for shrimp and fry cover. Attach to surfaces.'},
  christmas_moss:        {group:'Mosses',             name:'Christmas Moss',            tmin:65,tmax:79,light:'Low',   co2:false,diff:'Easy',    note:'Triangular branching resembles fir branches. Attach to hardscape.'},
  flame_moss:            {group:'Mosses',             name:'Flame Moss',                tmin:65,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Distinctive upward-twisting growth pattern. Very unique look.'},
  riccia_fluitans:       {group:'Mosses',             name:'Riccia (Crystalwort)',      tmin:65,tmax:82,light:'High',  co2:true, diff:'Medium',  note:'Dense bright-green mat. Needs high light and CO2 to stay submerged.'},
  // ── Floating ──
  duckweed:              {group:'Floating',           name:'Duckweed',                  tmin:60,tmax:86,light:'Low',   co2:false,diff:'Easy',    note:'Tiny floating plant. Spreads extremely fast — hard to remove.'},
  frogbit:               {group:'Floating',           name:'Frogbit',                   tmin:60,tmax:78,light:'Medium',co2:false,diff:'Easy',    note:'Floating plant with round leaves. Provides shade and surface cover.'},
  salvinia:              {group:'Floating',           name:'Salvinia',                  tmin:64,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Small floating fern. Fast grower and excellent nitrate absorber.'},
  water_sprite:          {group:'Floating',           name:'Water Sprite',              tmin:60,tmax:87,light:'Medium',co2:false,diff:'Easy',    note:'Can float or be planted in substrate. Trim regularly.'},
  water_lettuce:         {group:'Floating',           name:'Water Lettuce',             tmin:68,tmax:86,light:'High',  co2:false,diff:'Easy',    note:'Large floating rosette. Needs strong light and high humidity.'},
  // ── Stem Plants ──
  bacopa:                {group:'Stem Plants',        name:'Bacopa Caroliniana',        tmin:68,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Round leaves on upright stems. Slightly acidic water preferred.'},
  bacopa_monnieri:       {group:'Stem Plants',        name:'Bacopa Monnieri',           tmin:64,tmax:86,light:'Medium',co2:false,diff:'Easy',    note:'Smaller leaves than caroliniana. Tolerates harder water well.'},
  hornwort:              {group:'Stem Plants',        name:'Hornwort',                  tmin:59,tmax:86,light:'Medium',co2:false,diff:'Easy',    note:'Very fast grower. Great natural nitrate filter.'},
  moneywort:             {group:'Stem Plants',        name:'Moneywort',                 tmin:60,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Round leaves on stems. Can also grow emersed above water.'},
  pennywort:             {group:'Stem Plants',        name:'Pennywort',                 tmin:68,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Fast growing trailing stems. Easy for beginners.'},
  water_wisteria:        {group:'Stem Plants',        name:'Water Wisteria',            tmin:60,tmax:86,light:'Medium',co2:false,diff:'Easy',    note:'Fast grower with delicate lacy leaves. Trim regularly.'},
  hygrophila_corymbosa:  {group:'Stem Plants',        name:'Giant Hygro',               tmin:64,tmax:86,light:'Medium',co2:false,diff:'Easy',    note:'Large leaves on tall stems. One of the most undemanding backgrounds.'},
  hygrophila_polysperma: {group:'Stem Plants',        name:'Sunset Hygro',              tmin:64,tmax:86,light:'Medium',co2:false,diff:'Easy',    note:'Pinkish-orange tips under good light. One of the easiest stem plants.'},
  limnophila_sessiliflora:{group:'Stem Plants',       name:'Ambulia',                   tmin:64,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Fine feathery whorled leaves. Fast grower. Good beginner plant.'},
  cabomba:               {group:'Stem Plants',        name:'Cabomba',                   tmin:64,tmax:82,light:'Medium',co2:false,diff:'Medium',  note:'Fan-shaped whorled leaves. Needs good light and soft water.'},
  najas_guadalupensis:   {group:'Stem Plants',        name:'Guppy Grass',               tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',    note:'Extremely fast grower. Excellent breeding cover and nitrate sink.'},
  hemianthus_micranthemoides:{group:'Stem Plants',   name:'Pearl Weed',                tmin:68,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Tiny round leaves. Can carpet low or grow upright as a stem plant.'},
  ludwigia:              {group:'Stem Plants',        name:'Ludwigia Repens',           tmin:68,tmax:82,light:'High',  co2:true, diff:'Medium',  note:'Red/orange color intensifies with high light and CO2.'},
  ludwigia_arcuata:      {group:'Stem Plants',        name:'Ludwigia Arcuata',          tmin:68,tmax:82,light:'High',  co2:true, diff:'Medium',  note:'Needle-like leaves. Vibrant orange-red with CO2 and high light.'},
  ludwigia_super_red:    {group:'Stem Plants',        name:'Ludwigia Super Red',        tmin:68,tmax:82,light:'High',  co2:true, diff:'Medium',  note:'Deep blood-red color when conditions are ideal. Very striking.'},
  rotala:                {group:'Stem Plants',        name:'Rotala Rotundifolia',       tmin:72,tmax:82,light:'High',  co2:true, diff:'Medium',  note:'Pink stems develop best color with CO2 and high light.'},
  rotala_macrandra:      {group:'Stem Plants',        name:'Rotala Macrandra',          tmin:72,tmax:82,light:'High',  co2:true, diff:'Advanced',note:'Very demanding red plant. Requires CO2, high light, and soft water.'},
  rotala_wallichii:      {group:'Stem Plants',        name:'Rotala Wallichii',          tmin:72,tmax:80,light:'High',  co2:true, diff:'Medium',  note:'Feathery pink stems. Delicate looking but very beautiful.'},
  alternanthera_reineckii:{group:'Stem Plants',       name:'Alternanthera Reineckii',   tmin:72,tmax:82,light:'High',  co2:true, diff:'Medium',  note:'Striking pink-red leaves. Needs strong light and CO2 for best color.'},
  myriophyllum_tuberculatum:{group:'Stem Plants',     name:'Red Milfoil',               tmin:65,tmax:80,light:'High',  co2:true, diff:'Advanced',note:'Fine-textured red stems. Very demanding — needs CO2, high light, soft water.'},
  // ── Foreground & Carpet ──
  dwarf_hairgrass:       {group:'Foreground & Carpet',name:'Dwarf Hairgrass',           tmin:60,tmax:80,light:'Medium',co2:false,diff:'Medium',  note:'Classic carpet plant. Slow to spread without CO2.'},
  eleocharis_acicularis: {group:'Foreground & Carpet',name:'Micro Hairgrass',           tmin:60,tmax:80,light:'Medium',co2:false,diff:'Medium',  note:'Finer and shorter than dwarf hairgrass. Dense low carpet.'},
  staurogyne_repens:     {group:'Foreground & Carpet',name:'Staurogyne Repens',         tmin:68,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Compact bushy foreground. Very undemanding for a carpet plant.'},
  marsilea_hirsuta:      {group:'Foreground & Carpet',name:'Marsilea Hirsuta',          tmin:64,tmax:82,light:'Medium',co2:false,diff:'Easy',    note:'Four-leaf clover appearance. Easy low carpet without CO2.'},
  monte_carlo:           {group:'Foreground & Carpet',name:'Monte Carlo',               tmin:68,tmax:82,light:'Medium',co2:true, diff:'Medium',  note:'Dense carpet. CO2 greatly accelerates spreading.'},
  hemianthus_callitrichoides:{group:'Foreground & Carpet',name:'HC Cuba',               tmin:68,tmax:78,light:'High',  co2:true, diff:'Advanced',note:'Demanding mini carpet. Needs high light, CO2, and soft water.'},
  pogostemon_helferi:    {group:'Foreground & Carpet',name:'Pogostemon Helferi (Downoi)',tmin:68,tmax:82,light:'Medium',co2:false,diff:'Medium', note:'Unique star-shaped leaves forming low dense clusters.'},
};

// ===== FERTILIZER PRESETS =====
var FERT = {
  flourish:      {name:'Seachem Flourish',         ml_per_gal:0.042, freq:3, note:'Comprehensive planted aquarium supplement'},
  flourish_iron: {name:'Seachem Flourish Iron',    ml_per_gal:0.042, freq:3, note:'Iron and manganese supplement for green plants'},
  flourish_excel:{name:'Seachem Flourish Excel',   ml_per_gal:0.125, freq:2, note:'Liquid carbon — daily or every other day'},
  easy_green:    {name:'Easy Green All-in-One',    ml_per_gal:0.1,   freq:7, note:'Popular all-in-one liquid fertilizer'},
  thrive:        {name:'NilocG Thrive',            ml_per_gal:0.05,  freq:7, note:'Complete macro and micro fertilizer'},
  thrive_plus:   {name:'NilocG Thrive+',           ml_per_gal:0.05,  freq:3, note:'High-light tank all-in-one'},
  custom:        {name:'Custom Fertilizer',        ml_per_gal:null,  freq:7, note:'Enter your own dose and schedule'},
};

// ===== STORAGE =====
function ld() {
  try {
    var d = JSON.parse(localStorage.getItem('aq')) || mt();
    if (!Array.isArray(d.feeding)) d.feeding = [];
    if (!Array.isArray(d.ferts))   d.ferts   = [];
    if (!d.custom_sp)              d.custom_sp = {};
    return d;
  } catch(e) { return mt(); }
}
function sv(d) { localStorage.setItem('aq', JSON.stringify(d)); }
function mt() { return {tanks:[], equip:[], plants:[], stock:[], tasks:[], water:[], feeding:[], ferts:[], custom_sp:{}}; }
// Merged species lookup: built-in SP + user custom_sp
function get_sp(d) { return Object.assign({}, SP, d ? d.custom_sp : {}); }
function add_custom_sp(sp_id, name, type, tmin, tmax, pmin, pmax, gmin, gmax, size_in, min_gal, bioload, level, note) {
  var d = ld();
  d.custom_sp[sp_id] = {name:name, type:type||'Fish', tmin:parseFloat(tmin)||72, tmax:parseFloat(tmax)||82,
    pmin:parseFloat(pmin)||6.5, pmax:parseFloat(pmax)||7.5, gmin:parseFloat(gmin)||4, gmax:parseFloat(gmax)||12,
    size_in:parseFloat(size_in)||2, min_gal:parseInt(min_gal,10)||10, bioload:parseInt(bioload,10)||2,
    level:level||'Beginner', note:note||'', custom:true};
  sv(d);
}
function del_custom_sp(sp_id) {
  var d = ld(), sp = d.custom_sp[sp_id];
  if (!confirm('Delete custom species "' + (sp ? sp.name : sp_id) + '"? Any livestock using it will lose species data. Cannot be undone.')) return;
  delete d.custom_sp[sp_id]; sv(d); r_life();
}
function gid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function at() { return localStorage.getItem('aq_at') || ''; }
function sat(id) { localStorage.setItem('aq_at', id); }
function pn(v) {
  if (v === '' || v === null || v === undefined) return null;
  var n = parseFloat(v);
  return isNaN(n) ? null : n;
}
// UIA (un-ionized ammonia, the toxic fraction) derived from TAN, pH, and temperature.
// Uses exact pKa formula: pKa = 0.09018 + 2729.92 / T_kelvin
// Falls back to 25°C when temperature is not logged.
function calc_uia(tan, ph, temp_f) {
  if (tan === null || tan === undefined || ph === null || ph === undefined) return null;
  var tc = (temp_f !== null && temp_f !== undefined) ? (temp_f - 32) * 5 / 9 : 25;
  var tk = tc + 273.15;
  var pka = 0.09018 + 2729.92 / tk;
  var frac = 1 / (1 + Math.pow(10, pka - ph));
  return Math.round(tan * frac * 10000) / 10000;
}
function uia_temp_defaulted(temp_f) { return temp_f === null || temp_f === undefined; }
function mk_uia_cell(tan, ph, temp_f, prev_tan, prev_ph, prev_tf) {
  var v = calc_uia(tan, ph, temp_f);
  if (v === null) return '<td>&mdash;</td>';
  var pv = calc_uia(prev_tan, prev_ph, prev_tf);
  var col = wlog_cls('uia', v);
  var lbl = wlog_lbl('uia', v);
  var arr = wlog_arrow(v, pv);
  var assumed = uia_temp_defaulted(temp_f);
  return '<td style="color:' + col + ';font-weight:600">' + v + arr +
         (assumed ? '<sup style="color:var(--muted);font-weight:400;font-size:9px"> *25</sup>' : '') +
         '<br><span style="font-size:10px;font-weight:400;color:var(--muted)">' + lbl + '</span></td>';
}

// ===== UNIT CONVERSION =====
function g2l(g) { return Math.round(g * 3.78541 * 10) / 10; }

// ===== UNIT PREFERENCES =====
function get_pref() {
  try { var p = JSON.parse(localStorage.getItem('aq_pref')); return (p && p.temp) ? p : {temp:'F',vol:'gal'}; }
  catch(e) { return {temp:'F',vol:'gal'}; }
}
function sv_pref(p) { localStorage.setItem('aq_pref', JSON.stringify(p)); }
function t_lbl() { return get_pref().temp === 'C' ? '\xB0C' : '\xB0F'; }
function v_lbl() { return get_pref().vol === 'L' ? 'L' : 'gal'; }
// stored \xB0F value → display value
function d_t(f) { if (f === null || f === undefined) return null; return get_pref().temp === 'C' ? Math.round((f - 32) * 5/9 * 10) / 10 : f; }
// stored gallons → display value
function d_v(g) { if (!g) return 0; return get_pref().vol === 'L' ? Math.round(g * 3.78541 * 10) / 10 : g; }
// user input temp → stored \xB0F
function inp_t(v) { var n = parseFloat(v); if (isNaN(n)) return null; return get_pref().temp === 'C' ? Math.round((n * 9/5 + 32) * 10) / 10 : n; }
// two volume fields in preference order (gal_val and lit_val are existing values or '' for new)
function vol_flds(gv, lv) {
  var pl = get_pref().vol === 'L';
  var gf = fg('Gallons', '<input type="number" name="gal" step="0.1" value="' + (gv !== undefined ? gv : '') + '" placeholder="e.g. 20"' + (pl ? '' : ' required') + ' oninput="this.form.lit.value=Math.round(this.value*3.78541*10)/10">');
  var lf = fg('Litres',  '<input type="number" name="lit" step="0.1" value="' + (lv !== undefined ? lv : '') + '" placeholder="e.g. 75.7"' + (pl ? ' required' : '') + ' oninput="this.form.gal.value=Math.round(this.value/3.78541*10)/10">');
  return pl ? lf + gf : gf + lf;
}
// stored GPH → display flow value; LPH when vol pref is L
function d_fl(gph) { return get_pref().vol === 'L' ? Math.round(gph * 3.78541) : gph; }
function fl_lbl() { return get_pref().vol === 'L' ? 'LPH' : 'GPH'; }
// user input flow → stored GPH
function inp_fl(v) { var n = parseFloat(v) || 0; return get_pref().vol === 'L' ? Math.round(n / 3.78541) : n; }

// ===== TANKS =====
function add_tank(name, gal, setup, notes, rt_min, rt_max) {
  var d = ld(), g = parseFloat(gal) || 0;
  var t = {id:gid(), name:name, gallons:g, liters:g2l(g), setup_date:setup, notes:notes||'',
           room_tmin: rt_min ? parseFloat(rt_min) : null,
           room_tmax: rt_max ? parseFloat(rt_max) : null,
           substrate_liters: 0};
  d.tanks.push(t); sv(d); sat(t.id); return t.id;
}
function upd_tank(id, name, gal, setup, notes, rt_min, rt_max, show_feed_log) {
  var d = ld(), g = parseFloat(gal) || 0;
  d.tanks = d.tanks.map(function(t) {
    if (t.id !== id) return t;
    return Object.assign({}, t, {
      name:name, gallons:g, liters:g2l(g), setup_date:setup, notes:notes||'',
      room_tmin: rt_min ? parseFloat(rt_min) : null,
      room_tmax: rt_max ? parseFloat(rt_max) : null,
      show_feed_log: !!show_feed_log
    });
  });
  sv(d);
}
function del_tank(id) {
  var d = ld();
  d.tanks = d.tanks.filter(function(x) { return x.id !== id; });
  ['equip','plants','stock','tasks','water','feeding','ferts'].forEach(function(k) {
    d[k] = d[k].filter(function(x) { return x.tank_id !== id; });
  });
  sv(d);
  sat(d.tanks.length ? d.tanks[0].id : '');
}

// ===== FEEDING LOG =====
function add_feeding(tid, food_type, amt, notes) {
  var d = ld(), now = new Date();
  d.feeding.push({id:gid(), tank_id:tid, date:now.toISOString().slice(0,10), ts:now.getTime(), food_type:food_type||'', amt:amt||'', notes:notes||''});
  sv(d);
}
function del_feeding(id) {
  if (!confirm('Delete this feeding entry? Cannot be undone.')) return;
  var d = ld(); d.feeding = d.feeding.filter(function(x){return x.id!==id;}); sv(d); r_wlog(); r_dash();
}
function open_feed_modal(tid) {
  var td = today_str();
  var food_opts = ['Flakes','Pellets','Frozen','Live food','Wafers / Tablets','Gel food','Vegetables','Other'];
  var amt_opts  = ['Small pinch','Regular amount','Large portion'];
  om('<div class="mtitle">Log Feeding</div>' +
    '<form class="mform" onsubmit="sub_save_feeding(event)">' +
    '<input type="hidden" name="tid" value="' + tid + '">' +
    fg('Date', '<input type="date" name="date" value="' + td + '" required>') +
    fg('Food type', '<select name="food_type"><option value="">— select —</option>' +
      food_opts.map(function(f){ return '<option>' + f + '</option>'; }).join('') + '</select>') +
    fg('Amount', '<select name="amt"><option value="">— select —</option>' +
      amt_opts.map(function(a){ return '<option>' + a + '</option>'; }).join('') + '</select>') +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button>' +
    '<button type="submit" class="btn bp">Save</button></div></form>');
}
function sub_save_feeding(e) {
  e.preventDefault(); var f = e.target;
  add_feeding(f.tid.value, f.food_type.value, f.amt.value, f.notes.value);
  cm(); r_wlog(); r_dash();
}
function last_feeding(tid) {
  var d = ld();
  var f = d.feeding.filter(function(x){ return x.tank_id === tid; });
  if (!f.length) return null;
  return f.sort(function(a,b){ return b.ts - a.ts; })[0];
}
function feedings_today(tid) {
  var d = ld(), today = today_str();
  return d.feeding.filter(function(x){ return x.tank_id === tid && x.date === today; }).length;
}
function ts_ago(ts) {
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(diff / 86400000) + 'd ago';
}

// ===== NITROGEN CYCLE TRACKER =====
function cycle_status(tid) {
  var d = ld(), entries = get_water(tid);
  var tank = d.tanks.find(function(t){ return t.id === tid; }) || {};
  var chk = tank.setup_chk || {};
  var has_fish = d.stock.filter(function(s){ return s.tank_id === tid; }).length > 0;
  var has_source = has_fish || chk.cycle_src;

  if (!entries.length) {
    if (!has_source) return {phase:0, pct:5, label:'Not started', color:'#9ca3af', test_freq:null, desc:'Add an ammonia source (pure ammonia, fish food, or a few hardy starter fish) and log your first water test to begin tracking.'};
    return {phase:0, pct:15, label:'Cycling', color:'#4db8d4', test_freq:2, desc:'Ammonia source detected (fish or manual). Log your first water test to start tracking cycle progress.'};
  }
  var last = entries[entries.length - 1];
  var nh3 = last.ammonia, no2 = last.nitrite, no3 = last.nitrate;
  if (nh3 === null && no2 === null) return {phase:0, pct:10, label:'Monitoring', color:'#9ca3af', test_freq:3, desc:'Log ammonia and nitrite readings to track cycle progress.'};
  if (nh3 !== null && nh3 <= 0.25 && no2 !== null && no2 <= 0.25 && no3 !== null && no3 > 0) return {phase:4, pct:100, label:'Cycle complete!', color:'#3ab87a', test_freq:null, desc:'NH3 and NO2 are at 0 ppm, nitrate detected. Your tank is ready. Add fish slowly — 2-3 at a time, wait 1-2 weeks between additions.'};
  // Pattern: NO2 spike seen in any prior entry, now both NH3 and NO2 are back to safe levels
  var prior = entries.slice(0, entries.length - 1);
  var had_no2_spike = prior.some(function(e){ return e.nitrite !== null && e.nitrite > 0; });
  var had_nh3_spike = entries.some(function(e){ return e.ammonia !== null && e.ammonia > 0; });
  var no2_clear = no2 !== null && no2 <= 0.25;
  // If NH3 was ever elevated, require it to be logged and resolved; if never tested, don't block on it
  var nh3_clear = had_nh3_spike ? (nh3 !== null && nh3 <= 0.25) : true;
  if (had_no2_spike && no2_clear && nh3_clear) return {phase:4, pct:100, label:'Cycle complete!', color:'#3ab87a', test_freq:null, desc:'Nitrite spike detected in your history and now resolved — this is the classic cycle pattern. Test and log nitrate to confirm it is building up. Do a 30-50% water change before adding your first fish.'};
  if (nh3 !== null && nh3 <= 0.5 && no2 !== null && no2 > 0) return {phase:3, pct:75, label:'Almost there', color:'#e8a838', test_freq:2, desc:'Ammonia is falling and nitrite-eating bacteria are multiplying. Keep testing every 2-3 days. 1-2 more weeks typically.'};
  if (no2 !== null && no2 > 0) return {phase:2, pct:50, label:'Nitrite spike', color:'#e05252', test_freq:2, desc:'Ammonia-eating bacteria are established. Nitrite-eating bacteria are growing now. Both are still toxic — do not add fish. Avoid large water changes.'};
  if (nh3 !== null && nh3 > 0) return {phase:1, pct:25, label:'Ammonia spike', color:'#e8a838', test_freq:2, desc:'Beneficial bacteria are starting to colonise the filter. This is normal. Do NOT do water changes yet. Test every 2-3 days and wait.'};
  return {phase:0, pct:10, label:'Monitoring', color:'#9ca3af', test_freq:3, desc:'Keep logging water tests to track cycle progress.'};
}
function mark_cycled(tid) {
  var d = ld();
  d.tanks = d.tanks.map(function(t){ return t.id === tid ? Object.assign({}, t, {cycled:true}) : t; });
  sv(d); r_dash();
}
function save_cycle_method(method) {
  var d = ld();
  d.tanks = d.tanks.map(function(t) {
    if (t.id !== at()) return t;
    var chk = Object.assign({}, t.setup_chk || {});
    chk.cycle_method = method;
    return Object.assign({}, t, {setup_chk: chk});
  });
  sv(d); r_dash();
}
function upd_checklist(tid, key, val) {
  var d = ld();
  d.tanks = d.tanks.map(function(t) {
    if (t.id !== tid) return t;
    var chk = Object.assign({}, t.setup_chk || {});
    chk[key] = val;
    return Object.assign({}, t, {setup_chk: chk});
  });
  sv(d); r_dash();
}
function dismiss_setup(tid) {
  var d = ld();
  d.tanks = d.tanks.map(function(t){ return t.id === tid ? Object.assign({}, t, {setup_dismissed:true}) : t; });
  sv(d); r_dash();
}

// ===== EQUIPMENT =====
function add_equip(tid, type, name, brand, notes, config) {
  var d = ld();
  d.equip.push({id:gid(), tank_id:tid, type:type, name:name, brand:brand||'', notes:notes||'', config:config||{}});
  sv(d);
}
function upd_equip(id, type, name, brand, notes, config) {
  var d = ld();
  d.equip = d.equip.map(function(e) {
    return e.id === id ? Object.assign({}, e, {type:type, name:name, brand:brand||'', notes:notes||'', config:config||{}}) : e;
  });
  sv(d);
}
function del_equip(id) {
  var d = ld(), item = d.equip.find(function(x){return x.id===id;});
  if (!confirm('Delete "' + (item ? item.name : 'this equipment') + '"? Cannot be undone.')) return;
  d.equip = d.equip.filter(function(x){return x.id!==id;}); sv(d);
}

function eq_cfg_txt(eq) {
  var cfg = eq.config || {};
  if (eq.type === 'Light') {
    var w = cfg.watts ? cfg.watts + 'W' : '';
    var s = cfg.spectrum || '';
    var h = cfg.hours ? cfg.hours + 'h/day' : '';
    return [w, s, h].filter(function(x){return x;}).join(', ') || '-';
  }
  if (eq.type === 'Filter') {
    var g = cfg.flow_gph ? d_fl(cfg.flow_gph) + ' ' + fl_lbl() : '';
    var st = cfg.style || '';
    return [g, st].filter(function(x){return x;}).join(', ') || '-';
  }
  if (eq.type === 'CO2 System') {
    var ct = cfg.co2_type || '';
    var ch = cfg.hours ? cfg.hours + 'h/day' : '';
    var cb = cfg.bps ? cfg.bps + ' BPS' : '';
    return [ct, ch, cb].filter(function(x){return x;}).join(', ') || '-';
  }
  if (eq.type === 'Heater') {
    var hw = cfg.watts ? cfg.watts + 'W' : '';
    var ht = cfg.heater_type || '';
    return [hw, ht].filter(function(x){return x;}).join(', ') || '-';
  }
  return '-';
}
function get_heater_watts(tid) {
  var d = ld(), total = 0;
  d.equip.filter(function(x){ return x.tank_id === tid && x.type === 'Heater' && x.config && x.config.watts; })
    .forEach(function(h){ total += (h.config.watts || 0); });
  return total;
}

// ===== PLANTS =====
function add_plant(tid, plant_id, pname, qty, added, notes) {
  var d = ld();
  d.plants.push({id:gid(), tank_id:tid, plant_id:plant_id||'', name:pname, qty:parseInt(qty)||1, added_date:added, notes:notes||''});
  sv(d);
}
function del_plant(id) {
  var d = ld(), item = d.plants.find(function(x){return x.id===id;});
  if (!confirm('Delete "' + (item ? item.name : 'this plant') + '"? Cannot be undone.')) return;
  d.plants = d.plants.filter(function(x){return x.id!==id;}); sv(d);
}
function do_edit_plant(id) {
  var d = ld(), p = d.plants.find(function(x){return x.id===id;}); if (!p) return;
  om('<div class="mtitle">Edit Plant</div>' +
    '<form onsubmit="sub_edit_plant(event)">' +
    '<input type="hidden" name="pid" value="' + p.id + '">' +
    fg('Plant', '<input type="text" value="' + esc(p.name) + '" disabled style="color:var(--muted)">') +
    fg('Quantity', '<input type="number" name="qty" min="1" value="' + p.qty + '" required>') +
    fg('Notes', '<input type="text" name="notes" value="' + esc(p.notes) + '">') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Save</button></div>' +
    '</form>');
}
function sub_edit_plant(e) {
  e.preventDefault(); var f = e.target, d = ld();
  d.plants = d.plants.map(function(p) {
    if (p.id !== f.pid.value) return p;
    return Object.assign({}, p, {qty:parseInt(f.qty.value)||1, notes:f.notes.value});
  });
  sv(d); cm(); r_life();
}

// ===== LIVESTOCK =====
function add_stock(tid, sid, dname, qty, added, notes) {
  var d = ld();
  d.stock.push({id:gid(), tank_id:tid, species_id:sid, display_name:dname||(get_sp(d)[sid]?get_sp(d)[sid].name:sid), qty:parseInt(qty)||1, added_date:added, notes:notes||''});
  sv(d);
}
function del_stock(id) {
  var d = ld(), item = d.stock.find(function(x){return x.id===id;});
  if (!confirm('Delete "' + (item ? item.display_name : 'this livestock') + '"? Cannot be undone.')) return;
  d.stock = d.stock.filter(function(x){return x.id!==id;}); sv(d);
}
function do_edit_stock(id) {
  var d = ld(), s = d.stock.find(function(x){return x.id===id;}); if (!s) return;
  var sp = get_sp(d)[s.species_id];
  om('<div class="mtitle">Edit Livestock</div>' +
    '<form onsubmit="sub_edit_stock(event)">' +
    '<input type="hidden" name="sid" value="' + s.id + '">' +
    fg('Species', '<input type="text" value="' + esc(sp ? sp.name : s.species_id) + '" disabled style="color:var(--muted)">') +
    fg('Display Name', '<input type="text" name="dname" value="' + esc(s.display_name) + '">') +
    fg('Quantity', '<input type="number" name="qty" min="1" value="' + s.qty + '" required>') +
    fg('Notes', '<input type="text" name="notes" value="' + esc(s.notes) + '">') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Save</button></div>' +
    '</form>');
}
function sub_edit_stock(e) {
  e.preventDefault(); var f = e.target, d = ld();
  d.stock = d.stock.map(function(s) {
    if (s.id !== f.sid.value) return s;
    return Object.assign({}, s, {qty:parseInt(f.qty.value)||1, display_name:f.dname.value||s.display_name, notes:f.notes.value});
  });
  sv(d); cm(); r_life(); r_dash();
}

// ===== FERTILIZERS =====
var _fert_gal = 0;
function add_fert(tid, preset, name, dose_ml, freq_days, notes) {
  var d = ld();
  d.ferts.push({id:gid(), tank_id:tid, preset:preset, name:name, dose_ml:parseFloat(dose_ml)||0, freq_days:parseInt(freq_days)||7, notes:notes||''});
  sv(d); r_life();
}
function del_fert(id) { var d = ld(); d.ferts = d.ferts.filter(function(x){return x.id!==id;}); sv(d); r_life(); }
function do_edit_fert(id) {
  var d = ld(), f = d.ferts.find(function(x){return x.id===id;}); if (!f) return;
  var tank = d.tanks.find(function(t){ return t.id === at(); });
  var gal_note = tank ? '<small style="color:var(--muted);font-size:11px">Tank is ' + Math.round(tank.gallons) + ' gal — adjust dose if needed</small>' : '';
  om('<div class="mtitle">Edit Fertilizer</div>' +
    '<form onsubmit="sub_edit_fert(event)">' +
    '<input type="hidden" name="fid" value="' + f.id + '">' +
    fg('Name', '<input type="text" name="name" value="' + esc(f.name) + '" required>') +
    fg('Dose per application (ml)', '<input type="number" name="dose_ml" step="0.1" min="0" value="' + f.dose_ml + '" required>' + gal_note) +
    fg('Dose every (days)', '<input type="number" name="freq_days" min="1" value="' + f.freq_days + '" required>') +
    fg('Notes', '<input type="text" name="notes" value="' + esc(f.notes) + '">') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Save</button></div>' +
    '</form>');
}
function sub_edit_fert(e) {
  e.preventDefault(); var f = e.target, d = ld();
  d.ferts = d.ferts.map(function(x) {
    if (x.id !== f.fid.value) return x;
    return Object.assign({}, x, {name:f.name.value, dose_ml:parseFloat(f.dose_ml.value)||0, freq_days:parseInt(f.freq_days.value)||7, notes:f.notes.value});
  });
  sv(d); cm(); r_life();
}
function calc_fert_dose(sel) {
  var f = document.getElementById('fert_frm');
  var fp = FERT[sel.value];
  if (!fp) return;
  f.fert_name.value = fp.name;
  f.fert_freq.value = fp.freq;
  if (fp.ml_per_gal !== null) {
    f.fert_dose.value = Math.round(fp.ml_per_gal * _fert_gal * 10) / 10;
  } else {
    f.fert_dose.value = '';
  }
}
function do_add_fert() {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === at(); });
  if (!tank) return;
  _fert_gal = tank.gallons || 0;
  var opts = Object.keys(FERT).map(function(k) {
    return '<option value="' + k + '">' + FERT[k].name + '</option>';
  }).join('');
  om('<div class="mtitle">Add Fertilizer</div>' +
    '<form id="fert_frm" onsubmit="event.preventDefault();sub_fert()">' +
    fg('Preset', '<select name="fert_preset" onchange="calc_fert_dose(this)">' + opts + '</select>') +
    fg('Name', '<input type="text" name="fert_name" value="' + esc(FERT[Object.keys(FERT)[0]].name) + '" required>') +
    fg('Dose per application (ml)', '<input type="number" name="fert_dose" step="0.1" min="0" value="' + (Math.round(FERT[Object.keys(FERT)[0]].ml_per_gal * _fert_gal * 10) / 10) + '" required placeholder="e.g. 2.5"><small style="color:var(--muted);font-size:11px">Calculated from ' + Math.round(_fert_gal) + ' gal tank — edit if needed</small>') +
    fg('Dose every (days)', '<input type="number" name="fert_freq" min="1" value="' + FERT[Object.keys(FERT)[0]].freq + '" required>') +
    fg('Notes', '<input type="text" name="fert_notes" placeholder="Optional">') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add Fertilizer</button></div>' +
    '</form>');
}
function sub_fert() {
  var f = document.getElementById('fert_frm');
  add_fert(at(), f.fert_preset.value, f.fert_name.value.trim(), f.fert_dose.value, f.fert_freq.value, f.fert_notes.value.trim());
  cm();
}

// ===== MAINTENANCE =====
function next_due(last, freq) {
  var ms = new Date(last + 'T00:00:00').getTime() + parseInt(freq) * 86400000;
  return new Date(ms).toISOString().slice(0,10);
}
function days_til(due) {
  var now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((new Date(due + 'T00:00:00') - now) / 86400000);
}
function ucls(days) { return days < 0 ? 'tover' : days <= 3 ? 'tsoon' : 'tok'; }
function add_task(tid, type, name, freq, last, notes) {
  var d = ld();
  d.tasks.push({id:gid(), tank_id:tid, type:type, name:name, freq:parseInt(freq)||7, last_done:last, next_due:next_due(last,freq), notes:notes||''});
  sv(d);
}
function del_task(id) {
  var d = ld(), item = d.tasks.find(function(x){return x.id===id;});
  if (!confirm('Delete "' + (item ? item.name : 'this task') + '"? Cannot be undone.')) return;
  d.tasks = d.tasks.filter(function(x){return x.id!==id;}); sv(d);
}
function mark_done(id) {
  var d = ld(), today = new Date().toISOString().slice(0,10);
  d.tasks = d.tasks.map(function(t) {
    return t.id === id ? Object.assign({}, t, {last_done:today, next_due:next_due(today,t.freq)}) : t;
  });
  sv(d);
}

// ===== WATER LOG =====
function add_water(tid, date, tf, nh3, no2, no3, ph, gh, notes, ca, mg) {
  var d = ld();
  d.water.push({id:gid(), tank_id:tid, date:date, temp_f:pn(tf), ammonia:pn(nh3), nitrite:pn(no2), nitrate:pn(no3), ph:pn(ph), gh:pn(gh), notes:notes||'', calcium:pn(ca), magnesium:pn(mg)});
  sv(d);
}
function del_water(id) {
  if (!confirm('Delete this water log entry? Cannot be undone.')) return;
  var d = ld(); d.water = d.water.filter(function(x){return x.id!==id;}); sv(d);
}
function get_water(tid) {
  return ld().water.filter(function(x){return x.tank_id===tid;}).sort(function(a,b){return a.date<b.date?-1:1;});
}
function last_r(tid) { var w = get_water(tid); return w.length ? w[w.length-1] : null; }

// ===== BIOLOAD =====
function calc_bioload(tid) {
  var d = ld(), sp_all = get_sp(d), total = 0;
  d.stock.filter(function(x){ return x.tank_id === tid; }).forEach(function(s) {
    var sp = sp_all[s.species_id];
    // Invertebrates (shrimps, snails) produce ~30% of the waste fish do at equivalent size
    if (sp) total += (sp.bioload || 2) * s.qty * (sp.inv ? 0.3 : 1);
  });
  return Math.round(total * 10) / 10;
}
function max_bioload(gallons, plant_count, substrate_liters) {
  var sub_gal = (substrate_liters || 0) / 3.78541;
  var eff_gal = Math.max(1, gallons - sub_gal);
  var mult = plant_count >= 5 ? 1.2 : plant_count >= 1 ? 1.1 : 1.0;
  return Math.max(1, Math.round(eff_gal * 1.5 * mult));
}
function bioload_cls(cur, max_val) {
  if (max_val === 0) return 'muted';
  var pct = cur / max_val;
  if (pct <= 0.7) return 'ok';
  if (pct <= 1.0) return 'warn';
  return 'danger';
}

// ===== EQUIPMENT HELPERS =====
function get_filter_mult(tid) {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  if (!tank || !tank.gallons) return 1.0;
  var filters = d.equip.filter(function(x){
    return x.tank_id === tid && x.type === 'Filter' && x.config && x.config.flow_gph > 0;
  });
  if (!filters.length) return 1.0;
  var total_gph = 0;
  filters.forEach(function(f){ total_gph += (f.config.flow_gph || 0); });
  var turnover = total_gph / tank.gallons;
  if (turnover < 4) return 0.85;
  if (turnover > 6) return 1.1;
  return 1.0;
}
function get_light_hours(tid) {
  var d = ld(), max_h = 0;
  d.equip.filter(function(x){ return x.tank_id === tid && x.type === 'Light'; })
    .forEach(function(l){ if (l.config && l.config.hours > max_h) max_h = l.config.hours; });
  return max_h;
}
function get_co2_info(tid) {
  var d = ld();
  var co2 = d.equip.filter(function(x){ return x.tank_id === tid && x.type === 'CO2 System'; });
  if (!co2.length) return null;
  var cfg = co2[0].config || {};
  return {type: cfg.co2_type || 'CO2', hours: cfg.hours || 0, bps: cfg.bps || 0};
}

// ===== RECOMMENDED MAINTENANCE TASKS =====
function get_rec_tasks(tid) {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  if (!tank) return [];
  var pl_count = d.plants.filter(function(x){ return x.tank_id === tid; }).length;
  var filter_mult = get_filter_mult(tid);
  var cur_bl = calc_bioload(tid);
  var max_bl = Math.round(max_bioload(tank.gallons, pl_count, tank.substrate_liters) * filter_mult);
  var bl_ratio = max_bl > 0 ? cur_bl / max_bl : 0;
  var recs = [];

  var wc_freq = bl_ratio >= 0.8 ? 3 : bl_ratio >= 0.5 ? 7 : 14;
  var wc_why = bl_ratio >= 0.8 ? 'High bioload - frequent changes critical' :
               bl_ratio >= 0.5 ? 'Weekly changes maintain water quality' : 'Light stocking - bi-weekly is fine';
  recs.push({type:'Water Change', name:'25% Water Change', freq:wc_freq, why:wc_why});

  var fc_freq = bl_ratio >= 0.7 ? 14 : 30;
  recs.push({type:'Filter Clean', name:'Filter Media Rinse', freq:fc_freq,
    why:'Rinse in tank water (not tap) to preserve beneficial bacteria'});

  var wt_freq = bl_ratio >= 0.7 ? 7 : 14;
  var cyc_stat = cycle_status(tid);
  var is_cycling = !tank.cycled && cyc_stat.phase < 4 && cyc_stat.test_freq !== null;
  if (is_cycling) {
    recs.push({type:'Water Test', name:'Cycle Monitoring Test', freq:cyc_stat.test_freq,
      why:'Tank is cycling — test NH3, NO2, NO3 every ' + cyc_stat.test_freq + ' days until both read 0 ppm with detectable nitrate'});
  } else {
    recs.push({type:'Water Test', name:'Water Parameter Test', freq:wt_freq,
      why:'Test NH3, NO2, NO3 and pH to catch issues early'});
  }

  recs.push({type:'Glass Wipe', name:'Glass and Algae Clean', freq:7,
    why:'Weekly wipe prevents algae from taking hold'});

  recs.push({type:'Gravel Vac', name:'Gravel Vacuum', freq:14,
    why:'Removes waste and detritus from substrate'});

  if (pl_count > 0) {
    recs.push({type:'Pruning', name:'Plant Trim and Maintenance', freq:14,
      why:'Trim overgrowth and remove dead or yellowing leaves'});
  }

  var co2_equip = d.equip.filter(function(x){
    return x.tank_id === tid && x.type === 'CO2 System' && x.config &&
           x.config.co2_type && x.config.co2_type.indexOf('Pressurized') !== -1;
  });
  if (co2_equip.length) {
    recs.push({type:'Other', name:'CO2 Bottle Level Check', freq:30,
      why:'Monthly check prevents unexpected CO2 loss mid-day'});
  }

  d.ferts.filter(function(x){ return x.tank_id === tid; }).forEach(function(f) {
    var dose_str = f.dose_ml ? f.dose_ml + ' ml per dose' : 'see bottle for dose';
    recs.push({type:'Fertilizer', name:f.name, freq:f.freq_days,
      why:dose_str + ' — based on ' + Math.round(d_v(tank.gallons)) + ' ' + v_lbl() + ' tank'});
  });

  return recs;
}

function add_rec_task(type, name, freq) {
  add_task(at(), type, name, parseInt(freq), today_str(), 'Recommended task');
  r_maint();
}

// ===== RECOMMENDATIONS ENGINE =====
function overlap(tid) {
  var d = ld(), sp_all = get_sp(d), items = d.stock.filter(function(x){return x.tank_id===tid;});
  if (!items.length) return null;
  var tmi=-Infinity,tma=Infinity,pmi=-Infinity,pma=Infinity,gmi=-Infinity,gma=Infinity,sl=[],pl_names=[];
  items.forEach(function(s) {
    var sp = sp_all[s.species_id]; if (!sp) return;
    sl.push(Object.assign({sid: s.species_id}, sp));
    tmi=Math.max(tmi,sp.tmin); tma=Math.min(tma,sp.tmax);
    pmi=Math.max(pmi,sp.pmin); pma=Math.min(pma,sp.pmax);
    gmi=Math.max(gmi,sp.gmin); gma=Math.min(gma,sp.gmax);
  });
  // Include plant temperature requirements in the overlap
  d.plants.filter(function(x){return x.tank_id===tid;}).forEach(function(p) {
    var pl = PL[p.plant_id]; if (!pl || pl.tmin == null) return;
    tmi=Math.max(tmi,pl.tmin); tma=Math.min(tma,pl.tmax);
    pl_names.push(pl.name);
  });
  var param_ok = tmi<=tma && pmi<=pma && gmi<=gma;
  var beh_ok = !sl.some(function(a,i){ return sl.slice(i+1).some(function(b){ return !!behavior_incompat(a.sid,a,b.sid,b); }); });
  return {sl:sl, pl_names:pl_names, temp:{min:tmi,max:tma,ok:tmi<=tma}, ph:{min:pmi,max:pma,ok:pmi<=pma}, gh:{min:gmi,max:gma,ok:gmi<=gma}, all_ok:param_ok&&beh_ok};
}
// Returns species in sl whose individual range is violated by raw for the given key
function find_affected(sl, k, raw) {
  var out = [], seen = {};
  if (!sl || !sl.length || raw === null || raw === undefined) return out;
  sl.forEach(function(sp) {
    if (seen[sp.sid]) return;
    var lo, hi;
    if (k === 'temp_f') { lo = sp.tmin; hi = sp.tmax; }
    else if (k === 'ph')  { lo = sp.pmin; hi = sp.pmax; }
    else if (k === 'gh')  { lo = sp.gmin; hi = sp.gmax; }
    else return;
    if (raw > hi)       { seen[sp.sid] = 1; out.push({name: sp.name, dir: 'max', val: k === 'temp_f' ? d_t(hi) : hi}); }
    else if (raw < lo)  { seen[sp.sid] = 1; out.push({name: sp.name, dir: 'min', val: k === 'temp_f' ? d_t(lo) : lo}); }
  });
  return out;
}
function behavior_incompat(sid_a, sp_a, sid_b, sp_b) {
  // Check incompat dict on both species (bidirectional)
  if (sp_a.incompat && sp_a.incompat[sid_b]) return sp_a.incompat[sid_b];
  if (sp_b.incompat && sp_b.incompat[sid_a]) return sp_b.incompat[sid_a];
  // Turtle eats any non-turtle
  if (sp_a.eats_fish && sp_b.type !== 'Turtle') return sp_a.name + ' eats fish — cannot be kept with ' + sp_b.name + '.';
  if (sp_b.eats_fish && sp_a.type !== 'Turtle') return sp_b.name + ' eats fish — cannot be kept with ' + sp_a.name + '.';
  return null;
}
function bad_pairs(sl) {
  var c = [];
  for (var i=0; i<sl.length; i++) for (var j=i+1; j<sl.length; j++) {
    var a=sl[i], b=sl[j], ps=[], beh=null;
    if (Math.max(a.tmin,b.tmin)>Math.min(a.tmax,b.tmax)) ps.push('Temperature');
    if (Math.max(a.pmin,b.pmin)>Math.min(a.pmax,b.pmax)) ps.push('pH');
    if (Math.max(a.gmin,b.gmin)>Math.min(a.gmax,b.gmax)) ps.push('Hardness');
    beh = behavior_incompat(a.sid, a, b.sid, b);
    if (ps.length || beh) c.push({a:a.name, b:b.name, ps:ps, beh:beh});
  }
  return c;
}
function cls_val(v, mn, mx, tox) {
  if (v === null || v === undefined || v === '') return 'muted';
  if (tox) { if (v > 0.5) return 'danger'; if (v > 0) return 'warn'; return 'ok'; }
  if (mn === null || mx === null) return 'muted';
  if (v >= mn && v <= mx) return 'ok';
  var buf = (mx - mn) * 0.2;
  return (v >= mn-buf && v <= mx+buf) ? 'warn' : 'danger';
}
function pill(c) {
  var lbl = c === 'muted' ? 'NO DATA' : c.toUpperCase();
  return '<span class="pill p' + c + '">' + lbl + '</span>';
}
function pill_lbl(c, lbl) {
  return '<span class="pill p' + c + '">' + lbl + '</span>';
}

// ===== CHART =====
var ch_inst = null;
function draw_chart(tid, param) {
  var entries = get_water(tid);
  if (ch_inst) { ch_inst.destroy(); ch_inst = null; }
  var cv = document.getElementById('wc');
  if (!cv || entries.length < 2) return;
  var lmap = {temp_f:'Temperature (' + t_lbl() + ')', ammonia:'Ammonia TAN (ppm)', nitrite:'Nitrite (ppm)', nitrate:'Nitrate (ppm)', ph:'pH', gh:'Hardness (GH)', uia:'Ammonia UIA (ppm)'};

  // Reference lines: {v, color, label}
  var temp_refs = [];
  var rng = overlap(tid);
  if (rng && rng.temp.ok) {
    temp_refs = [
      {v: d_t(rng.temp.min), color:'#3ab87a', label:'Species min'},
      {v: d_t(rng.temp.max), color:'#3ab87a', label:'Species max'}
    ];
  }
  var all_refs = {
    ammonia: [{v:0.25, color:'#e8a838', label:'Caution (0.25 ppm)'}, {v:0.5, color:'#e05252', label:'Danger (0.5 ppm)'}],
    nitrite: [{v:0.25, color:'#e8a838', label:'Caution (0.25 ppm)'}, {v:0.5, color:'#e05252', label:'Danger (0.5 ppm)'}],
    nitrate: [{v:20,   color:'#3ab87a', label:'Ideal max (20 ppm)'}, {v:40, color:'#e8a838', label:'Caution max (40 ppm)'}],
    ph:      [{v:6.5,  color:'#3ab87a', label:'Ideal min (6.5)'}, {v:7.5, color:'#3ab87a', label:'Ideal max (7.5)'}, {v:6.0, color:'#e8a838', label:'Caution min (6.0)'}, {v:8.0, color:'#e8a838', label:'Caution max (8.0)'}],
    gh:      [{v:4,    color:'#3ab87a', label:'Ideal min (4 dGH)'}, {v:12, color:'#3ab87a', label:'Ideal max (12 dGH)'}, {v:2, color:'#e8a838', label:'Caution min (2 dGH)'}, {v:15, color:'#e8a838', label:'Caution max (15 dGH)'}],
    temp_f:  temp_refs,
    uia:     [{v:0.02, color:'#e8a838', label:'Caution (0.02 ppm)'}, {v:0.05, color:'#e05252', label:'Danger (0.05 ppm)'}]
  };

  var refs = all_refs[param] || [];
  var n = entries.length;
  var datasets = [{
    label: lmap[param] || param,
    data: entries.map(function(e) {
      if (param === 'temp_f') return d_t(e[param]);
      if (param === 'uia') return calc_uia(e.ammonia, e.ph, e.temp_f);
      return e[param];
    }),
    borderColor: '#4db8d4', backgroundColor: 'rgba(77,184,212,0.12)',
    tension: 0.3, fill: true, pointRadius: 4, spanGaps: true, order: 1
  }];
  refs.forEach(function(r) {
    datasets.push({
      label: r.label,
      data: Array.apply(null, Array(n)).map(function(){ return r.v; }),
      borderColor: r.color, backgroundColor: 'transparent',
      borderWidth: 1.5, borderDash: [6, 4],
      pointRadius: 0, fill: false, tension: 0, order: 2
    });
  });

  ch_inst = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: {labels: entries.map(function(e) { return e.date; }), datasets: datasets},
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          display: refs.length > 0,
          labels: {boxWidth: 16, font: {size: 11}}
        },
        tooltip: {mode:'index', intersect:false}
      },
      scales: {
        x: {ticks: {maxTicksLimit: 8}},
        y: {beginAtZero: (param === 'ammonia' || param === 'nitrite' || param === 'nitrate')}
      }
    }
  });
}

// ===== EXPORT / IMPORT =====
function do_export() {
  var d = ld();
  var prev_ids = d.tanks.filter(function(t){ return t.preview; }).map(function(t){ return t.id; });
  var exp = {
    tanks:   d.tanks.filter(function(t){ return !t.preview; }),
    equip:   d.equip.filter(function(x){ return prev_ids.indexOf(x.tank_id) === -1; }),
    plants:  d.plants.filter(function(x){ return prev_ids.indexOf(x.tank_id) === -1; }),
    stock:   d.stock.filter(function(x){ return prev_ids.indexOf(x.tank_id) === -1; }),
    tasks:   d.tasks.filter(function(x){ return prev_ids.indexOf(x.tank_id) === -1; }),
    water:   d.water.filter(function(x){ return prev_ids.indexOf(x.tank_id) === -1; }),
    feeding: d.feeding.filter(function(x){ return prev_ids.indexOf(x.tank_id) === -1; }),
    ferts:   d.ferts.filter(function(x){ return prev_ids.indexOf(x.tank_id) === -1; }),
    custom_sp: d.custom_sp || {},
    pref:    get_pref()
  };
  var blob = new Blob([JSON.stringify(exp, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'aquatracker-' + new Date().toISOString().slice(0,10) + '.json';
  a.click(); URL.revokeObjectURL(url);
  localStorage.setItem('aq_last_export', Date.now().toString());
  r_dash();
}
function do_import(inp) {
  var file = inp.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var p = JSON.parse(e.target.result);
      var ok = ['tanks','equip','plants','stock','tasks','water'].every(function(k){ return Array.isArray(p[k]); });
      if (!ok) { alert('Invalid backup file format.'); return; }
      if (!p.custom_sp || typeof p.custom_sp !== 'object' || Array.isArray(p.custom_sp)) p.custom_sp = {};
      sv(p); inp.value = '';
      if (p.pref) sv_pref(p.pref);
      if (p.tanks.length) sat(p.tanks[0].id);
      init();
    } catch(err) { alert('Could not read file: ' + err.message); }
  };
  reader.readAsText(file);
}
function do_settings() {
  var p = get_pref();
  om('<div class="mtitle">Units &amp; Preferences</div>' +
    fg('Temperature', '<select id="pref_temp">' +
      '<option value="F"' + (p.temp === 'F' ? ' selected' : '') + '>Fahrenheit (\xB0F)</option>' +
      '<option value="C"' + (p.temp === 'C' ? ' selected' : '') + '>Celsius (\xB0C)</option>' +
      '</select>') +
    fg('Volume', '<select id="pref_vol">' +
      '<option value="gal"' + (p.vol === 'gal' ? ' selected' : '') + '>Gallons (gal)</option>' +
      '<option value="L"' + (p.vol === 'L' ? ' selected' : '') + '>Litres (L)</option>' +
      '</select>') +
    '<div class="mact"><button class="btn bg" onclick="cm()">Cancel</button><button class="btn bp" onclick="sub_pref()">Save</button></div>');
}
function sub_pref() {
  sv_pref({temp: document.getElementById('pref_temp').value, vol: document.getElementById('pref_vol').value});
  cm(); init();
}

// ===== HELPERS =====
function esc(s) {
  return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
}
function nv(v) { return (v !== null && v !== undefined) ? v : '&mdash;'; }
function fg(lbl, inp_html) { return '<div class="fg"><label>' + lbl + '</label>' + inp_html + '</div>'; }
function no_tank() {
  return '<div class="empty-s"><h2>No Tank Selected</h2><p>Add a tank using the button in the top bar.</p>' +
         '<button class="btn bp" onclick="do_add_tank()">Add Your First Tank</button></div>';
}
function today_str() { return new Date().toISOString().slice(0,10); }
function scard(l, v, s) {
  return '<div class="scard"><div class="slbl">' + l + '</div><div class="sval">' + v + '</div>' + (s ? '<div class="ssub">' + s + '</div>' : '') + '</div>';
}
function fgh(lbl, inp_html, hint) {
  return '<div class="fg"><label>' + lbl + '</label>' + inp_html +
    (hint ? '<small style="font-size:11px;color:var(--muted);margin-top:2px">' + hint + '</small>' : '') + '</div>';
}

// ===== PARAMETER TREND ALERTS =====
function get_water_recs(lr, tid) {
  if (!lr) return [];
  var recs = [];
  var uia = calc_uia(lr.ammonia, lr.ph, lr.temp_f);
  var uia_assumed = uia_temp_defaulted(lr.temp_f);

  // Determine if tank is actively cycling so we can tailor advice
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  var cyc = tank ? cycle_status(tid) : null;
  var cycling_active = tank && !tank.cycled && cyc && cyc.phase >= 1 && cyc.phase < 4;
  var has_fish = d.stock.filter(function(s){ return s.tank_id === tid && !s.preview; }).length > 0;

  if (lr.ammonia !== null && lr.ammonia > 0) {
    if (cycling_active) {
      if (has_fish && lr.ammonia > 2) {
        recs.push({level:'warn', param:'Ammonia TAN', msg:'Ammonia is high for a fish-in cycle. Do a <strong>20&ndash;30% partial water change</strong> to bring it below 2 ppm — but no lower, as bacteria still need ammonia to eat. Avoid full water changes during cycling.'});
      }
      // else: ammonia spike during cycling is normal — no recommendation needed
    } else {
      recs.push({level:'danger', param:'Ammonia TAN', msg:'Do a 25&ndash;50% water change immediately. Check for dead fish, uneaten food, or overcrowding. Increase surface aeration. Recheck in 24 hours.'});
    }
  }

  if (uia !== null && uia >= 0.05) {
    if (cycling_active && !has_fish) {
      // Fishless cycling — UIA has no fish to harm, skip warning
    } else if (cycling_active && has_fish) {
      recs.push({level:'danger', param:'Ammonia UIA', msg:'UIA is above the toxic threshold' + (uia_assumed ? ' (calculated at 25&deg;C default)' : '') + '. Do a <strong>20&ndash;30% partial water change</strong> to protect your fish. Do not reduce ammonia to 0 — leave some for the cycling bacteria.'});
    } else {
      recs.push({level:'danger', param:'Ammonia UIA', msg:'Emergency water change now.' + (uia_assumed ? ' (Calculated at 25&deg;C default — actual toxicity may differ.)' : '') + ' At high pH and temperature, even moderate TAN becomes lethal. A partial water change lowers both TAN and pH slightly, reducing UIA immediately.'});
    }
  } else if (uia !== null && uia >= 0.02 && uia < 0.05 && !cycling_active) {
    recs.push({level:'warn', param:'Ammonia UIA', msg:'UIA is approaching the danger threshold of 0.05 ppm.' + (uia_assumed ? ' (Calculated at 25&deg;C default.)' : '') + ' Monitor closely. A water change now prevents it crossing into toxic territory.'});
  }

  if (lr.nitrite !== null && lr.nitrite > 0) {
    if (cycling_active) {
      if (has_fish) {
        recs.push({level:'warn', param:'Nitrite', msg:'Nitrite spike is expected during cycling. To protect fish short-term, add <strong>aquarium salt (1 tsp per gal)</strong> — it blocks nitrite uptake without disrupting the cycle. Avoid large water changes.'});
      }
      // else: nitrite spike during fishless cycling is normal — no recommendation
    } else {
      recs.push({level:'danger', param:'Nitrite', msg:'Do a 25&ndash;50% water change. Adding aquarium salt (1 tsp per gal) helps fish tolerate nitrite short-term by blocking uptake. Reduce feeding. Tank may still be cycling.'});
    }
  }

  if (lr.nitrate !== null && lr.nitrate > 40) {
    recs.push({level:'danger', param:'Nitrate', msg:'Do a 30&ndash;50% water change to pull nitrate below 20 ppm. Reduce feeding frequency. Adding fast-growing plants (hornwort, water wisteria) consumes nitrate continuously.'});
  } else if (lr.nitrate !== null && lr.nitrate > 20 && !cycling_active) {
    recs.push({level:'warn', param:'Nitrate', msg:'Nitrate is elevated. A 25% water change will help. Consider increasing change frequency or adding plants to keep it under 20 ppm long-term.'});
  }

  if (lr.ph !== null && lr.ph < 6.0) {
    recs.push({level:'danger', param:'pH', msg:'pH is critically low. Add crushed coral to the filter or substrate — it buffers slowly and safely. Avoid liquid pH-up; it causes dangerous swings. Max safe change: 0.2 units per day.'});
  } else if (lr.ph !== null && lr.ph < 6.5) {
    recs.push({level:'warn', param:'pH', msg:'pH is slightly low. Add crushed coral or aragonite to buffer naturally. Check KH — if KH is near zero, pH will keep crashing. Driftwood in the tank also contributes to acidity.'});
  } else if (lr.ph !== null && lr.ph > 8.0) {
    recs.push({level:'danger', param:'pH', msg:'pH is very high. Mix in RO or distilled water during water changes to dilute. Driftwood and Indian almond leaves lower pH gradually. Avoid chemical pH-down — it causes instability.'});
  } else if (lr.ph !== null && lr.ph > 7.5) {
    recs.push({level:'warn', param:'pH', msg:'pH is slightly high. Driftwood or peat moss in the filter will lower it gradually. Indian almond leaves also help and are safe for all fish.'});
  }
  if (lr.gh !== null && lr.gh < 2) {
    recs.push({level:'danger', param:'Hardness (GH)', msg:'Water is critically soft. Add Seachem Equilibrium, crushed coral, or a Wonder Shell to raise GH. Extremely soft water causes osmotic stress and interferes with fish osmoregulation.'});
  } else if (lr.gh !== null && lr.gh < 4) {
    recs.push({level:'warn', param:'Hardness (GH)', msg:'GH is slightly low. Add Seachem Equilibrium or crushed coral gradually — raise by no more than 2 dGH per day to avoid stressing fish.'});
  } else if (lr.gh !== null && lr.gh > 15) {
    recs.push({level:'danger', param:'Hardness (GH)', msg:'Water is very hard. Mix in RO or distilled water during water changes to reduce GH gradually. Peat moss in the filter also softens water over time.'});
  } else if (lr.gh !== null && lr.gh > 12) {
    recs.push({level:'warn', param:'Hardness (GH)', msg:'GH is slightly high. Replace a portion of water change volume with RO or distilled water to bring it down slowly.'});
  }
  if (lr.temp_f !== null) {
    var tc = Math.round((lr.temp_f - 32) * 5 / 9);
    if (tc > 30) {
      recs.push({level:'danger', param:'Temperature', msg:'Tank is too hot. Increase surface agitation to boost oxygenation (heat reduces O2). Float a bag of ice, remove the lid, or point a fan at the water surface. Check heater for malfunction.'});
    } else if (tc < 18) {
      recs.push({level:'danger', param:'Temperature', msg:'Tank is too cold for tropical fish. Check the heater is on and set correctly. Verify the heater wattage is sufficient (roughly 5W per gallon for unheated rooms).'});
    }
  }
  return recs;
}

function get_param_alerts(tid) {
  var entries = get_water(tid);
  if (entries.length < 2) return [];
  var alerts = [];
  var last3 = entries.slice(-3);
  var last = last3[last3.length - 1];
  var prev = last3[last3.length - 2];

  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  var cyc = tank ? cycle_status(tid) : null;
  var cycling_active = tank && !tank.cycled && cyc && cyc.phase >= 1 && cyc.phase < 4;
  var has_fish = d.stock.filter(function(s){ return s.tank_id === tid && !s.preview; }).length > 0;

  // Persistent ammonia — suppress during cycling (expected), unless fish-in and very high
  if (last.ammonia !== null && last.ammonia > 0 && prev.ammonia !== null && prev.ammonia > 0) {
    if (!cycling_active) {
      alerts.push({level:'danger', msg:'Ammonia TAN has been elevated across multiple tests (' + prev.ammonia + ' ppm → ' + last.ammonia + ' ppm). Do a 25-50% water change immediately and recheck in 24h.'});
    } else if (has_fish && last.ammonia > 2) {
      alerts.push({level:'warn', msg:'Ammonia TAN is ' + last.ammonia + ' ppm during a fish-in cycle. Do a 20-30% partial water change to bring it below 2 ppm — leave some for bacteria. Avoid full water changes during cycling.'});
    }
  }
  // UIA — always warn if dangerous and there are fish; suppress for fishless cycling
  var last_uia = calc_uia(last.ammonia, last.ph, last.temp_f);
  var uia_temp_note_alert = uia_temp_defaulted(last.temp_f) ? ' (temperature not logged — assumed 25°C)' : '';
  if (last_uia !== null && last_uia >= 0.05 && (!cycling_active || has_fish)) {
    alerts.push({level:'danger', msg:'Un-ionized ammonia (UIA) is ' + last_uia + ' ppm — above the toxic threshold of 0.05 ppm' + uia_temp_note_alert + '. Even if TAN looks moderate, UIA at this pH and temperature is lethal. Do an immediate water change and lower pH slightly.'});
  } else if (last_uia !== null && last_uia >= 0.02 && !cycling_active) {
    alerts.push({level:'warn', msg:'Un-ionized ammonia (UIA) is ' + last_uia + ' ppm — approaching the danger threshold of 0.05 ppm' + uia_temp_note_alert + '. Monitor closely and be ready for a water change.'});
  }
  // Persistent nitrite — during cycling it is expected; just remind not to add fish
  if (last.nitrite !== null && last.nitrite > 0 && prev.nitrite !== null && prev.nitrite > 0) {
    if (cycling_active) {
      alerts.push({level:'warn', msg:'Nitrite spike is ongoing — cycling is in progress. Do not add fish yet. Avoid large water changes.'});
    } else {
      alerts.push({level:'danger', msg:'Nitrite remains elevated across multiple tests (' + prev.nitrite + ' ppm → ' + last.nitrite + ' ppm). Tank may not be fully cycled. Hold off adding fish.'});
    }
  }
  // High nitrate
  if (last.nitrate !== null && last.nitrate > 40) {
    alerts.push({level:'warn', msg:'Nitrate is high (' + last.nitrate + ' ppm). Do a 25-30% water change to reduce it. Target is below 20 ppm.'});
  }
  // Rising nitrate trend
  if (last.nitrate !== null && prev.nitrate !== null && last.nitrate > prev.nitrate + 15) {
    alerts.push({level:'warn', msg:'Nitrate rising fast (' + prev.nitrate + ' → ' + last.nitrate + ' ppm). Consider increasing water change frequency.'});
  }
  // pH drop
  if (last.ph !== null && prev.ph !== null && prev.ph - last.ph >= 0.3) {
    alerts.push({level:'warn', msg:'pH dropped ' + (prev.ph - last.ph).toFixed(2) + ' units between tests (' + prev.ph + ' → ' + last.ph + '). Sudden pH swings stress fish. Check buffering capacity (KH).'});
  }
  // Temperature drop
  if (last.temp_f !== null && prev.temp_f !== null && Math.abs(last.temp_f - prev.temp_f) >= 4) {
    alerts.push({level:'warn', msg:'Temperature changed ' + Math.abs(d_t(last.temp_f) - d_t(prev.temp_f)).toFixed(1) + t_lbl() + ' between tests (' + d_t(prev.temp_f) + ' → ' + d_t(last.temp_f) + t_lbl() + '). Rapid swings cause stress and disease.'});
  }
  return alerts;
}

// ===== CYCLE CARD =====
// ===== STARTUP METHOD TRACKER =====
function save_startup_method(method) {
  var d = ld(), tid = at();
  d.tanks = d.tanks.map(function(t) {
    if (t.id !== tid) return t;
    var patch = {startup_method: method};
    // Only set start date once, when method is first picked
    if (!t.startup_date && method) patch.startup_date = today_str();
    return Object.assign({}, t, patch);
  });
  sv(d); r_dash();
}
function save_substrate_liters(val) {
  var d = ld(), tid = at(), v = parseFloat(val) || 0;
  d.tanks = d.tanks.map(function(t){ return t.id === tid ? Object.assign({}, t, {substrate_liters: v}) : t; });
  sv(d); r_life(); r_dash();
}
function save_startup_date(date_str) {
  var d = ld(), tid = at();
  d.tanks = d.tanks.map(function(t) {
    return t.id === tid ? Object.assign({}, t, {startup_date: date_str}) : t;
  });
  sv(d); r_dash();
}
function mark_startup_done() {
  var d = ld(), tid = at();
  d.tanks = d.tanks.map(function(t) {
    return t.id === tid ? Object.assign({}, t, {startup_done: true}) : t;
  });
  sv(d); r_dash();
}
function r_startup_card(tid) {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; }); if (!tank) return '';
  var age = Math.floor((Date.now() - new Date(tank.setup_date + 'T00:00:00').getTime()) / 86400000);
  if (age > 270 || tank.cycled) return '';

  var method = tank.startup_method || '';
  if (tank.startup_done) return '';
  if (!method || method === 'standard') return '';

  var start_d = tank.startup_date || tank.setup_date;
  var elapsed = Math.max(0, Math.floor((Date.now() - new Date(start_d + 'T00:00:00').getTime()) / 86400000));

  if (method === 'dark') {
    // Dark Start: ~7 weeks total before fish can be added
    // Phase 0: Setup (day 0)        — fill tank, block all light, run filter, add ammonia source
    // Phase 1: Dark cycling (1-28)  — complete blackout while bacteria establish + cycling begins
    // Phase 2: Light intro (29-42)  — gradual photoperiod increase, watch for algae
    // Phase 3: Verify water (43+)   — confirm NH3 & NO2 = 0, nitrate present, safe for fish
    var total = 49; // 7 weeks as reference for the progress bar
    var pct = Math.min(100, Math.round(elapsed / total * 100));
    var steps = ['Setup', 'Dark cycling', 'Light intro', 'Verify water', 'Add fish'];
    var cur_step, color, phase_lbl, phase_desc, tip;

    if (elapsed < 1) {
      cur_step = 0; color = '#9ca3af'; phase_lbl = 'Day 0 — Setup';
      phase_desc = 'Fill the tank with dechlorinated water. Turn off ALL lights immediately and cover the tank if natural light enters the room. Start the filter now — cycling begins in the dark. Add your ammonia source (pure ammonia, fish food, or established media) to feed the bacteria. CO2 off.';
      tip = null;
    } else if (elapsed < 29) {
      var rem = 28 - elapsed;
      cur_step = 1; color = '#1a6b8a'; phase_lbl = 'Dark cycling — day ' + elapsed + ' of 28';
      phase_desc = rem + ' day' + (rem !== 1 ? 's' : '') + ' remaining. Tank is in complete darkness while beneficial bacteria establish on the filter media and substrate. Cycling is running simultaneously — test NH3, NO2, and NO3 every 3-4 days (open the lid briefly with the lights off, or use a torch). Do not turn the lights on.';
      tip = '<span style="font-size:16px">&#x1F506;</span><span style="font-size:13px;font-weight:600">Lights OFF for ' + rem + ' more day' + (rem !== 1 ? 's' : '') + '</span><span style="font-size:12px;color:var(--muted)"> — test water in the dark with a torch</span>';
    } else if (elapsed < 43) {
      var rem = 42 - elapsed;
      cur_step = 2; color = '#e8a838'; phase_lbl = 'Light introduction — day ' + elapsed;
      phase_desc = 'Start with 4-5 hours of light per day and increase by 1 hour every 3 days (target: 8-10 hrs/day). Watch closely for algae every single day — the dark period makes it unlikely, but catch any outbreak early. Reduce photoperiod immediately if algae appears. Keep testing water: NH3 and NO2 should be close to 0 by now.';
      tip = '<span style="font-size:14px">&#x1F331;</span><span style="font-size:13px">Algae alert period — inspect the tank daily. ' + rem + ' days until verification phase.</span>';
    } else {
      cur_step = 3; color = '#3ab87a'; phase_lbl = 'Verify water parameters';
      phase_desc = 'The dark start is complete. Before adding fish, confirm: Ammonia = 0 ppm, Nitrite = 0 ppm, Nitrate detectable (shows the cycle ran). Do a 30-50% water change to flush built-up nitrates, then add your first fish. Light schedule should now be 8-10 hours/day.';
      tip = '<span style="font-size:14px">&#x2705;</span><span style="font-size:13px;font-weight:600">Final check before fish:</span><span style="font-size:12px;color:var(--muted)"> NH3 = 0 ppm, NO2 = 0 ppm, NO3 present. Do a 30-50% water change, then add fish.</span>';
    }

    var h = '<div class="card" style="border-left:4px solid ' + color + '">';
    h += '<div class="ctitle">Dark Start Tracker <span class="pill" style="background:' + color + ';color:#fff;font-size:12px">' + phase_lbl + '</span></div>';
    h += '<div class="bl-bar"><div class="bl-fill" style="width:' + pct + '%;background:' + color + '"></div></div>';
    h += '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin:3px 0 8px">';
    steps.forEach(function(s, i) {
      var cur = i === cur_step, done = i < cur_step;
      h += '<span style="' + (cur ? 'color:'+color+';font-weight:700' : done ? 'color:var(--ok)' : '') + '">' + s + '</span>';
    });
    h += '</div>';
    h += '<p style="font-size:13px;line-height:1.5">' + esc(phase_desc) + '</p>';

    // Parameter warnings based on last water reading (substrate method hardcoded for dark start)
    if (elapsed >= 1 && cur_step < 3) {
      // Dark start always uses active substrate as the ammonia source — method is fixed, no selector needed
      var cm = 'substrate';
      // Parameter warnings based on last water reading
      var wentries = get_water(tid);
      var wlast = wentries.length ? wentries[wentries.length - 1] : null;
      var wnh3 = wlast ? wlast.ammonia : null;
      var wno2 = wlast ? wlast.nitrite : null;
      var pref = get_pref();
      var wc_vol = function(pct) {
        var v = pref.vol === 'L' ? tank.liters : tank.gallons;
        var u = pref.vol === 'L' ? 'L' : 'gal';
        return '~' + Math.round(v * pct) + u;
      };
      var cwarns = [];
      // Dark start is always fishless — no fish-in branch
      if (cm === 'substrate') {
        // Active substrate (ADA Amazonia etc.) releases ammonia naturally — no dosing needed
        if (wnh3 !== null && wnh3 < 1) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — still building up from the substrate. Normal in the first 1-2 weeks. No action needed yet.'});
        if (wnh3 !== null && wnh3 > 6) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — unusually high from the substrate. Do a small 20% water change to dilute slightly, then monitor.'});
      } else if (cm === 'ammonia') {
        if (wnh3 !== null && wnh3 < 1) cwarns.push({level:'warn', msg:'Ammonia is only ' + wnh3 + ' ppm — too low to seed bacteria. Dose pure ammonia to reach 2-4 ppm (do this in the dark — no need to turn lights on).'});
        if (wnh3 !== null && wnh3 > 5) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — above 5 ppm may inhibit bacteria. Add fresh water to dilute down to 2-4 ppm.'});
      } else if (cm === 'food') {
        if (wnh3 !== null && wnh3 > 4) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — likely too much food decomposing. Remove visible food debris and reduce the amount added.'});
      } else if (cm === 'media') {
        if (wnh3 !== null && wnh3 > 2) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — bacteria need a food source. Add a small pinch of fish food daily to keep them active.'});
      } else {
        if (wnh3 !== null && wnh3 < 1) cwarns.push({level:'warn', msg:'Ammonia is only ' + wnh3 + ' ppm. Select your cycling method above for specific guidance on dosing.'});
        if (wnh3 !== null && wnh3 > 5) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — very high. Select your cycling method above for specific guidance.'});
      }
      cwarns.forEach(function(w) {
        var bg = w.level === 'danger' ? '#fdecea' : '#fef3d5';
        var bc = w.level === 'danger' ? 'var(--danger)' : 'var(--warn)';
        var ic = w.level === 'danger' ? '&#x1F6A8;' : '&#x26A0;&#xFE0F;';
        h += '<div style="display:flex;align-items:flex-start;gap:8px;margin-top:6px;background:' + bg + ';border-left:3px solid ' + bc + ';padding:8px 10px;border-radius:0 6px 6px 0">' +
             '<span style="font-size:14px">' + ic + '</span><span style="font-size:12px">' + w.msg + '</span></div>';
      });
      if (!cwarns.length && wlast && (wnh3 !== null || wno2 !== null)) {
        var ok_parts = [];
        if (wnh3 !== null) ok_parts.push('NH3: ' + wnh3 + ' ppm');
        if (wno2 !== null) ok_parts.push('NO2: ' + wno2 + ' ppm');
        h += '<div style="font-size:12px;color:var(--ok);margin-top:6px">&#x2713; Readings look good for a ' + (cycle_lbl === 'Not set' ? 'dark start cycle' : cycle_lbl.toLowerCase()) + ' — ' + ok_parts.join(', ') + '</div>';
      }
      if (wentries.length) {
        h += '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;background:#e8f4fd;border-left:3px solid #4db8d4;padding:8px 10px;border-radius:0 6px 6px 0">' +
             '<span style="font-size:16px">&#x1F9EA;</span>' +
             '<span style="font-size:13px;font-weight:600">Test every 3-4 days</span>' +
             '<span style="font-size:12px;color:var(--muted)"> — NH3, NO2, NO3 (test in the dark or with a low torch)</span></div>';
      }
    }

    if (tip) {
      h += '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;background:#e8f4fd;border-left:3px solid ' + color + ';padding:8px 10px;border-radius:0 6px 6px 0">' + tip + '</div>';
    }
    h += '<p style="font-size:12px;color:var(--muted);margin-top:8px;background:#f5f8fb;padding:8px 10px;border-radius:6px">' +
         '<strong>Timeline:</strong> 4 weeks dark → 2 weeks light intro → confirm water → add fish. ' +
         'Total: ~7 weeks. Cycling happens during the dark period, so no extra cycling time is needed afterward.</p>';
    h += '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">';
    h += '<button class="btn bg bs" onclick="mark_startup_done()">Mark complete — ready to add fish</button>';
    h += '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)">Started: <input type="date" value="' + start_d + '" style="font-size:12px;padding:2px 6px;border-radius:4px;border:1px solid #ccc" onchange="save_startup_date(this.value)"></div>';
    h += '</div></div>';
    return h;
  }

  if (method === 'dry') {
    // Dry Start: ~12 weeks total before fish can be added
    // Phase 0: Plant emersed (0-6)     — no water, moist substrate, seal for humidity
    // Phase 1: Emersed growth (7-41)   — mist daily, roots establishing, lights on
    // Phase 2: Flood tank (42-44)      — slowly fill over 1-2 days, start filter
    // Phase 3: Nitrogen cycle (45+)    — standard cycling, 4-8 weeks, then fish
    var total = 84; // 12 weeks reference
    var pct = Math.min(100, Math.round(elapsed / total * 100));
    var steps = ['Plant emersed', 'Growth', 'Flood', 'Nitrogen cycle', 'Add fish'];
    var cur_step, color, phase_lbl, phase_desc, tip;

    if (elapsed < 7) {
      cur_step = 0; color = '#3ab87a'; phase_lbl = 'Day ' + elapsed + ' — Planting phase';
      phase_desc = 'No standing water yet. Plant directly into moist (not wet) substrate — roots should contact the soil. Lightly mist everything, then seal the top with cling wrap or a glass lid to trap humidity above 80%. Keep lights on 10-12 hours/day. CO2 is off — plants absorb CO2 directly from air.';
      tip = '<span style="font-size:14px">&#x1F4A7;</span><span style="font-size:13px">No water in tank yet. Just moist substrate + sealed lid for humidity.</span>';
    } else if (elapsed < 42) {
      var rem = 41 - elapsed;
      cur_step = 1; color = '#4db8d4'; phase_lbl = 'Emersed growth — day ' + elapsed + ' of 41';
      phase_desc = rem + ' day' + (rem !== 1 ? 's' : '') + ' remaining. Mist the plants twice daily with dechlorinated water. Look for new leaf or runner growth — this means roots are establishing in the substrate. Remove any white mould immediately. Keep the lid sealed between mistings. Light: 10-12 hrs/day.';
      tip = '<span style="font-size:16px">&#x1F4A6;</span><span style="font-size:13px;font-weight:600">Mist twice daily</span><span style="font-size:12px;color:var(--muted)"> — dechlorinated water, keep humidity &gt;80%</span>';
    } else if (elapsed < 45) {
      cur_step = 2; color = '#e8a838'; phase_lbl = 'Flood the tank';
      phase_desc = 'Plants are established. Fill the tank slowly over 1-2 days using dechlorinated water — do not rush or pour directly onto the plants. Start the filter once the water level is over the intake. Some plants will shed their emersed-form leaves and grow new submersed leaves — this is completely normal. Do not add fish yet.';
      tip = '<span style="font-size:14px">&#x26A0;&#xFE0F;</span><span style="font-size:13px">Fill slowly — avoid disturbing the substrate. Leaf shedding is normal during transition.</span>';
    } else {
      cur_step = 3; color = '#9b59b6'; phase_lbl = 'Nitrogen cycling';
      phase_desc = 'Tank is flooded. Now run a standard nitrogen cycle before adding fish: add an ammonia source, test NH3, NO2, and NO3 every 2-3 days, and wait for both ammonia and nitrite to drop to 0 with nitrate building up. This typically takes 4-8 weeks. The cycle tracker below will guide you through.';
      tip = '<span style="font-size:14px">&#x1F9EA;</span><span style="font-size:13px">Cycling now — check the Nitrogen Cycle Tracker below for daily guidance.</span>';
    }

    var h = '<div class="card" style="border-left:4px solid ' + color + '">';
    h += '<div class="ctitle">Dry Start Tracker <span class="pill" style="background:' + color + ';color:#fff;font-size:12px">' + phase_lbl + '</span></div>';
    h += '<div class="bl-bar"><div class="bl-fill" style="width:' + pct + '%;background:' + color + '"></div></div>';
    h += '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin:3px 0 8px">';
    steps.forEach(function(s, i) {
      var cur = i === cur_step, done = i < cur_step;
      h += '<span style="' + (cur ? 'color:'+color+';font-weight:700' : done ? 'color:var(--ok)' : '') + '">' + s + '</span>';
    });
    h += '</div>';
    h += '<p style="font-size:13px;line-height:1.5">' + esc(phase_desc) + '</p>';
    if (tip) {
      h += '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;background:#e8f4fd;border-left:3px solid ' + color + ';padding:8px 10px;border-radius:0 6px 6px 0">' + tip + '</div>';
    }
    h += '<p style="font-size:12px;color:var(--muted);margin-top:8px;background:#f5f8fb;padding:8px 10px;border-radius:6px">' +
         '<strong>Timeline:</strong> 6 weeks emersed → flood over 1-2 days → 4-8 weeks nitrogen cycle → add fish. ' +
         'Total: ~12-14 weeks. Plants have very strong roots by the time fish arrive.</p>';
    h += '<div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">';
    h += '<button class="btn bg bs" onclick="mark_startup_done()">Mark dry start complete (flooded + cycled)</button>';
    h += '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)">Started: <input type="date" value="' + start_d + '" style="font-size:12px;padding:2px 6px;border-radius:4px;border:1px solid #ccc" onchange="save_startup_date(this.value)"></div>';
    h += '</div></div>';
    return h;
  }

  return '';
}

// Method picker shown when startup_method not yet set (called from r_setup_card area)
function r_startup_picker(tid) {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; }); if (!tank) return '';
  var age = Math.floor((Date.now() - new Date(tank.setup_date + 'T00:00:00').getTime()) / 86400000);
  if (age > 60 || tank.cycled || tank.startup_method || tank.startup_done) return '';
  var h = '<div class="card" style="border-left:4px solid #4db8d4">';
  h += '<div class="ctitle">Choose Your Startup Method</div>';
  h += '<p style="font-size:13px;line-height:1.5;margin-bottom:10px">How do you plan to start this aquarium? Each method has different steps to track. You can change this at any time.</p>';
  h += '<div style="display:flex;flex-direction:column;gap:8px">';
  h += '<button class="btn bg" style="text-align:left;padding:10px 14px" data-sm="standard" onclick="save_startup_method(this.dataset.sm)">' +
       '<strong>Standard — Nitrogen Cycle only</strong><br><span style="font-size:12px;color:var(--muted)">Fill with water, add an ammonia source and cycle. Most common approach.</span></button>';
  h += '<button class="btn bg" style="text-align:left;padding:10px 14px" data-sm="dark" onclick="save_startup_method(this.dataset.sm)">' +
       '<strong>Dark Start Method</strong><br><span style="font-size:12px;color:var(--muted)">Run the tank in complete darkness for 3-4 weeks before introducing light. Best for preventing early algae outbreaks in planted tanks.</span></button>';
  h += '<button class="btn bg" style="text-align:left;padding:10px 14px" data-sm="dry" onclick="save_startup_method(this.dataset.sm)">' +
       '<strong>Dry Start Method</strong><br><span style="font-size:12px;color:var(--muted)">Grow plants emersed (out of water) for 4-6 weeks before flooding. Gives plants a strong root system before any fish are added.</span></button>';
  h += '</div></div>';
  return h;
}

function r_cycle_card(tid) {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; }); if (!tank) return '';
  if (tank.cycled) return '';
  // Hide cycle card while dark start or dry start (pre-flood) is still in progress
  if (!tank.startup_done) {
    if (tank.startup_method === 'dark') return ''; // cycling happens inside dark start card
    if (tank.startup_method === 'dry') {
      // During dry start, suppress cycle card until flooding phase (day 45+)
      var su_start = tank.startup_date || tank.setup_date;
      var su_elapsed = Math.max(0, Math.floor((Date.now() - new Date(su_start + 'T00:00:00').getTime()) / 86400000));
      if (su_elapsed < 45) return '';
    }
  }
  var chk = tank.setup_chk || {};
  var startup_method = tank.startup_method || '';
  // Dark/dry start are always fishless with soil-based ammonia — exclude fish-in option
  var is_soil_start = startup_method === 'dark' || startup_method === 'dry';
  var is_fish_in = !is_soil_start && d.stock.filter(function(s){ return s.tank_id === tid; }).length > 0;
  var cm = chk.cycle_method || (is_fish_in ? 'fish_in' : '');
  var age = Math.floor((Date.now() - new Date(tank.setup_date + 'T00:00:00').getTime()) / 86400000);
  var cyc = cycle_status(tid);
  if (cyc.phase === 4) {
    var d2 = ld();
    d2.tanks = d2.tanks.map(function(t){ return t.id === tid ? Object.assign({}, t, {cycled:true}) : t; });
    sv(d2);
  }
  if (age > 180 && cyc.phase === 4) return '';
  var steps = ['Pre-cycle', 'NH3 spike', 'NO2 spike', 'NO2 falling', 'Cycled'];
  var h = '<div class="card" style="border-left:4px solid ' + cyc.color + '">';
  h += '<div class="ctitle">Nitrogen Cycle Tracker' +
       '<span class="pill" style="background:' + cyc.color + ';color:#fff;font-size:12px">' + cyc.label + '</span></div>';
  h += '<div class="bl-bar"><div class="bl-fill" style="width:' + cyc.pct + '%;background:' + cyc.color + '"></div></div>';
  h += '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin:3px 0 8px">';
  steps.forEach(function(s, i) {
    var cur = i === cyc.phase, done = i < cyc.phase;
    h += '<span style="' + (cur ? 'color:'+cyc.color+';font-weight:700' : done ? 'color:var(--ok)' : '') + '">' + s + '</span>';
  });
  h += '</div>';
  h += '<p style="font-size:13px;line-height:1.5">' + esc(cyc.desc) + '</p>';
  // Parameter warnings based on cycle type and latest readings
  if (cyc.phase > 0 && cyc.phase < 4) {
    var wentries = get_water(tid);
    var wlast = wentries.length ? wentries[wentries.length - 1] : null;
    var wnh3 = wlast ? wlast.ammonia : null;
    var wno2 = wlast ? wlast.nitrite : null;
    // Dry/dark start always uses active substrate — fix the method, skip the selector
    if (is_soil_start) cm = 'substrate';
    var cycle_lbl = cm === 'fish_in' ? 'Fish-in cycle' : cm === 'substrate' ? 'Fishless — active substrate' : cm === 'ammonia' ? 'Fishless — pure ammonia' : cm === 'food' ? 'Fishless — fish food' : cm === 'media' ? 'Fishless — established media' : 'Not set';
    var pref = get_pref();
    var wc_vol = function(pct) {
      var v = pref.vol === 'L' ? tank.liters : tank.gallons;
      var u = pref.vol === 'L' ? 'L' : 'gal';
      return '~' + Math.round(v * pct) + u;
    };
    if (!is_soil_start) {
      h += '<div style="margin:6px 0 8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
           '<label style="font-size:12px;color:var(--muted)">Cycle method:</label>' +
           '<select style="font-size:12px;padding:2px 6px;border-radius:4px;border:1px solid #ccc" onchange="save_cycle_method(this.value)">' +
           '<option value=""'           + (cm===''           ? ' selected' : '') + '>Not specified</option>' +
           '<option value="fish_in"'    + (cm==='fish_in'    ? ' selected' : '') + '>Fish-in (fish are in the tank)</option>' +
           '<option value="ammonia"'    + (cm==='ammonia'    ? ' selected' : '') + '>Fishless — pure ammonia</option>' +
           '<option value="food"'       + (cm==='food'       ? ' selected' : '') + '>Fishless — fish food / organic</option>' +
           '<option value="media"'      + (cm==='media'      ? ' selected' : '') + '>Fishless — established filter media</option>' +
           '</select></div>';
    }
    var cwarns = [];
    if (cm === 'fish_in' || (cm === '' && is_fish_in)) {
      // Fish-in: keep NH3 and NO2 below toxic levels at all times
      if (wnh3 !== null && wnh3 > 2)       cwarns.push({level:'danger', msg:'Ammonia is ' + wnh3 + ' ppm — critical. Do a 30-50% water change (' + wc_vol(0.4) + ') now and dose Seachem Prime to detoxify.'});
      else if (wnh3 !== null && wnh3 > 0.5) cwarns.push({level:'warn',   msg:'Ammonia is ' + wnh3 + ' ppm — harmful to fish. Do a 25% water change (' + wc_vol(0.25) + ') and dose Seachem Prime daily.'});
      if (wno2 !== null && wno2 > 1)        cwarns.push({level:'danger', msg:'Nitrite is ' + wno2 + ' ppm — critically toxic. Do a 30-50% water change (' + wc_vol(0.4) + ') immediately and dose Seachem Prime.'});
      else if (wno2 !== null && wno2 > 0.5) cwarns.push({level:'warn',   msg:'Nitrite is ' + wno2 + ' ppm — toxic to fish. Do a 25% water change (' + wc_vol(0.25) + ') and dose Seachem Prime.'});
    } else if (cm === 'substrate') {
      // Active substrate releases ammonia naturally — just monitor, no dosing needed
      if (wnh3 !== null && wnh3 < 1) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — still building up from the substrate. Normal in early weeks. No action needed.'});
      if (wnh3 !== null && wnh3 > 6) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — very high from substrate. Do a 20% water change to dilute slightly, then monitor.'});
    } else if (cm === 'ammonia') {
      if (wnh3 !== null && wnh3 < 1 && cyc.phase === 1) cwarns.push({level:'warn', msg:'Ammonia is only ' + wnh3 + ' ppm — too low to seed bacteria. Dose pure ammonia to reach 2-4 ppm.'});
      if (wnh3 !== null && wnh3 > 5) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — above 5 ppm may inhibit bacteria. Add fresh water to dilute down to 2-4 ppm.'});
    } else if (cm === 'food') {
      if (wnh3 !== null && wnh3 > 4) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — likely too much food decomposing. Remove visible food debris and reduce the amount added.'});
    } else if (cm === 'media') {
      if (wnh3 !== null && wnh3 > 2) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — the seeded bacteria need a food source. Add a small pinch of fish food daily to keep them active.'});
    } else {
      // No method selected — generic fallback
      if (wnh3 !== null && wnh3 < 1 && cyc.phase === 1) cwarns.push({level:'warn', msg:'Ammonia is only ' + wnh3 + ' ppm. If using pure ammonia, dose to 2-4 ppm. If using fish food, add a little more.'});
      if (wnh3 !== null && wnh3 > 5) cwarns.push({level:'warn', msg:'Ammonia is ' + wnh3 + ' ppm — very high. Above 5 ppm may slow bacterial growth. Select your cycle method above for specific guidance.'});
    }
    cwarns.forEach(function(w) {
      var bg = w.level === 'danger' ? '#fdecea' : '#fef3d5';
      var bc = w.level === 'danger' ? 'var(--danger)' : 'var(--warn)';
      var ic = w.level === 'danger' ? '&#x1F6A8;' : '&#x26A0;&#xFE0F;';
      h += '<div style="display:flex;align-items:flex-start;gap:8px;margin-top:6px;background:' + bg + ';border-left:3px solid ' + bc + ';padding:8px 10px;border-radius:0 6px 6px 0">' +
           '<span style="font-size:14px">' + ic + '</span><span style="font-size:12px">' + w.msg + '</span></div>';
    });
    if (!cwarns.length && wlast) {
      var ok_parts = [];
      if (wnh3 !== null) ok_parts.push('NH3: ' + wnh3 + ' ppm');
      if (wno2 !== null) ok_parts.push('NO2: ' + wno2 + ' ppm');
      if (ok_parts.length) h += '<div style="font-size:12px;color:var(--ok);margin-top:6px">&#x2713; Current readings within safe range for a ' + cycle_lbl.toLowerCase() + ' — ' + ok_parts.join(', ') + '</div>';
    }
  }
  if (cyc.phase < 4) {
    if (cyc.test_freq) {
      h += '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;background:#e8f4fd;border-left:3px solid #4db8d4;padding:8px 10px;border-radius:0 6px 6px 0">' +
           '<span style="font-size:16px">&#x1F9EA;</span>' +
           '<span style="font-size:13px;font-weight:600">Test every ' + cyc.test_freq + ' days</span>' +
           '<span style="font-size:12px;color:var(--muted)">— test NH3, NO2, NO3 and pH</span>' +
           '</div>';
    }
    var tl_map = {
      fish_in:   '4-8 weeks. Keep NH3 below 0.5 ppm and NO2 below 0.5 ppm at all times — do partial water changes and dose Seachem Prime whenever readings rise.',
      substrate: '4-8 weeks. Active substrate (e.g. ADA Amazonia) releases ammonia naturally — no dosing needed. Test every 2-3 days and wait for NH3 and NO2 to both reach 0 ppm. Do a 30-50% water change before adding fish.',
      ammonia:   '3-6 weeks. Re-dose ammonia to 2-4 ppm each time it drops to 0. Cycle is complete when both NH3 and NO2 drop to 0 within 24 hours of dosing.',
      food:      '4-8 weeks. Add a small pinch of food every 2-3 days. Remove any uneaten food to avoid over-dosing ammonia. Do not add fish until NH3 and NO2 both read 0 ppm.',
      media:     '1-2 weeks with established media — bacteria are already present and just need to multiply. Test daily. Do not add fish until NH3 and NO2 both read 0 ppm.'
    };
    var tl_txt = tl_map[cm] || '4-6 weeks total. Do not add fish until NH3 and NO2 both read 0 ppm.';
    h += '<p style="font-size:12px;color:var(--muted);margin-top:6px;background:#f5f8fb;padding:8px 10px;border-radius:6px"><strong>Typical timeline:</strong> ' + tl_txt + '</p>';
    h += '<div style="margin-top:8px"><button class="btn bg bs" onclick="mark_cycled(at())">Mark as Cycled Manually</button></div>';
  } else {
    h += '<div style="display:flex;align-items:flex-start;gap:8px;margin-top:8px;background:#eaf8f1;border-left:3px solid var(--ok);padding:10px 12px;border-radius:0 6px 6px 0">' +
         '<span style="font-size:18px">&#x1F4A7;</span>' +
         '<div><div style="font-size:13px;font-weight:600;color:var(--ok)">Do a 30-50% water change now</div>' +
         '<div style="font-size:12px;color:#555;margin-top:2px">Nitrates have built up during the cycle. Flush them out before adding your first fish. Treat the new water with dechlorinator first.</div></div>' +
         '</div>';
  }
  h += '</div>';
  return h;
}

// ===== SETUP CHECKLIST CARD =====
function r_setup_card(tid) {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; }); if (!tank) return '';
  if (tank.setup_dismissed) return '';
  var age = Math.floor((Date.now() - new Date(tank.setup_date + 'T00:00:00').getTime()) / 86400000);
  if (age > 90) return '';
  var chk = tank.setup_chk || {};
  var has_filter = d.equip.some(function(e){ return e.tank_id === tid && e.type === 'Filter'; });
  var has_heater = d.equip.some(function(e){ return e.tank_id === tid && e.type === 'Heater'; });
  var has_co2    = d.equip.some(function(e){ return e.tank_id === tid && e.type === 'CO2 System'; });
  var has_test   = d.water.some(function(w){ return w.tank_id === tid; });
  var cyc = cycle_status(tid);
  var cycle_started = chk.cycle_src || (cyc.phase >= 1);
  var stock_in_tank = d.stock.filter(function(s){ return s.tank_id === tid; });
  var needs_heater;
  if (tank.room_tmin != null) {
    // Room temp known: heater needed only if room min is below any fish's minimum temp
    needs_heater = stock_in_tank.length === 0
      ? tank.room_tmin < 72
      : stock_in_tank.some(function(s){ var sp = get_sp(d)[s.species_id]; return sp && tank.room_tmin < sp.tmin; });
  } else if (stock_in_tank.length > 0) {
    // Room temp unknown but fish present: heater needed if any fish requires warm water
    needs_heater = stock_in_tank.some(function(s){ var sp = get_sp(d)[s.species_id]; return sp && sp.tmin >= 70; });
  } else {
    // No fish, no room temp — can't determine yet, skip the heater item
    needs_heater = false;
  }
  var heater_label = tank.room_tmin != null
    ? 'Heater installed — room min (' + d_t(tank.room_tmin) + t_lbl() + ') is below some fish requirements'
    : 'Heater installed and set to target temperature';
  // CO2 only needed when the tank contains plants that require it.
  var plants_in_tank = d.plants.filter(function(p){ return p.tank_id === tid; });
  var needs_co2 = plants_in_tank.some(function(p){ return PL[p.plant_id] && PL[p.plant_id].co2; });
  var method = tank.startup_method || 'standard';
  var items;

  if (method === 'dark') {
    items = [
      {key:'rinsed',      auto:false, done:chk.rinsed||false,      label:'Tank, substrate, and decorations rinsed with no soap'},
      {key:'dechlo',      auto:false, done:chk.dechlo||false,      label:'Water dechlorinator purchased (Prime, Stress Coat, etc.)'},
      {key:'_filter',     auto:true,  done:has_filter,              label:'Filter installed and running'},
      needs_heater && {key:'_heater', auto:true, done:has_heater,   label:heater_label},
      {key:'lights_off',  auto:false, done:chk.lights_off||false,  label:'All lights turned off — tank in complete darkness'},
      {key:'covered',     auto:false, done:chk.covered||false,     label:'Tank covered or positioned away from natural light'},
      {key:'cycle_src',   auto:false, done:cycle_started,          label:'Ammonia source added for dark cycling (ammonia, fish food, or fish)'},
      {key:'_tested',     auto:true,  done:has_test,               label:'First water test logged (test in the dark with a torch)'},
      {key:'_cycled',     auto:true,  done:cyc.phase===4||tank.cycled||false, label:'Tank fully cycled — NH3 and NO2 both at 0 ppm'},
      (cyc.phase===4||tank.cycled) && {key:'post_wc', auto:false, done:chk.post_wc||false, label:'30-50% water change done after cycling — flush nitrates before adding fish'}
    ].filter(Boolean);

  } else if (method === 'dry') {
    var su_start = tank.startup_date || tank.setup_date;
    var su_elapsed = Math.max(0, Math.floor((Date.now() - new Date(su_start + 'T00:00:00').getTime()) / 86400000));
    var flooded = su_elapsed >= 42 || tank.startup_done;
    if (!flooded) {
      // Pre-flood checklist
      items = [
        {key:'substrate',   auto:false, done:chk.substrate||false,  label:'Substrate prepared and moistened (no standing water)'},
        {key:'planted',     auto:false, done:chk.planted||false,    label:'Plants planted with roots in contact with substrate'},
        {key:'sealed',      auto:false, done:chk.sealed||false,     label:'Tank top sealed with cling wrap or glass lid (humidity >80%)'},
        needs_co2 && {key:'_co2', auto:true, done:false,            label:'CO2 off — plants absorb CO2 from air during emersed phase'},
        {key:'lights_dry',  auto:false, done:chk.lights_dry||false, label:'Lights set to 10-12 hours/day for emersed growth'}
      ].filter(Boolean);
    } else {
      // Post-flood checklist
      items = [
        {key:'flooded',     auto:false, done:chk.flooded||false,    label:'Tank flooded slowly with dechlorinated water (over 1-2 days)'},
        {key:'dechlo',      auto:false, done:chk.dechlo||false,     label:'Water dechlorinator purchased (Prime, Stress Coat, etc.)'},
        {key:'_filter',     auto:true,  done:has_filter,            label:'Filter installed and running'},
        needs_heater && {key:'_heater', auto:true, done:has_heater, label:heater_label},
        needs_co2    && {key:'_co2',    auto:true, done:has_co2,    label:'CO2 system installed and running (required by your plants)'},
        {key:'cycle_src',   auto:false, done:cycle_started,        label:'Ammonia source added to start the nitrogen cycle'},
        {key:'_tested',     auto:true,  done:has_test,             label:'First water test logged'},
        {key:'_cycled',     auto:true,  done:cyc.phase===4||tank.cycled||false, label:'Tank fully cycled — NH3 and NO2 both at 0 ppm'},
        (cyc.phase===4||tank.cycled) && {key:'post_wc', auto:false, done:chk.post_wc||false, label:'30-50% water change done — flush nitrates before adding fish'}
      ].filter(Boolean);
    }

  } else {
    // Standard / default
    items = [
      {key:'rinsed',    auto:false, done:chk.rinsed||false,  label:'Tank, gravel, and decorations rinsed with no soap'},
      {key:'dechlo',    auto:false, done:chk.dechlo||false,  label:'Water dechlorinator purchased (Prime, Stress Coat, etc.)'},
      {key:'_filter',   auto:true,  done:has_filter,          label:'Filter installed and running'},
      needs_heater && {key:'_heater', auto:true, done:has_heater, label:heater_label},
      needs_co2    && {key:'_co2',    auto:true, done:has_co2,    label:'CO2 system installed and running (required by your plants)'},
      {key:'_tested',   auto:true,  done:has_test,            label:'First water test logged'},
      {key:'cycle_src', auto:false, done:cycle_started,       label:'Ammonia source added to start the cycle'},
      {key:'_cycled',   auto:true,  done:cyc.phase===4||tank.cycled||false, label:'Tank fully cycled — safe to add fish'},
      (cyc.phase===4 || tank.cycled) && {key:'post_wc', auto:false, done:chk.post_wc||false, label:'30-50% water change done — flush accumulated nitrates before adding first fish'}
    ].filter(Boolean);
  }
  var done_count = items.filter(function(i){ return i.done; }).length;
  var color = done_count === items.length ? 'var(--ok)' : 'var(--surf)';
  var h = '<div class="card" style="border-left:4px solid ' + color + '">';
  h += '<div class="ctitle">New Tank Setup Checklist <span style="font-weight:400;font-size:12px;color:var(--muted)">(' + done_count + '/' + items.length + ')</span>' +
       '<button class="btn bg bs" onclick="dismiss_setup(at())">Dismiss</button></div>';
  items.forEach(function(item) {
    var style = item.done ? 'text-decoration:line-through;color:var(--muted)' : '';
    var icon = item.done ? '<span style="color:var(--ok);font-size:15px">&#x2713;</span>' : '<span style="color:#ccc;font-size:15px">&#x25CB;</span>';
    if (item.auto) {
      h += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px">' +
           icon + '<span style="' + style + '">' + esc(item.label) + '</span>' +
           '<span style="font-size:10px;color:var(--muted)">(auto)</span></div>';
    } else {
      h += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:13px">' +
           '<input type="checkbox" ' + (item.done ? 'checked' : '') + ' data-key="' + item.key + '" onchange="upd_checklist(at(),this.dataset.key,this.checked)" style="width:auto;cursor:pointer">' +
           '<label style="cursor:pointer;' + style + '">' + esc(item.label) + '</label></div>';
    }
  });
  h += '</div>';
  return h;
}

// ===== TANK SELECTOR =====
function build_sel() {
  var d = ld(), sel = document.getElementById('t_sel'), cur = at();
  sel.innerHTML = '';
  if (!d.tanks.length) { sel.innerHTML = '<option value="">No tanks yet</option>'; return; }
  d.tanks.forEach(function(t) {
    var o = document.createElement('option');
    var label = (t.preview ? '[Preview] ' : '') + t.name + ' (' + d_v(t.gallons) + ' ' + v_lbl() + ')';
    o.value = t.id; o.textContent = label;
    if (t.id === cur) o.selected = true;
    sel.appendChild(o);
  });
}

// ===== TAB SWITCHER =====
function switch_tab(t) {
  document.querySelectorAll('.tab').forEach(function(b){ b.classList.remove('on'); });
  document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('on'); });
  document.querySelectorAll('.tab').forEach(function(b){ if (b.dataset.t === t) b.classList.add('on'); });
  cur_tab = t;
  document.getElementById('p-' + cur_tab).classList.add('on');
  render_tab();
}

// ===== DASHBOARD =====
function r_dash() {
  var tid = at(), d = ld(), el = document.getElementById('p-dash');
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  if (!tank) { el.innerHTML = no_tank(); return; }
  var has_therm = d.equip.some(function(e){ return e.tank_id === tid && e.type === 'Thermometer'; });

  var tasks = d.tasks.filter(function(x){ return x.tank_id === tid; })
    .sort(function(a,b){ return days_til(a.next_due) - days_til(b.next_due); });
  var nt = tasks.length ? tasks[0] : null;
  var nt_txt = nt ? (esc(nt.name) + ' in ' + days_til(nt.next_due) + 'd') : 'None set';
  var lr = last_r(tid), rng = overlap(tid);
  var pl_count = d.plants.filter(function(x){ return x.tank_id === tid; }).length;
  var cur_bl = calc_bioload(tid);
  var filter_mult = get_filter_mult(tid);
  var max_bl = Math.round(max_bioload(tank.gallons, pl_count, tank.substrate_liters) * filter_mult);
  var bl_pct = max_bl > 0 ? Math.min(100, Math.round(cur_bl / max_bl * 100)) : 0;
  var bl_cls = bioload_cls(cur_bl, max_bl);
  var bl_color = bl_cls === 'ok' ? 'var(--ok)' : bl_cls === 'warn' ? 'var(--warn)' : 'var(--danger)';

  var h = '';

  // Export reminder: warn if no backup in 30+ days (or never)
  var last_exp = parseInt(localStorage.getItem('aq_last_export') || '0', 10);
  var days_since_exp = last_exp ? Math.floor((Date.now() - last_exp) / 86400000) : 999;
  var has_real_data = d.tanks.filter(function(t){return !t.preview;}).length > 0;
  if (has_real_data && days_since_exp >= 30) {
    var exp_msg = last_exp ? ('Last backup was ' + days_since_exp + ' days ago.') : 'You have never backed up your data.';
    h += '<div style="display:flex;align-items:center;gap:10px;background:#fef3d5;border-left:4px solid var(--warn);padding:10px 14px;border-radius:0 8px 8px 0;margin-bottom:12px">' +
         '<span style="font-size:16px">&#x1F4BE;</span>' +
         '<span style="font-size:13px;flex:1">' + exp_msg + ' Your data is stored only in this browser — export a backup to keep it safe.</span>' +
         '<button class="btn bg bs" onclick="do_export()" style="white-space:nowrap;font-size:12px">Export now</button></div>';
  }

  // Maintenance banner
  var overdue = tasks.filter(function(x){ return days_til(x.next_due) < 0; });
  var due_today = tasks.filter(function(x){ return days_til(x.next_due) === 0; });
  if (overdue.length > 0 || due_today.length > 0) {
    var msg_parts = [];
    if (overdue.length) msg_parts.push(overdue.length + ' task' + (overdue.length > 1 ? 's' : '') + ' overdue');
    if (due_today.length) msg_parts.push(due_today.length + ' due today');
    h += '<div class="cwarn" style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">' +
         '<span>&#x26A0; Maintenance reminder: ' + msg_parts.join(', ') + '.</span>' +
         '<button class="btn bd bs" data-sw="maint" onclick="switch_tab(this.dataset.sw)">View Tasks</button></div>';
  }

  // Setup checklist
  h += r_setup_card(tid);

  // Startup method picker (shown for new tanks before method is chosen)
  h += r_startup_picker(tid);

  // Startup method tracker (dark start / dry start)
  h += r_startup_card(tid);

  // Cycle tracker
  h += r_cycle_card(tid);

  // Parameter trend alerts
  var p_alerts = get_param_alerts(tid);
  if (p_alerts.length) {
    p_alerts.forEach(function(a) {
      h += '<div class="' + (a.level === 'danger' ? 'cwarn' : 'cinfo') + '" style="margin-bottom:10px;font-weight:400;font-size:13px">' +
           '<strong>' + (a.level === 'danger' ? '&#x1F6A8; Alert:' : '&#x26A0; Trend:') + '</strong> ' + esc(a.msg) + '</div>';
    });
  }

  h += '<div class="dgrid">';
  h += scard('Tank Size', d_v(tank.gallons) + ' ' + v_lbl(), get_pref().vol === 'L' ? tank.gallons + ' gal' : tank.liters + ' L');
  var age = Math.max(0, Math.floor((Date.now() - new Date(tank.setup_date + 'T00:00:00').getTime()) / 86400000));
  h += scard('Tank Age', age + ' days', 'since ' + tank.setup_date);
  h += scard('Livestock', d.stock.filter(function(x){return x.tank_id===tid;}).length + ' entries', pl_count + ' plant species');
  h += '<div class="scard"><div class="slbl">BIOLOAD</div>' +
       '<div class="sval" style="color:' + bl_color + '">' + cur_bl + '<span style="font-size:14px;font-weight:400;color:var(--muted)"> / ' + max_bl + '</span></div>' +
       '<div class="ssub">' + bl_pct + '% full' + (cur_bl > max_bl ? ' - OVER LIMIT' : '') + '</div></div>';
  h += scard('Next Task', nt_txt, '');
  // Feeding card
  var last_f = last_feeding(tid), ft = feedings_today(tid);
  var fed_txt = last_f ? ts_ago(last_f.ts) : 'Never';
  var feed_sub = ft > 0 ? 'Today: ' + ft + 'x' + (ft > 2 ? ' &#x26A0; Overfeeding!' : '') : 'Not fed today';
  var feed_color = ft > 2 ? 'var(--danger)' : 'var(--deep)';
  h += '<div class="scard"><div class="slbl">LAST FED</div>' +
       '<div class="sval" style="font-size:16px;color:' + feed_color + '">' + fed_txt + '</div>' +
       '<div class="ssub">' + feed_sub + '</div>' +
       '<button class="btn bp bs" style="margin-top:8px;width:100%" onclick="open_feed_modal(at())">Log Feeding</button></div>';
  h += '</div>';

  h += '<div class="card"><div class="ctitle">Last Water Reading';
  if (lr) h += '<small style="font-weight:400;color:var(--muted)"> ' + lr.date + '</small>';
  h += '</div>';
  if (lr) {
    var ps = [];
    if (has_therm) ps.push({k:'temp_f', l:'Temperature', u:t_lbl(), mn:rng&&rng.temp.ok?d_t(rng.temp.min):null, mx:rng&&rng.temp.ok?d_t(rng.temp.max):null, tox:false, conv:d_t});
    ps.push(
      {k:'ammonia',   l:'Ammonia',          u:'ppm', mn:0,  mx:0,  tox:true,  conv:null},
      {k:'nitrite',   l:'Nitrite',          u:'ppm', mn:0,  mx:0,  tox:true,  conv:null},
      {k:'nitrate',   l:'Nitrate',          u:'ppm', mn:0,  mx:40, tox:false, conv:null},
      {k:'ph',        l:'pH',               u:'',    mn:rng&&rng.ph.ok?rng.ph.min:null, mx:rng&&rng.ph.ok?rng.ph.max:null, tox:false, conv:null},
      {k:'gh',        l:'Hardness (GH)',    u:'dGH', mn:rng&&rng.gh.ok?rng.gh.min:null, mx:rng&&rng.gh.ok?rng.gh.max:null, tox:false, conv:null}
    );
    // Only show Ca/Mg rows if they were logged for this reading
    if (lr.calcium !== null && lr.calcium !== undefined) {
      ps.push({k:'calcium',   l:'Calcium (Ca)',   u:'ppm', mn:20, mx:60, tox:false, conv:null});
      ps.push({k:'magnesium', l:'Magnesium (Mg)', u:'ppm', mn:5,  mx:20, tox:false, conv:null});
    }
    h += '<div class="tw"><table><tr><th>Parameter</th><th>Reading</th><th>Safe Range</th><th>Status</th></tr>';
    ps.forEach(function(p) {
      var raw = lr[p.k], val = (p.conv && raw !== null) ? p.conv(raw) : raw;
      var c = cls_val(raw, p.k === 'temp_f' ? (rng&&rng.temp.ok?rng.temp.min:null) : p.mn, p.k === 'temp_f' ? (rng&&rng.temp.ok?rng.temp.max:null) : p.mx, p.tox);
      var rng_txt = p.tox ? '0 ppm' : (p.mn !== null && p.mx !== null ? p.mn + '-' + p.mx + (p.u?' '+p.u:'') : '-');
      h += '<tr><td>' + p.l + '</td><td>' + (val !== null ? val + (p.u?' '+p.u:'') : '-') + '</td><td style="color:var(--muted)">' + rng_txt + '</td><td>' + pill(c) + '</td></tr>';
    });
    h += '</table></div>';
    // UIA — auto-calculated toxic ammonia fraction
    var dash_uia = calc_uia(lr.ammonia, lr.ph, lr.temp_f);
    if (dash_uia !== null) {
      var uia_col = dash_uia === 0 ? 'var(--ok)' : dash_uia < 0.05 ? 'var(--warn)' : 'var(--danger)';
      var uia_lbl = dash_uia === 0 ? 'Safe' : dash_uia < 0.05 ? 'Caution' : 'Toxic';
      var uia_temp_note = uia_temp_defaulted(lr.temp_f) ? ' <span style="color:var(--muted)">(temp assumed 25&deg;C)</span>' : '';
      h += '<div style="font-size:12px;margin-top:6px">Ammonia UIA (toxic fraction): <strong style="color:' + uia_col + '">' + dash_uia + ' ppm</strong>' +
           ' <span class="pill p' + (dash_uia === 0 ? 'ok' : dash_uia < 0.05 ? 'warn' : 'danger') + '" style="font-size:10px">' + uia_lbl + '</span>' +
           uia_temp_note +
           '<span style="color:var(--muted)"> &mdash; danger threshold 0.05 ppm</span></div>';
    }
    // Per-parameter recommendations when values are out of range
    var w_recs = get_water_recs(lr, tid);
    if (w_recs.length) {
      h += '<div style="margin-top:10px"><div style="font-size:12px;font-weight:600;margin-bottom:6px">&#x1F527; What to do</div>';
      w_recs.forEach(function(r) {
        h += '<div style="display:flex;gap:8px;font-size:12px;margin-bottom:5px;padding:7px 10px;' +
             'background:' + (r.level === 'danger' ? '#fff0f0' : '#fff8e5') + ';' +
             'border-left:3px solid ' + (r.level === 'danger' ? 'var(--danger)' : 'var(--warn)') + ';border-radius:0 6px 6px 0">' +
             '<strong style="flex-shrink:0;color:' + (r.level === 'danger' ? 'var(--danger)' : 'var(--warn)') + '">' + r.param + ':</strong>' +
             '<span>' + r.msg + '</span></div>';
      });
      h += '</div>';
    }
    // Ca:Mg ratio note when both are logged
    if (lr.calcium !== null && lr.calcium !== undefined && lr.magnesium !== null && lr.magnesium !== undefined && lr.magnesium > 0) {
      var ca_mg_ratio = Math.round(lr.calcium / lr.magnesium * 10) / 10;
      var ratio_cls = ca_mg_ratio >= 3 && ca_mg_ratio <= 5 ? 'var(--ok)' : ca_mg_ratio >= 2 && ca_mg_ratio <= 6 ? 'var(--warn)' : 'var(--danger)';
      h += '<div style="font-size:12px;margin-top:6px">Ca:Mg ratio: <strong style="color:' + ratio_cls + '">' + ca_mg_ratio + ':1</strong>' +
           '<span style="color:var(--muted)"> &mdash; ideal is 3:1 to 5:1 for planted tanks</span></div>';
    }
  } else {
    h += '<p class="emsg">No readings yet. Go to the Logs tab to add one.</p>';
  }
  h += '</div>';
  if (tank.notes) h += '<div class="card"><div class="ctitle">Notes</div><p style="font-size:13px;color:var(--muted)">' + esc(tank.notes) + '</p></div>';
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
       '<button class="btn bg bs" onclick="do_edit_tank()">Edit Tank</button>' +
       '<button class="btn bd bs" onclick="do_del_tank()">Delete Tank</button></div>';
  el.innerHTML = h;
}

// ===== LIFE TAB =====
function r_life() {
  var tid = at(), d = ld(), el = document.getElementById('p-life');
  if (!d.tanks.find(function(t){return t.id===tid;})) { el.innerHTML = no_tank(); return; }
  var eq = d.equip.filter(function(x){return x.tank_id===tid;});
  var pl = d.plants.filter(function(x){return x.tank_id===tid;});
  var sk = d.stock.filter(function(x){return x.tank_id===tid;});
  var h = '';

  h += '<div class="card"><div class="ctitle">Equipment <button class="btn bp bs" onclick="do_add_equip()">+ Add</button></div>';
  var tank = d.tanks.find(function(t){return t.id===tid;});
  var sub_l = tank ? (tank.substrate_liters || 0) : 0;
  h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">' +
       '<span style="font-size:13px;color:var(--muted)">Substrate volume:</span>' +
       '<input type="number" id="substrate_l_inp" min="0" step="0.5" value="' + (sub_l || '') + '" placeholder="e.g. 11" style="width:70px;font-size:13px;padding:3px 6px;border-radius:4px;border:1px solid #ccc">' +
       '<span style="font-size:13px;color:var(--muted)">L</span>' +
       '<button class="btn bg bs" onclick="save_substrate_liters(document.getElementById(\'substrate_l_inp\').value)">Save</button>' +
       (sub_l ? '<span style="font-size:12px;color:var(--muted)">Effective water volume: ' + Math.round((tank.liters - sub_l) * 10) / 10 + ' L — used for bioload capacity</span>' : '<span style="font-size:12px;color:var(--muted)">Substrate displaces water — set this to get accurate bioload capacity</span>') +
       '</div>';
  if (eq.length) {
    h += '<div class="tw"><table><tr><th>Type</th><th>Name</th><th>Brand</th><th>Configuration</th><th>Notes</th><th></th></tr>';
    eq.forEach(function(e) {
      var cfg_txt = eq_cfg_txt(e);
      h += '<tr><td>' + esc(e.type) + '</td><td>' + esc(e.name) + '</td><td>' + esc(e.brand) + '</td>' +
           '<td style="font-size:12px;color:' + (cfg_txt === '-' ? 'var(--muted)' : 'var(--text)') + '">' + esc(cfg_txt) + '</td>' +
           '<td>' + esc(e.notes) + '</td>' +
           '<td style="white-space:nowrap">' +
           '<button class="btn bg bs" data-id="' + e.id + '" onclick="do_edit_equip(this.dataset.id)">Edit</button> ' +
           '<button class="btn bd bs" data-id="' + e.id + '" onclick="del_equip(this.dataset.id);r_life()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No equipment added yet.</p>';
  h += '</div>';

  h += '<div class="card"><div class="ctitle">Plants <button class="btn bp bs" onclick="do_add_plant()">+ Add</button></div>';
  if (pl.length) {
    h += '<div class="tw"><table><tr><th>Plant</th><th>Qty</th><th>Light</th><th>CO2</th><th>Added</th><th>Notes</th><th></th></tr>';
    pl.forEach(function(p) {
      var pd = PL[p.plant_id];
      var light_txt = pd ? pd.light : '-';
      var co2_txt = pd ? (pd.co2 ? '<span style="color:var(--warn);font-weight:700">Yes</span>' : 'No') : '-';
      h += '<tr><td><strong>' + esc(p.name) + '</strong>' + (pd ? '<br><small style="color:var(--muted)">' + pd.diff + '</small>' : '') + '</td>' +
           '<td>' + p.qty + '</td><td>' + light_txt + '</td><td>' + co2_txt + '</td>' +
           '<td>' + p.added_date + '</td><td>' + esc(p.notes) + '</td>' +
           '<td style="white-space:nowrap"><button class="btn bg bs" data-id="' + p.id + '" onclick="do_edit_plant(this.dataset.id)">Edit</button> <button class="btn bd bs" data-id="' + p.id + '" onclick="del_plant(this.dataset.id);r_life()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No plants added yet.</p>';
  h += '</div>';

  var fr = d.ferts.filter(function(x){return x.tank_id===tid;});
  h += '<div class="card"><div class="ctitle">Livestock <button class="btn bp bs" onclick="do_add_stock()">+ Add</button></div>';
  if (sk.length) {
    var tank_life = d.tanks.find(function(t){ return t.id === tid; });
    var sp_all_life = get_sp(d);
    var small_tank_warns = [];
    sk.forEach(function(s) {
      var sp = sp_all_life[s.species_id];
      if (sp && sp.min_gal && tank_life && tank_life.gallons < sp.min_gal) {
        small_tank_warns.push(sp.name + ' needs ' + d_v(sp.min_gal) + ' ' + v_lbl() + ' min');
      }
    });
    if (small_tank_warns.length) {
      h += '<div style="background:#fde0e0;border-radius:6px;padding:8px 10px;font-size:12px;color:#a01818;font-weight:600;margin-bottom:10px">&#x26A0; Tank may be too small: ' + small_tank_warns.join('; ') + '</div>';
    }
    h += '<div class="tw"><table><tr><th>Species</th><th>Name</th><th>Qty</th><th>Adult Size</th><th>Bioload</th><th>Added</th><th>Notes</th><th></th></tr>';
    sk.forEach(function(s) {
      var sp = sp_all_life[s.species_id];
      var bl = sp ? sp.bioload : 0;
      var bl_color = bl <= 1 ? 'var(--ok)' : bl <= 3 ? 'var(--warn)' : 'var(--danger)';
      var bl_lbl = bl <= 1 ? 'Low' : bl <= 3 ? 'Med' : 'High';
      var bl_contrib = sp && sp.inv ? Math.round(bl * s.qty * 0.3 * 10) / 10 : bl * s.qty;
      var bl_inv_tag = sp && sp.inv ? ' <span style="font-size:10px;color:var(--muted)">(Inv.)</span>' : '';
      var too_small = sp && sp.min_gal && tank_life && tank_life.gallons < sp.min_gal;
      h += '<tr><td>' + (sp ? sp.name : 'Unknown') + (too_small ? ' <span style="color:var(--danger)" title="Tank too small">&#x26A0;</span>' : '') + '</td>' +
           '<td>' + esc(s.display_name) + '</td><td>' + s.qty + '</td>' +
           '<td style="font-size:12px">' + (sp && sp.size_in ? sp.size_in + '"' : '-') + '</td>' +
           '<td><span style="font-size:12px;font-weight:700;color:' + bl_color + '">' + bl_lbl + bl_inv_tag + ' (' + bl_contrib + ')</span></td>' +
           '<td>' + s.added_date + '</td><td>' + esc(s.notes) + '</td>' +
           '<td style="white-space:nowrap"><button class="btn bg bs" data-id="' + s.id + '" onclick="do_edit_stock(this.dataset.id)">Edit</button> <button class="btn bd bs" data-id="' + s.id + '" onclick="del_stock(this.dataset.id);r_life()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No livestock added yet.</p>';
  h += '</div>';

  h += '<div class="card"><div class="ctitle">Fertilizers <button class="btn bp bs" onclick="do_add_fert()">+ Add</button></div>';
  if (fr.length) {
    h += '<div class="tw"><table><tr><th>Name</th><th>Dose</th><th>Every</th><th>Notes</th><th></th></tr>';
    fr.forEach(function(f) {
      h += '<tr><td><strong>' + esc(f.name) + '</strong></td>' +
           '<td>' + (f.dose_ml || '—') + ' ml</td>' +
           '<td>' + f.freq_days + ' days</td>' +
           '<td>' + esc(f.notes) + '</td>' +
           '<td style="white-space:nowrap"><button class="btn bg bs" data-id="' + f.id + '" onclick="do_edit_fert(this.dataset.id)">Edit</button> <button class="btn bd bs" data-id="' + f.id + '" onclick="del_fert(this.dataset.id)">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No fertilizers added. Add one to get dosing reminders in the Recommended Schedule.</p>';
  h += '</div>';

  el.innerHTML = h;
}

// ===== WATER LOG =====
function wlog_cls(key, val) {
  if (val === null || val === undefined || val === '') return '';
  val = parseFloat(val);
  if (key === 'ammonia' || key === 'nitrite')
    return val === 0 ? 'var(--ok)' : val <= 0.25 ? 'var(--warn)' : 'var(--danger)';
  if (key === 'uia')
    return val === 0 ? 'var(--ok)' : val < 0.05 ? 'var(--warn)' : 'var(--danger)';
  if (key === 'nitrate')
    return val <= 20 ? 'var(--ok)' : val <= 40 ? 'var(--warn)' : 'var(--danger)';
  if (key === 'ph')
    return val >= 6.5 && val <= 7.5 ? 'var(--ok)' : val >= 6.0 && val <= 8.0 ? 'var(--warn)' : 'var(--danger)';
  if (key === 'gh')
    return val >= 4 && val <= 12 ? 'var(--ok)' : val >= 2 && val <= 15 ? 'var(--warn)' : 'var(--danger)';
  if (key === 'calcium')
    return val >= 20 && val <= 60 ? 'var(--ok)' : val >= 10 && val <= 80 ? 'var(--warn)' : 'var(--danger)';
  if (key === 'magnesium')
    return val >= 5 && val <= 20 ? 'var(--ok)' : val >= 2 && val <= 30 ? 'var(--warn)' : 'var(--danger)';
  return '';
}
function wlog_lbl(key, val) {
  if (val === null || val === undefined || val === '') return '&mdash;';
  val = parseFloat(val);
  if (key === 'ammonia' || key === 'nitrite')
    return val === 0 ? 'Safe' : val <= 0.25 ? 'Trace' : 'Toxic';
  if (key === 'uia')
    return val === 0 ? 'Safe' : val < 0.05 ? 'Caution' : 'Toxic';
  if (key === 'nitrate')
    return val <= 20 ? 'Good' : val <= 40 ? 'High' : 'Danger';
  if (key === 'ph')
    return val < 6.0 ? 'Too acidic' : val <= 6.5 ? 'Slightly low' : val <= 7.5 ? 'Ideal' : val <= 8.0 ? 'Slightly high' : 'Too high';
  if (key === 'gh')
    return val < 2 ? 'Too soft' : val <= 4 ? 'Soft' : val <= 12 ? 'Good' : val <= 15 ? 'Hard' : 'Very hard';
  if (key === 'calcium')
    return val < 10 ? 'Low' : val <= 20 ? 'Slightly low' : val <= 60 ? 'Good' : val <= 80 ? 'Slightly high' : 'High';
  if (key === 'magnesium')
    return val < 2 ? 'Low' : val <= 5 ? 'Slightly low' : val <= 20 ? 'Good' : val <= 30 ? 'Slightly high' : 'High';
  return '';
}
function wlog_arrow(cur, prev) {
  if (prev === null || prev === undefined || cur === null || cur === undefined) return '';
  var diff = parseFloat(cur) - parseFloat(prev);
  if (Math.abs(diff) < 0.001) return '';
  return diff > 0 ? ' <span style="color:var(--muted);font-size:10px">&#x2191;</span>' : ' <span style="color:var(--muted);font-size:10px">&#x2193;</span>';
}
function wlog_cell(key, val, prev_val) {
  if (val === null || val === undefined || val === '') return '<td>&mdash;</td>';
  var col = wlog_cls(key, val);
  var lbl = wlog_lbl(key, val);
  var arr = wlog_arrow(val, prev_val);
  var style = col ? 'color:' + col + ';font-weight:600' : '';
  return '<td style="' + style + '">' + val + arr + '<br><span style="font-size:10px;font-weight:400;color:var(--muted)">' + lbl + '</span></td>';
}
function r_wlog() {
  var tid = at(), d = ld(), el = document.getElementById('p-wlog');
  if (!d.tanks.find(function(t){return t.id===tid;})) { el.innerHTML = no_tank(); return; }
  var has_therm = d.equip.some(function(e){ return e.tank_id === tid && e.type === 'Thermometer'; });
  var prev_r = last_r(tid);
  var last_gh_val = prev_r ? prev_r.gh : null;
  var last_gh_ppm = last_gh_val !== null ? Math.round(last_gh_val * 17.9 * 10) / 10 : null;
  var gh_hint = last_gh_ppm !== null
    ? 'Last reading: ' + last_gh_val + ' dGH (' + last_gh_ppm + ' ppm) &mdash; update only after a water change.'
    : 'Enter ppm from your test kit (BIONIX: drops &times; 25). Ideal: 71&ndash;215 ppm (4&ndash;12 dGH). Converted to dGH automatically.';
  var td = today_str();
  var h = '<div class="card"><div class="ctitle">Add Water Reading</div>' +
    '<form id="wf" onsubmit="sub_water(event)">' +
    '<div class="frow">' +
    fgh('Date', '<input type="date" name="date" value="' + td + '" required>', '') +
    (has_therm ? fgh('Temperature (' + t_lbl() + ')', '<input type="number" name="tf" step="0.1" placeholder="e.g. ' + (get_pref().temp === 'C' ? '24' : '76') + '">', 'Stable temp is as important as the number itself.') : '') +
    fgh('Ammonia TAN (ppm)', '<input type="number" name="nh3" step="0.01" placeholder="e.g. 0">', 'Enter TAN from the colour card. Target: 0 ppm. UIA (toxic fraction) is calculated automatically from TAN + pH + temperature.') +
    fgh('Nitrite (ppm)', '<input type="number" name="no2" step="0.01" placeholder="e.g. 0">', 'Target: 0 ppm. Toxic even at 0.25 ppm. Spikes during cycling.') +
    '</div><div class="frow">' +
    fgh('Nitrate (ppm)', '<input type="number" name="no3" step="0.1" placeholder="e.g. 10">', 'Keep below 20 ppm. Reduced by regular water changes.') +
    fgh('pH', '<input type="number" name="ph" step="0.01" placeholder="e.g. 7.0">', 'Stability matters more than exact value. Avoid sudden changes.') +
    fgh('Hardness GH (ppm)', '<input type="number" name="gh" step="1"' + (last_gh_ppm !== null ? ' value="' + last_gh_ppm + '"' : ' placeholder="e.g. 143"') + '>', gh_hint) +
    fgh('Notes', '<input type="text" name="notes" placeholder="Optional notes">', '') +
    '</div>' +
    '<div style="margin:8px 0 10px">' +
    '<button type="button" class="btn bg bs" style="font-size:12px" onclick="tog_wlog_adv()">' +
    (wlog_adv ? '&#x25BC;' : '&#x25B6;') + ' Calcium &amp; Magnesium (optional &mdash; for planted tanks &amp; shrimp)</button>' +
    '</div>' +
    (wlog_adv ?
      '<div class="frow" style="margin-bottom:10px">' +
      fgh('Calcium (ppm)', '<input type="number" name="ca" step="0.1" placeholder="e.g. 40">', 'Ideal: 20&ndash;60 ppm. Test with BIONIX or similar Ca/Mg kit.') +
      fgh('Magnesium (ppm)', '<input type="number" name="mg" step="0.1" placeholder="e.g. 10">', 'Ideal: 5&ndash;20 ppm. Ca:Mg ratio should be 3:1 to 5:1.') +
      '</div>' : '') +
    '<button type="submit" class="btn bp">Save Reading</button></form></div>';
  var entries = get_water(tid);
  if (entries.length >= 2) {
    h += '<div class="card"><div class="ctitle" style="gap:10px">Trend ' +
      '<select id="cpsel" onchange="draw_chart(at(),this.value)">' +
      (has_therm ? '<option value="temp_f">Temperature</option>' : '') +
      '<option value="ammonia">Ammonia TAN</option>' +
      '<option value="uia">Ammonia UIA</option>' +
      '<option value="nitrite">Nitrite</option><option value="nitrate">Nitrate</option>' +
      '<option value="ph">pH</option><option value="gh">Hardness</option>' +
      '</select></div><div class="chart-wrap"><canvas id="wc"></canvas></div></div>';
  }
  if (entries.length) {
    var sorted = entries.slice().reverse();
    var has_ca_mg = entries.some(function(e){ return e.calcium !== null && e.calcium !== undefined; });
    var has_uia = entries.some(function(e){ return calc_uia(e.ammonia, e.ph, e.temp_f) !== null; });
    h += '<div class="card"><div class="ctitle">History</div><div class="tw"><table>' +
      '<tr><th>Date</th>' + (has_therm ? '<th>Temp ' + t_lbl() + '</th>' : '') + '<th>NH3 TAN</th>' + (has_uia ? '<th>UIA</th>' : '') + '<th>NO2 (ppm)</th><th>NO3 (ppm)</th><th>pH</th><th>GH (dGH)</th>' +
      (has_ca_mg ? '<th>Ca (ppm)</th><th>Mg (ppm)</th>' : '') +
      '<th>Notes</th><th></th></tr>';
    sorted.slice(0, 30).forEach(function(e, i) {
      var prev = sorted[i + 1];
      var td = d_t(e.temp_f);
      var pt = prev ? d_t(prev.temp_f) : null;
      var t_arr = wlog_arrow(td, pt);
      var t_disp = td !== null ? td + t_arr : '&mdash;';
      h += '<tr><td>' + e.date + '</td>' +
           (has_therm ? '<td>' + t_disp + '</td>' : '') +
           wlog_cell('ammonia', e.ammonia, prev ? prev.ammonia : null) +
           (has_uia ? mk_uia_cell(e.ammonia, e.ph, e.temp_f, prev ? prev.ammonia : null, prev ? prev.ph : null, prev ? prev.temp_f : null) : '') +
           wlog_cell('nitrite', e.nitrite, prev ? prev.nitrite : null) +
           wlog_cell('nitrate', e.nitrate, prev ? prev.nitrate : null) +
           wlog_cell('ph', e.ph, prev ? prev.ph : null) +
           wlog_cell('gh', e.gh, prev ? prev.gh : null) +
           (has_ca_mg ? wlog_cell('calcium', e.calcium, prev ? prev.calcium : null) + wlog_cell('magnesium', e.magnesium, prev ? prev.magnesium : null) : '') +
           '<td>' + esc(e.notes) + '</td>' +
           '<td><button class="btn bd bs" data-id="' + e.id + '" onclick="del_water(this.dataset.id);r_wlog()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
    if (has_uia && entries.some(function(e){ return uia_temp_defaulted(e.temp_f) && calc_uia(e.ammonia, e.ph, null) !== null; })) {
      h += '<p style="font-size:11px;color:var(--muted);margin:6px 0 0"><sup>*25</sup> Temperature not logged &mdash; UIA calculated using 25&deg;C default. Add a Thermometer under Equipment &amp; Life for accurate values.</p>';
    }
    h += '</div>';
    h += '<div class="card"><div class="ctitle">Ideal Ranges</div>' +
      '<div class="tw"><table>' +
      '<tr><th>Parameter</th><th style="color:var(--ok)">&#x2713; Ideal</th><th style="color:var(--warn)">&#x26A0; Caution</th><th style="color:var(--danger)">&#x2717; Danger</th></tr>' +
      '<tr><td>Ammonia TAN (NH3+NH4)</td><td>0 ppm</td><td>0.01&ndash;0.25 ppm</td><td>&gt; 0.25 ppm</td></tr>' +
      '<tr><td>Ammonia UIA (toxic fraction)</td><td>0 ppm</td><td>0.01&ndash;0.05 ppm</td><td>&gt; 0.05 ppm</td></tr>' +
      '<tr><td>Nitrite (NO2)</td><td>0 ppm</td><td>0.01&ndash;0.25 ppm</td><td>&gt; 0.25 ppm</td></tr>' +
      '<tr><td>Nitrate (NO3)</td><td>0&ndash;20 ppm</td><td>21&ndash;40 ppm</td><td>&gt; 40 ppm</td></tr>' +
      '<tr><td>pH</td><td>6.5&ndash;7.5</td><td>6.0&ndash;6.4 or 7.6&ndash;8.0</td><td>&lt; 6.0 or &gt; 8.0</td></tr>' +
      '<tr><td>Hardness (GH)</td><td>71&ndash;215 ppm (4&ndash;12 dGH)</td><td>36&ndash;70 or 216&ndash;268 ppm</td><td>&lt; 36 or &gt; 268 ppm</td></tr>' +
      '<tr><td>Calcium (Ca)</td><td>20&ndash;60 ppm</td><td>10&ndash;19 or 61&ndash;80 ppm</td><td>&lt; 10 or &gt; 80 ppm</td></tr>' +
      '<tr><td>Magnesium (Mg)</td><td>5&ndash;20 ppm</td><td>2&ndash;4 or 21&ndash;30 ppm</td><td>&lt; 2 or &gt; 30 ppm</td></tr>' +
      '<tr><td>Ca:Mg ratio</td><td>3:1 to 5:1</td><td>2:1 to 6:1</td><td>&lt; 2:1 or &gt; 6:1</td></tr>' +
      '</table></div>' +
      '<p style="font-size:12px;color:var(--muted);margin:8px 0 0">Temperature ideal range depends on your fish species &mdash; check the Compatibility tab. ' +
      'Calcium &amp; Magnesium ranges are for planted tanks and shrimp; fish-only tanks only need GH.</p>' +
      '</div>';
  }
  var tank_wlog = d.tanks.find(function(t){ return t.id === tid; });
  if (tank_wlog && tank_wlog.show_feed_log) {
    var feed_hist = d.feeding.filter(function(x){return x.tank_id===tid;})
      .sort(function(a,b){return b.ts-a.ts;}).slice(0,30);
    h += '<div class="card"><div class="ctitle">Feeding Log <button class="btn bp bs" onclick="open_feed_modal(at())">+ Log Feeding</button></div>';
    if (feed_hist.length) {
      h += '<div class="tw"><table><tr><th>Date</th><th>Food Type</th><th>Amount</th><th>Notes</th><th></th></tr>';
      feed_hist.forEach(function(f) {
        h += '<tr><td>' + f.date + '</td><td>' + esc(f.food_type||'—') + '</td><td>' + esc(f.amt||'—') + '</td>' +
             '<td>' + esc(f.notes||'') + '</td>' +
             '<td><button class="btn bd bs" data-id="' + f.id + '" onclick="del_feeding(this.dataset.id)">&#x2715;</button></td></tr>';
      });
      h += '</table></div>';
    } else h += '<p class="emsg">No feedings logged yet.</p>';
    h += '</div>';
  }
  el.innerHTML = h;
  if (entries.length >= 2) draw_chart(tid, 'temp_f');
}
var wlog_adv = false;
function tog_wlog_adv() { wlog_adv = !wlog_adv; r_wlog(); }
function sub_water(e) {
  e.preventDefault(); var f = e.target, tid = at();
  var ca = wlog_adv && f.ca ? f.ca.value : '';
  var mg = wlog_adv && f.mg ? f.mg.value : '';
  var gh_ppm = f.gh ? pn(f.gh.value) : null;
  var gh_dgh = gh_ppm !== null ? Math.round(gh_ppm / 17.9 * 100) / 100 : '';
  add_water(tid, f.date.value, f.tf ? inp_t(f.tf.value) : null, f.nh3.value, f.no2.value, f.no3.value, f.ph.value, gh_dgh, f.notes.value, ca, mg);
  r_wlog();
}

// ===== MAINTENANCE =====
function r_maint() {
  var tid = at(), d = ld(), el = document.getElementById('p-maint');
  if (!d.tanks.find(function(t){return t.id===tid;})) { el.innerHTML = no_tank(); return; }
  var td = today_str();
  var existing_types = d.tasks.filter(function(x){ return x.tank_id === tid; }).map(function(t){ return t.type; });
  var rec_tasks = get_rec_tasks(tid);
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  var h = '';

  // Water change calculator
  h += '<div class="card"><div class="ctitle">Water Change Calculator</div>' +
       '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:13px">' +
       '<span>Tank: <strong>' + d_v(tank ? tank.gallons : 0) + ' ' + v_lbl() + '</strong></span>' +
       '<span>Change:</span>' +
       '<input type="number" id="wc_pct" value="25" min="1" max="100" style="width:70px" oninput="calc_wc()">' +
       '<span>%</span>' +
       '</div><div id="wc_result" style="margin-top:8px;font-size:13px;color:var(--text)"></div></div>';

  // Recommended tasks card
  h += '<div class="card"><div class="ctitle">Recommended Schedule <span style="font-size:11px;font-weight:400;color:var(--muted);margin-left:6px">Based on your setup</span></div>';
  if (rec_tasks.length) {
    h += '<div class="tw"><table><tr><th>Task</th><th>Frequency</th><th>Why</th><th></th></tr>';
    rec_tasks.forEach(function(t) {
      var already = existing_types.indexOf(t.type) !== -1;
      h += '<tr><td><strong>' + esc(t.name) + '</strong></td>' +
           '<td style="white-space:nowrap">Every ' + t.freq + ' days</td>' +
           '<td style="font-size:12px;color:var(--muted)">' + esc(t.why) + '</td><td>';
      if (already) {
        h += '<span class="pill pok">&#x2713; Added</span>';
      } else {
        h += '<button class="btn bp bs" data-rtype="' + esc(t.type) + '" data-rname="' + esc(t.name) + '" data-rfreq="' + t.freq + '" onclick="add_rec_task(this.dataset.rtype,this.dataset.rname,this.dataset.rfreq)">+ Add</button>';
      }
      h += '</td></tr>';
    });
    h += '</table></div>';
  } else {
    h += '<p class="emsg">Add a tank with livestock to see personalized recommendations.</p>';
  }
  h += '</div>';

  // Existing tasks
  var tasks = d.tasks.filter(function(x){return x.tank_id===tid;})
    .map(function(t){ return Object.assign({}, t, {days: days_til(t.next_due)}); })
    .sort(function(a,b){ return a.days - b.days; });
  if (tasks.length) {
    h += '<div class="card"><div class="ctitle">Your Schedule</div><div class="tw"><table>' +
      '<tr><th>Task</th><th>Type</th><th>Due</th><th>Last Done</th><th>Every</th><th></th></tr>';
    tasks.forEach(function(t) {
      var cls = ucls(t.days);
      var due = t.days < 0 ? ('Overdue ' + Math.abs(t.days) + 'd') : t.days === 0 ? 'Today' : ('In ' + t.days + 'd');
      h += '<tr class="trow ' + cls + '"><td><strong>' + esc(t.name) + '</strong>' +
           (t.notes ? '<br><small style="color:var(--muted)">' + esc(t.notes) + '</small>' : '') +
           '</td><td>' + esc(t.type) + '</td>' +
           '<td><strong>' + due + '</strong><br><small style="color:var(--muted)">' + t.next_due + '</small></td>' +
           '<td>' + t.last_done + '</td><td>' + t.freq + 'd</td>' +
           '<td style="white-space:nowrap">' +
           '<button class="btn bp bs" data-id="' + t.id + '" onclick="mark_done(this.dataset.id);r_maint()">Done</button> ' +
           '<button class="btn bd bs" data-id="' + t.id + '" onclick="del_task(this.dataset.id);r_maint()">&#x2715;</button></td></tr>';
    });
    h += '</table></div></div>';
  }

  // Add custom task form
  h += '<div class="card"><div class="ctitle">Add Custom Task</div>' +
    '<form id="mf" onsubmit="sub_task(event)">' +
    '<div class="frow">' +
    fg('Task Type', '<select name="type"><option>Water Change</option><option>Filter Clean</option><option>Gravel Vac</option><option>Glass Wipe</option><option>Fertilizer</option><option>Pruning</option><option>Water Test</option><option>Other</option></select>') +
    fg('Task Name', '<input type="text" name="name" placeholder="e.g. 25% water change" required>') +
    fg('Every (days)', '<input type="number" name="freq" value="7" min="1" required>') +
    fg('Last Done', '<input type="date" name="last" value="' + td + '" required>') +
    '</div>' +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '<button type="submit" class="btn bp" style="margin-top:8px">Add Task</button></form></div>';

  el.innerHTML = h;
  calc_wc();
}
function calc_wc() {
  var pct_el = document.getElementById('wc_pct');
  var res_el = document.getElementById('wc_result');
  if (!pct_el || !res_el) return;
  var d = ld(), tank = d.tanks.find(function(t){ return t.id === at(); });
  if (!tank) return;
  var pct = parseFloat(pct_el.value) || 25;
  var gal = Math.round(tank.gallons * pct / 100 * 10) / 10;
  var lit = Math.round(gal * 3.78541 * 10) / 10;
  var primary = get_pref().vol === 'L' ? lit + ' L' : gal + ' gal';
  var secondary = get_pref().vol === 'L' ? gal + ' gal' : lit + ' L';
  res_el.innerHTML = 'Remove <strong>' + primary + '</strong> (' + secondary + ') &mdash; treat replacement water with dechlorinator before adding to tank.';
}
function sub_task(e) {
  e.preventDefault(); var f = e.target, tid = at();
  add_task(tid, f.type.value, f.name.value, f.freq.value, f.last.value, f.notes.value);
  r_maint();
}

// ===== RECOMMENDATIONS =====
function r_recs() {
  var tid = at(), d = ld(), el = document.getElementById('p-recs');
  if (!d.tanks.find(function(t){return t.id===tid;})) { el.innerHTML = no_tank(); return; }
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  var pl_in_tank = d.plants.filter(function(x){ return x.tank_id === tid; });
  var sk = d.stock.filter(function(x){return x.tank_id===tid;});
  var light_hours = get_light_hours(tid);
  var co2_info = get_co2_info(tid);
  var filter_mult = get_filter_mult(tid);
  var cur_bl = calc_bioload(tid);
  var max_bl = Math.round(max_bioload(tank ? tank.gallons : 0, pl_in_tank.length, tank ? tank.substrate_liters : 0) * filter_mult);
  var bl_pct = max_bl > 0 ? Math.min(100, Math.round(cur_bl / max_bl * 100)) : 0;
  var bl_cls = bioload_cls(cur_bl, max_bl);
  var bl_bar_color = bl_cls === 'ok' ? 'var(--ok)' : bl_cls === 'warn' ? 'var(--warn)' : 'var(--danger)';
  var h = '';

  // Bioload card
  h += '<div class="card"><div class="ctitle">Tank Bioload</div>';
  h += '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">';
  h += '<span style="font-size:22px;font-weight:700;color:var(--deep)">' + cur_bl + '</span>';
  h += '<span style="font-size:14px;color:var(--muted)">/ ' + max_bl + ' units (' + bl_pct + '% capacity)</span></div>';
  h += '<div class="bl-bar"><div class="bl-fill" style="width:' + bl_pct + '%;background:' + bl_bar_color + '"></div></div>';
  var bl_msg, bl_mc;
  if (bl_cls === 'danger') {
    bl_mc = 'var(--danger)';
    var has_plants      = pl_in_tank.length >= 1;
    var max_plants      = pl_in_tank.length >= 5;
    var filter_poor     = filter_mult < 1.0;
    var filter_maxed    = filter_mult > 1.0;
    var tgt_lo = Math.ceil((tank ? tank.gallons : 0) * 4);
    var tgt_hi = Math.ceil((tank ? tank.gallons : 0) * 6);
    var fixes = [];
    if (filter_poor) {
      fixes.push('upgrade filter to ' + d_fl(tgt_lo) + '-' + d_fl(tgt_hi) + ' ' + fl_lbl() + ' (low flow costs you 15% capacity)');
    } else if (!filter_maxed) {
      fixes.push('upgrade to a high-flow filter (6x+ turnover = ' + d_fl(tgt_hi) + '+ ' + fl_lbl() + ') for a 10% boost');
    }
    if (!max_plants) {
      fixes.push(has_plants ? 'add more plants (5+ total for a 20% bonus, currently at 10%)' : 'add 5+ plant species for a 20% natural capacity boost');
    }
    var already = [];
    if (filter_maxed)  already.push('filtration excellent');
    if (max_plants)    already.push('heavily planted +20%');
    else if (has_plants) already.push('planted +10%');
    var already_txt = already.length ? ' (' + already.join(', ') + ' already applied)' : '';
    if (!fixes.length) {
      bl_msg = 'Overstocked' + already_txt + '. Your setup is fully optimised — the only fix is to reduce fish count.';
    } else {
      bl_msg = 'Overstocked' + already_txt + '. Options: ' + fixes.join('; or ') + '. If still over after changes, reduce fish count.';
    }
  } else if (bl_cls === 'warn') {
    bl_mc = 'var(--warn)';
    bl_msg = 'Nearing capacity. Hold off adding more fish and monitor water quality closely.';
  } else {
    bl_mc = 'var(--ok)';
    bl_msg = 'Bioload is within safe range.';
  }
  h += '<p style="font-size:13px;color:' + bl_mc + ';margin-top:4px">' + bl_msg + '</p>';
  if (filter_mult !== 1.0) {
    var fmsg = filter_mult < 1.0 ? 'Filter flow below 4x turnover: capacity reduced by 15%. Aim for 4-6x (' + fl_lbl() + ' = ' + d_fl(Math.ceil((tank ? tank.gallons : 0) * 4)) + '-' + d_fl(Math.ceil((tank ? tank.gallons : 0) * 6)) + ').' : 'High-flow filter (6x+ turnover): +10% capacity bonus applied.';
    h += '<p style="font-size:12px;color:' + (filter_mult < 1.0 ? 'var(--danger)' : 'var(--ok)') + ';margin-top:4px">' + fmsg + '</p>';
  }
  if (pl_in_tank.length > 0) {
    h += '<p style="font-size:12px;color:var(--muted);margin-top:4px">' + (pl_in_tank.length >= 5 ? 'Heavily planted (+20%)' : 'Planted tank (+10%)') + ' capacity bonus applied.</p>';
  }
  h += '<p style="font-size:11px;color:var(--muted);margin-top:6px">Scale: 1=Very Low, 2=Low, 3=Medium, 4=High, 5=Very High</p>';
  h += '</div>';

  // Equipment check card
  var filters_eq = d.equip.filter(function(x){ return x.tank_id === tid && x.type === 'Filter'; });
  var lights_eq = d.equip.filter(function(x){ return x.tank_id === tid && x.type === 'Light'; });
  var total_gph = 0;
  filters_eq.forEach(function(f){ if (f.config && f.config.flow_gph) total_gph += f.config.flow_gph; });
  var turnover = tank && tank.gallons && total_gph > 0 ? Math.round(total_gph / tank.gallons * 10) / 10 : 0;
  var needs_co2_plant = pl_in_tank.some(function(p){ return PL[p.plant_id] && PL[p.plant_id].co2; });
  var needs_high_light = pl_in_tank.some(function(p){ return PL[p.plant_id] && PL[p.plant_id].light === 'High'; });
  var needs_med_light  = !needs_high_light && pl_in_tank.some(function(p){ return PL[p.plant_id] && PL[p.plant_id].light === 'Medium'; });
  var heater_needed;
  var sp_all_recs = get_sp(d);
  if (tank && tank.room_tmin != null) {
    heater_needed = sk.length === 0 ? tank.room_tmin < 72 : sk.some(function(s){ var sp = sp_all_recs[s.species_id]; return sp && tank.room_tmin < sp.tmin; });
  } else {
    heater_needed = sk.length === 0 || sk.some(function(s){ var sp = sp_all_recs[s.species_id]; return sp && sp.tmin >= 70; });
  }

  h += '<div class="card"><div class="ctitle">Equipment Check</div>';
  // Filter row
  h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:13px">';
  h += '<span style="font-weight:600;min-width:50px">Filter:</span>';
  if (total_gph > 0 && tank) {
    var turn_cls = turnover < 4 ? 'pdanger' : turnover < 6 ? 'pwarn' : 'pok';
    var turn_lbl = turnover < 4 ? 'Low flow' : turnover < 6 ? 'OK' : 'Excellent';
    h += '<span>' + d_fl(total_gph) + ' ' + fl_lbl() + ' &mdash; ' + turnover + 'x turnover/hr</span> ' + pill_lbl(turn_cls, turn_lbl);
    if (turnover < 4 && tank) h += '<span style="font-size:12px;color:var(--danger);margin-left:8px">Needs ' + d_fl(Math.ceil(tank.gallons * 4)) + '+ ' + fl_lbl() + '</span>';
  } else if (filters_eq.length) {
    h += '<span style="color:var(--muted)">Filter added. Set ' + fl_lbl() + ' in equipment to see turnover rate.</span>';
  } else {
    h += '<span style="color:var(--muted)">No filter configured.</span>';
  }
  h += '</div>';
  // Light row
  h += '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:13px">';
  h += '<span style="font-weight:600;min-width:50px;padding-top:1px">Light:</span>';
  if (light_hours > 0) {
    var light_cls, light_lbl, light_note;
    var has_co2 = !!co2_info;
    if (needs_high_light) {
      if      (light_hours < 6)  { light_cls = 'pdanger'; light_lbl = 'Insufficient'; light_note = 'High-light plants need 8-10 h/day.'; }
      else if (light_hours < 8)  { light_cls = 'pwarn';   light_lbl = 'Too low';      light_note = 'Increase to 8-10 h for high-light plants.'; }
      else if (light_hours <= 10){ light_cls = 'pok';     light_lbl = 'Sufficient';   light_note = null; }
      else if (has_co2)          { light_cls = 'pwarn';   light_lbl = 'Overkill';     light_note = 'Above 10 h — CO2 helps but algae risk is elevated.'; }
      else                       { light_cls = 'pdanger'; light_lbl = 'Algae risk';   light_note = 'Above 10 h without CO2 will cause heavy algae growth.'; }
    } else if (needs_med_light) {
      if      (light_hours < 4)  { light_cls = 'pdanger'; light_lbl = 'Insufficient'; light_note = 'Medium-light plants need 6-8 h/day.'; }
      else if (light_hours < 6)  { light_cls = 'pwarn';   light_lbl = 'Too low';      light_note = 'Aim for 6-8 h for medium-light plants.'; }
      else if (light_hours <= 8) { light_cls = 'pok';     light_lbl = 'Sufficient';   light_note = null; }
      else if (light_hours <= 10){ light_cls = 'pwarn';   light_lbl = 'Overkill';     light_note = has_co2 ? 'Above 8 h — plants can use it with CO2, but watch for algae.' : 'Above 8 h without CO2 increases algae risk.'; }
      else                       { light_cls = 'pdanger'; light_lbl = 'Algae risk';   light_note = 'Reduce to 8 h max — excess light without CO2 causes algae.'; }
    } else {
      if      (light_hours <= 8) { light_cls = 'pok';     light_lbl = 'Good';         light_note = null; }
      else if (light_hours <= 10){ light_cls = 'pwarn';   light_lbl = 'Overkill';     light_note = 'Above 8 h for low-light plants — monitor for algae.'; }
      else                       { light_cls = 'pdanger'; light_lbl = 'Algae risk';   light_note = 'Reduce to 6-8 h — extended photoperiod promotes algae growth.'; }
    }
    h += '<div><span>' + light_hours + ' h/day</span> ' + pill_lbl(light_cls, light_lbl);
    if (light_note) h += '<div style="font-size:11px;color:var(--muted);margin-top:3px">' + light_note + '</div>';
    h += '</div>';
  } else if (lights_eq.length) {
    h += '<span style="color:var(--muted)">Light added. Set hours/day in equipment config.</span>';
  } else {
    h += '<span style="color:var(--muted)">No light configured.</span>';
  }
  h += '</div>';
  // CO2 row
  h += '<div style="display:flex;align-items:center;gap:8px;font-size:13px">';
  h += '<span style="font-weight:600;min-width:50px">CO2:</span>';
  if (co2_info) {
    h += '<span>' + esc(co2_info.type) + (co2_info.hours ? ', ' + co2_info.hours + 'h/day' : '') + (co2_info.bps ? ', ' + co2_info.bps + ' BPS' : '') + '</span> ' + pill_lbl('pok', 'Active');
    if (light_hours > 0 && co2_info.hours > 0 && co2_info.hours < light_hours) {
      h += '<span style="font-size:12px;color:var(--warn);margin-left:8px">Tip: run CO2 1h before lights, stop 1h before lights off</span>';
    }
  } else if (needs_co2_plant) {
    h += '<span style="color:var(--danger)">No CO2 system added, but plants require it.</span>';
  } else {
    h += '<span style="color:var(--muted)">Not required for your current plants.</span> ' + pill_lbl('pok', 'Not needed');
  }
  h += '</div>';
  // Heater row
  var heater_w = get_heater_watts(tid);
  var rec_w = tank ? Math.ceil(tank.gallons * 5) : 0;
  h += '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:13px">';
  h += '<span style="font-weight:600;min-width:50px">Heater:</span>';
  var heaters_eq = d.equip.filter(function(x){ return x.tank_id === tid && x.type === 'Heater'; });
  if (heater_w > 0) {
    h += '<span>' + heater_w + 'W installed</span> ';
    if (heater_w >= rec_w) {
      h += pill_lbl('pok', 'Good');
    } else {
      h += pill_lbl('pdanger', 'Underpowered');
      h += '<span style="font-size:12px;color:var(--danger);margin-left:8px">Recommend ' + rec_w + 'W+ for a ' + d_v(tank ? tank.gallons : 0) + ' ' + v_lbl() + ' tank (5W/gal rule)</span>';
    }
  } else if (heaters_eq.length) {
    h += '<span style="color:var(--muted)">Heater added — set wattage in equipment config to check sizing.</span>';
  } else {
    if (heater_needed) {
      h += '<span style="color:var(--muted)">No heater configured. Tropical fish need stable warm water.</span>';
    } else {
      h += '<span style="color:var(--muted)">Not required for your fish and room temperature.</span> ' + pill_lbl('pok', 'Not needed');
    }
  }
  h += '</div></div>';

  if (!sk.length) {
    h += '<div class="card"><div class="empty-s"><h2>No Livestock Added</h2>' +
      '<p>Add fish or shrimp in the Equipment &amp; Life tab to see parameter recommendations.</p></div></div>';
    el.innerHTML = h; return;
  }

  var rng = overlap(tid), lr = last_r(tid);
  if (rng.all_ok) {
    h += '<div class="cok">&#x2713; All species in this tank are compatible</div>';
  } else {
    h += '<div class="cwarn">&#x26A0; Compatibility issue detected</div>';
    var pairs = bad_pairs(rng.sl);
    if (pairs.length) {
      h += '<div class="card"><div class="ctitle" style="color:var(--danger)">Incompatible Pairs</div>' +
           '<ul style="padding-left:18px;font-size:13px;line-height:1.9">';
      pairs.forEach(function(p) {
        h += '<li><strong>' + esc(p.a) + '</strong> + <strong>' + esc(p.b) + '</strong>';
        if (p.ps.length) h += ' — parameter conflict: ' + p.ps.join(', ');
        if (p.beh) h += '<br><span style="color:var(--danger);font-size:12px">&#x1F6AB; ' + esc(p.beh) + '</span>';
        h += '</li>';
      });
      h += '</ul></div>';
    }
  }

  var plant_temp_note = (rng.pl_names && rng.pl_names.length) ? ' (includes plants: ' + rng.pl_names.join(', ') + ')' : '';
  h += '<div class="card"><div class="ctitle">Recommended Water Parameters</div>' +
    (plant_temp_note ? '<p style="font-size:12px;color:var(--muted);margin:0 0 8px">Temperature range accounts for fish and plants in this tank' + plant_temp_note + '.</p>' : '') +
    '<div class="tw"><table><tr><th>Parameter</th><th>Safe Range</th><th>Current Reading</th><th>Status</th><th>Notes</th></tr>';
  var rp = [
    {l:'Temperature', u:t_lbl(), mn:rng.temp.ok?d_t(rng.temp.min):null, mx:rng.temp.ok?d_t(rng.temp.max):null, k:'temp_f', tox:false, conv:d_t},
    {l:'Ammonia',     u:'ppm', mn:0, mx:0, k:'ammonia', tox:true,  conv:null},
    {l:'Nitrite',     u:'ppm', mn:0, mx:0, k:'nitrite', tox:true,  conv:null},
    {l:'Nitrate',     u:'ppm', mn:0, mx:20, k:'nitrate', tox:false, conv:null},
    {l:'pH',          u:'',    mn:rng.ph.ok?rng.ph.min:null, mx:rng.ph.ok?rng.ph.max:null, k:'ph', tox:false, conv:null},
    {l:'Hardness (GH)',u:'dGH',mn:rng.gh.ok?rng.gh.min:null, mx:rng.gh.ok?rng.gh.max:null, k:'gh', tox:false, conv:null}
  ];
  rp.forEach(function(p) {
    var raw = lr ? lr[p.k] : null, cur = (p.conv && raw !== null) ? p.conv(raw) : raw;
    var mn_chk = p.k === 'temp_f' ? (rng.temp.ok?rng.temp.min:null) : p.mn;
    var mx_chk = p.k === 'temp_f' ? (rng.temp.ok?rng.temp.max:null) : p.mx;
    var c = cls_val(raw, mn_chk, mx_chk, p.tox);
    var rt = p.tox ? '0 ppm' : (p.mn !== null && p.mx !== null ? p.mn + (p.u?' '+p.u:'') + ' – ' + p.mx + (p.u?' '+p.u:'') : '—');
    // Build explanation for warn/danger
    var note = '';
    if (c !== 'ok' && c !== 'muted' && raw !== null) {
      var disp = cur !== null ? cur : raw;
      if (p.tox) {
        note = disp > 0.5 ? 'Toxic — do a 25–50% water change immediately.' : 'Trace detected — should be 0. Partial water change recommended.';
      } else if (mn_chk !== null && mx_chk !== null) {
        var hi = (p.conv ? p.conv(mx_chk) : mx_chk), lo = (p.conv ? p.conv(mn_chk) : mn_chk);
        if (disp > hi) note = 'Too high — safe range for your fish is ' + lo + '–' + hi + (p.u?' '+p.u:'') + '.';
        else if (disp < lo) note = 'Too low — safe range for your fish is ' + lo + '–' + hi + (p.u?' '+p.u:'') + '.';
        else note = 'Close to the limit — safe range is ' + lo + '–' + hi + (p.u?' '+p.u:'') + '.';
      } else if (p.k === 'nitrate') {
        note = raw > 40 ? 'Too high — do a 50% water change. Above 40 ppm stresses fish.' : 'Elevated — aim for below 20 ppm. Schedule a water change.';
      }
    } else if (c === 'muted') {
      note = 'No reading logged yet.';
    }
    // Append which specific livestock species are out of range
    if (!p.tox && c !== 'ok' && c !== 'muted' && raw !== null && rng && rng.sl) {
      var aff = find_affected(rng.sl, p.k, raw);
      if (aff.length) {
        var aff_str = aff.map(function(a) {
          return a.name + ' (' + (a.dir === 'max' ? 'max' : 'min') + ' ' + a.val + (p.u ? ' ' + p.u : '') + ')';
        }).join(', ');
        note += (note ? ' ' : '') + 'Affected: ' + aff_str + '.';
      }
    }
    var note_style = c === 'danger' ? 'color:var(--danger)' : c === 'warn' ? 'color:var(--warn)' : 'color:var(--muted)';
    h += '<tr><td>' + p.l + '</td><td>' + rt + '</td><td>' + (cur !== null ? cur + (p.u?' '+p.u:'') : '—') + '</td><td>' + pill(c) + '</td>' +
         '<td style="font-size:12px;' + note_style + '">' + note + '</td></tr>';
  });
  h += '</table></div></div>';

  h += '<div class="card"><div class="ctitle">Per-Species Requirements</div>' +
    '<div class="tw"><table><tr><th>Species</th><th>Level</th><th>Adult Size</th><th>Min Tank</th><th>Temp (' + t_lbl() + ')</th><th>pH</th><th>Hardness</th><th>Bioload</th><th>Notes</th></tr>';
  rng.sl.forEach(function(sp) {
    var bl_lbl = sp.bioload <= 1 ? 'Very Low' : sp.bioload <= 2 ? 'Low' : sp.bioload <= 3 ? 'Medium' : sp.bioload <= 4 ? 'High' : 'Very High';
    var bl_inv_note = sp.inv ? ' <span style="font-size:10px;color:var(--muted)">(×0.3 inv.)</span>' : '';
    var lvl_color = sp.level === 'Advanced' ? 'var(--danger)' : sp.level === 'Intermediate' ? 'var(--warn)' : 'var(--ok)';
    var tank_warn = tank && sp.min_gal && tank.gallons < sp.min_gal;
    h += '<tr><td><strong>' + esc(sp.name) + '</strong></td>' +
         '<td style="color:' + lvl_color + ';font-weight:700;font-size:12px">' + (sp.level || 'Beginner') + '</td>' +
         '<td>' + (sp.size_in ? sp.size_in + '"' : '-') + '</td>' +
         '<td style="' + (tank_warn ? 'color:var(--danger);font-weight:700' : '') + '">' + (sp.min_gal ? d_v(sp.min_gal) + ' ' + v_lbl() : '-') + (tank_warn ? ' &#x26A0;' : '') + '</td>' +
         '<td>' + d_t(sp.tmin) + '-' + d_t(sp.tmax) + '</td>' +
         '<td>' + sp.pmin + '-' + sp.pmax + '</td><td>' + sp.gmin + '-' + sp.gmax + '</td>' +
         '<td>' + bl_lbl + bl_inv_note + ' (' + sp.bioload + ')</td>' +
         '<td style="font-size:12px;color:var(--muted)">' + esc(sp.note) + '</td></tr>';
  });
  h += '</table></div></div>';

  if (pl_in_tank.length) {
    var fish_tmin = rng.temp.ok ? rng.temp.min : null;
    var fish_tmax = rng.temp.ok ? rng.temp.max : null;
    h += '<div class="card"><div class="ctitle">Plant Requirements</div>';
    if (needs_co2_plant && !co2_info) {
      h += '<div style="background:#fef3d5;border-radius:6px;padding:8px 12px;color:#8a5a00;font-size:13px;font-weight:600;margin-bottom:10px">&#x26A0; One or more plants require CO2 injection. Add CO2 System equipment.</div>';
    }
    h += '<div class="tw"><table><tr><th>Plant</th><th>Temp (' + t_lbl() + ')</th><th>Light Needed</th><th>CO2</th><th>Difficulty</th><th>Care Note</th></tr>';
    pl_in_tank.forEach(function(p) {
      var pd = PL[p.plant_id];
      if (pd) {
        var temp_ok = true;
        if (fish_tmin !== null && fish_tmax !== null) {
          temp_ok = pd.tmax >= fish_tmin && pd.tmin <= fish_tmax;
        }
        var light_warn = (pd.light === 'High' && light_hours > 0 && light_hours < 8) ? ' &#x26A0;' : '';
        h += '<tr><td><strong>' + esc(p.name) + '</strong></td>' +
             '<td' + (temp_ok ? '' : ' style="color:var(--danger);font-weight:700"') + '>' + d_t(pd.tmin) + '-' + d_t(pd.tmax) + (temp_ok ? '' : ' &#x26A0;') + '</td>' +
             '<td>' + pd.light + light_warn + '</td>' +
             '<td>' + (pd.co2 ? '<strong style="color:var(--warn)">Yes</strong>' : 'No') + '</td>' +
             '<td>' + pd.diff + '</td>' +
             '<td style="font-size:12px;color:var(--muted)">' + esc(pd.note) + '</td></tr>';
      } else {
        h += '<tr><td><strong>' + esc(p.name) + '</strong></td><td colspan="5" style="color:var(--muted)">Custom plant - no database info</td></tr>';
      }
    });
    h += '</table></div></div>';
  }

  // ── Fish suggestions ──
  var already_sp_ids = d.stock.filter(function(x){ return x.tank_id === tid; }).map(function(x){ return x.species_id; });
  var exc_small = 0, exc_compat = 0;
  Object.keys(SP).forEach(function(spid) {
    if (already_sp_ids.indexOf(spid) !== -1) return;
    var sp = SP[spid];
    if (sp.min_gal && tank.gallons < sp.min_gal) { exc_small++; return; }
    if (rng &&
        ((rng.temp.ok && (sp.tmax < rng.temp.min || sp.tmin > rng.temp.max)) ||
         (rng.ph.ok   && (sp.pmax < rng.ph.min   || sp.pmin > rng.ph.max))   ||
         (rng.gh.ok   && (sp.gmax < rng.gh.min   || sp.gmin > rng.gh.max)))) { exc_compat++; }
  });

  var fish_sugg = Object.keys(SP).filter(function(spid) {
    if (already_sp_ids.indexOf(spid) !== -1) return false;
    var sp = SP[spid];
    if (sp.min_gal && tank.gallons < sp.min_gal) return false;
    if (rng) {
      if (rng.temp.ok && (sp.tmax < rng.temp.min || sp.tmin > rng.temp.max)) return false;
      if (rng.ph.ok   && (sp.pmax < rng.ph.min   || sp.pmin > rng.ph.max))   return false;
      if (rng.gh.ok   && (sp.gmax < rng.gh.min   || sp.gmin > rng.gh.max))   return false;
    }
    return true;
  }).map(function(spid) {
    var sp = SP[spid];
    var warns = [];
    if (lr) {
      if (lr.temp_f !== null && (lr.temp_f < sp.tmin || lr.temp_f > sp.tmax))
        warns.push('Current temp ' + d_t(lr.temp_f) + t_lbl() + ' — needs ' + d_t(sp.tmin) + '-' + d_t(sp.tmax) + t_lbl());
      if (lr.ph !== null && (lr.ph < sp.pmin || lr.ph > sp.pmax))
        warns.push('Current pH ' + lr.ph + ' — needs ' + sp.pmin + '-' + sp.pmax);
      if (lr.gh !== null && (lr.gh < sp.gmin || lr.gh > sp.gmax))
        warns.push('Current GH ' + lr.gh + ' — needs ' + sp.gmin + '-' + sp.gmax);
    }
    if (cur_bl > 0 && max_bl > 0 && (cur_bl + sp.bioload) > max_bl)
      warns.push('Would exceed bioload capacity');
    else if (max_bl > 0 && (cur_bl + sp.bioload) > Math.round(max_bl * 0.9))
      warns.push('Would push tank to ' + Math.round((cur_bl + sp.bioload) / max_bl * 100) + '% capacity');
    return {id: spid, sp: sp, warns: warns};
  }).sort(function(a, b) {
    if (a.warns.length !== b.warns.length) return a.warns.length - b.warns.length;
    var o = {Beginner: 0, Intermediate: 1, Advanced: 2};
    return (o[a.sp.level] || 0) - (o[b.sp.level] || 0);
  });

  h += '<div class="card"><div class="ctitle">Suggested Fish</div>';
  var fctx = [];
  if (exc_small > 0)  fctx.push(exc_small + ' species excluded — tank too small');
  if (exc_compat > 0) fctx.push(exc_compat + ' species excluded — water parameters conflict with current livestock');
  fctx.push('species already in tank are hidden');
  h += '<div style="font-size:12px;color:var(--muted);margin-bottom:10px">' + fctx.join(' &middot; ') + '.</div>';

  if (fish_sugg.length === 0) {
    h += '<p class="emsg">No compatible species found for this tank setup.</p>';
  } else {
    h += '<div class="tw"><table>' +
         '<tr><th>Species</th><th>Level</th><th>Size</th><th>Min Tank</th><th>Temp (' + t_lbl() + ')</th><th>pH</th><th>GH</th><th>Bioload</th><th>Compatibility</th></tr>';
    fish_sugg.forEach(function(item) {
      var sp = item.sp;
      var lc = sp.level === 'Advanced' ? 'var(--danger)' : sp.level === 'Intermediate' ? 'var(--warn)' : 'var(--ok)';
      var tank_warn = sp.min_gal && tank && tank.gallons < sp.min_gal * 1.2;
      var compat;
      if (item.warns.length === 0 && !sp.hard_reason) {
        compat = pill_lbl('pok', '&#x2713; Good fit');
      } else {
        compat = (item.warns.length > 0 ? pill_lbl('pwarn', '&#x26A0; Notes') : pill_lbl('pok', '&#x2713; Good fit'));
        if (sp.hard_reason) compat += '<div style="color:var(--muted);font-size:11px;margin-top:3px">' + esc(sp.hard_reason) + '</div>';
        if (item.warns.length > 0) {
          compat += '<ul style="margin:3px 0 0;padding-left:14px;font-size:11px;color:var(--warn)">';
          item.warns.forEach(function(w){ compat += '<li>' + w + '</li>'; });
          compat += '</ul>';
        }
      }
      h += '<tr>' +
           '<td><strong>' + esc(sp.name) + '</strong></td>' +
           '<td style="color:' + lc + ';font-weight:700;font-size:12px">' + (sp.level || 'Beginner') + '</td>' +
           '<td>' + (sp.size_in ? sp.size_in + '"' : '-') + '</td>' +
           '<td>' + (sp.min_gal ? d_v(sp.min_gal) + ' ' + v_lbl() : '-') + '</td>' +
           '<td>' + d_t(sp.tmin) + '-' + d_t(sp.tmax) + '</td>' +
           '<td>' + sp.pmin + '-' + sp.pmax + '</td>' +
           '<td>' + sp.gmin + '-' + sp.gmax + '</td>' +
           '<td>' + sp.bioload + '</td>' +
           '<td style="font-size:12px">' + compat + '</td>' +
           '</tr>';
    });
    h += '</table></div>';
  }
  h += '</div>';

  // Plant suggestions
  var already_ids = pl_in_tank.map(function(p){ return p.plant_id; });
  var fish_tmin_s = rng.temp.ok ? rng.temp.min : null;
  var fish_tmax_s = rng.temp.ok ? rng.temp.max : null;

  var suggested = Object.keys(PL).filter(function(k) {
    var p = PL[k];
    if (already_ids.indexOf(k) !== -1) return false;
    // Skip CO2-requiring plants when no CO2 system is set up
    if (p.co2 && !co2_info) return false;
    // Skip plants that need more light than available
    if (p.light === 'High'   && light_hours < 8) return false;
    if (p.light === 'Medium' && light_hours > 0 && light_hours < 4) return false;
    // Must overlap with the fish temperature range
    if (fish_tmin_s !== null && fish_tmax_s !== null) {
      if (p.tmax < fish_tmin_s || p.tmin > fish_tmax_s) return false;
    }
    return true;
  }).sort(function(a, b) {
    var o = {Easy: 0, Medium: 1, Hard: 2};
    return (o[PL[a].diff] || 0) - (o[PL[b].diff] || 0);
  });

  var ctx = [];
  if (light_hours > 0) ctx.push(light_hours + 'h/day light');
  else if (lights_eq.length) ctx.push('light configured — set hours in equipment');
  else ctx.push('no light configured — showing low-light plants only');
  if (co2_info) ctx.push('CO2 active');
  else ctx.push('no CO2 — CO2-requiring plants hidden');

  h += '<div class="card"><div class="ctitle">Suggested Plants</div>';
  h += '<div style="font-size:12px;color:var(--muted);margin-bottom:10px">Plants that suit your current setup (' + ctx.join(' &middot; ') + '). Plants already in your tank are excluded.</div>';
  if (suggested.length === 0) {
    h += '<p class="emsg">All compatible plants are already in your tank, or none match your current light and CO2 setup.</p>';
  } else {
    h += '<div class="tw"><table><tr><th>Plant</th><th>Difficulty</th><th>Light</th><th>CO2</th><th>Temp (' + t_lbl() + ')</th><th>Care Note</th></tr>';
    suggested.forEach(function(k) {
      var p = PL[k];
      var dc = p.diff === 'Easy' ? 'var(--ok)' : p.diff === 'Medium' ? 'var(--warn)' : 'var(--danger)';
      h += '<tr>' +
           '<td><strong>' + esc(p.name) + '</strong></td>' +
           '<td style="color:' + dc + ';font-weight:700;font-size:12px">' + p.diff + '</td>' +
           '<td>' + p.light + '</td>' +
           '<td>' + (p.co2 ? '<strong style="color:var(--warn)">Yes</strong>' : 'No') + '</td>' +
           '<td>' + d_t(p.tmin) + '-' + d_t(p.tmax) + '</td>' +
           '<td style="font-size:12px;color:var(--muted)">' + esc(p.note) + '</td></tr>';
    });
    h += '</table></div>';
  }
  h += '</div>';

  el.innerHTML = h;
}

// ===== MODALS =====
function om(h) { document.getElementById('mb').innerHTML = h; document.getElementById('ov').classList.add('on'); }
function cm() { document.getElementById('ov').classList.remove('on'); }

// ===== TANK MODALS =====
function do_add_tank() {
  var td = today_str();
  om('<div class="mtitle">Add Tank</div>' +
    '<form onsubmit="sub_add_tank(event)">' +
    fg('Tank Name', '<input type="text" name="name" placeholder="e.g. Living Room 20G" required>') +
    '<div class="frow">' + vol_flds('', '') + '</div>' +
    fg('Setup Date', '<input type="date" name="setup" value="' + td + '" required>') +
    '<div style="font-size:12px;color:var(--muted);font-weight:600;margin-bottom:2px">Room Temperature — without any heater (' + t_lbl() + ')</div>' +
    '<div style="font-size:11px;color:var(--muted);margin-bottom:6px">Used to suggest fish that suit your climate and determine if a heater is needed.</div>' +
    '<div class="frow">' +
    fg('Min ' + t_lbl(), '<input type="number" name="room_tmin" placeholder="e.g. ' + (get_pref().temp === 'C' ? '20' : '68') + '">') +
    fg('Max ' + t_lbl(), '<input type="number" name="room_tmax" placeholder="e.g. ' + (get_pref().temp === 'C' ? '28' : '82') + '">') +
    '</div>' +
    fg('Notes', '<textarea name="notes" placeholder="Optional notes about your tank"></textarea>') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add Tank</button></div>' +
    '</form>');
}
function sub_add_tank(e) {
  e.preventDefault(); var f = e.target;
  var lit = parseFloat(f.lit.value) || 0;
  var gal = parseFloat(f.gal.value) || 0;
  if (get_pref().vol === 'L' && lit) gal = lit / 3.78541;
  add_tank(f.name.value, gal, f.setup.value, f.notes.value, inp_t(f.room_tmin.value), inp_t(f.room_tmax.value));
  cm(); init();
}

// ===== PREVIEW TANK =====
function upd_prev_bar() {
  var bar = document.getElementById('prev_bar');
  if (!bar) return;
  var d = ld(), tid = at();
  var t = d.tanks.find(function(x){ return x.id === tid; });
  bar.style.display = (t && t.preview) ? '' : 'none';
}

function copy_tank_data(src_id, dst_id) {
  var d = ld();
  ['equip','plants','stock','ferts'].forEach(function(k) {
    d[k].filter(function(x){ return x.tank_id === src_id; }).forEach(function(x) {
      var copy = JSON.parse(JSON.stringify(x));
      copy.id = gid(); copy.tank_id = dst_id;
      d[k].push(copy);
    });
  });
  sv(d);
}

function do_add_preview() {
  var d = ld();
  var real_tanks = d.tanks.filter(function(t){ return !t.preview; });
  var opts = '<option value="">-- Start fresh --</option>' +
    real_tanks.map(function(t){ return '<option value="' + t.id + '">' + esc(t.name) + '</option>'; }).join('');
  var td = today_str();
  om('<div class="mtitle">&#x1F9EA; Create Preview Tank</div>' +
    '<p style="font-size:13px;color:var(--muted);margin-bottom:14px">A preview tank lets you test fish and plant combinations without affecting your real data. It is excluded from exports.</p>' +
    '<form onsubmit="sub_add_preview(event)">' +
    fg('Copy setup from', '<select name="copy_from" onchange="prev_fill_name(this)">' + opts + '</select>') +
    fg('Preview name', '<input type="text" name="name" placeholder="e.g. Preview: Living Room 20G" required>') +
    '<div class="frow">' + vol_flds('', '') + '</div>' +
    fg('Setup Date', '<input type="date" name="setup" value="' + td + '" required>') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Create Preview</button></div>' +
    '</form>');
}

function prev_fill_name(sel) {
  var d = ld();
  var t = d.tanks.find(function(x){ return x.id === sel.value; });
  var f = sel.form;
  if (t) {
    f.name.value = 'Preview: ' + t.name;
    f.gal.value  = Math.round(t.gallons * 10) / 10;
    f.lit.value  = Math.round(t.gallons * 3.78541 * 10) / 10;
    f.setup.value = t.setup_date;
  } else {
    f.name.value = '';
    f.gal.value  = '';
    f.lit.value  = '';
  }
}

function sub_add_preview(e) {
  e.preventDefault(); var f = e.target;
  var copy_from = f.copy_from ? f.copy_from.value : '';
  var g = parseFloat(f.gal.value) || 0;
  var l = parseFloat(f.lit.value) || 0;
  if (!g && l) g = l / 3.78541;
  if (!g) {
    var src = copy_from ? ld().tanks.find(function(t){ return t.id === copy_from; }) : null;
    if (src) g = src.gallons;
  }
  if (!g) { alert('Enter tank volume'); return; }
  g = Math.round(g * 100) / 100;
  var src_tank = copy_from ? ld().tanks.find(function(t){ return t.id === copy_from; }) : null;
  var t = {
    id: gid(),
    name: f.name.value.trim(),
    gallons: g,
    liters: g2l(g),
    setup_date: f.setup.value,
    notes: '',
    room_tmin: src_tank ? src_tank.room_tmin : null,
    room_tmax: src_tank ? src_tank.room_tmax : null,
    preview: true
  };
  var d = ld();
  d.tanks.push(t); sv(d); sat(t.id);
  if (copy_from) copy_tank_data(copy_from, t.id);
  cm(); init();
}

function do_del_preview() {
  var t = ld().tanks.find(function(x){ return x.id === at(); });
  if (!t || !t.preview) return;
  if (!confirm('Delete preview tank "' + t.name + '" and all its data?')) return;
  del_tank(t.id);
  init();
}
function do_edit_tank() {
  var t = ld().tanks.find(function(x){ return x.id === at(); }); if (!t) return;
  om('<div class="mtitle">Edit Tank</div>' +
    '<form onsubmit="sub_edit_tank(event)">' +
    fg('Tank Name', '<input type="text" name="name" value="' + esc(t.name) + '" required>') +
    '<div class="frow">' + vol_flds(t.gallons, t.liters) + '</div>' +
    fg('Setup Date', '<input type="date" name="setup" value="' + t.setup_date + '" required>') +
    '<div style="font-size:12px;color:var(--muted);font-weight:600;margin-bottom:2px">Room Temperature — without any heater (' + t_lbl() + ')</div>' +
    '<div class="frow">' +
    fg('Min ' + t_lbl(), '<input type="number" name="room_tmin" value="' + (t.room_tmin != null ? d_t(t.room_tmin) : '') + '" placeholder="e.g. ' + (get_pref().temp === 'C' ? '20' : '68') + '">') +
    fg('Max ' + t_lbl(), '<input type="number" name="room_tmax" value="' + (t.room_tmax != null ? d_t(t.room_tmax) : '') + '" placeholder="e.g. ' + (get_pref().temp === 'C' ? '28' : '82') + '">') +
    '</div>' +
    fg('Notes', '<textarea name="notes">' + esc(t.notes) + '</textarea>') +
    '<div class="fg"><label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:400">' +
    '<input type="checkbox" name="show_feed_log"' + (t.show_feed_log ? ' checked' : '') + '>' +
    'Show Feeding Log in the Logs tab</label></div>' +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Save</button></div>' +
    '</form>');
}
function sub_edit_tank(e) {
  e.preventDefault(); var f = e.target;
  var lit = parseFloat(f.lit.value) || 0;
  var gal = parseFloat(f.gal.value) || 0;
  if (get_pref().vol === 'L' && lit) gal = lit / 3.78541;
  upd_tank(at(), f.name.value, gal, f.setup.value, f.notes.value, inp_t(f.room_tmin.value), inp_t(f.room_tmax.value), f.show_feed_log.checked);
  cm(); init();
}
function do_del_tank() {
  var t = ld().tanks.find(function(x){ return x.id === at(); }); if (!t) return;
  om('<div class="mtitle">Delete Tank</div>' +
    '<p style="font-size:14px;margin-bottom:14px">Delete <strong>' + esc(t.name) + '</strong>? This removes all equipment, plants, livestock, tasks and water readings. Cannot be undone.</p>' +
    '<div class="mact"><button class="btn bg" onclick="cm()">Cancel</button><button class="btn bd" onclick="del_tank(at());cm();init()">Delete</button></div>');
}

// ===== EQUIPMENT MODALS =====
function upd_equip_form(sel) {
  var t = sel.value;
  var ld_div = document.getElementById('eq_light_cfg');
  var fi_div = document.getElementById('eq_filter_cfg');
  var co_div = document.getElementById('eq_co2_cfg');
  var he_div = document.getElementById('eq_heater_cfg');
  if (ld_div) ld_div.style.display = t === 'Light' ? 'block' : 'none';
  if (fi_div) fi_div.style.display = t === 'Filter' ? 'block' : 'none';
  if (co_div) co_div.style.display = t === 'CO2 System' ? 'block' : 'none';
  if (he_div) he_div.style.display = t === 'Heater' ? 'block' : 'none';
}

function build_equip_cfg_html(type, cfg) {
  var light_d = type === 'Light' ? 'block' : 'none';
  var filt_d = type === 'Filter' ? 'block' : 'none';
  var co2_d = type === 'CO2 System' ? 'block' : 'none';
  var c = cfg || {};
  var spec_opts = ['WRGB','White','RGB','Plant/Full Spectrum','Basic Fluorescent']
    .map(function(o){ return '<option' + (c.spectrum === o ? ' selected' : '') + '>' + o + '</option>'; }).join('');
  var fst_opts = ['Canister','HOB (Hang-on-Back)','Sponge','Internal','Sump']
    .map(function(o){ return '<option' + (c.style === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('');
  var co2_opts = ['Pressurized / Paintball','DIY Yeast','Liquid Supplement']
    .map(function(o){ return '<option' + (c.co2_type === o ? ' selected' : '') + '>' + o + '</option>'; }).join('');
  return '<div id="eq_light_cfg" style="display:' + light_d + '">' +
    '<div class="cfg-sep"></div><div style="font-size:12px;font-weight:600;color:var(--mid);margin-bottom:6px">Light Settings</div>' +
    '<div class="frow">' +
    fg('Wattage (W)', '<input type="number" name="light_watts" value="' + (c.watts||'') + '" placeholder="e.g. 34" min="0">') +
    fg('Spectrum', '<select name="light_spectrum">' + spec_opts + '</select>') +
    fg('Hours / Day', '<input type="number" name="light_hours" value="' + (c.hours||'') + '" placeholder="e.g. 7" min="0" max="24">') +
    '</div></div>' +
    '<div id="eq_filter_cfg" style="display:' + filt_d + '">' +
    '<div class="cfg-sep"></div><div style="font-size:12px;font-weight:600;color:var(--mid);margin-bottom:6px">Filter Settings</div>' +
    '<div class="frow">' +
    fg('Flow Rate (' + fl_lbl() + ')', '<input type="number" name="filter_gph" value="' + (c.flow_gph ? d_fl(c.flow_gph) : '') + '" placeholder="e.g. ' + d_fl(180) + '" min="0">') +
    fg('Filter Style', '<select name="filter_style">' + fst_opts + '</select>') +
    '</div></div>' +
    '<div id="eq_co2_cfg" style="display:' + co2_d + '">' +
    '<div class="cfg-sep"></div><div style="font-size:12px;font-weight:600;color:var(--mid);margin-bottom:6px">CO2 Settings</div>' +
    '<div class="frow">' +
    fg('CO2 Type', '<select name="co2_type">' + co2_opts + '</select>') +
    fg('Hours / Day', '<input type="number" name="co2_hours" value="' + (c.hours||'') + '" placeholder="e.g. 5" min="0" max="24">') +
    fg('Bubble Rate (BPS)', '<input type="number" name="co2_bps" value="' + (c.bps||'') + '" placeholder="e.g. 2" min="0" step="0.5">') +
    '</div></div>' +
    '<div id="eq_heater_cfg" style="display:' + (type==='Heater'?'block':'none') + '">' +
    '<div class="cfg-sep"></div><div style="font-size:12px;font-weight:600;color:var(--mid);margin-bottom:6px">Heater Settings</div>' +
    '<div class="frow">' +
    fg('Wattage (W)', '<input type="number" name="heater_watts" value="' + (c.watts||'') + '" placeholder="e.g. 100 (5W per gallon)" min="0">') +
    fg('Heater Type', '<select name="heater_type"><option' + (c.heater_type==='Submersible'?' selected':'') + '>Submersible</option><option' + (c.heater_type==='Inline'?' selected':'') + '>Inline</option><option' + (c.heater_type==='Clip-on'?' selected':'') + '>Clip-on</option></select>') +
    '</div></div>';
}

function read_equip_cfg(f) {
  var t = f.type.value, cfg = {};
  if (t === 'Light') {
    cfg.watts = parseFloat(f.light_watts.value) || 0;
    cfg.spectrum = f.light_spectrum.value;
    cfg.hours = parseFloat(f.light_hours.value) || 0;
  } else if (t === 'Filter') {
    cfg.flow_gph = inp_fl(f.filter_gph.value);
    cfg.style = f.filter_style.value;
  } else if (t === 'CO2 System') {
    cfg.co2_type = f.co2_type.value;
    cfg.hours = parseFloat(f.co2_hours.value) || 0;
    cfg.bps = parseFloat(f.co2_bps.value) || 0;
  } else if (t === 'Heater') {
    cfg.watts = parseFloat(f.heater_watts.value) || 0;
    cfg.heater_type = f.heater_type.value;
  }
  return cfg;
}

function do_add_equip() {
  var type_opts = '<option>Filter</option><option>Heater</option><option>Light</option><option>CO2 System</option><option>Pump</option><option>Substrate</option><option>Thermometer</option><option>Other</option>';
  om('<div class="mtitle">Add Equipment</div>' +
    '<form onsubmit="sub_add_equip(event)">' +
    '<div class="frow">' +
    fg('Type', '<select name="type" onchange="upd_equip_form(this)">' + type_opts + '</select>') +
    fg('Name / Model', '<input type="text" name="name" placeholder="e.g. Fluval 307" required>') +
    '</div><div class="frow">' +
    fg('Brand', '<input type="text" name="brand" placeholder="e.g. Fluval">') +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '</div>' +
    build_equip_cfg_html('Filter', {}) +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add</button></div>' +
    '</form>');
}
function sub_add_equip(e) {
  e.preventDefault(); var f = e.target;
  add_equip(at(), f.type.value, f.name.value, f.brand.value, f.notes.value, read_equip_cfg(f));
  cm(); r_life();
}

function do_edit_equip(eid) {
  var eq = ld().equip.find(function(x){ return x.id === eid; }); if (!eq) return;
  var type_opts = ['Filter','Heater','Light','CO2 System','Pump','Substrate','Thermometer','Other']
    .map(function(o){ return '<option' + (eq.type === o ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('');
  om('<div class="mtitle">Edit Equipment</div>' +
    '<form data-id="' + eid + '" onsubmit="sub_edit_equip(event)">' +
    '<div class="frow">' +
    fg('Type', '<select name="type" onchange="upd_equip_form(this)">' + type_opts + '</select>') +
    fg('Name / Model', '<input type="text" name="name" value="' + esc(eq.name) + '" required>') +
    '</div><div class="frow">' +
    fg('Brand', '<input type="text" name="brand" value="' + esc(eq.brand) + '">') +
    fg('Notes', '<input type="text" name="notes" value="' + esc(eq.notes) + '">') +
    '</div>' +
    build_equip_cfg_html(eq.type, eq.config) +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Save</button></div>' +
    '</form>');
}
function sub_edit_equip(e) {
  e.preventDefault(); var f = e.target;
  upd_equip(f.dataset.id, f.type.value, f.name.value, f.brand.value, f.notes.value, read_equip_cfg(f));
  cm(); r_life();
}

// ===== PLANT MODAL =====

function upd_plant_form(sel) {
  var pid = sel.value;
  var cname_row = document.getElementById('pl_cname_row');
  var info_row = document.getElementById('pl_info_row');
  var req_el = document.getElementById('pl_req');
  var cname_inp = document.getElementById('pl_cname');
  if (pid === '_custom') {
    if (cname_row) cname_row.style.display = 'block';
    if (cname_inp) cname_inp.required = true;
    if (info_row) info_row.style.display = 'none';
  } else {
    if (cname_row) cname_row.style.display = 'none';
    if (cname_inp) cname_inp.required = false;
    var p = PL[pid];
    if (p && req_el) {
      var co2_str = p.co2 ? 'Required' : 'Not needed';
      req_el.innerHTML = 'Temp: ' + d_t(p.tmin) + '-' + d_t(p.tmax) + t_lbl() + ' &nbsp;|&nbsp; Light: <strong>' + p.light + '</strong> &nbsp;|&nbsp; CO2: <strong>' + co2_str + '</strong> &nbsp;|&nbsp; ' + p.diff + '<br><span style="color:var(--muted)">' + esc(p.note) + '</span>';
      if (info_row) info_row.style.display = 'block';
    }
  }
}
function build_plant_opts(co2_f, light_f, search) {
  var groups = ['Anubias','Bucephalandra','Cryptocoryne','Swords & Rosettes','Java Fern','Mosses','Floating','Stem Plants','Foreground & Carpet'];
  var q = search ? search.toLowerCase() : '';
  var h = '';
  groups.forEach(function(g) {
    var items = Object.keys(PL).filter(function(k) {
      var p = PL[k];
      if (p.group !== g) return false;
      if (co2_f === 'Yes' && !p.co2) return false;
      if (co2_f === 'No'  &&  p.co2) return false;
      if (light_f !== 'All' && p.light !== light_f) return false;
      if (q && p.name.toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    if (!items.length) return;
    h += '<optgroup label="' + g + '">';
    items.forEach(function(k) {
      var p = PL[k];
      h += '<option value="' + k + '">' + p.name + ' (' + p.light + ' light' + (p.co2 ? ', CO2' : '') + ')</option>';
    });
    h += '</optgroup>';
  });
  h += '<option value="_custom">-- Other / Custom Plant --</option>';
  return h;
}
function filter_plants() {
  var sel = document.querySelector('#mb select[name=pid]');
  var co2_sel = document.getElementById('pl_co2_filter');
  var light_sel = document.getElementById('pl_light_filter');
  var search_el = document.getElementById('pl_search');
  if (!sel) return;
  var co2_f   = co2_sel   ? co2_sel.value   : 'All';
  var light_f = light_sel ? light_sel.value : 'All';
  var q       = search_el ? search_el.value : '';
  sel.innerHTML = build_plant_opts(co2_f, light_f, q);
  upd_plant_form(sel);
}
function do_add_plant() {
  var td = today_str();
  var popts = build_plant_opts('All', 'All');
  om('<div class="mtitle">Add Plant</div>' +
    '<form onsubmit="sub_add_plant(event)">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">' +
    '<label style="font-size:12px;color:var(--muted);font-weight:600">Filter:</label>' +
    '<input type="text" id="pl_search" placeholder="Search plants..." oninput="filter_plants()" style="flex:1;min-width:120px;padding:5px 8px;border:1px solid #ccd5de;border-radius:4px;font-size:12px">' +
    '<select id="pl_light_filter" onchange="filter_plants()" style="width:auto">' +
    '<option value="All">Any light</option><option value="Low">Low light</option><option value="Medium">Medium light</option><option value="High">High light</option>' +
    '</select>' +
    '<select id="pl_co2_filter" onchange="filter_plants()" style="width:auto">' +
    '<option value="All">CO2: Any</option><option value="No">No CO2 needed</option><option value="Yes">CO2 required</option>' +
    '</select>' +
    '</div>' +
    fg('Plant Species', '<select name="pid" onchange="upd_plant_form(this)">' + popts + '</select>') +
    '<div id="pl_info_row" class="cfg-box" style="margin-bottom:10px"><div id="pl_req"></div></div>' +
    '<div id="pl_cname_row" style="display:none;margin-bottom:10px">' +
    fg('Custom Name', '<input type="text" name="cname" id="pl_cname" placeholder="Enter plant name">') +
    '</div>' +
    '<div class="frow">' +
    fg('Quantity', '<input type="number" name="qty" value="1" min="1">') +
    fg('Date Added', '<input type="date" name="added" value="' + td + '">') +
    '</div>' +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add</button></div>' +
    '</form>');
  var sel_el = document.querySelector("#mb select[name=pid]");
  if (sel_el) upd_plant_form(sel_el);
}
function sub_add_plant(e) {
  e.preventDefault(); var f = e.target;
  var pid = f.pid.value;
  if (pid === '_custom') {
    var pname = f.cname.value.trim();
    if (!pname) { alert('Please enter a plant name.'); return; }
    add_plant(at(), '', pname, f.qty.value, f.added.value, f.notes.value);
  } else {
    add_plant(at(), pid, PL[pid] ? PL[pid].name : pid, f.qty.value, f.added.value, f.notes.value);
  }
  cm(); r_life();
}

// ===== LIVESTOCK MODAL =====
function upd_stock_compat(sel) {
  var sid = sel.value, d = ld(), tid = at(), sp_all = get_sp(d);
  var result_el = document.getElementById('stk_compat');
  var custom_el = document.getElementById('stk_custom_fields');
  if (custom_el) custom_el.style.display = (sid === '_custom') ? 'block' : 'none';
  if (!result_el) return;
  if (sid === '_custom' || !sp_all[sid]) { result_el.innerHTML = ''; return; }
  var new_sp = sp_all[sid], parts = [];

  // Difficulty level warning
  if (new_sp.level !== 'Beginner') {
    var lc = new_sp.level === 'Advanced' ? 'var(--danger)' : 'var(--warn)';
    parts.push('<div style="color:' + lc + ';font-size:12px;font-weight:700">&#x26A0; ' + new_sp.level + ' species</div>');
    if (new_sp.hard_reason) {
      parts.push('<div style="color:' + lc + ';font-size:12px;margin-top:2px">' + esc(new_sp.hard_reason) + '</div>');
    }
  }

  // Min tank size
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  if (tank && new_sp.min_gal && tank.gallons < new_sp.min_gal) {
    parts.push('<div style="color:var(--danger);font-size:12px;font-weight:700;margin-top:2px">&#x1F4CF; Tank too small: needs ' + d_v(new_sp.min_gal) + ' ' + v_lbl() + ' min, yours is ' + d_v(tank.gallons) + ' ' + v_lbl() + '</div>');
  }

  // Room temperature compatibility
  if (tank && tank.room_tmin != null) {
    var rt_min = tank.room_tmin, rt_max = tank.room_tmax;
    var too_cold = rt_min < new_sp.tmin;
    var too_hot  = rt_max != null && rt_max > new_sp.tmax;
    if (too_hot) {
      parts.push('<div style="color:var(--danger);font-size:12px;font-weight:700;margin-top:2px">' +
        '&#x1F321; Room too hot: your max (' + d_t(rt_max) + t_lbl() + ') exceeds this fish max (' + d_t(new_sp.tmax) + t_lbl() + '). Needs a chiller or AC.</div>');
    } else if (too_cold) {
      parts.push('<div style="color:var(--warn);font-size:12px;margin-top:2px">' +
        '&#x1F321; Heater required: room min (' + d_t(rt_min) + t_lbl() + ') is below this fish minimum (' + d_t(new_sp.tmin) + t_lbl() + ').</div>');
    } else {
      parts.push('<div style="color:var(--ok);font-size:12px;margin-top:2px">' +
        '&#x2713; Fits your room temperature (' + d_t(rt_min) + '-' + (rt_max != null ? d_t(rt_max) : '?') + t_lbl() + ') — no heater needed.</div>');
    }
  }

  // Compatibility with existing stock
  var existing = d.stock.filter(function(s){ return s.tank_id === tid; });
  if (!existing.length) {
    parts.push('<div style="color:var(--muted);font-size:12px">First fish — no compatibility check needed.</div>');
  } else {
    var conflicts = [];
    existing.forEach(function(s) {
      var sp = sp_all[s.species_id]; if (!sp) return;
      var iss = [], beh_reason = null;
      if (Math.max(new_sp.tmin,sp.tmin) > Math.min(new_sp.tmax,sp.tmax)) iss.push('temp');
      if (Math.max(new_sp.pmin,sp.pmin) > Math.min(new_sp.pmax,sp.pmax)) iss.push('pH');
      if (Math.max(new_sp.gmin,sp.gmin) > Math.min(new_sp.gmax,sp.gmax)) iss.push('hardness');
      beh_reason = behavior_incompat(sid, new_sp, s.species_id, sp);
      if (iss.length || beh_reason) conflicts.push({name: sp.name, params: iss, beh: beh_reason});
    });
    if (conflicts.length) {
      conflicts.forEach(function(c) {
        var msg = '<strong>' + esc(c.name) + '</strong>';
        if (c.params.length) msg += ' — parameter conflict: ' + c.params.join(', ');
        if (c.beh) msg += '<br><span style="color:var(--danger)">' + esc(c.beh) + '</span>';
        parts.push('<div style="color:var(--danger);font-size:12px;margin-top:4px">&#x26A0; ' + msg + '</div>');
      });
    } else {
      parts.push('<div style="color:var(--ok);font-size:12px;font-weight:700">&#x2713; Compatible with all current livestock</div>');
    }
  }

  result_el.innerHTML = parts.join('');
}
function build_stock_opts(level_filter, heater_filter, type_filter, search) {
  var d = ld(), sp_all = get_sp(d);
  var tank = d.tanks.find(function(t){ return t.id === at(); });
  var rt_min = tank && tank.room_tmin != null ? tank.room_tmin : null;
  var q = search ? search.toLowerCase() : '';
  var opts = Object.keys(sp_all)
    .filter(function(k) {
      var sp = sp_all[k];
      if (level_filter && level_filter !== 'All' && sp.level !== level_filter) return false;
      if (rt_min != null && heater_filter === 'no_heater' && rt_min < sp.tmin) return false;
      if (rt_min != null && heater_filter === 'heater_req' && rt_min >= sp.tmin) return false;
      if (type_filter && type_filter !== 'All' && sp.type !== type_filter) return false;
      if (q && sp.name.toLowerCase().indexOf(q) === -1) return false;
      return true;
    })
    .sort(function(a,b){ return sp_all[a].name.localeCompare(sp_all[b].name); })
    .map(function(k) {
      var sp = sp_all[k], bl = sp.bioload, bl_lbl = bl <= 1 ? 'Low' : bl <= 3 ? 'Med' : 'High';
      var lvl = sp.level === 'Intermediate' ? ' ★★' : sp.level === 'Advanced' ? ' ★★★' : '';
      var heat_tag = rt_min != null ? (rt_min >= sp.tmin ? ' \xB7 no heater' : ' \xB7 heater') : '';
      var custom_tag = sp.custom ? ' \xB7 custom' : '';
      return '<option value="' + k + '">' + sp.name + ' (' + (sp.type||'Fish') + ' \xB7 Bioload: ' + bl_lbl + lvl + heat_tag + custom_tag + ')</option>';
    }).join('');
  return opts + '<option value="_custom">+ Not in the list? Define custom species...</option>';
}

function filter_stock_all() {
  var level_sel  = document.querySelector('#mb select[name=level_f]');
  var heater_sel = document.querySelector('#mb select[name=heater_f]');
  var type_sel   = document.getElementById('sp_type_filter');
  var search_el  = document.getElementById('sp_search');
  var lf = level_sel  ? level_sel.value  : 'All';
  var hf = heater_sel ? heater_sel.value : 'All';
  var tf = type_sel   ? type_sel.value   : 'All';
  var q  = search_el  ? search_el.value  : '';
  var species_sel = document.querySelector('#mb select[name=sid]');
  if (!species_sel) return;
  species_sel.innerHTML = build_stock_opts(lf, hf, tf, q);
  upd_stock_compat(species_sel);
}

function filter_stock_level(sel) { filter_stock_all(); }
function filter_stock_heater(sel) { filter_stock_all(); }

function do_add_stock() {
  var td = today_str(), d = ld(), tid = at();
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  var recent = d.stock.filter(function(s) {
    if (s.tank_id !== tid) return false;
    return Math.floor((Date.now() - new Date(s.added_date + 'T00:00:00').getTime()) / 86400000) < 14;
  });
  var speed_warn = recent.length ? '<div style="background:#fef3d5;border-radius:6px;padding:8px 10px;font-size:12px;color:#8a5a00;margin-bottom:10px">&#x26A0; You added livestock within the last 14 days. Adding more too quickly can spike ammonia. Consider waiting a bit longer.</div>' : '';
  var heater_row = (tank && tank.room_tmin != null)
    ? '<select name="heater_f" onchange="filter_stock_heater(this)" style="width:auto">' +
      '<option value="All">All temps</option>' +
      '<option value="no_heater">No heater needed</option>' +
      '<option value="heater_req">Heater required</option>' +
      '</select>'
    : '';
  om('<div class="mtitle">Add Livestock</div>' +
    speed_warn +
    '<form onsubmit="sub_add_stock(event)">' +
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">' +
    '<label style="font-size:12px;color:var(--muted);font-weight:600">Filter:</label>' +
    '<input type="text" id="sp_search" placeholder="Search species..." oninput="filter_stock_all()" style="flex:1;min-width:120px;padding:5px 8px;border:1px solid #ccd5de;border-radius:4px;font-size:12px">' +
    '<select id="sp_type_filter" onchange="filter_stock_all()" style="width:auto">' +
    '<option value="All">All types</option>' +
    '<option value="Fish">Fish</option>' +
    '<option value="Shrimp">Shrimp</option>' +
    '<option value="Snail">Snail</option>' +
    '<option value="Turtle">Turtle</option>' +
    '<option value="Amphibian">Amphibian</option>' +
    '</select>' +
    '<select name="level_f" onchange="filter_stock_level(this)" style="width:auto">' +
    '<option value="All">All levels</option>' +
    '<option value="Beginner" selected>Beginner only</option>' +
    '<option value="Intermediate">Intermediate</option>' +
    '<option value="Advanced">Advanced</option>' +
    '</select>' +
    heater_row +
    '</div>' +
    '<div class="frow">' +
    fg('Species', '<select name="sid" onchange="upd_stock_compat(this)">' + build_stock_opts('Beginner', 'All', 'All', '') + '</select>') +
    fg('Display Name', '<input type="text" name="dname" placeholder="Leave blank for species name">') +
    '</div>' +
    '<div id="stk_compat" style="min-height:18px;margin:4px 0 0;padding:0 2px"></div>' +
    '<div id="stk_custom_fields" style="display:none;background:#f0f8ff;border:1px solid #c8dff0;border-radius:8px;padding:12px;margin:8px 0">' +
    '<div style="font-size:12px;font-weight:700;color:var(--mid);margin-bottom:10px">Define your custom species</div>' +
    '<div class="frow">' +
    fgh('Species name *', '<input type="text" name="csp_name" placeholder="e.g. Peacock Cichlid">') +
    fgh('Type', '<select name="csp_type"><option value="Fish">Fish</option><option value="Shrimp">Shrimp</option><option value="Snail">Snail</option><option value="Crab">Crab</option><option value="Amphibian">Amphibian</option><option value="Other">Other</option></select>') +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
    fgh('Temp min (\xB0F)', '<input type="number" name="csp_tmin" step="0.1" placeholder="72">') +
    fgh('Temp max (\xB0F)', '<input type="number" name="csp_tmax" step="0.1" placeholder="82">') +
    fgh('pH min', '<input type="number" name="csp_pmin" step="0.1" placeholder="6.5">') +
    fgh('pH max', '<input type="number" name="csp_pmax" step="0.1" placeholder="7.5">') +
    fgh('GH min (dGH)', '<input type="number" name="csp_gmin" step="0.1" placeholder="4">') +
    fgh('GH max (dGH)', '<input type="number" name="csp_gmax" step="0.1" placeholder="12">') +
    fgh('Adult size (in)', '<input type="number" name="csp_size" step="0.1" placeholder="2">') +
    fgh('Min tank (gal)', '<input type="number" name="csp_mingal" placeholder="10">') +
    '</div>' +
    '<div class="frow">' +
    fgh('Bioload', '<select name="csp_bioload"><option value="1">1 — Very low</option><option value="2" selected>2 — Low</option><option value="3">3 — Medium</option><option value="4">4 — High</option><option value="5">5 — Very high</option></select>') +
    fgh('Care level', '<select name="csp_level"><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option></select>') +
    '</div>' +
    '</div>' +
    '<div class="frow">' +
    fg('Quantity', '<input type="number" name="qty" value="1" min="1">') +
    fg('Date Added', '<input type="date" name="added" value="' + td + '">') +
    '</div>' +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '<div style="background:#fef3d5;border-radius:6px;padding:8px 10px;font-size:12px;color:#8a5a00;margin:10px 0"><strong>&#x1F41F; Acclimation:</strong> Float the sealed bag in your tank for 15-20 min to equalise temperature. Then add a small cup of tank water to the bag every 5 minutes for 30 minutes. Net the fish out — do not pour store water into your tank.</div>' +
    '<div style="background:#e8f4fb;border-radius:6px;padding:8px 10px;font-size:12px;color:#1a5a7a;margin-bottom:10px"><strong>&#x1F4A1; Quarantine tip:</strong> Ideally quarantine new fish in a separate tank for 2-4 weeks before adding to your main tank. This prevents disease from spreading to existing livestock.</div>' +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add</button></div>' +
    '</form>');
  var sel_el = document.querySelector('#mb select[name=sid]');
  if (sel_el) upd_stock_compat(sel_el);
}
function sub_add_stock(e) {
  e.preventDefault(); var f = e.target;
  var sid = f.sid.value;
  if (sid === '_custom') {
    var cname = f.csp_name.value.trim();
    if (!cname) { alert('Please enter a species name.'); return; }
    sid = 'custom_' + gid();
    add_custom_sp(sid, cname, f.csp_type.value, f.csp_tmin.value, f.csp_tmax.value,
      f.csp_pmin.value, f.csp_pmax.value, f.csp_gmin.value, f.csp_gmax.value,
      f.csp_size.value, f.csp_mingal.value, f.csp_bioload.value, f.csp_level.value, '');
    add_stock(at(), sid, cname, f.qty.value, f.added.value, f.notes.value);
  } else {
    add_stock(at(), sid, f.dname.value, f.qty.value, f.added.value, f.notes.value);
  }
  cm(); r_life();
}


// ===== HOW TO TAB =====
function r_howto() {
  var el = document.getElementById('p-howto');
  if (!el) return;
  var h = '';

  // ── PART 1 header ──
  h += '<div style="background:linear-gradient(135deg,var(--deep),var(--mid));color:#fff;border-radius:10px;padding:20px 22px;margin-bottom:18px">' +
       '<div style="font-size:18px;font-weight:700;margin-bottom:4px">Part 1 &mdash; Starting and Running a Freshwater Aquarium</div>' +
       '<div style="font-size:13px;opacity:.85">The right order matters. Follow these five stages and your tank will thrive from day one.</div>' +
       '</div>';

  // ── Step tracker bar ──
  var stage_labels = ['Setup','Nitrogen Cycle','Cleaner Crew','Add Fish','Routine Care'];
  h += '<div style="display:flex;gap:0;margin-bottom:20px;border-radius:8px;overflow:hidden">';
  stage_labels.forEach(function(s, i) {
    var bg = ['#1a6b8a','#4db8d4','#e8a838','#3ab87a','#6b7280'][i];
    h += '<div style="flex:1;background:' + bg + ';color:#fff;text-align:center;padding:8px 4px;font-size:11px;font-weight:600">' +
         '<div style="font-size:16px">' + ['&#x1F4E6;','&#x1F9EA;','&#x1F422;','&#x1F420;','&#x1F504;'][i] + '</div>' + s + '</div>';
  });
  h += '</div>';

  // helper: step card
  function step(num, color, icon, title, sub, body) {
    return '<div class="card" style="border-left:4px solid ' + color + ';margin-bottom:14px">' +
           '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
           '<div style="background:' + color + ';color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0">' + num + '</div>' +
           '<div><div style="font-size:15px;font-weight:700">' + icon + ' ' + title + '</div>' +
           '<div style="font-size:12px;color:var(--muted)">' + sub + '</div></div></div>' +
           body + '</div>';
  }

  function bullets(items) {
    var r = '<ul style="margin:0;padding-left:18px">';
    items.forEach(function(i){ r += '<li style="font-size:13px;margin-bottom:5px">' + i + '</li>'; });
    return r + '</ul>';
  }

  function warn_box(txt) {
    return '<div style="background:#fde0e0;border-left:3px solid var(--danger);border-radius:0 6px 6px 0;padding:8px 12px;margin-top:10px;font-size:12px;color:#a01818;font-weight:600">&#x26A0; ' + txt + '</div>';
  }

  function tip_box(txt) {
    return '<div style="background:#e8f4fd;border-left:3px solid #4db8d4;border-radius:0 6px 6px 0;padding:8px 12px;margin-top:10px;font-size:12px;color:#0a2342">&#x1F4A1; ' + txt + '</div>';
  }

  function ok_box(txt) {
    return '<div style="background:#eaf8f1;border-left:3px solid var(--ok);border-radius:0 6px 6px 0;padding:8px 12px;margin-top:10px;font-size:12px;color:#1a5c3a;font-weight:600">&#x2705; ' + txt + '</div>';
  }

  // Step 1: Setup
  h += step(1, '#1a6b8a', '&#x1F4E6;', 'Tank Setup', 'Day 1 — before any water goes in',
    bullets([
      'Rinse the tank, substrate, and all decorations with <strong>clean water only</strong> — never soap or detergent',
      'Add substrate (2-3 inches for planted tanks, 1 inch for bare-bottom)',
      'Place decorations, driftwood, or rocks',
      'Fill slowly — put a plate on the substrate and pour onto it to avoid clouding',
      'Add <strong>dechlorinator</strong> to the water before or immediately after filling (e.g. Seachem Prime)',
      'Install and start the <strong>filter and heater</strong>',
      'Set heater to your target species temperature and let it stabilise for 24 hours',
    ]) +
    warn_box('Do not add fish or cycle starter yet. Let the water temperature and chemistry settle for 24 hours first.') +
    tip_box('Tap water contains chlorine and chloramine that kill beneficial bacteria. Always dechlorinate before the filter starts, so you protect the good bacteria from day one.')
  );

  // Step 2: Nitrogen Cycle
  h += step(2, '#4db8d4', '&#x1F9EA;', 'The Nitrogen Cycle', 'Weeks 1&ndash;6 — the most important phase',
    '<p style="font-size:13px;margin:0 0 10px">Fish waste and uneaten food produce <strong>ammonia (NH3)</strong> — toxic to fish. Beneficial bacteria in your filter convert it first to <strong>nitrite (NO2)</strong>, then to the less-harmful <strong>nitrate (NO3)</strong>. A fully cycled tank does this conversion automatically and constantly.</p>' +
    '<p style="font-size:13px;font-weight:600;margin:0 0 8px">The four phases:</p>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">' +
    ['NH3 spikes — bacteria start colonising the filter|#e8a838',
     'NO2 spikes — first bacteria are established|#e05252',
     'NH3 and NO2 both falling — almost done|#f59e0b',
     'NH3 = 0, NO2 = 0, NO3 detectable — cycled!|#3ab87a'].map(function(s,i){
      var parts = s.split('|');
      return '<div style="background:' + parts[1] + '18;border:1px solid ' + parts[1] + '44;border-radius:6px;padding:8px 10px;font-size:12px">' +
             '<span style="font-weight:700;color:' + parts[1] + '">Phase ' + (i+1) + ':</span> ' + parts[0] + '</div>';
    }).join('') +
    '</div>' +
    '<p style="font-size:13px;font-weight:600;margin:0 0 6px">How to start the cycle:</p>' +
    bullets([
      '<strong>Fishless (recommended):</strong> add pure ammonia (no surfactants) to 2&ndash;4 ppm. Re-dose to 2 ppm each time it drops to 0.',
      '<strong>Fish-in:</strong> add 1&ndash;2 very hardy fish (danios, guppies). Dose Seachem Prime daily to detoxify NH3 and NO2. Do 25% water changes when NH3 or NO2 exceeds 1 ppm.',
      'Test <strong>every 2 days</strong>. Log every result in this app.',
      'Cycle is complete when NH3 and NO2 both hit 0 within 24 hours of dosing, and NO3 is detectable.',
      'Then do a 30&ndash;50% water change to flush accumulated nitrates before adding livestock.',
    ]) +
    warn_box('Never do large water changes during the cycle — you will wash away the bacteria you are growing. Small changes only if NH3 or NO2 exceed 2 ppm.') +
    tip_box('Seeding the filter with media or gravel from an established tank cuts the cycle time from 6 weeks to as little as 1&ndash;2 weeks.')
  );

  // Step 3: Cleaner Crew
  h += step(3, '#e8a838', '&#x1F422;', 'Introduce the Cleaner Crew', 'After the cycle is complete',
    '<p style="font-size:13px;margin:0 0 10px">Before adding fish, put a <strong>small clean-up crew</strong> in place. They eat algae, leftover food, and detritus, keeping the tank balanced.</p>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">' +
    [
      ['&#x1F422;','Nerite Snails','Best algae scrapers. Cannot breed in freshwater.'],
      ['&#x1F422;','Mystery Snails','Clean up detritus and leftover food.'],
      ['&#x1F990;','Cherry Shrimp','Scavengers. Eat biofilm and algae off plants.'],
      ['&#x1F41F;','Corydoras','Bottom cleaners. Work the substrate.'],
      ['&#x1F40C;','Amano Shrimp','Strong algae eaters, especially hair algae.'],
      ['&#x1F422;','Nerite Snail','1 snail per 5 gal is a good starting ratio.'],
    ].slice(0,5).map(function(e){
      return '<div style="background:#f5f8fb;border-radius:6px;padding:8px 10px;font-size:12px">' +
             '<div style="font-size:18px">' + e[0] + '</div>' +
             '<div style="font-weight:600">' + e[1] + '</div>' +
             '<div style="color:var(--muted);margin-top:2px">' + e[2] + '</div></div>';
    }).join('') +
    '</div>' +
    bullets([
      'Add 2&ndash;3 animals at a time — do not overload the tank in one go',
      'Let them settle for <strong>1 week</strong> before adding any fish',
      'Watch for signs of stress (hiding completely, not moving) for 48 hours after adding',
    ]) +
    tip_box('Snails are great early indicators — if they stay clamped shut or stop moving within 24 hours, test your water immediately.')
  );

  // Step 4: Introduce Fish
  h += step(4, '#3ab87a', '&#x1F420;', 'Introduce Your Fish', '1&ndash;2 weeks after the cleaner crew',
    '<p style="font-size:13px;margin:0 0 10px">Adding too many fish at once spikes ammonia and can crash a new cycle. Go slowly and watch closely.</p>' +
    bullets([
      '<strong>Research first:</strong> check that temperature, pH, and GH ranges overlap for every species you plan to keep',
      '<strong>Acclimate properly:</strong> float the bag in the tank for 15 minutes, then add small amounts of tank water to the bag every 5 minutes for 30 minutes before releasing',
      '<strong>Add 2&ndash;3 fish at a time</strong>, maximum — even in large tanks',
      '<strong>Wait 2 weeks</strong> before adding the next group — your cycle needs time to catch up',
      'Test water 48 hours after each addition to confirm NH3 and NO2 stay at 0',
      'Quarantine new fish in a separate tank for 2&ndash;4 weeks if you can — prevents disease spread',
    ]) +
    warn_box('Never add fish from the pet store bag water into your tank. Net them out or tip the bag sideways and let them swim out. Store bag water can carry disease and parasites.') +
    ok_box('Use the Recommendations tab in this app to check that all your species parameters overlap before you buy.')
  );

  // Step 5: Routine Maintenance
  h += step(5, '#6b7280', '&#x1F504;', 'Routine Maintenance', 'Ongoing — what keeps a tank healthy long-term',
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
    [
      ['Weekly','#4db8d4','&#x1F9EA; Test water parameters — NH3, NO2, NO3, pH<br>&#x1FAE7; Wipe the inside glass<br>&#x1F4CA; Log readings in the app'],
      ['Every 1&ndash;2 weeks','#1a6b8a','&#x1F4A7; 25&ndash;30% water change<br>&#x1FA79; Gravel vacuum while draining<br>&#x1F4DD; Log the water change in Maintenance'],
      ['Monthly','#e8a838','&#x1F9F9; Rinse filter media <strong>in tank water only</strong><br>&#x1F321; Check heater accuracy with thermometer<br>&#x1F4A1; Top up fertilisers if planted'],
      ['Every 2&ndash;4 weeks','#3ab87a','&#x2702;&#xFE0F; Trim plants and remove dead leaves<br>&#x1F50D; Inspect fish for spots, torn fins, clamped fins<br>&#x1F4CB; Update the app with any new livestock'],
    ].map(function(s){
      return '<div style="border:1px solid ' + s[1] + '44;border-radius:8px;padding:12px">' +
             '<div style="font-weight:700;color:' + s[1] + ';font-size:13px;margin-bottom:8px">' + s[0] + '</div>' +
             '<div style="font-size:12px;line-height:1.8">' + s[2] + '</div></div>';
    }).join('') +
    '</div>' +
    tip_box('The single biggest mistake new fishkeepers make is skipping water changes. Even in a healthy tank, nitrates build up. Regular partial changes are the foundation of fish health.')
  );

  // ── PART 2 header ──
  h += '<div style="background:linear-gradient(135deg,#1a5c3a,#3ab87a);color:#fff;border-radius:10px;padding:20px 22px;margin:24px 0 18px">' +
       '<div style="font-size:18px;font-weight:700;margin-bottom:4px">Part 2 &mdash; Using AquaTracker</div>' +
       '<div style="font-size:13px;opacity:.85">How each feature in this app supports your hobby, from day one through long-term care.</div>' +
       '</div>';

  function app_step(num, color, icon, title, body) {
    return '<div style="display:flex;gap:12px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f0f0f0">' +
           '<div style="background:' + color + ';color:#fff;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0">' + num + '</div>' +
           '<div style="flex:1"><div style="font-size:14px;font-weight:700;margin-bottom:6px">' + icon + ' ' + title + '</div>' + body + '</div></div>';
  }

  h += '<div class="card">';

  h += app_step(1, '#1a6b8a', '&#x1F4E6;', 'Add Your Tank',
    '<p style="font-size:13px;margin:0 0 6px">Everything in the app is tied to a tank. Click <strong>+ Add Tank</strong> in the top nav bar to create your first one.</p>' +
    bullets([
      'Enter the tank name, volume (gallons or litres), and setup date',
      'The setup date starts the <strong>New Tank Setup Checklist</strong> on the Dashboard',
      'You can have multiple tanks — switch between them using the dropdown in the nav bar',
    ])
  );

  h += app_step(2, '#4db8d4', '&#x1F527;', 'Equipment &amp; Life Tab',
    '<p style="font-size:13px;margin:0 0 6px">This is where you record everything in and around the tank.</p>' +
    bullets([
      '<strong>Equipment:</strong> log your filter, heater, light, CO2 system. The app uses filter type to adjust bioload capacity, and heater presence to check if your fish need one.',
      '<strong>Plants:</strong> choose from 20 common species. The app tracks light and CO2 requirements and uses your plant list to filter fish and plant suggestions in Recommendations.',
      '<strong>Fertilizers:</strong> pick a preset (Seachem Flourish, Easy Green, etc.) and the app calculates your dose from your tank volume. Each fertilizer appears as a scheduled task in your Recommended Schedule.',
      '<strong>Livestock:</strong> add each species individually. The app checks bioload, tank size, and compatibility with every other species in the tank.',
    ])
  );

  h += app_step(3, '#e8a838', '&#x1F9EA;', 'Water Log Tab',
    '<p style="font-size:13px;margin:0 0 6px">Log water test results here every time you test. Date, temperature, NH3, NO2, NO3, pH, and GH.</p>' +
    bullets([
      'The app draws a line chart so you can see parameter trends over time',
      'The Dashboard shows your latest readings with colour-coded status (green = safe, amber = watch, red = act now)',
      'During the nitrogen cycle, log every 2 days — the Cycle Tracker on the Dashboard reads directly from these entries',
      'All data stays in your browser (localStorage) — export a backup from the nav bar regularly',
    ])
  );

  h += app_step(4, '#4db8d4', '&#x1F4CA;', 'Dashboard',
    '<p style="font-size:13px;margin:0 0 6px">Your daily snapshot. Check this every time you sit down at the tank.</p>' +
    bullets([
      '<strong>Nitrogen Cycle Tracker:</strong> shows the current cycle phase, testing frequency, and what to do next. Disappears once the cycle is complete.',
      '<strong>New Tank Setup Checklist:</strong> tracks your first-time setup steps. Auto-checks filter, heater, and water tests when you add them in other tabs.',
      '<strong>Water readings card:</strong> last logged values with status indicators. Ammonia and nitrite show a warning at any level above 0.',
      '<strong>Bioload gauge:</strong> shows what percentage of your tank\\'s capacity is used by your current stocking.',
      '<strong>Upcoming tasks:</strong> next three maintenance tasks with days remaining.',
    ])
  );

  h += app_step(5, '#6b7280', '&#x1F4CB;', 'Maintenance Tab',
    '<p style="font-size:13px;margin:0 0 6px">Your personal task list. Add tasks manually or import them from the Recommended Schedule.</p>' +
    bullets([
      'Tasks are sorted by urgency: <span style="color:var(--danger);font-weight:600">overdue</span> → <span style="color:var(--warn);font-weight:600">due soon</span> → upcoming',
      'Click <strong>Mark Done</strong> to reset the timer — the next due date is recalculated automatically',
      'Set a frequency that matches your real routine — the app nudges you when you are overdue',
      'Water changes, filter rinses, glass wipes, fertilizing, pruning, and custom tasks are all supported',
    ])
  );

  h += app_step(6, '#1a6b8a', '&#x1F4A1;', 'Recommendations Tab',
    '<p style="font-size:13px;margin:0 0 6px">The app analyses your tank and gives you personalised suggestions.</p>' +
    bullets([
      '<strong>Recommended Schedule:</strong> water change frequency, filter clean, water test, glass wipe, gravel vac, plant trimming, fertilizer doses — all tuned to your bioload and setup. Click <em>Add Task</em> to send any recommendation to Maintenance.',
      '<strong>Livestock Compatibility:</strong> shows the safe temperature, pH, and GH range that all your current fish agree on. Flags any incompatible pairs.',
      '<strong>Suggested Fish:</strong> fish from the database that fit your water parameters and do not conflict with existing livestock.',
      '<strong>Suggested Plants:</strong> plants that match your lighting, CO2, and fish temperature range, sorted by difficulty.',
    ])
  );

  h += app_step(7, '#e8a838', '&#x1F9F0;', 'Toolkit Tab',
    '<p style="font-size:13px;margin:0 0 6px">A physical equipment reference so you know exactly what to buy and have on hand.</p>' +
    bullets([
      'Lists which test kits to use for each parameter (with tips on reading them accurately)',
      'Water change equipment checklist with a step-by-step guide',
      'Cycling supplies section visible while your tank is still cycling (fishless and fish-in options)',
      'Quick reference tips: what to never do (soap, tap water on filter media) and what always helps',
    ])
  );

  h += app_step(8, '#3ab87a', '&#x1F4BE;', 'Backup Your Data',
    '<p style="font-size:13px;margin:0 0 6px">All data is stored in your browser. If you clear your browser data, it is gone.</p>' +
    bullets([
      'Click <strong>Export</strong> in the nav bar regularly to download a JSON backup file',
      'To restore: click <strong>Import</strong> and select your backup file',
      'Back up before browser updates, device changes, or clearing history',
      'The export file is human-readable — you can open it in any text editor',
    ]) +
    warn_box('This app has no server or cloud sync. Your data lives only in this browser on this device. Export a backup at least monthly.')
  );

  h += '</div>'; // close card

  el.innerHTML = h;
}

// ===== TOOLKIT TAB =====
function r_tools() {
  var tid = at(), d = ld(), el = document.getElementById('p-tools');
  if (!el) return;
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  if (!tank) { el.innerHTML = '<p class="emsg">Add a tank first to see toolkit guidance.</p>'; return; }
  var cyc = cycle_status(tid);
  var is_cycling = !tank.cycled && cyc.phase < 4;
  var h = '';

  // === Test Kit Instructions ===
  var tk_brands = [
    {id:'bionix', label:'BIONIX', tests:[
      {id:'ph',       label:'pH'},
      {id:'ammonia',  label:'Ammonia'},
      {id:'nitrite',  label:'Nitrite'},
      {id:'nitrate',  label:'Nitrate'},
      {id:'th_ca_mg', label:'Total Hardness, Calcium & Magnesium'}
    ]}
  ];
  h += '<div class="card">';
  h += '<div class="ctitle">Test Kit Instructions</div>';
  h += '<p style="font-size:13px;color:var(--muted);margin-bottom:12px">Select your test kit brand and the test you are performing to see step-by-step instructions and a result calculator.</p>';
  // Brand selector
  h += '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px">';
  h += '<div class="fg" style="margin:0;min-width:180px">';
  h += '<label style="font-size:12px;color:var(--muted);font-weight:600;display:block;margin-bottom:4px">Brand</label>';
  h += '<select style="width:100%" onchange="set_tk_brand(this.value)">';
  h += '<option value="">-- Select brand --</option>';
  tk_brands.forEach(function(b) {
    h += '<option value="' + b.id + '"' + (tk_brand === b.id ? ' selected' : '') + '>' + b.label + '</option>';
  });
  h += '</select></div>';
  // Test selector
  var sel_brand = tk_brands.find(function(b){ return b.id === tk_brand; });
  if (sel_brand) {
    h += '<div class="fg" style="margin:0;min-width:280px">';
    h += '<label style="font-size:12px;color:var(--muted);font-weight:600;display:block;margin-bottom:4px">Test</label>';
    h += '<select style="width:100%" onchange="set_tk_test(this.value)">';
    h += '<option value="">-- Select test --</option>';
    sel_brand.tests.forEach(function(t) {
      h += '<option value="' + t.id + '"' + (tk_test === t.id ? ' selected' : '') + '>' + t.label + '</option>';
    });
    h += '</select></div>';
  }
  h += '</div>';

  // Shared "before you start" tips helper
  function tk_tips_html(extra) {
    var tips = [
      'Wash the test tube with sample water before performing any test.',
      'Shake the liquid reagent bottle properly before use.',
      'Hold the dropper bottle completely vertical (upside down) when adding drops &mdash; this ensures consistent drop size.',
      'Test the sample as soon as possible after collecting from the source.',
      'Store the kit at room temperature in a cool, dark place when not in use.'
    ];
    if (extra) tips.push(extra);
    var out = '<div style="background:#f0f8ff;border-radius:8px;padding:12px 14px;margin-bottom:14px">';
    out += '<div style="font-size:13px;font-weight:600;margin-bottom:8px">Before you start</div>';
    tips.forEach(function(t, i) {
      out += '<div style="display:flex;gap:8px;font-size:13px;margin-bottom:5px">' +
             '<span style="font-weight:700;color:var(--surf);flex-shrink:0">' + (i+1) + '.</span>' +
             '<span>' + t + '</span></div>';
    });
    return out + '</div>';
  }
  function tk_steps_html(steps, accent) {
    var out = '';
    steps.forEach(function(s, i) {
      out += '<div style="display:flex;gap:10px;margin-bottom:10px;font-size:13px">' +
             '<div style="flex-shrink:0;width:26px;height:26px;border-radius:50%;background:' + accent + ';color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">' + (i+1) + '</div>' +
             '<div style="padding-top:4px">' + s + '</div></div>';
    });
    return out;
  }

  // BIONIX — pH
  if (tk_brand === 'bionix' && tk_test === 'ph') {
    h += tk_tips_html('While matching the colour, always place the test tube against a white background for maximum accuracy.');
    h += '<div style="background:#f8fbff;border-radius:8px;padding:14px;border-left:4px solid #4db8d4;margin-bottom:14px">';
    h += '<div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#1a6b8a">pH Test Procedure</div>';
    h += tk_steps_html([
      'Fill the test tube with <strong>2.5 ml</strong> of sample water using the syringe.',
      'Add <strong>3 drops of pH Reagent 1</strong>. Hold the dropper bottle upside down and completely vertical.',
      'Cap the tube and shake vigorously for <strong>5 seconds</strong>.',
      'Compare the colour with the <strong>colour card</strong>, holding the tube against the white background of the card. The closest match is your pH reading.'
    ], '#4db8d4');
    h += '</div>';
    h += '<div style="background:#f5f0ff;border-radius:8px;padding:10px 14px;margin-bottom:14px;font-size:13px">';
    h += '<div style="font-weight:600;margin-bottom:8px">Typical freshwater pH reference</div>';
    h += '<div class="tw"><table style="font-size:12px"><tr><th>pH</th><th>Meaning</th><th>Common for</th></tr>';
    [
      ['6.0 &ndash; 6.5', 'Soft, acidic',    'Discus, cardinal tetra, soft-water plants'],
      ['6.5 &ndash; 7.0', 'Slightly acidic', 'Most community fish, neon tetra, corydoras'],
      ['7.0',             'Neutral',          'General community tanks'],
      ['7.0 &ndash; 7.5', 'Slightly basic',  'Guppies, platies, mollies'],
      ['7.5 &ndash; 8.5', 'Hard, alkaline',  'African cichlids, livebearers'],
    ].forEach(function(r) {
      h += '<tr><td><strong>' + r[0] + '</strong></td><td>' + r[1] + '</td><td style="color:var(--muted)">' + r[2] + '</td></tr>';
    });
    h += '</table></div></div>';
    h += '<div style="background:#fff3cd;border-radius:6px;padding:10px 12px;font-size:12px;color:#856404">' +
         '<strong>Tip:</strong> pH stability matters more than the exact number. A sudden shift of 0.5 or more in a day stresses fish significantly. Test at the same time each day for consistent readings.' +
         '</div>';
  }

  // BIONIX — Ammonia
  if (tk_brand === 'bionix' && tk_test === 'ammonia') {
    h += tk_tips_html(null);
    h += '<div style="background:#f8fbff;border-radius:8px;padding:14px;border-left:4px solid #e05252;margin-bottom:14px">';
    h += '<div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#c0392b">Ammonia Test Procedure</div>';
    h += tk_steps_html([
      'Fill the glass test tube with <strong>2.5 ml</strong> of sample water using the syringe.',
      'Add <strong>4 drops of Ammonia Reagent 1</strong> and <strong>4 drops of Ammonia Reagent 2</strong>. Hold the dropper bottle upside down and completely vertical.',
      'Cap the tube and shake vigorously for a few seconds.',
      'Add <strong>4 drops of Ammonia Reagent 3</strong>. Cap and shake vigorously for <strong>15 seconds</strong>.',
      'Wait <strong>15&ndash;20 minutes</strong> for the colour to fully develop.',
      'Compare the colour with the colour card, holding the tube against the white background. The closest match is your Total Ammonia Nitrogen (TAN) in ppm.'
    ], '#e05252');
    h += '</div>';
    h += '<div style="background:#fff3cd;border-radius:8px;padding:12px 14px;margin-bottom:14px;font-size:13px">';
    h += '<div style="font-weight:600;margin-bottom:6px">&#x26A0; Un-ionized Ammonia (UIA) — the toxic fraction</div>';
    h += '<p style="margin:0 0 6px">The test measures <strong>Total Ammonia Nitrogen (TAN)</strong>. Un-ionized ammonia (UIA) is ~100&times; more toxic than ionized ammonia and is harmful from as low as <strong>0.05 mg/L</strong>.</p>';
    h += '<p style="margin:0">To find UIA: multiply TAN by the factor from the table below (using your water temperature and pH).</p>';
    h += '</div>';
    // UIA fraction table (simplified common values)
    h += '<div style="background:#f8fbff;border-radius:8px;padding:12px 14px;font-size:12px">';
    h += '<div style="font-weight:600;margin-bottom:8px;font-size:13px">UIA fraction table &mdash; multiply TAN by this factor</div>';
    h += '<div class="tw"><table style="font-size:12px"><tr><th>pH \\ Temp</th><th>20&deg;C / 68&deg;F</th><th>24&deg;C / 75&deg;F</th><th>28&deg;C / 82&deg;F</th><th>30&deg;C / 86&deg;F</th></tr>';
    [
      ['6.5', '0.0010', '0.0015', '0.0022', '0.0027'],
      ['7.0', '0.0032', '0.0047', '0.0069', '0.0085'],
      ['7.5', '0.0100', '0.0148', '0.0216', '0.0266'],
      ['8.0', '0.0312', '0.0454', '0.0654', '0.0799'],
      ['8.5', '0.0918', '0.1307', '0.1824', '0.2175'],
    ].forEach(function(r) {
      h += '<tr><td><strong>' + r[0] + '</strong></td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>';
    });
    h += '</table></div>';
    h += '<p style="margin:8px 0 0;color:var(--muted)">Example: TAN = 0.5 ppm, pH 7.5, 24&deg;C &rarr; UIA = 0.5 &times; 0.0148 = <strong>0.0074 ppm</strong>. Threshold for harm: 0.05 ppm.</p>';
    h += '</div>';
  }

  // BIONIX — Nitrite
  if (tk_brand === 'bionix' && tk_test === 'nitrite') {
    h += tk_tips_html(null);
    h += '<div style="background:#f8fbff;border-radius:8px;padding:14px;border-left:4px solid #e8a838;margin-bottom:14px">';
    h += '<div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#b7791f">Nitrite Test Procedure</div>';
    h += tk_steps_html([
      'Fill the test tube with <strong>2 ml</strong> of sample water using the syringe.',
      'Add <strong>2 drops of Nitrite &amp; Nitrate Reagent 1</strong>. Hold the dropper bottle upside down and completely vertical.',
      'Cap and shake properly for <strong>10 seconds</strong>.',
      'Add <strong>2 drops of Nitrite &amp; Nitrate Reagent 2</strong>. Cap and shake slowly for <strong>5 seconds</strong>.',
      'Wait <strong>5 minutes</strong>, then compare the colour with the colour card against a white background.'
    ], '#e8a838');
    h += '</div>';
    h += '<div style="background:#fff3cd;border-radius:6px;padding:10px 12px;font-size:12px;color:#856404">' +
         '<strong>Note:</strong> In some cases no colour develops if nitrite is zero &mdash; a clear result is a good result.' +
         '</div>';
  }

  // BIONIX — Nitrate
  if (tk_brand === 'bionix' && tk_test === 'nitrate') {
    h += tk_tips_html(null);
    h += '<div style="background:#f8fbff;border-radius:8px;padding:14px;border-left:4px solid #3ab87a;margin-bottom:14px">';
    h += '<div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#1e7a4a">Nitrate Test Procedure</div>';
    h += tk_steps_html([
      'Fill the test tube with <strong>2 ml</strong> of sample water using the syringe.',
      'Add less than <strong>&frac14; of the micro spoon</strong> of Nitrite &amp; Nitrate Reagent 3. Do not overfill the spoon.',
      'Shake the solution vigorously for <strong>1 minute</strong>.',
      'Add <strong>3 drops of Nitrite &amp; Nitrate Reagent 1</strong>. Cap and shake well for 5 seconds, then let the tube stand still for 10 seconds.',
      'Add <strong>3 drops of Nitrite &amp; Nitrate Reagent 2</strong>. Cap and shake well for <strong>5 seconds</strong>.',
      'Wait <strong>5 minutes</strong> for the colour to fully develop, then compare with the colour card against a white background.'
    ], '#3ab87a');
    h += '</div>';
    h += '<div style="background:#fff3cd;border-radius:6px;padding:10px 12px;font-size:12px;color:#856404">' +
         '<strong>Note:</strong> In some cases no colour develops if nitrate is zero &mdash; a clear result is a good result.' +
         '</div>';
  }

  // BIONIX — Total Hardness, Calcium & Magnesium
  if (tk_brand === 'bionix' && tk_test === 'th_ca_mg') {
    h += tk_tips_html(null);

    // Two-column layout: Total Hardness | Calcium
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px">';

    // Total Hardness procedure
    h += '<div style="background:#f8fbff;border-radius:8px;padding:12px 14px;border-left:4px solid #4db8d4">';
    h += '<div style="font-size:13px;font-weight:700;margin-bottom:10px;color:#1a6b8a">Total Hardness Procedure</div>';
    [
      ['Reagent 1', 'Take <strong>2 ml</strong> of sample water. Add <strong>2 drops of Reagent 1</strong> and shake for a few seconds.'],
      ['Reagent 2', 'Add <strong>Reagent 2</strong> (not more than &frac14; of the small plastic spoon). Shake to mix. Colour will turn <em>wine red, pink, or purple</em> (purple = low hardness).'],
      ['Reagent 3', 'Add <strong>Reagent 3 drop by drop</strong>, shaking gently and waiting 1 second after each drop. Continue until the colour changes to <strong>light blue</strong>. Count all drops used.'],
    ].forEach(function(s, i) {
      h += '<div style="display:flex;gap:8px;margin-bottom:8px;font-size:13px">' +
           '<div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:var(--surf);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">' + (i+1) + '</div>' +
           '<div><span style="font-size:11px;font-weight:700;color:#1a6b8a;display:block;margin-bottom:2px">' + s[0] + '</span>' + s[1] + '</div></div>';
    });
    h += '<div style="background:#e8f4fd;border-radius:6px;padding:8px 10px;font-size:13px;margin-top:4px">' +
         '<strong>Formula:</strong> Total Hardness (ppm) = Drops of Reagent 3 &times; 25</div>';
    h += '</div>';

    // Calcium procedure
    h += '<div style="background:#f8fbff;border-radius:8px;padding:12px 14px;border-left:4px solid #3ab87a">';
    h += '<div style="font-size:13px;font-weight:700;margin-bottom:10px;color:#1e7a4a">Calcium Procedure</div>';
    [
      ['Reagent 4', 'Take a fresh <strong>2 ml</strong> of sample water. Add <strong>2 drops of Reagent 4</strong> and shake for a few seconds.'],
      ['Reagent 5', 'Add <strong>Reagent 5</strong> (not more than &frac14; of the plastic spoon). Shake to mix. Colour will turn <em>orange red or pink</em>.'],
      ['Reagent 3', 'Add <strong>Reagent 3 drop by drop</strong>, shaking and waiting 1 second after each drop. Continue until the colour changes to <strong>purple</strong>. Count all drops used.'],
    ].forEach(function(s, i) {
      h += '<div style="display:flex;gap:8px;margin-bottom:8px;font-size:13px">' +
           '<div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:#3ab87a;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">' + (i+1) + '</div>' +
           '<div><span style="font-size:11px;font-weight:700;color:#1e7a4a;display:block;margin-bottom:2px">' + s[0] + '</span>' + s[1] + '</div></div>';
    });
    h += '<div style="background:#eaf8f1;border-radius:6px;padding:8px 10px;font-size:13px;margin-top:4px">' +
         '<strong>Formula:</strong> Calcium (ppm) = Drops of Reagent 3 &times; 10</div>';
    h += '</div>';
    h += '</div>'; // end grid

    // Derived formulas reference
    h += '<div style="background:#f5f0ff;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:13px">';
    h += '<div style="font-weight:600;margin-bottom:6px">Derived values (calculated automatically below)</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;">';
    [
      ['Magnesium (ppm)', '6 &times; (Drops R3 for TH &minus; Drops R3 for Ca)'],
      ['Calcium Hardness (ppm)', '2.5 &times; Calcium'],
      ['Magnesium Hardness (ppm)', 'Total Hardness &minus; Calcium Hardness'],
    ].forEach(function(f) {
      h += '<div style="color:var(--muted)">' + f[0] + '</div><div>' + f[1] + '</div>';
    });
    h += '</div></div>';

    // Calculator
    h += '<div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:14px">';
    h += '<div style="font-size:13px;font-weight:700;margin-bottom:10px">Result Calculator</div>';
    h += '<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:12px">';
    h += '<div class="fg" style="margin:0">' +
         '<label style="font-size:12px;font-weight:600">Drops of Reagent 3 used in <span style="color:#1a6b8a">Total Hardness</span> test</label>' +
         '<input type="number" id="tk_drops_th" min="0" max="99" placeholder="e.g. 8" style="width:120px" oninput="calc_tk_bionix()"></div>';
    h += '<div class="fg" style="margin:0">' +
         '<label style="font-size:12px;font-weight:600">Drops of Reagent 3 used in <span style="color:#1e7a4a">Calcium</span> test</label>' +
         '<input type="number" id="tk_drops_ca" min="0" max="99" placeholder="e.g. 5" style="width:120px" oninput="calc_tk_bionix()"></div>';
    h += '</div>';
    h += '<div id="tk_results"><p style="font-size:13px;color:var(--muted)">Enter the drops above to see your results.</p></div>';
    h += '</div>';
  }

  if (!tk_brand) {
    h += '<p style="font-size:13px;color:var(--muted);padding:8px 0">Select a brand above to see instructions.</p>';
  } else if (!tk_test) {
    h += '<p style="font-size:13px;color:var(--muted);padding:8px 0">Select a test above to see the procedure.</p>';
  }

  h += '</div>'; // end Test Kit card

  // === Water Testing Tools ===
  h += '<div class="card">';
  h += '<div class="ctitle">Water Testing Tools</div>';
  h += '<p style="font-size:13px;color:var(--muted);margin-bottom:12px">Physical items needed to accurately measure each parameter you log in the app.</p>';
  h += '<div class="tw"><table><tr><th>Parameter</th><th>What You Need</th><th>Tip</th></tr>';
  [
    ['NH3 &mdash; Ammonia',   'API Freshwater Master Test Kit', 'Compare colour in natural daylight, not yellow or LED light'],
    ['NO2 &mdash; Nitrite',   'API Freshwater Master Test Kit', 'Same kit &mdash; included in one box'],
    ['NO3 &mdash; Nitrate',   'API Freshwater Master Test Kit', 'Shake bottle #2 vigorously for 30 seconds &mdash; this is critical'],
    ['pH',                    'API Freshwater Master Test Kit', 'Test at the same time each day for consistency'],
    ['GH &mdash; Hardness',   'API GH &amp; KH Test Kit',      'Count drops until colour changes; each drop = 1&deg;dH (17.9 ppm)'],
    ['Temperature',           'Digital aquarium thermometer',   'Stick-on strip thermometers are inaccurate. Use a digital probe.'],
  ].forEach(function(r) {
    h += '<tr><td><strong>' + r[0] + '</strong></td><td>' + r[1] + '</td><td style="color:var(--muted);font-size:12px">' + r[2] + '</td></tr>';
  });
  h += '</table></div>';
  h += '<div style="margin-top:10px;background:#f0f8ff;border-radius:6px;padding:10px 12px;font-size:13px">' +
       '<strong>Starter recommendation:</strong> The API Freshwater Master Test Kit covers NH3, NO2, NO3, and pH in one box. ' +
       'Pick up the API GH &amp; KH Kit separately for hardness. Both are available at most fish stores and online.</div>';
  h += '</div>';

  // === Water Change Equipment ===
  h += '<div class="card">';
  h += '<div class="ctitle">Water Change Equipment</div>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">';

  // Left: what you need
  h += '<div><div style="font-weight:600;font-size:13px;margin-bottom:10px">What you need</div>';
  [
    ['🪣', 'Gravel siphon / vacuum',      'Python No Spill, EHEIM, or any standard siphon hose'],
    ['🪣', 'Dedicated bucket',             '5&ndash;10 gal &mdash; never used with soap or cleaning products'],
    ['🧪', 'Dechlorinator',                'Seachem Prime or API Stress Coat+ &mdash; always treat tap water first'],
    ['🌡', 'Thermometer',                  'Match new water temperature to tank before adding'],
    ['🫧', 'Algae scraper (optional)',     'Wipe glass before the water change so debris gets siphoned out'],
  ].forEach(function(e) {
    h += '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:9px">' +
         '<span style="font-size:17px;flex-shrink:0">' + e[0] + '</span>' +
         '<div><div style="font-size:13px;font-weight:500">' + e[1] + '</div>' +
         '<div style="font-size:12px;color:var(--muted)">' + e[2] + '</div></div></div>';
  });
  h += '</div>';

  // Right: step-by-step
  h += '<div><div style="font-weight:600;font-size:13px;margin-bottom:10px">Step-by-step</div>';
  [
    'Turn off the heater and filter',
    'Siphon from the substrate &mdash; vacuum gravel as you drain',
    'Remove 25&ndash;50% of the tank water into your bucket',
    'Fill a clean bucket with tap water close to tank temperature',
    'Add dechlorinator to the new water (Prime: 1 ml per 10 gal)',
    'Pour treated water slowly &mdash; avoid disturbing substrate',
    'Turn filter and heater back on',
    'Log the water change in the Maintenance tab',
  ].forEach(function(s, i) {
    h += '<div style="display:flex;gap:8px;margin-bottom:7px;font-size:13px">' +
         '<span style="font-weight:700;color:var(--surf);flex-shrink:0;min-width:18px">' + (i + 1) + '.</span>' +
         '<span>' + s + '</span></div>';
  });
  h += '</div></div></div>';

  // === Cycling Supplies (only while cycling) ===
  if (is_cycling) {
    h += '<div class="card" style="border-left:4px solid ' + cyc.color + '">';
    h += '<div class="ctitle">Cycling Supplies <span class="pill" style="background:' + cyc.color + ';color:#fff;font-size:12px">' + cyc.label + '</span></div>';
    h += '<p style="font-size:13px;color:var(--muted);margin-bottom:12px">Your tank is still cycling. Here is what to have on hand.</p>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">';

    h += '<div><div style="font-weight:600;font-size:13px;margin-bottom:10px">Fishless cycle</div>';
    [
      ['🧪', 'Pure ammonia (Dr. Tim\\'s or ACE)',  'Must be clear &mdash; no surfactants, no scents, no dyes. Dose to 2&ndash;4 ppm.'],
      ['📊', 'Test kit',                          'Re-dose to 2 ppm when NH3 drops to 0. Cycle is done when NH3 and NO2 both hit 0 within 24 h of dosing.'],
    ].forEach(function(e) {
      h += '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:9px">' +
           '<span style="font-size:17px;flex-shrink:0">' + e[0] + '</span>' +
           '<div><div style="font-size:13px;font-weight:500">' + e[1] + '</div>' +
           '<div style="font-size:12px;color:var(--muted)">' + e[2] + '</div></div></div>';
    });
    h += '</div>';

    h += '<div><div style="font-weight:600;font-size:13px;margin-bottom:10px">Fish-in cycle</div>';
    [
      ['💧', 'Seachem Prime',  'Detoxifies NH3 and NO2 for 24&ndash;48 h. Dose the full tank volume daily during spikes.'],
      ['🧪', 'Test kit',       'Test every 2 days. Do 25% water changes when NH3 or NO2 exceed 1 ppm.'],
    ].forEach(function(e) {
      h += '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:9px">' +
           '<span style="font-size:17px;flex-shrink:0">' + e[0] + '</span>' +
           '<div><div style="font-size:13px;font-weight:500">' + e[1] + '</div>' +
           '<div style="font-size:12px;color:var(--muted)">' + e[2] + '</div></div></div>';
    });
    h += '</div></div></div>';
  }

  // === Quick Reference Tips ===
  h += '<div class="card">';
  h += '<div class="ctitle">Quick Reference Tips</div>';
  [
    ['❌', 'Never rinse filter media in tap water',        'Chlorine and chloramine kill the beneficial bacteria living in your filter. Always rinse in tank water only.'],
    ['❌', 'Never add untreated tap water directly',       'Treat with dechlorinator first. Even a small dose of chloramine can wipe out your cycle and harm fish.'],
    ['✅', 'Match temperature before adding water',        'Temperature shock stresses fish. Check the bucket temperature with a thermometer before pouring in.'],
    ['✅', 'Test in natural or white light',               'Colour-comparison test kits read wrong under yellow or warm LED lighting. Use daylight or cool white light.'],
    ['✅', 'Dose dechlorinator for the full tank volume',  'Seachem Prime can be dosed for the entire tank each time, not just the water being changed &mdash; it won\\'t harm fish at normal doses.'],
    ['✅', 'Log every test and water change',              'The app tracks trends over time. A single reading is less useful than a history of readings.'],
  ].forEach(function(t) {
    h += '<div style="display:flex;align-items:flex-start;gap:9px;margin-bottom:11px">' +
         '<span style="font-size:16px;flex-shrink:0">' + t[0] + '</span>' +
         '<div><div style="font-size:13px;font-weight:500">' + t[1] + '</div>' +
         '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + t[2] + '</div></div></div>';
  });
  h += '</div>';

  el.innerHTML = h;
}

// ===== APP CORE =====
var cur_tab = 'dash';
var tk_brand = '';
var tk_test  = '';
function set_tk_brand(brand) { tk_brand = brand; tk_test = ''; r_tools(); }
function set_tk_test(test)   { tk_test  = test;               r_tools(); }
function calc_tk_bionix() {
  var el_th  = document.getElementById('tk_drops_th');
  var el_ca  = document.getElementById('tk_drops_ca');
  var el_res = document.getElementById('tk_results');
  if (!el_th || !el_ca || !el_res) return;
  var drops_th = parseInt(el_th.value) || 0;
  var drops_ca = parseInt(el_ca.value) || 0;
  if (drops_ca > drops_th) drops_ca = drops_th;
  var total_hard  = drops_th * 25;
  var calcium     = drops_ca * 10;
  var magnesium   = 6 * (drops_th - drops_ca);
  var ca_hard     = 2.5 * calcium;
  var mg_hard     = total_hard - ca_hard;
  var row = function(lbl, val, note) {
    return '<tr><td style="font-weight:500">' + lbl + '</td>' +
           '<td style="font-weight:700;color:var(--surf)">' + val + ' ppm</td>' +
           '<td style="font-size:12px;color:var(--muted)">' + (note||'') + '</td></tr>';
  };
  var h = '<div class="tw"><table>' +
    '<tr><th>Parameter</th><th>Result</th><th>Typical range (freshwater)</th></tr>' +
    row('Total Hardness (GH)', total_hard, '4&ndash;8 dGH (71&ndash;143 ppm) for most community fish') +
    row('Calcium (Ca)', calcium, '20&ndash;60 ppm ideal for planted tanks') +
    row('Magnesium (Mg)', magnesium, '5&ndash;20 ppm; Ca:Mg ratio ideally 3:1 to 5:1') +
    row('Calcium Hardness', ca_hard, 'Portion of total hardness from Ca') +
    row('Magnesium Hardness', mg_hard, 'Total hardness &minus; Calcium hardness') +
    '</table></div>';
  if (drops_th === 0 && drops_ca === 0) {
    h = '<p style="font-size:13px;color:var(--muted)">Enter the drops above to see your results.</p>';
  }
  el_res.innerHTML = h;
}
function render_tab() {
  upd_prev_bar();
  if      (cur_tab === 'dash')  r_dash();
  else if (cur_tab === 'life')  r_life();
  else if (cur_tab === 'wlog')  r_wlog();
  else if (cur_tab === 'maint') r_maint();
  else if (cur_tab === 'recs')  r_recs();
  else if (cur_tab === 'tools') r_tools();
  else if (cur_tab === 'howto') r_howto();
}
function init() {
  build_sel();
  var d = ld(), tid = at();
  if (d.tanks.length && !d.tanks.find(function(t){ return t.id === tid; })) sat(d.tanks[0].id);
  render_tab();
}

document.getElementById('t_sel').addEventListener('change', function() { sat(this.value); render_tab(); });
document.querySelectorAll('.tab').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(b){ b.classList.remove('on'); });
    document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('on'); });
    btn.classList.add('on');
    cur_tab = btn.dataset.t;
    document.getElementById('p-' + cur_tab).classList.add('on');
    render_tab();
  });
});
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
window.addEventListener('DOMContentLoaded', init);
<\/script>
</body>
</html>`;
