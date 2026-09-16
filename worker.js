export default {
  async fetch(request) {
    return new Response(APP_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
};

const APP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    <button class="btn bg bs" onclick="do_export()">Export</button>
    <label class="btn bg bs" style="cursor:pointer">Import<input type="file" id="imp_file" accept=".json" style="display:none" onchange="do_import(this)"></label>
  </div>
</nav>

<div class="tabs">
  <button class="tab on" data-t="dash">Dashboard</button>
  <button class="tab" data-t="life">Equipment &amp; Life</button>
  <button class="tab" data-t="wlog">Water Log</button>
  <button class="tab" data-t="maint">Maintenance</button>
  <button class="tab" data-t="recs">Recommendations</button>
</div>

<div id="p-dash"  class="panel on"></div>
<div id="p-life"  class="panel"></div>
<div id="p-wlog"  class="panel"></div>
<div id="p-maint" class="panel"></div>
<div id="p-recs"  class="panel"></div>

<div id="ov" class="overlay" onclick="if(event.target===this)cm()">
  <div class="mbox" id="mb"></div>
</div>

<script>
// ===== SPECIES DATABASE (63 species) =====
// bioload: 1=very low, 2=low, 3=medium, 4=high, 5=very high
// level: Beginner / Intermediate / Advanced
// hard_reason: why non-beginners should research first (omit for Beginner)
var SP = {
  betta:             {name:'Betta',              tmin:72,tmax:86,pmin:6.0,pmax:8.0,gmin:1, gmax:15,bioload:2,size_in:3,  min_gal:5,  level:'Beginner',     note:'Keep males alone or in a sorority.'},
  neon_tetra:        {name:'Neon Tetra',          tmin:70,tmax:77,pmin:4.0,pmax:7.5,gmin:1, gmax:12,bioload:1,size_in:1.5,min_gal:10, level:'Beginner',     note:'School of 6+. Sensitive to nitrates.'},
  cardinal_tetra:    {name:'Cardinal Tetra',      tmin:73,tmax:79,pmin:4.5,pmax:7.5,gmin:1, gmax:12,bioload:1,size_in:2,  min_gal:20, level:'Intermediate', hard_reason:'More sensitive to water chemistry than neon tetras. Needs consistently soft, acidic water.',note:'School of 6+. Similar to neon tetra.'},
  guppy:             {name:'Guppy',               tmin:63,tmax:82,pmin:7.0,pmax:8.5,gmin:8, gmax:30,bioload:2,size_in:2,  min_gal:10, level:'Beginner',     note:'Hardy livebearer. Prefers hard water.'},
  molly:             {name:'Molly',               tmin:72,tmax:82,pmin:7.0,pmax:8.5,gmin:15,gmax:35,bioload:3,size_in:4,  min_gal:20, level:'Beginner',     note:'Needs hard water. Shimmies in soft water.'},
  platy:             {name:'Platy',               tmin:68,tmax:79,pmin:7.0,pmax:8.2,gmin:14,gmax:30,bioload:2,size_in:2.5,min_gal:15, level:'Beginner',     note:'Hardy livebearer. Avoid acidic water.'},
  corydoras:         {name:'Corydoras',           tmin:70,tmax:81,pmin:6.0,pmax:8.0,gmin:2, gmax:15,bioload:2,size_in:2.5,min_gal:20, level:'Beginner',     note:'Group of 4+. Fine sand substrate needed.'},
  angelfish:         {name:'Angelfish',           tmin:75,tmax:86,pmin:6.0,pmax:7.4,gmin:0, gmax:15,bioload:3,size_in:6,  min_gal:30, level:'Intermediate', hard_reason:'Grows large (6 in body, taller with fins). May eat small fish. Needs tall tank.',note:'Tall tank needed. May eat small fish.'},
  discus:            {name:'Discus',              tmin:80,tmax:86,pmin:4.5,pmax:7.0,gmin:1, gmax:8, bioload:4,size_in:8,  min_gal:55, level:'Advanced',     hard_reason:'Requires expert-level care. Extremely sensitive to all water parameters. Daily water changes often needed.',note:'Expert level. Needs pristine water quality.'},
  ram_cichlid:       {name:'Ram Cichlid',         tmin:81,tmax:86,pmin:4.0,pmax:7.0,gmin:1, gmax:10,bioload:2,size_in:3,  min_gal:20, level:'Intermediate', hard_reason:'Very sensitive to water quality and temperature drops. Not forgiving of new-tank mistakes.',note:'Very sensitive to water quality issues.'},
  african_cichlid:   {name:'African Cichlid',     tmin:75,tmax:81,pmin:7.5,pmax:8.5,gmin:12,gmax:25,bioload:4,size_in:5,  min_gal:55, level:'Intermediate', hard_reason:'Aggressive. Requires alkaline hard water and specific rockwork setup. Overstocking is deliberate.',note:'Alkaline hard water essential.'},
  goldfish:          {name:'Goldfish',            tmin:50,tmax:72,pmin:7.0,pmax:8.0,gmin:6, gmax:16,bioload:5,size_in:12, min_gal:40, level:'Beginner',     note:'Cold water. Very high bioload. Needs large tank. Not compatible with tropical fish.'},
  cherry_shrimp:     {name:'Cherry Shrimp',       tmin:65,tmax:80,pmin:6.2,pmax:8.0,gmin:4, gmax:8, bioload:1,size_in:1.5,min_gal:5,  level:'Beginner',     inv:true, note:'Forgiving. Avoid copper-based medications.'},
  crystal_shrimp:    {name:'Crystal Shrimp',      tmin:62,tmax:72,pmin:5.5,pmax:6.5,gmin:4, gmax:6, bioload:1,size_in:1.2,min_gal:10, level:'Advanced',     inv:true, hard_reason:'Requires RO water with remineralizer. Narrow pH and GH range. Very sensitive to any parameter shift.',note:'Advanced keeper. RO water + remineralizer.'},
  hillstream_loach:  {name:'Hillstream Loach',    tmin:62,tmax:72,pmin:6.5,pmax:7.5,gmin:4, gmax:8, bioload:1,size_in:3,  min_gal:20, level:'Intermediate', hard_reason:'Needs very high flow, strong oxygenation, and cooler water. Standard setups do not suit them.',note:'Needs very high flow and oxygenation.'},
  nerite_snail:      {name:'Nerite Snail',        tmin:72,tmax:82,pmin:6.5,pmax:8.0,gmin:6, gmax:15,bioload:1,size_in:1,  min_gal:5,  level:'Beginner',     inv:true, note:'Great algae eater. Needs calcium for shell.'},
  mystery_snail:     {name:'Mystery Snail',       tmin:72,tmax:82,pmin:6.5,pmax:8.0,gmin:5, gmax:15,bioload:1,size_in:2,  min_gal:5,  level:'Beginner',     inv:true, note:'Peaceful. Supplement calcium for shell health.'},
  zebra_danio:       {name:'Zebra Danio',         tmin:64,tmax:75,pmin:6.0,pmax:8.0,gmin:2, gmax:20,bioload:2,size_in:2,  min_gal:10, level:'Beginner',     note:'Active schooler of 6+. Very hardy beginner fish.'},
  harlequin_rasbora: {name:'Harlequin Rasbora',   tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:1, gmax:12,bioload:1,size_in:2,  min_gal:10, level:'Beginner',     note:'School of 6+. Peaceful community fish.'},
  rummy_nose_tetra:  {name:'Rummy Nose Tetra',    tmin:75,tmax:82,pmin:5.5,pmax:7.0,gmin:1, gmax:10,bioload:1,size_in:2,  min_gal:20, level:'Intermediate', hard_reason:'Red nose fades quickly with any water quality issue. Sensitive to nitrates and pH. Needs aged, soft water.',note:'School of 8+. Red head intensifies in good water.'},
  black_skirt_tetra: {name:'Black Skirt Tetra',   tmin:70,tmax:81,pmin:6.0,pmax:7.5,gmin:4, gmax:15,bioload:2,size_in:2.5,min_gal:20, level:'Beginner',     note:'School of 6+. May nip long-finned tankmates.'},
  dwarf_gourami:     {name:'Dwarf Gourami',       tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:4, gmax:10,bioload:2,size_in:3.5,min_gal:15, level:'Beginner',     note:'Males territorial with each other. Peaceful otherwise.'},
  kuhli_loach:       {name:'Kuhli Loach',         tmin:74,tmax:86,pmin:5.5,pmax:7.0,gmin:1, gmax:10,bioload:2,size_in:4,  min_gal:20, level:'Beginner',     note:'Nocturnal. Needs hiding spots and soft substrate.'},
  bristlenose_pleco: {name:'Bristlenose Pleco',   tmin:73,tmax:81,pmin:6.5,pmax:7.5,gmin:2, gmax:20,bioload:4,size_in:5,  min_gal:30, level:'Beginner',     note:'Great algae eater. Needs driftwood in diet.'},
  otocinclus:        {name:'Otocinclus',          tmin:72,tmax:79,pmin:6.0,pmax:7.5,gmin:4, gmax:15,bioload:1,size_in:2,  min_gal:10, level:'Intermediate', hard_reason:'Often starve if insufficient algae. Sensitive initially. Keep in groups of 4+.',note:'Groups of 4+. Feeds on soft algae and blanched veg.'},
  ember_tetra:       {name:'Ember Tetra',         tmin:73,tmax:84,pmin:5.0,pmax:7.0,gmin:1, gmax:10,bioload:1,size_in:0.8,min_gal:10, level:'Beginner',     note:'Tiny nano fish. School of 8+. Loves planted tanks.'},
  chili_rasbora:     {name:'Chili Rasbora',       tmin:68,tmax:82,pmin:4.0,pmax:7.0,gmin:1, gmax:8, bioload:1,size_in:0.7,min_gal:5,  level:'Intermediate', hard_reason:'Tiny fish needing soft, acidic water. Sensitive to hard water and high pH.',note:'Micro fish (0.7 in). School of 10+. Nano tank gem.'},
  white_cloud_minnow:{name:'White Cloud Minnow',  tmin:59,tmax:72,pmin:6.0,pmax:8.0,gmin:5, gmax:19,bioload:1,size_in:1.5,min_gal:10, level:'Beginner',     note:'Cold water fish. Do not keep with tropical species.'},
  swordtail:         {name:'Swordtail',           tmin:65,tmax:82,pmin:7.0,pmax:8.3,gmin:12,gmax:30,bioload:3,size_in:5,  min_gal:20, level:'Beginner',     note:'Active jumper - use a lid. Males aggressive together.'},
  tiger_barb:        {name:'Tiger Barb',          tmin:68,tmax:79,pmin:6.0,pmax:7.0,gmin:5, gmax:15,bioload:2,size_in:3,  min_gal:20, level:'Intermediate', hard_reason:'Notorious fin nippers. Must be kept in large groups (8+) or they terrorise tankmates.',note:'Semi-aggressive fin nipper. Keep 8+ to spread chasing.'},
  endlers_livebearer:{name:'Endler Livebearer',   tmin:72,tmax:82,pmin:6.5,pmax:8.5,gmin:10,gmax:30,bioload:1,size_in:1.5,min_gal:5,  level:'Beginner',     note:'Hardy livebearer. Males are brilliantly colored.'},
  electric_blue_ram: {name:'Electric Blue Ram',   tmin:78,tmax:85,pmin:5.0,pmax:7.0,gmin:1, gmax:8, bioload:2,size_in:3,  min_gal:20, level:'Advanced',     hard_reason:'Selectively bred variety with weaker immunity. Extremely sensitive to temperature swings and poor water quality.',note:'Very temperature sensitive. Needs stable warm water.'},
  boesemani_rainbow: {name:'Boesemani Rainbow',   tmin:75,tmax:86,pmin:7.0,pmax:8.0,gmin:9, gmax:19,bioload:3,size_in:4.5,min_gal:55, level:'Intermediate', hard_reason:'Grows to 4.5 inches and needs a school of 6+ in a 55g+ tank. Specific water chemistry needed.',note:'School of 6+. Active swimmer. Grows to 4.5 inches.'},
  amano_shrimp:      {name:'Amano Shrimp',        tmin:65,tmax:80,pmin:6.0,pmax:8.0,gmin:4, gmax:12,bioload:1,size_in:2,  min_gal:10, level:'Beginner',     inv:true, note:'Best algae-eating shrimp. Safe with most fish.'},
  panda_corydoras:   {name:'Panda Corydoras',     tmin:68,tmax:77,pmin:6.0,pmax:7.4,gmin:2, gmax:12,bioload:1,size_in:2,  min_gal:15, level:'Beginner',     note:'Smaller cory species. Cooler water. Group of 4+.'},
  red_cherry_barb:   {name:'Red Cherry Barb',     tmin:72,tmax:79,pmin:6.0,pmax:7.5,gmin:5, gmax:19,bioload:2,size_in:2,  min_gal:20, level:'Beginner',     note:'Peaceful despite the barb name. Males are bright red.'},
  honey_gourami:     {name:'Honey Gourami',       tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:4, gmax:10,bioload:1,size_in:2,  min_gal:10, level:'Beginner',     note:'Very peaceful and shy. Good beginner community fish.'},
  // --- Additional species ---
  oscar:                {name:'Oscar',                 tmin:74,tmax:81,pmin:6.0,pmax:8.0,gmin:5, gmax:20,bioload:5,size_in:14, min_gal:75,  level:'Intermediate', hard_reason:'Grows to 14 inches and produces enormous waste. Needs 75g+ and frequent large water changes.',note:'Highly intelligent. Very messy feeder. Needs 75g minimum.'},
  convict_cichlid:      {name:'Convict Cichlid',       tmin:68,tmax:82,pmin:6.5,pmax:8.0,gmin:9, gmax:20,bioload:3,size_in:5,  min_gal:30,  level:'Intermediate', hard_reason:'Extremely aggressive, especially when breeding. Will attack fish twice its size. Best as a species pair.',note:'Hardy but aggressive. Prolific breeder.'},
  firemouth_cichlid:    {name:'Firemouth Cichlid',     tmin:75,tmax:86,pmin:6.5,pmax:8.0,gmin:5, gmax:25,bioload:3,size_in:5,  min_gal:30,  level:'Intermediate', hard_reason:'Semi-aggressive, especially when breeding. Pair bond strongly and defend territory vigorously.',note:'Brilliant red throat display. Semi-aggressive when breeding.'},
  clown_loach:          {name:'Clown Loach',           tmin:77,tmax:86,pmin:6.0,pmax:7.5,gmin:5, gmax:12,bioload:3,size_in:12, min_gal:75,  level:'Intermediate', hard_reason:'Sold small but grows to 12 inches over years. Needs a school of 5+ and a large tank long term.',note:'Grows very large slowly. Great snail eater. School of 5+.'},
  yoyo_loach:           {name:'Yo-yo Loach',           tmin:75,tmax:86,pmin:6.0,pmax:7.5,gmin:3, gmax:12,bioload:2,size_in:3,  min_gal:20,  level:'Beginner',     note:'Active snail eater. Playful and social. Keep in groups of 4+.'},
  siamese_algae_eater:  {name:'Siamese Algae Eater',   tmin:75,tmax:79,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:2,size_in:5,  min_gal:30,  level:'Beginner',     note:'One of the few fish that eats black beard algae. Peaceful. Best in schools or alone.'},
  red_tail_shark:       {name:'Red-tail Black Shark',  tmin:72,tmax:79,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:2,size_in:6,  min_gal:30,  level:'Intermediate', hard_reason:'Highly territorial with own kind and similar-shaped fish. Only one per tank. Aggression increases with age.',note:'Only one per tank. Territorial with similar-shaped fish.'},
  pearl_gourami:        {name:'Pearl Gourami',         tmin:77,tmax:82,pmin:6.0,pmax:8.0,gmin:5, gmax:25,bioload:2,size_in:4.5,min_gal:30,  level:'Beginner',     note:'Peaceful and beautiful. One of the best community gouramis. Hardy.'},
  blue_gourami:         {name:'Blue Gourami',          tmin:72,tmax:82,pmin:6.0,pmax:8.5,gmin:5, gmax:35,bioload:2,size_in:5,  min_gal:20,  level:'Beginner',     note:'Very hardy and adaptable. Males can be aggressive with each other. Keep one male.'},
  sparkling_gourami:    {name:'Sparkling Gourami',     tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:5, gmax:15,bioload:1,size_in:1.5,min_gal:10,  level:'Beginner',     note:'Tiny gourami that makes audible clicking sounds. Peaceful nano fish.'},
  congo_tetra:          {name:'Congo Tetra',           tmin:73,tmax:82,pmin:6.0,pmax:7.5,gmin:3, gmax:18,bioload:2,size_in:3.5,min_gal:30,  level:'Beginner',     note:'Large, spectacular tetra. Males develop flowing fins. School of 6+.'},
  serpae_tetra:         {name:'Serpae Tetra',          tmin:72,tmax:79,pmin:5.5,pmax:7.5,gmin:5, gmax:15,bioload:1,size_in:1.5,min_gal:20,  level:'Intermediate', hard_reason:'Notorious fin nippers with slow or long-finned fish. Must be in large groups (8+) to reduce nipping behavior.',note:'School of 8+. Do not keep with slow or long-finned fish.'},
  lemon_tetra:          {name:'Lemon Tetra',           tmin:72,tmax:82,pmin:6.0,pmax:7.5,gmin:5, gmax:20,bioload:1,size_in:1.5,min_gal:15,  level:'Beginner',     note:'Peaceful schooler of 6+. Yellow color intensifies in good water.'},
  glowlight_tetra:      {name:'Glowlight Tetra',       tmin:72,tmax:80,pmin:5.5,pmax:7.5,gmin:4, gmax:15,bioload:1,size_in:1.5,min_gal:10,  level:'Beginner',     note:'Peaceful schooler of 6+. Bright orange stripe glows under aquarium lighting.'},
  rosy_barb:            {name:'Rosy Barb',             tmin:64,tmax:75,pmin:6.5,pmax:7.5,gmin:5, gmax:19,bioload:2,size_in:4,  min_gal:30,  level:'Beginner',     note:'Cooler water barb. Active schooler of 6+. Males turn rosy-red when breeding.'},
  pygmy_corydoras:      {name:'Pygmy Corydoras',       tmin:68,tmax:77,pmin:6.0,pmax:7.8,gmin:2, gmax:15,bioload:1,size_in:1,  min_gal:10,  level:'Beginner',     note:'Tiny cory (1 in). Mid-water swimmer unlike most corys. Group of 8+.'},
  neon_rainbowfish:     {name:'Neon Rainbowfish',      tmin:72,tmax:82,pmin:7.0,pmax:8.0,gmin:8, gmax:18,bioload:2,size_in:2.5,min_gal:20,  level:'Beginner',     note:'Vivid red and blue coloration. Active schooler of 6+. Easy to keep.'},
  celestial_pearl_danio:{name:'Celestial Pearl Danio', tmin:73,tmax:79,pmin:6.5,pmax:7.5,gmin:2, gmax:15,bioload:1,size_in:1,  min_gal:10,  level:'Intermediate', hard_reason:'Shy and easily outcompeted for food. Needs a calm, planted nano setup away from boisterous fish.',note:'Stunning nano fish. Calm planted tank only. School of 8+.'},
  pearl_danio:          {name:'Pearl Danio',           tmin:64,tmax:77,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:1,size_in:2,  min_gal:15,  level:'Beginner',     note:'Hardy active schooler. Very forgiving beginner fish. Group of 6+.'},
  african_dwarf_frog:   {name:'African Dwarf Frog',    tmin:72,tmax:82,pmin:6.5,pmax:7.5,gmin:5, gmax:20,bioload:1,size_in:1.5,min_gal:10,  level:'Beginner',     note:'Fully aquatic amphibian. Peaceful. Must surface for air. Avoid strong flow.'},
  dwarf_puffer:         {name:'Dwarf Puffer',          tmin:74,tmax:82,pmin:6.5,pmax:7.5,gmin:5, gmax:15,bioload:2,size_in:1,  min_gal:5,   level:'Advanced',     hard_reason:'Nips fins of any tankmate including its own kind. Needs live snails or frozen foods — will not eat dry food.',note:'Keep alone or in species tank. Needs live snails or frozen food.'},
  scarlet_badis:        {name:'Scarlet Badis',         tmin:72,tmax:82,pmin:6.5,pmax:7.5,gmin:5, gmax:15,bioload:1,size_in:0.8,min_gal:5,   level:'Intermediate', hard_reason:'Refuses dry food in most cases. Needs live or frozen micro foods. Males highly territorial with each other.',note:'Micro fish. Needs live or frozen food. One male per tank.'},
  clown_killifish:      {name:'Clown Killifish',       tmin:72,tmax:79,pmin:5.5,pmax:7.0,gmin:1, gmax:10,bioload:1,size_in:1.5,min_gal:5,   level:'Intermediate', hard_reason:'Needs soft, slightly acidic water. Surface-dwelling and will jump — a tight-fitting lid is essential.',note:'Beautiful surface fish. Must have a tight lid — it jumps.'},
  peacock_cichlid:      {name:'Peacock Cichlid',       tmin:76,tmax:82,pmin:7.8,pmax:8.5,gmin:10,gmax:25,bioload:3,size_in:6,  min_gal:55,  level:'Advanced',     hard_reason:'Requires Lake Malawi water chemistry: very alkaline and hard. Still shows cichlid territorial behavior.',note:'Stunning Lake Malawi cichlid. Less aggressive than mbuna.'},
  flying_fox:           {name:'Flying Fox',            tmin:72,tmax:79,pmin:6.0,pmax:7.5,gmin:5, gmax:15,bioload:2,size_in:5,  min_gal:30,  level:'Intermediate', hard_reason:'Territorial with own kind and similar-shaped fish. Often confused with false siamese algae eater which is more aggressive.',note:'Good algae eater. One per tank unless very large.'},
  bolivian_ram:         {name:'Bolivian Ram',          tmin:72,tmax:79,pmin:6.5,pmax:7.5,gmin:5, gmax:15,bioload:2,size_in:3.5,min_gal:20,  level:'Beginner',     note:'Hardier and more forgiving than German Blue Ram. Great beginner cichlid.'},
};

// ===== PLANT DATABASE (20 species) =====
var PL = {
  amazon_sword:   {name:'Amazon Sword',       tmin:60,tmax:82,light:'Medium',co2:false,diff:'Easy',   note:'Background plant. Needs root tabs for nutrients.'},
  anubias:        {name:'Anubias',            tmin:60,tmax:84,light:'Low',   co2:false,diff:'Easy',   note:'Attach to hardscape. Burying rhizome causes rot.'},
  bacopa:         {name:'Bacopa',             tmin:68,tmax:82,light:'Medium',co2:false,diff:'Easy',   note:'Compact stem plant. Slightly acidic water preferred.'},
  bucephalandra:  {name:'Bucephalandra',      tmin:68,tmax:86,light:'Low',   co2:false,diff:'Easy',   note:'Many color variants. Attach to hardscape. Slow grower.'},
  cryptocoryne:   {name:'Cryptocoryne',       tmin:68,tmax:82,light:'Low',   co2:false,diff:'Easy',   note:'Melts when moved. Will recover within weeks.'},
  duckweed:       {name:'Duckweed',           tmin:60,tmax:86,light:'Low',   co2:false,diff:'Easy',   note:'Tiny floating plant. Spreads extremely fast.'},
  dwarf_hairgrass:{name:'Dwarf Hairgrass',    tmin:60,tmax:80,light:'Medium',co2:false,diff:'Medium', note:'Carpet plant. Slow to establish without CO2.'},
  dwarf_lily:     {name:'Dwarf Lily',         tmin:68,tmax:82,light:'Medium',co2:false,diff:'Medium', note:'Grows from bulb. Beautiful broad lily pad leaves.'},
  frogbit:        {name:'Frogbit',            tmin:60,tmax:78,light:'Medium',co2:false,diff:'Easy',   note:'Floating plant. Provides shade and surface cover.'},
  hornwort:       {name:'Hornwort',           tmin:59,tmax:86,light:'Medium',co2:false,diff:'Easy',   note:'Very fast grower. Great natural nitrate filter.'},
  java_fern:      {name:'Java Fern',          tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',   note:'Tie to driftwood. Never bury rhizome.'},
  java_moss:      {name:'Java Moss',          tmin:60,tmax:82,light:'Low',   co2:false,diff:'Easy',   note:'Great for shrimp and fry cover. Attach to surfaces.'},
  ludwigia:       {name:'Ludwigia',           tmin:68,tmax:82,light:'High',  co2:true, diff:'Medium', note:'Red/orange color with high light and CO2.'},
  moneywort:      {name:'Moneywort',          tmin:60,tmax:82,light:'Medium',co2:false,diff:'Easy',   note:'Round leaves on stems. Can also grow above water.'},
  monte_carlo:    {name:'Monte Carlo',        tmin:68,tmax:82,light:'Medium',co2:true, diff:'Medium', note:'Dense carpet. CO2 greatly accelerates growth.'},
  pennywort:      {name:'Pennywort',          tmin:68,tmax:82,light:'Medium',co2:false,diff:'Easy',   note:'Fast growing trailing stems. Easy for beginners.'},
  rotala:         {name:'Rotala',             tmin:72,tmax:82,light:'High',  co2:true, diff:'Medium', note:'Pink/red stems need CO2 and high light to develop.'},
  vallisneria:    {name:'Vallisneria',        tmin:60,tmax:86,light:'Medium',co2:false,diff:'Easy',   note:'Spreads via runners. Tall background plant.'},
  water_sprite:   {name:'Water Sprite',       tmin:60,tmax:87,light:'Medium',co2:false,diff:'Easy',   note:'Can float or plant in substrate. Trim regularly.'},
  water_wisteria: {name:'Water Wisteria',     tmin:60,tmax:86,light:'Medium',co2:false,diff:'Easy',   note:'Fast grower. Delicate lacy leaves. Trim regularly.'}
};

// ===== STORAGE =====
function ld() {
  try {
    var d = JSON.parse(localStorage.getItem('aq')) || mt();
    if (!Array.isArray(d.feeding)) d.feeding = [];
    return d;
  } catch(e) { return mt(); }
}
function sv(d) { localStorage.setItem('aq', JSON.stringify(d)); }
function mt() { return {tanks:[], equip:[], plants:[], stock:[], tasks:[], water:[], feeding:[]}; }
function gid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function at() { return localStorage.getItem('aq_at') || ''; }
function sat(id) { localStorage.setItem('aq_at', id); }
function pn(v) {
  if (v === '' || v === null || v === undefined) return null;
  var n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// ===== UNIT CONVERSION =====
function g2l(g) { return Math.round(g * 3.78541 * 10) / 10; }
function l2g(l) { return Math.round(l / 3.78541 * 10) / 10; }

// ===== TANKS =====
function add_tank(name, gal, setup, notes) {
  var d = ld(), g = parseFloat(gal) || 0;
  var t = {id:gid(), name:name, gallons:g, liters:g2l(g), setup_date:setup, notes:notes||''};
  d.tanks.push(t); sv(d); sat(t.id); return t.id;
}
function upd_tank(id, name, gal, setup, notes) {
  var d = ld(), g = parseFloat(gal) || 0;
  d.tanks = d.tanks.map(function(t) {
    return t.id === id ? {id:id, name:name, gallons:g, liters:g2l(g), setup_date:setup, notes:notes||''} : t;
  });
  sv(d);
}
function del_tank(id) {
  var d = ld();
  d.tanks = d.tanks.filter(function(x) { return x.id !== id; });
  ['equip','plants','stock','tasks','water','feeding'].forEach(function(k) {
    d[k] = d[k].filter(function(x) { return x.tank_id !== id; });
  });
  sv(d);
  sat(d.tanks.length ? d.tanks[0].id : '');
}

// ===== FEEDING LOG =====
function add_feeding(tid) {
  var d = ld(), now = new Date();
  d.feeding.push({id:gid(), tank_id:tid, date:now.toISOString().slice(0,10), ts:now.getTime()});
  sv(d);
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
  var entries = get_water(tid);
  if (!entries.length) return {phase:0, pct:5, label:'Not started', color:'#9ca3af', desc:'Add an ammonia source (pure ammonia, fish food, or a few hardy starter fish) and log your first water test to begin tracking.'};
  var last = entries[entries.length - 1];
  var nh3 = last.ammonia, no2 = last.nitrite, no3 = last.nitrate;
  if (nh3 === null && no2 === null) return {phase:0, pct:10, label:'Monitoring', color:'#9ca3af', desc:'Log ammonia and nitrite readings to track cycle progress.'};
  if (nh3 !== null && nh3 <= 0.25 && no2 !== null && no2 <= 0.25 && no3 !== null && no3 > 0) return {phase:4, pct:100, label:'Cycle complete!', color:'#3ab87a', desc:'NH3 and NO2 are at 0 ppm, nitrate detected. Your tank is ready. Add fish slowly — 2-3 at a time, wait 1-2 weeks between additions.'};
  if (nh3 !== null && nh3 <= 0.5 && no2 !== null && no2 > 0) return {phase:3, pct:75, label:'Almost there', color:'#e8a838', desc:'Ammonia is falling and nitrite-eating bacteria are multiplying. Keep testing every 2-3 days. 1-2 more weeks typically.'};
  if (no2 !== null && no2 > 0) return {phase:2, pct:50, label:'Nitrite spike', color:'#e05252', desc:'Ammonia-eating bacteria are established. Nitrite-eating bacteria are growing now. Both are still toxic — do not add fish. Avoid large water changes.'};
  if (nh3 !== null && nh3 > 0) return {phase:1, pct:25, label:'Ammonia spike', color:'#e8a838', desc:'Beneficial bacteria are starting to colonise the filter. This is normal. Do NOT do water changes yet. Test every 2-3 days and wait.'};
  return {phase:0, pct:10, label:'Monitoring', color:'#9ca3af', desc:'Keep logging water tests to track cycle progress.'};
}
function mark_cycled(tid) {
  var d = ld();
  d.tanks = d.tanks.map(function(t){ return t.id === tid ? Object.assign({}, t, {cycled:true}) : t; });
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
function del_equip(id) { var d = ld(); d.equip = d.equip.filter(function(x){return x.id!==id;}); sv(d); }

function eq_cfg_txt(eq) {
  var cfg = eq.config || {};
  if (eq.type === 'Light') {
    var w = cfg.watts ? cfg.watts + 'W' : '';
    var s = cfg.spectrum || '';
    var h = cfg.hours ? cfg.hours + 'h/day' : '';
    return [w, s, h].filter(function(x){return x;}).join(', ') || '-';
  }
  if (eq.type === 'Filter') {
    var g = cfg.flow_gph ? cfg.flow_gph + ' GPH' : '';
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
function del_plant(id) { var d = ld(); d.plants = d.plants.filter(function(x){return x.id!==id;}); sv(d); }

// ===== LIVESTOCK =====
function add_stock(tid, sid, dname, qty, added, notes) {
  var d = ld();
  d.stock.push({id:gid(), tank_id:tid, species_id:sid, display_name:dname||(SP[sid]?SP[sid].name:sid), qty:parseInt(qty)||1, added_date:added, notes:notes||''});
  sv(d);
}
function del_stock(id) { var d = ld(); d.stock = d.stock.filter(function(x){return x.id!==id;}); sv(d); }

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
function del_task(id) { var d = ld(); d.tasks = d.tasks.filter(function(x){return x.id!==id;}); sv(d); }
function mark_done(id) {
  var d = ld(), today = new Date().toISOString().slice(0,10);
  d.tasks = d.tasks.map(function(t) {
    return t.id === id ? Object.assign({}, t, {last_done:today, next_due:next_due(today,t.freq)}) : t;
  });
  sv(d);
}

// ===== WATER LOG =====
function add_water(tid, date, tf, nh3, no2, no3, ph, gh, notes) {
  var d = ld();
  d.water.push({id:gid(), tank_id:tid, date:date, temp_f:pn(tf), ammonia:pn(nh3), nitrite:pn(no2), nitrate:pn(no3), ph:pn(ph), gh:pn(gh), notes:notes||''});
  sv(d);
}
function del_water(id) { var d = ld(); d.water = d.water.filter(function(x){return x.id!==id;}); sv(d); }
function get_water(tid) {
  return ld().water.filter(function(x){return x.tank_id===tid;}).sort(function(a,b){return a.date<b.date?-1:1;});
}
function last_r(tid) { var w = get_water(tid); return w.length ? w[w.length-1] : null; }

// ===== BIOLOAD =====
function calc_bioload(tid) {
  var d = ld(), total = 0;
  d.stock.filter(function(x){ return x.tank_id === tid; }).forEach(function(s) {
    var sp = SP[s.species_id];
    // Invertebrates (shrimps, snails) produce ~30% of the waste fish do at equivalent size
    if (sp) total += (sp.bioload || 2) * s.qty * (sp.inv ? 0.3 : 1);
  });
  return Math.round(total * 10) / 10;
}
function max_bioload(gallons, plant_count) {
  var mult = plant_count >= 5 ? 1.2 : plant_count >= 1 ? 1.1 : 1.0;
  return Math.max(1, Math.round(gallons * 1.5 * mult));
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
  var max_bl = Math.round(max_bioload(tank.gallons, pl_count) * filter_mult);
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
  recs.push({type:'Water Test', name:'Water Parameter Test', freq:wt_freq,
    why:'Test NH3, NO2, NO3 and pH to catch issues early'});

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

  return recs;
}

function add_rec_task(type, name, freq) {
  add_task(at(), type, name, parseInt(freq), today_str(), 'Recommended task');
  r_maint();
}

// ===== RECOMMENDATIONS ENGINE =====
function overlap(tid) {
  var d = ld(), items = d.stock.filter(function(x){return x.tank_id===tid;});
  if (!items.length) return null;
  var tmi=-Infinity,tma=Infinity,pmi=-Infinity,pma=Infinity,gmi=-Infinity,gma=Infinity,sl=[];
  items.forEach(function(s) {
    var sp = SP[s.species_id]; if (!sp) return;
    sl.push(sp);
    tmi=Math.max(tmi,sp.tmin); tma=Math.min(tma,sp.tmax);
    pmi=Math.max(pmi,sp.pmin); pma=Math.min(pma,sp.pmax);
    gmi=Math.max(gmi,sp.gmin); gma=Math.min(gma,sp.gmax);
  });
  return {sl:sl, temp:{min:tmi,max:tma,ok:tmi<=tma}, ph:{min:pmi,max:pma,ok:pmi<=pma}, gh:{min:gmi,max:gma,ok:gmi<=gma}, all_ok:tmi<=tma&&pmi<=pma&&gmi<=gma};
}
function bad_pairs(sl) {
  var c = [];
  for (var i=0; i<sl.length; i++) for (var j=i+1; j<sl.length; j++) {
    var a=sl[i], b=sl[j], ps=[];
    if (Math.max(a.tmin,b.tmin)>Math.min(a.tmax,b.tmax)) ps.push('Temperature');
    if (Math.max(a.pmin,b.pmin)>Math.min(a.pmax,b.pmax)) ps.push('pH');
    if (Math.max(a.gmin,b.gmin)>Math.min(a.gmax,b.gmax)) ps.push('Hardness');
    if (ps.length) c.push({a:a.name, b:b.name, ps:ps});
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
  var lmap = {temp_f:'Temperature (F)', ammonia:'Ammonia (ppm)', nitrite:'Nitrite (ppm)', nitrate:'Nitrate (ppm)', ph:'pH', gh:'Hardness (GH)'};
  ch_inst = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: {
      labels: entries.map(function(e) { return e.date; }),
      datasets: [{
        label: lmap[param] || param,
        data: entries.map(function(e) { return e[param]; }),
        borderColor: '#4db8d4', backgroundColor: 'rgba(77,184,212,0.12)',
        tension: 0.3, fill: true, pointRadius: 4, spanGaps: true
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {legend:{display:false}, tooltip:{mode:'index',intersect:false}},
      scales: {x:{ticks:{maxTicksLimit:8}}, y:{beginAtZero:false}}
    }
  });
}

// ===== EXPORT / IMPORT =====
function do_export() {
  var blob = new Blob([JSON.stringify(ld(), null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'aquatracker-' + new Date().toISOString().slice(0,10) + '.json';
  a.click(); URL.revokeObjectURL(url);
}
function do_import(inp) {
  var file = inp.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var p = JSON.parse(e.target.result);
      var ok = ['tanks','equip','plants','stock','tasks','water'].every(function(k){ return Array.isArray(p[k]); });
      if (!ok) { alert('Invalid backup file format.'); return; }
      sv(p); inp.value = '';
      if (p.tanks.length) sat(p.tanks[0].id);
      init();
    } catch(err) { alert('Could not read file: ' + err.message); }
  };
  reader.readAsText(file);
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
function get_param_alerts(tid) {
  var entries = get_water(tid);
  if (entries.length < 2) return [];
  var alerts = [];
  var last3 = entries.slice(-3);
  var last = last3[last3.length - 1];
  var prev = last3[last3.length - 2];

  // Persistent ammonia
  if (last.ammonia !== null && last.ammonia > 0 && prev.ammonia !== null && prev.ammonia > 0) {
    alerts.push({level:'danger', msg:'Ammonia has been elevated across multiple tests (' + prev.ammonia + ' ppm → ' + last.ammonia + ' ppm). Do a 25-50% water change immediately and recheck in 24h.'});
  }
  // Persistent nitrite
  if (last.nitrite !== null && last.nitrite > 0 && prev.nitrite !== null && prev.nitrite > 0) {
    alerts.push({level:'danger', msg:'Nitrite remains elevated across multiple tests (' + prev.nitrite + ' ppm → ' + last.nitrite + ' ppm). Tank may not be fully cycled. Hold off adding fish.'});
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
    alerts.push({level:'warn', msg:'Temperature changed ' + Math.abs(last.temp_f - prev.temp_f).toFixed(1) + '\xB0F between tests (' + prev.temp_f + ' → ' + last.temp_f + '). Rapid swings cause stress and disease.'});
  }
  return alerts;
}

// ===== CYCLE CARD =====
function r_cycle_card(tid) {
  var d = ld();
  var tank = d.tanks.find(function(t){ return t.id === tid; }); if (!tank) return '';
  if (tank.cycled) return '';
  var age = Math.floor((Date.now() - new Date(tank.setup_date + 'T00:00:00').getTime()) / 86400000);
  var cyc = cycle_status(tid);
  if (cyc.phase === 4) {
    var d2 = ld();
    d2.tanks = d2.tanks.map(function(t){ return t.id === tid ? Object.assign({}, t, {cycled:true}) : t; });
    sv(d2);
  }
  if (age > 180 && cyc.phase === 4) return '';
  var steps = ['No source', 'NH3 spike', 'NO2 spike', 'NO2 falling', 'Cycled'];
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
  if (cyc.phase < 4) {
    h += '<p style="font-size:12px;color:var(--muted);margin-top:6px;background:#f5f8fb;padding:8px 10px;border-radius:6px">Typical timeline: 4-6 weeks total. Test every 2-3 days. Do not add fish until NH3 and NO2 both read 0 ppm.</p>';
    h += '<div style="margin-top:8px"><button class="btn bg bs" onclick="mark_cycled(at())">Mark as Cycled Manually</button></div>';
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
  var has_test   = d.water.some(function(w){ return w.tank_id === tid; });
  var cyc = cycle_status(tid);
  var cycle_started = chk.cycle_src || (cyc.phase >= 1);
  var items = [
    {key:'rinsed',    auto:false, done:chk.rinsed||false,  label:'Tank, gravel, and decorations rinsed with no soap'},
    {key:'dechlo',    auto:false, done:chk.dechlo||false,  label:'Water dechlorinator purchased (Prime, Stress Coat, etc.)'},
    {key:'_filter',   auto:true,  done:has_filter,          label:'Filter installed and running'},
    {key:'_heater',   auto:true,  done:has_heater,          label:'Heater installed and set to target temperature'},
    {key:'_tested',   auto:true,  done:has_test,            label:'First water test logged'},
    {key:'cycle_src', auto:false, done:cycle_started,       label:'Ammonia source added to start the cycle'},
    {key:'_cycled',   auto:true,  done:cyc.phase===4||tank.cycled||false, label:'Tank fully cycled — safe to add fish'}
  ];
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
    o.value = t.id; o.textContent = t.name + ' (' + t.gallons + 'g)';
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

  var tasks = d.tasks.filter(function(x){ return x.tank_id === tid; })
    .sort(function(a,b){ return days_til(a.next_due) - days_til(b.next_due); });
  var nt = tasks.length ? tasks[0] : null;
  var nt_txt = nt ? (esc(nt.name) + ' in ' + days_til(nt.next_due) + 'd') : 'None set';
  var lr = last_r(tid), rng = overlap(tid);
  var pl_count = d.plants.filter(function(x){ return x.tank_id === tid; }).length;
  var cur_bl = calc_bioload(tid);
  var filter_mult = get_filter_mult(tid);
  var max_bl = Math.round(max_bioload(tank.gallons, pl_count) * filter_mult);
  var bl_pct = max_bl > 0 ? Math.min(100, Math.round(cur_bl / max_bl * 100)) : 0;
  var bl_cls = bioload_cls(cur_bl, max_bl);
  var bl_color = bl_cls === 'ok' ? 'var(--ok)' : bl_cls === 'warn' ? 'var(--warn)' : 'var(--danger)';

  var h = '';

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

  // Parameter trend alerts
  var p_alerts = get_param_alerts(tid);
  if (p_alerts.length) {
    p_alerts.forEach(function(a) {
      h += '<div class="' + (a.level === 'danger' ? 'cwarn' : 'cinfo') + '" style="margin-bottom:10px;font-weight:400;font-size:13px">' +
           '<strong>' + (a.level === 'danger' ? '&#x1F6A8; Alert:' : '&#x26A0; Trend:') + '</strong> ' + esc(a.msg) + '</div>';
    });
  }

  h += '<div class="dgrid">';
  h += scard('Tank Size', tank.gallons + ' gal', tank.liters + ' L');
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
       '<button class="btn bp bs" style="margin-top:8px;width:100%" onclick="add_feeding(at());r_dash()">Log Feeding</button></div>';
  h += '</div>';

  // Cycle tracker
  h += r_cycle_card(tid);

  h += '<div class="card"><div class="ctitle">Last Water Reading';
  if (lr) h += '<small style="font-weight:400;color:var(--muted)"> ' + lr.date + '</small>';
  h += '</div>';
  if (lr) {
    var ps = [
      {k:'temp_f',  l:'Temperature',   u:'F',  mn:rng&&rng.temp.ok?rng.temp.min:null, mx:rng&&rng.temp.ok?rng.temp.max:null, tox:false},
      {k:'ammonia', l:'Ammonia',       u:'ppm', mn:0, mx:0, tox:true},
      {k:'nitrite', l:'Nitrite',       u:'ppm', mn:0, mx:0, tox:true},
      {k:'nitrate', l:'Nitrate',       u:'ppm', mn:0, mx:40, tox:false},
      {k:'ph',      l:'pH',            u:'',    mn:rng&&rng.ph.ok?rng.ph.min:null, mx:rng&&rng.ph.ok?rng.ph.max:null, tox:false},
      {k:'gh',      l:'Hardness (GH)', u:'',    mn:rng&&rng.gh.ok?rng.gh.min:null, mx:rng&&rng.gh.ok?rng.gh.max:null, tox:false}
    ];
    h += '<div class="tw"><table><tr><th>Parameter</th><th>Reading</th><th>Safe Range</th><th>Status</th></tr>';
    ps.forEach(function(p) {
      var val = lr[p.k], c = cls_val(val, p.mn, p.mx, p.tox);
      var rng_txt = p.tox ? '0 ppm' : (p.mn !== null && p.mx !== null ? p.mn + '-' + p.mx + (p.u?' '+p.u:'') : '-');
      h += '<tr><td>' + p.l + '</td><td>' + (val !== null ? val + (p.u?' '+p.u:'') : '-') + '</td><td style="color:var(--muted)">' + rng_txt + '</td><td>' + pill(c) + '</td></tr>';
    });
    h += '</table></div>';
  } else {
    h += '<p class="emsg">No readings yet. Go to the Water Log tab to add one.</p>';
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
           '<td><button class="btn bd bs" data-id="' + p.id + '" onclick="del_plant(this.dataset.id);r_life()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No plants added yet.</p>';
  h += '</div>';

  h += '<div class="card"><div class="ctitle">Livestock <button class="btn bp bs" onclick="do_add_stock()">+ Add</button></div>';
  if (sk.length) {
    var tank_life = d.tanks.find(function(t){ return t.id === tid; });
    var small_tank_warns = [];
    sk.forEach(function(s) {
      var sp = SP[s.species_id];
      if (sp && sp.min_gal && tank_life && tank_life.gallons < sp.min_gal) {
        small_tank_warns.push(sp.name + ' needs ' + sp.min_gal + 'g min');
      }
    });
    if (small_tank_warns.length) {
      h += '<div style="background:#fde0e0;border-radius:6px;padding:8px 10px;font-size:12px;color:#a01818;font-weight:600;margin-bottom:10px">&#x26A0; Tank may be too small: ' + small_tank_warns.join('; ') + '</div>';
    }
    h += '<div class="tw"><table><tr><th>Species</th><th>Name</th><th>Qty</th><th>Adult Size</th><th>Bioload</th><th>Added</th><th>Notes</th><th></th></tr>';
    sk.forEach(function(s) {
      var sp = SP[s.species_id];
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
           '<td><button class="btn bd bs" data-id="' + s.id + '" onclick="del_stock(this.dataset.id);r_life()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No livestock added yet.</p>';
  h += '</div>';
  el.innerHTML = h;
}

// ===== WATER LOG =====
function r_wlog() {
  var tid = at(), d = ld(), el = document.getElementById('p-wlog');
  if (!d.tanks.find(function(t){return t.id===tid;})) { el.innerHTML = no_tank(); return; }
  var td = today_str();
  var h = '<div class="card"><div class="ctitle">Add Water Reading</div>' +
    '<form id="wf" onsubmit="sub_water(event)">' +
    '<div class="frow">' +
    fgh('Date', '<input type="date" name="date" value="' + td + '" required>', '') +
    fgh('Temperature (F)', '<input type="number" name="tf" step="0.1" placeholder="e.g. 76">', 'Stable temp is as important as the number itself.') +
    fgh('Ammonia (ppm)', '<input type="number" name="nh3" step="0.01" placeholder="e.g. 0">', 'Target: 0 ppm. Any reading above 0 is harmful to fish.') +
    fgh('Nitrite (ppm)', '<input type="number" name="no2" step="0.01" placeholder="e.g. 0">', 'Target: 0 ppm. Toxic even at 0.25 ppm. Spikes during cycling.') +
    '</div><div class="frow">' +
    fgh('Nitrate (ppm)', '<input type="number" name="no3" step="0.1" placeholder="e.g. 10">', 'Keep below 20 ppm. Reduced by regular water changes.') +
    fgh('pH', '<input type="number" name="ph" step="0.01" placeholder="e.g. 7.0">', 'Stability matters more than exact value. Avoid sudden changes.') +
    fgh('Hardness (GH)', '<input type="number" name="gh" step="0.1" placeholder="e.g. 8">', 'Most tropical fish prefer 4-12 dGH (soft to medium water).') +
    fgh('Notes', '<input type="text" name="notes" placeholder="Optional notes">', '') +
    '</div><button type="submit" class="btn bp">Save Reading</button></form></div>';
  var entries = get_water(tid);
  if (entries.length >= 2) {
    h += '<div class="card"><div class="ctitle" style="gap:10px">Trend ' +
      '<select id="cpsel" onchange="draw_chart(at(),this.value)">' +
      '<option value="temp_f">Temperature</option><option value="ammonia">Ammonia</option>' +
      '<option value="nitrite">Nitrite</option><option value="nitrate">Nitrate</option>' +
      '<option value="ph">pH</option><option value="gh">Hardness</option>' +
      '</select></div><div class="chart-wrap"><canvas id="wc"></canvas></div></div>';
  }
  if (entries.length) {
    h += '<div class="card"><div class="ctitle">History</div><div class="tw"><table>' +
      '<tr><th>Date</th><th>Temp F</th><th>NH3</th><th>NO2</th><th>NO3</th><th>pH</th><th>GH</th><th>Notes</th><th></th></tr>';
    entries.slice().reverse().slice(0, 30).forEach(function(e) {
      h += '<tr><td>' + e.date + '</td><td>' + nv(e.temp_f) + '</td><td>' + nv(e.ammonia) + '</td><td>' + nv(e.nitrite) + '</td>' +
           '<td>' + nv(e.nitrate) + '</td><td>' + nv(e.ph) + '</td><td>' + nv(e.gh) + '</td><td>' + esc(e.notes) + '</td>' +
           '<td><button class="btn bd bs" data-id="' + e.id + '" onclick="del_water(this.dataset.id);r_wlog()">&#x2715;</button></td></tr>';
    });
    h += '</table></div></div>';
  }
  el.innerHTML = h;
  if (entries.length >= 2) draw_chart(tid, 'temp_f');
}
function sub_water(e) {
  e.preventDefault(); var f = e.target, tid = at();
  add_water(tid, f.date.value, f.tf.value, f.nh3.value, f.no2.value, f.no3.value, f.ph.value, f.gh.value, f.notes.value);
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
       '<span>Tank: <strong>' + (tank ? tank.gallons : 0) + ' gal</strong></span>' +
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
  res_el.innerHTML = 'Remove <strong>' + gal + ' gal</strong> (' + lit + ' L) &mdash; treat replacement water with dechlorinator before adding to tank.';
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
  var max_bl = Math.round(max_bioload(tank ? tank.gallons : 0, pl_in_tank.length) * filter_mult);
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
      fixes.push('upgrade filter to ' + tgt_lo + '-' + tgt_hi + ' GPH (low flow costs you 15% capacity)');
    } else if (!filter_maxed) {
      fixes.push('upgrade to a high-flow filter (6x+ turnover = ' + (tgt_hi) + '+ GPH) for a 10% boost');
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
    var fmsg = filter_mult < 1.0 ? 'Filter flow below 4x turnover: capacity reduced by 15%. Aim for 4-6x (GPH = ' + Math.ceil((tank ? tank.gallons : 0) * 4) + '-' + Math.ceil((tank ? tank.gallons : 0) * 6) + ').' : 'High-flow filter (6x+ turnover): +10% capacity bonus applied.';
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

  h += '<div class="card"><div class="ctitle">Equipment Check</div>';
  // Filter row
  h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:13px">';
  h += '<span style="font-weight:600;min-width:50px">Filter:</span>';
  if (total_gph > 0 && tank) {
    var turn_cls = turnover < 4 ? 'pdanger' : turnover < 6 ? 'pwarn' : 'pok';
    var turn_lbl = turnover < 4 ? 'Low flow' : turnover < 6 ? 'OK' : 'Excellent';
    h += '<span>' + total_gph + ' GPH &mdash; ' + turnover + 'x turnover/hr</span> ' + pill_lbl(turn_cls, turn_lbl);
    if (turnover < 4 && tank) h += '<span style="font-size:12px;color:var(--danger);margin-left:8px">Needs ' + Math.ceil(tank.gallons * 4) + '+ GPH</span>';
  } else if (filters_eq.length) {
    h += '<span style="color:var(--muted)">Filter added. Set GPH in equipment to see turnover rate.</span>';
  } else {
    h += '<span style="color:var(--muted)">No filter configured.</span>';
  }
  h += '</div>';
  // Light row
  h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:13px">';
  h += '<span style="font-weight:600;min-width:50px">Light:</span>';
  if (light_hours > 0) {
    var light_ok = !needs_high_light || light_hours >= 8;
    h += '<span>' + light_hours + ' hours/day</span>';
    if (needs_high_light && light_hours < 8) h += ' <span style="color:var(--danger);font-size:12px">High-light plants need 8+ hours</span>';
    else if (light_hours >= 8) h += ' ' + pill_lbl('pok', 'Good');
    else h += ' ' + pill_lbl('pwarn', 'Moderate');
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
    h += '<span style="color:var(--muted)">No CO2 system.</span>';
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
      h += '<span style="font-size:12px;color:var(--danger);margin-left:8px">Recommend ' + rec_w + 'W+ for a ' + (tank ? tank.gallons : 0) + 'g tank (5W/gal rule)</span>';
    }
  } else if (heaters_eq.length) {
    h += '<span style="color:var(--muted)">Heater added — set wattage in equipment config to check sizing.</span>';
  } else {
    h += '<span style="color:var(--muted)">No heater configured. Tropical fish need stable warm water.</span>';
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
        h += '<li><strong>' + esc(p.a) + '</strong> + <strong>' + esc(p.b) + '</strong> conflict on: ' + p.ps.join(', ') + '</li>';
      });
      h += '</ul></div>';
    }
  }

  h += '<div class="card"><div class="ctitle">Recommended Water Parameters</div>' +
    '<div class="tw"><table><tr><th>Parameter</th><th>Safe Range</th><th>Current Reading</th><th>Status</th></tr>';
  var rp = [
    {l:'Temperature', u:'F',   mn:rng.temp.ok?rng.temp.min:null, mx:rng.temp.ok?rng.temp.max:null, k:'temp_f',  tox:false},
    {l:'Ammonia',     u:'ppm', mn:0, mx:0, k:'ammonia', tox:true},
    {l:'Nitrite',     u:'ppm', mn:0, mx:0, k:'nitrite', tox:true},
    {l:'Nitrate',     u:'ppm', mn:0, mx:20, k:'nitrate', tox:false},
    {l:'pH',          u:'',    mn:rng.ph.ok?rng.ph.min:null, mx:rng.ph.ok?rng.ph.max:null, k:'ph', tox:false},
    {l:'Hardness (GH)',u:'',   mn:rng.gh.ok?rng.gh.min:null, mx:rng.gh.ok?rng.gh.max:null, k:'gh', tox:false}
  ];
  rp.forEach(function(p) {
    var cur = lr ? lr[p.k] : null, c = cls_val(cur, p.mn, p.mx, p.tox);
    var rt = p.tox ? '0 ppm' : (p.mn !== null && p.mx !== null ? p.mn + '-' + p.mx + (p.u?' '+p.u:'') : '-');
    h += '<tr><td>' + p.l + '</td><td>' + rt + '</td><td>' + (cur !== null ? cur + (p.u?' '+p.u:'') : '-') + '</td><td>' + pill(c) + '</td></tr>';
  });
  h += '</table></div></div>';

  h += '<div class="card"><div class="ctitle">Per-Species Requirements</div>' +
    '<div class="tw"><table><tr><th>Species</th><th>Level</th><th>Adult Size</th><th>Min Tank</th><th>Temp (F)</th><th>pH</th><th>Hardness</th><th>Bioload</th><th>Notes</th></tr>';
  rng.sl.forEach(function(sp) {
    var bl_lbl = sp.bioload <= 1 ? 'Very Low' : sp.bioload <= 2 ? 'Low' : sp.bioload <= 3 ? 'Medium' : sp.bioload <= 4 ? 'High' : 'Very High';
    var bl_inv_note = sp.inv ? ' <span style="font-size:10px;color:var(--muted)">(×0.3 inv.)</span>' : '';
    var lvl_color = sp.level === 'Advanced' ? 'var(--danger)' : sp.level === 'Intermediate' ? 'var(--warn)' : 'var(--ok)';
    var tank_warn = tank && sp.min_gal && tank.gallons < sp.min_gal;
    h += '<tr><td><strong>' + esc(sp.name) + '</strong></td>' +
         '<td style="color:' + lvl_color + ';font-weight:700;font-size:12px">' + (sp.level || 'Beginner') + '</td>' +
         '<td>' + (sp.size_in ? sp.size_in + '"' : '-') + '</td>' +
         '<td style="' + (tank_warn ? 'color:var(--danger);font-weight:700' : '') + '">' + (sp.min_gal ? sp.min_gal + 'g' : '-') + (tank_warn ? ' &#x26A0;' : '') + '</td>' +
         '<td>' + sp.tmin + '-' + sp.tmax + '</td>' +
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
    h += '<div class="tw"><table><tr><th>Plant</th><th>Temp (F)</th><th>Light Needed</th><th>CO2</th><th>Difficulty</th><th>Care Note</th></tr>';
    pl_in_tank.forEach(function(p) {
      var pd = PL[p.plant_id];
      if (pd) {
        var temp_ok = true;
        if (fish_tmin !== null && fish_tmax !== null) {
          temp_ok = pd.tmax >= fish_tmin && pd.tmin <= fish_tmax;
        }
        var light_warn = (pd.light === 'High' && light_hours > 0 && light_hours < 8) ? ' &#x26A0;' : '';
        h += '<tr><td><strong>' + esc(p.name) + '</strong></td>' +
             '<td' + (temp_ok ? '' : ' style="color:var(--danger);font-weight:700"') + '>' + pd.tmin + '-' + pd.tmax + (temp_ok ? '' : ' &#x26A0;') + '</td>' +
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
    '<div class="frow">' +
    fg('Gallons', '<input type="number" name="gal" step="0.1" placeholder="20" required oninput="this.form.lit.value=Math.round(this.value*3.78541*10)/10">') +
    fg('Litres',  '<input type="number" name="lit" step="0.1" placeholder="75.7"       oninput="this.form.gal.value=Math.round(this.value/3.78541*10)/10">') +
    '</div>' +
    fg('Setup Date', '<input type="date" name="setup" value="' + td + '" required>') +
    fg('Notes', '<textarea name="notes" placeholder="Optional notes about your tank"></textarea>') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add Tank</button></div>' +
    '</form>');
}
function sub_add_tank(e) {
  e.preventDefault(); var f = e.target;
  add_tank(f.name.value, f.gal.value, f.setup.value, f.notes.value);
  cm(); init();
}
function do_edit_tank() {
  var t = ld().tanks.find(function(x){ return x.id === at(); }); if (!t) return;
  om('<div class="mtitle">Edit Tank</div>' +
    '<form onsubmit="sub_edit_tank(event)">' +
    fg('Tank Name', '<input type="text" name="name" value="' + esc(t.name) + '" required>') +
    '<div class="frow">' +
    fg('Gallons', '<input type="number" name="gal" step="0.1" value="' + t.gallons + '" required oninput="this.form.lit.value=Math.round(this.value*3.78541*10)/10">') +
    fg('Litres',  '<input type="number" name="lit" step="0.1" value="' + t.liters  + '"       oninput="this.form.gal.value=Math.round(this.value/3.78541*10)/10">') +
    '</div>' +
    fg('Setup Date', '<input type="date" name="setup" value="' + t.setup_date + '" required>') +
    fg('Notes', '<textarea name="notes">' + esc(t.notes) + '</textarea>') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Save</button></div>' +
    '</form>');
}
function sub_edit_tank(e) {
  e.preventDefault(); var f = e.target;
  upd_tank(at(), f.name.value, f.gal.value, f.setup.value, f.notes.value);
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
    fg('Flow Rate (GPH)', '<input type="number" name="filter_gph" value="' + (c.flow_gph||'') + '" placeholder="e.g. 180" min="0">') +
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
    cfg.flow_gph = parseFloat(f.filter_gph.value) || 0;
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
      req_el.innerHTML = 'Temp: ' + p.tmin + '-' + p.tmax + 'F &nbsp;|&nbsp; Light: <strong>' + p.light + '</strong> &nbsp;|&nbsp; CO2: <strong>' + co2_str + '</strong> &nbsp;|&nbsp; ' + p.diff + '<br><span style="color:var(--muted)">' + esc(p.note) + '</span>';
      if (info_row) info_row.style.display = 'block';
    }
  }
}
function filter_plants() {
  var sel = document.querySelector('#mb select[name=pid]');
  var co2_sel = document.getElementById('pl_co2_filter');
  var light_sel = document.getElementById('pl_light_filter');
  if (!sel) return;
  var co2_f = co2_sel ? co2_sel.value : 'All';
  var light_f = light_sel ? light_sel.value : 'All';
  var opts = Object.keys(PL).filter(function(k) {
    var p = PL[k];
    if (co2_f === 'Yes' && !p.co2) return false;
    if (co2_f === 'No' && p.co2) return false;
    if (light_f !== 'All' && p.light !== light_f) return false;
    return true;
  }).map(function(k) {
    return '<option value="' + k + '">' + PL[k].name + ' (' + PL[k].light + ' light' + (PL[k].co2 ? ', CO2' : '') + ')</option>';
  }).join('') + '<option value="_custom">-- Other / Custom Plant --</option>';
  sel.innerHTML = opts;
  upd_plant_form(sel);
}
function do_add_plant() {
  var td = today_str();
  var popts = Object.keys(PL)
    .map(function(k){ return '<option value="' + k + '">' + PL[k].name + ' (' + PL[k].light + ' light' + (PL[k].co2 ? ', CO2' : '') + ')</option>'; })
    .join('') + '<option value="_custom">-- Other / Custom Plant --</option>';
  om('<div class="mtitle">Add Plant</div>' +
    '<form onsubmit="sub_add_plant(event)">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">' +
    '<label style="font-size:12px;color:var(--muted);font-weight:600">Filter:</label>' +
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
  var sid = sel.value, d = ld(), tid = at();
  var result_el = document.getElementById('stk_compat');
  if (!result_el || !SP[sid]) return;
  var new_sp = SP[sid], parts = [];

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
    parts.push('<div style="color:var(--danger);font-size:12px;font-weight:700;margin-top:2px">&#x1F4CF; Tank too small: needs ' + new_sp.min_gal + 'g min, yours is ' + tank.gallons + 'g</div>');
  }

  // Compatibility with existing stock
  var existing = d.stock.filter(function(s){ return s.tank_id === tid; });
  if (!existing.length) {
    parts.push('<div style="color:var(--muted);font-size:12px">First fish — no compatibility check needed.</div>');
  } else {
    var conflicts = [];
    existing.forEach(function(s) {
      var sp = SP[s.species_id]; if (!sp) return;
      var iss = [];
      if (Math.max(new_sp.tmin,sp.tmin) > Math.min(new_sp.tmax,sp.tmax)) iss.push('temp');
      if (Math.max(new_sp.pmin,sp.pmin) > Math.min(new_sp.pmax,sp.pmax)) iss.push('pH');
      if (Math.max(new_sp.gmin,sp.gmin) > Math.min(new_sp.gmax,sp.gmax)) iss.push('hardness');
      if (iss.length) conflicts.push(sp.name + ' (' + iss.join(', ') + ')');
    });
    if (conflicts.length) {
      parts.push('<div style="color:var(--danger);font-size:12px;font-weight:700">&#x26A0; Conflicts with: ' + esc(conflicts.join(', ')) + '</div>');
    } else {
      parts.push('<div style="color:var(--ok);font-size:12px;font-weight:700">&#x2713; Compatible with all current livestock</div>');
    }
  }

  result_el.innerHTML = parts.join('');
}

function build_stock_opts(level_filter) {
  return Object.keys(SP)
    .filter(function(k){ return !level_filter || level_filter === 'All' || SP[k].level === level_filter; })
    .sort(function(a,b){ return SP[a].name.localeCompare(SP[b].name); })
    .map(function(k) {
      var sp = SP[k], bl = sp.bioload, bl_lbl = bl <= 1 ? 'Low' : bl <= 3 ? 'Med' : 'High';
      var lvl = sp.level === 'Intermediate' ? ' ★★' : sp.level === 'Advanced' ? ' ★★★' : '';
      return '<option value="' + k + '">' + sp.name + ' (Bioload: ' + bl_lbl + lvl + ')</option>';
    }).join('');
}

function filter_stock_level(sel) {
  var species_sel = document.querySelector('#mb select[name=sid]');
  if (!species_sel) return;
  species_sel.innerHTML = build_stock_opts(sel.value);
  upd_stock_compat(species_sel);
}

function do_add_stock() {
  var td = today_str(), d = ld(), tid = at();
  var recent = d.stock.filter(function(s) {
    if (s.tank_id !== tid) return false;
    return Math.floor((Date.now() - new Date(s.added_date + 'T00:00:00').getTime()) / 86400000) < 14;
  });
  var speed_warn = recent.length ? '<div style="background:#fef3d5;border-radius:6px;padding:8px 10px;font-size:12px;color:#8a5a00;margin-bottom:10px">&#x26A0; You added livestock within the last 14 days. Adding more too quickly can spike ammonia. Consider waiting a bit longer.</div>' : '';
  om('<div class="mtitle">Add Livestock</div>' +
    speed_warn +
    '<form onsubmit="sub_add_stock(event)">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">' +
    '<label style="font-size:12px;color:var(--muted);font-weight:600">Show:</label>' +
    '<select onchange="filter_stock_level(this)" style="width:auto">' +
    '<option value="All">All species</option>' +
    '<option value="Beginner" selected>Beginner only</option>' +
    '<option value="Intermediate">Intermediate</option>' +
    '<option value="Advanced">Advanced</option>' +
    '</select>' +
    '<span style="font-size:11px;color:var(--muted)">★★ Intermediate &nbsp; ★★★ Advanced</span>' +
    '</div>' +
    '<div class="frow">' +
    fg('Species', '<select name="sid" onchange="upd_stock_compat(this)">' + build_stock_opts('Beginner') + '</select>') +
    fg('Display Name', '<input type="text" name="dname" placeholder="Leave blank for species name">') +
    '</div>' +
    '<div id="stk_compat" style="min-height:18px;margin:4px 0 8px;padding:0 2px"></div>' +
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
  add_stock(at(), f.sid.value, f.dname.value, f.qty.value, f.added.value, f.notes.value);
  cm(); r_life();
}

// ===== APP CORE =====
var cur_tab = 'dash';
function render_tab() {
  if      (cur_tab === 'dash')  r_dash();
  else if (cur_tab === 'life')  r_life();
  else if (cur_tab === 'wlog')  r_wlog();
  else if (cur_tab === 'maint') r_maint();
  else if (cur_tab === 'recs')  r_recs();
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
window.addEventListener('DOMContentLoaded', init);
<\/script>
</body>
</html>`;
