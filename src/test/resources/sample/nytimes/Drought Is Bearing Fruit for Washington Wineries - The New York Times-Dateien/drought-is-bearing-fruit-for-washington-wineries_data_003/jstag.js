var OX=OX||function(f,i){var c={},b,j,h,l,a={},n,k,e="OX_sd";var m=function(){var o=0;return function(){if(o){return}g();o=1}}();function g(){var p,o;if(!k.isFramed()){p=k.getCookie(e);if(parseInt(p)){p++}else{p=1}o=new Date(k.now()+1200000).toGMTString();k.cookie(e,p,o);n._requestArgs.sd=p}}function d(s,q){var o,x,w,p={},u={},t,v,r;if(s.vars){for(var y in s.vars){if(s.vars.hasOwnProperty(y)){p["c."+escape(y)]=s.vars[y]}}s.vars=null}if(s.gw){t=s.gw;s.gw=null}if(""){u.oxns=""}if(j){u.ju=j}if(h){u.jr=h}u.cb=k.rand();v=k.merge([s,u,p,k.contextArgs()]);r=k.serialize(v);o=k.template(k.Templates.GW_URL,{gw:t||b,v:"1.0",r:q,q:r});x=k.ensureRightProtocol(o);w=k.template(k.Templates.SCRIPT,{src:o,id:"ox_"+q+"_"+k.rand()});k.write(w)}n=function(p){var o=new OX.AdRequest(p,{url:j=j||k.detectPageURL(),ref:h=h||k.detectRefererURL(),gw:b});c[o.get("o")]=o;return o};n._customVars={};n._requestArgs={};n.addHook=function(p,o){if(!a[o]){a[o]=[]}a[o].push(p)};n.addVariable=function(q,s,r,p){var o=n._customVars,t=(r||"c")+"."+q;if(p||!o[t]){o[t]=[]}o[t].push(s)};n.appendTag=function(o){k.write(o)};n.dflt=function(q,r,o){var p=c[q];p&&p.dflt(r,o)};n.ifrmHTML=function(q,r,o){var p=c[q];p&&p.ifrmHTML(r,o)};n.frameCreatives=function(o){l=o};n.getFramed=function(){return l};n.getHooksByType=function(o){return a[o]};n.init=function(){k=OX.utils;m()};n.load=function(o){n(o).load()};n.requestAd=function(o){n(o).fetchAds()};n.recordAction=function(o){d(o,n.Resources.RAJ)};n.recordSegments=function(q){var o,r={};if(q.expires){o=Date.parse(q.expires);if(o<new Date()){return}}for(var p in q){if(q.hasOwnProperty(p)){switch(p){case"add":r.as=q[p];break;case"del":r.ds=q[p];break;default:r[p]=q[p]}}}d(r,n.Resources.RSJ)};n.renderCreative=function(o){k.write(o)};n.setGateway=function(o){b=k.ensureRightProtocol(o)};n.setPageURL=function(o){j=o};n.setRefererURL=function(o){h=o};n.Hooks={ON_AD_REQUEST:1,ON_AD_RESPONSE:2,ON_ADUNIT_CREATED:3,ON_ADUNIT_INITIALIZED:4,ON_ADUNIT_RENDER_START:5,ON_ADUNIT_RENDER_FINISH:6,ON_AD_RENDER_START:7,ON_AD_RENDER_FINISH:8,ON_AD_DEFAULTED:9,ON_AD_NOT_DEFAULTED:10};n.Modes={IMMEDIATE:1,DEFERRED:2};n.Resources={ACJ:"acj",RAJ:"raj",RDF:"rdf",RR:"rr",RI:"ri",RSJ:"rsj",RE:"re"};n.GeoLocationSources={GPS:1,IP_ADDRESS:2,USER_REGISTRATION:3};n.shareFrameContents=false;return n}(window,document);
OX.utils=OX.utils||function(d,e,g){var h,b="w",c=true,a=1000000;function i(k,l,j){var n;try{n=(h.isIE&&k)?e.createElement('<iframe name="'+k+'">'):e.createElement("iframe")}catch(m){n=e.createElement("iframe")}n.setAttribute("width",l);n.setAttribute("height",j);n.setAttribute("frameSpacing","0");n.setAttribute("frameBorder","no");n.setAttribute("scrolling","no");if(k){n.setAttribute("id",k);n.setAttribute("name",k)}return n}function f(k,j){if(k.attachEvent){k.attachEvent("onload",j)}else{k.onload=j}}h={IMAGE_BEACON_TEMPLATE:"<div style='position:absolute;left:0px;top:0px;visibility:hidden;'><img src='{src}'/></div>",append:function(k,j){k.parentNode.insertBefore(j,k.nextSibling);return j},attachListener:function(l,j,k){if(l.addEventListener){l.addEventListener(j,k,false)}else{if(l.attachEvent){l.attachEvent("on"+j,k)}}},beacon:function(j){var k=h.ensureRightProtocol(j);(new Image()).src=k},getImgBeacon:function(j){var k=h.ensureRightProtocol(j);return h.template(h.IMAGE_BEACON_TEMPLATE,{src:k})},contextArgs:function(){var p=h.detectWindowDims(),l={res:screen.width+"x"+screen.height+"x"+screen.colorDepth,plg:h.detectPlugins(),ch:e.charset||e.characterSet,tz:(new Date()).getTimezoneOffset()},q=e.getElementsByTagName("meta"),j;if(p){l.ws=p[0]+"x"+p[1]}l.ifr=h.inIframe()?1:0;if(l.ifr){try{tWin=d.top;tDoc=d.top.document;tDims=h.detectWindowDimensions(tWin,tDoc);if(tDims){l.tws=tDims.width+"x"+tDims.height}}catch(k){}}else{l.tws=l.ws}for(var m=0;m<q.length;m++){j=q[m];if(j.name&&j.name==="viewport"){l.vmt=1;break}}if(OX.browser_id&&OX.browser_id.get()!=undefined){l.bi=OX.browser_id.get()}if(OX.tp_xdi_tapad){OX.tp_xdi_tapad.sync()}if(OX.tp_presync_criteo){var n=OX.tp_presync_criteo.get();l["tp.presync.criteo"]=n.id;l["tp.presync.criteo.status"]=n.status}if(OX.tp_presync_mediamath){var o=OX.tp_presync_mediamath.get();l["tp.presync.mediamath"]=o.id;l["tp.presync.mediamath.status"]=o.status}return l},create:function(k){var j=e.createElement("div");j.innerHTML=k;return j.firstChild},cookie:function(l,m,j){if(c){var k=l+"=";k+=(m||"")+";path=/;";if(h.defined(j)){k+="expires="+j+";"}try{e.cookie=k}catch(n){}}},createScript:function(k){var j=e.createElement("script");j.type="text/javascript";k.id&&(j.id=k.id);k.src&&(j.src=k.src);return j},defined:function(j){return typeof j!="undefined"},detectWindowDims:function(){var l=e.documentElement,j=d.innerWidth,k=d.innerHeight;j=h.defined(j)?j:l.clientWidth;k=h.defined(k)?k:l.clientHeight;if(h.defined(j)&&h.defined(k)){return[j,k]}},detectWindowDimensions:function(o,n){var m=n.documentElement,k=n.getElementsByTagName("body")[0],l=o.innerWidth||m.clientWidth||k.clientWidth,j=o.innerHeight||m.clientHeight||k.clientHeight;return{width:l,height:j}},detectPlugins:function(){var l,k="OX_plg",m="ShockwaveFlash.ShockwaveFlash",j={swf:{activex:[m,m+".3",m+".4",m+".5",m+".6",m+".7"],plugin:/flash/gim},sl:{activex:["AgControl.AgControl"],plugin:/silverlight/gim},pdf:{activex:["acroPDF.PDF.1","PDF.PdfCtrl.1","PDF.PdfCtrl.4","PDF.PdfCtrl.5","PDF.PdfCtrl.6"],plugin:/adobe\s?acrobat/gim},qt:{activex:["QuickTime.QuickTime","QuickTime.QuickTime.4"],plugin:/quicktime/gim},wmp:{activex:["WMPlayer.OCX"],plugin:/(windows\smedia)|(Microsoft)/gim},shk:{activex:["SWCtl.SWCtl","SWCt1.SWCt1.7","SWCt1.SWCt1.8","SWCt1.SWCt1.9",m+".1"],plugin:/shockwave/gim},rp:{activex:["RealPlayer","rmocx.RealPlayer G2 Control.1"],plugin:/realplayer/gim}};return function(){var q,r,o="",n=[];if(l){return l}try{if(e.cookie){q=e.cookie.split((escape(k)+"="));if(2<=q.length){r=q[1].split(";");if(r[0]){if(r[0].indexOf("|")>=0){return unescape(r[0].split("|").join(","))}}}}}catch(v){}for(var u in j){if(j.hasOwnProperty(u)){if(d.ActiveXObject){for(var t=0;t<j[u].activex.length;++t){try{ActiveXObject(j[u].activex[t]);n.push(u);break}catch(v){}}}else{for(var s=0;s<g.plugins.length;++s){if(g.plugins[s].name.match(j[u].plugin)){n.push(u);break}}}}}if(d.postMessage){n.push("pm")}l=o=n.join(",");h.cookie(k,n.join("|"));return o}}(),detectPageURL:function(){var j;try{j=top.location.href}catch(k){}return j||h.detectRefererURL()},detectProtocol:function(){return location.protocol},detectRefererURL:function(){var j=e.referrer;try{j=top.document.referrer}catch(m){if(parent){try{j=parent.document.referrer}catch(l){}}}if(!j&&opener){try{j=opener.location.href}catch(k){}}return j||""},each:function(m,n){if(h.isArray(m)){for(var l=0;l<m.length;l++){n(m[l],l)}}else{for(var j in m){if(m.hasOwnProperty(j)){n(j,m[j])}}}},ensureRightProtocol:function(k){var j;if(k){j=k.indexOf("//");if(j!=5&&j!=6){k="http://"+k}return(h.detectProtocol()=="https:")?k.replace("http:","https:"):k}},get:function(j){return e.getElementById(j)},getCookie:function(j){try{var k=e.cookie.split(j+"=");if(k.length==2){return k[1].split(";")[0]}}catch(l){}},getMedium:function(){return b},setMedium:function(j){b=j},ieVersion:(function(){var m=0,j,k;if(g){try{j=g.userAgent;if(g.appName=="Microsoft Internet Explorer"){k=new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");if(k.exec(j)!=null){m=parseFloat(RegExp.$1)}}else{if(g.appName=="Netscape"){k=new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})");if(k.exec(j)!=null){m=parseFloat(RegExp.$1)}}}}catch(l){}return m}})(),isArray:function(j){return Object.prototype.toString.call(j)==="[object Array]"},isEmpty:function(k){for(var j in k){if(k.hasOwnProperty(j)){return false}}return true},isFramed:function(){return d.self!=d.top},isIE:0,lastScript:function(){var j=e.getElementsByTagName("script");return j[j.length-1]},merge:function(m){var j,n;if(h.isArray(m)){j={};for(var l=0;l<m.length;l++){n=m[l];for(var k in n){if(n.hasOwnProperty(k)){j[k]=n[k]}}}}return j},now:function(){return(new Date()).getTime()},postMessage:function(k){var j=false;if(d.addEventListener){d.addEventListener("message",k,j)}else{if(d.attachEvent){d.attachEvent("onmessage",k,j)}}},produceFrame:function(j){var k,p='javascript:window["contents"]',w,y=j.hookNode,l=j.name,n=j.width,z=j.height,m=j.onStart,o=j.onFinish,t=j.onSuccess,s=l+"_contents",x=h.template(h.Templates.IFRAME_DOC,{title:j.title||"OpenX",head:j.headHTML,body:j.bodyHTML}),q=i(l,n,z);k=(h.isIE&&(h.ieVersion<11))||d.opera;if(k){q.src=p}if(y){if(j.replace){h.replace(y,q)}else{if(!e.body&&h.isFramed()){h.write("<body style='margin:0;padding:0'></body>");e.body.appendChild(q)}else{h.append(y,q)}}}if(k){try{o&&f(q,o);q.contentWindow.contents=x;m&&m();q.src=p}catch(r){var v=q;q=i(l,n,z);d[s]=x;p=h.template(h.Templates.IFRAME_JS_URI,{contentsVar:s,domain:e.domain});o&&f(q,o);q.src=p;m&&m();h.replace(v,q)}}else{try{w=q.contentWindow||q.contentDocument;if(w.document){w=w.document}o&&f(q,o);if(w){w.open("text/html","replace");m&&m();w.write(x);w.close()}}catch(u){if(!j.isRetry){j.hookNode=q;j.isRetry=1;d.setTimeout(function(){h.produceFrame(j)},0)}}}t&&t(q)},rand:function(){return Math.floor(Math.random()*9999999999)+""},remove:function(j){j.parentNode.removeChild(j)},replace:function(k,j){k.parentNode.replaceChild(j,k);return j},replaceOrRemove:function(j,l,k){if(!j){l&&h.remove(l)}else{if(l){return h.replace(l,j)}else{return h.append(k,j)}}},serialize:function(k){var m="",l;if(typeof k==="object"){for(var j in k){if(k.hasOwnProperty(j)){l=k[j];if(h.defined(l)&&(l!==null)){if(h.isArray(l)){l=l.join(",")}m+=j+"="+escape(l)+"&"}}}}if(m.length>1){m=m.substr(0,m.length-1)}return m},store:function(){var o="1",p=630720000000,m="|",r,j,q,l={};try{r=localStorage;r.setItem(o,o);r.removeItem(o);j=1}catch(n){if(g.cookieEnabled&&c){q=1}}function k(v,u){var x="OX_"+v,t,s;if(j){s=r.getItem(x);u&&r.removeItem(x)}else{if(q){s=h.getCookie(x);u&&h.cookie(x)}else{s=l[x];u&&(delete l[x])}}if(s){t=s.split(m);for(var w=0;w<t.length;w++){t[w]=unescape(t[w])}if(t.length===1){return t[0]}else{return t}}}return{put:function(u,y){var w="OX_"+u,x,s,t;if(h.isArray(y)){s=[];for(var v=0;v<y.length;v++){s.push(escape(y[v]))}x=s.join(m)}else{x=escape(y)}if(j){r.setItem(w,x)}else{if(q){t=new Date(h.now()+p).toGMTString();h.cookie(w,x,t)}else{l[w]=x}}},get:function(s){return k(s)},remove:function(s){return k(s,1)}}}(),template:function(t,o,k,p){o=o||{};var m="",l=0,r="",j,k=k||"{",p=p||"}",s,n;for(var q=0;q<t.length;q++){j=t.charAt(q);switch(j){case k:l=1;break;case p:s=o[m];if(h.defined(s)&&s!=null){n=s}else{n=""}r+=n;l=0;m="";break;default:if(l){m+=j}else{r+=j}}}return r},Templates:{SCRIPT:"<script type='text/javascript' id='{id}' src='{src}'><\/script>",IFRAME_DOC:"<!DOCTYPE html><html><head><title>{title}</title><base target='_top'/>{head}</head><body style='margin:0;padding:0'>{body}</body></html>",GW_URL:"{gw}/{v}/{r}?{q}",IFRAME_JS_URI:"javascript:document.open();document.domain='{domain}';document.write(window.parent['{contentsVar}']);window.parent['{contentsVar}']=null;setTimeout('document.close()',5000)"},write:function(j){e.readyState!=="complete"&&e.write(j)},isCookieEnabled:function(){return g.cookieEnabled&&c},isValidDIM:function(j){if(j>a){return false}else{if(isNaN(j)){return false}}return true},isEmpty:function(j){for(var k in j){if(j.hasOwnProperty(k)){return false}}return true},isSubset:function(k,j){var m,l;if(!h.isValidArray(k)||!h.isValidArray(j)){return false}if(k.length<j.length){return false}for(m=0;m<j.length;m++){for(l=0;l<k.length;l++){if(j[m]===k[l]){break}if(l===k.length-1){return false}}}return true},isValidArray:function(j){return j&&h.isArray(j)&&j.length!==0},inIframe:function(){return d.self!==d.top},getPosition:function(j){var k=yPosition=0;if(j==null){return null}while(j){if(j.tagName!="SCRIPT"){k+=j.offsetLeft;yPosition+=j.offsetTop;j=j.offsetParent}else{j=j.previousElementSibling}}return{left:Math.round(k),top:Math.round(yPosition)}},getPositionById:function(k,l){var j=k.getElementById(l);return h.getPosition(j)},getAdPosition:function(m,n){var k,j,p=d,o=d.document;try{m=d.frameElement?d.frameElement.parentNode:m;if(h.inIframe()){p=d.parent;o=d.parent.document}k=h.detectWindowDimensions(p,o);if(!h.isValidDIM(k.width)||!h.isValidDIM(k.height)){return null}if(n){j=h.getPositionById(o,m);if(j==null){return null}}else{j=h.getPosition(m)}if(!h.isValidDIM(j.left)||!h.isValidDIM(j.top)){return null}return{browserDims:k,adUnitStartPos:j}}catch(l){return null}}};if(h.ieVersion){h.isIE=1}return h}(window,document,navigator);
/*@cc_on OX.utils.isIE=1;@*/;
OX.AdRequest=OX.AdRequest||function(K,A){var O=OX.utils,e=O.rand(),F,l={},v,t=false,h,o,m={},f={},x,g,a,I,y,s={},P=false,u={o:e},q={mode:null,auid:null,record_tmpl:null,ad_units:[]},C=2048,w="OX_"+e,G="ox_"+OX.Resources.ACJ+"_"+e,L="<iframe src='{src}' width='0' height='0' style='display:none;'></iframe>",j=this,M=OX.Hooks,E=OX.Modes;function r(){return(u.rm>0)&&(u.rd>0)&&(u.rc<u.rm)}function d(){if((u.rd>0)&&(u.rm>0)&&(!u.rc)){u.rc=0}}function p(){var k=j.createAdRequestURL(),R=u.rc&&("_"+u.rc),Q=G+(R||""),i=O.createScript({id:Q,src:k});return i}function b(T,S){var k=f[T]||[],Q=OX.getHooksByType(T)||[],V=Q.concat(k),U;if(V){for(var R=0;R<V.length;R++){U=V[R];U.apply(this,S)}}}function D(Q){var i,R,k;if(Q){i=O.template(L,{src:Q});k=O.create(i);if(a){O.replace(a,k)}else{if(R=document.body){R.appendChild(k)}}}}function H(){u.rc++;setTimeout(function(){j.refreshAds()},1000*u.rd)}function B(k){var i;if(k){i=document.createComment(" "+k.replace(/--/g,"- -"))}g=O.replaceOrRemove(i,g,x)}function n(){var k="ma",i="js";O.setMedium(k);F=F.replace(/\/m?w$/,"/"+k);u.sp=i;delete u.ju;delete u.jr}function z(k,i,S){var R=new XMLHttpRequest(),T=k.split("?");try{T[1]=T[1].replace(/(^|&)callback=[^&]*$/,"");T[1]=T[1].replace(/(^|&)callback=.*?&/,"$1")}catch(Q){}R.open("POST",T[0]);R.setRequestHeader("Content-Type","application/x-www-form-urlencoded");R.onreadystatechange=function(){if(this.readyState===4){if(this.status===200){i&&i(JSON.parse(this.responseText))}else{P=false;s={};delete u.openrtb;S&&S()}}};R.send(T[1])}function c(){var S,W,R,k,V,T="",U=[];if(true&&!j.isBidderEnabled()){S=u.auid||[];for(var Q=0;Q<S.length;Q++){W=S[Q];R=l[W];k=R.get("anchor")||O.lastScript();V=O.getAdPosition(k,false);if(V){T=V.browserDims.width+"x"+V.browserDims.height;U.push(V.adUnitStartPos.left+","+V.adUnitStartPos.top)}else{U.push("")}}j.setBrowserDims(T);j.setAdUnitLocation(U.join("|"))}}j.addAdUnit=function(Q){var k=j.getOrCreateAdUnit(Q),i;if(!u.auid){u.auid=[]}u.auid.push(Q)};j.addContentTopic=function(i){u.tid=u.tid||[];u.tid.push(i)};j.addHook=function(k,i){if(!f[i]){f[i]=[]}f[i].push(k)};j.addPage=function(i){u.pgid=u.pgid||[];u.pgid.push(i)};j.addVariable=function(k,R,Q,i){var S=(Q||"c")+"."+k;if(i||!m[S]){m[S]=[]}m[S].push(R)};j.createAdRequestURL=function(){var k,i,R="ai=20ce173e-9743-4ab5-6ef2-bec8d50b1f9f";d();c();if(!O.isEmpty(s)){try{u.openrtb=JSON.stringify(s)}catch(Q){}}i=O.merge([u,m,O.contextArgs(),OX._customVars,OX._requestArgs]);R&&(R+="&");R+=O.serialize(i);if(I){R+="&r="+escape(I)}k=O.template(O.Templates.GW_URL,{gw:F,v:"1.0",r:OX.Resources.ACJ,q:R});if(!O.isEmpty(s)&&k.length>C){P=true}return k};j.dflt=function(Q,i){var k=l[Q];k&&k.dflt(i)};j.ifrmHTML=function(Q,i){var k=l[Q];k&&k.set("iframe_html",i)};j.disableFeature=function(i){u.df=u.df||[];u.df.push(i)};j.disableMarket=function(){j.disableFeature("m")};j.disableSegmentation=function(){u.ns=1};j.enableFeature=function(i){u.ef=u.ef||[];u.ef.push(i)};j.enableMarket=function(){j.enableFeature("m")};j.enableSegmentation=function(){u.ns=null};j.fetchAds=function(){var k,i;b(M.ON_AD_REQUEST,[j]);k=j.createAdRequestURL();if(P){z(k,window[w],j.fetchAds)}else{i=O.template(O.Templates.SCRIPT,{src:k,id:G});O.write(i)}};j.fetchAdsComplete=function(){switch(q.mode){case E.IMMEDIATE:j.showAdUnit(q.auid);break;case E.DEFERRED:for(var i in l){if(l.hasOwnProperty(i)){if(l[i].get("anchor")){j.showAdUnit(i)}}}break;default:}if(u.auid&&u.auid.length===1){if(u.rc===0){j.addHook(function(){r()&&H()},OX.Hooks.ON_ADUNIT_RENDER_FINISH)}}else{r()&&H()}};j.frameCreatives=function(i){v=i};j.getOrCreateAdUnit=function(i){if(!l[i]){l[i]=new OX.AdUnit(i,j.get("o"));q.ad_units.push(l[i]);b(M.ON_ADUNIT_CREATED,[l[i]])}return l[i]};j.get=function(i){return q.hasOwnProperty(i)?q[i]:u[i]};j.getQueryArgs=function(){return u};j.getProperties=function(){return q};j.isBidderEnabled=function(){if(OX.dfp_bidder_config){return !O.isEmpty(OX.dfp_bidder_config)}return false};j.isResponseEmpty=function(){var k,i;if(!(y&&y.ads&&y.ads.adunits&&(k=y.ads.adunits[0])&&(i=k.chain)&&i.length)){return true}else{return false}};j.getRecordTemplate=function(){if(y&&y.ads){return y.ads.record_tmpl}return""};j.loadAdResponse=function(Q){var S=Q.ads,U=Q.ads.adunits,k,T;x=x||O.get(G);y=Q;D(S.pixels);B(q.debug=S.debug);for(var R=0;R<U.length;R++){k=U[R];if(k.refresh_delay){u.rd=k.refresh_delay}if(k.refresh_max){u.rm=k.refresh_max}d();if(r()){v=1}T=function(i){b(M.ON_ADUNIT_INITIALIZED,[i])};j.getOrCreateAdUnit(k.auid).load({adunit:k,rt:S.record_tmpl,oninit:T,chain:S.chain})}};j.load=function(){var k,Q,i=j.createAdRequestURL();b(M.ON_AD_REQUEST,[j]);v=1;if(P){z(i,window[w],j.load)}else{k=p();Q=document.head||document.body;if(Q){Q.appendChild(k);x=k}else{x=O.append(O.lastScript(),k)}}};j.refreshAds=function(){var k,i=j.createAdRequestURL();b(M.ON_AD_REQUEST,[j]);if(P){z(i,window[w],j.load)}else{k=p();x=O.replace(x,k)}};j.setAdUnitFallback=function(k,i){j.getOrCreateAdUnit(k).set("fallback",i)};j.setAdUnitImpBeacon=function(k,i){j.getOrCreateAdUnit(k).set("imp_beacon",i)};j.setAdUnitMarketFloor=function(k,i){j.getOrCreateAdUnit(k);u.aumf=u.aumf||[];u.aumf.push(k+":"+i)};j.setAdUnitNGFloor=function(k,i){j.getOrCreateAdUnit(k);u.aungf=u.aungf||[];u.aungf.push(k+":"+i)};j.setAdUnitSlotId=function(k,i){j.getOrCreateAdUnit(k).set("anchor",O.get(i))};j.setAnchorTarget=function(i){u.tg=i};j.setBrowserDims=function(i){u.dims=i};j.setAdUnitLocation=function(i){u.adxy=i};j.setClickRedirectURL=function(i){I=i};j.setGateway=function(i){F=O.ensureRightProtocol(i)};j.setMode=function(i){q.mode=i};j.setPageURL=function(i){u.ju=O.ensureRightProtocol(i)};j.setRefererURL=function(i){u.jr=i};j.setRefreshDelay=function(i){u.rd=i};j.setRefreshMax=function(i){u.rm=i};j.setTest=function(i){u.test=i?"true":null};j.setUserID=function(i){u.xid=i};j.setBidderEligibility=function(i){u.be=i?1:0};j.setCacheEnabled=function(i){u.ce=i?1:0};j.setCoords=function(i){if(i.latitude&&i.longitude){u.lat=i.latitude;u.lon=i.longitude;u.lt=i.source||OX.GeoLocationSources.GPS}};j.setAdSizes=function(i){u.aus=u.aus?u.aus+"|":"";u.aus=u.aus+i.join(",")};j.setAppName=function(i){if(i){u["app.name"]=i;n()}};j.setAppBundleID=function(i){if(i){u["app.bundle"]=i;n()}};j.setAppStoreURL=function(i){if(i){u.url=O.ensureRightProtocol(i);n()}};j.setAPIFrameworks=function(i){if(i.toString()){u.af=i.toString();n()}};j.addDeviceID=function(Q,R){var i={"did.ia":"did.iat","did.adid":"did.adid.enabled"},k;if(Q.type&&Q.id){k=(R||"did.")+Q.type;u[k]=Q.id;if(i.hasOwnProperty(k)&&Q.hasOwnProperty("tracking")){u[i[k]]=!!Q.tracking}n()}};j.setOpenRTBParameters=function(k){var i;if(Object.prototype.toString.call(k)==="[object Object]"){s=k}else{if(typeof k==="string"){try{i=JSON.parse(k);this.setOpenRTBParameters(i)}catch(Q){}}}};j.addOpenRTBParameter=function(U,V){var T=U.split("."),R=s,W,Q,k;for(var S=0;S<T.length;S++){W=T[S];if(S===T.length-1){R[W]=V;break}Q=W.match(/(\w+)\[(\d+)\]/);if(Q){W=Q[1];k=Q[2];R[W]=R[W]||[];R[W][k]=R[W][k]||{};R=R[W][k]}else{R[W]=R[W]||{};R=R[W]}}};j.showAdUnit=function(Q){var k=l[Q],i;if(k){i=function(){if(t){return 0}if(k.get("framed")){return 1}if(O.defined(v)){return v}return !!OX.getFramed()}();k.render({framed:i,onAdUnitRenderStart:function(){b(M.ON_ADUNIT_RENDER_START,[k])},onAdUnitRenderFinish:function(){b(M.ON_ADUNIT_RENDER_FINISH,[k])},onAdRenderStart:function(){b(M.ON_AD_RENDER_START,[k])},onAdRenderFinish:function(S,T,R){b(M.ON_AD_RENDER_FINISH,[S,T,R])},onAdDefaulted:function(S,T,R){b(M.ON_AD_DEFAULTED,[S,T,R])},onAdNotDefaulted:function(S,T,R){b(M.ON_AD_NOT_DEFAULTED,[S,T,R])},shareFrameContents:OX.shareFrameContents})}};window[w]=function(i){j.loadAdResponse(i);b(M.ON_AD_RESPONSE,[j]);j.fetchAdsComplete()};u.callback=w;j.setGateway(K&&K.gw||A.gw);j.setPageURL(K&&K.url||A.url);j.setRefererURL(K&&K.ref||A.ref);if(!window.postMessage){j.disableFeature("c")}if(K){j.setMode(E.IMMEDIATE);q.auid=K.auid;K.auid&&j.addAdUnit(q.auid);K.tid&&j.addContentTopic(K.tid);K.aumf&&j.setAdUnitMarketFloor(q.auid,K.aumf);K.aungf&&j.setAdUnitNGFloor(q.auid,K.aungf);K.tg&&j.setAnchorTarget(K.tg);K.imp_beacon&&j.setAdUnitImpBeacon(q.auid,K.imp_beacon);K.slot_id&&j.setAdUnitSlotId(q.auid,K.slot_id);K.fallback&&j.setAdUnitFallback(q.auid,K.fallback);K.test&&j.setTest(K.test);K.userid&&j.setUserID(K.userid);K.r&&j.setClickRedirectURL(K.r);K.rd&&j.setRefreshDelay(K.rd);K.rm&&j.setRefreshMax(K.rm);K.md&&j.disableMarket();K.ns&&j.disableSegmentation();K.coords&&j.setCoords(K.coords);K.openrtb&&j.setOpenRTBParameters(K.openrtb);K.appName&&j.setAppName(K.appName);K.appBundle&&j.setAppBundleID(K.appBundle);K.appStoreURL&&j.setAppStoreURL(K.appStoreURL);K.af&&j.setAPIFrameworks(K.af);if(K.deviceIDs){for(var N=0;N<K.deviceIDs.length;N++){j.addDeviceID(K.deviceIDs[N])}}if(K.vars){for(var J in K.vars){K.vars.hasOwnProperty(J)&&j.addVariable(J,K.vars[J])}}if(K.ef){for(var N=0;N<K.ef.length;N++){j.enableFeature(K.ef[N])}}if(K.df){for(var N=0;N<K.df.length;N++){j.disableFeature(K.df[N])}}if(O.defined(K.frameCreatives)){v=K.frameCreatives}K.forceUnframed&&(t=true);K.onResponse&&j.addHook(K.onResponse,M.ON_AD_RESPONSE);K.onAdUnitRender&&j.addHook(K.onAdUnitRender,M.ON_ADUNIT_RENDER_START);K.onAdUnitLoaded&&j.addHook(K.onAdUnitLoaded,M.ON_ADUNIT_RENDER_FINISH)}else{j.setMode(E.DEFERRED)}};
OX.AdUnit=OX.AdUnit||function(L,i){var N=OX.utils,g=this,x=OX.Resources,M=L,A=i,K,p,F,j,C,y,q={adunit_id:L,anchor:null},s=false,o="dflt",f="loaded",c="flash",a="ox_"+A+"_"+M,l=parseInt("2500")||2500,O=0,B="<script type='text/javascript'>var OX_swfobject = window.parent.OX.swfobject(window, document, navigator);<\/script>",u,h=a+"_ch_{i}",v=N.IMAGE_BEACON_TEMPLATE,E="<script type='text/javascript'>(new Image()).src='{src}'{suffix}<\/script>",t="<script type='text/javascript'>function [fn](e) {if (e.data=='[data]') {window.parent.OX.dflt('[rid]','[auid]',[idx]);}}if (window.addEventListener) {addEventListener('message', [fn], false);} else {attachEvent('onmessage', [fn]);}<\/script>",w="<script type='text/javascript'>window.onload = function() {var html = document.documentElement.innerHTML;window.parent.OX.ifrmHTML('[rid]', '[auid]', html);};<\/script>";var D=function(P){this.renderStrategy=P};D.prototype.render=function(P){return this.renderStrategy(P)};function I(P){n(P)}function n(Q){var S=q.fallback,R,P,T=function(){Q.onAdRenderFinish(g,K,0);Q.onAdUnitRenderFinish()};if(K&&K.html&&(g.get("type")!==c)){R=N.template(u,{medium:N.getMedium(),rtype:x.RI,txn_state:K.ts});P=z(v,{src:R});K.html=K.html+P}if(g.get("is_fallback")){S=q.fallback||(K&&K.html)}else{if(K&&K.html){S=K.html+(q.imp_beacon||"")}}if(S){Q.onAdUnitRenderStart();if(Q.framed){J(S,a,g.get("type")===c?B:"",g.get("width")||g.get("primary_width"),g.get("height")||g.get("primary_height"),Q.onAdRenderStart,T,Q.shareFrameContents)}else{Q.onAdRenderStart();r(S);T()}}}function H(P){y=N.now();C=P;C.onAdUnitRenderStart();d(0)}function k(Q){var P,R;if(K&&K.html){P=N.template(u,{medium:N.getMedium(),rtype:x.RR,txn_state:K.ts});R=z(v,{src:P});K.html=R+K.html}n(Q)}function d(U){var W="",R="",aa="",V="",Q,X,Y,T="",S,Z="",P=q.chain,ab=N.template(h,{i:U});K=P[U];if(!C.renderTest){Y=N.template(u,{medium:N.getMedium(),rtype:x.RR,txn_state:K.ts});if(s&&(U<P.length-1)){Y+="&cts=";T=" + new Date().getTime();"}R=z(E,{src:Y,suffix:T})}if(U<P.length-1){W=N.template(t,{fn:"OX_dflt",data:"dflt",rid:A,auid:M,idx:U},"[","]");K.dflting=1;Q=e(U);X=function(){Q();C.onAdRenderFinish(g,K,U)}}else{if(g.get("type")===c){W=B}else{if(!C.renderTest){S=N.template(u,{medium:N.getMedium(),rtype:x.RI,txn_state:K.ts});aa=z(E,{src:S,suffix:Z})}}if(g.get("is_fallback")){V=q.fallback||(K&&K.html)}else{if(K&&K.html){V=K.html+(q.imp_beacon||"")}}X=function(){C.onAdRenderFinish(g,K,U);C.onAdUnitRenderFinish()}}J(R+(V||K.html)+aa,ab,W,K.width,K.height,C.onAdRenderStart,X,C.shareFrameContents)}function G(){return(N.now()-y)>q.chain_timeout}function e(P){return function(){window.setTimeout(function(){var S=q.chain[P],Q=P+1,R;S[f]=1;if(S.hasOwnProperty(o)){if(G()){Q=q.chain.length-1}d(Q)}else{C.onAdNotDefaulted(g,S,P);if(!C.renderTest){R=N.template(u,{medium:N.getMedium(),rtype:x.RI,txn_state:K.ts});if(s){R+="&cte="+N.now()}N.beacon(R)}C.onAdUnitRenderFinish()}},O)}}function J(S,P,T,X,R,Y,U,Z){var W=(q.pre_html||"")+S+(q.post_html||""),V="",Q;if(Z){V=N.template(w,{rid:A,auid:M},"[","]")}Q=(q.head_html||"")+T+V;N.produceFrame({hookNode:q.anchor||N.lastScript(),replace:!!q.anchor,name:P,headHTML:Q,bodyHTML:W,width:X,height:R,onStart:Y,onFinish:U,onSuccess:function(aa){q.anchor=aa}});g.set("iframe_id",P)}function r(P){var R=(q.pre_html||"")+P+(q.post_html||""),Q=R;if(!document.body&&N.isFramed()){Q="<body style='margin:0;padding:0'>"+R+"</body>"}N.write(R)}function b(P){var Q=N.template(u,{medium:N.getMedium(),rtype:x.RDF,txn_state:P.ts});if(s){Q+="&cte="+N.now()}N.beacon(Q)}var m=[{shouldDefer:function(){return(window.mraid&&typeof mraid.isViewable==="function"&&!mraid.isViewable())},defer:function(P){mraid.addEventListener("viewableChange",(function(){var Q=false;return function(R){if(!Q&&R){N.beacon(P);Q=true}}})())}},{shouldDefer:function(){return typeof trackImpressionHelper==="function"},defer:function(P){var Q=trackImpressionHelper;trackImpressionHelper=function(){N.beacon(P);Q()}}}];function z(S,V,W,T){var Q=V.src,P="",U;for(var R=0;R<m.length;R++){U=m[R];if(U.shouldDefer()){U.defer(Q);return P}}P=N.template(S,V,W,T);return P}g.dflt=function(Q){var R=q.chain[Q],P=Q+1;if(R[o]){return}R[o]=1;b(K);C.onAdDefaulted(g,R,Q);if(!C.renderTest){if(R.hasOwnProperty(f)){if(G()){P=q.chain.length-1}d(P)}}};g.get=function(P){return q.hasOwnProperty(P)?q[P]:(K&&K[P])};g.set=function(P,Q){q[P]=Q};g.getProperties=function(){return N.merge([q,K])};g.load=function(R){var Q=R.adunit,S;u=R.rt;for(var P in Q){if(Q.hasOwnProperty(P)){q[P]=Q[P]}}if(q.size){S=q.size.split("x");q.primary_width=S[0];q.primary_height=S[1]}q.chain_timeout=q.chain_timeout||l;if(R.chain){if(q.chain&&q.chain.length>0){if(q.chain.length>1){p=new D(H)}else{K=q.chain&&q.chain[0];p=new D(k)}}else{p=new D(I)}}else{K=q.chain&&q.chain[0];p=new D(n)}F=1;j=0;R.oninit&&R.oninit(g)};g.render=function(Q){var T,P=g.get("height"),R=g.get("width");if(N.isFramed()){try{T=N.detectWindowDimensions(window,document);if(T.height<P){window.frameElement.height=P;window.frameElement.style.height=P+"px"}if(T.width<R){window.frameElement.width=R;window.frameElement.style.width=R+"px"}}catch(S){}}if(j){return}g.set("framed",Q.framed);if(!F){p=new D(I)}p.render(Q);j=1}};
/*! SWFObject v2.2 <http://code.google.com/p/swfobject/> is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> */
;OX.swfobject=function(N,j,t){var P=OX.utils.defined,r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",N=N||window,j=j||document,t=t||navigator,T=false,U=[h],o=[],M=[],H=[],l,Q,D,B,I=false,a=false,n,F,m=true,L=function(){var aa=P(j.getElementById)&&P(j.getElementsByTagName)&&P(j.createElement),ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(P(t.plugins)&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(P(t.mimeTypes)&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(P(N.ActiveXObject)){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!L.w3){return}if((P(j.readyState)&&j.readyState=="complete")||(!P(j.readyState)&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!I){if(P(j.addEventListener)){j.addEventListener("DOMContentLoaded",f,false)}if(L.ie&&L.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(N==top){(function(){if(I){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(L.wk){(function(){if(I){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(I){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}I=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function J(X){if(I){X()}else{U[U.length]=X}}function s(Y){if(P(N.addEventListener)){N.addEventListener("load",Y,false)}else{if(P(j.addEventListener)){j.addEventListener("load",Y,false)}else{if(P(N.attachEvent)){i(N,"onload",Y)}else{if(typeof N.onload=="function"){var X=N.onload;N.onload=function(){X();Y()}}else{N.onload=Y}}}}}function h(){if(T){V()}else{G()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(P(Z.GetVariable)){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");L.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;G()})()}else{G()}}function G(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(L.pv[0]>0){var ae=c(Y);if(ae){if(E(o[af].swfVersion)&&!(L.wk&&L.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}O(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&P(Z.SetVariable)){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(P(Y.SetVariable)){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&E("6.0.65")&&(L.win||L.mac)&&!(L.wk&&L.wk<312)}function O(aa,ab,X,Z){a=true;D=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(!P(aa.width)||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(!P(aa.height)||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=L.ie&&L.win?"ActiveX":"PlugIn",ac="MMredirectURL="+N.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(P(ab.flashvars)){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(L.ie&&L.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(L.ie&&L.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(L.win&&L.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(L.wk&&L.wk<312){return X}if(aa){if(!P(ai.id)){ai.id=Y}if(L.ie&&L.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";M[M.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(L.ie&&L.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);H[H.length]=[Z,X,Y]}function E(Z){var Y=L.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(L.ie&&L.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;F=null}if(!n||F!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(L.ie&&L.win&&P(j.styleSheets)&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}F=X}if(L.ie&&L.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&P(j.createTextNode)){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(I&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function K(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&P(encodeURIComponent)?encodeURIComponent(Y):Y}var d=function(){if(L.ie&&L.win){window.attachEvent("onunload",function(){var ac=H.length;for(var ab=0;ab<ac;ab++){H[ab][0].detachEvent(H[ab][1],H[ab][2])}var Z=M.length;for(var aa=0;aa<Z;aa++){y(M[aa])}for(var Y in L){L[Y]=null}L=null;for(var X in OX_swfobject){OX_swfobject[X]=null}OX_swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(L.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(L.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(L.w3&&!(L.wk&&L.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);J(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(P(am.flashvars)){am.flashvars+="&"+ai+"="+escape(Z[ai])}else{am.flashvars=ai+"="+escape(Z[ai])}}}if(E(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;O(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:L,getFlashPlayerVersion:function(){return{major:L.pv[0],minor:L.pv[1],release:L.pv[2]}},hasFlashPlayerVersion:E,createSWF:function(Z,Y,X){if(L.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(L.w3&&A()){O(Z,aa,X,Y)}},removeSWF:function(X){if(L.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(L.w3){v(aa,Z,Y,X)}},addDomLoadEvent:J,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return K(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return K(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(L.ie&&L.win){l.style.display="block"}}if(D){D(B)}}a=false}}}};var OX_swfobject=OX_swfobject||OX.swfobject(window,document,navigator);
OX.ud=OX.ud||{};OX.browser_id=OX.browser_id||function(){var c=OX.utils,f="BI",g="OX_u",b,a=false;function d(){var i=new Date().getTime();var h="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(k){var j=(i+Math.random()*16)%16|0;i=Math.floor(i/16);return(k=="x"?j:(j&3|8)).toString(16)});return h}function e(){return c.getCookie(g)!=undefined}b={get:function(){if(e()){return undefined}var h=c.store.get(f);if(h==undefined){c.store.put(f,d());return undefined}else{return h}}};return b}();
OX.tp_xdi_tapad=OX.tp_xdi_tapad||function(){var g=OX.utils,b="{ep}?{arg}",d="tapestry.tapad.com/tapestry/1",h="1955",e="b",c="_",i="BI",a="6a16560a-f6c6-4851-b7b5-0b2c0190166a",f;f={sync:function(){var l=g.store.get(i);if(!l||!a||a==="undefined"){return}var k=[e,l,a].join(c);var m=g.serialize({ta_partner_id:h,ta_partner_did:k,ta_format:"png"});var j=g.template(b,{ep:d,arg:m});(new Image()).src=g.ensureRightProtocol(j)}};return f}();
!function(){OX.init();OX.setGateway("http://ox-d.medianet.servedbyopenx.com/w");var d;while(window.OX_cmds&&(d=OX_cmds.shift())){if(typeof d==="function"){d()}}var e=window.OX_reporter_cmds;if(!e){try{e=window.top.OX_reporter_cmds}catch(c){}}for(var a in e){if(typeof e[a]==="function"){e[a](window)}}var b;while(window.OX_ads&&(b=OX_ads.shift())){b.hasOwnProperty("slot_id")?OX.load(b):OX.requestAd(b)}}();
