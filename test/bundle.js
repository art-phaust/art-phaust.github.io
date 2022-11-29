(()=>{"use strict";const t=new class{constructor(){this.useA=!1;let t=function(t){let e=parseInt(t.substr(0,8),16),n=parseInt(t.substr(8,8),16),o=parseInt(t.substr(16,8),16),r=parseInt(t.substr(24,8),16);return function(){e|=0,n|=0,o|=0,r|=0;let t=(e+n|0)+r|0;return r=r+1|0,e=n^n>>>9,n=o+(o<<3)|0,o=o<<21|o>>>11,o=o+t|0,(t>>>0)/4294967296}};this.prngA=new t(tokenData.hash.substr(2,32)),this.prngB=new t(tokenData.hash.substr(34,32));for(let t=0;t<1e6;t+=2)this.prngA(),this.prngB()}random_dec(){return this.useA=!this.useA,this.useA?this.prngA():this.prngB()}};function e(){return t.random_dec()}function n(t,n){return t+e()*(n-t)}function o(t){return t[Math.floor(e()*t.length)]}function r(t){let n=0;const o=e(),r=t.reduce(((t,[e,n])=>t+n),0);return(t.map((([t,e])=>(n+=1*e/r??1,[t,e,n]))).find((([t,e,n])=>o<n))??t[t.length-1])[0]}function a(t){for(let n=t.length-1;n>0;n--){const o=Math.floor(e()*(n+1));[t[n],t[o]]=[t[o],t[n]]}return t}let l,i=!1;const s=(t,n)=>{var o,r,a,s;if(i)o=l,i=!1;else{do{s=(r=e()-1)*r+(a=e()-1)*a}while(s>=1);o=r*(s=Math.sqrt(-2*Math.log(s)/s)),l=a*s,i=!0}return o*(n||1)+(t||0)};function c(t,e=0,n=0){return{tG:t.tG.map((([t,o])=>[t+e,o+n]))}}function d(t){t.tG=t.tG.map((([t,e])=>[t,1-e])).reverse()}function h(t,e,n,o){return t.map((t=>({...t,...o,layerHeight:t.noLayerHeight?void 0:1,tG:t.tG.map((([t,e])=>({y:n?1-t:t,x:e}))),isInverted:e})))}const u=[[-.12,.1],[-.06,.2],[0,.4],[.06,.2],[.12,.1]],f=[[-.15,.1],[-.075,.2],[0,.4],[.075,.2],[.15,.1]],g=[[-.225,.2],[-.15,.2],[-.075,.2],[0,.2],[.075,.2]],m=[[-.2,.2],[-.1,.2],[0,.2],[.1,.2],[.2,.2]],y=[[-.18,.2],[-.12,.2],[-.06,.2],[0,.2],[.06,.2]],p=[[-.12,.2],[-.06,.2],[0,.2],[.06,.2],[.12,.2]],w=[[-.24,.2],[-.18,.2],[-.12,.15],[-.06,.15],[0,.15],[.06,.1],[.12,.05]],M=[[-.15,.2],[-.075,.2],[0,.2],[.075,.2],[.15,.2]],G=[[-.12,.1],[-.06,.2],[0,.4],[.06,.2],[.12,.1]],x=[[-.12,.2],[-.09,.2],[-.06,.2],[-.03,.2],[0,.2]],b=[[0,.25],[.05,.25],[.1,.25],[.15,.25]],D=[[{code:"A",getLayers:(t,e,n,o,r,a)=>{const l={td:20,tm:.02,dd:100,dm:.0075};let i=!1,s=!1;e()>=.65&&(e()<.5?i=!0:s=!0);const g=o(u),m=o(u),y=o(f),p=o(f);let w=.75;!i&&s&&(w=.4),i&&s&&(w=.6),w+=g+m,t&&(w=1-w);let M=[{tG:[[.025,-.15],[.1,0],[.15,.1],[.5,.9],[.55,.95],[.6,1],[.65,1.15]]},{tG:[[-.2,-.15],[-.12,0],[0,.1],[.2,.4],[.35,.6],[.5,1],[.525,1.15]]},{tG:[[-.2,-.1],[-.12,.5],[0,.6],[.2,.75],[.3,1],[.35,1.15]]}].map((t=>c(t,g,y)));i&&M.forEach(d);let G=[{tG:[[1.15,-.15],[1.07,0],[1,.15],[.8,.3],[.75,.55],[.7,.6],[.6,.8],[.6,1],[.65,1.15]]},{tG:[[1.2,-.15],[1.12,0],[1,.2],[.85,.3],[.75,.6],[.7,1],[.7,1.15]]},t?void 0:{tG:[[1.2,-.1],[1.12,.05],[1,.25],[.9,.3],[.8,.6],[.85,1],[.875,1.15]]}].filter(Boolean).map((t=>c(t,m,p)));return s&&G.forEach(d),{layers:h(M,!t,t,l).concat(h(G,t,t,l)),sunX:w}}},.24],[{code:"B",getLayers:(t,e,n,o,r,a)=>{const l=e()>=.5,i=o(g),s=o(m);let u=1.5+i;t&&(u=1-u);const f=[{tG:[[1.15,-.2],[.95,0],[.65,.25],[.55,.45],[.6,.7],[.85,1],[1.1,1.2]]},{tG:[[1.05,-.2],[.75,0],[.375,.35],[.425,.75],[.7,1],[.95,1.2]]},{tG:[[.75,-.2],[.55,0],[.425,.15],[.25,.55],[.275,.7],[.55,1],[.85,1.2]]},{tG:[[.175,-.2],[.2,0],[.1,.15],[.35,.75],[.2,1],[.1875,1.05],[.225,1.2]]}].map((t=>c(t,i,s)));return l&&f.forEach(d),{layers:h(f,!t,t,{td:20,tm:.02,dd:100,dm:.0075}),sunX:u}}},.12],[{code:"C",getLayers:(t,e,n,o,r,a)=>{const l={td:20,tm:.02,dd:100,dm:.0075},i=e()>=.6,s=e()>=.6,u=o(y),f=o(p);let g=1.2;s&&(g=.7),g+=u+f,t&&(g=1-g);const m=[.35,.45];let w=[{tG:[[.675,0],[.725,.2],[.55,.35],[...m]],noLayerHeight:!0},{tG:[[.6,0],[.5,.1],[...m],[.4,.5],[.4,.55],[.35,.675],[.6,1]]},{tG:[[.5,0],[.225,.5],[.275,.65],[.5,1]]},{tG:[[-.18,.675],[0,.75],[.15,.8],[.35,1]]}].map((t=>c(t,u)));i&&w.forEach(d);let M=[{tG:[[1.12,.5],[1,.6],[.85,.7],[.7,1]]},{tG:[[1.12,.7],[1,.8],[.85,.925],[.8,1]]}].map((t=>c(t,f)));return s&&M.forEach(d),{layers:h(w,!t,t,l).concat(h(M,t,t,l)),sunX:g}}},.2],[{code:"D",getLayers:(t,e,n,o,r,a)=>{const l=e()>=.6,i=o(w),s=o(M);let u=2+i;t&&(u=1-u);const f=[.62,.45],g=[.93,1.05],m=[{tG:[[.5,-.15],[.45,0],[.4,.1],[...f],[.9,.7],[.99,.85],[.95,1],[...g],[.95,1.15]],noLayerHeight:!0},{tG:[[.9,-.15],[.8,0],[...f],[.4,1],[.3,1.15]]},{tG:[[.2,-.15],[.25,0],[.35,.5],[.9,1],[...g],[1.05,1.15]]},{tG:[[0,-.15],[.1,0],[.25,.65],[.6,1],[.75,1.15]]}].map((t=>c(t,i,s)));return l&&m.forEach(d),{layers:h(m,!t,t,{td:20,tm:.02,dd:100,dm:.0075}),sunX:u}}},.12],[{code:"E",getLayers:(t,e,n,o,r,a)=>{const l={td:20,tm:.02,dd:100,dm:.0075},i=e()>=.7,s=!!i&&e()>=.7,u=o(G),f=o(G);let g=.7;i&&s&&(g=.3),i&&!s&&(g=.5),g+=u+f,t&&(g=1-g);let m=[{tG:[[.55,0],[.55,.1],[.3,.3],[.3,.4],[0,.65],[-.12,.7]]},{tG:[[.25,0],[.35,.15],[.3,.3],[0,.5],[-.12,.575]]}].map((t=>c(t,u)));i&&m.forEach(d);let y=[{tG:[[1.12,.425],[1,.5],[.63,.7],[.35,1],[.3,1.12]]},{tG:[[1.12,.65],[1,.7],[.75,.8],[.65,1],[.61,1.12]]},{tG:[[1.12,.5],[1,.55],[.8875,.65],[.8,1],[.775,1.12]]}].map((t=>c(t,f)));return s&&y.forEach(d),{layers:h(m,!t,t,l).concat(h(y,t,t,l)),sunX:g}}},.14],[{code:"F",getLayers:(t,e,n,o,r,a)=>{const l={td:30,tm:.04,dd:150,dm:.002},i=o(x),s=-1*o(x);let d=.25;function u(t,n,o,r){let a=0,l=.03,i=o+l;for(;!(Math.abs(i-o)>.05&&(null==r||Math.abs(r-i)>.05))&&a++<100;){const a=t+(n/2+e()*(n/2)),s=Math.min(Math.abs(a-o),null==r?Number.MAX_SAFE_INTEGER:Math.abs(r-a));s>l&&(l=s,i=a)}return i}function f(t){const n=.4+.4*e(),o=t[1][0],r=t[2][0]-t[1][0],a=n-(.05+.1*e()),l=n+(.05+.1*e()),i=e();let s;s=i<.3?-.15:i<.5?.05:i<.7?.125:.25;const c=u(o+r*a,s,t[1][0]),d=u(o+r*a,s,c,t[2][0]);return[t[0],t[1],[c,a],[d,l],t[2],t[3]]}d+=i+s,t&&(d=1-d);const g=[c({tG:f([[.15,-.15],[.2,0],[.65,1],[.75,1.15]])},i,o(b)),c({tG:f([[.2,-.15],[.1,0],[.55,1],[.6,1.15]])},i,o(b))],m=[c({tG:f([[.3,-.15],[.35,0],[.75,1],[.8,1.15]])},s,o(b)),c({tG:f([[.475,-.15],[.5,0],[.9,1],[.95,1.15]])},s,o(b))];return{layers:h(g,!t,t,l).concat(h(m,t,t,l)),sunX:d}}},.18]],v={name:"Grainy",xDis:4,yDis:1,xDen:750,yDen:320,eYDis:0,aDRP:1,xDisp:(t,n)=>n?0:-1*o([128,128,64,32,16,4,2,1,1,0,0,-1,-1])*Math.sin(50*e()/25)*t/2e3};let I,k;function L(t,e,o,r,a){if(!r)return 0;null==I&&(I=function(){const t=Math.PI/2,e=()=>n(.06,.18),o=e(),r=[[-1*t,o],[t,o]];let a=-1*t+o;for(;a<-1*t+1.5;){const t=e();a+=t,r.unshift([a,t]),a+=t}for(a=t-o;a>1*t-1.5;){const t=e();a-=t,r.push([a,t]),a-=t}return r}()),null==k&&(k=n(.15,.2));const l=Math.atan((t-o.center.x*H)/(e-o.center.y*X));for(const t of I)if(l>t[0]-t[1]&&l<t[0]+t[1])return Math.max(0,Math.min(1,1-a(Math.abs(l-t[0])/t[1],k)));return 0}const{code:B,primary:S,secondary:A}=o([{code:"A",primary:{c:[177,90,10],bg:[186,100,16,.5],fg:[[360,100,83],[48,87,53],[31,93,50],[270,100,66]]},secondary:{c:[177,90,10],bg:[186,100,16,.5],fg:[[360,71,95],[48,93,93],[31,44,89],[270,13,89]]}},{code:"B",primary:{c:[190,100,12],bg:[192,95,17,.5],fg:[[43,100,71],[148,83,60],[163,57,56]]},secondary:{c:[190,100,12],bg:[192,95,17,.5],fg:[[43,70,96],[148,54,95],[163,100,98]]}},{code:"C",primary:{c:[196,100,10],bg:[198,95,16,.5],fg:[[39,92,46],[330,50,66],[337,68,51]]},secondary:{c:[196,100,10],bg:[198,95,16,.5],fg:[[39,70,96],[330,38,88],[337,100,96]]}},{code:"D",primary:{c:[207,82,22],bg:[207,58,30,.5],fg:[[328,67,75],[41,83,52],[335,76,58],[266,35,52],[172,83,65]]},secondary:{c:[207,82,22],bg:[207,58,30,.5],fg:[[328,73,97],[41,63,92],[335,47,94],[266,4,87],[172,29,90]]}},{code:"E",primary:{c:[210,91,26],bg:[202,86,31,.5],fg:[[360,100,66],[306,82,66],[31,96,62],[254,88,73]]},secondary:{c:[210,91,26],bg:[202,86,31,.5],fg:[[360,65,89],[306,49,92],[31,54,91],[254,100,98]]}},{code:"F",primary:{c:[212,55,14],bg:[212,54,22,.5],fg:[[33,98,52],[46,99,51],[192,68,46],[196,75,79]]},secondary:{c:[212,55,14],bg:[212,54,22,.5],fg:[[33,94,90],[46,78,94],[192,17,94],[196,44,97]]}},{code:"G",primary:{c:[219,36,17],bg:[219,34,23,.5],fg:[[2,84,69],[312,56,54],[282,80,80],[236,100,65]]},secondary:{c:[219,36,17],bg:[219,34,23,.5],fg:[[2,67,90],[312,100,94],[282,100,97],[236,100,96]]}},{code:"H",primary:{c:[232,100,54],bg:[220,100,54,.5],fg:[[342,95,85],[28,100,68],[301,82,71],[191,90,76]]},secondary:{c:[232,100,54],bg:[220,100,54,.5],fg:[[342,100,99],[28,100,94],[301,25,92],[191,85,96]]}},{code:"I",primary:{c:[262,36,18],bg:[261,32,28,.5],fg:[[334,97,87],[38,89,55],[264,43,54],[203,90,76]]},secondary:{c:[262,36,18],bg:[261,32,28,.5],fg:[[334,97,93],[38,99,95],[264,59,96],[203,100,98]]}}]),E=r([["Layered",.85],["Gradient",.15]]);let R=e(),$="None";R>=.66&&($="Moderate"),R>=.76&&($="Severe"),R>=.86&&($="Total");const C=16/9,P=C,H=1.8838383838383836,X=1,N=.06,T=.1714,z=v,U=r(D),F=e()>=.5,{layers:_,sunX:Y}=U.getLayers(F,e,o,r,s,n),j={None:0,Moderate:.25,Severe:.5,Total:1}[$],W=function(t,e){var n;return{center:{x:-.2,y:t+=(n=e(0,.025),-.05,.05,Math.min(.05,Math.max(-.05,n)))}}}(Y,s);let q=parseInt(new URLSearchParams(window.location.search).get("size")??0,10)||Math.min(window.innerHeight/C,window.innerWidth);const O=()=>q;function V(t,e){if(t<0||t>H||e<0||e>X)return!0}const J=()=>{const t={td:1,tm:0,dd:1,dm:0,layerHeight:.7,isBackground:!0};return[{tG:[{x:0,y:0},{x:1,y:0}],...t},{tG:[{x:0,y:0},{x:1,y:0}],...t,isInverted:!0}]},K=parseInt(new URLSearchParams(window.location.search).get("size")??0,10),Q=null!=new URLSearchParams(window.location.search).get("downloadIndex")?parseInt(new URLSearchParams(window.location.search).get("downloadIndex")??0,10):void 0,Z=null!=new URLSearchParams(window.location.search).get("glitchDownloadIndex")?parseInt(new URLSearchParams(window.location.search).get("glitchDownloadIndex")??0,10):void 0;new p5((t=>{let r,l,i,c,d,h,u,f,g;const m=[];let y,p;function w(){r=!0,l=1,i=!1,c=!0,t.frameRate(60)}function M(t){const n=e()<.5;if(1===t.fg.length)return null==t.l?[t.fg[0],t.fg[0]]:n?[t.fg[0],t.l]:[t.l,t.fg[0]];let r,a;for(;!r||!a;)r=o(t.fg),a=o(t.fg.filter((t=>t.join(",")!==r.join(","))).filter((t=>(n?t[0]-r[0]:r[0]-t[0])<180)));return[n?r:a,n?a:r]}function G(t,e,n){let[o,r,a,l]=t,[i,s,c,d]=e;Math.abs(o-i)>180&&(o<i?o+=360:i+=360);const h=[(o+n*(i-o))%360,r+n*(s-r),a+n*(c-a)];return null==l&&null==d||h.push((l??1)+n*((d??1)-(l??1))),h}function x(t,e,n){if(e.noStroke(),!n&&!r&&!i)return void e.noLoop();if(n||e.loop(),!n&&i){if(d<0)return void(-30===d?(c=!0,d=0):d--);if(d>h-1)return void(d===h-1+30?(c=!1,d=h-1):d++)}let o,a,s,g;(n||r&&1===l)&&e.background(...S.c);for(let h=0;h<f[0].length;h++)for(let m=0;m<f.length;m++)if(n||r&&f[m][h]===l-1||i&&u[m][h]===d){o=Math.round((N+1.6577777777777776*m/(H/T))*t()),s=Math.round((N+.88*h/(X/T))*t()),a=Math.round((N+1.6577777777777776*(m+1)/(H/T))*t()),g=Math.round((N+.88*(h+1)/(X/T))*t());const l=n&&u[m][h]<d||r&&u[m][h]<d||i&&u[m][h]===d&&c;e.fill(...l?A.c:S.c),e.rectMode(e.CORNERS),e.rect(s,o,g,a)}for(const l of m)for(const h of l.columnLayers)for(let f=0;f<h.length;f++)for(let m=0;m<h[f].length;m++){if(null==h[f][m])continue;const{x:w,y:M,isInSun:x,resolutionThreshold:b}=h[f][m],D=1e3/e.pixelDensity();if(t()<D&&b>Math.max(100,t())/D)continue;const v=Math.floor(w/T),I=Math.floor(M/T),k=(N+1.6577777777777776/H*w)*t(),L=(N+.88/X*M)*t();if(!n&&(r||i)&&(k<o||k>a||L<s||L>g))continue;const B=n&&u[v][I]<d||r&&u[v][I]<d||i&&c;let R=l.isBackground?1:((h[f].length-m)/h[f].length)**z.aDRP;if(x&&(R*=1-x),R>.001){let n;if("Layered"===E)n=e.color(...B?l.alternateColor:l.color);else if("Gradient"===E){const t=B?p:y;n=l.isBackground?e.color(...B?A.bg:S.bg):G(t[0],t[1],w/H)}e.fill(e.hue(n),e.saturation(n),e.lightness(n),e.alpha(n)*R),e.ellipse(L,k,.001*t())}}if(!n){if(r){if(l===h)return e.noLoop(),r=!1,!0;l++}i&&(d+=c?1:-1)}}t.setup=()=>{!function(){g=[...J(),..._];for(let t=0;t<g.length;t++){const r=g[t],a={template:[],detail:[],columnLayers:[],height:r.layerHeight??0,isBackground:r.isBackground,isInverted:r.isInverted,color:r.isBackground?S.bg:o(S.fg),alternateColor:r.isBackground?A.bg:o(A.fg)},l=H/r.td;a.template=new Array(r.td+1).fill(void 0);for(const{x:t,y:e}of r.tG)a.template[Math.round(t*r.td)]={x:Math.round(t*r.td)/r.td*H,y:e,isGuideline:!0};for(let t=0;t<a.template.length;t++){const e=t*l;if(null==a.template[t]){const o=r.tG.findIndex((e=>e.x>t/r.td))-1,l=r.tG[o];if(null==l)continue;const i=r.tG[o+1];if(null==i)continue;const s=l.y+(i.y-l.y)*(e-l.x*H)/(i.x*H-l.x*H);let c;for(;;){if(r.isBackground){c=s;break}if(c=s+n(-r.tm,r.tm),l.y===i.y)break;if(!(c>=Math.max(l.y,i.y)||c<=Math.min(l.y,i.y)))break}a.template[t]={x:e,y:c}}}a.template=a.template.filter(Boolean);let i,c=a.template[0].y;for(let t=1;t<a.template.length;t++){i=a.template[t].y;const e=a.template[t].x,o=Math.round(r.dd/r.td),s=l/o;for(let l=0;l<o;l++){const o=a.template[t-1].x+l*s;a.detail.push({x:o,y:c});const d=s*(i-c)/(e-o);c+=n(d-r.dm,d+r.dm)}}a.detail.push({x:a.template[a.template.length-1].x,y:c});for(let o=0;o<3;o++){const o=[],l=Math.min(...a.detail.map((t=>t.y))),i=Math.max(...a.detail.map((t=>t.y))),c=!a.isInverted||a.isBackground?Math.min(i+a.height,X):Math.max(l-a.height,0),d=1/z.xDen,h=Math.round(a.detail[0].x*z.xDen/H),u=Math.round(a.detail[a.detail.length-1].x*z.xDen/H)-h;for(let l=0;l<u;l++){const i=(h+l)*d*H,f=(a.detail.length-1)*l/(u-1)%1,g=Math.floor((a.detail.length-1)*l/(u-1)),m=Math.ceil((a.detail.length-1)*l/(u-1));let y,p;a.isBackground?a.isInverted?(y=1-a.height+n(-.3,.3),p=1):(y=0,p=a.height+n(-.3,.3)):(y=a.detail[g].y+f*(a.detail[m].y-a.detail[g].y),p=a.isInverted?c-(1-c)*e():c+(1-c)*e());const w=!a.isInverted||a.isBackground?Math.round(z.yDen*(p-y))*1.25**t:Math.round(z.yDen*(y-p))*1.25**t,M=!a.isInverted||a.isBackground?1/(w-1)*(p-y):1/(w-1)*(y-p);y+=n(-z.eYDis*M,z.eYDis*M);const G=[];for(let t=0;t<w;t++){const o=!a.isInverted||a.isBackground?y+t*M+M*n(-z.yDis/2,z.yDis/2):y-t*M+M*n(-z.yDis/2,z.yDis/2),l=i+(d/2+d*n(.5*-z.xDis,.5*z.xDis)+z.xDisp(t,a.isBackground))*H;G.push(V(l,o)?void 0:{x:l,y:o,isInSun:L(l,o,W,r.isBackground,s),resolutionThreshold:e()})}o.push(G)}a.columnLayers.push(o)}m.push(a)}}(),y=M(S),p=a(M(A)),u=new Array(Math.ceil(H/T)).fill(0).map((t=>new Array(Math.ceil(X/T)).fill(0))),h=u.flat().length;const r=a(new Array(h).fill(0).map(((t,e)=>e)));for(let t=0;t<u.length;t++)for(let e=0;e<u[t].length;e++)u[t][e]=r[t*u[t].length+e];f=new Array(Math.ceil(H/T)).fill(0).map((t=>new Array(Math.ceil(X/T)).fill(0)));const l=a(new Array(h).fill(0).map(((t,e)=>e)));for(let t=0;t<f.length;t++)for(let e=0;e<f[t].length;e++)f[t][e]=l[t*f[t].length+e];w(),d=Math.floor(j*h),null!=Z&&(d=Z),t.randomSeed(1e3*e()),t.noiseSeed(1e3*e()),t.noiseDetail(2),t.createCanvas(Math.round(1*O()),Math.round(P*O())),t.colorMode(t.HSL),t.angleMode(t.DEGREES),t.frameRate(60)},t.draw=()=>{if(x(O,t)&&(null!=Q||null!=Z))if(null!=Z){if(t.save(`corral-${tokenData.hash}-${Z}.png`),Z>0){let t=`${window.location.protocol}//${window.location.host+window.location.pathname}?glitchDownloadIndex=${Z-1}`;K>0&&(t+=`&size=${K}`),setTimeout((()=>window.location.href=t),3e3)}}else if(null!=Q){const e={A:"Starlet",B:"Leaf",C:"Sun",D:"Precious",E:"Carnation",F:"Pipe",G:"Gorgonian",H:"Bubble",I:"Vase"},n={A:"North Pacific",B:"South Pacific",C:"North Atlantic",D:"South Atlantic",E:"Arctic",F:"Southern"};if(t.save(`corral-${e[B]}-${n[U.code]}-${tokenData.hash}-${Q}.png`),Q>1){let t=`${window.location.protocol}//${window.location.host+window.location.pathname}?downloadIndex=${Q-1}`;K>0&&(t+=`&size=${K}`),setTimeout((()=>window.location.href=t),3e3)}}},t.windowResized=()=>{var e;[/HeadlessChrome/i].some((t=>navigator.userAgent.match(t)))||(w(),e=Math.min(window.innerHeight/P,window.innerWidth),q=e,t.resizeCanvas(1*O(),P*O()))},t.keyPressed=()=>{const e={48:0,49:.25,50:.5,51:.75,52:1}[t.keyCode];if(null!=e&&(w(),d=Math.floor(e*h),console.log(`Setting glitch percentage to ${Math.round(100*e)}%`),t.loop()),83===t.keyCode){if(r)return;i&&(i=!1,t.frameRate(60)),console.log("Downloading print...");const e=t.createGraphics(Math.round(3946),Math.round(7015.11111111111));e.colorMode(t.HSL),e.angleMode(t.DEGREES),e.pixelDensity(1),x((()=>3946),e,!0),e.save("corral-print.png"),console.log("Download of print complete.")}},t.mouseClicked=()=>{r||(i?(i=!1,t.frameRate(60)):(i=!0,t.frameRate(10),t.loop()))}})),console.log(tokenData)})();