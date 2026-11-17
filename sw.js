// Copied from https://github.com/joembedded/ltx_ble_demo
/* BlxDashboard service worker - no external runtime or build tools required. */

const CACHE_PREFIX = 'blxdash-static-';
const CACHE_NAME = `${CACHE_PREFIX}2026-08-28`;

const PRECACHE_URLS = [
    './index.html',
    './manifest.webmanifest',
    './favicon.ico',
    './css/jodash.css',
    './css/qrscanner.css',
    './js/blGraphics.js',
    './js/blStore.js',
    './js/blx.js',
    './js/blxdash.js',
    './js/FileSaver.js',
    './js/intmain_i18n.js',
    './js/jodash.js',
    './js/params.js',
    './js/qrscanner.js',
    './js/xtract_edt.js',
    './static/favicon.ico',
    './static/favicon.svg',
    './static/icons/bootstrap-icons.min.css',
    './static/icons/fonts/bootstrap-icons.woff',
    './static/icons/fonts/bootstrap-icons.woff2',
    './static/preview1024x768.png',
    './static/preview512.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(PRECACHE_URLS);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(cacheNames.map(function (cacheName) {
                    const isOldBlxDashboardCache =
                        cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME;
                    const isWorkboxCacheForThisScope =
                        cacheName.startsWith('workbox-precache') &&
                        cacheName.endsWith(self.registration.scope);

                    if (isOldBlxDashboardCache || isWorkboxCacheForThisScope) {
                        return caches.delete(cacheName);
                    }
                }));
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

function normalizedCacheUrl(requestUrl) {
    const url = new URL(requestUrl);

    for (const parameter of Array.from(url.searchParams.keys())) {
        if (parameter.startsWith('utm_') || parameter === 'fbclid') {
            url.searchParams.delete(parameter);
        }
    }

    return url.href;
}

self.addEventListener('fetch', function (event) {
    const request = event.request;
    const requestUrl = new URL(request.url);

    if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(function () {
                return caches.match(new URL('./index.html', self.registration.scope).href);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(normalizedCacheUrl(request.url)).then(function (cachedResponse) {
            return cachedResponse || fetch(request);
        })
    );
});