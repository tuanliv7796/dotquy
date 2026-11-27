const BASE = new URL(self.registration.scope).pathname;
const CACHE_PREFIX = `dotquy115:${BASE}:`;
const CACHE_NAME = `${CACHE_PREFIX}v4`;
const CORE_ROUTES = [
  '/',
  '/so-cuu/',
  '/kiem-tra/',
  '/tra-cuu/',
  '/benh-vien/',
  '/ho-so/',
  '/data/search-index.json',
  '/favicon.svg',
].map((route) => BASE + route.slice(1));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ROUTES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  // Never cache OTA manifest so checks are always fresh
  if (url.pathname.startsWith(BASE + 'ota/')) return;

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkRes;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match(BASE)))
  );
});
