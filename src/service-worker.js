const CACHE_NAME = 'smartchit-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add more static assets as needed
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Placeholder for offline entry sync logic
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-entries') {
    event.waitUntil(syncOfflineEntries());
  }
});

async function syncOfflineEntries() {
  // TODO: Implement logic to read offline entries from IndexedDB/localStorage and sync with backend
  // This is a placeholder for real implementation
  console.log('Syncing offline entries...');
} 