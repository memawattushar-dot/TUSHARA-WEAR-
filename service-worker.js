const CACHE_NAME = 'tushara-wear-cache-v1';

// यहां उन सभी मुख्य फाइलों की लिस्ट है जिन्हें हम कैश करना चाहते हैं
const urlsToCache = [
  '/TUSHARA-WEAR/',
  '/TUSHARA-WEAR/index.html',
  '/TUSHARA-WEAR/style.css', // आपकी CSS फ़ाइल का नाम (अगर है)
  '/TUSHARA-WEAR/script.js', // आपकी JavaScript फ़ाइल का नाम (अगर है)
  '/TUSHARA-WEAR/icons/icon-192x192.png',
  '/TUSHARA-WEAR/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
    
