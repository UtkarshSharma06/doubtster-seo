// @ts-nocheck
/**
 * Chalkboard engine. Writes text and draws paths on an SVG board like a teacher would,
 * with a chalk stick that follows the writing point. Imperative on purpose: it drives SVG
 * nodes frame by frame. React components own the host element and call load/play/stop.
 */
export function Chalk(host,capEl){
 var NS='http://www.w3.org/2000/svg',self=this,uid=(Chalk.n=(Chalk.n||0)+1),cn=0,dn=0;
 function S(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e}
 var svg=S('svg',{viewBox:'0 0 800 450',preserveAspectRatio:'xMidYMid meet'});svg.style.cssText='width:100%;height:100%;display:block';
 var defs=S('defs'),flt=S('filter',{id:'chk'+uid,x:'-5%',y:'-5%',width:'110%',height:'110%'});
 flt.appendChild(S('feTurbulence',{type:'fractalNoise',baseFrequency:'.8',numOctaves:'2',seed:'3',result:'n'}));
 flt.appendChild(S('feDisplacementMap',{'in':'SourceGraphic',in2:'n',scale:'2.2'}));defs.appendChild(flt);svg.appendChild(defs);
 var layer=S('g',{filter:'url(#chk'+uid+')'}),fx=S('g'),stick=S('g',{opacity:0});
 stick.appendChild(S('rect',{x:-3.5,y:-30,width:7,height:30,rx:2.5,fill:'#F6F4EA'}));stick.appendChild(S('rect',{x:-3.5,y:-30,width:7,height:6,rx:2.5,fill:'#CFCCBC'}));
 svg.appendChild(layer);svg.appendChild(fx);fx.appendChild(stick);host.appendChild(svg);
 self.paused=false;self.speed=1;self.tok=0;self.beats=[];
 function tween(ms,fn,tok){return new Promise(function(res){var t=0,last=performance.now();(function f(now){if(tok!==self.tok)return res(false);var dt=Math.max(0,Math.min(64,now-last));last=now;if(!self.paused)t+=dt*self.speed;var p=Math.min(1,t/ms);if(fn)fn(p);if(p>=1)res(true);else requestAnimationFrame(f)})(last)})}
 function move(x,y){stick.setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate(24)');stick.setAttribute('opacity',1);
  if(cn++%5==0){var d=S('circle',{cx:x+(Math.random()-.5)*6,cy:y+Math.random()*4,r:1+Math.random()*1.4,fill:'#F3F1E7',opacity:.7});d.style.animation='dust 1s ease-out forwards';fx.insertBefore(d,stick);setTimeout(function(){d.remove()},1000)}}
 function hide(){stick.setAttribute('opacity',0)}
 async function draw(op,tok,fast){
  if(op.k=='wait')return fast?true:tween(op.ms,null,tok);
  if(op.k=='erase'){if(fast){layer.innerHTML='';return true}var ok=await tween(650,function(p){layer.setAttribute('opacity',1-p)},tok);layer.innerHTML='';layer.setAttribute('opacity',1);return ok}
  if(op.k=='text'){var t=S('text',{x:op.x,y:op.y,'font-size':op.s||30,fill:op.c||'#F3F1E7','font-family':'Caveat,cursive','font-weight':600});if(op.a)t.setAttribute('text-anchor',op.a);t.textContent=op.t;layer.appendChild(t);
   if(fast)return true;var bb=t.getBBox(),id='cp'+uid+'_'+(++dn),cp=S('clipPath',{id:id}),r=S('rect',{x:bb.x-4,y:bb.y-4,width:0,height:bb.height+8});cp.appendChild(r);defs.appendChild(cp);t.setAttribute('clip-path','url(#'+id+')');
   var ok2=await tween(Math.max(450,op.t.length*(op.v||58)),function(p){r.setAttribute('width',(bb.width+8)*p);move(bb.x+bb.width*p,bb.y+bb.height*.74+Math.sin(p*38)*2)},tok);t.removeAttribute('clip-path');cp.remove();return ok2}
  if(op.k=='path'){var p=S('path',{d:op.d,fill:op.f||'none',stroke:op.c||'#F3F1E7','stroke-width':op.w||3,'stroke-linecap':'round','stroke-linejoin':'round'});layer.appendChild(p);if(fast)return true;
   var L=p.getTotalLength();p.setAttribute('stroke-dasharray',L);p.setAttribute('stroke-dashoffset',L);if(op.f)p.setAttribute('fill-opacity',0);
   var ok3=await tween(op.ms||Math.max(280,L*3),function(q){p.setAttribute('stroke-dashoffset',L*(1-q));if(op.f)p.setAttribute('fill-opacity',q*.9);var pt=p.getPointAtLength(L*q);move(pt.x,pt.y)},tok);p.removeAttribute('stroke-dasharray');p.removeAttribute('stroke-dashoffset');return ok3}
  return true}
 function est(b){var n=0;b.ops.forEach(function(o){n+=o.k=='text'?Math.max(450,o.t.length*(o.v||58)):o.k=='path'?(o.ms||700):o.k=='wait'?o.ms:300});return Math.max(1800,Math.min(7000,n))}
 function setCap(t,ms,fast){if(!capEl)return;capEl.innerHTML='';if(!t){capEl.style.display='none';return}capEl.style.display='block';var w=t.split(' '),step=Math.min(260,Math.max(50,ms*.85/w.length));
  w.forEach(function(x,i){var s=document.createElement('span');s.textContent=x+' ';if(fast){s.style.animation='none';s.style.opacity=1}else s.style.animationDelay=(i*step)+'ms';capEl.appendChild(s)})}
 self.load=function(b){self.beats=b;b.forEach(function(x){x.ms=est(x)})};
 self.showUpTo=function(i){self.tok++;layer.innerHTML='';layer.setAttribute('opacity',1);hide();for(var k=0;k<i&&k<self.beats.length;k++)self.beats[k].ops.forEach(function(o){draw(o,self.tok,true)});setCap(i>0?self.beats[Math.min(i,self.beats.length)-1].cap:'',0,true)};
 self.playFrom=async function(i,onBeat,onEnd){self.showUpTo(i);var tok=self.tok;setCap('',0);
  for(var k=i;k<self.beats.length;k++){var b=self.beats[k];if(onBeat)onBeat(k);setCap(b.cap,b.ms);
   for(var j=0;j<b.ops.length;j++){var ok=await draw(b.ops[j],tok,false);if(!ok)return}
   hide();if(!(await tween(b.pause||650,null,tok)))return}
  if(onEnd)onEnd()};
 self.hold=function(ms){return tween(ms,null,self.tok)};
 self.erase=async function(){setCap('',0);var ok=await draw({k:'erase'},self.tok,false);return ok};
 self.stop=function(){self.tok++;hide()};
}
function cj(a){return a+(Math.random()-.5)*3}
function cLine(x1,y1,x2,y2){return 'M'+cj(x1).toFixed(1)+' '+cj(y1).toFixed(1)+' Q'+((x1+x2)/2+(Math.random()-.5)*5).toFixed(1)+' '+((y1+y2)/2+(Math.random()-.5)*5).toFixed(1)+' '+cj(x2).toFixed(1)+' '+cj(y2).toFixed(1)}
function cBox(x,y,w,h){return 'M'+cj(x)+' '+cj(y)+' L'+cj(x+w)+' '+cj(y)+' L'+cj(x+w)+' '+cj(y+h)+' L'+cj(x)+' '+cj(y+h)+' L'+cj(x)+' '+cj(y-4)}
function cEll(cx,cy,rx,ry){var d='';for(var i=0;i<=52;i++){var a=-1.9+i/48*Math.PI*2.1,k=1+Math.sin(i*.7)*.012+i*.0015;d+=(i?'L':'M')+(cx+Math.cos(a)*rx*k).toFixed(1)+' '+(cy+Math.sin(a)*ry*k).toFixed(1)}return d}
function cWrap(t,n){var w=t.split(' '),out=[],cur='';w.forEach(function(x){if((cur+' '+x).trim().length>n&&cur){out.push(cur);cur=x}else cur=(cur+' '+x).trim()});if(cur)out.push(cur);return out}
export function carLesson(){
 var Y='#FFE27A',B='#9FD0FF',G='#8CE8A8',W='#F3F1E7',M='#BDBBAE',vals=[30000,25500,21675,18423.75,15660.19,13311.16,11314.49],lab=['30k','25.5k','21.7k','18.4k','15.7k','13.3k','11.3k'];
 var bars=[{k:'path',d:cLine(440,350,786,350),ms:500},{k:'path',d:cLine(440,350,440,128),ms:450,c:M}];
 vals.forEach(function(v,i){var h=190*v/30000,x=452+i*46,y=350-h;bars.push({k:'path',d:cBox(x,y,34,h),f:'rgba(159,208,255,.28)',c:B,w:2.6,ms:380});bars.push({k:'text',t:lab[i],x:x+17,y:y-8,s:17,a:'middle',c:W,v:40});bars.push({k:'text',t:String(i),x:x+17,y:374,s:19,a:'middle',c:M,v:40})});
 bars.push({k:'text',t:'years',x:620,y:402,s:21,a:'middle',c:M});
 return [
  {cap:'A car loses value every year. So what is a $30,000 car worth after 6 years?',ops:[{k:'text',t:'Car depreciation',x:30,y:62,s:48,c:Y},{k:'path',d:cLine(30,74,330,72),c:Y,ms:420}]},
  {cap:'It starts at $30,000 and loses 15% of its value every single year.',ops:[{k:'text',t:'a $30,000 car',x:30,y:126,s:34},{k:'text',t:'loses 15% each year',x:30,y:166,s:34,c:B},{k:'text',t:'worth after 6 years = ?',x:30,y:206,s:34}]},
  {cap:'Here is the rule: multiply by 0.85, once for every year that passes.',ops:[{k:'text',t:'v = p × (1 − r)ⁿ',x:34,y:270,s:40,c:G},{k:'path',d:cBox(20,236,290,48),c:G,w:2.6,ms:700},{k:'text',t:'p = 30,000   r = 0.15   n = 6',x:30,y:320,s:25,c:M}]},
  {cap:'Watch it shrink. Each year we take 15% of a smaller amount, so the drop slows down.',ops:bars,pause:900},
  {cap:'So after 6 years, the car is worth about $11,314.',ops:[{k:'text',t:'30,000 × 0.85⁶',x:30,y:364,s:32},{k:'text',t:'= $11,314.49',x:30,y:406,s:38,c:G},{k:'path',d:cEll(128,394,132,29),c:G,w:2.8,ms:800}],pause:300}]}
export function accelLesson(){var Y='#FFE27A',B='#9FD0FF',G='#8CE8A8';
 return [{cap:'',ops:[{k:'text',t:'a = (v − u) / t',x:60,y:130,s:50,c:B},{k:'text',t:'a = 12 / 6',x:60,y:210,s:50},{k:'text',t:'= 2 m/s²',x:60,y:290,s:54,c:G},{k:'path',d:cEll(190,277,170,40),c:G,w:3,ms:800}]}]}
export function lessonFromScenes(v){
 var T=v.scenes[0].t,st=v.scenes.filter(function(s){return s.k=='s'}),res=v.scenes.filter(function(s){return s.k=='r'})[0],Y='#FFE27A',cols=['#F3F1E7','#9FD0FF','#FFE27A','#BFEAD0'];
 var beats=[{cap:'Let\'s work through this: '+T+'.',ops:[{k:'text',t:T.length>30?T.slice(0,29)+'…':T,x:30,y:62,s:46,c:Y},{k:'path',d:cLine(30,74,Math.min(760,60+Math.min(T.length,30)*17),72),c:Y,ms:420}]}],y=124;
 st.forEach(function(s,i){var ls=cWrap((i+1)+'. '+s.t,46),need=ls.length*38+14,ops=[];
  if(y+need>388){ops.push({k:'erase'});y=64}
  ls.forEach(function(l,j){ops.push({k:'text',t:l,x:j?52:30,y:y+j*38,s:29,c:cols[i%4]})});y+=need;beats.push({cap:s.t,ops:ops})});
 if(res){var ls2=cWrap(res.t,40),ops2=[],need2=ls2.length*40+30;if(y+need2>400){ops2.push({k:'erase'});y=90}
  ls2.forEach(function(l,j){ops2.push({k:'text',t:l,x:36,y:y+j*40,s:32,c:'#8CE8A8'})});ops2.push({k:'path',d:cBox(22,y-32,Math.min(756,ls2.reduce(function(a,l){return Math.max(a,l.length)},0)*13+40),ls2.length*40+16),c:'#8CE8A8',w:2.8,ms:700});beats.push({cap:res.t,ops:ops2})}
 return beats}

