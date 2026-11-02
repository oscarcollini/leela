'use strict';
(()=>{
  const status=document.getElementById('pwaStatus'),button=document.getElementById('installBtn');
  let installEvent=null,reloadRequested=false;
  const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const say=t=>status.textContent=t;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;if(!standalone())button.hidden=false});
  window.addEventListener('appinstalled',()=>{installEvent=null;button.hidden=true;say('App installata. Attendi la conferma “Pronta per l’uso offline” prima di togliere la connessione.');checkReady()});
  button.onclick=async()=>{
    if(!installEvent)return;
    const e=installEvent;installEvent=null;button.hidden=true;
    try{await e.prompt();await e.userChoice}catch{say('Usa il menu di Chrome → Aggiungi a schermata Home → Installa.')}
  };
  let registration=null;
  async function checkReady(){
    const worker=registration?.active;
    if(!worker)return;
    const c=new MessageChannel();
    c.port1.onmessage=e=>{
      c.port1.close();
      if(e.data.ready)say('Pronta per l’uso offline · '+e.data.version+(standalone()?'':' · Per installarla usa il menu di Chrome → Aggiungi a schermata Home → Installa.'));
    };
    worker.postMessage({type:'OFFLINE_STATUS'},[c.port2]);
  }
  if(location.protocol==='file:'||!window.isSecureContext||!('serviceWorker' in navigator)){
    say('Per installare la PWA e preparare l’uso offline, apri il collegamento HTTPS in Chrome. Aprire il file HTML non installa la PWA.');return;
  }
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloadRequested)location.reload();else checkReady()});
  window.addEventListener('load',async()=>{
    try{
      registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      const update=()=>{
        if(!registration.waiting)return;
        let b=document.getElementById('updatePwa');
        if(!b){b=document.createElement('button');b.id='updatePwa';b.className='btn secondary small';b.textContent='Aggiorna app';status.before(b)}
        b.onclick=()=>{
          if(!confirm('L’aggiornamento ricarica l’app e cancella gli scatti non salvati. Hai già salvato il risultato?'))return;
          reloadRequested=true;registration.waiting.postMessage({type:'SKIP_WAITING'});
        };
      };
      registration.addEventListener('updatefound',()=>{
        const worker=registration.installing;
        worker?.addEventListener('statechange',()=>{
          if(worker.state==='activated')checkReady();
          if(worker.state==='installed')update();
          if(worker.state==='redundant'&&!registration.active)say('Preparazione offline non riuscita. Mantieni la connessione e ricarica la pagina.');
        });
      });
      update();await navigator.serviceWorker.ready;checkReady();
    }catch{say('Uso offline non ancora disponibile. Mantieni la connessione e riapri la pagina HTTPS in Chrome.')}
  });
})();
