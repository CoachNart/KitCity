const CACHE='kitcity-shell-v3';
const CORE=['/manifest.webmanifest','/icon-192.svg','/icon-512.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;

  // Never cache Next.js chunks, JavaScript, CSS, or navigation HTML. Caching
  // these across deployments can keep an old game engine running after release.
  if(req.mode==='navigate'||url.pathname.startsWith('/_next/')||/\\.(?:js|mjs|css|map)$/.test(url.pathname)){
    event.respondWith(fetch(req));
    return;
  }

  if(!CORE.includes(url.pathname))return;
  event.respondWith(
    fetch(req).then(res=>{
      if(res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone()));
      return res;
    }).catch(()=>caches.match(req))
  );
});
