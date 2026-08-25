self.addEventListener('push', function(event) {
  let data = {};
  try {
    if (event.data) {
      try { data = event.data.json(); } catch (e) { data = { title: event.data.text(), body: '' }; }
    }
  } catch (e) { data = {}; }
  const title = data.title || data.notification?.title || 'KojoScope';
  const body = data.body || data.notification?.body || '';
  const options = {
    body: body,
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    vibrate: [],
    silent: true,
    quiet: true,
    requireInteraction: false,
    tag: data.tag || 'kojo-quiet',
    data: data
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

self.addEventListener('notificationclose', function(event) {
  // quiet, no action
});
