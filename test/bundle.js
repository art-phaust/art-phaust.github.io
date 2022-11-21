(()=>{"use strict";const t=new class{constructor(){this.useA=!1;let t=function(t){let e=parseInt(t.substr(0,8),16),n=parseInt(t.substr(8,8),16),o=parseInt(t.substr(16,8),16),r=parseInt(t.substr(24,8),16);return function(){e|=0,n|=0,o|=0,r|=0;let t=(e+n|0)+r|0;return r=r+1|0,e=n^n>>>9,n=o+(o<<3)|0,o=o<<21|o>>>11,o=o+t|0,(t>>>0)/4294967296}};this.prngA=new t(tokenData.hash.substr(2,32)),this.prngB=new t(tokenData.hash.substr(34,32));for(let t=0;t<1e6;t+=2)this.prngA(),this.prngB()}random_dec(){return this.useA=!this.useA,this.useA?this.prngA():this.prngB()}};function e(){return t.random_dec()}function n(t,n){return t+e()*(n-t)}function o(t){return t[Math.floor(e()*t.length)]}function r(t){let n=0;const o=e(),r=t.reduce(((t,[e,n])=>t+n),0);return(t.map((([t,e])=>(n+=1*e/r??1,[t,e,n]))).find((([t,e,n])=>o<n))??t[t.length-1])[0]}function a(t){for(let n=t.length-1;n>0;n--){const o=Math.floor(e()*(n+1));[t[n],t[o]]=[t[o],t[n]]}return t}let i,l=!1;const s=(t,n)=>{var o,r,a,s;if(l)o=i,l=!1;else{do{s=(r=e()-1)*r+(a=e()-1)*a}while(s>=1);o=r*(s=Math.sqrt(-2*Math.log(s)/s)),i=a*s,l=!0}return o*(n||1)+(t||0)};function c(t,e=0,n=0){return{tG:t.tG.map((([t,o])=>[t+e,o+n]))}}function d(t){t.tG=t.tG.map((([t,e])=>[t,1-e])).reverse()}function h(t,e,n,o){return t.map((t=>({...t,...o,layerHeight:t.noLayerHeight?void 0:1,tG:t.tG.map((([t,e])=>({y:n?1-t:t,x:e}))),isInverted:e})))}const u=[[-.12,.1],[-.06,.2],[0,.4],[.06,.2],[.12,.1]],f=[[-.15,.1],[-.075,.2],[0,.4],[.075,.2],[.15,.1]],g=[[-.225,.2],[-.15,.2],[-.075,.2],[0,.2],[.075,.2]],m=[[-.2,.2],[-.1,.2],[0,.2],[.1,.2],[.2,.2]],y=[[-.18,.2],[-.12,.2],[-.06,.2],[0,.2],[.06,.2]],p=[[-.12,.2],[-.06,.2],[0,.2],[.06,.2],[.12,.2]],w=[[-.24,.2],[-.18,.2],[-.12,.15],[-.06,.15],[0,.15],[.06,.1],[.12,.05]],M=[[-.15,.2],[-.075,.2],[0,.2],[.075,.2],[.15,.2]],G=[[-.12,.1],[-.06,.2],[0,.4],[.06,.2],[.12,.1]],x=[[-.12,.2],[-.09,.2],[-.06,.2],[-.03,.2],[0,.2]],b=[[0,.25],[.05,.25],[.1,.25],[.15,.25]],D=[[{code:"A",getLayers:(t,e,n,o,r,a)=>{const i={td:20,tm:.02,dd:100,dm:.0075};let l=!1,s=!1;e()>=.65&&(e()<.5?l=!0:s=!0);const g=o(u),m=o(u),y=o(f),p=o(f);let w=.75;!l&&s&&(w=.4),l&&s&&(w=.6),w+=g+m,t&&(w=1-w);let M=[{tG:[[.025,-.15],[.1,0],[.15,.1],[.5,.9],[.55,.95],[.6,1],[.65,1.15]]},{tG:[[-.2,-.15],[-.12,0],[0,.1],[.2,.4],[.35,.6],[.5,1],[.525,1.15]]},{tG:[[-.2,-.1],[-.12,.5],[0,.6],[.2,.75],[.3,1],[.35,1.15]]}].map((t=>c(t,g,y)));l&&M.forEach(d);let G=[{tG:[[1.15,-.15],[1.07,0],[1,.15],[.8,.3],[.75,.55],[.7,.6],[.6,.8],[.6,1],[.65,1.15]]},{tG:[[1.2,-.15],[1.12,0],[1,.2],[.85,.3],[.75,.6],[.7,1],[.7,1.15]]},t?void 0:{tG:[[1.2,-.1],[1.12,.05],[1,.25],[.9,.3],[.8,.6],[.85,1],[.875,1.15]]}].filter(Boolean).map((t=>c(t,m,p)));return s&&G.forEach(d),{layers:h(M,!t,t,i).concat(h(G,t,t,i)),sunX:w}}},.24],[{code:"B",getLayers:(t,e,n,o,r,a)=>{const i=e()>=.5,l=o(g),s=o(m);let u=1.5+l;t&&(u=1-u);const f=[{tG:[[1.15,-.2],[.95,0],[.65,.25],[.55,.45],[.6,.7],[.85,1],[1.1,1.2]]},{tG:[[1.05,-.2],[.75,0],[.375,.35],[.425,.75],[.7,1],[.95,1.2]]},{tG:[[.75,-.2],[.55,0],[.425,.15],[.25,.55],[.275,.7],[.55,1],[.85,1.2]]},{tG:[[.175,-.2],[.2,0],[.1,.15],[.35,.75],[.2,1],[.1875,1.05],[.225,1.2]]}].map((t=>c(t,l,s)));return i&&f.forEach(d),{layers:h(f,!t,t,{td:20,tm:.02,dd:100,dm:.0075}),sunX:u}}},.12],[{code:"C",getLayers:(t,e,n,o,r,a)=>{const i={td:20,tm:.02,dd:100,dm:.0075},l=e()>=.6,s=e()>=.6,u=o(y),f=o(p);let g=1.2;s&&(g=.7),g+=u+f,t&&(g=1-g);const m=[.35,.45];let w=[{tG:[[.675,0],[.725,.2],[.55,.35],[...m]],noLayerHeight:!0},{tG:[[.6,0],[.5,.1],[...m],[.4,.5],[.4,.55],[.35,.675],[.6,1]]},{tG:[[.5,0],[.225,.5],[.275,.65],[.5,1]]},{tG:[[-.18,.675],[0,.75],[.15,.8],[.35,1]]}].map((t=>c(t,u)));l&&w.forEach(d);let M=[{tG:[[1.12,.5],[1,.6],[.85,.7],[.7,1]]},{tG:[[1.12,.7],[1,.8],[.85,.925],[.8,1]]}].map((t=>c(t,f)));return s&&M.forEach(d),{layers:h(w,!t,t,i).concat(h(M,t,t,i)),sunX:g}}},.2],[{code:"D",getLayers:(t,e,n,o,r,a)=>{const i=e()>=.6,l=o(w),s=o(M);let u=2+l;t&&(u=1-u);const f=[.62,.45],g=[.93,1.05],m=[{tG:[[...f],[.9,.7],[.99,.85],[.95,1],[...g]],noLayerHeight:!0},{tG:[[.9,-.15],[.8,0],[...f],[.4,1],[.3,1.15]]},{tG:[[.2,-.15],[.25,0],[.35,.5],[.9,1],[...g],[1.05,1.15]]},{tG:[[0,-.15],[.1,0],[.25,.65],[.6,1],[.75,1.15]]}].map((t=>c(t,l,s)));return i&&m.forEach(d),{layers:h(m,!t,t,{td:20,tm:.02,dd:100,dm:.0075}),sunX:u}}},.12],[{code:"E",getLayers:(t,e,n,o,r,a)=>{const i={td:20,tm:.02,dd:100,dm:.0075},l=e()>=.7,s=!!l&&e()>=.7,u=o(G),f=o(G);let g=.7;l&&s&&(g=.3),l&&!s&&(g=.5),g+=u+f,t&&(g=1-g);let m=[{tG:[[.55,0],[.55,.1],[.3,.3],[.3,.4],[0,.65],[-.12,.7]]},{tG:[[.25,0],[.35,.15],[.3,.3],[0,.5],[-.12,.575]]}].map((t=>c(t,u)));l&&m.forEach(d);let y=[{tG:[[1.12,.425],[1,.5],[.63,.7],[.35,1],[.3,1.12]]},{tG:[[1.12,.65],[1,.7],[.75,.8],[.65,1],[.61,1.12]]},{tG:[[1.12,.5],[1,.55],[.8875,.65],[.8,1],[.775,1.12]]}].map((t=>c(t,f)));return l&&y.forEach(d),{layers:h(m,!t,t,i).concat(h(y,t,t,i)),sunX:g}}},.14],[{code:"F",getLayers:(t,e,n,o,r,a)=>{const i={td:30,tm:.04,dd:150,dm:.002},l=o(x),s=-1*o(x);let d=.25;function u(t,n,o,r){let a=0,i=.03,l=o+i;for(;!(Math.abs(l-o)>.05&&(null==r||Math.abs(r-l)>.05))&&a++<100;){const a=t+(n/2+e()*(n/2)),s=Math.min(Math.abs(a-o),null==r?Number.MAX_SAFE_INTEGER:Math.abs(r-a));s>i&&(i=s,l=a)}return l}function f(t){const n=.4+.4*e(),o=t[1][0],r=t[2][0]-t[1][0],a=n-(.05+.1*e()),i=n+(.05+.1*e()),l=e();let s;s=l<.3?-.15:l<.5?.05:l<.7?.125:.25;const c=u(o+r*a,s,t[1][0]),d=u(o+r*a,s,c,t[2][0]);return[t[0],t[1],[c,a],[d,i],t[2],t[3]]}d+=l+s,t&&(d=1-d);const g=[c({tG:f([[.15,-.15],[.2,0],[.65,1],[.75,1.15]])},l,o(b)),c({tG:f([[.2,-.15],[.1,0],[.55,1],[.6,1.15]])},l,o(b))],m=[c({tG:f([[.3,-.15],[.35,0],[.75,1],[.8,1.15]])},s,o(b)),c({tG:f([[.475,-.15],[.5,0],[.9,1],[.95,1.15]])},s,o(b))];return{layers:h(g,!t,t,i).concat(h(m,t,t,i)),sunX:d}}},.18]],v={name:"Grainy",xDis:4,yDis:1,xDen:750,yDen:320,eYDis:0,aDRP:1,xDisp:(t,n)=>n?0:-1*o([128,128,64,32,16,4,2,1,1,0,0,-1,-1])*Math.sin(50*e()/25)*t/2e3};function I(t,e,n,o,r){if(!o)return 0;const a=Math.atan((t-n.center.x*C)/(e-n.center.y*P)),i=Math.PI/2;for(const t of[[-1*i,.09],[-1*i+.25,.12],[-1*i+.48,.08],[-1*i+.62,.07],[-1*i+.78,.12],[-1*i+1,.08],[-1*i+1.25,.13],[-1*i+1.5,.08],[i,.09],[i-.2,.07],[i-.4,.07]])if(a>t[0]-t[1]&&a<t[0]+t[1])return Math.max(0,Math.min(1,1-r(Math.abs(a-t[0])/t[1],.2)));return 0}const{code:k,primary:L,secondary:B}=o([{code:"A",primary:{c:[177,90,10],bg:[186,100,16,.5],fg:[[360,100,83],[48,87,53],[31,93,50],[270,100,66]]},secondary:{c:[177,90,10],bg:[186,100,16,.5],fg:[[360,71,95],[48,93,93],[31,44,89],[270,13,89]]}},{code:"B",primary:{c:[190,100,12],bg:[192,95,17,.5],fg:[[43,100,71],[148,83,60],[163,57,56]]},secondary:{c:[190,100,12],bg:[192,95,17,.5],fg:[[43,70,96],[148,54,95],[163,100,98]]}},{code:"C",primary:{c:[196,100,10],bg:[198,95,16,.5],fg:[[39,92,46],[330,50,66],[337,68,51]]},secondary:{c:[196,100,10],bg:[198,95,16,.5],fg:[[39,70,96],[330,38,88],[337,100,96]]}},{code:"D",primary:{c:[207,82,22],bg:[207,58,30,.5],fg:[[328,67,75],[41,83,52],[335,76,58],[266,35,52],[172,83,65]]},secondary:{c:[207,82,22],bg:[207,58,30,.5],fg:[[328,73,97],[41,63,92],[335,47,94],[266,4,87],[172,29,90]]}},{code:"E",primary:{c:[210,91,26],bg:[202,86,31,.5],fg:[[360,100,66],[306,82,66],[31,96,62],[254,88,73]]},secondary:{c:[210,91,26],bg:[202,86,31,.5],fg:[[360,65,89],[306,49,92],[31,54,91],[254,100,98]]}},{code:"F",primary:{c:[212,55,14],bg:[212,54,22,.5],fg:[[33,98,52],[46,99,51],[192,68,46],[196,75,79]]},secondary:{c:[212,55,14],bg:[212,54,22,.5],fg:[[33,94,90],[46,78,94],[192,17,94],[196,44,97]]}},{code:"G",primary:{c:[219,36,17],bg:[219,34,23,.5],fg:[[2,84,69],[312,56,54],[282,80,80],[236,100,65]]},secondary:{c:[219,36,17],bg:[219,34,23,.5],fg:[[2,67,90],[312,100,94],[282,100,97],[236,100,96]]}},{code:"H",primary:{c:[232,100,54],bg:[220,100,54,.5],fg:[[342,95,85],[28,100,68],[301,82,71],[191,90,76]]},secondary:{c:[232,100,54],bg:[220,100,54,.5],fg:[[342,100,99],[28,100,94],[301,25,92],[191,85,96]]}},{code:"I",primary:{c:[262,36,18],bg:[261,32,28,.5],fg:[[334,97,87],[38,89,55],[264,43,54],[203,90,76]]},secondary:{c:[262,36,18],bg:[261,32,28,.5],fg:[[334,97,93],[38,99,95],[264,59,96],[203,100,98]]}}]),S=r([["Layered",.85],["Gradient",.15]]);let A=e(),E="None";A>=.5&&(E="Moderate"),A>=.5+.18&&(E="Severe"),A>=.5+.18+.18&&(E="Total");const R=16/9,$=R,C=1.8838383838383836,P=1,H=.06,X=.1714,N=v,T=r(D),z=e()>=.5,{layers:U,sunX:F}=T.getLayers(z,e,o,r,s,n),_={None:0,Moderate:.25,Severe:.5,Total:1}[E],Y=function(t,e){var n;return{center:{x:-.2,y:t+=(n=e(0,.025),-.05,.05,Math.min(.05,Math.max(-.05,n)))}}}(F,s);let j=parseInt(new URLSearchParams(window.location.search).get("size")??0,10)||Math.min(window.innerHeight/R,window.innerWidth);const W=()=>j;function q(t,e){if(t<0||t>C||e<0||e>P)return!0}const O=()=>{const t={td:1,tm:0,dd:1,dm:0,layerHeight:.7,isBackground:!0};return[{tG:[{x:0,y:0},{x:1,y:0}],...t},{tG:[{x:0,y:0},{x:1,y:0}],...t,isInverted:!0}]},V=parseInt(new URLSearchParams(window.location.search).get("size")??0,10),J=null!=new URLSearchParams(window.location.search).get("downloadIndex")?parseInt(new URLSearchParams(window.location.search).get("downloadIndex")??0,10):void 0,K=null!=new URLSearchParams(window.location.search).get("glitchDownloadIndex")?parseInt(new URLSearchParams(window.location.search).get("glitchDownloadIndex")??0,10):void 0;new p5((t=>{let r,i,l,c,d,h,u,f,g;const m=[];let y,p;function w(){r=!0,i=1,l=!1,c=!0,t.frameRate(60)}function M(t){const n=e()<.5;if(1===t.fg.length)return null==t.l?[t.fg[0],t.fg[0]]:n?[t.fg[0],t.l]:[t.l,t.fg[0]];let r,a;for(;!r||!a;)r=o(t.fg),a=o(t.fg.filter((t=>t.join(",")!==r.join(","))).filter((t=>(n?t[0]-r[0]:r[0]-t[0])<180)));return[n?r:a,n?a:r]}function G(t,e,n){let[o,r,a,i]=t,[l,s,c,d]=e;Math.abs(o-l)>180&&(o<l?o+=360:l+=360);const h=[(o+n*(l-o))%360,r+n*(s-r),a+n*(c-a)];return null==i&&null==d||h.push((i??1)+n*((d??1)-(i??1))),h}function x(t,e,n){if(e.noStroke(),!n&&!r&&!l)return void e.noLoop();if(n||e.loop(),!n&&l){if(d<0)return void(-30===d?(c=!0,d=0):d--);if(d>h-1)return void(d===h-1+30?(c=!1,d=h-1):d++)}let o,a,s,g;(n||r&&1===i)&&e.background(...L.c);for(let h=0;h<f[0].length;h++)for(let m=0;m<f.length;m++)if(n||r&&f[m][h]===i-1||l&&u[m][h]===d){o=Math.round((H+1.6577777777777776*m/(C/X))*t()),s=Math.round((H+.88*h/(P/X))*t()),a=Math.round((H+1.6577777777777776*(m+1)/(C/X))*t()),g=Math.round((H+.88*(h+1)/(P/X))*t());const i=n&&u[m][h]<d||r&&u[m][h]<d||l&&u[m][h]===d&&c;e.fill(...i?B.c:L.c),e.rectMode(e.CORNERS),e.rect(s,o,g,a)}for(const i of m)for(const h of i.columnLayers)for(let f=0;f<h.length;f++)for(let m=0;m<h[f].length;m++){if(null==h[f][m])continue;const{x:w,y:M,isInSun:x,resolutionThreshold:b}=h[f][m];if(t()<500&&b>Math.max(100,t())/500)continue;const D=Math.floor(w/X),v=Math.floor(M/X),I=(H+1.6577777777777776/C*w)*t(),k=(H+.88/P*M)*t();if(!n&&(r||l)&&(I<o||I>a||k<s||k>g))continue;const A=n&&u[D][v]<d||r&&u[D][v]<d||l&&c;let E=i.isBackground?1:((h[f].length-m)/h[f].length)**N.aDRP;if(x&&(E*=1-x),E>.001){let n;if("Layered"===S)n=e.color(...A?i.alternateColor:i.color);else if("Gradient"===S){const t=A?p:y;n=i.isBackground?e.color(...A?B.bg:L.bg):G(t[0],t[1],w/C)}e.fill(e.hue(n),e.saturation(n),e.lightness(n),e.alpha(n)*E),e.ellipse(k,I,.001*t())}}if(!n){if(r){if(i===h)return e.noLoop(),r=!1,!0;i++}l&&(d+=c?1:-1)}}t.setup=()=>{!function(){g=[...O(),...U];for(let t=0;t<g.length;t++){const r=g[t],a={template:[],detail:[],columnLayers:[],height:r.layerHeight??0,isBackground:r.isBackground,isInverted:r.isInverted,color:r.isBackground?L.bg:o(L.fg),alternateColor:r.isBackground?B.bg:o(B.fg)},i=C/r.td;a.template=new Array(r.td+1).fill(void 0);for(const{x:t,y:e}of r.tG)a.template[Math.round(t*r.td)]={x:Math.round(t*r.td)/r.td*C,y:e,isGuideline:!0};for(let t=0;t<a.template.length;t++){const e=t*i;if(null==a.template[t]){const o=r.tG.findIndex((e=>e.x>t/r.td))-1,i=r.tG[o];if(null==i)continue;const l=r.tG[o+1];if(null==l)continue;const s=i.y+(l.y-i.y)*(e-i.x*C)/(l.x*C-i.x*C);let c;for(;;){if(r.isBackground){c=s;break}if(c=s+n(-r.tm,r.tm),i.y===l.y)break;if(!(c>=Math.max(i.y,l.y)||c<=Math.min(i.y,l.y)))break}a.template[t]={x:e,y:c}}}a.template=a.template.filter(Boolean);let l,c=a.template[0].y;for(let t=1;t<a.template.length;t++){l=a.template[t].y;const e=a.template[t].x,o=Math.round(r.dd/r.td),s=i/o;for(let i=0;i<o;i++){const o=a.template[t-1].x+i*s;a.detail.push({x:o,y:c});const d=s*(l-c)/(e-o);c+=n(d-r.dm,d+r.dm)}}a.detail.push({x:a.template[a.template.length-1].x,y:c});for(let o=0;o<3;o++){const o=[],i=Math.min(...a.detail.map((t=>t.y))),l=Math.max(...a.detail.map((t=>t.y))),c=!a.isInverted||a.isBackground?Math.min(l+a.height,P):Math.max(i-a.height,0),d=1/N.xDen,h=Math.round(a.detail[0].x*N.xDen/C),u=Math.round(a.detail[a.detail.length-1].x*N.xDen/C)-h;for(let i=0;i<u;i++){const l=(h+i)*d*C,f=(a.detail.length-1)*i/(u-1)%1,g=Math.floor((a.detail.length-1)*i/(u-1)),m=Math.ceil((a.detail.length-1)*i/(u-1));let y,p;a.isBackground?a.isInverted?(y=1-a.height+n(-.3,.3),p=1):(y=0,p=a.height+n(-.3,.3)):(y=a.detail[g].y+f*(a.detail[m].y-a.detail[g].y),p=a.isInverted?c-(1-c)*e():c+(1-c)*e());const w=!a.isInverted||a.isBackground?Math.round(N.yDen*(p-y))*1.25**t:Math.round(N.yDen*(y-p))*1.25**t,M=!a.isInverted||a.isBackground?1/(w-1)*(p-y):1/(w-1)*(y-p);y+=n(-N.eYDis*M,N.eYDis*M);const G=[];for(let t=0;t<w;t++){const o=!a.isInverted||a.isBackground?y+t*M+M*n(-N.yDis/2,N.yDis/2):y-t*M+M*n(-N.yDis/2,N.yDis/2),i=l+(d/2+d*n(.5*-N.xDis,.5*N.xDis)+N.xDisp(t,a.isBackground))*C;G.push(q(i,o)?void 0:{x:i,y:o,isInSun:I(i,o,Y,r.isBackground,s),resolutionThreshold:e()})}o.push(G)}a.columnLayers.push(o)}m.push(a)}}(),y=M(L),p=a(M(B)),u=new Array(Math.ceil(C/X)).fill(0).map((t=>new Array(Math.ceil(P/X)).fill(0))),h=u.flat().length;const r=a(new Array(h).fill(0).map(((t,e)=>e)));for(let t=0;t<u.length;t++)for(let e=0;e<u[t].length;e++)u[t][e]=r[t*u[t].length+e];f=new Array(Math.ceil(C/X)).fill(0).map((t=>new Array(Math.ceil(P/X)).fill(0)));const i=a(new Array(h).fill(0).map(((t,e)=>e)));for(let t=0;t<f.length;t++)for(let e=0;e<f[t].length;e++)f[t][e]=i[t*f[t].length+e];w(),d=Math.floor(_*h),null!=K&&(d=K),t.randomSeed(1e3*e()),t.noiseSeed(1e3*e()),t.noiseDetail(2),t.pixelDensity(1),t.createCanvas(Math.round(1*W()),Math.round($*W())),t.colorMode(t.HSL),t.angleMode(t.DEGREES),t.frameRate(60)},t.draw=()=>{if(x(W,t)&&(null!=J||null!=K))if(null!=K){if(t.save(`corral-${tokenData.hash}-${K}.png`),K>0){let t=`${window.location.protocol}//${window.location.host+window.location.pathname}?glitchDownloadIndex=${K-1}`;V>0&&(t+=`&size=${V}`),setTimeout((()=>window.location.href=t),3e3)}}else if(null!=J){const e={A:"Starlet",B:"Leaf",C:"Sun",D:"Precious",E:"Carnation",F:"Pipe",G:"Gorgonian",H:"Bubble",I:"Vase"},n={A:"North Pacific",B:"South Pacific",C:"North Atlantic",D:"South Atlantic",E:"Arctic",F:"Southern"};if(t.save(`corral-${e[k]}-${n[T.code]}-${tokenData.hash}-${J}.png`),J>1){let t=`${window.location.protocol}//${window.location.host+window.location.pathname}?downloadIndex=${J-1}`;V>0&&(t+=`&size=${V}`),setTimeout((()=>window.location.href=t),3e3)}}},t.windowResized=()=>{var e;[/HeadlessChrome/i].some((t=>navigator.userAgent.match(t)))||(w(),e=Math.min(window.innerHeight/$,window.innerWidth),j=e,t.resizeCanvas(1*W(),$*W()))},t.keyPressed=()=>{const e={48:0,49:.25,50:.5,51:.75,52:1}[t.keyCode];if(null!=e&&(w(),d=Math.floor(e*h),console.log(`Setting glitch percentage to ${Math.round(100*e)}%`),t.loop()),83===t.keyCode){if(r)return;l&&(l=!1,t.frameRate(60)),console.log("Downloading print...");const e=t.createGraphics(Math.round(3946),Math.round(7015.11111111111));e.colorMode(t.HSL),e.angleMode(t.DEGREES),e.pixelDensity(1),x((()=>3946),e,!0),e.save("corral-print.png"),console.log("Download of print complete.")}},t.mouseClicked=()=>{r||(l?(l=!1,t.frameRate(60)):(l=!0,t.frameRate(10),t.loop()))}})),console.log(tokenData)})();