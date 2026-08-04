if (typeof self === 'undefined' || !self.addEventListener) throw new Error('Not a service worker');
self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(response) {
        var headers = new Headers(response.headers);
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }).catch(function(err) {
        return new Response('COI SW error: ' + err.message, { status: 500 });
      })
    );
  } else if (e.request.mode === 'no-cors' && e.request.method === 'GET') {
    e.respondWith(
      fetch(e.request, { mode: 'cors' }).catch(function() {
        return fetch(e.request);
      })
    );
  } else {
    e.respondWith(fetch(e.request));
  }
});
