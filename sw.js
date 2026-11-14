// Jobthink – service worker (installation + notifications push)
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});

self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'Jobthink',{
    body:d.body||'Tu as un nouveau message.',
    icon:'icon-192.png',
    badge:'icon-192.png',
    tag:'jobthink-message',
    renotify:true,
    data:{url:d.url||'./'}
  }));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=new URL((e.notification.data&&e.notification.data.url)||'./',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if(c.url.startsWith(self.registration.scope)&&'focus' in c)return c.focus()}
    return self.clients.openWindow(url);
  }));
});
