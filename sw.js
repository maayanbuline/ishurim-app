// אישורים ס – שומר רק את קובצי האפליקציה. נתוני GitHub לא נשמרים במטמון, תמיד מהרשת.
const V = "ishurim-app-v4";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())) });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.hostname === "api.github.com") return;   // never cache data
  e.respondWith(fetch(e.request).then(r => {                                  // network first, cache as fallback
    if (r.ok && (u.origin === location.origin || u.hostname === "cdnjs.cloudflare.com")) { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)) }
    return r;
  }).catch(() => caches.match(e.request).then(m => m || caches.match("index.html"))));
});
