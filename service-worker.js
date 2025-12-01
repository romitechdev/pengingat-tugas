// service-worker.js - IMPROVED FOR MOBILE NOTIFICATIONS
const CACHE_NAME = 'daily-remind-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {
      title: 'Daily Remind',
      body: 'Pengingat tugas'
    };
  }

  const options = {
    body: data.body || 'Pengingat tugas',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'daily-remind',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: 'Buka Aplikasi'
      },
      {
        action: 'close',
        title: 'Tutup'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Daily Remind', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      self.clients.matchAll({ 
        type: 'window',
        includeUncontrolled: true 
      }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
    );
  }
});