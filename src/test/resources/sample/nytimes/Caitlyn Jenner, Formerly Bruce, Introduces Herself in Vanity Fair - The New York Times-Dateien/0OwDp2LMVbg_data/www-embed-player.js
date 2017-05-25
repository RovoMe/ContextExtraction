(function(){var g,aa=aa||{},m=this;function p(a){return void 0!==a}
function q(a,b,c){a=a.split(".");c=c||m;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&p(b)?c[d]=b:c[d]?c=c[d]:c=c[d]={}}
function r(a,b){for(var c=a.split("."),d=b||m,e;e=c.shift();)if(null!=d[e])d=d[e];else return null;return d}
function t(){}
function ca(a){a.getInstance=function(){return a.V?a.V:a.V=new a}}
function da(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}
function ea(a){return"array"==da(a)}
function fa(a){var b=da(a);return"array"==b||"object"==b&&"number"==typeof a.length}
function u(a){return"string"==typeof a}
function ga(a){return"number"==typeof a}
function ha(a){return"function"==da(a)}
function ia(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}
function ka(a){return a[la]||(a[la]=++ma)}
var la="closure_uid_"+(1E9*Math.random()>>>0),ma=0;function na(a,b,c){return a.call.apply(a.bind,arguments)}
function oa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function v(a,b,c){v=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?na:oa;return v.apply(null,arguments)}
function pa(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}}
var w=Date.now||function(){return+new Date};
function x(a,b){function c(){}
c.prototype=b.prototype;a.I=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.base=function(a,c,f){for(var h=Array(arguments.length-2),k=2;k<arguments.length;k++)h[k-2]=arguments[k];return b.prototype[c].apply(a,h)}}
;var qa;var sa=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};
function ta(a){return decodeURIComponent(a.replace(/\+/g," "))}
var ua=/&/g,va=/</g,wa=/>/g,xa=/"/g,ya=/'/g,za=/\x00/g,Aa=/[\x00&<>"']/;function Ba(a){return-1!=a.indexOf("&")?"document"in m?Ca(a):Da(a):a}
function Ca(a){var b={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'},c;c=m.document.createElement("div");return a.replace(Ea,function(a,e){var f=b[a];if(f)return f;if("#"==e.charAt(0)){var h=Number("0"+e.substr(1));isNaN(h)||(f=String.fromCharCode(h))}f||(c.innerHTML=a+" ",f=c.firstChild.nodeValue.slice(0,-1));return b[a]=f})}
function Da(a){return a.replace(/&([^;]+);/g,function(a,c){switch(c){case "amp":return"&";case "lt":return"<";case "gt":return">";case "quot":return'"';default:if("#"==c.charAt(0)){var d=Number("0"+c.substr(1));if(!isNaN(d))return String.fromCharCode(d)}return a}})}
var Ea=/&([^;\s<&]+);?/g,Fa={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\","<":"<"},Ga={"'":"\\'"};
function Ha(a,b){for(var c=0,d=sa(String(a)).split("."),e=sa(String(b)).split("."),f=Math.max(d.length,e.length),h=0;0==c&&h<f;h++){var k=d[h]||"",l=e[h]||"",n=RegExp("(\\d*)(\\D*)","g"),G=RegExp("(\\d*)(\\D*)","g");do{var ba=n.exec(k)||["","",""],ra=G.exec(l)||["","",""];if(0==ba[0].length&&0==ra[0].length)break;c=Ia(0==ba[1].length?0:parseInt(ba[1],10),0==ra[1].length?0:parseInt(ra[1],10))||Ia(0==ba[2].length,0==ra[2].length)||Ia(ba[2],ra[2])}while(0==c)}return c}
function Ia(a,b){return a<b?-1:a>b?1:0}
function Ja(a){for(var b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c)>>>0;return b}
;function Ka(){}
;var La=Array.prototype.indexOf?function(a,b,c){return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;
if(u(a))return u(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},y=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=u(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Ma=Array.prototype.filter?function(a,b,c){return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,h=u(a)?a.split(""):a,k=0;k<d;k++)if(k in h){var l=h[k];
b.call(c,l,k,a)&&(e[f++]=l)}return e},z=Array.prototype.map?function(a,b,c){return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=u(a)?a.split(""):a,h=0;h<d;h++)h in f&&(e[h]=b.call(c,f[h],h,a));
return e},Na=Array.prototype.some?function(a,b,c){return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=u(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;
return!1},Oa=Array.prototype.every?function(a,b,c){return Array.prototype.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=u(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;
return!0};
function Pa(a,b,c){b=Qa(a,b,c);return 0>b?null:u(a)?a.charAt(b):a[b]}
function Qa(a,b,c){for(var d=a.length,e=u(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}
function A(a,b){return 0<=La(a,b)}
function Ra(){var a=Sa;if(!ea(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0}
function Ta(a,b){A(a,b)||a.push(b)}
function Ua(a,b){var c=La(a,b),d;(d=0<=c)&&Array.prototype.splice.call(a,c,1);return d}
function Va(a,b){var c=Qa(a,b,void 0);0<=c&&Array.prototype.splice.call(a,c,1)}
function Wa(a){return Array.prototype.concat.apply(Array.prototype,arguments)}
function Xa(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}
function Ya(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(fa(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var h=0;h<f;h++)a[e+h]=d[h]}else a.push(d)}}
function Za(a,b,c,d){return Array.prototype.splice.apply(a,$a(arguments,1))}
function $a(a,b,c){return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)}
function ab(a,b,c){if(!fa(a)||!fa(b)||a.length!=b.length)return!1;var d=a.length;c=c||bb;for(var e=0;e<d;e++)if(!c(a[e],b[e]))return!1;return!0}
function cb(a,b){return a>b?1:a<b?-1:0}
function bb(a,b){return a===b}
;function db(a,b,c){for(var d in a)b.call(c,a[d],d,a)}
function eb(a,b,c){var d={},e;for(e in a)b.call(c,a[e],e,a)&&(d[e]=a[e]);return d}
function fb(a){var b=0,c;for(c in a)b++;return b}
function gb(a,b){return ib(a,b)}
function jb(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}
function kb(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}
function lb(a){return null!==a&&"withCredentials"in a}
function ib(a,b){for(var c in a)if(a[c]==b)return!0;return!1}
function nb(a){var b=ob,c;for(c in b)if(a.call(void 0,b[c],c,b))return c}
function pb(a){for(var b in a)return!1;return!0}
function rb(a,b){if(null!==a&&b in a)throw Error('The object already contains the key "'+b+'"');a[b]=!0}
function sb(a){var b={},c;for(c in a)b[c]=a[c];return b}
function tb(a){var b=da(a);if("object"==b||"array"==b){if(ha(a.clone))return a.clone();var b="array"==b?[]:{},c;for(c in a)b[c]=tb(a[c]);return b}return a}
var ub="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function vb(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<ub.length;f++)c=ub[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}
;var wb;a:{var xb=m.navigator;if(xb){var yb=xb.userAgent;if(yb){wb=yb;break a}}wb=""}function B(a){return-1!=wb.indexOf(a)}
;function zb(){return B("Opera")||B("OPR")}
function Ab(){return(B("Chrome")||B("CriOS"))&&!zb()&&!B("Edge")}
;function Bb(){this.f=""}
Bb.prototype.Sb=!0;Bb.prototype.Nb=function(){return this.f};
Bb.prototype.toString=function(){return"Const{"+this.f+"}"};
function Cb(a){var b=new Bb;b.f=a;return b}
;function Db(){this.f="";this.h=Eb}
Db.prototype.Sb=!0;Db.prototype.Nb=function(){return this.f};
function Fb(a){return a instanceof Db&&a.constructor===Db&&a.h===Eb?a.f:"type_error:SafeUrl"}
var Gb=/^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i;function Hb(a){if(a instanceof Db)return a;a=a.Sb?a.Nb():String(a);Gb.test(a)||(a="about:invalid#zClosurez");var b=new Db;b.f=a;return b}
var Eb={};function Ib(){this.f="";this.h=Jb;this.j=null}
Ib.prototype.Sb=!0;Ib.prototype.Nb=function(){return this.f};
function Kb(a){return a instanceof Ib&&a.constructor===Ib&&a.h===Jb?a.f:"type_error:SafeHtml"}
var Jb={};function Lb(a,b){var c=new Ib;c.f=a;c.j=b;return c}
Lb("<!DOCTYPE html>",0);Lb("",0);function Mb(a,b){var c;c=b instanceof Db?b:Hb(b);a.href=Fb(c)}
;function Nb(a,b,c){a&&(a.dataset?a.dataset[Ob(b)]=c:a.setAttribute("data-"+b,c))}
function C(a,b){return a?a.dataset?a.dataset[Ob(b)]:a.getAttribute("data-"+b):null}
function Pb(a,b){a&&(a.dataset?delete a.dataset[Ob(b)]:a.removeAttribute("data-"+b))}
var Qb={};function Ob(a){return Qb[a]||(Qb[a]=String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()}))}
;function Rb(a){m.setTimeout(function(){throw a;},0)}
var Sb;
function Tb(){var a=m.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!B("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=v(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);
b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});
if("undefined"!==typeof a&&!B("Trident")&&!B("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(p(c.next)){c=c.next;var a=c.kc;c.kc=null;a()}};
return function(a){d.next={kc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};
document.documentElement.appendChild(b)}:function(a){m.setTimeout(a,0)}}
;function Ub(a,b,c){this.o=c;this.j=a;this.l=b;this.h=0;this.f=null}
Ub.prototype.get=function(){var a;0<this.h?(this.h--,a=this.f,this.f=a.next,a.next=null):a=this.j();return a};
Ub.prototype.put=function(a){this.l(a);this.h<this.o&&(this.h++,a.next=this.f,this.f=a)};function Vb(){this.h=this.f=null}
var Xb=new Ub(function(){return new Wb},function(a){a.reset()},100);
Vb.prototype.remove=function(){var a=null;this.f&&(a=this.f,this.f=this.f.next,this.f||(this.h=null),a.next=null);return a};
function Wb(){this.next=this.scope=this.f=null}
Wb.prototype.reset=function(){this.next=this.scope=this.f=null};function Yb(a){Zb||$b();ac||(Zb(),ac=!0);var b=bc,c=Xb.get();c.f=a;c.scope=void 0;c.next=null;b.h?b.h.next=c:b.f=c;b.h=c}
var Zb;function $b(){if(m.Promise&&m.Promise.resolve){var a=m.Promise.resolve(void 0);Zb=function(){a.then(cc)}}else Zb=function(){var a=cc;
!ha(m.setImmediate)||m.Window&&m.Window.prototype&&!B("Edge")&&m.Window.prototype.setImmediate==m.setImmediate?(Sb||(Sb=Tb()),Sb(a)):m.setImmediate(a)}}
var ac=!1,bc=new Vb;function cc(){for(var a=null;a=bc.remove();){try{a.f.call(a.scope)}catch(b){Rb(b)}Xb.put(a)}ac=!1}
;function D(){this.La=this.La;this.W=this.W}
D.prototype.La=!1;D.prototype.isDisposed=function(){return this.La};
D.prototype.dispose=function(){this.La||(this.La=!0,this.G())};
function dc(a,b){a.La?b.call(void 0):(a.W||(a.W=[]),a.W.push(p(void 0)?v(b,void 0):b))}
D.prototype.G=function(){if(this.W)for(;this.W.length;)this.W.shift()()};
function ec(a){a&&"function"==typeof a.dispose&&a.dispose()}
function fc(a){for(var b=0,c=arguments.length;b<c;++b){var d=arguments[b];fa(d)?fc.apply(null,d):ec(d)}}
;function E(a){D.call(this);this.o=1;this.h=[];this.j=0;this.f=[];this.ga={};this.l=Boolean(a)}
x(E,D);g=E.prototype;g.subscribe=function(a,b,c){var d=this.ga[a];d||(d=this.ga[a]=[]);var e=this.o;this.f[e]=a;this.f[e+1]=b;this.f[e+2]=c;this.o=e+3;d.push(e);return e};
g.unsubscribe=function(a,b,c){if(a=this.ga[a]){var d=this.f;if(a=Pa(a,function(a){return d[a+1]==b&&d[a+2]==c}))return this.oa(a)}return!1};
g.oa=function(a){var b=this.f[a];if(b){var c=this.ga[b];0!=this.j?(this.h.push(a),this.f[a+1]=t):(c&&Ua(c,a),delete this.f[a],delete this.f[a+1],delete this.f[a+2])}return!!b};
g.D=function(a,b){var c=this.ga[a];if(c){for(var d=Array(arguments.length-1),e=1,f=arguments.length;e<f;e++)d[e-1]=arguments[e];if(this.l)for(e=0;e<c.length;e++){var h=c[e];gc(this.f[h+1],this.f[h+2],d)}else{this.j++;try{for(e=0,f=c.length;e<f;e++)h=c[e],this.f[h+1].apply(this.f[h+2],d)}finally{if(this.j--,0<this.h.length&&0==this.j)for(;c=this.h.pop();)this.oa(c)}}return 0!=e}return!1};
function gc(a,b,c){Yb(function(){a.apply(b,c)})}
g.clear=function(a){if(a){var b=this.ga[a];b&&(y(b,this.oa,this),delete this.ga[a])}else this.f.length=0,this.ga={}};
g.Y=function(a){if(a){var b=this.ga[a];return b?b.length:0}a=0;for(b in this.ga)a+=this.Y(b);return a};
g.G=function(){E.I.G.call(this);this.clear();this.h.length=0};var hc=window.yt&&window.yt.config_||window.ytcfg&&window.ytcfg.data_||{};q("yt.config_",hc,void 0);q("yt.tokens_",window.yt&&window.yt.tokens_||{},void 0);var ic=window.yt&&window.yt.msgs_||r("window.ytcfg.msgs")||{};q("yt.msgs_",ic,void 0);function jc(a){kc(hc,arguments)}
function F(a,b){return a in hc?hc[a]:b}
function H(a,b){ha(a)&&(a=lc(a));return window.setTimeout(a,b)}
function mc(a,b){ha(a)&&(a=lc(a));window.setInterval(a,b)}
function I(a){window.clearTimeout(a)}
function lc(a){return a&&window.yterr?function(){try{return a.apply(this,arguments)}catch(b){throw nc(b),b;}}:a}
function nc(a,b){var c=r("yt.logging.errors.log");c?c(a,b):(c=F("ERRORS",[]),c.push([a,b]),jc("ERRORS",c))}
function oc(){var a={},b="FLASH_UPGRADE"in ic?ic.FLASH_UPGRADE:'You need to upgrade your Adobe Flash Player to watchthis video. <br> <a href="http://get.adobe.com/flashplayer/">Download it from Adobe.</a>';if(b)for(var c in a)b=b.replace(new RegExp("\\$"+c,"gi"),function(){return a[c]});
return b}
function kc(a,b){if(1<b.length){var c=b[0];a[c]=b[1]}else{var d=b[0];for(c in d)a[c]=d[c]}}
var pc="Microsoft Internet Explorer"==navigator.appName;var qc=r("yt.pubsub.instance_")||new E;E.prototype.subscribe=E.prototype.subscribe;E.prototype.unsubscribeByKey=E.prototype.oa;E.prototype.publish=E.prototype.D;E.prototype.clear=E.prototype.clear;q("yt.pubsub.instance_",qc,void 0);var rc=r("yt.pubsub.subscribedKeys_")||{};q("yt.pubsub.subscribedKeys_",rc,void 0);var sc=r("yt.pubsub.topicToKeys_")||{};q("yt.pubsub.topicToKeys_",sc,void 0);var tc=r("yt.pubsub.isSynchronous_")||{};q("yt.pubsub.isSynchronous_",tc,void 0);
var uc=r("yt.pubsub.skipSubId_")||null;q("yt.pubsub.skipSubId_",uc,void 0);function vc(a,b,c){var d=wc();if(d){var e=d.subscribe(a,function(){if(!uc||uc!=e){var d=arguments,h=function(){rc[e]&&b.apply(c||window,d)};
try{tc[a]?h():H(h,0)}catch(k){nc(k)}}},c);
rc[e]=!0;sc[a]||(sc[a]=[]);sc[a].push(e);return e}return 0}
function xc(a){var b=wc();b&&("number"==typeof a?a=[a]:"string"==typeof a&&(a=[parseInt(a,10)]),y(a,function(a){b.unsubscribeByKey(a);delete rc[a]}))}
function J(a,b){var c=wc();return c?c.publish.apply(c,arguments):!1}
function yc(a,b){tc[a]=!0;var c=wc();c&&c.publish.apply(c,arguments);tc[a]=!1}
function zc(a){sc[a]&&(a=sc[a],y(a,function(a){rc[a]&&delete rc[a]}),a.length=0)}
function Ac(a){var b=wc();if(b)if(b.clear(a),a)zc(a);else for(var c in sc)zc(c)}
function wc(){return r("yt.pubsub.instance_")}
;function Bc(a,b){if(window.spf){var c="";if(a){var d=a.indexOf("jsbin/"),e=a.lastIndexOf(".js"),f=d+6;-1<d&&-1<e&&e>f&&(c=a.substring(f,e),c=c.replace(Cc,""),c=c.replace(Dc,""),c=c.replace("debug-",""),c=c.replace("tracing-",""))}spf.script.load(a,c,b)}else Ec(a,b)}
function Ec(a,b){var c=Fc(a),d=document.getElementById(c),e=d&&C(d,"loaded"),f=d&&!e;if(e)b&&b();else{if(b){var e=vc(c,b),h=""+ka(b);Gc[h]=e}f||(d=Hc(a,c,function(){C(d,"loaded")||(Nb(d,"loaded","true"),J(c),H(pa(Ac,c),0))}))}}
function Hc(a,b,c){var d=document.createElement("script");d.id=b;d.onload=function(){c&&setTimeout(c,0)};
d.onreadystatechange=function(){switch(d.readyState){case "loaded":case "complete":d.onload()}};
d.src=a;a=document.getElementsByTagName("head")[0]||document.body;a.insertBefore(d,a.firstChild);return d}
function Ic(a,b){if(a&&b){var c=""+ka(b);(c=Gc[c])&&xc(c)}}
function Fc(a){var b=document.createElement("a");Mb(b,a);a=b.href.replace(/^[a-zA-Z]+:\/\//,"//");return"js-"+Ja(a)}
var Cc=/\.vflset|-vfl[a-zA-Z0-9_+=-]+/,Dc=/-[a-zA-Z]{2,3}_[a-zA-Z]{2,3}(?=(\/|$))/,Gc={};var Jc=null;function Kc(){var a=F("BG_I",null),b=F("BG_IU",null),c=F("BG_P",void 0);b?Bc(b,function(){Jc=new botguard.bg(c)}):a&&(eval(a),Jc=new botguard.bg(c))}
function Lc(){return null!=Jc}
function Mc(){return Jc?Jc.invoke():null}
;function Nc(a,b){return Lb(b,null)}
;var Oc="StopIteration"in m?m.StopIteration:{message:"StopIteration",stack:""};function Pc(){}
Pc.prototype.next=function(){throw Oc;};
Pc.prototype.ua=function(){return this};
function Qc(a){if(a instanceof Pc)return a;if("function"==typeof a.ua)return a.ua(!1);if(fa(a)){var b=0,c=new Pc;c.next=function(){for(;;){if(b>=a.length)throw Oc;if(b in a)return a[b++];b++}};
return c}throw Error("Not implemented");}
function Rc(a,b,c){if(fa(a))try{y(a,b,c)}catch(d){if(d!==Oc)throw d;}else{a=Qc(a);try{for(;;)b.call(c,a.next(),void 0,a)}catch(d){if(d!==Oc)throw d;}}}
function Sc(a){if(fa(a))return Xa(a);a=Qc(a);var b=[];Rc(a,function(a){b.push(a)});
return b}
;function Tc(a,b){this.h={};this.f=[];this.Ea=this.j=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)Uc(this,arguments[d],arguments[d+1])}else if(a){a instanceof Tc?(c=a.ra(),d=a.U()):(c=kb(a),d=jb(a));for(var e=0;e<c.length;e++)Uc(this,c[e],d[e])}}
g=Tc.prototype;g.Y=function(){return this.j};
g.U=function(){Vc(this);for(var a=[],b=0;b<this.f.length;b++)a.push(this.h[this.f[b]]);return a};
g.ra=function(){Vc(this);return this.f.concat()};
g.Za=function(a){for(var b=0;b<this.f.length;b++){var c=this.f[b];if(Wc(this.h,c)&&this.h[c]==a)return!0}return!1};
g.equals=function(a,b){if(this===a)return!0;if(this.j!=a.Y())return!1;var c=b||Xc;Vc(this);for(var d,e=0;d=this.f[e];e++)if(!c(this.get(d),a.get(d)))return!1;return!0};
function Xc(a,b){return a===b}
g.isEmpty=function(){return 0==this.j};
g.clear=function(){this.h={};this.Ea=this.j=this.f.length=0};
g.remove=function(a){return Wc(this.h,a)?(delete this.h[a],this.j--,this.Ea++,this.f.length>2*this.j&&Vc(this),!0):!1};
function Vc(a){if(a.j!=a.f.length){for(var b=0,c=0;b<a.f.length;){var d=a.f[b];Wc(a.h,d)&&(a.f[c++]=d);b++}a.f.length=c}if(a.j!=a.f.length){for(var e={},c=b=0;b<a.f.length;)d=a.f[b],Wc(e,d)||(a.f[c++]=d,e[d]=1),b++;a.f.length=c}}
g.get=function(a,b){return Wc(this.h,a)?this.h[a]:b};
function Uc(a,b,c){Wc(a.h,b)||(a.j++,a.f.push(b),a.Ea++);a.h[b]=c}
g.forEach=function(a,b){for(var c=this.ra(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};
g.clone=function(){return new Tc(this)};
g.ua=function(a){Vc(this);var b=0,c=this.Ea,d=this,e=new Pc;e.next=function(){if(c!=d.Ea)throw Error("The map has changed since the iterator was created");if(b>=d.f.length)throw Oc;var e=d.f[b++];return a?e:d.h[e]};
return e};
function Wc(a,b){return Object.prototype.hasOwnProperty.call(a,b)}
;function Yc(a){return a.Y&&"function"==typeof a.Y?a.Y():fa(a)||u(a)?a.length:fb(a)}
function Zc(a){if(a.U&&"function"==typeof a.U)return a.U();if(u(a))return a.split("");if(fa(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return jb(a)}
function $c(a){if(a.ra&&"function"==typeof a.ra)return a.ra();if(!a.U||"function"!=typeof a.U){if(fa(a)||u(a)){var b=[];a=a.length;for(var c=0;c<a;c++)b.push(c);return b}return kb(a)}}
function ad(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(fa(a)||u(a))y(a,b,void 0);else for(var c=$c(a),d=Zc(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)}
function bd(a,b){if("function"==typeof a.every)return a.every(b,void 0);if(fa(a)||u(a))return Oa(a,b,void 0);for(var c=$c(a),d=Zc(a),e=d.length,f=0;f<e;f++)if(!b.call(void 0,d[f],c&&c[f],a))return!1;return!0}
;function cd(a){this.f=new Tc;if(a){a=Zc(a);for(var b=a.length,c=0;c<b;c++){var d=a[c];Uc(this.f,dd(d),d)}}}
function dd(a){var b=typeof a;return"object"==b&&a||"function"==b?"o"+ka(a):b.substr(0,1)+a}
g=cd.prototype;g.Y=function(){return this.f.Y()};
g.removeAll=function(a){a=Zc(a);for(var b=a.length,c=0;c<b;c++)this.remove(a[c])};
g.remove=function(a){return this.f.remove(dd(a))};
g.clear=function(){this.f.clear()};
g.isEmpty=function(){return this.f.isEmpty()};
g.contains=function(a){a=dd(a);return Wc(this.f.h,a)};
g.U=function(){return this.f.U()};
g.clone=function(){return new cd(this)};
g.equals=function(a){return this.Y()==Yc(a)&&ed(this,a)};
function ed(a,b){var c=Yc(b);if(a.Y()>c)return!1;!(b instanceof cd)&&5<c&&(b=new cd(b));return bd(a,function(a){var c=b;return c.contains&&"function"==typeof c.contains?c.contains(a):c.Za&&"function"==typeof c.Za?c.Za(a):fa(c)||u(c)?A(c,a):ib(c,a)})}
g.ua=function(){return this.f.ua(!1)};function fd(){return B("iPhone")&&!B("iPod")&&!B("iPad")}
;var gd=zb(),K=B("Trident")||B("MSIE"),hd=B("Edge"),id=B("Gecko")&&!(-1!=wb.toLowerCase().indexOf("webkit")&&!B("Edge"))&&!(B("Trident")||B("MSIE"))&&!B("Edge"),jd=-1!=wb.toLowerCase().indexOf("webkit")&&!B("Edge"),kd=B("Macintosh"),ld=B("Windows");function md(){var a=wb;if(id)return/rv\:([^\);]+)(\)|;)/.exec(a);if(hd)return/Edge\/([\d\.]+)/.exec(a);if(K)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(jd)return/WebKit\/(\S+)/.exec(a)}
function nd(){var a=m.document;return a?a.documentMode:void 0}
var od=function(){if(gd&&m.opera){var a;var b=m.opera.version;try{a=b()}catch(c){a=b}return a}a="";(b=md())&&(a=b?b[1]:"");return K&&(b=nd(),b>parseFloat(a))?String(b):a}(),pd={};
function qd(a){return pd[a]||(pd[a]=0<=Ha(od,a))}
var rd=m.document,sd=rd&&K?nd()||("CSS1Compat"==rd.compatMode?parseInt(od,10):5):void 0;function td(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}
function ud(a){return eval("("+a+")")}
function L(a){return vd(new wd(void 0),a)}
function wd(a){this.f=a}
function vd(a,b){var c=[];xd(a,b,c);return c.join("")}
function xd(a,b,c){if(null==b)c.push("null");else{if("object"==typeof b){if(ea(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),e=d[f],xd(a,a.f?a.f.call(d,String(f),e):e,c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");f="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(e=b[d],"function"!=typeof e&&(c.push(f),yd(d,c),c.push(":"),xd(a,a.f?a.f.call(b,d,e):e,c),f=","));c.push("}");return}}switch(typeof b){case "string":yd(b,
c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}}
var zd={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Ad=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;function yd(a,b){b.push('"',a.replace(Ad,function(a){var b=zd[a];b||(b="\\u"+(a.charCodeAt(0)|65536).toString(16).substr(1),zd[a]=b);return b}),'"')}
;var Bd=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function Cd(a){return(a=a.match(Bd)[3]||null)?decodeURI(a):a}
function Dd(a,b){if(a)for(var c=a.split("&"),d=0;d<c.length;d++){var e=c[d].indexOf("="),f=null,h=null;0<=e?(f=c[d].substring(0,e),h=c[d].substring(e+1)):f=c[d];b(f,h?ta(h):"")}}
function Ed(a){if(a[1]){var b=a[0],c=b.indexOf("#");0<=c&&(a.push(b.substr(c)),a[0]=b=b.substr(0,c));c=b.indexOf("?");0>c?a[1]="?":c==b.length-1&&(a[1]=void 0)}return a.join("")}
function Fd(a,b,c){if(ea(b))for(var d=0;d<b.length;d++)Fd(a,String(b[d]),c);else null!=b&&c.push("&",a,""===b?"":"=",encodeURIComponent(String(b)))}
function Gd(a,b,c){for(c=c||0;c<b.length;c+=2)Fd(b[c],b[c+1],a);return a}
function Hd(a,b){for(var c in b)Fd(c,b[c],a);return a}
function Id(a){a=Hd([],a);a[0]="";return a.join("")}
function Jd(a,b){return Ed(2==arguments.length?Gd([a],arguments[1],0):Gd([a],arguments,1))}
function Kd(a,b){return Ed(Hd([a],b))}
;function Ld(a){"?"==a.charAt(0)&&(a=a.substr(1));a=a.split("&");for(var b={},c=0,d=a.length;c<d;c++){var e=a[c].split("=");if(1==e.length&&e[0]||2==e.length){var f=ta(e[0]||""),e=ta(e[1]||"");f in b?ea(b[f])?Ya(b[f],e):b[f]=[b[f],e]:b[f]=e}}return b}
function Md(a,b){var c=a.split("#",2);a=c[0];var c=1<c.length?"#"+c[1]:"",d=a.split("?",2);a=d[0];var d=Ld(d[1]||""),e;for(e in b)d[e]=b[e];return Kd(a,d)+c}
function Nd(a){a=Cd(a);a=null===a?null:a.split(".").reverse();return(null===a?!1:"com"==a[0]&&a[1].match(/^youtube(?:-nocookie)?$/)?!0:!1)||(null===a?!1:"google"==a[1]?!0:"google"==a[2]?"au"==a[0]&&"com"==a[1]?!0:"uk"==a[0]&&"co"==a[1]?!0:!1:!1)}
;var Od=null;"undefined"!=typeof XMLHttpRequest?Od=function(){return new XMLHttpRequest}:"undefined"!=typeof ActiveXObject&&(Od=function(){return new ActiveXObject("Microsoft.XMLHTTP")});function Pd(a,b,c,d,e,f,h){function k(){4==(l&&"readyState"in l?l.readyState:0)&&b&&lc(b)(l)}
var l=Od&&Od();if(!("open"in l))return null;"onloadend"in l?l.addEventListener("loadend",k,!1):l.onreadystatechange=k;c=(c||"GET").toUpperCase();d=d||"";l.open(c,a,!0);f&&(l.responseType=f);h&&(l.withCredentials=!0);f="POST"==c;if(e=Qd(a,e))for(var n in e)l.setRequestHeader(n,e[n]),"content-type"==n.toLowerCase()&&(f=!1);f&&l.setRequestHeader("Content-Type","application/x-www-form-urlencoded");l.send(d);return l}
function Qd(a,b){b=b||{};for(var c in Rd){var d=F(Rd[c]),e;if(e=d){e=a;var f=void 0;f=window.location.href;var h=e.match(Bd)[1]||null,k=Cd(e);h&&k?(e=e.match(Bd),f=f.match(Bd),e=e[3]==f[3]&&e[1]==f[1]&&e[4]==f[4]):e=k?Cd(f)==k&&(Number(f.match(Bd)[4]||null)||null)==(Number(e.match(Bd)[4]||null)||null):!0;e||(e=c,f=F("CORS_HEADER_WHITELIST")||{},e=(h=Cd(a))?(f=f[h])?A(f,e):!1:!0)}e&&(b[c]=d)}return b}
function Sd(a,b){var c=F("XSRF_FIELD_NAME",void 0),d;b.headers&&(d=b.headers["Content-Type"]);return!b.ef&&(!Cd(a)||b.withCredentials||Cd(a)==document.location.hostname)&&"POST"==b.method&&(!d||"application/x-www-form-urlencoded"==d)&&!(b.R&&b.R[c])}
function Td(a,b){var c=b.format||"JSON";b.ff&&(a=document.location.protocol+"//"+document.location.hostname+(document.location.port?":"+document.location.port:"")+a);var d=F("XSRF_FIELD_NAME",void 0),e=F("XSRF_TOKEN",void 0),f=b.ac;f&&(f[d]&&delete f[d],a=Md(a,f||{}));var h=b.postBody||"",f=b.R;Sd(a,b)&&(f||(f={}),f[d]=e);f&&u(h)&&(d=Ld(h),vb(d,f),h=Id(d));var k=!1,l,n=Pd(a,function(a){if(!k){k=!0;l&&I(l);var d;a:switch(a&&"status"in a?a.status:-1){case 200:case 201:case 202:case 203:case 204:case 205:case 206:case 304:d=
!0;break a;default:d=!1}var e=null;if(d||400<=a.status&&500>a.status)e=Ud(c,a,b.df);if(d)a:{switch(c){case "XML":d=0==parseInt(e&&e.return_code,10);break a;case "RAW":d=!0;break a}d=!!e}var e=e||{},f=b.context||m;d?b.ca&&b.ca.call(f,a,e):b.onError&&b.onError.call(f,a,e);b.Wb&&b.Wb.call(f,a,e)}},b.method,h,b.headers,b.responseType,b.withCredentials);
b.xb&&0<b.timeout&&(l=H(function(){k||(k=!0,n.abort(),I(l),b.xb.call(b.context||m,n))},b.timeout));
return n}
function Ud(a,b,c){var d=null;switch(a){case "JSON":a=b.responseText;b=b.getResponseHeader("Content-Type")||"";a&&0<=b.indexOf("json")&&(d=ud(a));break;case "XML":if(b=(b=b.responseXML)?Vd(b):null)d={},y(b.getElementsByTagName("*"),function(a){d[a.tagName]=Wd(a)})}c&&Xd(d);
return d}
function Xd(a){if(ia(a))for(var b in a){var c;(c="html_content"==b)||(c=b.length-5,c=0<=c&&b.indexOf("_html",c)==c);c?a[b]=Nc(Cb("HTML that is escaped and sanitized server-side and passed through yt.net.ajax"),a[b]):Xd(a[b])}}
function Vd(a){return a?(a=("responseXML"in a?a.responseXML:a).getElementsByTagName("root"))&&0<a.length?a[0]:null:null}
function Wd(a){var b="";y(a.childNodes,function(a){b+=a.nodeValue});
return b}
var Rd={"X-YouTube-Client-Name":"INNERTUBE_CONTEXT_CLIENT_NAME","X-YouTube-Client-Version":"INNERTUBE_CONTEXT_CLIENT_VERSION","X-YouTube-Page-CL":"PAGE_CL","X-YouTube-Page-Label":"PAGE_BUILD_LABEL","X-YouTube-Variants-Checksum":"VARIANTS_CHECKSUM"};var Yd={},Zd=0;function $d(a,b){isNaN(b)&&(b=void 0);var c=r("yt.scheduler.instance.addJob");return c?c(a,0,b):void 0===b?(a(),NaN):H(a,b||0)}
function ae(a){return $d(a,5E3)}
;var be=[],ce=!1;function de(){function a(){ce=!0;"google_ad_status"in window?jc("DCLKSTAT",1):jc("DCLKSTAT",2)}
Bc("//static.doubleclick.net/instream/ad_status.js",a);be.push(ae(function(){ce||"google_ad_status"in window||(Ic("//static.doubleclick.net/instream/ad_status.js",a),jc("DCLKSTAT",3))}))}
function ee(){return parseInt(F("DCLKSTAT",0),10)}
;function fe(a){if(a.classList)return a.classList;a=a.className;return u(a)&&a.match(/\S+/g)||[]}
function ge(a,b){return a.classList?a.classList.contains(b):A(fe(a),b)}
function he(a,b){a.classList?a.classList.add(b):ge(a,b)||(a.className+=0<a.className.length?" "+b:b)}
function ie(a,b){a.classList?a.classList.remove(b):ge(a,b)&&(a.className=Ma(fe(a),function(a){return a!=b}).join(" "))}
function je(a,b,c){c?he(a,b):ie(a,b)}
;function ke(a,b){this.x=p(a)?a:0;this.y=p(b)?b:0}
ke.prototype.clone=function(){return new ke(this.x,this.y)};
ke.prototype.floor=function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this};
ke.prototype.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this};function le(a,b){this.width=a;this.height=b}
le.prototype.clone=function(){return new le(this.width,this.height)};
le.prototype.isEmpty=function(){return!(this.width*this.height)};
le.prototype.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
le.prototype.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};!id&&!K||K&&9<=sd||id&&qd("1.9.1");var me=K&&!qd("9");function ne(a){return a?new oe(pe(a)):qa||(qa=new oe)}
function qe(a){return u(a)?document.getElementById(a):a}
function re(a){var b=document;return u(a)?b.getElementById(a):a}
function se(a){var b=document;return b.querySelectorAll&&b.querySelector?b.querySelectorAll("."+a):te(a,void 0)}
function te(a,b){var c,d,e,f;c=document;c=b||c;if(c.querySelectorAll&&c.querySelector&&a)return c.querySelectorAll(""+(a?"."+a:""));if(a&&c.getElementsByClassName){var h=c.getElementsByClassName(a);return h}h=c.getElementsByTagName("*");if(a){f={};for(d=e=0;c=h[d];d++){var k=c.className;"function"==typeof k.split&&A(k.split(/\s+/),a)&&(f[e++]=c)}f.length=e;return f}return h}
function ue(a){var b=a.scrollingElement?a.scrollingElement:!jd&&ve(a)?a.documentElement:a.body||a.documentElement;a=a.parentWindow||a.defaultView;return K&&qd("10")&&a.pageYOffset!=b.scrollTop?new ke(b.scrollLeft,b.scrollTop):new ke(a.pageXOffset||b.scrollLeft,a.pageYOffset||b.scrollTop)}
function ve(a){return"CSS1Compat"==a.compatMode}
function we(a){for(var b;b=a.firstChild;)a.removeChild(b)}
function xe(a){if(!a)return null;if(a.firstChild)return a.firstChild;for(;a&&!a.nextSibling;)a=a.parentNode;return a?a.nextSibling:null}
function ye(a){if(!a)return null;if(!a.previousSibling)return a.parentNode;for(a=a.previousSibling;a&&a.lastChild;)a=a.lastChild;return a}
function pe(a){return 9==a.nodeType?a:a.ownerDocument||a.document}
function ze(a,b){if("textContent"in a)a.textContent=b;else if(3==a.nodeType)a.data=b;else if(a.firstChild&&3==a.firstChild.nodeType){for(;a.lastChild!=a.firstChild;)a.removeChild(a.lastChild);a.firstChild.data=b}else{we(a);var c=pe(a);a.appendChild(c.createTextNode(String(b)))}}
var Ae={SCRIPT:1,STYLE:1,HEAD:1,IFRAME:1,OBJECT:1},Be={IMG:" ",BR:"\n"};function Ce(a){if(me&&"innerText"in a)a=a.innerText.replace(/(\r\n|\r|\n)/g,"\n");else{var b=[];De(a,b,!0);a=b.join("")}a=a.replace(/ \xAD /g," ").replace(/\xAD/g,"");a=a.replace(/\u200B/g,"");me||(a=a.replace(/ +/g," "));" "!=a&&(a=a.replace(/^\s*/,""));return a}
function De(a,b,c){if(!(a.nodeName in Ae))if(3==a.nodeType)c?b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g,"")):b.push(a.nodeValue);else if(a.nodeName in Be)b.push(Be[a.nodeName]);else for(a=a.firstChild;a;)De(a,b,c),a=a.nextSibling}
function Ee(a){var b=Fe.bd;return b?Ge(a,function(a){return!b||u(a.className)&&A(a.className.split(/\s+/),b)},!0,void 0):null}
function Ge(a,b,c,d){c||(a=a.parentNode);c=null==d;for(var e=0;a&&(c||e<=d);){if(b(a))return a;a=a.parentNode;e++}return null}
function oe(a){this.f=a||m.document||document}
oe.prototype.createElement=function(a){return this.f.createElement(a)};
oe.prototype.appendChild=function(a,b){a.appendChild(b)};
oe.prototype.contains=function(a,b){if(!a||!b)return!1;if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||Boolean(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a};var He=jd?"webkit":id?"moz":K?"ms":gd?"o":"",Ie=r("yt.dom.getNextId_");if(!Ie){Ie=function(){return++Je};
q("yt.dom.getNextId_",Ie,void 0);var Je=0}function Ke(){var a=document,b;Na(["fullscreenElement","fullScreenElement"],function(c){c in a?b=a[c]:(c=He+c.charAt(0).toUpperCase()+c.substr(1),b=c in a?a[c]:void 0);return!!b});
return b}
;function Le(a){this.type="";this.state=this.source=this.data=this.currentTarget=this.relatedTarget=this.target=null;this.charCode=this.keyCode=0;this.shiftKey=this.ctrlKey=this.altKey=!1;this.clientY=this.clientX=0;this.changedTouches=null;if(a=a||window.event){this.event=a;for(var b in a)b in Me||(this[b]=a[b]);(b=a.target||a.srcElement)&&3==b.nodeType&&(b=b.parentNode);this.target=b;if(b=a.relatedTarget)try{b=b.nodeName?b:null}catch(c){b=null}else"mouseover"==this.type?b=a.fromElement:"mouseout"==
this.type&&(b=a.toElement);this.relatedTarget=b;this.clientX=void 0!=a.clientX?a.clientX:a.pageX;this.clientY=void 0!=a.clientY?a.clientY:a.pageY;this.keyCode=a.keyCode?a.keyCode:a.which;this.charCode=a.charCode||("keypress"==this.type?this.keyCode:0);this.altKey=a.altKey;this.ctrlKey=a.ctrlKey;this.shiftKey=a.shiftKey}}
Le.prototype.preventDefault=function(){this.event&&(this.event.returnValue=!1,this.event.preventDefault&&this.event.preventDefault())};
var Me={stopImmediatePropagation:1,stopPropagation:1,preventMouseEvent:1,preventManipulation:1,preventDefault:1,layerX:1,layerY:1,scale:1,rotation:1,webkitMovementX:1,webkitMovementY:1};var ob=r("yt.events.listeners_")||{};q("yt.events.listeners_",ob,void 0);var Ne=r("yt.events.counter_")||{count:0};q("yt.events.counter_",Ne,void 0);function Oe(a,b,c,d){return nb(function(e){return e[0]==a&&e[1]==b&&e[2]==c&&e[4]==!!d})}
function M(a,b,c,d){if(!a||!a.addEventListener&&!a.attachEvent)return"";d=!!d;var e=Oe(a,b,c,d);if(e)return e;var e=++Ne.count+"",f=!("mouseenter"!=b&&"mouseleave"!=b||!a.addEventListener||"onmouseenter"in document),h;h=f?function(d){d=new Le(d);if(!Ge(d.relatedTarget,function(b){return b==a},!0))return d.currentTarget=a,d.type=b,c.call(a,d)}:function(b){b=new Le(b);
b.currentTarget=a;return c.call(a,b)};
h=lc(h);ob[e]=[a,b,c,h,d];a.addEventListener?"mouseenter"==b&&f?a.addEventListener("mouseover",h,d):"mouseleave"==b&&f?a.addEventListener("mouseout",h,d):"mousewheel"==b&&"MozBoxSizing"in document.documentElement.style?a.addEventListener("MozMousePixelScroll",h,d):a.addEventListener(b,h,d):a.attachEvent("on"+b,h);return e}
function Pe(a){a&&("string"==typeof a&&(a=[a]),y(a,function(a){if(a in ob){var c=ob[a],d=c[0],e=c[1],f=c[3],c=c[4];d.removeEventListener?d.removeEventListener(e,f,c):d.detachEvent&&d.detachEvent("on"+e,f);delete ob[a]}}))}
;function Qe(){if(null==r("_lact",window)){var a=parseInt(F("LACT"),10),a=isFinite(a)?w()-Math.max(a,0):-1;q("_lact",a,window);-1==a&&Re();M(document,"keydown",Re);M(document,"keyup",Re);M(document,"mousedown",Re);M(document,"mouseup",Re);vc("page-mouse",Re);vc("page-scroll",Re);vc("page-resize",Re)}}
function Re(){null==r("_lact",window)&&(Qe(),r("_lact",window));var a=w();q("_lact",a,window);J("USER_ACTIVE")}
function Se(){var a=r("_lact",window);return null==a?-1:Math.max(w()-a,0)}
;function Te(){}
;function Ue(a){this.f=a}
var Ve=/\s*;\s*/;g=Ue.prototype;g.isEnabled=function(){return navigator.cookieEnabled};
function We(a,b,c,d,e,f){if(/[;=\s]/.test(b))throw Error('Invalid cookie name "'+b+'"');if(/[;\r\n]/.test(c))throw Error('Invalid cookie value "'+c+'"');p(d)||(d=-1);f=f?";domain="+f:"";e=e?";path="+e:"";d=0>d?"":0==d?";expires="+(new Date(1970,1,1)).toUTCString():";expires="+(new Date(w()+1E3*d)).toUTCString();a.f.cookie=b+"="+c+f+e+d+""}
g.get=function(a,b){for(var c=a+"=",d=(this.f.cookie||"").split(Ve),e=0,f;f=d[e];e++){if(0==f.lastIndexOf(c,0))return f.substr(c.length);if(f==a)return""}return b};
g.remove=function(a,b,c){var d=p(this.get(a));We(this,a,"",0,b,c);return d};
g.ra=function(){return Xe(this).keys};
g.U=function(){return Xe(this).values};
g.isEmpty=function(){return!this.f.cookie};
g.Y=function(){return this.f.cookie?(this.f.cookie||"").split(Ve).length:0};
g.Za=function(a){for(var b=Xe(this).values,c=0;c<b.length;c++)if(b[c]==a)return!0;return!1};
g.clear=function(){for(var a=Xe(this).keys,b=a.length-1;0<=b;b--)this.remove(a[b])};
function Xe(a){a=(a.f.cookie||"").split(Ve);for(var b=[],c=[],d,e,f=0;e=a[f];f++)d=e.indexOf("="),-1==d?(b.push(""),c.push(e)):(b.push(e.substring(0,d)),c.push(e.substring(d+1)));return{keys:b,values:c}}
var Ye=new Ue(document);Ye.h=3950;function Ze(a,b,c){We(Ye,""+a,b,c,"/","youtube.com")}
;function $e(a,b,c){var d=F("EVENT_ID");d&&(b||(b={}),b.ei||(b.ei=d));if(b){var d=F("VALID_SESSION_TEMPDATA_DOMAINS",[]),e=Cd(window.location.href);e&&d.push(e);e=Cd(a);if(A(d,e)||!e&&0==a.lastIndexOf("/",0)){var f=a.match(Bd),d=f[5],e=f[6],f=f[7],h="";d&&(h+=d);e&&(h+="?"+e);f&&(h+="#"+f);d=h;e=d.indexOf("#");if(d=0>e?d:d.substr(0,e))d=F("SMALLER_SESSION_TEMPDATA_NAME")?"ST-"+Ja(d).toString(36):"s_tempdata-"+Ja(d),e=b?Id(b):"",Ze(d,e,5),b&&(b=b.itct||b.ved,d=r("yt.logging.screenreporter.storeParentElement"),
b&&d&&d(new Te))}}if(c)return!1;(window.ytspf||{}).enabled?spf.navigate(a):(c=window.location,a=Kd(a,{})+"",a=a instanceof Db?a:Hb(a),c.href=Fb(a));return!0}
;function af(a){a=a||{};this.url=a.url||"";this.urlV9As2=a.url_v9as2||"";this.args=a.args||sb(bf);this.assets=a.assets||{};this.attrs=a.attrs||sb(cf);this.params=a.params||sb(df);this.minVersion=a.min_version||"8.0.0";this.fallback=a.fallback||null;this.fallbackMessage=a.fallbackMessage||null;this.html5=!!a.html5;this.disable=a.disable||{};this.loaded=!!a.loaded;this.messages=a.messages||{}}
var bf={enablejsapi:1},cf={},df={allowscriptaccess:"always",allowfullscreen:"true",bgcolor:"#000000"};function ef(a){a instanceof af||(a=new af(a));return a}
af.prototype.clone=function(){var a=new af,b;for(b in this)if(this.hasOwnProperty(b)){var c=this[b];"object"==da(c)?a[b]=sb(c):a[b]=c}return a};function ff(a){ff[" "](a);return a}
ff[" "]=t;var gf=!K||9<=sd,hf=K&&!qd("9");!jd||qd("528");id&&qd("1.9b")||K&&qd("8")||gd&&qd("9.5")||jd&&qd("528");id&&!qd("8")||K&&qd("9");function jf(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=!1;this.Nc=!0}
jf.prototype.preventDefault=function(){this.defaultPrevented=!0;this.Nc=!1};function kf(a,b){jf.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.f=this.state=null;a&&this.init(a,b)}
x(kf,jf);
kf.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.currentTarget=b;var e=a.relatedTarget;if(e){if(id){var f;a:{try{ff(e.nodeName);f=!0;break a}catch(h){}f=!1}f||(e=null)}}else"mouseover"==c?e=a.fromElement:"mouseout"==c&&(e=a.toElement);this.relatedTarget=e;null===d?(this.clientX=void 0!==a.clientX?a.clientX:a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||
0):(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.f=a;a.defaultPrevented&&this.preventDefault()};
kf.prototype.preventDefault=function(){kf.I.preventDefault.call(this);var a=this.f;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,hf)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var lf="closure_listenable_"+(1E6*Math.random()|0),mf=0;function nf(a,b,c,d,e){this.listener=a;this.f=null;this.src=b;this.type=c;this.pb=!!d;this.tb=e;this.key=++mf;this.Va=this.ob=!1}
function of(a){a.Va=!0;a.listener=null;a.f=null;a.src=null;a.tb=null}
;function pf(a){this.src=a;this.f={};this.h=0}
function qf(a,b,c,d,e){var f=b.toString();b=a.f[f];b||(b=a.f[f]=[],a.h++);var h=rf(b,c,d,e);-1<h?(a=b[h],a.ob=!1):(a=new nf(c,a.src,f,!!d,e),a.ob=!1,b.push(a));return a}
pf.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.f))return!1;var e=this.f[a];b=rf(e,b,c,d);return-1<b?(of(e[b]),Array.prototype.splice.call(e,b,1),0==e.length&&(delete this.f[a],this.h--),!0):!1};
function sf(a,b){var c=b.type;c in a.f&&Ua(a.f[c],b)&&(of(b),0==a.f[c].length&&(delete a.f[c],a.h--))}
pf.prototype.removeAll=function(a){a=a&&a.toString();var b=0,c;for(c in this.f)if(!a||c==a){for(var d=this.f[c],e=0;e<d.length;e++)++b,of(d[e]);delete this.f[c];this.h--}return b};
function tf(a,b,c,d,e){a=a.f[b.toString()];b=-1;a&&(b=rf(a,c,d,e));return-1<b?a[b]:null}
function rf(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.Va&&f.listener==b&&f.pb==!!c&&f.tb==d)return e}return-1}
;var uf="closure_lm_"+(1E6*Math.random()|0),vf={},wf=0;
function xf(a,b,c,d,e){if(ea(b)){for(var f=0;f<b.length;f++)xf(a,b[f],c,d,e);return null}c=yf(c);if(a&&a[lf])a=a.ub(b,c,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,h=zf(a);h||(a[uf]=h=new pf(a));c=qf(h,b,c,d,e);if(!c.f){d=Af();c.f=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,f);else if(a.attachEvent)a.attachEvent(Bf(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");wf++}a=c}return a}
function Af(){var a=Cf,b=gf?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);
if(!c)return c};
return b}
function Df(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)Df(a,b[f],c,d,e);else c=yf(c),a&&a[lf]?a.$b(b,c,d,e):a&&(a=zf(a))&&(b=tf(a,b,c,!!d,e))&&Ef(b)}
function Ef(a){if(!ga(a)&&a&&!a.Va){var b=a.src;if(b&&b[lf])sf(b.Ba,a);else{var c=a.type,d=a.f;b.removeEventListener?b.removeEventListener(c,d,a.pb):b.detachEvent&&b.detachEvent(Bf(c),d);wf--;(c=zf(b))?(sf(c,a),0==c.h&&(c.src=null,b[uf]=null)):of(a)}}}
function Bf(a){return a in vf?vf[a]:vf[a]="on"+a}
function Ff(a,b,c,d){var e=!0;if(a=zf(a))if(b=a.f[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.pb==c&&!f.Va&&(f=Gf(f,d),e=e&&!1!==f)}return e}
function Gf(a,b){var c=a.listener,d=a.tb||a.src;a.ob&&Ef(a);return c.call(d,b)}
function Cf(a,b){if(a.Va)return!0;if(!gf){var c=b||r("window.event"),d=new kf(c,this),e=!0;if(!(0>c.keyCode||void 0!=c.returnValue)){a:{var f=!1;if(0==c.keyCode)try{c.keyCode=-1;break a}catch(l){f=!0}if(f||void 0==c.returnValue)c.returnValue=!0}c=[];for(f=d.currentTarget;f;f=f.parentNode)c.push(f);for(var f=a.type,h=c.length-1;0<=h;h--){d.currentTarget=c[h];var k=Ff(c[h],f,!0,d),e=e&&k}for(h=0;h<c.length;h++)d.currentTarget=c[h],k=Ff(c[h],f,!1,d),e=e&&k}return e}return Gf(a,new kf(b,this))}
function zf(a){a=a[uf];return a instanceof pf?a:null}
var Hf="__closure_events_fn_"+(1E9*Math.random()>>>0);function yf(a){if(ha(a))return a;a[Hf]||(a[Hf]=function(b){return a.handleEvent(b)});
return a[Hf]}
;function If(a,b,c,d){this.top=a;this.right=b;this.bottom=c;this.left=d}
If.prototype.clone=function(){return new If(this.top,this.right,this.bottom,this.left)};
If.prototype.contains=function(a){return this&&a?a instanceof If?a.left>=this.left&&a.right<=this.right&&a.top>=this.top&&a.bottom<=this.bottom:a.x>=this.left&&a.x<=this.right&&a.y>=this.top&&a.y<=this.bottom:!1};
If.prototype.floor=function(){this.top=Math.floor(this.top);this.right=Math.floor(this.right);this.bottom=Math.floor(this.bottom);this.left=Math.floor(this.left);return this};
If.prototype.round=function(){this.top=Math.round(this.top);this.right=Math.round(this.right);this.bottom=Math.round(this.bottom);this.left=Math.round(this.left);return this};function Jf(a,b,c,d){this.left=a;this.top=b;this.width=c;this.height=d}
Jf.prototype.clone=function(){return new Jf(this.left,this.top,this.width,this.height)};
Jf.prototype.contains=function(a){return a instanceof Jf?this.left<=a.left&&this.left+this.width>=a.left+a.width&&this.top<=a.top&&this.top+this.height>=a.top+a.height:a.x>=this.left&&a.x<=this.left+this.width&&a.y>=this.top&&a.y<=this.top+this.height};
Jf.prototype.floor=function(){this.left=Math.floor(this.left);this.top=Math.floor(this.top);this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
Jf.prototype.round=function(){this.left=Math.round(this.left);this.top=Math.round(this.top);this.width=Math.round(this.width);this.height=Math.round(this.height);return this};function Kf(a,b){var c=pe(a);return c.defaultView&&c.defaultView.getComputedStyle&&(c=c.defaultView.getComputedStyle(a,null))?c[b]||c.getPropertyValue(b)||"":""}
function Lf(a,b){return Kf(a,b)||(a.currentStyle?a.currentStyle[b]:null)||a.style&&a.style[b]}
function Mf(a){var b;try{b=a.getBoundingClientRect()}catch(c){return{left:0,top:0,right:0,bottom:0}}K&&a.ownerDocument.body&&(a=a.ownerDocument,b.left-=a.documentElement.clientLeft+a.body.clientLeft,b.top-=a.documentElement.clientTop+a.body.clientTop);return b}
function Nf(a,b){"number"==typeof a&&(a=(b?Math.round(a):a)+"px");return a}
function Of(a){var b=Pf;if("none"!=Lf(a,"display"))return b(a);var c=a.style,d=c.display,e=c.visibility,f=c.position;c.visibility="hidden";c.position="absolute";c.display="inline";a=b(a);c.display=d;c.position=f;c.visibility=e;return a}
function Pf(a){var b=a.offsetWidth,c=a.offsetHeight,d=jd&&!b&&!c;return p(b)&&!d||!a.getBoundingClientRect?new le(b,c):(a=Mf(a),new le(a.right-a.left,a.bottom-a.top))}
function Qf(a,b){if(/^\d+px?$/.test(b))return parseInt(b,10);var c=a.style.left,d=a.runtimeStyle.left;a.runtimeStyle.left=a.currentStyle.left;a.style.left=b;var e=a.style.pixelLeft;a.style.left=c;a.runtimeStyle.left=d;return e}
function Rf(a,b){var c=a.currentStyle?a.currentStyle[b]:null;return c?Qf(a,c):0}
var Sf={thin:2,medium:4,thick:6};function Tf(a,b){if("none"==(a.currentStyle?a.currentStyle[b+"Style"]:null))return 0;var c=a.currentStyle?a.currentStyle[b+"Width"]:null;return c in Sf?Sf[c]:Qf(a,c)}
;var Uf=B("Firefox"),Vf=fd()||B("iPod"),Wf=B("iPad"),Xf=B("Android")&&!(Ab()||B("Firefox")||zb()||B("Silk")),Yf=Ab(),Zf=B("Safari")&&!(Ab()||B("Coast")||zb()||B("Edge")||B("Silk")||B("Android"))&&!(fd()||B("iPad")||B("iPod"));function $f(){var a;if(a=Ye.get("PREF",void 0)){a=unescape(a).split("&");for(var b=0;b<a.length;b++){var c=a[b].split("="),d=c[0];(c=c[1])&&(ag[d]=c.toString())}}}
ca($f);var ag=r("yt.prefs.UserPrefs.prefs_")||{};q("yt.prefs.UserPrefs.prefs_",ag,void 0);function bg(a){if(/^f([1-9][0-9]*)$/.test(a))throw"ExpectedRegexMatch: "+a;}
function cg(a){if(!/^\w+$/.test(a))throw"ExpectedRegexMismatch: "+a;}
function dg(a){a=void 0!==ag[a]?ag[a].toString():null;return null!=a&&/^[A-Fa-f0-9]+$/.test(a)?parseInt(a,16):null}
$f.prototype.get=function(a,b){cg(a);bg(a);var c=void 0!==ag[a]?ag[a].toString():null;return null!=c?c:b?b:""};
function eg(a,b){return!!((dg("f"+(Math.floor(b/31)+1))||0)&1<<b%31)}
$f.prototype.remove=function(a){cg(a);bg(a);delete ag[a]};
$f.prototype.clear=function(){ag={}};function fg(a,b){(a=qe(a))&&a.style&&(a.style.display=b?"":"none",je(a,"hid",!b))}
function gg(a){y(arguments,function(a){!fa(a)||a instanceof Element?fg(a,!0):y(a,function(a){gg(a)})})}
function hg(a){y(arguments,function(a){!fa(a)||a instanceof Element?fg(a,!1):y(a,function(a){hg(a)})})}
;function ig(){this.j=this.h=this.f=0;this.o="";var a=r("window.navigator.plugins"),b=r("window.navigator.mimeTypes"),a=a&&a["Shockwave Flash"],b=b&&b["application/x-shockwave-flash"],b=a&&b&&b.enabledPlugin&&a.description||"";if(a=b){var c=a.indexOf("Shockwave Flash");0<=c&&(a=a.substr(c+15));for(var c=a.split(" "),d="",a="",e=0,f=c.length;e<f;e++)if(d)if(a)break;else a=c[e];else d=c[e];d=d.split(".");c=parseInt(d[0],10)||0;d=parseInt(d[1],10)||0;e=0;if("r"==a.charAt(0)||"d"==a.charAt(0))e=parseInt(a.substr(1),
10)||0;a=[c,d,e]}else a=[0,0,0];this.o=b;b=a;this.f=b[0];this.h=b[1];this.j=b[2];if(0>=this.f){var h,k,l,n;if(pc)try{h=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")}catch(G){h=null}else l=document.body,n=document.createElement("object"),n.setAttribute("type","application/x-shockwave-flash"),h=l.appendChild(n);if(h&&"GetVariable"in h)try{k=h.GetVariable("$version")}catch(G){k=""}l&&n&&l.removeChild(n);(h=k||"")?(h=h.split(" ")[1].split(","),h=[parseInt(h[0],10)||0,parseInt(h[1],10)||0,parseInt(h[2],
10)||0]):h=[0,0,0];this.f=h[0];this.h=h[1];this.j=h[2]}}
ca(ig);function jg(a,b,c,d){b="string"==typeof b?b.split("."):[b,c,d];b[0]=parseInt(b[0],10)||0;b[1]=parseInt(b[1],10)||0;b[2]=parseInt(b[2],10)||0;return a.f>b[0]||a.f==b[0]&&a.h>b[1]||a.f==b[0]&&a.h==b[1]&&a.j>=b[2]}
function kg(a){return-1<a.o.indexOf("Gnash")&&-1==a.o.indexOf("AVM2")||9==a.f&&1==a.h||9==a.f&&0==a.h&&1==a.j?!1:9<=a.f}
function lg(a){return ld?!jg(a,11,2):kd?!jg(a,11,3):!kg(a)}
;function mg(a,b,c){if(b){a=u(a)?re(a):a;var d=sb(c.attrs);d.tabindex=0;var e=sb(c.params);e.flashvars=Id(c.args);if(pc){d.classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";e.movie=b;b=document.createElement("object");for(var f in d)b.setAttribute(f,d[f]);for(f in e)d=document.createElement("param"),d.setAttribute("name",f),d.setAttribute("value",e[f]),b.appendChild(d)}else{d.type="application/x-shockwave-flash";d.src=b;b=document.createElement("embed");b.setAttribute("name",d.id);for(f in d)b.setAttribute(f,
d[f]);for(f in e)b.setAttribute(f,e[f])}e=document.createElement("div");e.appendChild(b);a.innerHTML=e.innerHTML}}
function ng(a,b,c){if(a&&a.attrs&&a.attrs.id){a=ef(a);var d=!!b,e=qe(a.attrs.id),f=e?e.parentNode:null;if(e&&f){if(window!=window.top){var h=null;if(document.referrer){var k=document.referrer.substring(0,128);Nd(k)||(h=k)}else h="unknown";h&&(d=!0,a.args.framer=h)}h=ig.getInstance();if(jg(h,a.minVersion)){var k=og(a,h),l="";-1<navigator.userAgent.indexOf("Sony/COM2")||(l=e.getAttribute("src")||e.movie);(l!=k||d)&&mg(f,k,a);lg(h)&&pg()}else qg(f,a,h);c&&c()}else H(function(){ng(a,b,c)},50)}}
function qg(a,b,c){0==c.f&&b.fallback?b.fallback():0==c.f&&b.fallbackMessage?b.fallbackMessage():a.innerHTML='<div id="flash-upgrade">'+oc()+"</div>"}
function og(a,b){return kg(b)&&a.url||(-1<navigator.userAgent.indexOf("Sony/COM2")&&!jg(b,9,1,58)?!1:!0)&&a.urlV9As2||a.url}
function pg(){var a=qe("flash10-promo-div"),b=eg($f.getInstance(),107);a&&!b&&gg(a)}
;function rg(a){if(window.spf){var b=a.match(sg);spf.style.load(a,b?b[1]:"",void 0)}else tg(a)}
function tg(a){var b=ug(a),c=document.getElementById(b),d=c&&C(c,"loaded");d||c&&!d||(c=vg(a,b,function(){C(c,"loaded")||(Nb(c,"loaded","true"),J(b),H(pa(Ac,b),0))}))}
function vg(a,b,c){var d=document.createElement("link");d.id=b;d.rel="stylesheet";d.onload=function(){c&&setTimeout(c,0)};
Mb(d,a);(document.getElementsByTagName("head")[0]||document.body).appendChild(d);return d}
function ug(a){var b=document.createElement("a");Mb(b,a);a=b.href.replace(/^[a-zA-Z]+:\/\//,"//");return"css-"+Ja(a)}
var sg=/cssbin\/(?:debug-)?([a-zA-Z0-9_-]+?)(?:-2x|-web|-rtl|-vfl|.css)/;var wg;var xg=wb,xg=xg.toLowerCase();if(-1!=xg.indexOf("android")){var yg=xg.match(/android\D*(\d\.\d)[^\;|\)]*[\;\)]/);if(yg)wg=Number(yg[1]);else{var zg={cupcake:1.5,donut:1.6,eclair:2,froyo:2.2,gingerbread:2.3,honeycomb:3,"ice cream sandwich":4,jellybean:4.1},Ag=xg.match("("+kb(zg).join("|")+")");wg=Ag?zg[Ag[0]]:0}}else wg=void 0;var Bg=Vf||Wf;var Cg=['video/mp4; codecs="avc1.42001E, mp4a.40.2"','video/webm; codecs="vp8.0, vorbis"'],Dg=['audio/mp4; codecs="mp4a.40.2"'];function Eg(a,b){this.h=this.F=this.o="";this.B=null;this.l=this.f="";this.A=!1;var c;a instanceof Eg?(this.A=p(b)?b:a.A,Fg(this,a.o),this.F=a.F,Gg(this,a.h),Hg(this,a.B),this.f=a.f,Ig(this,a.j.clone()),this.l=a.l):a&&(c=String(a).match(Bd))?(this.A=!!b,Fg(this,c[1]||"",!0),this.F=Jg(c[2]||""),Gg(this,c[3]||"",!0),Hg(this,c[4]),this.f=Jg(c[5]||"",!0),Ig(this,c[6]||"",!0),this.l=Jg(c[7]||"")):(this.A=!!b,this.j=new Kg(null,0,this.A))}
Eg.prototype.toString=function(){var a=[],b=this.o;b&&a.push(Lg(b,Mg,!0),":");var c=this.h;if(c||"file"==b)a.push("//"),(b=this.F)&&a.push(Lg(b,Mg,!0),"@"),a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.B,null!=c&&a.push(":",String(c));if(c=this.f)this.h&&"/"!=c.charAt(0)&&a.push("/"),a.push(Lg(c,"/"==c.charAt(0)?Ng:Og,!0));(c=this.j.toString())&&a.push("?",c);(c=this.l)&&a.push("#",Lg(c,Pg));return a.join("")};
Eg.prototype.resolve=function(a){var b=this.clone(),c=!!a.o;c?Fg(b,a.o):c=!!a.F;c?b.F=a.F:c=!!a.h;c?Gg(b,a.h):c=null!=a.B;var d=a.f;if(c)Hg(b,a.B);else if(c=!!a.f){if("/"!=d.charAt(0))if(this.h&&!this.f)d="/"+d;else{var e=b.f.lastIndexOf("/");-1!=e&&(d=b.f.substr(0,e+1)+d)}e=d;if(".."==e||"."==e)d="";else if(-1!=e.indexOf("./")||-1!=e.indexOf("/.")){for(var d=0==e.lastIndexOf("/",0),e=e.split("/"),f=[],h=0;h<e.length;){var k=e[h++];"."==k?d&&h==e.length&&f.push(""):".."==k?((1<f.length||1==f.length&&
""!=f[0])&&f.pop(),d&&h==e.length&&f.push("")):(f.push(k),d=!0)}d=f.join("/")}else d=e}c?b.f=d:c=""!==a.j.toString();c?Ig(b,Jg(a.j.toString())):c=!!a.l;c&&(b.l=a.l);return b};
Eg.prototype.clone=function(){return new Eg(this)};
function Fg(a,b,c){a.o=c?Jg(b,!0):b;a.o&&(a.o=a.o.replace(/:$/,""))}
function Gg(a,b,c){a.h=c?Jg(b,!0):b}
function Hg(a,b){if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.B=b}else a.B=null}
function Ig(a,b,c){b instanceof Kg?(a.j=b,Qg(a.j,a.A)):(c||(b=Lg(b,Rg)),a.j=new Kg(b,0,a.A))}
function N(a,b,c){a=a.j;Sg(a);a.j=null;b=Tg(a,b);Ug(a,b)&&(a.h-=a.f.get(b).length);Uc(a.f,b,[c]);a.h++}
function Vg(a,b,c){ea(c)||(c=[String(c)]);Wg(a.j,b,c)}
function Xg(a){N(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^w()).toString(36));return a}
function Yg(a){return a instanceof Eg?a.clone():new Eg(a,void 0)}
function Zg(a,b,c,d){var e=new Eg(null,void 0);a&&Fg(e,a);b&&Gg(e,b);c&&Hg(e,c);d&&(e.f=d);return e}
function Jg(a,b){return a?b?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}
function Lg(a,b,c){return u(a)?(a=encodeURI(a).replace(b,$g),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}
function $g(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)}
var Mg=/[#\/\?@]/g,Og=/[\#\?:]/g,Ng=/[\#\?]/g,Rg=/[\#\?@]/g,Pg=/#/g;function Kg(a,b,c){this.h=this.f=null;this.j=a||null;this.o=!!c}
function Sg(a){a.f||(a.f=new Tc,a.h=0,a.j&&Dd(a.j,function(b,c){var d=ta(b);Sg(a);a.j=null;var d=Tg(a,d),e=a.f.get(d);e||Uc(a.f,d,e=[]);e.push(c);a.h++}))}
g=Kg.prototype;g.Y=function(){Sg(this);return this.h};
g.remove=function(a){Sg(this);a=Tg(this,a);return Wc(this.f.h,a)?(this.j=null,this.h-=this.f.get(a).length,this.f.remove(a)):!1};
g.clear=function(){this.f=this.j=null;this.h=0};
g.isEmpty=function(){Sg(this);return 0==this.h};
function Ug(a,b){Sg(a);b=Tg(a,b);return Wc(a.f.h,b)}
g.Za=function(a){var b=this.U();return A(b,a)};
g.ra=function(){Sg(this);for(var a=this.f.U(),b=this.f.ra(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};
g.U=function(a){Sg(this);var b=[];if(u(a))Ug(this,a)&&(b=Wa(b,this.f.get(Tg(this,a))));else{a=this.f.U();for(var c=0;c<a.length;c++)b=Wa(b,a[c])}return b};
g.get=function(a,b){var c=a?this.U(a):[];return 0<c.length?String(c[0]):b};
function Wg(a,b,c){a.remove(b);0<c.length&&(a.j=null,Uc(a.f,Tg(a,b),Xa(c)),a.h+=c.length)}
g.toString=function(){if(this.j)return this.j;if(!this.f)return"";for(var a=[],b=this.f.ra(),c=0;c<b.length;c++)for(var d=b[c],e=encodeURIComponent(String(d)),d=this.U(d),f=0;f<d.length;f++){var h=e;""!==d[f]&&(h+="="+encodeURIComponent(String(d[f])));a.push(h)}return this.j=a.join("&")};
g.clone=function(){var a=new Kg;a.j=this.j;this.f&&(a.f=this.f.clone(),a.h=this.h);return a};
function Tg(a,b){var c=String(b);a.o&&(c=c.toLowerCase());return c}
function Qg(a,b){b&&!a.o&&(Sg(a),a.j=null,a.f.forEach(function(a,b){var e=b.toLowerCase();b!=e&&(this.remove(b),Wg(this,e,a))},a));
a.o=b}
;var ah="corp.google.com googleplex.com youtube.com youtube-nocookie.com youtubeeducation.com borg.google.com prod.google.com sandbox.google.com books.googleusercontent.com docs.google.com drive.google.com mail.google.com photos.google.com plus.google.com lh2.google.com picasaweb.google.com play.google.com googlevideo.com talkgadget.google.com survey.g.doubleclick.net youtube.googleapis.com vevo.com".split(" "),bh="";
function ch(a){return a&&a==bh?!0:(new RegExp("^(https?:)?//([a-z0-9-]{1,63}\\.)*("+ah.join("|").replace(/\./g,".")+")(:[0-9]+)?([/?#]|$)","i")).test(a)?(bh=a,!0):!1}
;var dh={},eh=0,fh=r("yt.net.ping.workerUrl_")||null;q("yt.net.ping.workerUrl_",fh,void 0);function gh(a){try{window.navigator&&window.navigator.sendBeacon&&window.navigator.sendBeacon(a,"")||a&&hh(a)}catch(b){a&&hh(a)}}
function hh(a){var b=new Image,c=""+eh++;dh[c]=b;b.onload=b.onerror=function(){delete dh[c]};
b.src=a}
;function O(a,b){this.version=a;this.args=b}
function ih(a){if(!a.Ea){var b={};a.call(b);a.Ea=b.version}return a.Ea}
function jh(a,b){function c(){a.apply(this,b.args)}
if(!b.args||!b.version)throw Error("yt.pubsub2.Data.deserialize(): serializedData is incomplete.");var d;try{d=ih(a)}catch(e){}if(!d||b.version!=d)throw Error("yt.pubsub2.Data.deserialize(): serializedData version is incompatible.");c.prototype=a.prototype;try{return new c}catch(e){throw e.message="yt.pubsub2.Data.deserialize(): "+e.message,e;}}
function P(a,b){this.topic=a;this.f=b}
P.prototype.toString=function(){return this.topic};var kh=r("yt.pubsub2.instance_")||new E;E.prototype.subscribe=E.prototype.subscribe;E.prototype.unsubscribeByKey=E.prototype.oa;E.prototype.publish=E.prototype.D;E.prototype.clear=E.prototype.clear;q("yt.pubsub2.instance_",kh,void 0);var lh=r("yt.pubsub2.subscribedKeys_")||{};q("yt.pubsub2.subscribedKeys_",lh,void 0);var mh=r("yt.pubsub2.topicToKeys_")||{};q("yt.pubsub2.topicToKeys_",mh,void 0);var nh=r("yt.pubsub2.isAsync_")||{};q("yt.pubsub2.isAsync_",nh,void 0);
q("yt.pubsub2.skipSubKey_",null,void 0);function Q(a,b){var c=oh();c&&c.publish.call(c,a.toString(),a,b)}
function ph(a,b,c){var d=oh();if(!d)return 0;var e=d.subscribe(a.toString(),function(d,h){if(!window.yt.pubsub2.skipSubKey_||window.yt.pubsub2.skipSubKey_!=e){var k=function(){if(lh[e])try{if(h&&a instanceof P&&a!=d)try{h=jh(a.f,h)}catch(k){throw k.message="yt.pubsub2 cross-binary conversion error for "+a.toString()+": "+k.message,k;}b.call(c||window,h)}catch(k){nc(k)}};
nh[a.toString()]?r("yt.scheduler.instance")?$d(k,void 0):H(k,0):k()}});
lh[e]=!0;mh[a.toString()]||(mh[a.toString()]=[]);mh[a.toString()].push(e);return e}
function qh(a){var b=oh();b&&(ga(a)&&(a=[a]),y(a,function(a){b.unsubscribeByKey(a);delete lh[a]}))}
function oh(){return r("yt.pubsub2.instance_")}
;function rh(a){O.call(this,1,arguments)}
x(rh,O);var sh=new P("timing-sent",rh);var R=window.performance||window.mozPerformance||window.msPerformance||window.webkitPerformance||{},th=v(R.clearResourceTimings||R.webkitClearResourceTimings||R.mozClearResourceTimings||R.msClearResourceTimings||R.oClearResourceTimings||t,R),uh=R.mark?function(a){R.mark(a)}:t;
function vh(a){wh()[a]=w();uh(a);var b=F("TIMING_ACTION",void 0);a=wh();if(r("yt.timing.ready_")&&b&&a._start&&xh()){var b=!0,c=F("TIMING_WAIT",[]);if(c.length)for(var d=0,e=c.length;d<e;++d)if(!(c[d]in a)){b=!1;break}if(b)if(c=wh(),a=yh().span,d=yh().info,b=r("yt.timing.reportbuilder_")){if(b=b(c,a,d,void 0))zh(b),Ah()}else{e=F("CSI_SERVICE_NAME","youtube");b={v:2,s:e,action:F("TIMING_ACTION",void 0)};if(R.now&&R.timing){var f=R.timing.navigationStart+R.now(),f=Math.round(w()-f);d.yt_hrd=f}var f=
F("TIMING_INFO",{}),h;for(h in f)d[h]=f[h];h=d.srt;delete d.srt;var k;h||0===h||(k=R.timing||{},h=Math.max(0,k.responseStart-k.navigationStart),isNaN(h)&&d.pt&&(h=d.pt));if(h||0===h)d.srt=h;d.h5jse&&(f=window.location.protocol+r("ytplayer.config.assets.js"),(f=R.getEntriesByName?R.getEntriesByName(f)[0]:null)?d.h5jse=Math.round(d.h5jse-f.responseEnd):delete d.h5jse);c.aft=xh();f=c._start;if("cold"==d.yt_lt){k||(k=R.timing||{});var l;a:if(l=k,l.msFirstPaint)l=Math.max(0,l.msFirstPaint);else{var n=
window.chrome;if(n&&(n=n.loadTimes,ha(n))){var n=n(),G=1E3*Math.min(n.requestTime||Infinity,n.startLoadTime||Infinity),G=Infinity===G?0:l.navigationStart-G;l=Math.max(0,Math.round(1E3*n.firstPaintTime+G)||0);break a}l=0}0<l&&l>f&&(c.fpt=l);l=a||yh().span;n=k.redirectEnd-k.redirectStart;0<n&&(l.rtime_=n);n=k.domainLookupEnd-k.domainLookupStart;0<n&&(l.dns_=n);n=k.connectEnd-k.connectStart;0<n&&(l.tcp_=n);n=k.connectEnd-k.secureConnectionStart;k.secureConnectionStart>=k.navigationStart&&0<n&&(l.stcp_=
n);n=k.responseStart-k.requestStart;0<n&&(l.req_=n);n=k.responseEnd-k.responseStart;0<n&&(l.rcv_=n);R.getEntriesByType&&Bh(c)}n=wh();k=n.pbr;l=n.vc;n=n.pbs;k&&l&&n&&k<l&&l<n&&1==yh().info.yt_vis&&"youtube"==e&&(yh().info.yt_lt="hot_bg",k=c.vc,e=c.pbs,delete c.aft,a.aft=Math.round(e-k));(k=F("PREVIOUS_ACTION"))&&(d.pa=k);d.p=F("CLIENT_PROTOCOL")||"unknown";d.t=F("CLIENT_TRANSPORT")||"unknown";window.navigator&&window.navigator.sendBeacon&&(d.ba=1);for(var ba in d)"_"!=ba.charAt(0)&&(b[ba]=d[ba]);c.ps=
w();ba={};var d=[],ra;for(ra in c)"_"!=ra.charAt(0)&&(l=Math.max(Math.round(c[ra]-f),0),ba[ra]=l,d.push(ra+"."+l));b.rt=d.join(",");ra=b;var c=[],qb;for(qb in a)"_"!=qb.charAt(0)&&c.push(qb+"."+a[qb]);ra.it=c.join(",");(qb=r("ytdebug.logTiming"))&&qb(b,ba,a);Ah();F("EXP_DEFER_CSI_PING")?(Ch(),q("yt.timing.deferredPingArgs_",b,void 0),qb=H(Ch,0),q("yt.timing.deferredPingTimer_",qb,void 0)):zh(b);Q(sh,new rh(ba.aft+(h||0)))}}}
function Ah(){Dh();th();q("yt.timing.pingSent_",!1,void 0)}
function xh(){var a=wh();if(a.aft)return a.aft;for(var b=F("TIMING_AFT_KEYS",["ol"]),c=b.length,d=0;d<c;d++){var e=a[b[d]];if(e)return e}return NaN}
function Eh(a){return Math.round(R.timing.navigationStart+a)}
function Bh(a){var b=window.location.protocol,c=R.getEntriesByType("resource"),d=c.filter(function(a){return 0==a.name.indexOf(b+"//fonts.googleapis.com/css?family=")})[0],c=c.filter(function(a){return 0==a.name.indexOf(b+"//fonts.gstatic.com/s/")}).reduce(function(a,b){return b.duration>a.duration?b:a},{duration:0});
d&&0<d.startTime&&0<d.responseEnd&&(a.wfcs=Eh(d.startTime),a.wfce=Eh(d.responseEnd));c&&0<c.startTime&&0<c.responseEnd&&(a.wffs=Eh(c.startTime),a.wffe=Eh(c.responseEnd))}
function zh(a){if(F("DEBUG_CSI_DATA")){var b=r("yt.timing.csiData");b||(b=[],q("yt.timing.csiData",b,void 0));b.push({page:location.href,time:new Date,args:a})}F("EXP_DEFER_CSI_PING")&&(I(r("yt.timing.deferredPingTimer_")),q("yt.timing.deferredPingArgs_",null,void 0));var c="https:"==window.location.protocol?"https://gg.google.com/csi":"http://csi.gstatic.com/csi",b="",d;for(d in a)b+="&"+d+"="+a[d];a=c+"?"+b.substring(1);b=F("CSI_LOG_WITH_YT")?"/csi_204?"+b.substring(1):null;window.navigator&&window.navigator.sendBeacon?
(gh(a),b&&gh(b)):(a&&hh(a),b&&b&&hh(b));q("yt.timing.pingSent_",!0,void 0)}
function Ch(a){if(F("EXP_DEFER_CSI_PING")){var b=r("yt.timing.deferredPingArgs_");b&&(a&&(b.yt_fss=a),zh(b))}}
function wh(){return yh().tick}
function yh(){return r("ytcsi.data_")||Dh()}
function Dh(){var a={tick:{},span:{},info:{}};q("ytcsi.data_",a,void 0);return a}
;var Fh={"api.invalidparam":2,auth:150,"drm.auth":150,heartbeat:150,"html5.unsupportedads":5,"fmt.noneavailable":5,"fmt.decode":5,"fmt.unplayable":5,"html5.missingapi":5,"drm.unavailable":5};function Gh(a,b){D.call(this);this.l=this.J=a;this.Z=b;this.F=!1;this.h={};this.Oa=this.S=null;this.qa=new E;dc(this,pa(ec,this.qa));this.o={};this.A=this.lb=this.j=this.Gb=this.f=null;this.sa=!1;this.K=this.B=this.O=this.P=null;this.nb={};this.kd=["onReady"];this.Ma=[];this.Hb=null;this.hc=0;this.ta={};Hh(this);this.va("onDetailedError",v(this.Vd,this));this.va("onTabOrderChange",v(this.nd,this));this.va("onTabAnnounce",v(this.ic,this));this.va("WATCH_LATER_VIDEO_ADDED",v(this.Wd,this));this.va("WATCH_LATER_VIDEO_REMOVED",
v(this.Xd,this));this.va("onMouseWheelCapture",v(this.Sd,this));this.va("onMouseWheelRelease",v(this.Td,this));this.va("onAdAnnounce",v(this.ic,this));this.Na=!1;this.dc=Yf||Uf;this.ya=this.ha=null;xf(this.J,"mousewheel",this.Ac,!1,this);xf(this.J,"wheel",this.Ac,!1,this)}
x(Gh,D);var Ih=["drm.unavailable","fmt.noneavailable","html5.missingapi","html5.unsupportedads","html5.unsupportedlive"];g=Gh.prototype;g.cc=function(a,b){this.isDisposed()||(Jh(this,a),b||Kh(this),Lh(this,b),this.F&&Mh(this))};
function Jh(a,b){a.Gb=b;a.f=b.clone();a.j=a.f.attrs.id||a.j;"video-player"==a.j&&(a.j=a.Z,a.f.attrs.id=a.Z);a.l.id==a.j&&(a.j+="-player",a.f.attrs.id=a.j);a.f.args.enablejsapi="1";a.f.args.playerapiid=a.Z;a.lb||(a.lb=Nh(a,a.f.args.jsapicallback||"onYouTubePlayerReady"));a.f.args.jsapicallback=null;var c=a.f.attrs.width;c&&(a.l.style.width=Nf(Number(c)||c,!0));if(c=a.f.attrs.height)a.l.style.height=Nf(Number(c)||c,!0)}
g.xd=function(){return this.Gb};
function Mh(a){a.f.loaded||(a.f.loaded=!0,"0"!=a.f.args.autoplay?a.h.loadVideoByPlayerVars(a.f.args):a.h.cueVideoByPlayerVars(a.f.args))}
function Oh(a){if(!p(a.f.disable.flash)){var b=a.f.disable,c;c=jg(ig.getInstance(),a.f.minVersion);b.flash=!c}return!a.f.disable.flash}
function Kh(a){var b;if(!(b=!a.f.html5&&Oh(a))){if(!p(a.f.disable.html5)){var c;b=!0;void 0!=a.f.args.deviceHasDisplay&&(b=a.f.args.deviceHasDisplay);if(2.2==wg)c=!0;else{a:{var d=b;b=r("yt.player.utils.videoElement_");b||(b=document.createElement("video"),q("yt.player.utils.videoElement_",b,void 0));try{if(b.canPlayType)for(var d=d?Cg:Dg,e=0;e<d.length;e++)if(b.canPlayType(d[e])){c=null;break a}c="fmt.noneavailable"}catch(f){c="html5.missingapi"}}c=!c}c&&(c=Ph(a)||a.f.assets.js);a.f.disable.html5=
!c;c||(a.f.args.html5_unavailable="1")}b=!!a.f.disable.html5}return b?Oh(a)?"flash":"unsupported":"html5"}
function Qh(a,b){if(!b||(5!=(Fh[b.errorCode]||5)?0:-1!=Ih.indexOf(b.errorCode))){var c=Rh(a);c&&c.stopVideo&&c.stopVideo();if(Oh(a)){var d=a.f;c&&c.getUpdatedConfigurationData&&(c=c.getUpdatedConfigurationData(),d=ef(c));d.args.autoplay=1;d.args.html5_unavailable="1";Jh(a,d);Lh(a,"flash")}}}
function Lh(a,b){a.isDisposed()||(b||(b=Kh(a)),("flash"==b?a.Fe:"html5"==b?a.Ge:a.He).call(a))}
function Ph(a){var b=!0,c=Rh(a);c&&a.f&&(a=a.f,b=C(c,"version")==a.assets.js);return b&&!!r("yt.player.Application.create")}
g.Ge=function(){if(!this.sa){var a=Ph(this);a&&"html5"==Sh(this)?(this.A="html5",this.F||this.Ua()):(Th(this),this.A="html5",a&&this.O?(this.J.appendChild(this.O),this.Ua()):(this.f.loaded=!0,this.P=v(function(){var a=this.J,c=this.f.clone();r("yt.player.Application.create")(a,c);this.Ua()},this),this.sa=!0,a?this.P():(Bc(this.f.assets.js,this.P),rg(this.f.assets.css))))}};
g.Fe=function(){var a=this.f.clone();if(!this.B){var b=Rh(this);b&&(this.B=document.createElement("span"),this.B.tabIndex=0,this.Ma.push(M(this.B,"focus",v(this.xc,this))),this.K=document.createElement("span"),this.K.tabIndex=0,this.Ma.push(M(this.K,"focus",v(this.xc,this))),b.parentNode&&b.parentNode.insertBefore(this.B,b),b.parentNode&&b.parentNode.insertBefore(this.K,b.nextSibling))}a.attrs.width=a.attrs.width||"100%";a.attrs.height=a.attrs.height||"100%";if("flash"==Sh(this))this.A="flash",this.F||
ng(a,!1,v(this.Ua,this));else{Th(this);this.A="flash";this.f.loaded=!0;b=this.J;b=u(b)?re(b):b;a=ef(a);if(window!=window.top){var c=null;document.referrer&&(c=document.referrer.substring(0,128));a.args.framer=c}c=ig.getInstance();jg(c,a.minVersion)?(c=og(a,c),mg(b,c,a)):qg(b,a,c);this.Ua()}};
g.xc=function(){Rh(this).focus()};
function Rh(a){var b=qe(a.j);!b&&a.l&&a.l.querySelector&&(b=a.l.querySelector("#"+a.j));return b}
g.Ua=function(){if(!this.isDisposed()){var a=Rh(this),b=!1;try{a&&a.getApiInterface&&a.getApiInterface()&&(b=!0)}catch(f){}if(b)if(this.sa=!1,a.isNotServable&&a.isNotServable(this.f.args.video_id))Qh(this);else{Hh(this);this.F=!0;a=Rh(this);a.addEventListener&&(this.S=Uh(this,a,"addEventListener"));a.removeEventListener&&(this.Oa=Uh(this,a,"removeEventListener"));for(var b=a.getApiInterface(),b=b.concat(a.getInternalApiInterface()),c=0;c<b.length;c++){var d=b[c];this.h[d]||(this.h[d]=Uh(this,a,d))}for(var e in this.o)this.S(e,
this.o[e]);Mh(this);this.lb&&this.lb(this.h);this.qa.D("onReady",this.h)}else this.hc=H(v(this.Ua,this),50)}};
function Uh(a,b,c){var d=b[c];return function(){try{return a.Hb=null,d.apply(b,arguments)}catch(e){"Bad NPObject as private data!"!=e.message&&"sendAbandonmentPing"!=c&&(e.message+=" ("+c+")",a.Hb=e,nc(e,"WARNING"))}}}
function Hh(a){a.F=!1;if(a.Oa)for(var b in a.o)a.Oa(b,a.o[b]);for(var c in a.ta)I(parseInt(c,10));a.ta={};a.S=null;a.Oa=null;for(var d in a.h)a.h[d]=null;a.h.addEventListener=v(a.va,a);a.h.removeEventListener=v(a.qe,a);a.h.destroy=v(a.dispose,a);a.h.getLastError=v(a.yd,a);a.h.getPlayerType=v(a.zd,a);a.h.getCurrentVideoConfig=v(a.xd,a);a.h.loadNewVideoConfig=v(a.cc,a);a.h.isReady=v(a.Se,a)}
g.Se=function(){return this.F};
g.va=function(a,b){if(!this.isDisposed()){var c=Nh(this,b);if(c){if(!A(this.kd,a)&&!this.o[a]){var d=Vh(this,a);this.S&&this.S(a,d)}this.qa.subscribe(a,c);"onReady"==a&&this.F&&H(pa(c,this.h),0)}}};
g.qe=function(a,b){if(!this.isDisposed()){var c=Nh(this,b);c&&this.qa.unsubscribe(a,c)}};
function Nh(a,b){var c=b;if("string"==typeof b){if(a.nb[b])return a.nb[b];c=function(){var a=r(b);a&&a.apply(m,arguments)};
a.nb[b]=c}return c?c:null}
function Vh(a,b){var c="ytPlayer"+b+a.Z;a.o[b]=c;m[c]=function(c){var e=H(function(){if(!a.isDisposed()){a.qa.D(b,c);var f=a.ta,h=String(e);h in f&&delete f[h]}},0);
rb(a.ta,String(e))};
return c}
g.nd=function(a){a=a?ye:xe;for(var b=a(document.activeElement);b&&(1!=b.nodeType||b==this.B||b==this.K||(b.focus(),b!=document.activeElement));)b=a(b)};
g.ic=function(a){J("a11y-announce",a)};
g.Vd=function(a){Qh(this,a)};
g.Wd=function(a){J("WATCH_LATER_VIDEO_ADDED",a)};
g.Xd=function(a){J("WATCH_LATER_VIDEO_REMOVED",a)};
g.Sd=function(){this.dc&&(this.Na||(this.ya=ue(document)),this.ha||(this.ha=xf(window,"scroll",this.le,!1,this)));this.Na=!0};
g.Td=function(){this.ha&&(Ef(this.ha),this.ha=null);this.Na=!1};
g.Ac=function(a){this.Na&&!this.dc&&a.preventDefault()};
g.le=function(){this.ya&&window.scrollTo(this.ya.x,this.ya.y)};
g.He=function(){Th(this);this.A="unsupported";var a='Adobe Flash Player or an HTML5 supported browser is required for video playback. <br> <a href="http://get.adobe.com/flashplayer/">Get the latest Flash Player</a> <br> <a href="/html5">Learn more about upgrading to an HTML5 browser</a>',b=navigator.userAgent.match(/Version\/(\d).*Safari/);b&&5<=parseInt(b[1],10)&&(a='Adobe Flash Player or QuickTime is required for video playback. <br> <a href="http://get.adobe.com/flashplayer/"> Get the latest Flash Player</a> <br> <a href="http://www.apple.com/quicktime/download/">Get the latest version of QuickTime</a>');
b=this.f.messages.player_fallback||a;a=qe("player-unavailable");if(qe("unavailable-submessage")&&a){qe("unavailable-submessage").innerHTML=b;var b=a||document,c=null;b.getElementsByClassName?c=b.getElementsByClassName("icon")[0]:b.querySelectorAll&&b.querySelector?c=b.querySelector(".icon"):c=te("icon",a)[0];if(c=b=c||null)c=b?b.dataset?Ob("icon")in b.dataset:b.hasAttribute?!!b.hasAttribute("data-icon"):!!b.getAttribute("data-icon"):!1;c&&(b.src=C(b,"icon"));a.style.display="";he(qe("player"),"off-screen-trigger")}};
g.zd=function(){return this.A||Sh(this)};
g.yd=function(){return this.Hb};
function Sh(a){return(a=Rh(a))?"div"==a.tagName.toLowerCase()?"html5":"flash":null}
function Th(a){vh("dcp");a.cancel();Hh(a);a.A=null;a.f&&(a.f.loaded=!1);var b=Rh(a);"html5"==Sh(a)?a.O=b:b&&b.destroy&&b.destroy();we(a.J);Pe(a.Ma);a.Ma.length=0;a.B=null;a.K=null}
g.cancel=function(){this.P&&Ic(this.f.assets.js,this.P);I(this.hc);this.sa=!1};
g.G=function(){Th(this);if(this.O&&this.f&&this.f.args.fflags&&-1!=this.f.args.fflags.indexOf("new_html5_dispose=true"))try{this.O.destroy()}catch(b){nc(b)}this.nb=null;for(var a in this.o)m[this.o[a]]=null;this.h=null;delete this.J;delete this.l;this.f&&(this.Gb=this.f=this.f.fallback=null);Gh.I.G.call(this)};var Wh={},Xh="player_uid_"+(1E9*Math.random()>>>0);function Yh(a,b){a=u(a)?re(a):a;b=ef(b);var c=Xh+"_"+ka(a),d=Wh[c];if(d)return d.cc(b),d.h;d=new Gh(a,c);Wh[c]=d;J("player-added",d.h);dc(d,pa(Zh,d));H(function(){d.cc(b)},0);
return d.h}
function Zh(a){Wh[a.Z]=null}
function $h(a){a=qe(a);if(!a)return null;var b=Xh+"_"+ka(a),c=Wh[b];c||(c=new Gh(a,b),Wh[b]=c);return c.h}
;var ai=r("yt.abuse.botguardInitialized")||Lc;q("yt.abuse.botguardInitialized",ai,void 0);var bi=r("yt.abuse.invokeBotguard")||Mc;q("yt.abuse.invokeBotguard",bi,void 0);var ci=r("yt.abuse.dclkstatus.checkDclkStatus")||ee;q("yt.abuse.dclkstatus.checkDclkStatus",ci,void 0);var di=r("yt.player.exports.navigate")||$e;q("yt.player.exports.navigate",di,void 0);var ei=r("yt.player.embed")||Yh;q("yt.player.embed",ei,void 0);var fi=r("yt.player.getPlayerByElement")||$h;q("yt.player.getPlayerByElement",fi,void 0);
var gi=r("yt.util.activity.init")||Qe;q("yt.util.activity.init",gi,void 0);var hi=r("yt.util.activity.getTimeSinceActive")||Se;q("yt.util.activity.getTimeSinceActive",hi,void 0);var ii=r("yt.util.activity.setTimestamp")||Re;q("yt.util.activity.setTimestamp",ii,void 0);function ji(a){O.call(this,1,arguments);this.f=a}
x(ji,O);function ki(a){O.call(this,1,arguments);this.f=a}
x(ki,O);function li(a,b){O.call(this,1,arguments);this.f=a;this.isEnabled=b}
x(li,O);function mi(a,b,c,d,e){O.call(this,2,arguments);this.h=a;this.f=b;this.o=c||null;this.j=d||null;this.source=e||null}
x(mi,O);function ni(a,b,c){O.call(this,1,arguments);this.f=a;this.subscriptionId=b}
x(ni,O);function oi(a,b,c,d,e,f,h){O.call(this,1,arguments);this.h=a;this.subscriptionId=b;this.f=c;this.l=d||null;this.o=e||null;this.j=f||null;this.source=h||null}
x(oi,O);
var pi=new P("subscription-batch-subscribe",ji),qi=new P("subscription-batch-unsubscribe",ji),ri=new P("subscription-pref-email",li),si=new P("subscription-subscribe",mi),ti=new P("subscription-subscribe-loading",ki),ui=new P("subscription-subscribe-loaded",ki),vi=new P("subscription-subscribe-success",ni),wi=new P("subscription-subscribe-external",mi),xi=new P("subscription-unsubscribe",oi),yi=new P("subscription-unsubscirbe-loading",ki),zi=new P("subscription-unsubscribe-loaded",ki),Ai=new P("subscription-unsubscribe-success",
ki),Bi=new P("subscription-external-unsubscribe",oi),Ci=new P("subscription-enable-ypc",ki),Di=new P("subscription-disable-ypc",ki);function Ei(a,b){var c=document.location.protocol+"//"+document.domain+"/post_login";b&&(c=Jd(c,"mode",b));c=Jd("/signin?context=popup","next",c);c=Jd(c,"feature","sub_button");if(c=window.open(c,"loginPopup","width=375,height=440,resizable=yes,scrollbars=yes",!0)){var d=vc("LOGGED_IN",function(b){xc(F("LOGGED_IN_PUBSUB_KEY",void 0));jc("LOGGED_IN",!0);a(b)});
jc("LOGGED_IN_PUBSUB_KEY",d);c.moveTo((screen.width-375)/2,(screen.height-440)/2)}}
q("yt.pubsub.publish",J,void 0);function Fi(){var a=F("PLAYER_CONFIG");return a&&a.args&&void 0!==a.args.authuser?!0:!(!F("SESSION_INDEX")&&!F("LOGGED_IN"))}
;var Gi={},Hi="ontouchstart"in document;function Ii(a,b,c){var d;switch(a){case "mouseover":case "mouseout":d=3;break;case "mouseenter":case "mouseleave":d=9}return Ge(c,function(a){return ge(a,b)},!0,d)}
function Ji(a){var b="mouseover"==a.type&&"mouseenter"in Gi||"mouseout"==a.type&&"mouseleave"in Gi,c=a.type in Gi||b;if("HTML"!=a.target.tagName&&c){if(b){var b="mouseover"==a.type?"mouseenter":"mouseleave",c=Gi[b],d;for(d in c.ga){var e=Ii(b,d,a.target);e&&!Ge(a.relatedTarget,function(a){return a==e},!0)&&c.D(d,e,b,a)}}if(b=Gi[a.type])for(d in b.ga)(e=Ii(a.type,d,a.target))&&b.D(d,e,a.type,a)}}
M(document,"blur",Ji,!0);M(document,"change",Ji,!0);M(document,"click",Ji);M(document,"focus",Ji,!0);M(document,"mouseover",Ji);M(document,"mouseout",Ji);M(document,"mousedown",Ji);M(document,"keydown",Ji);M(document,"keyup",Ji);M(document,"keypress",Ji);M(document,"cut",Ji);M(document,"paste",Ji);Hi&&(M(document,"touchstart",Ji),M(document,"touchend",Ji),M(document,"touchcancel",Ji));function Ki(a){this.j=a;this.o={};this.Kc=[];this.l=[]}
function S(a,b){return"yt-uix"+(a.j?"-"+a.j:"")+(b?"-"+b:"")}
Ki.prototype.init=t;Ki.prototype.dispose=t;function Li(a,b,c){a.l.push(ph(b,c,a))}
function Mi(a,b,c){var d=S(a,void 0),e=v(c,a);b in Gi||(Gi[b]=new E);Gi[b].subscribe(d,e);a.o[c]=e}
function Ni(a,b){Nb(a,"tooltip-text",b)}
;function Oi(){Ki.call(this,"tooltip");this.f=0;this.h={}}
x(Oi,Ki);ca(Oi);g=Oi.prototype;g.register=function(){Mi(this,"mouseover",this.Vb);Mi(this,"mouseout",this.fb);Mi(this,"focus",this.wd);Mi(this,"blur",this.md);Mi(this,"click",this.fb);Mi(this,"touchstart",this.De);Mi(this,"touchend",this.Sc);Mi(this,"touchcancel",this.Sc)};
g.dispose=function(){for(var a in this.h)this.fb(this.h[a]);this.h={}};
g.Vb=function(a){if(!(this.f&&1E3>w()-this.f)){var b=parseInt(C(a,"tooltip-hide-timer"),10);b&&(Pb(a,"tooltip-hide-timer"),I(b));var b=v(function(){Pi(this,a);Pb(a,"tooltip-show-timer")},this),c=parseInt(C(a,"tooltip-show-delay"),10)||0,b=H(b,c);
Nb(a,"tooltip-show-timer",b.toString());a.title&&(Ni(a,Qi(a)),a.title="");b=ka(a).toString();this.h[b]=a}};
g.fb=function(a){var b=parseInt(C(a,"tooltip-show-timer"),10);b&&(I(b),Pb(a,"tooltip-show-timer"));b=v(function(){if(a){var b=qe(Ri(this,a));b&&(Si(b),b&&b.parentNode&&b.parentNode.removeChild(b),Pb(a,"content-id"));(b=qe(Ri(this,a,"arialabel")))&&b.parentNode&&b.parentNode.removeChild(b)}Pb(a,"tooltip-hide-timer")},this);
b=H(b,50);Nb(a,"tooltip-hide-timer",b.toString());if(b=C(a,"tooltip-text"))a.title=b;b=ka(a).toString();delete this.h[b]};
g.wd=function(a){this.f=0;this.Vb(a)};
g.md=function(a){this.f=0;this.fb(a)};
g.De=function(a,b,c){c.changedTouches&&(this.f=0,a=Ii(b,S(this),c.changedTouches[0].target),this.Vb(a))};
g.Sc=function(a,b,c){c.changedTouches&&(this.f=w(),a=Ii(b,S(this),c.changedTouches[0].target),this.fb(a))};
function Ti(a,b){Ni(a,b);var c=C(a,"content-id");(c=qe(c))&&ze(c,b)}
function Qi(a){return C(a,"tooltip-text")||a.title}
function Pi(a,b){if(b){var c=Qi(b);if(c){var d=qe(Ri(a,b));if(!d){d=document.createElement("div");d.id=Ri(a,b);d.className=S(a,"tip");var e=document.createElement("div");e.className=S(a,"tip-body");var f=document.createElement("div");f.className=S(a,"tip-arrow");var h=document.createElement("div");h.setAttribute("aria-hidden","true");h.className=S(a,"tip-content");var k=Ui(a,b),l=Ri(a,b,"content");h.id=l;Nb(b,"content-id",l);e.appendChild(h);k&&d.appendChild(k);d.appendChild(e);d.appendChild(f);var l=
Ce(b),n=Ri(a,b,"arialabel"),f=document.createElement("div");he(f,S(a,"arialabel"));f.id=n;"rtl"==document.body.getAttribute("dir")?ze(f,c+" "+l):ze(f,l+" "+c);b.setAttribute("aria-labelledby",n);l=Ke()||document.body;l.appendChild(f);l.appendChild(d);Ti(b,c);(c=parseInt(C(b,"tooltip-max-width"),10))&&e.offsetWidth>c&&(e.style.width=c+"px",he(h,S(a,"normal-wrap")));h=ge(b,S(a,"reverse"));Vi(a,b,d,e,k,h)||Vi(a,b,d,e,k,!h);var G=S(a,"tip-visible");H(function(){he(d,G)},0)}}}}
function Vi(a,b,c,d,e,f){je(c,S(a,"tip-reverse"),f);var h=0;f&&(h=1);a=Of(b);f=new ke((a.width-10)/2,f?a.height:0);var k=pe(b),l=new ke(0,0),n;n=k?pe(k):document;var G;(G=!K||9<=sd)||(G=ne(n),G=ve(G.f));b!=(G?n.documentElement:n.body)&&(n=Mf(b),k=ne(k),k=ue(k.f),l.x=n.left+k.x,l.y=n.top+k.y);f=new ke(l.x+f.x,l.y+f.y);f=f.clone();l=(h&4&&"rtl"==Lf(c,"direction")?h^2:h)&-5;h=Of(c);k=h.clone();n=f.clone();k=k.clone();0!=l&&(l&2&&(n.x-=k.width+0),l&1&&(n.y-=k.height+0));f=new Jf(0,0,0,0);f.left=n.x;f.top=
n.y;f.width=k.width;f.height=k.height;k=new ke(f.left,f.top);k instanceof ke?(l=k.x,k=k.y):(l=k,k=void 0);c.style.left=Nf(l,!1);c.style.top=Nf(k,!1);k=new le(f.width,f.height);if(!(h==k||h&&k&&h.width==k.width&&h.height==k.height))if(h=k,f=pe(c),f=ne(f),l=ve(f.f),!K||qd("10")||l&&qd("8"))f=c.style,id?f.MozBoxSizing="border-box":jd?f.WebkitBoxSizing="border-box":f.boxSizing="border-box",f.width=Math.max(h.width,0)+"px",f.height=Math.max(h.height,0)+"px";else if(f=c.style,l){K?(l=Rf(c,"paddingLeft"),
k=Rf(c,"paddingRight"),n=Rf(c,"paddingTop"),G=Rf(c,"paddingBottom"),l=new If(n,k,G,l)):(l=Kf(c,"paddingLeft"),k=Kf(c,"paddingRight"),n=Kf(c,"paddingTop"),G=Kf(c,"paddingBottom"),l=new If(parseFloat(n),parseFloat(k),parseFloat(G),parseFloat(l)));if(!K||9<=sd)k=Kf(c,"borderLeftWidth"),n=Kf(c,"borderRightWidth"),G=Kf(c,"borderTopWidth"),ba=Kf(c,"borderBottomWidth"),k=new If(parseFloat(G),parseFloat(n),parseFloat(ba),parseFloat(k));else{k=Tf(c,"borderLeft");n=Tf(c,"borderRight");G=Tf(c,"borderTop");var ba=
Tf(c,"borderBottom"),k=new If(G,n,ba,k)}f.pixelWidth=h.width-k.left-l.left-l.right-k.right;f.pixelHeight=h.height-k.top-l.top-l.bottom-k.bottom}else f.pixelWidth=h.width,f.pixelHeight=h.height;h=window.document;h=ve(h)?h.documentElement:h.body;f=new le(h.clientWidth,h.clientHeight);1==c.nodeType?(c=Mf(c),k=new ke(c.left,c.top)):(c=c.changedTouches?c.changedTouches[0]:c,k=new ke(c.clientX,c.clientY));c=Of(d);n=Math.floor(c.width/2);h=!!(f.height<k.y+a.height);a=!!(k.y<a.height);l=!!(k.x<n);f=!!(f.width<
k.x+n);k=(c.width+3)/-2- -5;b=C(b,"force-tooltip-direction");if("left"==b||l)k=-5;else if("right"==b||f)k=20-c.width-3;b=Math.floor(k)+"px";d.style.left=b;e&&(e.style.left=b,e.style.height=c.height+"px",e.style.width=c.width+"px");return!(h||a)}
function Ri(a,b,c){a=S(a);var d=b.__yt_uid_key;d||(d=Ie(),b.__yt_uid_key=d);b=a+d;c&&(b+="-"+c);return b}
function Ui(a,b){var c=null;ld&&ge(b,S(a,"masked"))&&((c=qe("yt-uix-tooltip-shared-mask"))?(c.parentNode.removeChild(c),gg(c)):(c=document.createElement("iframe"),c.src='javascript:""',c.id="yt-uix-tooltip-shared-mask",c.className=S(a,"tip-mask")));return c}
function Si(a){var b=qe("yt-uix-tooltip-shared-mask"),c=b&&Ge(b,function(b){return b==a},!1,2);
b&&c&&(b.parentNode.removeChild(b),hg(b),document.body.appendChild(b))}
;function Wi(){Ki.call(this,"subscription-button")}
x(Wi,Ki);ca(Wi);Wi.prototype.register=function(){Mi(this,"click",this.oc);Li(this,ti,this.zc);Li(this,ui,this.yc);Li(this,vi,this.ee);Li(this,yi,this.zc);Li(this,zi,this.yc);Li(this,Ai,this.je);Li(this,Ci,this.Rd);Li(this,Di,this.Qd)};
var Fe={ec:"hover-enabled",$c:"yt-uix-button-subscribe",ad:"yt-uix-button-subscribed",Ue:"ypc-enabled",bd:"yt-uix-button-subscription-container",cd:"yt-subscription-button-disabled-mask-container"},Xi={Ve:"channel-external-id",ed:"subscriber-count-show-when-subscribed",fd:"subscriber-count-tooltip",gd:"subscriber-count-title",We:"href",fc:"is-subscribed",Ye:"parent-url",$e:"clicktracking",hd:"style-type",gc:"subscription-id",cf:"target",jd:"ypc-enabled"};g=Wi.prototype;
g.oc=function(a){var b=C(a,"href"),c=Fi();if(b)a=C(a,"target")||"_self",window.open(b,a);else if(c){var b=C(a,"channel-external-id"),c=C(a,"clicktracking"),d;if(C(a,"ypc-enabled")){d=C(a,"ypc-item-type");var e=C(a,"ypc-item-id");d={itemType:d,itemId:e,subscriptionElement:a}}else d=null;e=C(a,"parent-url");if(C(a,"is-subscribed")){var f=C(a,"subscription-id");Q(xi,new oi(b,f,d,a,c,e))}else Q(si,new mi(b,d,c,e))}else Yi(this,a)};
g.zc=function(a){this.Pa(a.f,this.Pc,!0)};
g.yc=function(a){this.Pa(a.f,this.Pc,!1)};
g.ee=function(a){this.Pa(a.f,this.Qc,!0,a.subscriptionId)};
g.je=function(a){this.Pa(a.f,this.Qc,!1)};
g.Rd=function(a){this.Pa(a.f,this.qd)};
g.Qd=function(a){this.Pa(a.f,this.pd)};
g.Qc=function(a,b,c){b?(Nb(a,Xi.fc,"true"),c&&Nb(a,Xi.gc,c)):(Pb(a,Xi.fc),Pb(a,Xi.gc));Zi(a)};
g.Pc=function(a,b){var c;c=Ee(a);je(c,Fe.cd,b);a.setAttribute("aria-busy",b?"true":"false");a.disabled=b};
function Zi(a){var b=C(a,Xi.hd),c=!!C(a,"is-subscribed"),b="-"+b,d=Fe.ad+b;je(a,Fe.$c+b,!c);je(a,d,c);C(a,Xi.fd)&&!C(a,Xi.ed)&&(b=S(Oi.getInstance()),je(a,b,!c),a.title=c?"":C(a,Xi.gd));c?H(function(){he(a,Fe.ec)},1E3):ie(a,Fe.ec)}
g.qd=function(a){var b=!!C(a,"ypc-item-type"),c=!!C(a,"ypc-item-id");!C(a,"ypc-enabled")&&b&&c&&(he(a,"ypc-enabled"),Nb(a,Xi.jd,"true"))};
g.pd=function(a){C(a,"ypc-enabled")&&(ie(a,"ypc-enabled"),Pb(a,"ypc-enabled"))};
function $i(a,b){var c=se(S(a));return Ma(c,function(a){return b==C(a,"channel-external-id")},a)}
g.ld=function(a,b,c){var d=$a(arguments,2);y(a,function(a){b.apply(this,Wa(a,d))},this)};
g.Pa=function(a,b,c){var d=$i(this,a),d=Wa([d],$a(arguments,1));this.ld.apply(this,d)};
function Yi(a,b){var c=v(function(a){a.discoverable_subscriptions&&jc("SUBSCRIBE_EMBED_DISCOVERABLE_SUBSCRIPTIONS",a.discoverable_subscriptions);this.oc(b)},a);
Ei(c,"subscribe")}
;var aj=window.yt&&window.yt.uix&&window.yt.uix.widgets_||{};q("yt.uix.widgets_",aj,void 0);function bj(a,b){this.source=null;this.o=a||null;this.origin="*";this.B=window.document.location.protocol+"//"+window.document.location.hostname;this.l=b;this.j=this.f=this.h=this.sourceId=null;M(window,"message",v(this.A,this))}
bj.prototype.A=function(a){var b=this.l||F("POST_MESSAGE_ORIGIN",void 0)||this.B;if("*"!=b&&a.origin!=b)window.console&&window.console.warn("Untrusted origin: "+a.origin);else if(!this.o||a.source==this.o)if(this.source=a.source,this.origin="null"==a.origin?this.origin:a.origin,a=a.data,u(a)){try{a=td(a)}catch(c){return}this.sourceId=a.id;switch(a.event){case "listening":this.f&&(this.f(),this.f=null);break;case "command":this.h&&(this.j&&!A(this.j,a.func)||this.h(a.func,a.args))}}};
bj.prototype.sendMessage=function(a){this.source&&(a.id=this.sourceId,a=L(a),this.source.postMessage(a,this.origin))};function cj(){}
;function dj(){}
x(dj,cj);dj.prototype.Y=function(){var a=0;Rc(this.ua(!0),function(){a++});
return a};
dj.prototype.clear=function(){var a=Sc(this.ua(!0)),b=this;y(a,function(a){b.remove(a)})};function ej(a){this.f=a}
x(ej,dj);g=ej.prototype;g.isAvailable=function(){if(!this.f)return!1;try{return this.f.setItem("__sak","1"),this.f.removeItem("__sak"),!0}catch(a){return!1}};
g.Bd=function(a,b){try{this.f.setItem(a,b)}catch(c){if(0==this.f.length)throw"Storage mechanism: Storage disabled";throw"Storage mechanism: Quota exceeded";}};
g.get=function(a){a=this.f.getItem(a);if(!u(a)&&null!==a)throw"Storage mechanism: Invalid value was encountered";return a};
g.remove=function(a){this.f.removeItem(a)};
g.Y=function(){return this.f.length};
g.ua=function(a){var b=0,c=this.f,d=new Pc;d.next=function(){if(b>=c.length)throw Oc;var d;d=c.key(b++);if(a)return d;d=c.getItem(d);if(!u(d))throw"Storage mechanism: Invalid value was encountered";return d};
return d};
g.clear=function(){this.f.clear()};
g.key=function(a){return this.f.key(a)};function fj(){var a=null;try{a=window.localStorage||null}catch(b){}this.f=a}
x(fj,ej);function gj(){var a=null;try{a=window.sessionStorage||null}catch(b){}this.f=a}
x(gj,ej);function hj(a){this.f=a}
hj.prototype.h=function(a,b){p(b)?this.f.Bd(a,L(b)):this.f.remove(a)};
hj.prototype.get=function(a){var b;try{b=this.f.get(a)}catch(c){return}if(null!==b)try{return td(b)}catch(c){throw"Storage: Invalid value was encountered";}};
hj.prototype.remove=function(a){this.f.remove(a)};function ij(a){this.f=a}
x(ij,hj);function jj(a){this.data=a}
function kj(a){return!p(a)||a instanceof jj?a:new jj(a)}
ij.prototype.h=function(a,b){ij.I.h.call(this,a,kj(b))};
ij.prototype.j=function(a){a=ij.I.get.call(this,a);if(!p(a)||a instanceof Object)return a;throw"Storage: Invalid value was encountered";};
ij.prototype.get=function(a){if(a=this.j(a)){if(a=a.data,!p(a))throw"Storage: Invalid value was encountered";}else a=void 0;return a};function lj(a){this.f=a}
x(lj,ij);function mj(a){var b=a.creation;a=a.expiration;return!!a&&a<w()||!!b&&b>w()}
lj.prototype.h=function(a,b,c){if(b=kj(b)){if(c){if(c<w()){lj.prototype.remove.call(this,a);return}b.expiration=c}b.creation=w()}lj.I.h.call(this,a,b)};
lj.prototype.j=function(a,b){var c=lj.I.j.call(this,a);if(c)if(!b&&mj(c))lj.prototype.remove.call(this,a);else return c};function nj(a){this.f=a}
x(nj,lj);function oj(a,b){var c=[];Rc(b,function(a){var b;try{b=nj.prototype.j.call(this,a,!0)}catch(f){if("Storage: Invalid value was encountered"==f)return;throw f;}p(b)?mj(b)&&c.push(a):c.push(a)},a);
return c}
function pj(a,b){var c=oj(a,b);y(c,function(a){nj.prototype.remove.call(this,a)},a)}
function qj(){var a=rj;pj(a,a.f.ua(!0))}
;function T(a,b,c){var d=c&&0<c?c:0;c=d?w()+1E3*d:0;if((d=d?rj:sj)&&window.JSON){u(b)||(b=JSON.stringify(b,void 0));try{d.h(a,b,c)}catch(e){d.remove(a)}}}
function U(a){if(!sj&&!rj||!window.JSON)return null;var b;try{b=sj.get(a)}catch(c){}if(!u(b))try{b=rj.get(a)}catch(c){}if(!u(b))return null;try{b=JSON.parse(b,void 0)}catch(c){}return b}
function tj(a){sj&&sj.remove(a);rj&&rj.remove(a)}
var rj,uj=new fj;rj=uj.isAvailable()?new nj(uj):null;var sj,vj=new gj;sj=vj.isAvailable()?new nj(vj):null;function wj(a){return(0==a.search("cue")||0==a.search("load"))&&"loadModule"!=a}
function xj(a,b,c){u(a)&&(a={mediaContentUrl:a,startSeconds:b,suggestedQuality:c});b=a;c=/\/([ve]|embed)\/([^#?]+)/.exec(a.mediaContentUrl);b.videoId=c&&c[2]?c[2]:null;return yj(a)}
function yj(a,b,c){if(ia(a)){b="endSeconds startSeconds mediaContentUrl suggestedQuality videoId two_stage_token".split(" ");c={};for(var d=0;d<b.length;d++){var e=b[d];a[e]&&(c[e]=a[e])}return c}return{videoId:a,startSeconds:b,suggestedQuality:c}}
function zj(a,b,c,d){if(ia(a)&&!ea(a)){b="playlist list listType index startSeconds suggestedQuality".split(" ");c={};for(d=0;d<b.length;d++){var e=b[d];a[e]&&(c[e]=a[e])}return c}c={index:b,startSeconds:c,suggestedQuality:d};u(a)&&16==a.length?c.list="PL"+a:c.playlist=a;return c}
function Aj(a){var b=a.video_id||a.videoId;if(u(b)){var c=U("yt-player-two-stage-token")||{},d=U("yt-player-two-stage-token")||{};p(void 0)?d[b]=void 0:delete d[b];T("yt-player-two-stage-token",d,300);(b=c[b])&&(a.two_stage_token=b)}}
;var Bj=document.currentScript&&-1!=document.currentScript.src.indexOf("?loadGamesSDK")?"/cast_game_sender.js":"/cast_sender.js",Cj=0<window.location.hash.indexOf("__CastInternalExtensionIds__"),Dj=["boadgeojelhgndaghljhdicfkmllpafd","dliochdbjfkdbacpmhlcpmleaejidimm"],Ej=["hfaagokkkhdbgiakmmlclaapfelnkoah","fmfcbgogabcbclcofgocippekhfcmgfj","enhhojjnijigcajfphajepfemndkmdlo","eojlgccfgnjlphjnlopmadngcgmmdgpk"],Fj=["fjhoaacokmgbjemoflkofnenfaiekifl"],Gj=["ekpaaapppgpmolpcldedioblbkmijaca","lhkfccafpkdlaodkicmokbmfapjadkij",
"ibiljbkambkbohapfhoonkcpcikdglop","enhhojjnijigcajfphajepfemndkmdlo"],Hj=Cj?Dj.concat(Ej):Dj,Ij=Cj?Gj.concat(Fj):Fj,Jj=window.navigator.presentation?Hj.concat(Ij):Hj;function Kj(a){window.chrome?Lj(0,a):a(null)}
function Lj(a,b){a==Jj.length?b(null):Mj(Jj[a],function(c){c?b(Jj[a]):Lj(a+1,b)})}
function Mj(a,b){var c=new XMLHttpRequest;c.onreadystatechange=function(){4==c.readyState&&200==c.status&&b(!0)};
c.onerror=function(){b(!1)};
try{c.open("GET","chrome-extension://"+a+Bj,!0),c.send()}catch(d){b(!1)}}
function Nj(a){var b=document.createElement("script");b.src=a;(document.head||document.documentElement).appendChild(b)}
function Oj(){var a=window.navigator.userAgent;return 0<=a.indexOf("Android")&&0<=a.indexOf("Chrome/")}
function Pj(){if(window.navigator.presentation&&Oj())Nj("//www.gstatic.com/eureka/clank"+Bj);else{if(0<=window.navigator.userAgent.indexOf("CriOS")){var a=window.__gCrWeb&&window.__gCrWeb.message&&window.__gCrWeb.message.invokeOnHost;if(a){a({command:"cast.sender.init"});return}}Kj(function(a){a?(window.chrome=window.chrome||{},window.chrome.cast=window.chrome.cast||{},window.chrome.cast.extensionId=a,Nj("chrome-extension://"+a+Bj)):(a=window.__onGCastApiAvailable)&&"function"==typeof a&&a(!1,"No cast extension found")})}}
;var Qj=w(),Rj=null,Sj=Array(50),Tj=-1,Uj=!1;function Vj(a){Wj();Rj.push(a);Xj(Rj)}
function Yj(a){var b=r("yt.mdx.remote.debug.handlers_");Ua(b||[],a)}
function Zj(a,b){Wj();var c=Rj,d=ak(a,String(b));0==c.length?bk(d):(Xj(c),y(c,function(a){a(d)}))}
function Wj(){Rj||(Rj=r("yt.mdx.remote.debug.handlers_")||[],q("yt.mdx.remote.debug.handlers_",Rj,void 0))}
function bk(a){var b=(Tj+1)%50;Tj=b;Sj[b]=a;Uj||(Uj=49==b)}
function Xj(a){var b=Sj;if(b[0]){var c=Tj,d=Uj?c:-1;do{var d=(d+1)%50,e=b[d];y(a,function(a){a(e)})}while(d!=c);
Sj=Array(50);Tj=-1;Uj=!1}}
function ak(a,b){var c=(w()-Qj)/1E3;c.toFixed&&(c=c.toFixed(3));var d=[];d.push("[",c+"s","] ");d.push("[","yt.mdx.remote","] ");d.push(a+": "+b,"\n");return d.join("")}
;function ck(a){a=a||{};this.name=a.name||"";this.id=a.id||a.screenId||"";this.token=a.token||a.loungeToken||"";this.f=a.uuid||a.dialId||""}
function dk(a,b){return!!b&&(a.id==b||a.f==b)}
function ek(a,b){return a||b?!a!=!b?!1:a.id==b.id:!0}
function fk(a,b){return a||b?!a!=!b?!1:a.id==b.id&&a.token==b.token&&a.name==b.name&&a.f==b.f:!0}
function gk(a){return{name:a.name,screenId:a.id,loungeToken:a.token,dialId:a.f}}
function hk(a){return new ck(a)}
function ik(a){return ea(a)?z(a,hk):[]}
function jk(a){return a?'{name:"'+a.name+'",id:'+a.id.substr(0,6)+"..,token:"+(a.token?".."+a.token.slice(-6):"-")+",uuid:"+(a.f?".."+a.f.slice(-6):"-")+"}":"null"}
function kk(a){return ea(a)?"["+z(a,jk).join(",")+"]":"null"}
;var lk={Te:"atp",bf:"ska",Ze:"que",Xe:"mus",af:"sus"};function mk(a){this.o=this.j="";this.f="/api/lounge";this.h=!0;a=a||document.location.href;var b=Number(a.match(Bd)[4]||null)||null||"";b&&(this.o=":"+b);this.j=Cd(a)||"";a=wb;0<=a.search("MSIE")&&(a=a.match(/MSIE ([\d.]+)/)[1],0>Ha(a,"10.0")&&(this.h=!1))}
function nk(a,b,c,d){var e=a.f;if(p(d)?d:a.h)e="https://"+a.j+a.o+a.f;return Kd(e+b,c||{})}
function ok(a,b,c,d,e){a={format:"JSON",method:"POST",context:a,timeout:5E3,withCredentials:!1,ca:pa(a.A,d,!0),onError:pa(a.l,e),xb:pa(a.B,e)};c&&(a.R=c,a.headers={"Content-Type":"application/x-www-form-urlencoded"});return Td(b,a)}
mk.prototype.A=function(a,b,c,d){b?a(d):a({text:c.responseText})};
mk.prototype.l=function(a,b){a(Error("Request error: "+b.status))};
mk.prototype.B=function(a){a(Error("request timed out"))};function pk(a){this.f=this.name=this.id="";this.status="UNKNOWN";a&&(this.id=a.id||"",this.name=a.name||"",this.f=a.activityId||"",this.status=a.status||"UNKNOWN")}
function qk(a){return{id:a.id,name:a.name,activityId:a.f,status:a.status}}
pk.prototype.toString=function(){return"{id:"+this.id+",name:"+this.name+",activityId:"+this.f+",status:"+this.status+"}"};
function rk(a){a=a||[];return"["+z(a,function(a){return a?a.toString():"null"}).join(",")+"]"}
;function sk(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0;return("x"==a?b:b&3|8).toString(16)})}
function tk(a,b){return Pa(a,function(a){return a.key==b})}
function uk(a){return z(a,function(a){return{key:a.id,name:a.name}})}
function vk(a){return z(a,function(a){return qk(a)})}
function wk(a){return z(a,function(a){return new pk(a)})}
function xk(a,b){return a||b?a&&b?a.id==b.id&&a.name==b.name:!1:!0}
function yk(a,b){return Pa(a,function(a){return a.id==b})}
function zk(a,b){return Pa(a,function(a){return ek(a,b)})}
function Ak(a,b){return Pa(a,function(a){return dk(a,b)})}
;function V(){D.call(this);this.o=new E;dc(this,pa(ec,this.o))}
x(V,D);V.prototype.subscribe=function(a,b,c){return this.isDisposed()?0:this.o.subscribe(a,b,c)};
V.prototype.unsubscribe=function(a,b,c){return this.isDisposed()?!1:this.o.unsubscribe(a,b,c)};
V.prototype.oa=function(a){return this.isDisposed()?!1:this.o.oa(a)};
V.prototype.D=function(a,b){return this.isDisposed()?!1:this.o.D.apply(this.o,arguments)};function Bk(a){V.call(this);this.B=a;this.screens=[]}
x(Bk,V);Bk.prototype.$=function(){return this.screens};
Bk.prototype.contains=function(a){return!!zk(this.screens,a)};
Bk.prototype.get=function(a){return a?Ak(this.screens,a):null};
function Ck(a,b){var c=a.get(b.f)||a.get(b.id);if(c){var d=c.name;c.id=b.id||c.id;c.name=b.name;c.token=b.token;c.f=b.f||c.f;return c.name!=d}a.screens.push(b);return!0}
function Dk(a,b){var c=a.screens.length!=b.length;a.screens=Ma(a.screens,function(a){return!!zk(b,a)});
for(var d=0,e=b.length;d<e;d++)c=Ck(a,b[d])||c;return c}
function Ek(a,b){var c=a.screens.length;a.screens=Ma(a.screens,function(a){return!ek(a,b)});
return a.screens.length<c}
Bk.prototype.info=function(a){Zj(this.B,a)};function Fk(a,b,c,d){V.call(this);this.F=a;this.B=b;this.l=c;this.A=d;this.j=0;this.f=null;this.h=NaN}
x(Fk,V);var Gk=[2E3,2E3,1E3,1E3,1E3,2E3,2E3,5E3,5E3,1E4];g=Fk.prototype;g.start=function(){!this.f&&isNaN(this.h)&&this.Jc()};
g.stop=function(){this.f&&(this.f.abort(),this.f=null);isNaN(this.h)||(I(this.h),this.h=NaN)};
g.G=function(){this.stop();Fk.I.G.call(this)};
g.Jc=function(){this.h=NaN;this.f=Td(nk(this.F,"/pairing/get_screen"),{method:"POST",R:{pairing_code:this.B},timeout:5E3,ca:v(this.Ke,this),onError:v(this.Je,this),xb:v(this.Le,this)})};
g.Ke=function(a,b){this.f=null;var c=b.screen||{};c.dialId=this.l;c.name=this.A;this.D("pairingComplete",new ck(c))};
g.Je=function(a){this.f=null;a.status&&404==a.status?this.j>=Gk.length?this.D("pairingFailed",Error("DIAL polling timed out")):(a=Gk[this.j],this.h=H(v(this.Jc,this),a),this.j++):this.D("pairingFailed",Error("Server error "+a.status))};
g.Le=function(){this.f=null;this.D("pairingFailed",Error("Server not responding"))};function Hk(a){this.app=this.name=this.id="";this.type="REMOTE_CONTROL";this.avatar=this.username="";this.capabilities=new cd;this.theme="u";a&&(this.id=a.id||a.name,this.name=a.name,this.app=a.app,this.type=a.type||"REMOTE_CONTROL",this.username=a.user||"",this.avatar=a.userAvatarUri||"",this.theme=a.theme||"u",this.capabilities=new cd(Ma((a.capabilities||"").split(","),pa(gb,lk))))}
Hk.prototype.equals=function(a){return a?this.id==a.id:!1};var Ik;function Jk(){var a=Kk(),b=Lk();A(a,b);if(Mk()){var c=a,d;d=0;for(var e=c.length,f;d<e;){var h=d+e>>1,k;k=cb(b,c[h]);0<k?d=h+1:(e=h,f=!k)}d=f?d:~d;0>d&&Za(c,-(d+1),0,b)}a=Nk(a);if(0==a.length)try{a="remote_sid",Ye.remove(""+a,"/","youtube.com")}catch(l){}else try{Ze("remote_sid",a.join(","),-1)}catch(l){}}
function Kk(){var a=U("yt-remote-connected-devices")||[];a.sort(cb);return a}
function Nk(a){if(0==a.length)return[];var b=a[0].indexOf("#"),c=-1==b?a[0]:a[0].substring(0,b);return z(a,function(a,b){return 0==b?a:a.substring(c.length)})}
function Ok(a){T("yt-remote-connected-devices",a,86400)}
function Lk(){if(Pk)return Pk;var a=U("yt-remote-device-id");a||(a=sk(),T("yt-remote-device-id",a,31536E3));for(var b=Kk(),c=1,d=a;A(b,d);)c++,d=a+"#"+c;return Pk=d}
function Qk(){return U("yt-remote-session-browser-channel")}
function Mk(){return U("yt-remote-session-screen-id")}
function Rk(a){5<a.length&&(a=a.slice(a.length-5));var b=z(Sk(),function(a){return a.loungeToken}),c=z(a,function(a){return a.loungeToken});
Oa(c,function(a){return!A(b,a)})&&Tk();
T("yt-remote-local-screens",a,31536E3)}
function Sk(){return U("yt-remote-local-screens")||[]}
function Tk(){T("yt-remote-lounge-token-expiration",!0,86400)}
function Uk(){return!U("yt-remote-lounge-token-expiration")}
function Vk(a){T("yt-remote-online-screens",a,60)}
function Wk(){return U("yt-remote-online-screens")||[]}
function Xk(a){T("yt-remote-online-dial-devices",a,30)}
function Yk(){return U("yt-remote-online-dial-devices")||[]}
function Zk(a,b){T("yt-remote-session-browser-channel",a);T("yt-remote-session-screen-id",b);var c=Kk(),d=Lk();A(c,d)||c.push(d);Ok(c);Jk()}
function $k(a){a||(tj("yt-remote-session-screen-id"),tj("yt-remote-session-video-id"));Jk();a=Kk();Ua(a,Lk());Ok(a)}
function al(){if(!Ik){var a;a=new fj;(a=a.isAvailable()?a:null)&&(Ik=new hj(a))}return Ik?!!Ik.get("yt-remote-use-staging-server"):!1}
var Pk="";function bl(a){Bk.call(this,"LocalScreenService");this.h=a;this.f=NaN;cl(this);this.info("Initializing with "+kk(this.screens))}
x(bl,Bk);g=bl.prototype;g.start=function(){cl(this)&&this.D("screenChange");Uk()&&dl(this);I(this.f);this.f=H(v(this.start,this),1E4)};
g.Fb=function(a,b){cl(this);Ck(this,a);el(this,!1);this.D("screenChange");b(a);a.token||dl(this)};
g.remove=function(a,b){var c=cl(this);Ek(this,a)&&(el(this,!1),c=!0);b(a);c&&this.D("screenChange")};
g.Cb=function(a,b,c,d){var e=cl(this),f=this.get(a.id);f?(f.name!=b&&(f.name=b,el(this,!1),e=!0),c(a)):d(Error("no such local screen."));e&&this.D("screenChange")};
g.G=function(){I(this.f);bl.I.G.call(this)};
function dl(a){if(a.screens.length){var b=z(a.screens,function(a){return a.id}),c=nk(a.h,"/pairing/get_lounge_token_batch");
ok(a.h,c,{screen_ids:b.join(",")},v(a.Ed,a),v(a.Dd,a))}}
g.Ed=function(a){cl(this);var b=this.screens.length;a=a&&a.screens||[];for(var c=0,d=a.length;c<d;++c){var e=a[c],f=this.get(e.screenId);f&&(f.token=e.loungeToken,--b)}el(this,!b);b&&Zj(this.B,"Missed "+b+" lounge tokens.")};
g.Dd=function(a){Zj(this.B,"Requesting lounge tokens failed: "+a)};
function cl(a){var b=ik(Sk()),b=Ma(b,function(a){return!a.f});
return Dk(a,b)}
function el(a,b){Rk(z(a.screens,gk));b&&Tk()}
;function fl(a,b){V.call(this);this.A=b;for(var c=U("yt-remote-online-screen-ids")||"",c=c?c.split(","):[],d={},e=this.A(),f=0,h=e.length;f<h;++f){var k=e[f].id;d[k]=A(c,k)}this.f=d;this.B=a;this.j=this.l=NaN;this.h=null;gl("Initialized with "+L(this.f))}
x(fl,V);g=fl.prototype;g.start=function(){var a=parseInt(U("yt-remote-fast-check-period")||"0",10);(this.l=w()-144E5<a?0:a)?hl(this):(this.l=w()+3E5,T("yt-remote-fast-check-period",this.l),this.Xb())};
g.isEmpty=function(){return pb(this.f)};
g.update=function(){gl("Updating availability on schedule.");var a=this.A(),b=eb(this.f,function(b,d){return b&&!!Ak(a,d)},this);
il(this,b)};
function jl(a,b,c){var d=nk(a.B,"/pairing/get_screen_availability");ok(a.B,d,{lounge_token:b.token},v(function(a){a=a.screens||[];for(var d=0,h=a.length;d<h;++d)if(a[d].loungeToken==b.token){c("online"==a[d].status);return}c(!1)},a),v(function(){c(!1)},a))}
g.G=function(){I(this.j);this.j=NaN;this.h&&(this.h.abort(),this.h=null);fl.I.G.call(this)};
function il(a,b){var c;a:if(fb(b)!=fb(a.f))c=!1;else{c=kb(b);for(var d=0,e=c.length;d<e;++d)if(!a.f[c[d]]){c=!1;break a}c=!0}c||(gl("Updated online screens: "+L(a.f)),a.f=b,a.D("screenChange"));kl(a)}
function hl(a){isNaN(a.j)||I(a.j);a.j=H(v(a.Xb,a),0<a.l&&a.l<w()?2E4:1E4)}
g.Xb=function(){I(this.j);this.j=NaN;this.h&&this.h.abort();var a=ll(this);if(fb(a)){var b=nk(this.B,"/pairing/get_screen_availability"),c={lounge_token:kb(a).join(",")};this.h=ok(this.B,b,c,v(this.ce,this,a),v(this.be,this))}else il(this,{}),hl(this)};
g.ce=function(a,b){this.h=null;var c=kb(ll(this));if(ab(c,kb(a))){for(var c=b.screens||[],d={},e=0,f=c.length;e<f;++e)d[a[c[e].loungeToken]]="online"==c[e].status;il(this,d);hl(this)}else this.M("Changing Screen set during request."),this.Xb()};
g.be=function(a){this.M("Screen availability failed: "+a);this.h=null;hl(this)};
function gl(a){Zj("OnlineScreenService",a)}
g.M=function(a){Zj("OnlineScreenService",a)};
function ll(a){var b={};y(a.A(),function(a){a.token?b[a.token]=a.id:this.M("Requesting availability of screen w/o lounge token.")});
return b}
function kl(a){var b=kb(eb(a.f,function(a){return a}));
b.sort(cb);b.length?T("yt-remote-online-screen-ids",b.join(","),60):tj("yt-remote-online-screen-ids");a=Ma(a.A(),function(a){return!!this.f[a.id]},a);
Vk(z(a,gk))}
;function W(a){Bk.call(this,"ScreenService");this.A=a;this.f=this.h=null;this.j=[];this.l={};ml(this)}
x(W,Bk);g=W.prototype;g.start=function(){this.h.start();this.f.start();this.screens.length&&(this.D("screenChange"),this.f.isEmpty()||this.D("onlineScreenChange"))};
g.Fb=function(a,b,c){this.h.Fb(a,b,c)};
g.remove=function(a,b,c){this.h.remove(a,b,c);this.f.update()};
g.Cb=function(a,b,c,d){this.h.contains(a)?this.h.Cb(a,b,c,d):(a="Updating name of unknown screen: "+a.name,Zj(this.B,a),d(Error(a)))};
g.$=function(a){return a?this.screens:Wa(this.screens,Ma(this.j,function(a){return!this.contains(a)},this))};
g.Uc=function(){return Ma(this.$(!0),function(a){return!!this.f.f[a.id]},this)};
function nl(a,b,c,d,e,f){a.info("getAutomaticScreenByIds "+c+" / "+b);c||(c=a.l[b]);var h=a.$();if(h=(c?Ak(h,c):null)||Ak(h,b)){h.f=b;var k=ol(a,h);jl(a.f,k,function(a){e(a?k:null)})}else c?pl(a,c,v(function(a){var f=ol(this,new ck({name:d,
screenId:c,loungeToken:a,dialId:b||""}));jl(this.f,f,function(a){e(a?f:null)})},a),f):e(null)}
g.Vc=function(a,b,c,d,e){this.info("getDialScreenByPairingCode "+a+" / "+b);var f=new Fk(this.A,a,b,c);f.subscribe("pairingComplete",v(function(a){ec(f);d(ol(this,a))},this));
f.subscribe("pairingFailed",function(a){ec(f);e(a)});
f.start();return v(f.stop,f)};
function ql(a,b){for(var c=0,d=a.screens.length;c<d;++c)if(a.screens[c].name==b)return a.screens[c];return null}
g.sc=function(a,b){for(var c=2,d=b(a,c);ql(this,d);){c++;if(20<c)return a;d=b(a,c)}return d};
g.Ne=function(a,b,c,d){Td(nk(this.A,"/pairing/get_screen"),{method:"POST",R:{pairing_code:a},timeout:5E3,ca:v(function(a,d){var h=new ck(d.screen||{});if(!h.name||ql(this,h.name))h.name=this.sc(h.name,b);c(ol(this,h))},this),
onError:v(function(a){d(Error("pairing request failed: "+a.status))},this),
xb:v(function(){d(Error("pairing request timed out."))},this)})};
g.G=function(){ec(this.h);ec(this.f);W.I.G.call(this)};
function pl(a,b,c,d){a.info("requestLoungeToken_ for "+b);var e={R:{screen_ids:b},method:"POST",context:a,ca:function(a,e){var k=e&&e.screens||[];k[0]&&k[0].screenId==b?c(k[0].loungeToken):d(Error("Missing lounge token in token response"))},
onError:function(){d(Error("Request screen lounge token failed"))}};
Td(nk(a.A,"/pairing/get_lounge_token_batch"),e)}
function rl(a){a.screens=a.h.$();var b=a.l,c={},d;for(d in b)c[b[d]]=d;b=0;for(d=a.screens.length;b<d;++b){var e=a.screens[b];e.f=c[e.id]||""}a.info("Updated manual screens: "+kk(a.screens))}
g.Fd=function(){rl(this);this.D("screenChange");this.f.update()};
function ml(a){sl(a);a.h=new bl(a.A);a.h.subscribe("screenChange",v(a.Fd,a));rl(a);a.j=ik(U("yt-remote-automatic-screen-cache")||[]);sl(a);a.info("Initializing automatic screens: "+kk(a.j));a.f=new fl(a.A,v(a.$,a,!0));a.f.subscribe("screenChange",v(function(){this.D("onlineScreenChange")},a))}
function ol(a,b){var c=a.get(b.id);c?(c.f=b.f,b=c):((c=Ak(a.j,b.f))?(c.id=b.id,c.token=b.token,b=c):a.j.push(b),T("yt-remote-automatic-screen-cache",z(a.j,gk)));sl(a);a.l[b.f]=b.id;T("yt-remote-device-id-map",a.l,31536E3);return b}
function sl(a){a.l=U("yt-remote-device-id-map")||{}}
W.prototype.dispose=W.prototype.dispose;function tl(a,b,c){V.call(this);this.S=c;this.K=a;this.h=b;this.j=null}
x(tl,V);g=tl.prototype;g.wb=function(a){this.j=a;this.D("sessionScreen",this.j)};
g.aa=function(a){this.isDisposed()||(a&&ul(this,""+a),this.j=null,this.D("sessionScreen",null))};
g.info=function(a){Zj(this.S,a)};
function ul(a,b){Zj(a.S,b)}
g.Xc=function(){return null};
g.Zb=function(a){var b=this.h;a?(b.displayStatus=new chrome.cast.ReceiverDisplayStatus(a,[]),b.displayStatus.showStop=!0):b.displayStatus=null;chrome.cast.setReceiverDisplayStatus(b,v(function(){this.info("Updated receiver status for "+b.friendlyName+": "+a)},this),v(function(){ul(this,"Failed to update receiver status for: "+b.friendlyName)},this))};
g.G=function(){this.Zb("");tl.I.G.call(this)};function vl(a,b){tl.call(this,a,b,"CastSession");this.f=null;this.A=0;this.l=null;this.F=v(this.Oe,this);this.B=v(this.me,this);this.A=H(v(function(){wl(this,null)},this),12E4)}
x(vl,tl);g=vl.prototype;g.Yb=function(a){if(this.f){if(this.f==a)return;ul(this,"Overriding cast sesison with new session object");this.f.removeUpdateListener(this.F);this.f.removeMessageListener("urn:x-cast:com.google.youtube.mdx",this.B)}this.f=a;this.f.addUpdateListener(this.F);this.f.addMessageListener("urn:x-cast:com.google.youtube.mdx",this.B);this.l&&xl(this);yl(this,"getMdxSessionStatus")};
g.Ta=function(a){this.info("launchWithParams: "+L(a));this.l=a;this.f&&xl(this)};
g.stop=function(){this.f?this.f.stop(v(function(){this.aa()},this),v(function(){this.aa(Error("Failed to stop receiver app."))},this)):this.aa(Error("Stopping cast device witout session."))};
g.Zb=t;g.G=function(){this.info("disposeInternal");I(this.A);this.A=0;this.f&&(this.f.removeUpdateListener(this.F),this.f.removeMessageListener("urn:x-cast:com.google.youtube.mdx",this.B));this.f=null;vl.I.G.call(this)};
function xl(a){var b=a.l.videoId||a.l.videoIds[a.l.index];b&&yl(a,"flingVideo",{videoId:b,currentTime:a.l.currentTime||0});a.l=null}
function yl(a,b,c){a.info("sendYoutubeMessage_: "+b+" "+L(c));var d={};d.type=b;c&&(d.data=c);a.f?a.f.sendMessage("urn:x-cast:com.google.youtube.mdx",d,t,v(function(){ul(this,"Failed to send message: "+b+".")},a)):ul(a,"Sending yt message without session: "+L(d))}
g.me=function(a,b){if(!this.isDisposed())if(b){var c=ud(b);if(c){var d=""+c.type,c=c.data||{};this.info("onYoutubeMessage_: "+d+" "+L(c));switch(d){case "mdxSessionStatus":wl(this,c.screenId);break;default:ul(this,"Unknown youtube message: "+d)}}else ul(this,"Unable to parse message.")}else ul(this,"No data in message.")};
function wl(a,b){I(a.A);if(b){if(a.info("onConnectedScreenId_: Received screenId: "+b),!a.j||a.j.id!=b){var c=v(a.wb,a),d=v(a.aa,a);a.qc(b,c,d,5)}}else a.aa(Error("Waiting for session status timed out."))}
g.qc=function(a,b,c,d){nl(this.K,this.h.label,a,this.h.friendlyName,v(function(e){e?b(e):0<=d?(ul(this,"Screen "+a+" appears to be offline. "+d+" retries left."),H(v(this.qc,this,a,b,c,d-1),300)):c(Error("Unable to fetch screen."))},this),c)};
g.Xc=function(){return this.f};
g.Oe=function(a){this.isDisposed()||a||(ul(this,"Cast session died."),this.aa())};function zl(a,b){tl.call(this,a,b,"DialSession");this.A=this.J=null;this.O="";this.l=null;this.F=t;this.B=NaN;this.P=v(this.Re,this);this.f=t}
x(zl,tl);g=zl.prototype;g.Yb=function(a){this.A=a;this.A.addUpdateListener(this.P)};
g.Ta=function(a){this.l=a;this.F()};
g.stop=function(){this.f();this.f=t;I(this.B);this.A?this.A.stop(v(this.aa,this,null),v(this.aa,this,"Failed to stop DIAL device.")):this.aa()};
g.G=function(){this.f();this.f=t;I(this.B);this.A&&this.A.removeUpdateListener(this.P);this.A=null;zl.I.G.call(this)};
function Al(a){a.f=a.K.Vc(a.O,a.h.label,a.h.friendlyName,v(function(a){this.f=t;this.wb(a)},a),v(function(a){this.f=t;
this.aa(a)},a))}
g.Re=function(a){this.isDisposed()||a||(ul(this,"DIAL session died."),this.f(),this.f=t,this.aa())};
function Bl(a){var b={};b.pairingCode=a.O;if(a.l){var c=a.l.index||0,d=a.l.currentTime||0;b.v=a.l.videoId||a.l.videoIds[c];b.t=d}al()&&(b.env_useStageMdx=1);return Id(b)}
g.Tb=function(a){this.O=sk();if(this.l){var b=new chrome.cast.DialLaunchResponse(!0,Bl(this));a(b);Al(this)}else this.F=v(function(){I(this.B);this.F=t;this.B=NaN;var b=new chrome.cast.DialLaunchResponse(!0,Bl(this));a(b);Al(this)},this),this.B=H(v(function(){this.F()},this),100)};
g.Gd=function(a,b){nl(this.K,this.J.receiver.label,a,this.h.friendlyName,v(function(a){a&&a.token?(this.wb(a),b(new chrome.cast.DialLaunchResponse(!1))):this.Tb(b)},this),v(function(a){ul(this,"Failed to get DIAL screen: "+a);
this.Tb(b)},this))};function Cl(a,b){tl.call(this,a,b,"ManualSession");this.f=H(v(this.Ta,this,null),150)}
x(Cl,tl);Cl.prototype.stop=function(){this.aa()};
Cl.prototype.Yb=t;Cl.prototype.Ta=function(){I(this.f);this.f=NaN;var a=Ak(this.K.$(),this.h.label);a?this.wb(a):this.aa(Error("No such screen"))};
Cl.prototype.G=function(){I(this.f);this.f=NaN;Cl.I.G.call(this)};function Dl(a){V.call(this);this.h=a;this.f=null;this.A=!1;this.j=[];this.l=v(this.$d,this)}
x(Dl,V);g=Dl.prototype;
g.init=function(a,b){chrome.cast.timeout.requestSession=3E4;var c=new chrome.cast.SessionRequest("233637DE");c.dialRequest=new chrome.cast.DialRequest("YouTube");var d=chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,e=a?chrome.cast.DefaultActionPolicy.CAST_THIS_TAB:chrome.cast.DefaultActionPolicy.CREATE_SESSION,c=new chrome.cast.ApiConfig(c,v(this.Dc,this),v(this.ae,this),d,e);c.customDialLaunchCallback=v(this.Pd,this);chrome.cast.initialize(c,v(function(){this.isDisposed()||(chrome.cast.addReceiverActionListener(this.l),
Vj(El),this.h.subscribe("onlineScreenChange",v(this.Wc,this)),this.j=Fl(this),chrome.cast.setCustomReceivers(this.j,t,v(function(a){this.M("Failed to set initial custom receivers: "+L(a))},this)),this.D("yt-remote-cast2-availability-change",Gl(this)),b(!0))},this),v(function(a){this.M("Failed to initialize API: "+L(a));
b(!1)},this))};
g.ze=function(a,b){Hl("Setting connected screen ID: "+a+" -> "+b);if(this.f){var c=this.f.j;if(!a||c&&c.id!=a)Hl("Unsetting old screen status: "+this.f.h.friendlyName),ec(this.f),this.f=null}if(a&&b){if(!this.f){c=Ak(this.h.$(),a);if(!c){Hl("setConnectedScreenStatus: Unknown screen.");return}var d=Il(this,c);d||(Hl("setConnectedScreenStatus: Connected receiver not custom..."),d=new chrome.cast.Receiver(c.f?c.f:c.id,c.name),d.receiverType=chrome.cast.ReceiverType.CUSTOM,this.j.push(d),chrome.cast.setCustomReceivers(this.j,
t,v(function(a){this.M("Failed to set initial custom receivers: "+L(a))},this)));
Hl("setConnectedScreenStatus: new active receiver: "+d.friendlyName);Jl(this,new Cl(this.h,d),!0)}this.f.Zb(b)}else Hl("setConnectedScreenStatus: no screen.")};
function Il(a,b){return b?Pa(a.j,function(a){return dk(b,a.label)},a):null}
g.Ae=function(a){this.isDisposed()?this.M("Setting connection data on disposed cast v2"):this.f?this.f.Ta(a):this.M("Setting connection data without a session")};
g.Qe=function(){this.isDisposed()?this.M("Stopping session on disposed cast v2"):this.f?(this.f.stop(),ec(this.f),this.f=null):Hl("Stopping non-existing session")};
g.requestSession=function(){chrome.cast.requestSession(v(this.Dc,this),v(this.de,this))};
g.G=function(){this.h.unsubscribe("onlineScreenChange",v(this.Wc,this));window.chrome&&chrome.cast&&chrome.cast.removeReceiverActionListener(this.l);Yj(El);ec(this.f);Dl.I.G.call(this)};
function Hl(a){Zj("Controller",a)}
g.M=function(a){Zj("Controller",a)};
function El(a){window.chrome&&chrome.cast&&chrome.cast.logMessage&&chrome.cast.logMessage(a)}
function Gl(a){return a.A||!!a.j.length||!!a.f}
function Jl(a,b,c){ec(a.f);(a.f=b)?(c?a.D("yt-remote-cast2-receiver-resumed",b.h):a.D("yt-remote-cast2-receiver-selected",b.h),b.subscribe("sessionScreen",v(a.Ec,a,b)),b.j?a.D("yt-remote-cast2-session-change",b.j):c&&a.f.Ta(null)):a.D("yt-remote-cast2-session-change",null)}
g.Ec=function(a,b){this.f==a&&(b||Jl(this,null),this.D("yt-remote-cast2-session-change",b))};
g.$d=function(a,b){if(!this.isDisposed())if(a)switch(Hl("onReceiverAction_ "+a.label+" / "+a.friendlyName+"-- "+b),b){case chrome.cast.ReceiverAction.CAST:if(this.f)if(this.f.h.label!=a.label)Hl("onReceiverAction_: Stopping active receiver: "+this.f.h.friendlyName),this.f.stop();else{Hl("onReceiverAction_: Casting to active receiver.");this.f.j&&this.D("yt-remote-cast2-session-change",this.f.j);break}switch(a.receiverType){case chrome.cast.ReceiverType.CUSTOM:Jl(this,new Cl(this.h,a));break;case chrome.cast.ReceiverType.DIAL:Jl(this,
new zl(this.h,a));break;case chrome.cast.ReceiverType.CAST:Jl(this,new vl(this.h,a));break;default:this.M("Unknown receiver type: "+a.receiverType);return}break;case chrome.cast.ReceiverAction.STOP:this.f&&this.f.h.label==a.label?this.f.stop():this.M("Stopping receiver w/o session: "+a.friendlyName)}else this.M("onReceiverAction_ called without receiver.")};
g.Pd=function(a){if(this.isDisposed())return Promise.reject(Error("disposed"));var b=a.receiver;b.receiverType!=chrome.cast.ReceiverType.DIAL&&(this.M("Not DIAL receiver: "+b.friendlyName),b.receiverType=chrome.cast.ReceiverType.DIAL);var c=this.f?this.f.h:null;if(!c||c.label!=b.label)return this.M("Receiving DIAL launch request for non-clicked DIAL receiver: "+b.friendlyName),Promise.reject(Error("illegal DIAL launch"));if(c&&c.label==b.label&&c.receiverType!=chrome.cast.ReceiverType.DIAL){if(this.f.j)return Hl("Reselecting dial screen."),
this.D("yt-remote-cast2-session-change",this.f.j),Promise.resolve(new chrome.cast.DialLaunchResponse(!1));this.M('Changing CAST intent from "'+c.receiverType+'" to "dial" for '+b.friendlyName);Jl(this,new zl(this.h,b))}b=this.f;b.J=a;return b.J.appState==chrome.cast.DialAppState.RUNNING?new Promise(v(b.Gd,b,(b.J.extraData||{}).screenId||null)):new Promise(v(b.Tb,b))};
g.Dc=function(a){if(!this.isDisposed()){Hl("New cast session ID: "+a.sessionId);var b=a.receiver;if(b.receiverType!=chrome.cast.ReceiverType.CUSTOM){if(!this.f)if(b.receiverType==chrome.cast.ReceiverType.CAST)Hl("Got resumed cast session before resumed mdx connection."),Jl(this,new vl(this.h,b),!0);else{this.M("Got non-cast session without previous mdx receiver event, or mdx resume.");return}var c=this.f.h,d=Ak(this.h.$(),c.label);d&&dk(d,b.label)&&c.receiverType!=chrome.cast.ReceiverType.CAST&&b.receiverType==
chrome.cast.ReceiverType.CAST&&(Hl("onSessionEstablished_: manual to cast session change "+b.friendlyName),ec(this.f),this.f=new vl(this.h,b),this.f.subscribe("sessionScreen",v(this.Ec,this,this.f)),this.f.Ta(null));this.f.Yb(a)}}};
g.Pe=function(){return this.f?this.f.Xc():null};
g.de=function(a){this.isDisposed()||(this.M("Failed to estabilish a session: "+L(a)),a.code!=chrome.cast.ErrorCode.CANCEL&&Jl(this,null))};
g.ae=function(a){Hl("Receiver availability updated: "+a);if(!this.isDisposed()){var b=Gl(this);this.A=a==chrome.cast.ReceiverAvailability.AVAILABLE;Gl(this)!=b&&this.D("yt-remote-cast2-availability-change",Gl(this))}};
function Fl(a){var b=a.h.Uc(),c=a.f&&a.f.h;a=z(b,function(a){c&&dk(a,c.label)&&(c=null);var b=a.f?a.f:a.id,f=Il(this,a);f?(f.label=b,f.friendlyName=a.name):(f=new chrome.cast.Receiver(b,a.name),f.receiverType=chrome.cast.ReceiverType.CUSTOM);return f},a);
c&&(c.receiverType!=chrome.cast.ReceiverType.CUSTOM&&(c=new chrome.cast.Receiver(c.label,c.friendlyName),c.receiverType=chrome.cast.ReceiverType.CUSTOM),a.push(c));return a}
g.Wc=function(){if(!this.isDisposed()){var a=Gl(this);this.j=Fl(this);Hl("Updating custom receivers: "+L(this.j));chrome.cast.setCustomReceivers(this.j,t,v(function(){this.M("Failed to set custom receivers.")},this));
var b=Gl(this);b!=a&&this.D("yt-remote-cast2-availability-change",b)}};
Dl.prototype.setLaunchParams=Dl.prototype.Ae;Dl.prototype.setConnectedScreenStatus=Dl.prototype.ze;Dl.prototype.stopSession=Dl.prototype.Qe;Dl.prototype.getCastSession=Dl.prototype.Pe;Dl.prototype.requestSession=Dl.prototype.requestSession;Dl.prototype.init=Dl.prototype.init;Dl.prototype.dispose=Dl.prototype.dispose;function Kl(a,b,c){Ll()?Nl(a)&&(Ol(!0),window.chrome&&chrome.cast&&chrome.cast.isAvailable?Pl(b):(window.__onGCastApiAvailable=function(a,c){a?Pl(b):(Ql("Failed to load cast API: "+c),Rl(!1),Ol(!1),tj("yt-remote-cast-available"),tj("yt-remote-cast-receiver"),Sl(),b(!1))},c?Bc("https://www.gstatic.com/cv/js/sender/v1/cast_sender.js"):Pj())):Ml("Cannot initialize because not running Chrome")}
function Sl(){Ml("dispose");var a=Tl();a&&a.dispose();Ul=null;q("yt.mdx.remote.cloudview.instance_",null,void 0);Vl(!1);xc(Wl);Wl.length=0}
function Xl(){return!!U("yt-remote-cast-installed")}
function Yl(){var a=U("yt-remote-cast-receiver");return a?Ba(a.friendlyName):null}
function Zl(){Ml("clearCurrentReciever");tj("yt-remote-cast-receiver")}
function $l(){Xl()?Tl()?am()?(Ml("Requesting cast selector."),Ul.requestSession()):(Ml("Wait for cast API to be ready to request the session."),Wl.push(vc("yt-remote-cast2-api-ready",$l))):Ql("requestCastSelector: Cast is not initialized."):Ql("requestCastSelector: Cast API is not installed!")}
function bm(a){am()?Tl().setLaunchParams(a):Ql("setLaunchParams called before ready.")}
function cm(a,b){am()?Tl().setConnectedScreenStatus(a,b):Ql("setConnectedScreenStatus called before ready.")}
var Ul=null;function Ll(){var a;a=0<=wb.search(/\ (CrMo|Chrome|CriOS)\//);return Yf||a}
function dm(a){Ul.init(!0,a)}
function Nl(a){var b=!1;if(!Ul){var c=r("yt.mdx.remote.cloudview.instance_");c||(c=new Dl(a),c.subscribe("yt-remote-cast2-availability-change",function(a){T("yt-remote-cast-available",a);J("yt-remote-cast2-availability-change",a)}),c.subscribe("yt-remote-cast2-receiver-selected",function(a){Ml("onReceiverSelected: "+a.friendlyName);
T("yt-remote-cast-receiver",a);J("yt-remote-cast2-receiver-selected",a)}),c.subscribe("yt-remote-cast2-receiver-resumed",function(a){Ml("onReceiverResumed: "+a.friendlyName);
T("yt-remote-cast-receiver",a)}),c.subscribe("yt-remote-cast2-session-change",function(a){Ml("onSessionChange: "+jk(a));
a||tj("yt-remote-cast-receiver");J("yt-remote-cast2-session-change",a)}),q("yt.mdx.remote.cloudview.instance_",c,void 0),b=!0);
Ul=c}Ml("cloudview.createSingleton_: "+b);return b}
function Tl(){Ul||(Ul=r("yt.mdx.remote.cloudview.instance_"));return Ul}
function Pl(a){Rl(!0);Ol(!1);dm(function(b){b?(Vl(!0),J("yt-remote-cast2-api-ready")):(Ql("Failed to initialize cast API."),Rl(!1),tj("yt-remote-cast-available"),tj("yt-remote-cast-receiver"),Sl());a(b)})}
function Ml(a){Zj("cloudview",a)}
function Ql(a){Zj("cloudview",a)}
function Rl(a){Ml("setCastInstalled_ "+a);T("yt-remote-cast-installed",a)}
function am(){return!!r("yt.mdx.remote.cloudview.apiReady_")}
function Vl(a){Ml("setApiReady_ "+a);q("yt.mdx.remote.cloudview.apiReady_",a,void 0)}
function Ol(a){q("yt.mdx.remote.cloudview.initializing_",a,void 0)}
var Wl=[];function em(){if(!("cast"in window))return!1;var a=window.cast||{};return"ActivityStatus"in a&&"Api"in a&&"LaunchRequest"in a&&"Receiver"in a}
function fm(a){Zj("CAST",a)}
function gm(a){var b=hm();b&&b.logMessage&&b.logMessage(a)}
function im(a){if(a.event.source==window&&a.event.data&&"CastApi"==a.event.data.source&&"Hello"==a.event.data.event)for(;jm.length;)jm.shift()()}
function km(){if(!r("yt.mdx.remote.castv2_")&&!lm&&(0==Sa.length&&Ya(Sa,Yk()),em())){var a=hm();a?(a.removeReceiverListener("YouTube",mm),a.addReceiverListener("YouTube",mm),fm("API initialized in the other binary")):(a=new cast.Api,nm(a),a.addReceiverListener("YouTube",mm),a.setReloadTabRequestHandler&&a.setReloadTabRequestHandler(function(){H(function(){window.location.reload(!0)},1E3)}),Vj(gm),fm("API initialized"));
lm=!0}}
function om(){var a=hm();a&&(fm("API disposed"),Yj(gm),a.setReloadTabRequestHandler&&a.setReloadTabRequestHandler(t),a.removeReceiverListener("YouTube",mm),nm(null));lm=!1;jm=null;(a=Oe(window,"message",im,!1))&&Pe(a)}
function pm(a){var b=Qa(Sa,function(b){return b.id==a.id});
0<=b&&(Sa[b]=qk(a))}
function mm(a){a.length&&fm("Updating receivers: "+L(a));qm(a);J("yt-remote-cast-device-list-update");y(rm(),function(a){sm(a.id)});
y(a,function(a){if(a.isTabProjected){var c=tm(a.id);fm("Detected device: "+c.id+" is tab projected. Firing DEVICE_TAB_PROJECTED event.");H(function(){J("yt-remote-cast-device-tab-projected",c.id)},1E3)}})}
function um(a,b){fm("Updating "+a+" activity status: "+L(b));var c=tm(a);c?(b.activityId&&(c.f=b.activityId),c.status="running"==b.status?"RUNNING":"stopped"==b.status?"STOPPED":"error"==b.status?"ERROR":"UNKNOWN","RUNNING"!=c.status&&(c.f=""),pm(c),J("yt-remote-cast-device-status-update",c)):fm("Device not found")}
function rm(){km();return wk(Sa)}
function qm(a){a=z(a,function(a){var c={id:a.id,name:Ba(a.name)};if(a=tm(a.id))c.activityId=a.f,c.status=a.status;return c});
Ra();Ya(Sa,a)}
function tm(a){var b=rm();return Pa(b,function(b){return b.id==a})||null}
function sm(a){var b=tm(a),c=hm();c&&b&&b.f&&c.getActivityStatus(b.f,function(b){"error"==b.status&&(b.status="stopped");um(a,b)})}
function vm(a){km();var b=tm(a),c=hm();c&&b&&b.f?(fm("Stopping cast activity"),c.stopActivity(b.f,pa(um,a))):fm("Dropping cast activity stop")}
function hm(){return r("yt.mdx.remote.castapi.api_")}
function nm(a){q("yt.mdx.remote.castapi.api_",a,void 0)}
var lm=!1,jm=null,Sa=r("yt.mdx.remote.castapi.devices_")||[];q("yt.mdx.remote.castapi.devices_",Sa,void 0);function wm(a,b){this.action=a;this.params=b||null}
;function xm(){}
;function ym(){this.f=w()}
new ym;ym.prototype.reset=function(){this.f=w()};
ym.prototype.get=function(){return this.f};function zm(){D.call(this);this.Ba=new pf(this);this.ya=this;this.ha=null}
x(zm,D);zm.prototype[lf]=!0;g=zm.prototype;g.addEventListener=function(a,b,c,d){xf(this,a,b,c,d)};
g.removeEventListener=function(a,b,c,d){Df(this,a,b,c,d)};
function Am(a,b){var c,d=a.ha;if(d){c=[];for(var e=1;d;d=d.ha)c.push(d),++e}var d=a.ya,e=b,f=e.type||e;if(u(e))e=new jf(e,d);else if(e instanceof jf)e.target=e.target||d;else{var h=e,e=new jf(f,d);vb(e,h)}var h=!0,k;if(c)for(var l=c.length-1;0<=l;l--)k=e.currentTarget=c[l],h=Bm(k,f,!0,e)&&h;k=e.currentTarget=d;h=Bm(k,f,!0,e)&&h;h=Bm(k,f,!1,e)&&h;if(c)for(l=0;l<c.length;l++)k=e.currentTarget=c[l],h=Bm(k,f,!1,e)&&h}
g.G=function(){zm.I.G.call(this);this.removeAllListeners();this.ha=null};
g.ub=function(a,b,c,d){return qf(this.Ba,String(a),b,c,d)};
g.$b=function(a,b,c,d){return this.Ba.remove(String(a),b,c,d)};
g.removeAllListeners=function(a){return this.Ba?this.Ba.removeAll(a):0};
function Bm(a,b,c,d){b=a.Ba.f[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var h=b[f];if(h&&!h.Va&&h.pb==c){var k=h.listener,l=h.tb||h.src;h.ob&&sf(a.Ba,h);e=!1!==k.call(l,d)&&e}}return e&&0!=d.Nc}
;function Cm(a,b){this.h=new wd(a);this.f=b?ud:td}
Cm.prototype.stringify=function(a){return vd(this.h,a)};
Cm.prototype.parse=function(a){return this.f(a)};function Dm(a,b){zm.call(this);this.f=a||1;this.h=b||m;this.j=v(this.Ce,this);this.o=w()}
x(Dm,zm);g=Dm.prototype;g.enabled=!1;g.ea=null;function Em(a,b){a.f=b;a.ea&&a.enabled?(a.stop(),a.start()):a.ea&&a.stop()}
g.Ce=function(){if(this.enabled){var a=w()-this.o;0<a&&a<.8*this.f?this.ea=this.h.setTimeout(this.j,this.f-a):(this.ea&&(this.h.clearTimeout(this.ea),this.ea=null),Am(this,"tick"),this.enabled&&(this.ea=this.h.setTimeout(this.j,this.f),this.o=w()))}};
g.start=function(){this.enabled=!0;this.ea||(this.ea=this.h.setTimeout(this.j,this.f),this.o=w())};
g.stop=function(){this.enabled=!1;this.ea&&(this.h.clearTimeout(this.ea),this.ea=null)};
g.G=function(){Dm.I.G.call(this);this.stop();delete this.h};
function Fm(a,b,c){if(ha(a))c&&(a=v(a,c));else if(a&&"function"==typeof a.handleEvent)a=v(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<b?-1:m.setTimeout(a,b||0)}
;function Gm(a,b,c){D.call(this);this.o=null!=c?v(a,c):a;this.j=b;this.h=v(this.fe,this);this.f=[]}
x(Gm,D);g=Gm.prototype;g.Bb=!1;g.Ra=null;g.ud=function(a){this.f=arguments;this.Ra?this.Bb=!0:Hm(this)};
g.stop=function(){this.Ra&&(m.clearTimeout(this.Ra),this.Ra=null,this.Bb=!1,this.f=[])};
g.G=function(){Gm.I.G.call(this);this.stop()};
g.fe=function(){this.Ra=null;this.Bb&&(this.Bb=!1,Hm(this))};
function Hm(a){a.Ra=Fm(a.h,a.j);a.o.apply(null,a.f)}
;function Im(a){D.call(this);this.h=a;this.f={}}
x(Im,D);var Jm=[];g=Im.prototype;g.ub=function(a,b,c,d){ea(b)||(b&&(Jm[0]=b.toString()),b=Jm);for(var e=0;e<b.length;e++){var f=xf(a,b[e],c||this.handleEvent,d||!1,this.h||this);if(!f)break;this.f[f.key]=f}return this};
g.$b=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)this.$b(a,b[f],c,d,e);else c=c||this.handleEvent,e=e||this.h||this,c=yf(c),d=!!d,b=a&&a[lf]?tf(a.Ba,String(b),c,d,e):a?(a=zf(a))?tf(a,b,c,d,e):null:null,b&&(Ef(b),delete this.f[b.key]);return this};
g.removeAll=function(){db(this.f,function(a,b){this.f.hasOwnProperty(b)&&Ef(a)},this);
this.f={}};
g.G=function(){Im.I.G.call(this);this.removeAll()};
g.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented");};function Km(){}
Km.prototype.f=null;function Lm(a){var b;(b=a.f)||(b={},Mm(a)&&(b[0]=!0,b[1]=!0),b=a.f=b);return b}
;var Nm;function Om(){}
x(Om,Km);function Pm(a){return(a=Mm(a))?new ActiveXObject(a):new XMLHttpRequest}
function Mm(a){if(!a.h&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.h=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.h}
Nm=new Om;function Qm(a,b,c,d,e){this.f=a;this.j=c;this.F=d;this.B=e||1;this.l=45E3;this.o=new Im(this);this.h=new Dm;Em(this.h,250)}
g=Qm.prototype;g.Ia=null;g.ma=!1;g.Xa=null;g.bc=null;g.ib=null;g.Wa=null;g.za=null;g.Da=null;g.Ka=null;g.N=null;g.kb=0;g.na=null;g.Eb=null;g.Ja=null;g.eb=-1;g.Oc=!0;g.Fa=!1;g.Rb=0;g.zb=null;var Rm={},Sm={};g=Qm.prototype;g.setTimeout=function(a){this.l=a};
function Tm(a,b,c){a.Wa=1;a.za=Xg(b.clone());a.Ka=c;a.A=!0;Um(a,null)}
function Vm(a,b,c,d,e){a.Wa=1;a.za=Xg(b.clone());a.Ka=null;a.A=c;e&&(a.Oc=!1);Um(a,d)}
function Um(a,b){a.ib=w();Wm(a);a.Da=a.za.clone();Vg(a.Da,"t",a.B);a.kb=0;a.N=a.f.Kb(a.f.jb()?b:null);0<a.Rb&&(a.zb=new Gm(v(a.Tc,a,a.N),a.Rb));a.o.ub(a.N,"readystatechange",a.oe);var c=a.Ia?sb(a.Ia):{};a.Ka?(a.Eb="POST",c["Content-Type"]="application/x-www-form-urlencoded",a.N.send(a.Da,a.Eb,a.Ka,c)):(a.Eb="GET",a.Oc&&!jd&&(c.Connection="close"),a.N.send(a.Da,a.Eb,null,c));a.f.la(1)}
g.oe=function(a){a=a.target;var b=this.zb;b&&3==Xm(a)?b.ud():this.Tc(a)};
g.Tc=function(a){try{if(a==this.N)a:{var b=Xm(this.N),c=this.N.o,d=this.N.getStatus();if(K&&!(10<=sd)||jd&&!qd("420+")){if(4>b)break a}else if(3>b||3==b&&!gd&&!Ym(this.N))break a;this.Fa||4!=b||7==c||(8==c||0>=d?this.f.la(3):this.f.la(2));Zm(this);var e=this.N.getStatus();this.eb=e;var f=Ym(this.N);(this.ma=200==e)?(4==b&&$m(this),this.A?(an(this,b,f),gd&&this.ma&&3==b&&(this.o.ub(this.h,"tick",this.ne),this.h.start())):bn(this,f),this.ma&&!this.Fa&&(4==b?this.f.vb(this):(this.ma=!1,Wm(this)))):(this.Ja=
400==e&&0<f.indexOf("Unknown SID")?3:0,X(),$m(this),cn(this))}}catch(h){this.N&&Ym(this.N)}finally{}};
function an(a,b,c){for(var d=!0;!a.Fa&&a.kb<c.length;){var e=dn(a,c);if(e==Sm){4==b&&(a.Ja=4,X(),d=!1);break}else if(e==Rm){a.Ja=4;X();d=!1;break}else bn(a,e)}4==b&&0==c.length&&(a.Ja=1,X(),d=!1);a.ma=a.ma&&d;d||($m(a),cn(a))}
g.ne=function(){var a=Xm(this.N),b=Ym(this.N);this.kb<b.length&&(Zm(this),an(this,a,b),this.ma&&4!=a&&Wm(this))};
function dn(a,b){var c=a.kb,d=b.indexOf("\n",c);if(-1==d)return Sm;c=Number(b.substring(c,d));if(isNaN(c))return Rm;d+=1;if(d+c>b.length)return Sm;var e=b.substr(d,c);a.kb=d+c;return e}
function en(a,b){a.ib=w();Wm(a);var c=b?window.location.hostname:"";a.Da=a.za.clone();N(a.Da,"DOMAIN",c);N(a.Da,"t",a.B);try{a.na=new ActiveXObject("htmlfile")}catch(n){$m(a);a.Ja=7;X();cn(a);return}var d="<html><body>";if(b){for(var e="",f=0;f<c.length;f++){var h=c.charAt(f);if("<"==h)e=e+"\\x3c";else if(">"==h)e=e+"\\x3e";else{if(h in Ga)h=Ga[h];else if(h in Fa)h=Ga[h]=Fa[h];else{var k=h,l=h.charCodeAt(0);if(31<l&&127>l)k=h;else{if(256>l){if(k="\\x",16>l||256<l)k+="0"}else k="\\u",4096>l&&(k+="0");
k+=l.toString(16).toUpperCase()}h=Ga[h]=k}e+=h}}d+='<script>document.domain="'+e+'"\x3c/script>'}d+="</body></html>";c=Nc(Cb("b/12014412"),d);a.na.open();a.na.write(Kb(c));a.na.close();a.na.parentWindow.m=v(a.ie,a);a.na.parentWindow.d=v(a.Hc,a,!0);a.na.parentWindow.rpcClose=v(a.Hc,a,!1);c=a.na.createElement("DIV");a.na.parentWindow.document.body.appendChild(c);d=Hb(a.Da.toString());d=Fb(d);Aa.test(d)&&(-1!=d.indexOf("&")&&(d=d.replace(ua,"&amp;")),-1!=d.indexOf("<")&&(d=d.replace(va,"&lt;")),-1!=
d.indexOf(">")&&(d=d.replace(wa,"&gt;")),-1!=d.indexOf('"')&&(d=d.replace(xa,"&quot;")),-1!=d.indexOf("'")&&(d=d.replace(ya,"&#39;")),-1!=d.indexOf("\x00")&&(d=d.replace(za,"&#0;")));d=Nc(Cb("b/12014412"),'<iframe src="'+d+'"></iframe>');c.innerHTML=Kb(d);a.f.la(1)}
g.ie=function(a){fn(v(this.he,this,a),0)};
g.he=function(a){this.Fa||(Zm(this),bn(this,a),Wm(this))};
g.Hc=function(a){fn(v(this.ge,this,a),0)};
g.ge=function(a){this.Fa||($m(this),this.ma=a,this.f.vb(this),this.f.la(4))};
g.cancel=function(){this.Fa=!0;$m(this)};
function Wm(a){a.bc=w()+a.l;gn(a,a.l)}
function gn(a,b){if(null!=a.Xa)throw Error("WatchDog timer not null");a.Xa=fn(v(a.ke,a),b)}
function Zm(a){a.Xa&&(m.clearTimeout(a.Xa),a.Xa=null)}
g.ke=function(){this.Xa=null;var a=w();0<=a-this.bc?(2!=this.Wa&&this.f.la(3),$m(this),this.Ja=2,X(),cn(this)):gn(this,this.bc-a)};
function cn(a){a.f.uc()||a.Fa||a.f.vb(a)}
function $m(a){Zm(a);ec(a.zb);a.zb=null;a.h.stop();a.o.removeAll();if(a.N){var b=a.N;a.N=null;hn(b);b.dispose()}a.na&&(a.na=null)}
function bn(a,b){try{a.f.Cc(a,b),a.f.la(4)}catch(c){}}
;function jn(a,b,c,d,e){if(0==d)c(!1);else{var f=e||0;d--;kn(a,b,function(e){e?c(!0):m.setTimeout(function(){jn(a,b,c,d,f)},f)})}}
function kn(a,b,c){var d=new Image;d.onload=function(){try{ln(d),c(!0)}catch(a){}};
d.onerror=function(){try{ln(d),c(!1)}catch(a){}};
d.onabort=function(){try{ln(d),c(!1)}catch(a){}};
d.ontimeout=function(){try{ln(d),c(!1)}catch(a){}};
m.setTimeout(function(){if(d.ontimeout)d.ontimeout()},b);
d.src=a}
function ln(a){a.onload=null;a.onerror=null;a.onabort=null;a.ontimeout=null}
;function mn(a){this.f=a;this.h=new Cm(null,!0)}
g=mn.prototype;g.Pb=null;g.da=null;g.Ab=!1;g.Rc=null;g.qb=null;g.Ub=null;g.Qb=null;g.fa=null;g.xa=-1;g.cb=null;g.Ya=null;g.connect=function(a){this.Qb=a;a=nn(this.f,null,this.Qb);X();this.Rc=w();var b=this.f.F;null!=b?(this.cb=b[0],(this.Ya=b[1])?(this.fa=1,on(this)):(this.fa=2,pn(this))):(Vg(a,"MODE","init"),this.da=new Qm(this,0,void 0,void 0,void 0),this.da.Ia=this.Pb,Vm(this.da,a,!1,null,!0),this.fa=0)};
function on(a){var b=nn(a.f,a.Ya,"/mail/images/cleardot.gif");Xg(b);jn(b.toString(),5E3,v(a.od,a),3,2E3);a.la(1)}
g.od=function(a){if(a)this.fa=2,pn(this);else{X();var b=this.f;b.ia=b.Aa.xa;qn(b,9)}a&&this.la(2)};
function pn(a){var b=a.f.W;if(null!=b)X(),b?(X(),rn(a.f,a,!1)):(X(),rn(a.f,a,!0));else if(a.da=new Qm(a,0,void 0,void 0,void 0),a.da.Ia=a.Pb,b=a.f,b=nn(b,b.jb()?a.cb:null,a.Qb),X(),!K||10<=sd)Vg(b,"TYPE","xmlhttp"),Vm(a.da,b,!1,a.cb,!1);else{Vg(b,"TYPE","html");var c=a.da;a=Boolean(a.cb);c.Wa=3;c.za=Xg(b.clone());en(c,a)}}
g.Kb=function(a){return this.f.Kb(a)};
g.uc=function(){return!1};
g.Cc=function(a,b){this.xa=a.eb;if(0==this.fa)if(b){try{var c=this.h.parse(b)}catch(d){c=this.f;c.ia=this.xa;qn(c,2);return}this.cb=c[0];this.Ya=c[1]}else c=this.f,c.ia=this.xa,qn(c,2);else if(2==this.fa)if(this.Ab)X(),this.Ub=w();else if("11111"==b){if(X(),this.Ab=!0,this.qb=w(),c=this.qb-this.Rc,!K||10<=sd||500>c)this.xa=200,this.da.cancel(),X(),rn(this.f,this,!0)}else X(),this.qb=this.Ub=w(),this.Ab=!1};
g.vb=function(){this.xa=this.da.eb;if(this.da.ma)0==this.fa?this.Ya?(this.fa=1,on(this)):(this.fa=2,pn(this)):2==this.fa&&(a=!1,(a=!K||10<=sd?this.Ab:200>this.Ub-this.qb?!1:!0)?(X(),rn(this.f,this,!0)):(X(),rn(this.f,this,!1)));else{0==this.fa?X():2==this.fa&&X();var a=this.f;a.ia=this.xa;qn(a,2)}};
g.jb=function(){return this.f.jb()};
g.isActive=function(){return this.f.isActive()};
g.la=function(a){this.f.la(a)};function sn(a){zm.call(this);this.headers=new Tc;this.P=a||null;this.h=!1;this.O=this.f=null;this.qa=this.F="";this.o=0;this.l="";this.j=this.Z=this.B=this.S=!1;this.A=0;this.J=null;this.sa="";this.K=this.ta=!1}
x(sn,zm);var tn=/^https?$/i,un=["POST","PUT"];g=sn.prototype;
g.send=function(a,b,c,d){if(this.f)throw Error("[goog.net.XhrIo] Object is active with another request="+this.F+"; newUri="+a);b=b?b.toUpperCase():"GET";this.F=a;this.l="";this.o=0;this.qa=b;this.S=!1;this.h=!0;this.f=this.P?Pm(this.P):Pm(Nm);this.O=this.P?Lm(this.P):Lm(Nm);this.f.onreadystatechange=v(this.Bc,this);try{xm(vn(this,"Opening Xhr")),this.Z=!0,this.f.open(b,String(a),!0),this.Z=!1}catch(f){xm(vn(this,"Error opening Xhr: "+f.message));wn(this,f);return}a=c||"";var e=this.headers.clone();
d&&ad(d,function(a,b){Uc(e,b,a)});
d=Pa(e.ra(),xn);c=m.FormData&&a instanceof m.FormData;!A(un,b)||d||c||Uc(e,"Content-Type","application/x-www-form-urlencoded;charset=utf-8");e.forEach(function(a,b){this.f.setRequestHeader(b,a)},this);
this.sa&&(this.f.responseType=this.sa);lb(this.f)&&(this.f.withCredentials=this.ta);try{yn(this),0<this.A&&(this.K=zn(this.f),xm(vn(this,"Will abort after "+this.A+"ms if incomplete, xhr2 "+this.K)),this.K?(this.f.timeout=this.A,this.f.ontimeout=v(this.tc,this)):this.J=Fm(this.tc,this.A,this)),xm(vn(this,"Sending request")),this.B=!0,this.f.send(a),this.B=!1}catch(f){xm(vn(this,"Send error: "+f.message)),wn(this,f)}};
function zn(a){return K&&qd(9)&&ga(a.timeout)&&p(a.ontimeout)}
function xn(a){return"content-type"==a.toLowerCase()}
g.tc=function(){"undefined"!=typeof aa&&this.f&&(this.l="Timed out after "+this.A+"ms, aborting",this.o=8,vn(this,this.l),Am(this,"timeout"),hn(this,8))};
function wn(a,b){a.h=!1;a.f&&(a.j=!0,a.f.abort(),a.j=!1);a.l=b;a.o=5;An(a);Bn(a)}
function An(a){a.S||(a.S=!0,Am(a,"complete"),Am(a,"error"))}
function hn(a,b){a.f&&a.h&&(vn(a,"Aborting"),a.h=!1,a.j=!0,a.f.abort(),a.j=!1,a.o=b||7,Am(a,"complete"),Am(a,"abort"),Bn(a))}
g.G=function(){this.f&&(this.h&&(this.h=!1,this.j=!0,this.f.abort(),this.j=!1),Bn(this,!0));sn.I.G.call(this)};
g.Bc=function(){this.isDisposed()||(this.Z||this.B||this.j?Cn(this):this.Yd())};
g.Yd=function(){Cn(this)};
function Cn(a){if(a.h&&"undefined"!=typeof aa)if(a.O[1]&&4==Xm(a)&&2==a.getStatus())vn(a,"Local request error detected and ignored");else if(a.B&&4==Xm(a))Fm(a.Bc,0,a);else if(Am(a,"readystatechange"),4==Xm(a)){vn(a,"Request complete");a.h=!1;try{var b=a.getStatus(),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=String(a.F).match(Bd)[1]||null;if(!f&&m.self&&m.self.location)var h=m.self.location.protocol,
f=h.substr(0,h.length-1);e=!tn.test(f?f.toLowerCase():"")}d=e}if(d)Am(a,"complete"),Am(a,"success");else{a.o=6;var k;try{k=2<Xm(a)?a.f.statusText:""}catch(l){k=""}a.l=k+" ["+a.getStatus()+"]";An(a)}}finally{Bn(a)}}}
function Bn(a,b){if(a.f){yn(a);var c=a.f,d=a.O[0]?t:null;a.f=null;a.O=null;b||Am(a,"ready");try{c.onreadystatechange=d}catch(e){}}}
function yn(a){a.f&&a.K&&(a.f.ontimeout=null);ga(a.J)&&(m.clearTimeout(a.J),a.J=null)}
g.isActive=function(){return!!this.f};
function Xm(a){return a.f?a.f.readyState:0}
g.getStatus=function(){try{return 2<Xm(this)?this.f.status:-1}catch(a){return-1}};
function Ym(a){try{return a.f?a.f.responseText:""}catch(b){return""}}
function vn(a,b){return b+" ["+a.qa+" "+a.F+" "+a.getStatus()+"]"}
;function Dn(a,b,c){this.B=a||null;this.f=1;this.h=[];this.o=[];this.l=new Cm(null,!0);this.F=b||null;this.W=null!=c?c:null}
function En(a,b){this.f=a;this.map=b;this.context=null}
g=Dn.prototype;g.ab=null;g.X=null;g.L=null;g.Ob=null;g.rb=null;g.jc=null;g.sb=null;g.gb=0;g.Id=0;g.T=null;g.Ca=null;g.wa=null;g.Ha=null;g.Aa=null;g.Db=null;g.Sa=-1;g.wc=-1;g.ia=-1;g.bb=0;g.Qa=0;g.Ga=8;var Fn=new zm;function Gn(a){jf.call(this,"statevent",a)}
x(Gn,jf);function Hn(a,b){jf.call(this,"timingevent",a);this.size=b}
x(Hn,jf);function In(a){jf.call(this,"serverreachability",a)}
x(In,jf);g=Dn.prototype;g.connect=function(a,b,c,d,e){X();this.Ob=b;this.ab=c||{};d&&p(e)&&(this.ab.OSID=d,this.ab.OAID=e);this.Aa=new mn(this);this.Aa.Pb=null;this.Aa.h=this.l;this.Aa.connect(a)};
function Jn(a){Kn(a);if(3==a.f){var b=a.gb++,c=a.rb.clone();N(c,"SID",a.j);N(c,"RID",b);N(c,"TYPE","terminate");Ln(a,c);b=new Qm(a,0,a.j,b,void 0);b.Wa=2;b.za=Xg(c.clone());(new Image).src=b.za;b.ib=w();Wm(b)}Mn(a)}
function Kn(a){if(a.Aa){var b=a.Aa;b.da&&(b.da.cancel(),b.da=null);b.xa=-1;a.Aa=null}a.L&&(a.L.cancel(),a.L=null);a.wa&&(m.clearTimeout(a.wa),a.wa=null);Nn(a);a.X&&(a.X.cancel(),a.X=null);a.Ca&&(m.clearTimeout(a.Ca),a.Ca=null)}
function On(a,b){if(0==a.f)throw Error("Invalid operation: sending map when state is closed");a.h.push(new En(a.Id++,b));2!=a.f&&3!=a.f||Pn(a)}
g.uc=function(){return 0==this.f};
function Pn(a){a.X||a.Ca||(a.Ca=fn(v(a.Gc,a),0),a.bb=0)}
g.Gc=function(a){this.Ca=null;Qn(this,a)};
function Qn(a,b){if(1==a.f){if(!b){a.gb=Math.floor(1E5*Math.random());var c=a.gb++,d=new Qm(a,0,"",c,void 0);d.Ia=null;var e=Rn(a),f=a.rb.clone();N(f,"RID",c);a.B&&N(f,"CVER",a.B);Ln(a,f);Tm(d,f,e);a.X=d;a.f=2}}else 3==a.f&&(b?Sn(a,b):0!=a.h.length&&(a.X||Sn(a)))}
function Sn(a,b){var c,d;b?6<a.Ga?(a.h=a.o.concat(a.h),a.o.length=0,c=a.gb-1,d=Rn(a)):(c=b.F,d=b.Ka):(c=a.gb++,d=Rn(a));var e=a.rb.clone();N(e,"SID",a.j);N(e,"RID",c);N(e,"AID",a.Sa);Ln(a,e);c=new Qm(a,0,a.j,c,a.bb+1);c.Ia=null;c.setTimeout(Math.round(1E4)+Math.round(1E4*Math.random()));a.X=c;Tm(c,e,d)}
function Ln(a,b){if(a.T){var c=a.T.pc(a);c&&db(c,function(a,c){N(b,c,a)})}}
function Rn(a){var b=Math.min(a.h.length,1E3),c=["count="+b],d;6<a.Ga&&0<b?(d=a.h[0].f,c.push("ofs="+d)):d=0;for(var e=0;e<b;e++){var f=a.h[e].f,h=a.h[e].map,f=6>=a.Ga?e:f-d;try{ad(h,function(a,b){c.push("req"+f+"_"+b+"="+encodeURIComponent(a))})}catch(k){c.push("req"+f+"_type="+encodeURIComponent("_badmap"))}}a.o=a.o.concat(a.h.splice(0,b));
return c.join("&")}
function Tn(a){a.L||a.wa||(a.A=1,a.wa=fn(v(a.Fc,a),0),a.Qa=0)}
function Un(a){if(a.L||a.wa||3<=a.Qa)return!1;a.A++;a.wa=fn(v(a.Fc,a),Vn(a,a.Qa));a.Qa++;return!0}
g.Fc=function(){this.wa=null;this.L=new Qm(this,0,this.j,"rpc",this.A);this.L.Ia=null;this.L.Rb=0;var a=this.jc.clone();N(a,"RID","rpc");N(a,"SID",this.j);N(a,"CI",this.Db?"0":"1");N(a,"AID",this.Sa);Ln(this,a);if(!K||10<=sd)N(a,"TYPE","xmlhttp"),Vm(this.L,a,!0,this.sb,!1);else{N(a,"TYPE","html");var b=this.L,c=Boolean(this.sb);b.Wa=3;b.za=Xg(a.clone());en(b,c)}};
function rn(a,b,c){a.Db=c;a.ia=b.xa;a.rd(1,0);a.rb=nn(a,null,a.Ob);Pn(a)}
g.Cc=function(a,b){if(0!=this.f&&(this.L==a||this.X==a))if(this.ia=a.eb,this.X==a&&3==this.f)if(7<this.Ga){var c;try{c=this.l.parse(b)}catch(f){c=null}if(ea(c)&&3==c.length)if(0==c[0])a:{if(!this.wa){if(this.L)if(this.L.ib+3E3<this.X.ib)Nn(this),this.L.cancel(),this.L=null;else break a;Un(this);X()}}else this.wc=c[1],0<this.wc-this.Sa&&37500>c[2]&&this.Db&&0==this.Qa&&!this.Ha&&(this.Ha=fn(v(this.Jd,this),6E3));else qn(this,11)}else"y2f%"!=b&&qn(this,11);else if(this.L==a&&Nn(this),!/^[\s\xa0]*$/.test(b)){c=
this.l.parse(b);ea(c);for(var d=0;d<c.length;d++){var e=c[d];this.Sa=e[0];e=e[1];2==this.f?"c"==e[0]?(this.j=e[1],this.sb=e[2],e=e[3],null!=e?this.Ga=e:this.Ga=6,this.f=3,this.T&&this.T.nc(this),this.jc=nn(this,this.jb()?this.sb:null,this.Ob),Tn(this)):"stop"==e[0]&&qn(this,7):3==this.f&&("stop"==e[0]?qn(this,7):"noop"!=e[0]&&this.T&&this.T.mc(this,e),this.Qa=0)}}};
g.Jd=function(){null!=this.Ha&&(this.Ha=null,this.L.cancel(),this.L=null,Un(this),X())};
function Nn(a){null!=a.Ha&&(m.clearTimeout(a.Ha),a.Ha=null)}
g.vb=function(a){var b;if(this.L==a)Nn(this),this.L=null,b=2;else if(this.X==a)this.X=null,b=1;else return;this.ia=a.eb;if(0!=this.f)if(a.ma)1==b?(w(),Am(Fn,new Hn(Fn,a.Ka?a.Ka.length:0)),Pn(this),this.o.length=0):Tn(this);else{var c=a.Ja,d;if(!(d=3==c||7==c||0==c&&0<this.ia)){if(d=1==b)this.X||this.Ca||1==this.f||2<=this.bb?d=!1:(this.Ca=fn(v(this.Gc,this,a),Vn(this,this.bb)),this.bb++,d=!0);d=!(d||2==b&&Un(this))}if(d)switch(c){case 1:qn(this,5);break;case 4:qn(this,10);break;case 3:qn(this,6);
break;case 7:qn(this,12);break;default:qn(this,2)}}};
function Vn(a,b){var c=5E3+Math.floor(1E4*Math.random());a.isActive()||(c*=2);return c*b}
g.rd=function(a){if(!A(arguments,this.f))throw Error("Unexpected channel state: "+this.f);};
function qn(a,b){if(2==b||9==b){var c=null;a.T&&(c=null);var d=v(a.Be,a);c||(c=new Eg("//www.google.com/images/cleardot.gif"),Xg(c));kn(c.toString(),1E4,d)}else X();Wn(a,b)}
g.Be=function(a){a?X():(X(),Wn(this,8))};
function Wn(a,b){a.f=0;a.T&&a.T.lc(a,b);Mn(a);Kn(a)}
function Mn(a){a.f=0;a.ia=-1;if(a.T)if(0==a.o.length&&0==a.h.length)a.T.Ib(a);else{var b=Xa(a.o),c=Xa(a.h);a.o.length=0;a.h.length=0;a.T.Ib(a,b,c)}}
function nn(a,b,c){var d=Yg(c);if(""!=d.h)b&&Gg(d,b+"."+d.h),Hg(d,d.B);else var e=window.location,d=Zg(e.protocol,b?b+"."+e.hostname:e.hostname,e.port,c);a.ab&&db(a.ab,function(a,b){N(d,b,a)});
N(d,"VER",a.Ga);Ln(a,d);return d}
g.Kb=function(a){if(a)throw Error("Can't create secondary domain capable XhrIo object.");a=new sn;a.ta=!1;return a};
g.isActive=function(){return!!this.T&&this.T.isActive(this)};
function fn(a,b){if(!ha(a))throw Error("Fn must not be null and must be a function");return m.setTimeout(function(){a()},b)}
g.la=function(){Am(Fn,new In(Fn))};
function X(){Am(Fn,new Gn(Fn))}
g.jb=function(){return!(!K||10<=sd)};
function Xn(){}
g=Xn.prototype;g.nc=function(){};
g.mc=function(){};
g.lc=function(){};
g.Ib=function(){};
g.pc=function(){return{}};
g.isActive=function(){return!0};function Yn(a,b){Dm.call(this);this.l=0;if(ha(a))b&&(a=v(a,b));else if(a&&ha(a.handleEvent))a=v(a.handleEvent,a);else throw Error("Invalid listener argument");this.B=a;xf(this,"tick",v(this.A,this));this.stop();Em(this,5E3+2E4*Math.random())}
x(Yn,Dm);Yn.prototype.A=function(){if(500<this.f){var a=this.f;24E4>2*a&&(a*=2);Em(this,a)}this.B()};
Yn.prototype.start=function(){Yn.I.start.call(this);this.l=w()+this.f};
Yn.prototype.stop=function(){this.l=0;Yn.I.stop.call(this)};function Zn(a,b){this.K=a;this.o=b;this.j=new E;this.h=new Yn(this.Ie,this);this.f=null;this.J=!1;this.A=null;this.W="";this.F=this.l=0;this.B=[]}
x(Zn,Xn);g=Zn.prototype;g.subscribe=function(a,b,c){return this.j.subscribe(a,b,c)};
g.unsubscribe=function(a,b,c){return this.j.unsubscribe(a,b,c)};
g.oa=function(a){return this.j.oa(a)};
g.D=function(a,b){return this.j.D.apply(this.j,arguments)};
g.dispose=function(){this.J||(this.J=!0,this.j.clear(),$n(this),ec(this.j))};
g.isDisposed=function(){return this.J};
function ao(a){return{firstTestResults:[""],secondTestResults:!a.f.Db,sessionId:a.f.j,arrayId:a.f.Sa}}
g.connect=function(a,b,c){if(!this.f||2!=this.f.f){this.W="";this.h.stop();this.A=a||null;this.l=b||0;a=this.K+"/test";b=this.K+"/bind";var d=new Dn("1",c?c.firstTestResults:null,c?c.secondTestResults:null),e=this.f;e&&(e.T=null);d.T=this;this.f=d;e?this.f.connect(a,b,this.o,e.j,e.Sa):c?this.f.connect(a,b,this.o,c.sessionId,c.arrayId):this.f.connect(a,b,this.o)}};
function $n(a,b){a.F=b||0;a.h.stop();a.f&&(3==a.f.f&&Qn(a.f),Jn(a.f));a.F=0}
g.sendMessage=function(a,b){var c={_sc:a};b&&vb(c,b);this.h.enabled||2==(this.f?this.f.f:0)?this.B.push(c):this.f&&3==this.f.f&&On(this.f,c)};
g.nc=function(){var a=this.h;a.stop();Em(a,5E3+2E4*Math.random());this.A=null;this.l=0;if(this.B.length){a=this.B;this.B=[];for(var b=0,c=a.length;b<c;++b)On(this.f,a[b])}this.D("handlerOpened")};
g.lc=function(a,b){var c=2==b&&401==this.f.ia;if(4!=b&&!c){if(6==b||410==this.f.ia)c=this.h,c.stop(),Em(c,500);this.h.start()}this.D("handlerError",b)};
g.Ib=function(a,b,c){if(!this.h.enabled)this.D("handlerClosed");else if(c)for(a=0,b=c.length;a<b;++a){var d=c[a].map;d&&this.B.push(d)}};
g.pc=function(){var a={v:2};this.W&&(a.gsessionid=this.W);0!=this.l&&(a.ui=""+this.l);0!=this.F&&(a.ui=""+this.F);this.A&&vb(a,this.A);return a};
g.mc=function(a,b){if("S"==b[0])this.W=b[1];else if("gracefulReconnect"==b[0]){var c=this.h;c.stop();Em(c,500);this.h.start();Jn(this.f)}else this.D("handlerMessage",new wm(b[0],b[1]))};
function bo(a,b){(a.o.loungeIdToken=b)||a.h.stop()}
g.Ie=function(){this.h.stop();var a=this.f,b=0;a.L&&b++;a.X&&b++;0!=b?this.h.start():this.connect(this.A,this.l)};function co(a){this.videoIds=null;this.index=-1;this.videoId=this.f="";this.volume=this.h=-1;this.l=!1;this.audioTrackId=null;this.A=this.o=0;this.j=null;this.reset(a)}
function eo(a,b){if(a.f)throw Error(b+" is not allowed in V3.");}
function fo(a){a.audioTrackId=null;a.j=null;a.h=-1;a.o=0;a.A=w()}
co.prototype.reset=function(a){this.videoIds=[];this.f="";this.index=-1;this.videoId="";fo(this);this.volume=-1;this.l=!1;a&&(this.videoIds=a.videoIds,this.index=a.index,this.f=a.listId,this.videoId=a.videoId,this.h=a.playerState,this.volume=a.volume,this.l=a.muted,this.audioTrackId=a.audioTrackId,this.j=a.trackData,this.o=a.playerTime,this.A=a.playerTimeAt)};
function go(a){return a.f?a.videoId:a.videoIds[a.index]}
function ho(a){switch(a.h){case 1:return(w()-a.A)/1E3+a.o;case -1E3:return 0}return a.o}
co.prototype.setVideoId=function(a){eo(this,"setVideoId");var b=this.index;this.index=La(this.videoIds,a);b!=this.index&&fo(this);return-1!=b};
function io(a,b,c){eo(a,"setPlaylist");c=c||go(a);ab(a.videoIds,b)&&c==go(a)||(a.videoIds=Xa(b),a.setVideoId(c))}
co.prototype.remove=function(a){eo(this,"remove");var b=go(this);return Ua(this.videoIds,a)?(this.index=La(this.videoIds,b),!0):!1};
function jo(a){var b={};b.videoIds=Xa(a.videoIds);b.index=a.index;b.listId=a.f;b.videoId=a.videoId;b.playerState=a.h;b.volume=a.volume;b.muted=a.l;b.audioTrackId=a.audioTrackId;b.trackData=tb(a.j);b.playerTime=a.o;b.playerTimeAt=a.A;return b}
co.prototype.clone=function(){return new co(jo(this))};function Y(a,b,c){V.call(this);this.A=NaN;this.S=!1;this.J=this.F=this.P=this.K=NaN;this.Z=[];this.j=this.C=this.f=null;this.Na=a;this.Z.push(M(window,"beforeunload",v(this.Cd,this)));this.h=[];this.C=new co;3==c["mdx-version"]&&(this.C.f="RQ"+b.token);this.ha=b.id;this.f=ko(this,c);this.f.subscribe("handlerOpened",this.Od,this);this.f.subscribe("handlerClosed",this.Kd,this);this.f.subscribe("handlerError",this.Ld,this);this.C.f?this.f.subscribe("handlerMessage",this.Md,this):this.f.subscribe("handlerMessage",
this.Nd,this);bo(this.f,b.token);this.subscribe("remoteQueueChange",function(){var a=this.C.videoId;Mk()&&T("yt-remote-session-video-id",a)},this)}
x(Y,V);g=Y.prototype;
g.connect=function(a,b){if(b){if(this.C.f){var c=b.listId,d=b.videoId,e=b.index,f=b.currentTime||0;5>=f&&(f=0);h={videoId:d,currentTime:f};c&&(h.listId=c);p(e)&&(h.currentIndex=e);c&&(this.C.f=c);this.C.videoId=d;this.C.index=e||0}else{var d=b.videoIds[b.index],f=b.currentTime||0;5>=f&&(f=0);var h={videoIds:d,videoId:d,currentTime:f};this.C.videoIds=[d];this.C.index=0}this.C.state=3;c=this.C;c.o=f;c.A=w();this.H("Connecting with setPlaylist and params: "+L(h));this.f.connect({method:"setPlaylist",params:L(h)},
a,Qk())}else this.H("Connecting without params"),this.f.connect({},a,Qk());lo(this)};
g.dispose=function(){this.isDisposed()||(this.D("beforeDispose"),mo(this,3));Y.I.dispose.call(this)};
g.G=function(){no(this);oo(this);po(this);I(this.F);this.F=NaN;I(this.J);this.J=NaN;this.j=null;Pe(this.Z);this.Z.length=0;this.f.dispose();Y.I.G.call(this);this.h=this.C=this.f=null};
g.H=function(a){Zj("conn",a)};
g.Cd=function(){this.l(2)};
function ko(a,b){return new Zn(nk(a.Na,"/bc",void 0,!1),b)}
function mo(a,b){a.D("proxyStateChange",b)}
function lo(a){a.A=H(v(function(){this.H("Connecting timeout");this.l(1)},a),2E4)}
function no(a){I(a.A);a.A=NaN}
function po(a){I(a.K);a.K=NaN}
function qo(a){oo(a);a.P=H(v(function(){ro(this,"getNowPlaying")},a),2E4)}
function oo(a){I(a.P);a.P=NaN}
function so(a){var b=a.f;return!!b.f&&3==b.f.f&&isNaN(a.A)}
g.Od=function(){this.H("Channel opened");this.S&&(this.S=!1,po(this),this.K=H(v(function(){this.H("Timing out waiting for a screen.");this.l(1)},this),15E3));
Zk(ao(this.f),this.ha)};
g.Kd=function(){this.H("Channel closed");isNaN(this.A)?$k(!0):$k();this.dispose()};
g.Ld=function(a){$k();isNaN(this.B())?(this.H("Channel error: "+a+" without reconnection"),this.dispose()):(this.S=!0,this.H("Channel error: "+a+" with reconnection in "+this.B()+" ms"),mo(this,2))};
function to(a,b){b&&(no(a),po(a));b==so(a)?b&&(mo(a,1),ro(a,"getSubtitlesTrack")):b?(a.O()&&a.C.reset(),mo(a,1),ro(a,"getNowPlaying"),uo(a)):a.l(1)}
function vo(a,b){var c=b.params.videoId;delete b.params.videoId;c==a.C.videoId&&(pb(b.params)?a.C.j=null:a.C.j=b.params,a.D("remotePlayerChange"))}
function wo(a,b){var c=b.params.videoId||b.params.video_id,d=parseInt(b.params.currentIndex,10);a.C.f=b.params.listId||a.C.f;var e=a.C,f=e.videoId;e.videoId=c;e.index=d;c!=f&&fo(e);a.D("remoteQueueChange")}
function xo(a,b){b.params=b.params||{};wo(a,b);yo(a,b)}
function yo(a,b){var c=parseInt(b.params.currentTime||b.params.current_time,10),d=a.C;d.o=isNaN(c)?0:c;d.A=w();c=parseInt(b.params.state,10);c=isNaN(c)?-1:c;-1==c&&-1E3==a.C.h&&(c=-1E3);a.C.h=c;1==a.C.h?qo(a):oo(a);a.D("remotePlayerChange")}
function zo(a,b){var c="true"==b.params.muted;a.C.volume=parseInt(b.params.volume,10);a.C.l=c;a.D("remotePlayerChange")}
g.Md=function(a){a.params?this.H("Received: action="+a.action+", params="+L(a.params)):this.H("Received: action="+a.action+" {}");switch(a.action){case "loungeStatus":a=td(a.params.devices);this.h=z(a,function(a){return new Hk(a)});
a=!!Pa(this.h,function(a){return"LOUNGE_SCREEN"==a.type});
to(this,a);break;case "loungeScreenConnected":to(this,!0);break;case "loungeScreenDisconnected":Va(this.h,function(a){return"LOUNGE_SCREEN"==a.type});
to(this,!1);break;case "remoteConnected":var b=new Hk(td(a.params.device));Pa(this.h,function(a){return a.equals(b)})||Ta(this.h,b);
break;case "remoteDisconnected":b=new Hk(td(a.params.device));Va(this.h,function(a){return a.equals(b)});
break;case "gracefulDisconnect":break;case "playlistModified":wo(this,a);break;case "nowPlaying":xo(this,a);break;case "onStateChange":yo(this,a);break;case "onVolumeChanged":zo(this,a);break;case "onSubtitlesTrackChanged":vo(this,a);break;default:this.H("Unrecognized action: "+a.action)}};
g.Nd=function(a){a.params?this.H("Received: action="+a.action+", params="+L(a.params)):this.H("Received: action="+a.action);Ao(this,a);Bo(this,a);if(so(this)){var b=this.C.clone(),c=!1,d,e,f,h,k,l;a.params&&(d=a.params.videoId||a.params.video_id,e=a.params.videoIds||a.params.video_ids,f=a.params.state,h=a.params.currentTime||a.params.current_time,k=a.params.volume,l=a.params.muted,p(a.params.currentError)&&td(a.params.currentError));if("onSubtitlesTrackChanged"==a.action)d==go(this.C)&&(delete a.params.videoId,
pb(a.params)?this.C.j=null:this.C.j=a.params,this.D("remotePlayerChange"));else if(go(this.C)||"onStateChange"!=a.action){"playlistModified"!=a.action&&"nowPlayingPlaylist"!=a.action||e?(d||"nowPlaying"!=a.action&&"nowPlayingPlaylist"!=a.action?d||(d=go(this.C)):this.C.setVideoId(""),e&&(e=e.split(","),io(this.C,e,d))):io(this.C,[]);e=this.C;var n=d;eo(e,"add");n&&!A(e.videoIds,n)?(e.videoIds.push(n),e=!0):e=!1;e&&ro(this,"getPlaylist");d&&this.C.setVideoId(d);b.index==this.C.index&&ab(b.videoIds,
this.C.videoIds)?"playlistModified"!=a.action&&"nowPlayingPlaylist"!=a.action||this.D("remoteQueueChange"):this.D("remoteQueueChange");p(f)&&(a=parseInt(f,10),a=isNaN(a)?-1:a,-1==a&&-1E3==this.C.h&&(a=-1E3),0==a&&"0"==h&&(a=-1),c=c||a!=this.C.h,this.C.h=a,1==this.C.h?qo(this):oo(this));h&&(a=parseInt(h,10),c=this.C,c.o=isNaN(a)?0:a,c.A=w(),c=!0);p(k)&&(a=parseInt(k,10),isNaN(a)||(c=c||this.C.volume!=a,this.C.volume=a),p(l)&&(l="true"==l,c=c||this.C.l!=l,this.C.l=l));c&&this.D("remotePlayerChange")}}};
function Ao(a,b){switch(b.action){case "loungeStatus":var c=td(b.params.devices);a.h=z(c,function(a){return new Hk(a)});
break;case "loungeScreenDisconnected":Va(a.h,function(a){return"LOUNGE_SCREEN"==a.type});
break;case "remoteConnected":var d=new Hk(td(b.params.device));Pa(a.h,function(a){return a.equals(d)})||Ta(a.h,d);
break;case "remoteDisconnected":d=new Hk(td(b.params.device)),Va(a.h,function(a){return a.equals(d)})}}
function Bo(a,b){var c=!1;if("loungeStatus"==b.action)c=!!Pa(a.h,function(a){return"LOUNGE_SCREEN"==a.type});
else if("loungeScreenConnected"==b.action)c=!0;else if("loungeScreenDisconnected"==b.action)c=!1;else return;if(!isNaN(a.K))if(c)po(a);else return;c==so(a)?c&&mo(a,1):c?(no(a),a.O()&&a.C.reset(),mo(a,1),ro(a,"getNowPlaying"),uo(a)):a.l(1)}
g.re=function(){if(this.j){var a=this.j;this.j=null;this.C.videoId!=a&&ro(this,"getNowPlaying")}};
Y.prototype.subscribe=Y.prototype.subscribe;Y.prototype.unsubscribeByKey=Y.prototype.oa;Y.prototype.ta=function(){var a=3;this.isDisposed()||(a=0,isNaN(this.B())?so(this)&&(a=1):a=2);return a};
Y.prototype.getProxyState=Y.prototype.ta;Y.prototype.l=function(a){this.H("Disconnecting with "+a);no(this);this.D("beforeDisconnect",a);1==a&&$k();$n(this.f,a);this.dispose()};
Y.prototype.disconnect=Y.prototype.l;Y.prototype.sa=function(){var a=this.C;if(this.j){var b=a=this.C.clone(),c=this.j,d=a.index,e=b.videoId;b.videoId=c;b.index=d;c!=e&&fo(b)}return jo(a)};
Y.prototype.getPlayerContextData=Y.prototype.sa;Y.prototype.Ma=function(a){var b=new co(a);b.videoId&&b.videoId!=this.C.videoId&&(this.j=b.videoId,I(this.F),this.F=H(v(this.re,this),5E3));var c=[];this.C.f==b.f&&this.C.videoId==b.videoId&&this.C.index==b.index&&ab(this.C.videoIds,b.videoIds)||c.push("remoteQueueChange");this.C.h==b.h&&this.C.volume==b.volume&&this.C.l==b.l&&ho(this.C)==ho(b)&&L(this.C.j)==L(b.j)||c.push("remotePlayerChange");this.C.reset(a);y(c,function(a){this.D(a)},this)};
Y.prototype.setPlayerContextData=Y.prototype.Ma;Y.prototype.qa=function(){return this.f.o.loungeIdToken};
Y.prototype.getLoungeToken=Y.prototype.qa;Y.prototype.O=function(){var a=this.f.o.id,b=Pa(this.h,function(b){return"REMOTE_CONTROL"==b.type&&b.id!=a});
return b?b.id:""};
Y.prototype.getOtherConnectedRemoteId=Y.prototype.O;Y.prototype.B=function(){var a=this.f;return a.h.enabled?a.h.l-w():NaN};
Y.prototype.getReconnectTimeout=Y.prototype.B;Y.prototype.Oa=function(){if(!isNaN(this.B())){var a=this.f.h;a.enabled&&(a.stop(),a.start(),a.A())}};
Y.prototype.reconnect=Y.prototype.Oa;function uo(a){I(a.J);a.J=H(v(a.l,a,1),864E5)}
function ro(a,b,c){c?a.H("Sending: action="+b+", params="+L(c)):a.H("Sending: action="+b);a.f.sendMessage(b,c)}
Y.prototype.ya=function(a,b){ro(this,a,b);uo(this)};
Y.prototype.sendMessage=Y.prototype.ya;function Co(a){V.call(this);this.l=0;this.ka=Do();this.$a=NaN;this.yb="";this.A=a;this.H("Initializing local screens: "+kk(this.ka));this.j=Eo();this.H("Initializing account screens: "+kk(this.j));this.Jb=null;this.f=[];this.h=[];Fo(this,rm()||[]);this.H("Initializing DIAL devices: "+rk(this.h));a=ik(Wk());Go(this,a);this.H("Initializing online screens: "+kk(this.f));this.l=w()+3E5;Ho(this)}
x(Co,V);var Io=[2E3,2E3,1E3,1E3,1E3,2E3,2E3,5E3,5E3,1E4];g=Co.prototype;g.H=function(a){Zj("RM",a)};
g.M=function(a){Zj("RM",a)};
function Eo(){var a=Do(),b=ik(Wk());return Ma(b,function(b){return!zk(a,b)})}
function Do(){var a=ik(Sk());return Ma(a,function(a){return!a.f})}
function Ho(a){vc("yt-remote-cast-device-list-update",function(){var a=rm();Fo(this,a||[])},a);
vc("yt-remote-cast-device-status-update",a.Ee,a);a.Mc();var b=w()>a.l?2E4:1E4;mc(v(a.Mc,a),b)}
g.D=function(a,b){if(this.isDisposed())return!1;this.H("Firing "+a);return this.o.D.apply(this.o,arguments)};
g.Mc=function(){var a=rm()||[];0==a.length||Fo(this,a);a=Jo(this);0==a.length||(Na(a,function(a){return!zk(this.j,a)},this)&&Uk()?Ko(this):Lo(this,a))};
function Mo(a,b){var c=Jo(a);return Ma(b,function(a){return a.f?(a=yk(this.h,a.f),!!a&&"RUNNING"==a.status):!!zk(c,a)},a)}
function Fo(a,b){var c=!1;y(b,function(a){var b=Ak(this.ka,a.id);b&&b.name!=a.name&&(this.H("Renaming screen id "+b.id+" from "+b.name+" to "+a.name),b.name=a.name,c=!0)},a);
c&&(a.H("Renaming due to DIAL."),No(a));Xk(vk(b));var d=!ab(a.h,b,xk);d&&a.H("Updating DIAL devices: "+rk(a.h)+" to "+rk(b));a.h=b;Go(a,a.f);d&&a.D("onlineReceiverChange")}
g.Ee=function(a){var b=yk(this.h,a.id);b&&(this.H("Updating DIAL device: "+b.id+"("+b.name+") from status: "+b.status+" to status: "+a.status+" and from activityId: "+b.f+" to activityId: "+a.f),b.f=a.f,b.status=a.status,Xk(vk(this.h)));Go(this,this.f)};
function Go(a,b,c){var d=Mo(a,b),e=!ab(a.f,d,fk);if(e||c)0==b.length||Vk(z(d,gk));e&&(a.H("Updating online screens: "+kk(a.f)+" -> "+kk(d)),a.f=d,a.D("onlineReceiverChange"))}
function Lo(a,b){var c=[],d={};y(b,function(a){a.token&&(d[a.token]=a,c.push(a.token))});
var e={method:"POST",R:{lounge_token:c.join(",")},context:a,ca:function(a,b){var c=[];y(b.screens||[],function(a){"online"==a.status&&c.push(d[a.loungeToken])});
var e=this.Jb?Oo(this,this.Jb):null;e&&!zk(c,e)&&c.push(e);Go(this,c,!0)}};
Td(nk(a.A,"/pairing/get_screen_availability"),e)}
function Ko(a){var b=Jo(a),c=z(b,function(a){return a.id});
0!=c.length&&(a.H("Updating lounge tokens for: "+L(c)),Td(nk(a.A,"/pairing/get_lounge_token_batch"),{R:{screen_ids:c.join(",")},method:"POST",context:a,ca:function(a,c){Po(this,c.screens||[]);this.ka=Ma(this.ka,function(a){return!!a.token});
No(this);Lo(this,b)}}))}
function Po(a,b){y(Wa(a.ka,a.j),function(a){var d=Pa(b,function(b){return a.id==b.screenId});
d&&(a.token=d.loungeToken)})}
function No(a){var b=Do();ab(a.ka,b,fk)||(a.H("Saving local screens: "+kk(b)+" to "+kk(a.ka)),Rk(z(a.ka,gk)),Go(a,a.f,!0),Fo(a,rm()||[]),a.D("managedScreenChange",Jo(a)))}
function Qo(a,b,c){var d=Qa(b,function(a){return ek(c,a)}),e=0>d;
0>d?b.push(c):b[d]=c;zk(a.f,c)||a.f.push(c);return e}
g.sc=function(a,b){for(var c=Jo(this),c=z(c,function(a){return a.name}),d=a,e=2;A(c,d);)d=b.call(m,e),e++;
return d};
g.Ic=function(a,b,c){var d=!1;b>=Io.length&&(this.H("Pairing DIAL device "+a+" with "+c+" timed out."),d=!0);var e=yk(this.h,a);if(!e)this.H("Pairing DIAL device "+a+" with "+c+" failed: no device for "+a),d=!0;else if("ERROR"==e.status||"STOPPED"==e.status)this.H("Pairing DIAL device "+a+" with "+c+" failed: launch error on "+a),d=!0;d?(Ro(this),this.D("screenPair",null)):Td(nk(this.A,"/pairing/get_screen"),{method:"POST",R:{pairing_code:c},context:this,ca:function(a,b){if(c==this.yb){Ro(this);var d=
new ck(b.screen);d.name=e.name;d.f=e.id;this.H("Pairing "+c+" succeeded.");var l=Qo(this,this.ka,d);this.H("Paired with "+(l?"a new":"an old")+" local screen:"+jk(d));No(this);this.D("screenPair",d)}},
onError:function(){c==this.yb&&(this.H("Polling pairing code: "+c),I(this.$a),this.$a=H(v(this.Ic,this,a,b+1,c),Io[b]))}})};
function So(a,b,c){var d=Z,e="";Ro(d);if(yk(d.h,a)){if(!e){var f=e=sk();km();var h=tm(a),k=hm();if(k&&h){var l=new cast.Receiver(h.id,h.name),l=new cast.LaunchRequest("YouTube",l);l.parameters="pairingCode="+f;l.description=new cast.LaunchDescription;l.description.text=document.title;b&&(l.parameters+="&v="+b,c&&(l.parameters+="&t="+Math.round(c)),l.description.url="http://i.ytimg.com/vi/"+b+"/default.jpg");"UNKNOWN"!=h.status&&(h.status="UNKNOWN",pm(h),J("yt-remote-cast-device-status-update",h));
fm("Sending a cast launch request with params: "+l.parameters);k.launch(l,pa(um,a))}else fm("No cast API or no cast device. Dropping cast launch.")}d.yb=e;d.$a=H(v(d.Ic,d,a,0,e),Io[0])}else d.H("No DIAL device with id: "+a)}
function Ro(a){I(a.$a);a.$a=NaN;a.yb=""}
function Oo(a,b){var c=Ak(Jo(a),b);a.H("Found screen: "+jk(c)+" with key: "+b);return c}
function To(a){var b=Z,c=Ak(b.f,a);b.H("Found online screen: "+jk(c)+" with key: "+a);return c}
function Uo(a){var b=Z,c=yk(b.h,a);if(!c){var d=Ak(b.ka,a);d&&(c=yk(b.h,d.f))}b.H("Found DIAL: "+(c?c.toString():"null")+" with key: "+a);return c}
function Jo(a){return Wa(a.j,Ma(a.ka,function(a){return!zk(this.j,a)},a))}
;function Vo(a){Bk.call(this,"ScreenServiceProxy");this.V=a;this.f=[];this.f.push(this.V.$_s("screenChange",v(this.Me,this)));this.f.push(this.V.$_s("onlineScreenChange",v(this.Ud,this)))}
x(Vo,Bk);g=Vo.prototype;g.$=function(a){return this.V.$_gs(a)};
g.contains=function(a){return!!this.V.$_c(a)};
g.get=function(a){return this.V.$_g(a)};
g.start=function(){this.V.$_st()};
g.Fb=function(a,b,c){this.V.$_a(a,b,c)};
g.remove=function(a,b,c){this.V.$_r(a,b,c)};
g.Cb=function(a,b,c,d){this.V.$_un(a,b,c,d)};
g.G=function(){for(var a=0,b=this.f.length;a<b;++a)this.V.$_ubk(this.f[a]);this.f.length=0;this.V=null;Vo.I.G.call(this)};
g.Me=function(){this.D("screenChange")};
g.Ud=function(){this.D("onlineScreenChange")};
W.prototype.$_st=W.prototype.start;W.prototype.$_gspc=W.prototype.Ne;W.prototype.$_gsppc=W.prototype.Vc;W.prototype.$_c=W.prototype.contains;W.prototype.$_g=W.prototype.get;W.prototype.$_a=W.prototype.Fb;W.prototype.$_un=W.prototype.Cb;W.prototype.$_r=W.prototype.remove;W.prototype.$_gs=W.prototype.$;W.prototype.$_gos=W.prototype.Uc;W.prototype.$_s=W.prototype.subscribe;W.prototype.$_ubk=W.prototype.oa;function Wo(){var a=!!F("MDX_ENABLE_CASTV2"),b=!!F("MDX_ENABLE_QUEUE"),c={device:"Desktop",app:"youtube-desktop"};a?q("yt.mdx.remote.castv2_",!0,void 0):km();rj&&qj();Jk();Xo||(Xo=new mk,al()&&(Xo.f="/api/loungedev"));Z||a||(Z=new Co(Xo),Z.subscribe("screenPair",Yo),Z.subscribe("managedScreenChange",Zo),Z.subscribe("onlineReceiverChange",function(){J("yt-remote-receiver-availability-change")}));
$o||($o=r("yt.mdx.remote.deferredProxies_")||[],q("yt.mdx.remote.deferredProxies_",$o,void 0));ap(b);b=bp();if(a&&!b){var d=new W(Xo);q("yt.mdx.remote.screenService_",d,void 0);b=bp();Kl(d,function(a){a?cp()&&cm(cp(),"YouTube TV"):d.subscribe("onlineScreenChange",function(){J("yt-remote-receiver-availability-change")})},!(!c||!c.loadCastApiSetupScript))}if(c&&!r("yt.mdx.remote.initialized_")){q("yt.mdx.remote.initialized_",!0,void 0);
dp("Initializing: "+L(c));ep.push(vc("yt-remote-cast2-availability-change",function(){J("yt-remote-receiver-availability-change")}));
ep.push(vc("yt-remote-cast2-receiver-selected",function(){fp(null);J("yt-remote-auto-connect","cast-selector-receiver")}));
ep.push(vc("yt-remote-cast2-session-change",gp));ep.push(vc("yt-remote-connection-change",function(a){a?cm(cp(),"YouTube TV"):hp()||(cm(null,null),Zl())}));
var e=ip();c.isAuto&&(e.id+="#dial");e.name=c.device;e.app=c.app;dp(" -- with channel params: "+L(e));kp(e);a&&b.start();cp()||lp()}}
function mp(){xc(ep);ep.length=0;ec(np);np=null;$o&&(y($o,function(a){a(null)}),$o.length=0,$o=null,q("yt.mdx.remote.deferredProxies_",null,void 0));
Z&&(ec(Z),Z=null);Xo=null;om()}
function op(){if(pp()&&Xl()){var a=[];if(U("yt-remote-cast-available")||r("yt.mdx.remote.cloudview.castButtonShown_")||qp())a.push({key:"cast-selector-receiver",name:rp()}),q("yt.mdx.remote.cloudview.castButtonShown_",!0,void 0);return a}return r("yt.mdx.remote.cloudview.initializing_")?[]:sp()}
function sp(){var a=[],a=tp()?bp().V.$_gos():ik(Wk()),b=up();b&&qp()&&(zk(a,b)||a.push(b));tp()||(b=wk(Yk()),b=Ma(b,function(b){return!Ak(a,b.id)}),a=Wa(a,b));
return uk(a)}
function vp(){if(pp()&&Xl()){var a=Yl();return a?{key:"cast-selector-receiver",name:a}:null}return wp()}
function wp(){var a=sp(),b=xp(),c=up();c||(c=hp());return Pa(a,function(a){return c&&dk(c,a.key)||b&&(a=Uo(a.key))&&a.id==b?!0:!1})}
function rp(){if(pp()&&Xl())return Yl();var a=up();return a?a.name:null}
function up(){var a=cp();if(!a)return null;if(!Z){var b=bp().$();return Ak(b,a)}return Oo(Z,a)}
function gp(a){dp("remote.onCastSessionChange_: "+jk(a));if(a){var b=up();b&&b.id==a.id?cm(b.id,"YouTube TV"):(b&&yp(),zp(a,1))}else yp()}
function Ap(a,b){dp("Connecting to: "+L(a));if("cast-selector-receiver"==a.key)fp(b||null),bm(b||null);else{yp();fp(b||null);var c=null;Z?c=To(a.key):(c=bp().$(),c=Ak(c,a.key));if(c)zp(c,1);else{if(Z&&(c=Uo(a.key))){Bp(c);return}H(function(){Cp(null)},0)}}}
function yp(){Z&&Ro(Z);a:{var a=qp();if(a&&(a=a.getOtherConnectedRemoteId())){dp("Do not stop DIAL due to "+a);Dp("");break a}(a=xp())?(dp("Stopping DIAL: "+a),vm(a),Dp("")):(a=up())&&a.f&&(dp("Stopping DIAL: "+a.f),vm(a.f))}am()?Tl().stopSession():Ql("stopSession called before API ready.");(a=qp())?a.disconnect(1):(yc("yt-remote-before-disconnect",1),yc("yt-remote-connection-change",!1));Cp(null)}
function dp(a){Zj("remote",a)}
function pp(){return!!r("yt.mdx.remote.castv2_")}
function tp(){return r("yt.mdx.remote.screenService_")}
function bp(){if(!np){var a=tp();np=a?new Vo(a):null}return np}
function cp(){return r("yt.mdx.remote.currentScreenId_")}
function Ep(a){q("yt.mdx.remote.currentScreenId_",a,void 0);if(Z){var b=Z;b.l=w()+3E5;if((b.Jb=a)&&(a=Oo(b,a))&&!zk(b.f,a)){var c=Xa(b.f);c.push(a);Go(b,c,!0)}}}
function xp(){return r("yt.mdx.remote.currentDialId_")}
function Dp(a){q("yt.mdx.remote.currentDialId_",a,void 0)}
function Fp(){return r("yt.mdx.remote.connectData_")}
function fp(a){q("yt.mdx.remote.connectData_",a,void 0)}
function qp(){return r("yt.mdx.remote.connection_")}
function Cp(a){var b=qp();fp(null);a?Ka(!qp()):(Ep(""),Dp(""));q("yt.mdx.remote.connection_",a,void 0);$o&&(y($o,function(b){b(a)}),$o.length=0);
b&&!a?yc("yt-remote-connection-change",!1):!b&&a&&J("yt-remote-connection-change",!0)}
function hp(){var a=Mk();if(!a)return null;if(tp()){var b=bp().$();return Ak(b,a)}return Z?Oo(Z,a):null}
function zp(a,b){Ka(!cp());Ep(a.id);var c=new Y(Xo,a,ip());c.connect(b,Fp());c.subscribe("beforeDisconnect",function(a){yc("yt-remote-before-disconnect",a)});
c.subscribe("beforeDispose",function(){qp()&&(qp(),Cp(null))});
Cp(c)}
function Bp(a){xp();dp("Connecting to: "+(a?a.toString():"null"));Dp(a.id);var b=Fp();b?So(a.id,b.videoIds[b.index],b.currentTime):So(a.id)}
function lp(){var a=hp();a?(dp("Resume connection to: "+jk(a)),zp(a,0)):($k(),Zl(),dp("Skipping connecting because no session screen found."))}
function Yo(a){dp("Paired with: "+jk(a));a?zp(a,1):Cp(null)}
function Zo(){var a=cp();a&&!up()&&(dp("Dropping current screen with id: "+a),yp());hp()||$k()}
var Xo=null,$o=null,np=null,Z=null;function ap(a){var b=ip();if(pb(b)){var b=Lk(),c=U("yt-remote-session-name")||"",d=U("yt-remote-session-app")||"",b={device:"REMOTE_CONTROL",id:b,name:c,app:d};a&&(b["mdx-version"]=3);q("yt.mdx.remote.channelParams_",b,void 0)}}
function ip(){return r("yt.mdx.remote.channelParams_")||{}}
function kp(a){a?(T("yt-remote-session-app",a.app),T("yt-remote-session-name",a.name)):(tj("yt-remote-session-app"),tj("yt-remote-session-name"));q("yt.mdx.remote.channelParams_",a,void 0)}
var ep=[];var Gp=null,Hp=[];function Ip(){Jp();if(vp()){var a=Gp;"html5"!=a.getPlayerType()&&a.loadNewVideoConfig(a.getCurrentVideoConfig(),"html5")}}
function Kp(a){"cast-selector-receiver"==a?$l():Lp(a)}
function Lp(a){var b=op();if(a=tk(b,a)){var c=Gp,d=c.getVideoData().video_id,e=c.getVideoData().list,f=c.getCurrentTime();Ap(a,{videoIds:[d],listId:e,videoId:d,index:0,currentTime:f});"html5"!=c.getPlayerType()?c.loadNewVideoConfig(c.getCurrentVideoConfig(),"html5"):c.updateRemoteReceivers&&c.updateRemoteReceivers(b,a)}}
function Jp(){var a=Gp;a&&a.updateRemoteReceivers&&a.updateRemoteReceivers(op(),vp())}
;var Mp=null,Np=[];function Op(a){return{externalChannelId:a.externalChannelId,Hd:!!a.isChannelPaid,source:a.source,subscriptionId:a.subscriptionId}}
function Pp(a){Qp(Op(a))}
function Qp(a){Fi()?(Q(si,new mi(a.externalChannelId,a.Hd?{itemType:"U",itemId:a.externalChannelId}:null)),(a="/gen_204?"+Id({event:"subscribe",source:a.source}))&&hh(a)):Rp(a)}
function Rp(a){Ei(function(b){b.subscription_ajax&&Qp(a)},null)}
function Sp(a){a=Op(a);Q(xi,new oi(a.externalChannelId,a.subscriptionId,null));(a="/gen_204?"+Id({event:"unsubscribe",source:a.source}))&&hh(a)}
function Tp(a){Mp&&Mp.channelSubscribed(a.f,a.subscriptionId)}
function Up(a){Mp&&Mp.channelUnsubscribed(a.f)}
;function Vp(a){D.call(this);this.h=a;this.h.subscribe("command",this.Lc,this);this.j={};this.o=!1}
x(Vp,D);g=Vp.prototype;g.start=function(){this.o||this.isDisposed()||(this.o=!0,Wp(this.h,"RECEIVING"))};
g.Lc=function(a,b){if(this.o&&!this.isDisposed()){var c=b||{};switch(a){case "addEventListener":if(u(c.event)&&(c=c.event,!(c in this.j))){var d=v(this.te,this,c);this.j[c]=d;this.addEventListener(c,d)}break;case "removeEventListener":u(c.event)&&Xp(this,c.event);break;default:this.f.isReady()&&this.f[a]&&(c=Yp(a,b||{}),c=this.f[a].apply(this.f,c),(c=Zp(a,c))&&this.o&&!this.isDisposed()&&Wp(this.h,a,c))}}};
g.te=function(a,b){this.o&&!this.isDisposed()&&Wp(this.h,a,this.Lb(a,b))};
g.Lb=function(a,b){if(null!=b)return{value:b}};
function Xp(a,b){b in a.j&&(a.removeEventListener(b,a.j[b]),delete a.j[b])}
g.G=function(){this.h.unsubscribe("command",this.Lc,this);this.h=null;for(var a in this.j)Xp(this,a);Vp.I.G.call(this)};function $p(a,b){Vp.call(this,b);this.f=a;this.start()}
x($p,Vp);$p.prototype.addEventListener=function(a,b){this.f.addEventListener(a,b)};
$p.prototype.removeEventListener=function(a,b){this.f.removeEventListener(a,b)};
function Yp(a,b){switch(a){case "loadVideoById":return b=yj(b),Aj(b),[b];case "cueVideoById":return b=yj(b),Aj(b),[b];case "loadVideoByPlayerVars":return Aj(b),[b];case "cueVideoByPlayerVars":return Aj(b),[b];case "loadPlaylist":return b=zj(b),Aj(b),[b];case "cuePlaylist":return b=zj(b),Aj(b),[b];case "seekTo":return[b.seconds,b.allowSeekAhead];case "playVideoAt":return[b.index];case "setVolume":return[b.volume];case "setPlaybackQuality":return[b.suggestedQuality];case "setPlaybackRate":return[b.suggestedRate];
case "setLoop":return[b.loopPlaylists];case "setShuffle":return[b.shufflePlaylist];case "getOptions":return[b.module];case "getOption":return[b.module,b.option];case "setOption":return[b.module,b.option,b.value];case "handleGlobalKeyDown":return[b.keyCode,b.shiftKey]}return[]}
function Zp(a,b){switch(a){case "isMuted":return{muted:b};case "getVolume":return{volume:b};case "getPlaybackRate":return{playbackRate:b};case "getAvailablePlaybackRates":return{availablePlaybackRates:b};case "getVideoLoadedFraction":return{videoLoadedFraction:b};case "getPlayerState":return{playerState:b};case "getCurrentTime":return{currentTime:b};case "getPlaybackQuality":return{playbackQuality:b};case "getAvailableQualityLevels":return{availableQualityLevels:b};case "getDuration":return{duration:b};
case "getVideoUrl":return{videoUrl:b};case "getVideoEmbedCode":return{videoEmbedCode:b};case "getPlaylist":return{playlist:b};case "getPlaylistIndex":return{playlistIndex:b};case "getOptions":return{options:b};case "getOption":return{option:b}}}
$p.prototype.Lb=function(a,b){switch(a){case "onReady":return;case "onStateChange":return{playerState:b};case "onPlaybackQualityChange":return{playbackQuality:b};case "onPlaybackRateChange":return{playbackRate:b};case "onError":return{errorCode:b}}return $p.I.Lb.call(this,a,b)};
$p.prototype.G=function(){$p.I.G.call(this);delete this.f};function aq(){var a=this.h=new bj,b=v(this.pe,this);a.h=b;a.j=null;this.o=[];this.B=!1;this.l=(a=F("POST_MESSAGE_ORIGIN",void 0))&&ch(a)?a:null;this.A={}}
g=aq.prototype;g.pe=function(a,b){if(this.l&&this.l!=this.h.origin)this.dispose();else if("addEventListener"==a&&b){var c=b[0];this.A[c]||"onReady"==c||(this.addEventListener(c,bq(this,c)),this.A[c]=!0)}else this.Yc(a,b)};
g.Yc=function(){};
function bq(a,b){return v(function(a){this.sendMessage(b,a)},a)}
g.addEventListener=function(){};
g.vd=function(){this.B=!0;this.sendMessage("initialDelivery",this.Mb());this.sendMessage("onReady");y(this.o,this.Zc,this);this.o=[]};
g.Mb=function(){return null};
function cq(a,b){a.sendMessage("infoDelivery",b)}
g.Zc=function(a){this.B?this.h.sendMessage(a):this.o.push(a)};
g.sendMessage=function(a,b){this.Zc({event:a,info:void 0==b?null:b})};
g.dispose=function(){this.h=null};function dq(a){aq.call(this);this.f=a;this.j=[];this.addEventListener("onReady",v(this.Zd,this));this.addEventListener("onVideoProgress",v(this.xe,this));this.addEventListener("onVolumeChange",v(this.ye,this));this.addEventListener("onApiChange",v(this.se,this));this.addEventListener("onPlaybackQualityChange",v(this.ue,this));this.addEventListener("onPlaybackRateChange",v(this.ve,this));this.addEventListener("onStateChange",v(this.we,this))}
x(dq,aq);g=dq.prototype;g.Yc=function(a,b){if(this.f[a]){b=b||[];if(0<b.length&&wj(a)){var c;c=b;if(ia(c[0])&&!ea(c[0]))c=c[0];else{var d={};switch(a){case "loadVideoById":case "cueVideoById":d=yj.apply(window,c);break;case "loadVideoByUrl":case "cueVideoByUrl":d=xj.apply(window,c);break;case "loadPlaylist":case "cuePlaylist":d=zj.apply(window,c)}c=d}Aj(c);b.length=1;b[0]=c}this.f[a].apply(this.f,b);wj(a)&&cq(this,this.Mb())}};
g.Zd=function(){var a=v(this.vd,this);this.h.f=a};
g.addEventListener=function(a,b){this.j.push({sd:a,listener:b});this.f.addEventListener(a,b)};
g.Mb=function(){if(!this.f)return null;var a=this.f.getApiInterface();Ua(a,"getVideoData");for(var b={apiInterface:a},c=0,d=a.length;c<d;c++){var e=a[c],f=e;if(0==f.search("get")||0==f.search("is")){var f=e,h=0;0==f.search("get")?h=3:0==f.search("is")&&(h=2);f=f.charAt(h).toLowerCase()+f.substr(h+1);try{var k=this.f[e]();b[f]=k}catch(l){}}}b.videoData=this.f.getVideoData();return b};
g.we=function(a){a={playerState:a,currentTime:this.f.getCurrentTime(),duration:this.f.getDuration(),videoData:this.f.getVideoData(),videoStartBytes:0,videoBytesTotal:this.f.getVideoBytesTotal(),videoLoadedFraction:this.f.getVideoLoadedFraction(),playbackQuality:this.f.getPlaybackQuality(),availableQualityLevels:this.f.getAvailableQualityLevels(),videoUrl:this.f.getVideoUrl(),playlist:this.f.getPlaylist(),playlistIndex:this.f.getPlaylistIndex()};this.f.getProgressState&&(a.progressState=this.f.getProgressState());
this.f.getStoryboardFormat&&(a.storyboardFormat=this.f.getStoryboardFormat());cq(this,a)};
g.ue=function(a){cq(this,{playbackQuality:a})};
g.ve=function(a){cq(this,{playbackRate:a})};
g.se=function(){for(var a=this.f.getOptions(),b={namespaces:a},c=0,d=a.length;c<d;c++){var e=a[c],f=this.f.getOptions(e);b[e]={options:f};for(var h=0,k=f.length;h<k;h++){var l=f[h],n=this.f.getOption(e,l);b[e][l]=n}}this.sendMessage("apiInfoDelivery",b)};
g.ye=function(){cq(this,{muted:this.f.isMuted(),volume:this.f.getVolume()})};
g.xe=function(a){a={currentTime:a,videoBytesLoaded:this.f.getVideoBytesLoaded(),videoLoadedFraction:this.f.getVideoLoadedFraction()};this.f.getProgressState&&(a.progressState=this.f.getProgressState());cq(this,a)};
g.dispose=function(){dq.I.dispose.call(this);for(var a=0;a<this.j.length;a++){var b=this.j[a];this.f.removeEventListener(b.sd,b.listener)}this.j=[]};function eq(a,b,c){V.call(this);this.f=a;this.h=b;this.j=c}
x(eq,V);function Wp(a,b,c){if(!a.isDisposed()){var d=a.f,e=a.h;a=a.j;d.isDisposed()||e!=d.f||(b={id:a,command:b},c&&(b.data=c),d.f.postMessage(L(b),d.j))}}
eq.prototype.G=function(){this.h=this.f=null;eq.I.G.call(this)};function fq(a,b,c){D.call(this);this.f=a;this.j=c;this.o=M(window,"message",v(this.l,this));this.h=new eq(this,a,b);dc(this,pa(ec,this.h))}
x(fq,D);fq.prototype.l=function(a){var b;if(b=!this.isDisposed())if(b=a.origin==this.j)a:{b=this.f;do{var c;b:{c=a.source;do{if(c==b){c=!0;break b}if(c==c.parent)break;c=c.parent}while(null!=c);c=!1}if(c){b=!0;break a}b=b.opener}while(null!=b);b=!1}if(b&&(c=a.data,u(c))){try{c=td(c)}catch(d){return}c.command&&(a=this.h,b=c.command,c=c.data,a.isDisposed()||a.D("command",b,c))}};
fq.prototype.G=function(){Pe(this.o);this.f=null;fq.I.G.call(this)};var gq=!1;function hq(a){if(a=a.match(/[\d]+/g))a.length=3,a.join(".")}
(function(){if(navigator.plugins&&navigator.plugins.length){var a=navigator.plugins["Shockwave Flash"];if(a&&(gq=!0,a.description)){hq(a.description);return}if(navigator.plugins["Shockwave Flash 2.0"]){gq=!0;return}}if(navigator.mimeTypes&&navigator.mimeTypes.length&&(gq=(a=navigator.mimeTypes["application/x-shockwave-flash"])&&a.enabledPlugin)){hq(a.enabledPlugin.description);return}try{var b=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");gq=!0;hq(b.GetVariable("$version"));return}catch(c){}try{b=
new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");gq=!0;return}catch(c){}try{b=new ActiveXObject("ShockwaveFlash.ShockwaveFlash"),gq=!0,hq(b.GetVariable("$version"))}catch(c){}})();function iq(a){return(a=a.exec(wb))?a[1]:""}
(function(){if(Uf)return iq(/Firefox\/([0-9.]+)/);if(K||hd||gd)return od;if(Yf)return iq(/Chrome\/([0-9.]+)/);if(Zf&&!(fd()||B("iPad")||B("iPod")))return iq(/Version\/([0-9.]+)/);if(Vf||Wf){var a;if(a=/Version\/(\S+).*Mobile\/(\S+)/.exec(wb))return a[1]+"."+a[2]}else if(Xf)return(a=iq(/Android\s+([0-9.]+)/))?a:iq(/Version\/([0-9.]+)/);return""})();function jq(a){if(a=a.responseText)kq=(a=a.match(/{"id": "(.*)"}/))&&a[1]?a[1]:"",q("yt.www.ads.data.encryptedBiscottiId",kq,void 0)}
var kq="";function lq(a){for(var b=0;b<a.length;b++){var c=a[b];"send_follow_on_ping_action"==c.name&&c.data&&c.data.follow_on_url&&(c=c.data.follow_on_url)&&hh(c)}}
;function mq(a){O.call(this,1,arguments)}
x(mq,O);function nq(a,b){O.call(this,2,arguments);this.h=a;this.f=b}
x(nq,O);function oq(a,b,c,d){O.call(this,1,arguments);this.f=b;this.j=c||null;this.h=d||null}
x(oq,O);function pq(a,b){O.call(this,1,arguments);this.h=a;this.f=b||null}
x(pq,O);function qq(a){O.call(this,1,arguments)}
x(qq,O);var rq=new P("ypc-core-load",mq),sq=new P("ypc-guide-sync-success",nq),tq=new P("ypc-purchase-success",oq),uq=new P("ypc-subscription-cancel",qq),vq=new P("ypc-subscription-cancel-success",pq),wq=new P("ypc-init-subscription",qq);var xq=!1,yq=[],zq=[];function Aq(a){a.f?xq?Q(wi,a):Q(rq,new mq(function(){Q(wq,new qq(a.f))})):Bq(a.h,a.o,a.j,a.source)}
function Cq(a){a.f?xq?Q(Bi,a):Q(rq,new mq(function(){Q(uq,new qq(a.f))})):Dq(a.h,a.subscriptionId,a.o,a.j,a.source)}
function Eq(a){Fq(Xa(a.f))}
function Gq(a){Hq(Xa(a.f))}
function Iq(a){Jq(a.f,a.isEnabled,null)}
function Kq(a,b,c,d){Jq(a,b,c,d)}
function Lq(a){var b=a.h,c=a.f.subscriptionId;b&&c&&Q(vi,new ni(b,c,a.f.channelInfo))}
function Mq(a){var b=a.f;db(a.h,function(a,d){Q(vi,new ni(d,a,b[d]))})}
function Nq(a){Q(Ai,new ki(a.h.itemId));a.f&&a.f.length&&(Oq(a.f,Ai),Oq(a.f,Ci))}
function Bq(a,b,c,d){var e=new ki(a);Q(ti,e);var f={};f.c=a;c&&(f.eurl=c);d&&(f.source=d);c={};(d=F("PLAYBACK_ID"))&&(c.plid=d);(d=F("EVENT_ID"))&&(c.ei=d);b&&Pq(b,c);Td("/subscription_ajax?action_create_subscription_to_channel=1",{method:"POST",ac:f,R:c,ca:function(b,c){var d=c.response;Q(vi,new ni(a,d.id,d.channel_info));d.show_feed_privacy_dialog&&J("SHOW-FEED-PRIVACY-SUBSCRIBE-DIALOG",a);d.actions&&lq(d.actions)},
Wb:function(){Q(ui,e)}})}
function Dq(a,b,c,d,e){var f=new ki(a);Q(yi,f);var h={};d&&(h.eurl=d);e&&(h.source=e);d={};d.c=a;d.s=b;(a=F("PLAYBACK_ID"))&&(d.plid=a);(a=F("EVENT_ID"))&&(d.ei=a);c&&Pq(c,d);Td("/subscription_ajax?action_remove_subscriptions=1",{method:"POST",ac:h,R:d,ca:function(a,b){var c=b.response;Q(Ai,f);c.actions&&lq(c.actions)},
Wb:function(){Q(zi,f)}})}
function Jq(a,b,c,d){if(null!==b||null!==c){var e={};a&&(e.channel_id=a);null===b||(e.email_on_upload=b);null===c||(e.receive_no_updates=c);Td("/subscription_ajax?action_update_subscription_preferences=1",{method:"POST",R:e,onError:function(){d&&d()}})}}
function Fq(a){if(a.length){var b=Za(a,0,40);Q("subscription-batch-subscribe-loading");Oq(b,ti);var c={};c.a=b.join(",");var d=function(){Q("subscription-batch-subscribe-loaded");Oq(b,ui)};
Td("/subscription_ajax?action_create_subscription_to_all=1",{method:"POST",R:c,ca:function(c,f){d();var h=f.response,k=h.id;if(ea(k)&&k.length==b.length){var l=h.channel_info_map;y(k,function(a,c){var d=b[c];Q(vi,new ni(d,a,l[d]))});
a.length?Fq(a):Q("subscription-batch-subscribe-finished")}},
onError:function(){d();Q("subscription-batch-subscribe-failure")}})}}
function Hq(a){if(a.length){var b=Za(a,0,40);Q("subscription-batch-unsubscribe-loading");Oq(b,yi);var c={};c.c=b.join(",");var d=function(){Q("subscription-batch-unsubscribe-loaded");Oq(b,zi)};
Td("/subscription_ajax?action_remove_subscriptions=1",{method:"POST",R:c,ca:function(){d();Oq(b,Ai);a.length&&Hq(a)},
onError:function(){d()}})}}
function Oq(a,b){y(a,function(a){Q(b,new ki(a))})}
function Pq(a,b){var c=Ld(a),d;for(d in c)b[d]=c[d]}
;var Qq,Rq=null,Sq=null,Tq=null,Uq=!1;
function Vq(){var a=F("PLAYER_CONFIG",void 0),b=F("REVERSE_MOBIUS_PERCENT",void 0);if(Bg&&100*Math.random()<b)try{Td("//googleads.g.doubleclick.net/pagead/id",{format:"RAW",method:"GET",ca:jq,withCredentials:!0})}catch(e){}if(F("REQUEST_POST_MESSAGE_ORIGIN")){if(!Qq){Qq=new bj;Qq.f=Vq;return}Qq.origin&&"*"!=Qq.origin&&(a.args.post_message_origin=Qq.origin)}var c=document.referrer,b=F("POST_MESSAGE_ORIGIN"),d=!1;u(c)&&u(b)&&-1<c.indexOf(b)&&ch(b)&&ch(c)&&(d=!0);window!=window.top&&c&&c!=document.URL&&
(a.args.loaderUrl=c);F("LIGHTWEIGHT_AUTOPLAY")&&(a.args.autoplay="1");a.args.autoplay&&Aj(a.args);Rq=Yh("player",a);c=F("POST_MESSAGE_ID","player");F("ENABLE_JS_API")?Tq=new dq(Rq):F("ENABLE_POST_API")&&u(c)&&u(b)&&(Sq=new fq(window.parent,c,b),Tq=new $p(Rq,Sq.h));(Uq=d&&!F("ENABLE_CAST_API"))?a.args.disableCast="1":(a=Rq,Wo(),Gp=a,Gp.addEventListener("onReady",Ip),Gp.addEventListener("onRemoteReceiverSelected",Kp),Hp.push(vc("yt-remote-receiver-availability-change",Jp)),Hp.push(vc("yt-remote-auto-connect",
Lp)));F("BG_P")&&(F("BG_I")||F("BG_IU"))&&Kc();de();Mp=Rq;Mp.addEventListener("SUBSCRIBE",Pp);Mp.addEventListener("UNSUBSCRIBE",Sp);Np.push(ph(vi,Tp),ph(Ai,Up))}
;q("yt.setConfig",jc,void 0);q("yt.setMsg",function(a){kc(ic,arguments)},void 0);
q("yt.logging.errors.log",function(a,b,c,d){if(a&&window&&window.yterr&&!(5<=Zd)){var e=a.stacktrace,f=a.columnNumber;var h=r("window.location.href");if(u(a))a={message:a,name:"Unknown error",lineNumber:"Not available",fileName:h,stack:"Not available"};else{var k,l,n=!1;try{k=a.lineNumber||a.line||"Not available"}catch(G){k="Not available",n=!0}try{l=a.fileName||a.filename||a.sourceURL||m.$googDebugFname||h}catch(G){l="Not available",n=!0}a=!n&&a.lineNumber&&a.fileName&&a.stack&&a.message&&a.name?
a:{message:a.message||"Not available",name:a.name||"UnknownError",lineNumber:k,fileName:l,stack:a.stack||"Not available"}}e=e||a.stack;d=d||F("INNERTUBE_CONTEXT_CLIENT_VERSION",void 0);k=a.lineNumber.toString();isNaN(k)||isNaN(f)||(k=k+":"+f);Yd[a.message]||0<=e.indexOf("/YouTubeCenter.js")||0<=e.indexOf("/mytube.js")||(b={ac:{a:"logerror",t:"jserror",type:a.name,msg:a.message.substr(0,1E3),line:k,level:b||"ERROR"},R:{url:F("PAGE_NAME",window.location.href),file:a.fileName,"client.name":c||"WEB"},
method:"POST"},e&&(b.R.stack=e),d&&(b.R["client.version"]=d),Td("/error_204",b),Yd[a.message]=!0,Zd++)}},void 0);
q("writeEmbed",Vq,void 0);q("yt.www.watch.ads.restrictioncookie.spr",function(a){(a=a+"mac_204?action_fcts=1")&&hh(a);return!0},void 0);
var Wq=lc(function(){vh("ol");xq=!0;zq.push(ph(si,Aq),ph(xi,Cq));xq||(zq.push(ph(wi,Aq),ph(Bi,Cq),ph(pi,Eq),ph(qi,Gq),ph(ri,Iq)),yq.push(vc("subscription-prefs",Kq)),zq.push(ph(tq,Lq),ph(vq,Nq),ph(sq,Mq)));$f.getInstance();var a=1<window.devicePixelRatio;if(eg(0,119)!=a){var b="f"+(Math.floor(119/31)+1),c=dg(b)||0,c=a?c|67108864:c&-67108865;0==c?delete ag[b]:(a=c.toString(16),ag[b]=a.toString());var d,b=[];for(d in ag)b.push(d+"="+escape(ag[d]));d=b.join("&");Ze("PREF",d,63072E3)}}),Xq=lc(function(){var a=
Rq;
a&&a.sendAbandonmentPing&&a.sendAbandonmentPing();F("PL_ATT")&&(Jc=null);for(var a=0,b=be.length;a<b;a++){var c=be[a],d=r("yt.scheduler.instance.cancelJob");d?d(c):I(c)}be.length=0;a=Fc("//static.doubleclick.net/instream/ad_status.js");if(b=document.getElementById(a))Ac(a),b.parentNode.removeChild(b);ce=!1;jc("DCLKSTAT",0);xc(yq);yq.length=0;qh(zq);zq.length=0;xq=!1;Mp&&(Mp.removeEventListener("SUBSCRIBE",Qp),Mp.removeEventListener("UNSUBSCRIBE",Sp));Mp=null;qh(Np);Np.length=0;Uq||(xc(Hp),Hp.length=
0,Gp&&(Gp.removeEventListener("onRemoteReceiverSelected",Kp),Gp.removeEventListener("onReady",Ip),Gp=null),mp());fc(Tq,Sq);Rq&&Rq.destroy()});
window.addEventListener?(window.addEventListener("load",Wq),window.addEventListener("unload",Xq)):window.attachEvent&&(window.attachEvent("onload",Wq),window.attachEvent("onunload",Xq));var Yq=Wi.getInstance(),Zq=S(Yq);Zq in aj||(Yq.register(),Yq.Kc.push(vc("yt-uix-init-"+Zq,Yq.init,Yq)),Yq.Kc.push(vc("yt-uix-dispose-"+Zq,Yq.dispose,Yq)),aj[Zq]=Yq);})();
