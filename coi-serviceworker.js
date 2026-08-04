if (typeof self === 'undefined' || !self.addEventListener) throw new Error('Not a service worker');
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(response) {
        var headers = new Headers(response.headers);
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        /* credentialless = SharedArrayBuffer aktif TANPA blokir resource eksternal */
        headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }).catch(function(err) {
        return new Response('COI SW error: ' + err.message, { status: 500 });
      })
    );
  } else {
    e.respondWith(fetch(e.request));
  }
});
