// Service worker: guarda la app en caché para que funcione sin conexión una vez instalada.
// Estrategia: responde desde la caché y actualiza en segundo plano (los cambios se ven
// en la siguiente apertura). Si cambias la lista de archivos, sube la versión.
var CACHE = 'dbexam-v1';
var ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/styles.css',
  'js/app.js',
  'js/data/foundation.js',
  'js/data/design.js',
  'js/data/programming.js',
  'js/data/exam071.js',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (claves) {
    return Promise.all(claves.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (enCache) {
      var red = fetch(e.request).then(function (r) {
        if (r && r.ok) c.put(e.request, r.clone());
        return r;
      }).catch(function () { return enCache; });
      return enCache || red;
    });
  }));
});
