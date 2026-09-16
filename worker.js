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
.mbox{background:#fff;border-radius:var(--r);padding:22px;width:100%;max-width:500px;max-height:92vh;overflow-y:auto}
.mtitle{font-size:16px;font-weight:700;color:var(--deep);margin-bottom:14px}
.mact{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
.empty-s{text-align:center;padding:40px 16px;color:var(--muted)}
.empty-s h2{color:var(--deep);margin-bottom:8px;font-size:20px}
.empty-s p{margin-bottom:18px;font-size:14px}
.dgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:14px}
.scard{background:var(--card);border-radius:var(--r);box-shadow:var(--sh);padding:14px 18px}
.slbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.sval{font-size:24px;font-weight:700;color:var(--deep);margin-top:2px}
.ssub{font-size:11px;color:var(--muted);margin-top:1px}
.cok{background:#d4f5e5;border-radius:var(--r);padding:10px 14px;color:#1a7a4a;font-weight:600;margin-bottom:12px;font-size:14px}
.cwarn{background:#fde0e0;border-radius:var(--r);padding:10px 14px;color:#a01818;font-weight:600;margin-bottom:12px;font-size:14px}
.emsg{color:var(--muted);font-size:13px;padding:4px 0}
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
// ===== SPECIES DATABASE =====
var SP = {
  betta:           {name:'Betta',           tmin:72,tmax:86,pmin:6.0,pmax:8.0,gmin:1, gmax:15,note:'Keep males alone or in a sorority.'},
  neon_tetra:      {name:'Neon Tetra',       tmin:70,tmax:77,pmin:4.0,pmax:7.5,gmin:1, gmax:12,note:'School of 6+. Sensitive to nitrates.'},
  cardinal_tetra:  {name:'Cardinal Tetra',   tmin:73,tmax:79,pmin:4.5,pmax:7.5,gmin:1, gmax:12,note:'School of 6+. Similar to neon tetra.'},
  guppy:           {name:'Guppy',            tmin:63,tmax:82,pmin:7.0,pmax:8.5,gmin:8, gmax:30,note:'Hardy livebearer. Prefers hard water.'},
  molly:           {name:'Molly',            tmin:72,tmax:82,pmin:7.0,pmax:8.5,gmin:15,gmax:35,note:'Needs hard water; shimmies in soft water.'},
  platy:           {name:'Platy',            tmin:68,tmax:79,pmin:7.0,pmax:8.2,gmin:14,gmax:30,note:'Hardy livebearer. Avoid acidic water.'},
  corydoras:       {name:'Corydoras',        tmin:70,tmax:81,pmin:6.0,pmax:8.0,gmin:2, gmax:15,note:'Group of 4+. Fine sand substrate needed.'},
  angelfish:       {name:'Angelfish',        tmin:75,tmax:86,pmin:6.0,pmax:7.4,gmin:0, gmax:15,note:'Tall tank needed. May eat small fish.'},
  discus:          {name:'Discus',           tmin:80,tmax:86,pmin:4.5,pmax:7.0,gmin:1, gmax:8, note:'Expert level. Needs pristine water quality.'},
  ram_cichlid:     {name:'Ram Cichlid',      tmin:81,tmax:86,pmin:4.0,pmax:7.0,gmin:1, gmax:10,note:'Very sensitive to any water quality issues.'},
  african_cichlid: {name:'African Cichlid',  tmin:75,tmax:81,pmin:7.5,pmax:8.5,gmin:12,gmax:25,note:'Alkaline hard water essential.'},
  goldfish:        {name:'Goldfish',         tmin:50,tmax:72,pmin:7.0,pmax:8.0,gmin:6, gmax:16,note:'Cold water, high bioload. Large tank needed.'},
  cherry_shrimp:   {name:'Cherry Shrimp',    tmin:65,tmax:80,pmin:6.2,pmax:8.0,gmin:4, gmax:8, note:'Forgiving. Avoid copper-based medications.'},
  crystal_shrimp:  {name:'Crystal Shrimp',   tmin:62,tmax:72,pmin:5.5,pmax:6.5,gmin:4, gmax:6, note:'Advanced keeper. RO water + remineralizer.'},
  hillstream_loach:{name:'Hillstream Loach', tmin:62,tmax:72,pmin:6.5,pmax:7.5,gmin:4, gmax:8, note:'Needs very high flow and oxygenation.'},
  nerite_snail:    {name:'Nerite Snail',     tmin:72,tmax:82,pmin:6.5,pmax:8.0,gmin:6, gmax:15,note:'Great algae eater. Needs calcium for shell.'},
  mystery_snail:   {name:'Mystery Snail',    tmin:72,tmax:82,pmin:6.5,pmax:8.0,gmin:5, gmax:15,note:'Peaceful. Supplement calcium for shell health.'}
};

// ===== STORAGE =====
function ld() {
  try { return JSON.parse(localStorage.getItem('aq')) || mt(); }
  catch(e) { return mt(); }
}
function sv(d) { localStorage.setItem('aq', JSON.stringify(d)); }
function mt() { return {tanks:[], equip:[], plants:[], stock:[], tasks:[], water:[]}; }
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
  ['equip','plants','stock','tasks','water'].forEach(function(k) {
    d[k] = d[k].filter(function(x) { return x.tank_id !== id; });
  });
  sv(d);
  sat(d.tanks.length ? d.tanks[0].id : '');
}

// ===== EQUIPMENT =====
function add_equip(tid, type, name, brand, notes) {
  var d = ld();
  d.equip.push({id:gid(), tank_id:tid, type:type, name:name, brand:brand||'', notes:notes||''});
  sv(d);
}
function del_equip(id) { var d = ld(); d.equip = d.equip.filter(function(x){return x.id!==id;}); sv(d); }

// ===== PLANTS =====
function add_plant(tid, name, qty, added, notes) {
  var d = ld();
  d.plants.push({id:gid(), tank_id:tid, name:name, qty:parseInt(qty)||1, added_date:added, notes:notes||''});
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

// ===== RECOMMENDATIONS =====
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

// ===== CHART =====
var ch_inst = null;
function draw_chart(tid, param) {
  var entries = get_water(tid);
  if (ch_inst) { ch_inst.destroy(); ch_inst = null; }
  var cv = document.getElementById('wc');
  if (!cv || entries.length < 2) return;
  var lmap = {temp_f:'Temperature (°F)', ammonia:'Ammonia (ppm)', nitrite:'Nitrite (ppm)', nitrate:'Nitrate (ppm)', ph:'pH', gh:'Hardness (GH)'};
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

// ===== DASHBOARD =====
function r_dash() {
  var tid = at(), d = ld(), el = document.getElementById('p-dash');
  var tank = d.tanks.find(function(t){ return t.id === tid; });
  if (!tank) { el.innerHTML = no_tank(); return; }
  var age = Math.max(0, Math.floor((Date.now() - new Date(tank.setup_date + 'T00:00:00').getTime()) / 86400000));
  var tasks = d.tasks.filter(function(x){ return x.tank_id === tid; })
    .sort(function(a,b){ return days_til(a.next_due) - days_til(b.next_due); });
  var nt = tasks.length ? tasks[0] : null;
  var nt_txt = nt ? (esc(nt.name) + ' in ' + days_til(nt.next_due) + 'd') : 'None set';
  var lr = last_r(tid), rng = overlap(tid);
  var h = '<div class="dgrid">';
  h += scard('Tank Size', tank.gallons + ' gal', tank.liters + ' L');
  h += scard('Tank Age', age + ' days', 'since ' + tank.setup_date);
  h += scard('Species', d.stock.filter(function(x){return x.tank_id===tid;}).length + ' added', '');
  h += scard('Next Task', nt_txt, '');
  h += '</div>';
  h += '<div class="card"><div class="ctitle">Last Water Reading';
  if (lr) h += '<small style="font-weight:400;color:var(--muted)"> ' + lr.date + '</small>';
  h += '</div>';
  if (lr) {
    var ps = [
      {k:'temp_f',  l:'Temperature',  u:'°F', mn:rng&&rng.temp.ok?rng.temp.min:null, mx:rng&&rng.temp.ok?rng.temp.max:null, tox:false},
      {k:'ammonia', l:'Ammonia',      u:'ppm',     mn:0,  mx:0,  tox:true},
      {k:'nitrite', l:'Nitrite',      u:'ppm',     mn:0,  mx:0,  tox:true},
      {k:'nitrate', l:'Nitrate',      u:'ppm',     mn:0,  mx:40, tox:false},
      {k:'ph',      l:'pH',           u:'',        mn:rng&&rng.ph.ok?rng.ph.min:null, mx:rng&&rng.ph.ok?rng.ph.max:null, tox:false},
      {k:'gh',      l:'Hardness (GH)',u:'',        mn:rng&&rng.gh.ok?rng.gh.min:null, mx:rng&&rng.gh.ok?rng.gh.max:null, tox:false}
    ];
    h += '<div class="tw"><table><tr><th>Parameter</th><th>Reading</th><th>Safe Range</th><th>Status</th></tr>';
    ps.forEach(function(p) {
      var val = lr[p.k], c = cls_val(val, p.mn, p.mx, p.tox);
      var rng_txt = p.tox ? '0 ppm' : (p.mn !== null && p.mx !== null ? p.mn + '–' + p.mx + ' ' + p.u : '—');
      h += '<tr><td>' + p.l + '</td><td>' + (val !== null ? val + ' ' + p.u : '—') + '</td><td style="color:var(--muted)">' + rng_txt + '</td><td>' + pill(c) + '</td></tr>';
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
function scard(l, v, s) {
  return '<div class="scard"><div class="slbl">' + l + '</div><div class="sval">' + v + '</div>' + (s ? '<div class="ssub">' + s + '</div>' : '') + '</div>';
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
    h += '<div class="tw"><table><tr><th>Type</th><th>Name</th><th>Brand</th><th>Notes</th><th></th></tr>';
    eq.forEach(function(e) {
      h += '<tr><td>' + esc(e.type) + '</td><td>' + esc(e.name) + '</td><td>' + esc(e.brand) + '</td><td>' + esc(e.notes) + '</td>' +
           '<td><button class="btn bd bs" data-id="' + e.id + '" onclick="del_equip(this.dataset.id);r_life()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No equipment added yet.</p>';
  h += '</div>';

  h += '<div class="card"><div class="ctitle">Plants <button class="btn bp bs" onclick="do_add_plant()">+ Add</button></div>';
  if (pl.length) {
    h += '<div class="tw"><table><tr><th>Plant</th><th>Qty</th><th>Added</th><th>Notes</th><th></th></tr>';
    pl.forEach(function(p) {
      h += '<tr><td>' + esc(p.name) + '</td><td>' + p.qty + '</td><td>' + p.added_date + '</td><td>' + esc(p.notes) + '</td>' +
           '<td><button class="btn bd bs" data-id="' + p.id + '" onclick="del_plant(this.dataset.id);r_life()">&#x2715;</button></td></tr>';
    });
    h += '</table></div>';
  } else h += '<p class="emsg">No plants added yet.</p>';
  h += '</div>';

  h += '<div class="card"><div class="ctitle">Livestock <button class="btn bp bs" onclick="do_add_stock()">+ Add</button></div>';
  if (sk.length) {
    h += '<div class="tw"><table><tr><th>Species</th><th>Name</th><th>Qty</th><th>Added</th><th>Notes</th><th></th></tr>';
    sk.forEach(function(s) {
      var sp = SP[s.species_id];
      h += '<tr><td>' + (sp ? sp.name : 'Unknown') + '</td><td>' + esc(s.display_name) + '</td><td>' + s.qty + '</td><td>' + s.added_date + '</td><td>' + esc(s.notes) + '</td>' +
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
    fg('Date', '<input type="date" name="date" value="' + td + '" required>') +
    fg('Temperature (°F)', '<input type="number" name="tf" step="0.1" placeholder="e.g. 76" title="72–82°F for most tropical fish">') +
    fg('Ammonia (ppm)', '<input type="number" name="nh3" step="0.01" placeholder="e.g. 0" title="Safe: 0 ppm. Any reading causes stress.">') +
    fg('Nitrite (ppm)', '<input type="number" name="no2" step="0.01" placeholder="e.g. 0" title="Safe: 0 ppm. Causes brown blood disease.">') +
    '</div><div class="frow">' +
    fg('Nitrate (ppm)', '<input type="number" name="no3" step="0.1" placeholder="e.g. 10" title="Keep below 20 ppm. Do a water change above 40.">') +
    fg('pH', '<input type="number" name="ph" step="0.01" placeholder="e.g. 7.0" title="Most fish: 6.5–7.5. Check species requirements.">') +
    fg('Hardness (GH)', '<input type="number" name="gh" step="0.1" placeholder="e.g. 8" title="Soft: 1–7, Medium: 8–12, Hard: 13+">') +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional notes">') +
    '</div><button type="submit" class="btn bp">Save Reading</button></form></div>';
  var entries = get_water(tid);
  if (entries.length >= 2) {
    h += '<div class="card"><div class="ctitle" style="gap:10px">Trend ' +
      '<select id="cpsel" onchange="draw_chart(at(),this.value)">' +
      '<option value="temp_f">Temperature</option>' +
      '<option value="ammonia">Ammonia</option>' +
      '<option value="nitrite">Nitrite</option>' +
      '<option value="nitrate">Nitrate</option>' +
      '<option value="ph">pH</option>' +
      '<option value="gh">Hardness</option>' +
      '</select></div><div class="chart-wrap"><canvas id="wc"></canvas></div></div>';
  }
  if (entries.length) {
    h += '<div class="card"><div class="ctitle">History</div><div class="tw"><table>' +
      '<tr><th>Date</th><th>Temp °F</th><th>NH₃</th><th>NO₂</th><th>NO₃</th><th>pH</th><th>GH</th><th>Notes</th><th></th></tr>';
    entries.slice().reverse().slice(0, 30).forEach(function(e) {
      h += '<tr><td>' + e.date + '</td><td>' + nv(e.temp_f) + '</td><td>' + nv(e.ammonia) + '</td><td>' + nv(e.nitrite) + '</td><td>' + nv(e.nitrate) + '</td><td>' + nv(e.ph) + '</td><td>' + nv(e.gh) + '</td><td>' + esc(e.notes) + '</td>' +
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
  var h = '<div class="card"><div class="ctitle">Add Maintenance Task</div>' +
    '<form id="mf" onsubmit="sub_task(event)">' +
    '<div class="frow">' +
    fg('Task Type', '<select name="type"><option>Water Change</option><option>Filter Clean</option><option>Gravel Vac</option><option>Glass Wipe</option><option>Fertilizer</option><option>Pruning</option><option>Water Test</option><option>Other</option></select>') +
    fg('Task Name', '<input type="text" name="name" placeholder="e.g. 25% water change" required>') +
    fg('Every (days)', '<input type="number" name="freq" value="7" min="1" required title="How many days between each task">') +
    fg('Last Done', '<input type="date" name="last" value="' + td + '" required>') +
    '</div>' +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '<button type="submit" class="btn bp" style="margin-top:8px">Add Task</button></form></div>';
  var tasks = d.tasks.filter(function(x){return x.tank_id===tid;})
    .map(function(t){ return Object.assign({}, t, {days: days_til(t.next_due)}); })
    .sort(function(a,b){ return a.days - b.days; });
  if (tasks.length) {
    h += '<div class="card"><div class="ctitle">Upcoming Tasks</div><div class="tw"><table>' +
      '<tr><th>Task</th><th>Type</th><th>Due</th><th>Last Done</th><th>Every</th><th></th></tr>';
    tasks.forEach(function(t) {
      var cls = ucls(t.days);
      var due = t.days < 0 ? ('Overdue ' + Math.abs(t.days) + 'd') : t.days === 0 ? 'Today' : ('In ' + t.days + 'd');
      h += '<tr class="trow ' + cls + '"><td><strong>' + esc(t.name) + '</strong>' +
           (t.notes ? '<br><small style="color:var(--muted)">' + esc(t.notes) + '</small>' : '') +
           '</td><td>' + esc(t.type) + '</td><td><strong>' + due + '</strong><br><small style="color:var(--muted)">' + t.next_due + '</small></td><td>' + t.last_done + '</td><td>' + t.freq + 'd</td>' +
           '<td style="white-space:nowrap">' +
           '<button class="btn bp bs" data-id="' + t.id + '" onclick="mark_done(this.dataset.id);r_maint()">Done</button> ' +
           '<button class="btn bd bs" data-id="' + t.id + '" onclick="del_task(this.dataset.id);r_maint()">&#x2715;</button></td></tr>';
    });
    h += '</table></div></div>';
  } else {
    h += '<div class="card"><p class="emsg">No tasks yet. Add one above to track your maintenance schedule.</p></div>';
  }
  el.innerHTML = h;
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
  var sk = d.stock.filter(function(x){return x.tank_id===tid;});
  if (!sk.length) {
    el.innerHTML = '<div class="card"><div class="empty-s"><h2>No Livestock Added</h2>' +
      '<p>Add fish or shrimp in the Equipment &amp; Life tab to see compatibility and parameter recommendations.</p></div></div>';
    return;
  }
  var rng = overlap(tid), lr = last_r(tid);
  var h = '';
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
  h += '<div class="card"><div class="ctitle">Recommended Ranges for This Tank</div>' +
    '<div class="tw"><table><tr><th>Parameter</th><th>Safe Range</th><th>Current Reading</th><th>Status</th></tr>';
  var rp = [
    {l:'Temperature', u:'°F', mn:rng.temp.ok?rng.temp.min:null, mx:rng.temp.ok?rng.temp.max:null, k:'temp_f',  tox:false},
    {l:'Ammonia',     u:'ppm',    mn:0, mx:0,  k:'ammonia', tox:true},
    {l:'Nitrite',     u:'ppm',    mn:0, mx:0,  k:'nitrite', tox:true},
    {l:'Nitrate',     u:'ppm',    mn:0, mx:20, k:'nitrate', tox:false},
    {l:'pH',          u:'',       mn:rng.ph.ok?rng.ph.min:null, mx:rng.ph.ok?rng.ph.max:null, k:'ph', tox:false},
    {l:'Hardness (GH)',u:'',      mn:rng.gh.ok?rng.gh.min:null, mx:rng.gh.ok?rng.gh.max:null, k:'gh', tox:false}
  ];
  rp.forEach(function(p) {
    var cur = lr ? lr[p.k] : null, c = cls_val(cur, p.mn, p.mx, p.tox);
    var rt = p.tox ? '0 ' + p.u : (p.mn !== null && p.mx !== null ? p.mn + '–' + p.mx + (p.u?' '+p.u:'') : '—');
    h += '<tr><td>' + p.l + '</td><td>' + rt + '</td><td>' + (cur !== null ? cur + (p.u?' '+p.u:'') : '—') + '</td><td>' + pill(c) + '</td></tr>';
  });
  h += '</table></div></div>';
  h += '<div class="card"><div class="ctitle">Per-Species Requirements</div>' +
    '<div class="tw"><table><tr><th>Species</th><th>Temp (°F)</th><th>pH</th><th>Hardness (GH)</th><th>Notes</th></tr>';
  rng.sl.forEach(function(sp) {
    h += '<tr><td><strong>' + esc(sp.name) + '</strong></td><td>' + sp.tmin + '–' + sp.tmax + '</td><td>' + sp.pmin + '–' + sp.pmax + '</td><td>' + sp.gmin + '–' + sp.gmax + '</td><td style="font-size:12px;color:var(--muted)">' + esc(sp.note) + '</td></tr>';
  });
  h += '</table></div></div>';
  el.innerHTML = h;
}

// ===== MODALS =====
function om(h) { document.getElementById('mb').innerHTML = h; document.getElementById('ov').classList.add('on'); }
function cm() { document.getElementById('ov').classList.remove('on'); }

function do_add_tank() {
  var td = today_str();
  om('<div class="mtitle">Add Tank</div>' +
    '<form onsubmit="sub_add_tank(event)">' +
    fg('Tank Name', '<input type="text" name="name" placeholder="e.g. Living Room 20G" required>') +
    '<div class="frow">' +
    fg('Gallons', '<input type="number" name="gal" id="mg" step="0.1" placeholder="20" required oninput="this.form.lit.value=Math.round(this.value*3.78541*10)/10">') +
    fg('Litres',  '<input type="number" name="lit" id="ml" step="0.1" placeholder="75.7"       oninput="this.form.gal.value=Math.round(this.value/3.78541*10)/10">') +
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
    fg('Gallons', '<input type="number" name="gal" id="eg" step="0.1" value="' + t.gallons + '" required oninput="this.form.lit.value=Math.round(this.value*3.78541*10)/10">') +
    fg('Litres',  '<input type="number" name="lit" id="el" step="0.1" value="' + t.liters  + '"       oninput="this.form.gal.value=Math.round(this.value/3.78541*10)/10">') +
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

function do_add_equip() {
  om('<div class="mtitle">Add Equipment</div>' +
    '<form onsubmit="sub_add_equip(event)">' +
    '<div class="frow">' +
    fg('Type', '<select name="type"><option>Filter</option><option>Heater</option><option>Light</option><option>CO2 System</option><option>Pump</option><option>Substrate</option><option>Thermometer</option><option>Other</option></select>') +
    fg('Name / Model', '<input type="text" name="name" placeholder="e.g. Fluval 307" required>') +
    '</div><div class="frow">' +
    fg('Brand', '<input type="text" name="brand" placeholder="e.g. Fluval">') +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '</div><div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add</button></div>' +
    '</form>');
}
function sub_add_equip(e) {
  e.preventDefault(); var f = e.target;
  add_equip(at(), f.type.value, f.name.value, f.brand.value, f.notes.value);
  cm(); r_life();
}

function do_add_plant() {
  var td = today_str();
  om('<div class="mtitle">Add Plant</div>' +
    '<form onsubmit="sub_add_plant(event)">' +
    '<div class="frow">' +
    fg('Plant Name', '<input type="text" name="name" placeholder="e.g. Java Fern" required>') +
    fg('Quantity', '<input type="number" name="qty" value="1" min="1">') +
    '</div><div class="frow">' +
    fg('Date Added', '<input type="date" name="added" value="' + td + '">') +
    fg('Notes', '<input type="text" name="notes" placeholder="e.g. Low light plant">') +
    '</div><div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add</button></div>' +
    '</form>');
}
function sub_add_plant(e) {
  e.preventDefault(); var f = e.target;
  add_plant(at(), f.name.value, f.qty.value, f.added.value, f.notes.value);
  cm(); r_life();
}

function do_add_stock() {
  var td = today_str();
  var sopts = Object.keys(SP).sort(function(a,b){ return SP[a].name.localeCompare(SP[b].name); })
    .map(function(k){ return '<option value="' + k + '">' + SP[k].name + '</option>'; }).join('');
  om('<div class="mtitle">Add Livestock</div>' +
    '<form onsubmit="sub_add_stock(event)">' +
    '<div class="frow">' +
    fg('Species', '<select name="sid">' + sopts + '</select>') +
    fg('Display Name', '<input type="text" name="dname" placeholder="Leave blank for species name">') +
    '</div><div class="frow">' +
    fg('Quantity', '<input type="number" name="qty" value="1" min="1">') +
    fg('Date Added', '<input type="date" name="added" value="' + td + '">') +
    '</div>' +
    fg('Notes', '<input type="text" name="notes" placeholder="Optional">') +
    '<div class="mact"><button type="button" class="btn bg" onclick="cm()">Cancel</button><button type="submit" class="btn bp">Add</button></div>' +
    '</form>');
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
