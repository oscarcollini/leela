/* Relative gravity level. No compass/heading measurement. */
'use strict';
(function(root){
 const RAD=Math.PI/180,DEG=180/Math.PI;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function gravity(beta,gamma){
  if(!Number.isFinite(beta)||!Number.isFinite(gamma)||Math.abs(beta)>180||Math.abs(gamma)>90)return null;
  const b=beta*RAD,g=gamma*RAD;return [-Math.cos(b)*Math.sin(g),Math.sin(b),Math.cos(b)*Math.cos(g)];
 }
 const wrap=d=>((d+180)%360+360)%360-180;
 function compare(current,reference){
  if(!current||!reference)return null;
  const a=current.gravity,b=reference.gravity;
  if(current.screenAngle!==reference.screenAngle)return {kind:'rotation'};
  if(Math.abs(a[2])>.985||Math.abs(b[2])>.985)return {kind:'flat'};
  const roll=wrap((Math.atan2(a[0],a[1])-Math.atan2(b[0],b[1]))*DEG);
  const pitch=(Math.asin(clamp(a[2],-1,1))-Math.asin(clamp(b[2],-1,1)))*DEG;
  return {kind:'reading',roll,pitch,matched:Math.abs(roll)<=2&&Math.abs(pitch)<=2};
 }
 function acceleration(x,y,z){
  if(![x,y,z].every(Number.isFinite))return null;
  const length=Math.hypot(x,y,z);if(length<6||length>14)return null;
  return [x/length,y/length,z/length];
 }
 function create({eventWindow=root,now=()=>Date.now(),screenAngle=()=>Number(eventWindow.screen?.orientation?.angle??eventWindow.orientation??0),onChange=()=>{}}={}){
  let readings={},reference=null,active=false,generation=0,timer=null,fallbackTimer=null,sensor=null,startedAt=0;
  let permission={orientation:'unknown',motion:'unknown',accelerometer:'unknown'};
  const selected=()=>reference?readings[reference.source]:(readings.orientation||readings.motion||readings.accelerometer);
  const notify=()=>onChange(state());
  function store(source,g){
   if(!active)return;
   if(!g){delete readings[source];notify();return}
   if(source!=='orientation'&&readings[source]){
    const old=readings[source].gravity;
    g=g.map((v,i)=>old[i]*.7+v*.3);const norm=Math.hypot(...g);g=g.map(v=>v/norm);
   }
   readings[source]={gravity:g,screenAngle:screenAngle(),time:now(),source};notify();
  }
  const orientation=e=>store('orientation',gravity(e.beta,e.gamma));
  const motion=e=>{const a=e.accelerationIncludingGravity;store('motion',a?acceleration(a.x,a.y,a.z):null)};
  function state(){
   if(!active)return {kind:'inactive',hasReference:!!reference};
   const current=selected();
   if(current){if(!reference)return {kind:'ready',source:current.source};return {...compare(current,reference),source:current.source}}
   const values=Object.values(permission);
   if(values.every(v=>v==='unsupported'))return {kind:'unavailable'};
   if(values.every(v=>v==='denied'||v==='unsupported')&&values.includes('denied'))return {kind:'denied'};
   return {kind:now()-startedAt>6000?'unavailable':'waiting'};
  }
  function stop(){
   generation++;active=false;readings={};clearInterval(timer);clearTimeout(fallbackTimer);timer=null;fallbackTimer=null;
   eventWindow.removeEventListener('deviceorientation',orientation);eventWindow.removeEventListener('devicemotion',motion);
   if(sensor){try{sensor.stop()}catch{}sensor=null}notify();
  }
  function startAccelerometer(request){
   if(!active||request!==generation||selected()||typeof eventWindow.Accelerometer!=='function')return;
   try{
    sensor=new eventWindow.Accelerometer({frequency:20});
    sensor.addEventListener('reading',()=>{if(active&&request===generation&&sensor)store('accelerometer',acceleration(sensor.x,sensor.y,sensor.z))});
    sensor.addEventListener('error',e=>{if(request!==generation)return;delete readings.accelerometer;permission.accelerometer=e.error?.name==='NotAllowedError'?'denied':'unsupported';notify()});
    sensor.start();permission.accelerometer='granted';
   }catch(e){permission.accelerometer=e.name==='NotAllowedError'?'denied':'unsupported';notify()}
  }
  async function start(){
   if(active)return;
   active=true;readings={};startedAt=now();const request=++generation;
   if(!eventWindow.isSecureContext){permission={orientation:'unsupported',motion:'unsupported',accelerometer:'unsupported'};notify();return}
   // Invoke both permission methods during the opening click, before awaiting either.
   async function attach(key,api,event,handler){
    if(!api){permission[key]='unsupported';return}
    let value=permission[key];
    if(value!=='granted'&&value!=='denied'){
     try{value=typeof api.requestPermission==='function'?await api.requestPermission():'granted'}catch{value='denied'}
    }
    if(request!==generation||!active)return;
    permission[key]=value;
    if(value==='granted')eventWindow.addEventListener(event,handler);
   }
   permission.accelerometer=typeof eventWindow.Accelerometer==='function'?'unknown':'unsupported';
   const tasks=[attach('orientation',eventWindow.DeviceOrientationEvent,'deviceorientation',orientation),attach('motion',eventWindow.DeviceMotionEvent,'devicemotion',motion)];
   timer=setInterval(notify,400);
   fallbackTimer=setTimeout(()=>startAccelerometer(request),800);
   notify();await Promise.all(tasks);
   if(active&&request===generation)notify();
  }
  function capture(fromCamera){const reading=fromCamera&&active?selected():null;reference=reading?{gravity:reading.gravity.slice(),screenAngle:reading.screenAngle,source:reading.source}:null;notify();return !!reference}
  function reset(){reference=null;notify()}
  return {start,stop,capture,reset,state,hasReference:()=>!!reference};
 }
 root.LeelaLevel={gravity,acceleration,compare,create};
})(typeof window!=='undefined'?window:globalThis);
