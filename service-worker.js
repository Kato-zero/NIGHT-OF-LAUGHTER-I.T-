const CACHE_NAME = "nol-system-v1";

const FILES = [
  "./",
  "./index.html",
  "./events.html",
  "./ticket-generator.html",
  "./ticket-scanner.html",
  "./manifest.json"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>{
      return Promise.all(
        keys.map(k=>{
          if(k!==CACHE_NAME){
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e)=>{
  e.respondWith(
    caches.match(e.request).then(res=>{
      return res || fetch(e.request).catch(()=>{
        return caches.match("./index.html");
      });
    })
  );
});
