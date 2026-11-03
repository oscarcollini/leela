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
 function create({eventWindow=root,now=()=>Date.now(),screenAngle=()=>Number(eventWindow.screen?.orientation?.angle??eventWindow.orientation??0),onChange=()=>{}}={}){
  let latest=null,reference=null,active=false,generation=0,timer=null,permission='unknown',startedAt=0;
  const fresh=()=>latest&&now()-latest.time<=1500?latest:null;
  const notify=()=>onChange(state());
  const receive=e=>{const g=gravity(e.beta,e.gamma);if(!active||!g)return;latest={gravity:g,screenAngle:screenAngle(),time:now()};notify()};
  function state(){
   const current=fresh();
   if(!active)return {kind:'inactive',hasReference:!!reference};
   if(permission==='denied')return {kind:'denied'};
   if(permission==='unsupported')return {kind:'unavailable'};
   if(!current)return {kind:now()-startedAt>2500?'unavailable':'waiting'};
   if(!reference)return {kind:'ready'};
   return compare(current,reference);
  }
  function stop(){generation++;active=false;latest=null;clearInterval(timer);timer=null;eventWindow.removeEventListener('deviceorientation',receive);notify()}
  async function start(){
   if(active)return;
   active=true;latest=null;startedAt=now();const request=++generation;notify();
   const api=eventWindow.DeviceOrientationEvent;
   if(!eventWindow.isSecureContext||!api){permission='unsupported';notify();return}
   if(permission!=='granted'&&permission!=='denied'){
    try{permission=typeof api.requestPermission==='function'?await api.requestPermission():'granted'}catch{permission='denied'}
   }
   if(request!==generation||!active)return;
   if(permission!=='granted'){notify();return}
   eventWindow.addEventListener('deviceorientation',receive);
   timer=setInterval(notify,400);notify();
  }
  function capture(fromCamera){const reading=fromCamera&&active?fresh():null;reference=reading?{gravity:reading.gravity.slice(),screenAngle:reading.screenAngle}:null;notify();return !!reference}
  function reset(){reference=null;notify()}
  return {start,stop,capture,reset,state,hasReference:()=>!!reference};
 }
 root.LeelaLevel={gravity,compare,create};
})(typeof window!=='undefined'?window:globalThis);
