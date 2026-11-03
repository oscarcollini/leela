/* Small, dependency-free GIF89a encoder for a two-frame photo alternation.
   Fixed shared RGB332 palette. Clear LZW dictionary every 200 literal codes;
   this keeps 9-bit codes throughout, trading compression for bounded memory.
   Format reference: https://www.w3.org/Graphics/GIF/spec-gif89a.txt */
'use strict';
(function(root){
 function encode(frames,intervalMs){
  if(!Array.isArray(frames)||frames.length!==2)throw new Error('Servono due fotogrammi');
  const {width:w,height:h}=frames[0];
  if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>720||h>720)throw new Error('Dimensioni non valide');
  if(!Number.isFinite(intervalMs)||intervalMs<20||intervalMs>655350)throw new Error('Intervallo non valido');
  for(const f of frames)if(f.width!==w||f.height!==h||f.data.length!==w*h*4)throw new Error('Fotogrammi non coerenti');
  const parts=[];
  const bytes=a=>parts.push(Uint8Array.from(a));
  const word=v=>[v&255,(v>>8)&255];
  bytes([71,73,70,56,57,97,...word(w),...word(h),0xf7,0,0]);
  const palette=new Uint8Array(768);
  for(let i=0;i<256;i++){palette[i*3]=Math.round((i>>5)*255/7);palette[i*3+1]=Math.round(((i>>2)&7)*255/7);palette[i*3+2]=(i&3)*85}
  parts.push(palette);
  bytes([0x21,0xff,11,...Array.from('NETSCAPE2.0',c=>c.charCodeAt(0)),3,1,0,0,0]);
  const delay=Math.round(intervalMs/10);
  for(const frame of frames){
   bytes([0x21,0xf9,4,4,...word(delay),0,0]);
   bytes([0x2c,0,0,0,0,...word(w),...word(h),0,8]);
   const pixels=w*h,codeCount=pixels+Math.ceil(pixels/200)+1;
   const data=new Uint8Array(Math.ceil(codeCount*9/8));let offset=0,acc=0,bits=0;
   const code=v=>{acc|=v<<bits;bits+=9;while(bits>=8){data[offset++]=acc&255;acc>>>=8;bits-=8}};
   for(let i=0;i<pixels;i++){
    if(i%200===0)code(256);
    const p=i*4,a=frame.data[p+3]/255;
    const r=frame.data[p]*a+255*(1-a),g=frame.data[p+1]*a+255*(1-a),b=frame.data[p+2]*a+255*(1-a);
    code((Math.round(r*7/255)<<5)|(Math.round(g*7/255)<<2)|Math.round(b*3/255));
   }
   code(257);if(bits)data[offset++]=acc&255;
   for(let p=0;p<offset;p+=255){const length=Math.min(255,offset-p);bytes([length]);parts.push(data.subarray(p,p+length))}bytes([0]);
  }
  bytes([0x3b]);
  const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const part of parts){out.set(part,offset);offset+=part.length}return out;
 }
 root.LeelaGIF={encode};
})(typeof globalThis!=='undefined'?globalThis:this);
