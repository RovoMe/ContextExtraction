;/* Version ca98cd9e9bc9be02e16c4d7fb16dbb51 v:4.1.7.0, c:f870348957702a7d392d02813d7db2382f7888d0, b:8215 n:1-4.1.7.next-build */(function(){/*


 Copyright (c) 2013, AppDynamics, Inc. All rights reserved.

 Derivative of Google Episodes:

 Copyright 2010 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 See the source code here:
 http://code.google.com/p/episodes/
*/
(function(){var g=window.ADRUM;g&&g.q&&!0!==window["adrum-disable"]&&(function(a){(function(d){d.Pa=function(f){var c={a:[1,2,3,"str"]};if(d.isDefined(JSON)&&d.isFunction(JSON.stringify)&&'{"a":[1,2,3,"str"]}'===(0,JSON.stringify)(c).replace(/\s/g,""))return JSON.stringify(f);var b=Object.toJSON;if(d.isFunction(b)&&'{"a":[1,2,3,"str"]}'===b(c).replace(/\s/g,""))return a.error("M63"),b(f);a.error("M64");return null};d.now=function(){return(new Date).getTime()};d.Aa=function(f,c,b){var e=f,h=b;"xhr"===
b&&(e=document.createElement("div"),f.appendChild(e),h="xhr_"+f.getElementsByTagName("div").length);f=document.createElement("p");f.innerHTML="Script loaded from "+a.conf.adrumExtUrl+". Metrics collected are:";e.appendChild(f);f=document.createElement("table");f.id="ADRUM_"+h;var h=document.createElement("tbody"),d;for(d in c){b=document.createElement("tr");var k=document.createElement("td");k.innerHTML=d;k.className="name";var m=document.createElement("td");m.innerHTML=String(c[d]);m.className="value";
b.appendChild(k);b.appendChild(m);h.appendChild(b)}f.appendChild(h);e.appendChild(f)};d.ke=function(){function a(c,b){try{if("object"!=typeof c)return String(c);if(0<=d.wa(b,c))return"Already visited";b.push(c);var e;if(d.isArray(c)){for(var h="[ ",p=0;p<c.length;p++)0!=p&&(h+=", "),h+=a(c[p],b);e=h+" ]"}else{var h="{ ",p=!0,k;for(k in c)p?p=!1:h+=", ",h+=a(k,b)+" => "+a(c[k],b);e=h+" }"}return e}catch(m){return"dumpObject failed: "+m}}return function(c){return a(c,[])}}();d.wa=d.isFunction(Array.prototype.indexOf)?
function(a,c){return a.indexOf(c)}:function(a,c){for(var b=0;b<a.length;b++)if(a[b]==c)return b;return-1};d.compareWindows=function(a,c){return a==c};d.Fa=function(a,c,b,e){if("undefined"===typeof c||null===c)return c;if(d.isArray(c)){a=[];for(var h=0,p=c.length;h<p;h++)a[h]=d.Fa(h,c[h],b,e);return a}if(d.isFunction(c))return c;if(d.isObject(c)){a={};for(h in c)c.hasOwnProperty(h)&&(a[b(h)]=d.Fa(h,c[h],b,e));return a}return e(a,c)};d.Ze=function(a){var c=[],b;for(b in a)Object.prototype.hasOwnProperty.call(a,
b)&&c.push([b,a[b]]);return c}})(a.utils||(a.utils={}))}(g||(g={})),function(a){(function(a){a.vc=function(a){return/^[0-9]+$/.test(a)?Number(a):null};a.Tb=function(a){return"number"===typeof a&&!isNaN(a)&&isFinite(a)}})(a.utils||(a.utils={}))}(g||(g={})),function(a){(function(d){function f(b){var h=b.split("\r\n"),c=/^\s*ADRUM_(\d+): (.+)\s*$/i;b=[];for(var d=0;d<h.length;d++){var f=h[d];try{var g=c.exec(f);g&&b.push([Number(g[1]),g[2]])}catch(l){a.exception(l,"M67",f)}}Array.prototype.sort.call(b,
function(a,b){return a[0]-b[0]});g=[];for(h=0;h<b.length;h++)g.push(b[h][1]);return g}var c=null,b=null;d.Mb=function(){b||(b=d.bc(d.Ja(d.cookieMetadataChunks),d.Ja(a.footerMetadataChunks)));return b};d.getPageGUID=function(){if(!c){var b=d.Mb();c=b&&b.clientRequestGUID||a.utils.generateGUID()}return c};d.Ee=function(b){b=f(b);a.log("M65",b);return d.bc(d.Ja(b))};d.bc=function(b,h){function c(b){for(var e=0;e<b.length;e++){var h=b[e];h!=f&&0>a.utils.wa(l,h)&&l.push(h)}}if(!b||0>=b.I.length)return null;
h||(h=b);var f;if(0<h.I.length){if(f=h.I[0],0>a.utils.wa(b.I,f))return null}else return a.error("M66"),null;var g=h.serverSnapshotType||b.serverSnapshotType,n=h.hasEntryPointErrors||b.hasEntryPointErrors,l=[];c(b.I);c(h.I);var q={clientRequestGUID:f};0<l.length&&(q.otherClientRequestGUIDs=l);0<d.ac(b.btTime,h.btTime).length&&(q.btTime=d.ac(b.btTime,h.btTime));null!==g&&(q.serverSnapshotType=g);null!==n&&(q.hasEntryPointErrors=n);return q};d.ac=function(b,a){for(var c=b.concat(a),d={},f={},g=0;g<c.length;g++){var l=
c[g];l.id in d||(d[l.id]=-1);d[l.id]=Math.max(d[l.id],l.duration);l.id in f||(f[l.id]=-1);f[l.id]=Math.max(f[l.id],l.ert)}var c=[],q;for(q in d)d.hasOwnProperty(q)&&c.push({id:q,duration:d[q],ert:f[q]});return c};d.Ja=function(b){if(!a.utils.isArray(b))return null;for(var c=[],d=[],f=null,g=null,n=0;n<b.length;n++){var l=b[n];if("string"!==typeof l)return null;l=l.replace(/^"|"$/g,"");l=decodeURIComponent(l).split(",")[0].replace(/^\s+|\s+$/g,"").split(":");if(2===l.length){var q=l[1];switch(l[0]){case "clientRequestGUID":case "g":c.push(q);
break;case "btId":case "i":d.push({id:q,duration:-1,ert:-1});break;case "btDuration":case "d":if(0===d.length)return null;l=a.utils.vc(q);if(!a.utils.Tb(l)||-1>l)return null;d[d.length-1].duration=l;break;case "btERT":case "e":if(0===d.length)return null;l=a.utils.vc(q);if(!a.utils.Tb(l)||-1>l)return null;d[d.length-1].ert=l;break;case "serverSnapshotType":case "s":f=q;break;case "hasEntryPointErrors":case "h":g=q}}}return 0===c.length?null:{I:c,btTime:d,serverSnapshotType:f,hasEntryPointErrors:g}};
d.kg=f})(a.correlation||(a.correlation={}))}(g||(g={})),function(a){var d=a.conf||(a.conf={});d.Vf=3E3;d.yc=a.isDebug;d.Md=1E3;d.fd=2;d.ed=5;d.$c=5;d.ad=20;d.gb=5E3;d.rd=140;d.jb=10;d.pd=30;d.td=10;d.ud=30;d.qd=30;d.sd=20;d.ld=100;d.ib=2048;d.wd=2048;d.Zb={eumAppKey:"ky",userPageName:"un",clientRequestGUID:"cg",otherClientRequestGUIDs:"og",baseGUID:"bg",parentGUID:"mg",parentPageUrl:"mu",parentPageType:"mt",parentLifecyclePhase:"pp",pageType:"pt",pageUrl:"pu",pageReferrer:"pr",pageTitle:"pl",pageName:"pn",
navOrXhrMetrics:"mn",cookieMetrics:"mc",resourceTimingInfo:"rt",userData:"ud",errors:"er",ajaxError:"ae",btTime:"bt",serverSnapshotType:"ss",hasEntryPointErrors:"se",dataType:"dt",geoCountry:"gc",geoRegion:"gr",geoCity:"gt",localIP:"lp",ip:"ip",BEACONS:"B",ver:"vr",eom:"em",clientId:"ci",rootGUID:"rg",events:"es",guids:"gs",urlParts:"up",sequenceId:"si",eventType:"et",eventGUID:"eg",parentType:"at",serverMetadata:"sm",eventUrl:"eu",line:"ln",message:"dm",duration:"dn",id:"id",ert:"ert",parentUrl:"au",
parentPageName:"an",geo:"ge",metrics:"mx",timestamp:"ts",country:"c",region:"r",city:"t",method:"md"}}(g||(g={})),function(a){(function(a){var f=function(){function a(){this.kc=/;jsessionid=[^/?]+/}a.Cf=function(b){for(var a=0,c=0;c<b.length;c++)a=(a<<5)-a+b.charCodeAt(c),a|=0;return a};a.prototype.p=function(a){if(null===a||void 0===a)return null;var e=a.match(this.kc);if(null!=e){var c=a.indexOf("?");if(0>c||c>e.index)return a.replace(this.kc,"")}return a};a.prototype.Db=function(a){if(null===a||
void 0===a)return null;var e=a.indexOf("?"),c=a.indexOf("#");0>e&&(e=Number.MAX_VALUE);0>c&&(c=Number.MAX_VALUE);return a.substring(0,Math.min(e,c))};a.prototype.kf=function(b){if(null===b||void 0===b)return null;var e=this.Db(b);return e+"?"+a.Cf(b.substring(e.length))};return a}();a.$f=f;a.g=new f})(a.utils||(a.utils={}))}(g||(g={})),function(a){(function(a){var f=function(){function a(){}a.prototype.ma=function(a,e){if(a)return a.slice(0,e)};return a}();a.Pc=f})(a.events||(a.events={}))}(g||(g=
{})),function(a){(function(a){var f=function(){function a(){}a.Da=function(a){return a.duration?a.duration:a.responseEnd&&a.startTime?a.responseEnd-a.startTime:-1};return a}();a.ta=f})(a.events||(a.events={}))}(g||(g={})),function(a){(function(a){var f=function(){function c(){}c.prototype.ma=function(b,e){if(b){if(b.length<=e)return b;for(var c=[],f=0;f<b.length;f++)c.push({La:b[f],index:f});c.sort(function(b,e){return-(a.ta.Da(b.La)-a.ta.Da(e.La))});c=c.slice(0,e);c.sort(function(a,b){return a.index-
b.index});for(var g=[],f=0;f<c.length;f++)g.push(c[f].La);return g}};return c}();a.pb=f})(a.events||(a.events={}))}(g||(g={})),function(a){(function(a){var f=function(){function c(){}c.prototype.ma=function(b,e){if(b){if(b.length<=e)return b;for(var c=1,f=Math.floor(Number.MAX_VALUE/4),g=b.length;c<f;){for(var m=b.length-1;0<=m;m--)if(a.ta.Da(b[m])<c&&(b.splice(m,1),g--),g<=e)return b;c*=4}return(new a.pb).ma(b,e)}};return c}();a.Cd=f})(a.events||(a.events={}))}(g||(g={})),function(a){(function(d){var f=
function(){function b(e,h){this.version=2;this.resourceTimingInfo={};this.Rb={};this.Sb={};this.lc={};this.mc={};this.Ba={};this.Ma=[];this.Rd=function(b,e){if(b&&e&&0<e.length){this.Hf=b;for(var h=new c,d=new c,f=0;f<e.length;f++){var p=e[f],g=a.utils.parseURI(a.utils.g.p(p.name)),y=p.initiatorType,v=this.Kb(g),w=this.ze(p),r=this.Ce(w,p),s=r?Math.round(r):r;this.Ma.push({u:this.Mf(g),i:h.Hb(this.Sb,y),r:d.Hb(this.mc,v),f:w,o:0===f&&p.isBase?1:s,m:this.Ae(w,r,p)})}}};this.Ba[b.Z]=b.Dd;this.Ba[b.W]=
b.Ic;var d=b.ve();this.xa(d,e);e=this.tf(d,e);this.Rd(h||a.monitor.perfMonitor.navTiming&&a.monitor.perfMonitor.navTiming.navigationStart,e)}b.Me=function(){for(var e=0;e<b.cb.length;e++)b.B[b.cb[e]]=b.w.Rc;for(e=0;e<b.ab.length;e++)b.B[b.ab[e]]=b.w.Oc;b.B.js=b.w.Ed;b.B.css=b.w.CSS;b.B.svg=b.w.Gd;b.B.html=b.w.bb;b.B.htm=b.w.bb;e=a.conf.userConf&&a.conf.userConf.resTiming&&a.conf.userConf.resTiming.sampler;b.sf=e&&"FirstN"==e?new d.Pc:e&&"TopN"==e?new d.pb:new d.Cd};b.prototype.Pb=function(a,b){a[b]=
a[b]?a[b]+1:1};b.prototype.ze=function(a){return a.fetchStart<=a.domainLookupStart?b.Z:b.W};b.prototype.Ce=function(e,c){if(e==b.Z||e==b.W)return c.startTime;a.error("M68",e)};b.prototype.Ae=function(e,c,d){function f(a){g.push(0==d[a]?-1:Math.round(d[a]-c))}var g=[];e==b.Z?(f("startTime"),f("redirectStart"),f("redirectEnd"),f("fetchStart"),f("domainLookupStart"),f("domainLookupEnd"),f("connectStart"),f("connectEnd"),f("requestStart"),f("responseStart"),f("responseEnd")):e==b.W?(f("startTime"),f("fetchStart"),
f("responseEnd")):a.error("M69",e);return g};b.prototype.T=function(a,b){if(3>=b)return"...";a.length>b&&(a=a.substring(0,b-3)+"...");return a};b.prototype.Kf=function(a,b){if(3>=b)return"...";a.length>b&&(a=a.substring(0,(b-3)/2)+"..."+a.substring(a.length-(b-3)/2,a.length));return a};b.prototype.Lf=function(b){b.length<=a.conf.jb||(b=this.T(b,a.conf.jb-1),b+=":");return b};b.prototype.Jf=function(b,c,f){b=this.Lf(b);c=this.T(c,a.conf.pd);f=this.T(f,a.conf.td);return 0<f.length?b+"//"+c+":"+f:b+
"//"+c};b.prototype.Mf=function(b){function c(){return 0==n.length?f+l+d+g:f+n.join("/")+"/"+l+d+g}var f=this.Jf(b.protocol,b.hostname,b.port),d=this.T(b.search,a.conf.ud),g=this.T(b.hash,a.conf.qd),n=b.pathname.split("/"),l="";0<n.length&&(l=n.pop(),l=this.Kf(l,a.conf.sd));for(b=c();b.length>a.conf.rd;){if(0>=n.length)return a.error("M70"),null;n.pop();n.push("...");b=c();n.pop()}return b};b.prototype.Kb=function(a){var c;return(a=a.pathname)&&-1!=(c=a.lastIndexOf("."))?b.B[a.substring(c+1,a.length).toLowerCase()]||
b.w.mb:b.w.mb};b.prototype.xa=function(a,b){a&&this.Qb(a);if(b&&0<b.length)for(var c=0;c<b.length;c++)this.Qb(b[c])};b.prototype.Qb=function(b){var c=a.utils.parseURI(a.utils.g.p(b.name)),c=this.Kb(c);this.Pb(this.Rb,b.initiatorType);this.Pb(this.lc,c)};b.prototype.tf=function(e,c){if(c&&0<c.length){var f=a.conf.userConf&&a.conf.userConf.resTiming&&a.conf.userConf.resTiming.maxNum||a.conf.ld;e&&f--;c=b.sf.ma(c,f);e&&c.unshift(e)}return c};b.prototype.build=function(){return 0==this.Ma.length?null:
{v:this.version,ic:this.Rb,it:this.Sb,rc:this.lc,rt:this.mc,f:this.Ba,t:this.Hf,r:this.Ma}};b.ve=function(){var b=a.monitor.perfMonitor.navTiming,c=null;if(b){var c={},f;for(f in b)b.hasOwnProperty(f)&&(c[f]=b[f]);c.initiatorType="other";c.name=document.URL;c.navigationStart&&!c.startTime&&(c.startTime=c.navigationStart);c.isBase=!0}return c};b.Z=1;b.W=2;b.Dd="startTime redirectStart redirectEnd fetchStart dnsLookupStart dnsLookupEnd connectStart connectEnd requestStart responseStart responseEnd".split(" ");
b.Ic=["startTime","fetchStart","responseEnd"];b.w={Rc:"img",Ed:"script",CSS:"css",Gd:"svg",bb:"html",Oc:"font",mb:"other"};b.cb="bmp gif jpeg jpg png webp".split(" ");b.ab=["ttf","woff","otf","eot"];b.B={};return b}();d.ResourceTimingInfoBuilder=f;var c=function(){function a(){this.df=1}a.prototype.Hb=function(a,b){a[b]||(a[b]=this.df++);return a[b]};return a}();f.Me()})(a.events||(a.events={}))}(g||(g={})),function(a){a=a.beacons||(a.beacons={});a.numBeaconsSent=0;a.beaconsSent=[]}(g||(g={})),function(a){(function(d){var f=
function(){function c(){}c.prototype.send=function(b,e){var c=(e?a.conf.beaconUrlHttps:a.conf.beaconUrlHttp)+a.conf.corsEndpointPath+"/"+a.conf.appKey+"/adrum",f;a.utils.isDefined(a.xhrConstructor)&&a.utils.isDefined(a.xhrOpen)?(f=new a.xhrConstructor,a.xhrOpen.call(f,"POST",c)):(f=new XMLHttpRequest,f.open("POST",c));f.setRequestHeader("Content-type","text/plain");var g=a.utils.Pa(b);null!=g&&(f.send(g),a.log("M71"+c+"\n"),a.log("<hr/>"),a.isDebug&&d.beaconsSent.push(b),d.numBeaconsSent+=1)};return c}();
d.Hc=f})(a.beacons||(a.beacons={}))}(g||(g={})),function(a){a=a.Nc||(a.Nc={});a[a.BASE_PAGE=0]="BASE_PAGE";a[a.IFRAME=1]="IFRAME";a[a.XHR=2]="XHR";a[a.VIRTUAL_PAGE=3]="VIRTUAL_PAGE";a[a.PAGE_ERROR=4]="PAGE_ERROR"}(g||(g={})),function(a){var d=function(){function f(a){this.D=a.D;this.fa=a.fa}f.prototype.Lb=function(){var c=this.De();return c&&c.correlation.getPageGUID()||a.correlation.getPageGUID()};f.prototype.De=function(){return this.fa&&this.fa.ADRUM||null};return f}();a.Fc=d}(g||(g={})),function(a){a.beacons||
(a.beacons={})}(g||(g={})),function(a){(function(a){var f=function(){function a(){this.count=0;this.K={}}a.prototype.L=function(a){if(Object.prototype.hasOwnProperty.call(this.K,a))return this.K[a];this.K[a]=this.count;this.count++;return this.count-1};a.prototype.Gb=function(){var a=[],e;for(e in this.K)Object.prototype.hasOwnProperty.call(this.K,e)&&(a[this.K[e]]=e);return a};return a}();a.fb=f})(a.utils||(a.utils={}))}(g||(g={})),function(a){(function(a){var f=function(){function a(){}a.Ef=function(a){a=
a||"";var e=a.match(/([^:\/?#]+:\/\/)?([^?#]+)?(\?[^#]+)?(#.+)?/);return e&&e[0]==a?(a={},e[1]&&(a.protocol=e[1].substring(0,e[1].length-3)),e[2]&&(a.path=e[2]),e[3]&&(a.jc=e[3].substring(1)),e[4]&&(a.anchor=e[4].substring(1)),a):null};a.ne=function(b,e){var f=a.Ef(b);if(null!=f){var d="";f.protocol&&(d+=e.L(f.protocol),d+="://");if(f.path)for(var g=f.path.split("/"),m=g.length,n=0;n<m;n++){var l=g[n];0<l.length&&(d+=e.L(l));n!=m-1&&(d+="/")}f.jc&&(d=d+"?"+e.L(f.jc));f.anchor&&(d+="#",d+=e.L(f.anchor));
return d}return""+e.L(b)};a.me=function(a,e){return""+e.L(a)};return a}();a.Ya=f})(a.beacons||(a.beacons={}))}(g||(g={})),function(a){(function(d){(function(f){function c(){var b=null,c=null;try{b=localStorage[e]}catch(f){}if(b)try{(b=c=JSON.parse(b))&&"object"===typeof b&&a.utils.isDefined(b[d])&&"string"===typeof b[d]&&a.utils.isDefined(b[g])&&"number"===typeof b[g]?k=c:a.error("M72")}catch(q){a.exception(q,"M73"),delete localStorage[e]}}function b(){try{localStorage[e]=a.utils.Pa(k)}catch(b){}}
var e="ADRUM_CLIENTINFO",d="clientId",g="seqId",k;c();k||(k={clientId:a.utils.generateGUID(),seqId:0},b());f.Fb=function(){return k.clientId};f.xe=function(){c();var a=k.seqId++;b();return a};f.ye=function(){return(new Date).getTime()}})(d.O||(d.O={}))})(a.R||(a.R={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.prototype.Ha=function(b,e,f){b={ver:a.conf.agentVer,dataType:"R",rootGUID:f.Lb(),events:b};a.R.O.Fb()&&(b.clientId=a.R.O.Fb());e&&(b.geo=e);return c.qf(b)};c.qf=
function(b){var e=new a.utils.fb,f=new a.utils.fb;b=a.utils.Fa(null,b,function(a){return c.Ea(a)},function(b,g){"string"==typeof g&&g.length>a.conf.ib&&(g=g.substr(0,a.conf.ib));c.We(b)&&(g=d.Ya.ne(g,e));c.Qe(b)&&(g=d.Ya.me(g,f));return g});b[c.Ea("guids")]=f.Gb();b[c.Ea("urlParts")]=e.Gb();return b};c.We=function(a){return"eventUrl"==a||"parentUrl"==a||"pageReferrer"==a||"pageUrl"==a||"u"==a};c.Qe=function(a){return"eventGUID"==a||"parentGUID"==a||"rootGUID"==a||"clientRequestGUID"==a};c.Ea=function(b){if(a.conf.yc)return b;
var e=a.conf.Zb[b];return"undefined"===typeof e?b:e};return c}();d.Gc=f})(a.beacons||(a.beacons={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.prototype.send=function(a,e){for(var c=0;c<a.length;c++)this.vf(a[c],e)};c.prototype.vf=function(b,e){var c=(e?a.conf.beaconUrlHttps:a.conf.beaconUrlHttp)+a.conf.imageEndpointPath,f=new Image;try{f.src=c+b}catch(g){}a.isDebug&&d.beaconsSent.push(b);d.numBeaconsSent+=1};return c}();d.Wc=f})(a.beacons||(a.beacons={}))}(g||(g={})),
function(a){a.events||(a.events={})}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.lf=function(b,e){var c=!1;if(null!=b&&a.utils.isObject(b)){var f=a.utils.Pa(b);if(null==f||f.length<=e)c=!0}c||(a.log("User event info dropped because they are malformed or too long"),"undefined"!==typeof console&&"undefined"!==typeof console.log&&console.log("User event info dropped because they are malformed or too long"));return c};c.Fe=function(b,e){var f={},d=b&&b.userEventInfo&&b.userEventInfo.PageLoad;
return d?(f=a.utils.isFunction(d)?d.call(null,f):d,c.lf(f,e)?f:{}):{}};return c}();d.Jd=f})(a.events||(a.events={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.setPageName=function(a){c.userPageName=a};c.addUserData=function(a,e){c.userData=c.userData||{};c.userData[a]=e};c.prototype.make=function(){var b=this.Be(),e=this.we();a.conf.viz&&(b&&a.utils.Aa(document.getElementById(a.conf.viz),b,"navtime"),a.utils.Aa(document.getElementById(a.conf.viz),e,"cookie"));e.PLC=1;b&&
(b.PLC=1);0<a.monitor.ErrorMonitor.errorsSent&&(e.EPM=1,b&&(b.EPM=1));e={eventGUID:a.correlation.getPageGUID(),eventUrl:a.utils.g.p(document.URL),eventType:a.utils.compareWindows(top,window)?0:1,cookieMetrics:e};b&&(e.metrics=b);document.referrer&&null!==document.referrer&&0<document.referrer.length&&(e.pageReferrer=a.utils.g.p(document.referrer));document.title&&null!==document.title&&0<document.title.length&&(e.pageTitle=document.title);b=a.correlation.Mb();null!==b&&(e.serverMetadata=b);b=a.monitor.perfMonitor.resTiming?
(new d.ResourceTimingInfoBuilder(a.monitor.perfMonitor.resTiming)).build():null;null!==b&&(e.resourceTimingInfo=b);b=d.Jd.Fe(a.conf.userConf,a.conf.wd);e.userPageName=c.userPageName||b.userPageName;e.userData=c.userData||b.userData;return e};c.prototype.Be=function(){if(!a.monitor.perfMonitor.navTiming)return null;var b={};c.Ib(a.monitor.perfMonitor.navTiming,b,"NT").add("PLT","navigationStart","loadEventEnd").add("FBT","navigationStart","responseStart").add("SCT","navigationStart","requestStart").add("SHT",
"secureConnectionStart","connectEnd").add("DLT","domainLookupStart","domainLookupEnd").add("TCP","connectStart","connectEnd").add("RAT","requestStart","responseStart").add("FET","responseStart","loadEventEnd").add("DRT","responseStart","domContentLoadedEventStart").add("DDT","responseStart","responseEnd").add("DPT","responseEnd","domContentLoadedEventStart").add("PRT","domContentLoadedEventStart","loadEventEnd").add("DOM","navigationStart","domContentLoadedEventStart");return b};c.prototype.we=function(){var b=
{};a.commands.marks&&c.Ib(a.commands.marks,b,"CK").add("PLT","starttime","onload").add("FBT","starttime","firstbyte").add("FET","firstbyte","onload").add("DRT","firstbyte","onready").add("PRT","onready","onload").add("DOM","starttime","onready");return b};c.Qd=function(b,e,c,f,d,g){e=f[e];c=f[c];e&&c?d[b]=c-e:a.log("M74",g,b,e,c)};c.Ib=function(a,e,f){var d={add:function(g,m,n){c.Qd(g,m,n,a,e,f);return d}};return d};return c}();d.C=f})(a.events||(a.events={}))}(g||(g={})),function(a){(function(d){(function(f){function c(e,
f){var y,k=f[e],n=typeof k;q.push(e);var r=l[q.join(".")];if(a.utils.isFunction(r))y=r(k);else switch(n){case "string":y="number"==typeof r?m(k,b,r):b(k);break;case "number":y=g(k);break;case "object":if(k)if(a.utils.isArray(k))y=d(k,!1,!1);else{y=[];for(var s in k)Object.prototype.hasOwnProperty.call(k,s)&&(n=c(s,k))&&y.push({ha:s,v:n});if("navOrXhrMetrics"==e||"cookieMetrics"==e){for(k=0;k<y.length;k++)y[k]=y[k].ha+b(":")+y[k].v;y=b("{")+y.join(b(","))+b("}")}else{for(k=0;k<y.length;k++)s=y[k],
n=s.ha,a.conf.yc||((r=a.conf.Zb[s.ha])?n=r:a.error("M75",s.ha)),y[k]=n+"="+s.v;y=y.join("&")}}else y=null}q.pop();return y}function b(a){return"undefined"===typeof a||null===a||0===a.length?null:encodeURIComponent(a)}function e(a){return encodeURIComponent(encodeURIComponent(a))}function d(a,e,f){void 0===e&&(e=!1);void 0===f&&(f=!0);if(0===a.length)return null;var g=[];if(e)g=a;else for(e=0;e<a.length;e++)g.push(c(e,a));return b("[")+g.join(b(","))+b(f?">":"]")}function g(a){a=Math.round(a);a<f.lb&&
(a=f.lb);a>f.hb&&(a=f.hb);return b(a)}function k(a,e){if(a>e||0>a)a=f.yd;return b(a)}function m(b,e,c,f){void 0===f&&(f=!0);if("undefined"===typeof b||null===b||0===b.length)return null;var d=3<=c?"...":"";a.assert(c>=d.length);for(var g=!1,h=null;;){try{h=e(b);if(null===h)return null;if(h.length<=c)break}catch(k){}var p;g?p=b.length-1:(g=!0,p=c-=d.length);var l=f?0:Math.max(b.length-p,0);b=b.substr(l,p)}g&&(h=f?h+d:d+h);return h}function n(b,e,c){if(0==c)return f.ra;if(e<b)return 0;e=f.ra+(e-b)/
c;a.assert(e>=f.ra);a.log("M76",b,e);return e}f.yd=-1;f.sa=180;f.nd=50;f.od=50;f.hd=40;f.ra=50;f.Xc=50;f.kb=128;f.cd=30;f.dd=30;f.bd=30;f.jd=8;f.lb=-99999;f.hb=999999;f.Yc=2E3;f.md=2;f.Zc=99999999;var l={".pageUrl":f.sa,".parentPageUrl":f.sa,".pageReferrer":f.sa,".pageTitle":f.nd,".userPageName":f.od,".geoCountry":f.cd,".geoRegion":f.dd,".geoCity":f.bd,".localIP":f.jd,".otherClientRequestGUIDs":function(a){a=a||[];var b=a.slice(0,f.md);return d(b,!1,b.length<a.length)},".btTime":function(b){b=b||
[];for(var e=b.slice(0,a.conf.$c),c=[],l=0;l<e.length;l++){var m=e[l];c.push(d([k(Number(m[0]),f.Zc),g(m[1]),g(m[2])],!0,!1))}return d(c,!0,e.length<b.length)},".ajaxError":function(a){return d([e(a[0]),m(a[1],e,f.Xc)],!0,!1)},".userData":function(a){a=a||[];for(var b=!1,c=0,g=[],k=0;k<a.length;k++){var p=a[k];g[k]=d([e(p[0]),e(p[1])],!0,!1);c+=g[k].length;if(c>f.kb){b=!0;break}}for(;;){a=d(g,!0,b);if(null===a||a.length<=f.kb)return a;g.pop();b=!0}}},q=[];f.le=function(b,k){void 0===k&&(k=!0);q=[];
var l=[];b.errors&&(l=b.errors,b.errors=null);var v=c("",{"":b});if(l&&0<l.length){for(var w=n(k?870:354,f.Yc-v.length,l.length),r=[],s=0;s<l.length;s++){var x=l[s],z=a.utils.g.Db(a.utils.g.p(x[0]));r.push(d([m(z,e,f.hd,!1),g(x[1]),m(x[2],e,w)],!0,!1))}l=d(r,!0,!1);v+="&errors="+l}return v};f.dg=c;f.mg=b;f.element=e;f.ag=d;f.cg=g;f.jg=k;f.truncate=m;f.lg=n})(d.eb||(d.eb={}))})(a.beacons||(a.beacons={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.prototype.Ha=function(b,
e,f){for(var g=[],k=[],m=null,n=[],l=0;l<b.length;l++){var q=b[l];if(4===q.eventType){var t=q;k.push([q.eventUrl,t.line,t.message])}else{if(0===q.eventType||1===q.eventType)m=q;n.push(q)}}b=n;if(0<k.length)for(m&&(m.errors=k.splice(0,a.conf.fd));0<k.length;)q=k.splice(0,a.conf.ed),m=c.of.make(),m.errors=q,m.isErrorEvent=!0,m.cookieMetrics=null,m.metrics=null,m.resourceTimingInfo=null,b.push(m);for(k=0;k<b.length;k++)q=b[k],a.log("M77"),q.resourceTimingInfo=null,c.se(q,e,f),m=c.transform(q),g.push(d.eb.le(m,
q.isErrorEvent));return g};c.se=function(b,e,c){b.ver=this.Sc;b.rootGUID=c.Lb();b.geo=e;b.dataType="R";b.eom=1;b.eumAppKey=a.conf.appKey;b.PLC=1};c.transform=function(a){var e={};c.Dc("",{"":a},e);return e};c.Dc=function(b,e,f){e=e[b];var d=c.Xb[b];if("metrics"===b||"cookieMetrics"===b)f[d]=e;else if("btTime"===b&&a.utils.isArray(e)&&0<e.length){b=[];for(var g=0;g<e.length;g++)b.push([e[g].id,e[g].duration,e[g].ert]);f[d]=b}else if("userData"===b&&a.utils.isObject(e))f[d]=a.utils.Ze(e);else if(a.utils.isObject(e))for(g in e)Object.prototype.hasOwnProperty.call(e,
g)&&c.Dc(g,e,f);else c.Xb[b]&&("eventType"===b&&2<e&&(e=a.utils.compareWindows(top,window)?0:1),f[d]=e)};c.of=new a.events.C;c.Sc=3;c.Xb={eumAppKey:"eumAppKey",userPageName:"userPageName",rootGUID:"baseGUID",parentGUID:"parentGUID",parentUrl:"parentPageUrl",parentType:"parentPageType",parentLifecyclePhase:"parentLifecyclePhase",eventType:"pageType",eventUrl:"pageUrl",pageReferrer:"pageReferrer",pageTitle:"pageTitle",metrics:"navOrXhrMetrics",xhrMetrics:"navOrXhrMetrics",resourceTimingInfo:"resourceTimingInfo",
cookieMetrics:"cookieMetrics",userData:"userData",errors:"errors",ajaxError:"ajaxError",dataType:"dataType",country:"geoCountry",region:"geoRegion",city:"geoCity",localIP:"localIP",ver:"ver",eom:"eom",eventGUID:"clientRequestGUID",otherClientRequestGUIDs:"otherClientRequestGUIDs",btTime:"btTime",serverSnapshotType:"serverSnapshotType",hasEntryPointErrors:"hasEntryPointErrors"};return c}();d.Vc=f})(a.beacons||(a.beacons={}))}(g||(g={})),function(a){(function(a){var f=function(){function a(){}a.prototype.send=
function(){};return a}();a.Mc=f})(a.beacons||(a.beacons={}))}(g||(g={})),function(a){(function(a){var f=function(){function a(){}a.prototype.Ha=function(){return null};return a}();a.Lc=f})(a.beacons||(a.beacons={}))}(g||(g={})),function(a){var d=function(){function f(){}f.xb=function(c,b){if(!c)return null;var e=c.ADRUM.lifecycle;if(!e||!e.getPhaseCallbackTime)return null;var f=b.getPhaseCallbackTime("AT_ONLOAD"),e=e.getPhaseCallbackTime("AT_ONLOAD"),d=null==e;return null==f?(a.error("M78"),null):
a.lifecycle.getPhaseID(d||f<=e?"AFTER_FIRST_BYTE":"AFTER_ONLOAD")};return f}();a.Ad=d;a.cPLPI=d.xb}(g||(g={})),function(a){(function(d){var f=function(){function c(a){this.ready=!1;this.geoResolverUrl=a}c.prototype.init=function(b){this.channel=b;if(this.geoResolverUrl){a.geo={failed:!1,result:null};a.utils.loadScriptAsync(this.geoResolverUrl+"/resolve.js");var e=this;a.utils.tryPeriodically(c.Td,function(){return e.isReady()},function(){e.onReady()},function(){e.nf()})}else this.ready=!0,b.onResolverReady()};
c.prototype.isReady=function(){this.ready||(this.ready=a.geo&&(a.geo.failed||null!==a.geo.result))||a.log("M79");return this.ready};c.prototype.onReady=function(){a.geo.failed?a.log("M80"):(a.assert("object"===typeof a.geo.result),a.log("M81",a.geo.result));a.geo&&a.geo.result&&this.channel.xf(a.geo.result);this.channel.onResolverReady()};c.prototype.nf=function(){a.log("M82");this.ready=!0;this.channel.onResolverReady()};c.Td=function(a){return 10<a?-1:[1,50,100,500][a-1]||1E3};return c}();d.Qc=
f})(a.channel||(a.channel={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){this.ready=!1;this.channel=null}c.prototype.init=function(b){this.channel=b;c.n=c.Eb();this.ready=!c.n.D;var e=this;if(c.n.D)a.log("M83"),c.n.D.ADRUM.command("listenForOkToSendChildFrameBeacons",function(){a.log("M84");e.ready=!0;e.onReady()});else e.onReady()};c.prototype.isReady=function(){this.isReady||a.log("M85");return this.ready};c.prototype.onReady=function(){this.channel.wf(c.n);this.channel.onResolverReady()};
c.Eb=function(){if(!c.n){for(var b=c.ue(),e=[],f=0;f<b.length;f++)try{b[f].ADRUM&&e.push(b[f])}catch(d){}c.n=new a.Fc({D:0<e.length?e[0]:null,fa:0<e.length?e[e.length-1]:null})}return c.n};c.ue=function(){for(var b=[],e=window;!a.utils.compareWindows(e,top);)e=e.parent,b.push(e);return b};c.n=null;return c}();d.Wa=f})(a.channel||(a.channel={}))}(g||(g={})),function(a){a.M=null;a.addResolver=null;(function(d){function f(a){return a&&a.document.URL&&0==a.document.URL.indexOf("https:")}var c=function(){function b(b,
c,f){this.events=[];this.da=NaN;this.G=[];this.Ca=!1;this.bufferMode=a.conf.userConf&&a.conf.userConf.channel&&"undefined"!==typeof a.conf.userConf.channel.bufferMode?a.conf.userConf.channel.bufferMode:!0;this.na=-1;this.If=b;this.Ud=c;this.G.push(new d.Qc(f));this.G.push(new d.Wa)}b.create=function(){var e,c;e=d.Wa.Eb();c=f(window)||f(e.D);e="undefined"!==typeof JSON&&!(!JSON||!JSON.stringify);c=-1<navigator.userAgent.toLowerCase().indexOf("firefox")&&c;window.XMLHttpRequest&&"withCredentials"in
new XMLHttpRequest&&e&&!c&&"true"!==a.conf.sendImageBeacon&&!0!==window["adrum-send-image-beacon"]?(e=new a.beacons.Hc,c=new a.beacons.Gc):a.conf.userConf&&a.conf.userConf.beacon&&a.conf.userConf.beacon.neverSendImageBeacon?(e=new a.beacons.Mc,c=new a.beacons.Lc):(e=new a.beacons.Wc,c=new a.beacons.Vc);e=new b(e,c,a.conf.geoResolverUrl);e.init();return e};b.prototype.init=function(){for(var a=0;a<this.G.length;a++)this.G[a].init(this)};b.prototype.M=function(e){e.sequenceId=a.R.O.xe();e.timestamp=
a.R.O.ye();this.events.push(e);1==this.events.length&&(this.da=a.utils.now());b.Re(e)&&(this.Ca=!0);this.Qa()};b.prototype.Se=function(a){return 0===a.eventType||1===a.eventType};b.prototype.Vd=function(){for(var b=0;b<this.events.length;b++){var c=this.events[b];if(this.Se(c)){var f=this.n.D;null!==f&&(c.parentLifecyclePhase=a.Ad.xb(f,a.lifecycle),c.parentGUID=f.ADRUM.correlation.getPageGUID(),c.parentUrl=a.utils.g.p(f.document.URL),a.utils.isDefined(f.ADRUM.events.C.userPageName)&&(c.parentPageName=
f.ADRUM.events.C.userPageName),c.parentType=a.utils.compareWindows(top,f)?0:1)}}};b.prototype.sendBeacon=function(){if(0==this.events.length)a.log("M86");else{this.Vd();var b=this.Of(this.events,this.n),c=this.Ud.Ha(this.events,this.te,this.n);this.If.send(c,b);this.events=[];this.da=Number.POSITIVE_INFINITY}};b.prototype.onResolverReady=function(){this.Qa()};b.prototype.xf=function(a){this.te=a};b.prototype.wf=function(a){this.n=a};b.prototype.addResolver=function(a){a.init(this);this.G.push(a)};
b.prototype.rf=function(){for(var a=0;a<this.G.length;a++)if(!this.G[a].isReady())return!1;return!0};b.prototype.Wb=function(){return this.da+a.conf.gb>a.utils.now()};b.prototype.Ue=function(){return this.events.length<a.conf.ad};b.prototype.Of=function(a,b){for(var c=!1,d=0;d<a.length;d++){var g=a[d];if(g.eventUrl&&0==g.eventUrl.indexOf("https:")){c=!0;break}}return c||f(b.D)};b.prototype.Qa=function(){if(this.rf())if(this.Qf()){if(this.Wb()&&0<this.events.length&&0>this.na){var b=this;this.na=setTimeout(function(){b.Qa()},
a.conf.gb+this.da-a.utils.now())}}else clearTimeout(this.na),this.na=-1,this.Ca=!1,this.sendBeacon()};b.Re=function(a){return 0===a.eventType||1===a.eventType||3===a.eventType};b.prototype.Qf=function(){return this.bufferMode&&!this.Ca&&this.Ue()&&this.Wb()};return b}();d.Channel=c;(function(){var b=c.create();a.M=function(a){b.M(a)};a.report=a.M;a.addResolver=function(a){b.addResolver(a)};a.addResolver=a.addResolver})()})(a.channel||(a.channel={}))}(g||(g={})),function(a){var d=function(){function f(){}
f.gc=function(){return window.attachEvent?window.addEventListener?this.Sa:this.wc:this.xc};f.fc=function(c){var b=null;switch(f.gc()){case f.xc:b=c.parentPhase;break;case f.Sa:b=a.lifecycle.findPhaseAtNominalTime(c.sendTime);break;case f.wc:b=null}return a.lifecycle.getPhaseID(b)};f.xc="uCT";f.Sa="uNET";f.wc="tIA";return f}();a.aa=d}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.prototype.make=function(b,e){var f=b.getAllResponseHeaders(),g=b.status,k=400<=g?b.responseText:
null;a.assert(null!==e.url&&null!==e.sendTime&&null!==e.firstByteTime&&null!==e.respAvailTime&&null!==e.respProcTime,"missing some pieces of XHR data: url="+e.url+", send="+e.sendTime+", fbt="+e.firstByteTime+", rat="+e.respAvailTime+", eut="+e.respProcTime+", parentPhase="+e.parentPhase);if(null===e.url||null===e.sendTime||null===e.firstByteTime||null===e.respAvailTime||null===e.respProcTime)return null;var m=null;400<=g&&(m=[g,k||""]);g={PLC:1,FBT:e.firstByteTime-e.sendTime,DDT:e.respAvailTime-
e.firstByteTime,DPT:e.respProcTime-e.respAvailTime,PLT:e.respProcTime-e.sendTime,ARE:m?1:0};k=a.utils.getFullyQualifiedUrl(e.url);if(!c.Xe(g,k))return null;a.conf.viz&&a.utils.Aa(document.getElementById(a.conf.viz),g,"xhr");var f=a.correlation.Ee(f),n=null,n=f&&null!==f&&null!==f.clientRequestGUID?f.clientRequestGUID:a.utils.generateGUID(),g={eventType:2,eventGUID:n,eventUrl:a.utils.g.p(k),parentGUID:e.parentGUID?e.parentGUID:a.correlation.getPageGUID(),parentUrl:a.utils.g.p(e.parentUrl?e.parentUrl:
document.URL),parentType:e.parentType?e.parentType:0,parentLifecyclePhase:e.dc,metrics:g,method:e.method};a.utils.isDefined(d.C.userPageName)&&(g.parentPageName=d.C.userPageName);null!==f&&(g.serverMetadata=f);null!==m&&(g.ajaxError=m);return g};c.Xe=function(b,c){for(var f in b)if(b.hasOwnProperty(f)){var d=b[f];if(0>d)return a.error("XHR "+f+" ["+d+"] "+c),!1}return!0};return c}();d.Pd=f})(a.events||(a.events={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.prototype.make=
function(b,c,f,d){b={eventGUID:a.utils.generateGUID(),eventUrl:a.utils.g.p(c),eventType:4,parentGUID:a.correlation.getPageGUID(),parentUrl:a.utils.g.p(document.URL),parentType:a.utils.compareWindows(top,window)?0:1,message:b,line:f};null!==d&&(b.stack=d);a.M(b)};return c}();d.zd=f})(a.events||(a.events={}))}(g||(g={})),function(a){a.events||(a.events={})}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.prototype.make=function(b){var c=a.utils.g.p(b.getPageUrl()||location.href),
c={eventGUID:b.getGUID(),parentGUID:a.correlation.getPageGUID(),eventUrl:c,eventType:3,pageName:b.getName(),metrics:b.buildMetrics()};b=(new d.ResourceTimingInfoBuilder(b.getResTiming())).build();null!==b&&(c.resourceTimingInfo=b);return c};return c}();d.Kd=f})(a.events||(a.events={}))}(g||(g={})),function(a){a=a.events||(a.events={});var d=a.la||(a.la={});d.PageLoad={maker:new a.C};d.XHR={maker:new a.Pd};d.VPLoad={maker:new a.Kd};d.PageError={maker:new a.zd}}(g||(g={})),function(a){(function(d){function f(c){for(var b=
[],e=1;e<arguments.length;e++)b[e-1]=arguments[e];e=a.events.la[c].maker;return e.make.apply(e,b)}d.reportEvent=function(c){for(var b=1;b<arguments.length;b++);b=a.events.la[c];(b=!(!b||!b.maker))||a.log("M88"+c);b&&(b=f.apply(null,arguments),a.utils.isDefined(b)&&(a.log("M87"+c+" event"),a.M(b)))}})(a.reporter||(a.reporter={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){this.ready=!1}c.prototype.onReady=function(a){this.ready=a;this.channel.onResolverReady()};c.prototype.isReady=
function(){this.ready||a.log("M89");return this.ready};c.prototype.init=function(a){this.channel=a};return c}();d.Od=f})(a.commands||(a.commands={}))}(g||(g={})),function(a){(function(d){var f=new d.Od;a.addResolver(f);d.marks={};d.mark=function(c,b){a.log("M90",c,b);d.marks[c]=b};d.reportOnload=function(){setTimeout(function(){a.log("M91");f.onReady(!0);a.reporter.reportEvent("PageLoad")},a.conf.Md)};d.reportEvent=function(){a.reporter.reportEvent.apply(a.reporter,arguments)};d.addResolver=function(c){a.addResolver(c)};
d.reportXhr=function(c,b){a.log("M92");a.aa.gc()==a.aa.Sa?(a.log("M93"),setTimeout(function(){b.dc=a.aa.fc(b);a.reporter.reportEvent("XHR",c,b)},0)):(b.dc=a.aa.fc(b),a.reporter.reportEvent("XHR",c,b))};d.listenForOkToSendChildFrameBeacons=function(c){a.log("M94");try{c()}catch(b){a.exception(b,"M95")}};d.reportPageError=function(c,b,e,f){a.log("M96",c,b,e,f);b&&0!==b.length||(b="CROSSORIGIN");a.reporter.reportEvent("PageError",c,b,e,f)};d.setPageName=function(c){a.events.C.setPageName(c)};d.addUserData=
function(c,b){a.events.C.addUserData(c,b)};d.call=function(a){a()};d.registerEvent=function(c,b){a.events.la[c]=b}})(a.commands||(a.commands={}))}(g||(g={})),function(a){(function(a){a.Cb=function(f){return encodeURIComponent(a.g.kf(f))}})(a.utils||(a.utils={}))}(g||(g={})),function(a){(function(d){var f=function(){function c(){}c.prototype.H=function(){this.$e();a.utils.addEventListener(window,"pagehide",c.Ua);a.utils.addEventListener(window,"beforeunload",c.Ua);a.utils.addEventListener(window,"unload",
c.Ua)};c.prototype.$e=function(){(this.startTime=c.re()||c.qe())&&a.commands.mark("starttime",this.startTime)};c.re=function(){var b;if(a.utils.isDefined(window.external)&&a.utils.isDefined(window.external.pageT))b=(new Date).getTime()-window.external.pageT;else if(a.utils.isDefined(window.Nb)&&a.utils.isFunction(window.Nb.pageT)){var c=window.Nb.pageT();"number"===typeof c&&(b=(new Date).getTime()-c)}else a.utils.isDefined(window.chrome)&&a.utils.isFunction(window.chrome.csi)&&(c=window.chrome.csi(),
a.utils.isDefined(c)&&"number"===typeof c.pageT&&(b=(new Date).getTime()-c.pageT));b&&(b=Math.round(b),a.log("M97",b));return b};c.qe=function(){var b=a.correlation.startTimeCookie;if(b){a.log("M98",b.startTime,b.startPage);var c=a.utils.Cb(document.referrer);if(c===b.startPage)if(isNaN(b.startTime))a.log("M99",b.startTime);else return b.startTime;else a.log("M100",c,b.startPage)}else a.log("M101")};c.ge=function(b,c){var f=document.domain,d="https:"===document.location.protocol,g="ADRUM=s="+Number(new Date)+
"&r="+a.utils.Cb(document.location.href),m=g+";path=/";d&&(m+=";secure");a.log("M102",g);if(!a.conf.useStrictDomainCookies){for(var d=b(),f=f.split("."),n="",l=f.length-1;0<=l;l--){n="."+f[l]+n;a.log("M103",n);c(m+";domain="+n);var q=b();if(q!=d&&0<=q.indexOf(g)){a.log("M104");a.log("M105");return}}a.log("M106")}a.log("M107");c(m);a.log("M108")};c.Ua=function(){var a=!1;return function(){a||(a=!0,c.ge(function(){return document.cookie},function(a){document.cookie=a}))}}();return c}();d.Zf=f;d.Ff=
new f})(a.monitor||(a.monitor={}))}(g||(g={})),function(a){a.log("M109");a.monitor.Ff.H();a.q.processQ();a.initEXTDone=!0;a.log("M110")}(g||(g={})))})();})();
