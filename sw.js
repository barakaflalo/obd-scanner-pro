/* ── AppNest · Cloudflare Pages fix (Oct 2026) ──
Cloudflare redirects *.html to clean URLs (/index.html -> /). Chrome refuses a
"redirected" response that a Service Worker hands to a page load (ERR_FAILED).
This strips the redirect flag from every response the SW fetches or reads from cache. */
(function(){
var NB={101:1,204:1,205:1,304:1};
function clean(r){
if(!r||!r.redirected||NB[r.status])return r;
return r.blob().then(function(b){return new Response(b,{status:r.status,statusText:r.statusText,headers:r.headers});});
}
var _fetch=self.fetch.bind(self);
self.fetch=function(input,init){
if(input&&typeof input==='object'&&input.mode==='navigate')input=input.url;
return _fetch(input,init).then(clean);
};
var cm=Cache.prototype.match;
Cache.prototype.match=function(){return cm.apply(this,arguments).then(clean);};
var sm=CacheStorage.prototype.match;
CacheStorage.prototype.match=function(){return sm.apply(this,arguments).then(clean);};
})();

/* ── OBD Scanner Pro service worker ──
   Page (navigation): network first (4s), cache as offline fallback → new uploads always win when online.
   Files in assets/ have a content hash in their name → cache first.
   VERSION goes up with every release (same number as APP_VERSION and manifest). */
const VERSION = '2.11.0';
const CACHE = 'obdscanner-' + VERSION;
const PRECACHE = ["./","./manifest.json","./privacy_policy.html","./icon.svg","./icon-192.png","./icon-512.png","./assets/B0-5-UaaWMI.js","./assets/C0-kDUAU7r3.js","./assets/P0_0-CVYWrsie.js","./assets/P0_1-DmNhgWq8.js","./assets/P0_2-DhN3KPZU.js","./assets/P0_3-DLCwXLpl.js","./assets/P2_0-C-KCHNAl.js","./assets/P2_1-Cyn8nVu2.js","./assets/P2_2-BaNd7ZyH.js","./assets/P2_3-COFf8_8b.js","./assets/P3-DCKZctWp.js","./assets/U0-Btihosjr.js","./assets/U3-Bjkceb-7.js","./assets/byd-DuOehISa.js","./assets/ford-Y1u8dEJe.js","./assets/gm-BLOggyLg.js","./assets/hk-Cuym1oez.js","./assets/honda-xsu4xTqj.js","./assets/index-CItUBVfy.js","./assets/jlr-bgPMPjGr.js","./assets/makers-DP8yljvf.js","./assets/mazda-BH0Idr8f.js","./assets/mg-BukNY_ZX.js","./assets/mitsubishi-UQXfBWvr.js","./assets/nissan-Dfz73smV.js","./assets/pdf.min-N4RGOxZg.js","./assets/pdf.worker.min-GtxnNB1h.js","./assets/pdf.worker.min-yatZIOMy.js","./assets/renault-DUNvcpjV.js","./assets/stellantis-DCjSJqEq.js","./assets/subaru-D1aw-Rc4.js","./assets/toyota-ChU5QG1F.js","./assets/vag-BGGeG8TG.js","./assets/volvo-BLywGWgQ.js"];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(PRECACHE.map(u => c.add(new Request(u, {cache: 'reload'})).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith('obdscanner-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function timeout(ms){ return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)); }

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // YouTube, Google, wa.me — not ours
  if (url.pathname.includes('/api/')) return;      // live data (plate lookup) — never cached here

  if (req.mode === 'navigate') {
    // only the app page itself is stored as the offline shell ("./"); other pages are cached under their own URL
    const scopePath = new URL(self.registration.scope).pathname;
    const isShell = url.pathname === scopePath || url.pathname === scopePath + 'index.html';
    const key = isShell ? './' : req;
    e.respondWith((async () => {
      try {
        const res = await Promise.race([fetch(req), timeout(4000)]);
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {}); }
        return res;
      } catch (err) {
        const cached = (!isShell && await caches.match(url.pathname.replace(/\.html$/, '') + '.html', {ignoreSearch: true})) || await caches.match(key, {ignoreSearch: true}) || await caches.match('./', {ignoreSearch: true});
        if (cached) return cached;
        try { return await fetch(req); } catch (e2) {
          return new Response('<!DOCTYPE html><meta charset="utf-8"><body style="background:#0F172A;color:#F59E0B;font-family:Arial;text-align:center;padding:40px" dir="rtl"><h2>🔧 OBD Scanner Pro</h2><p>אין חיבור לאינטרנט, והאפליקציה עוד לא נשמרה במכשיר.<br>פתחו אותה פעם אחת עם אינטרנט.</p></body>', {headers: {'Content-Type': 'text/html; charset=utf-8'}});
        }
      }
    })());
    return;
  }

  // static files: cache first, then network (and keep a copy)
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    }))
  );
});
