const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/script.js',
  '/index.html',
  '/style.css',
  '/service-worker.js',
  'app_icon.png',
  'manifest.json',
  'app_icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});