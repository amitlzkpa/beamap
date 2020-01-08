// CACHE
const staticCacheName = 'site-static-v1';
const assets = [
  // "",
  // "",
  "/beamap-192x192.png",
  "/beamap-512x512.png",
  "/FileSaver.js",
  "https://code.jquery.com/jquery-3.4.1.min.js",
  // "https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.js",
  // "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.min.js",
  "https://use.fontawesome.com/releases/v5.0.13/js/solid.js",
  "https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js",
];
// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});
// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});