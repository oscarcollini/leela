'use strict';
const VERSION='0.4.9';
const CACHE='leela-'+VERSION;
const BASE=new URL('./',self.location.href);
const FILES=['./','./pwa.js','./gif-encoder.js','./level.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png'];
const URLS=FILES.map(p=>new URL(p,BASE).href);
async function verifiedFetch(url){
  const r=await fetch(new Request(url,{cache:'reload',credentials:'same-origin'}));
  if(!r.ok||r.redirected||r.type==='opaque')throw new Error('Risorsa non disponibile: '+url);
  const path=new URL(url).pathname;
  if(path===BASE.pathname){
    if(!r.headers.get('content-type')?.includes('text/html')||!(await r.clone().text()).includes('data-app="leela"'))throw new Error('La risposta non è l’app');
  }else if(path.endsWith('.png')){
    if(!r.headers.get('content-type')?.includes('image/png'))throw new Error('Icona non disponibile');
  }else if(path.endsWith('.js')){
    if(!/javascript/.test(r.headers.get('content-type')||''))throw new Error('Script non disponibile');
  }else if(path.endsWith('.webmanifest')){
    if((await r.clone().json()).short_name!=='leela')throw new Error('Manifest non disponibile');
  }
  return r;
}
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const responses=await Promise.all(URLS.map(verifiedFetch));
    const cache=await caches.open(CACHE);
    await Promise.all(URLS.map((url,i)=>cache.put(url,responses[i])));
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    for(const name of await caches.keys())if(name.startsWith('leela-')&&name!==CACHE)await caches.delete(name);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==BASE.origin)return;
  const appNavigation=event.request.mode==='navigate'&&(url.pathname===BASE.pathname||url.pathname===BASE.pathname+'index.html');
  const key=appNavigation?BASE.href:event.request.url;
  if(!appNavigation&&!URLS.includes(key))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(appNavigation){
      try{
        const fresh=await verifiedFetch(key);
        await cache.put(key,fresh.clone()).catch(()=>{});
        return fresh;
      }catch(error){
        const cached=await cache.match(key);
        if(cached)return cached;
        throw error;
      }
    }
    const cached=await cache.match(key);
    if(cached)return cached;
    return verifiedFetch(key);
  })());
});
self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
  if(event.data?.type==='OFFLINE_STATUS')event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const ready=(await Promise.all(URLS.map(u=>cache.match(u)))).every(Boolean);
    event.ports[0]?.postMessage({ready,version:VERSION});
  })());
});
