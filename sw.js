const CACHE = "spensa98-v1";

const FILES = [
    "/",
    "/index.html",
    "/style.css",
    "/gallery.js",
    "/manifest.webmanifest"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});