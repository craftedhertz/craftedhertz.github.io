(()=>{
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
// scroll reveal + stat count-up
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
  e.target.querySelectorAll('[data-n]').forEach(el=>{const n=+el.dataset.n,s=el.dataset.s;if(RM||!n){el.textContent=n+s;return}let t0;const f=t=>{t0=t0||t;const p=Math.min((t-t0)/1100,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;p<1&&requestAnimationFrame(f)};requestAnimationFrame(f)})}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
// cursor glow (page + cards)
addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')},{passive:true});
document.querySelectorAll('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--cx',e.clientX-r.left+'px');c.style.setProperty('--cy',e.clientY-r.top+'px')}));
// interface tour: x,y,w,h in % of the 779x652 screenshot
const Z=[[2.6,10.4,28.4,30.2,'Output','Dry/wet Mix, external sidechain on/off, Outfall polarity, and the Event Horizon mode (Low / High / Band) with 12 or 24 dB/oct slope.'],
[32.2,10.4,31.6,30.2,'Gravity Well','A live 3D funnel of the engine: Mass and Doppler read-outs show how hard the signal is being pulled and by how many semitones it bends.'],
[64.3,10.4,32.9,30.2,'Event Horizon &amp; delay trace','The analytic filter response shows which band falls into the well; below it, the delay offset (±15 ms) and an ghost curve of the orbit.'],
[2.6,43.9,71.4,25.5,'Physics','Mass, Pull (warp amount), Orbit (rebound time), Event Horizon frequency, Elasticity (bounce) and Gravity Width (stereo drift).'],
[75.2,43.9,22.1,25.5,'Phase Align','Optional kick-to-bass phase correction: Quadrature, Constructive or Custom angle, with Guard protection and a live sum read-out.'],
[2.6,71.3,94.7,25.8,'Signal Tracking','Hit or Follow detection, Manual or Auto-Track frequency, Horizon Follow, Rise Only, sidechain fallback, and the full tracking envelope controls.']];
const hl=document.getElementById('hl'),cap=document.getElementById('cap'),tabs=[...document.querySelectorAll('#tabs button')];let cur=0,auto=!RM,tm;
function show(i){cur=i;const z=Z[i];hl.style.cssText=`left:${z[0]}%;top:${z[1]}%;width:${z[2]}%;height:${z[3]}%;opacity:1`;cap.innerHTML='<b>'+z[4]+'.</b> '+z[5];tabs.forEach((b,k)=>b.classList.toggle('on',k===i))}
tabs.forEach((b,i)=>b.addEventListener('click',()=>{auto=false;show(i)}));show(0);
setInterval(()=>{if(auto&&!document.hidden)show((cur+1)%Z.length)},4200);
// 3D tilt
const fr=document.getElementById('frame');
if(!RM&&matchMedia('(hover:hover)').matches){fr.parentNode.addEventListener('pointermove',e=>{const r=fr.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;fr.style.transform=`rotateY(${x*7}deg) rotateX(${-y*6}deg)`});fr.parentNode.addEventListener('pointerleave',()=>fr.style.transform='')}
// hero: gravity-well canvas; kick pulls rings in, spring rebounds
const cv=document.getElementById('cv'),cx=cv.getContext('2d');let W,H,D,vis=true,x=0,v=0,t0=0,kick=0;
function size(){D=Math.min(devicePixelRatio||1,2);W=cv.width=cv.clientWidth*D;H=cv.height=cv.clientHeight*D}
addEventListener('resize',size);size();new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(cv);
const P=Array.from({length:70},()=>({a:Math.random()*6.283,r:.25+Math.random()*.75,s:.15+Math.random()*.35}));
function draw(t){requestAnimationFrame(draw);if(!vis)return;const dt=Math.min((t-t0)/1000||.016,.05);t0=t;
  if(t-kick>2600){kick=t;v-=9}                                   // "kick": impulse toward the well
  const w=7,z=.28;v+=(-w*w*x-2*z*w*v)*dt;x+=v*dt;                // damped spring = the rebound
  cx.clearRect(0,0,W,H);const ox=W/2,oy=H*.62,R=Math.min(W*.46,H*1.1),K=1+x*.10;
  for(let i=0;i<14;i++){const k=i/13,y=oy-(1-k)*H*.5*(1+x*.05)+ -k*0,rx=R*(1-k*.93)*K,ry=rx*.2;
    cx.beginPath();cx.ellipse(ox,oy-(1-k)*H*.42+0,rx,ry,0,0,6.283);cx.strokeStyle=`rgba(94,200,240,${.05+k*.32})`;cx.lineWidth=D;cx.stroke()}
  for(const p of P){p.a+=p.s*dt*(RM?0:1)*(1+(1-p.r)*2);const k=1-p.r,rx=R*(1-k*.93)*K*p.r/p.r*(p.r),ry=rx*.2;
    const px=ox+Math.cos(p.a)*R*p.r*(1-(1-p.r)*.3)*K*(.2+p.r*.8),py=oy-(1-p.r)*H*.42+Math.sin(p.a)*R*p.r*.2*(.2+p.r*.8)*K;
    cx.fillStyle=`rgba(190,239,255,${.25+p.r*.6})`;cx.beginPath();cx.arc(px,py,(1+p.r*1.6)*D,0,6.283);cx.fill()}
  const g=cx.createRadialGradient(ox,oy,0,ox,oy,R*.5);g.addColorStop(0,`rgba(44,213,255,${.18+Math.abs(x)*.08})`);g.addColorStop(1,'rgba(44,213,255,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H)}
requestAnimationFrame(draw);
})();
