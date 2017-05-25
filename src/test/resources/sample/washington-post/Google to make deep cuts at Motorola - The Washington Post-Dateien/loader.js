(function(e,t,n){function k(e){return!e||e=="loaded"||e=="complete"||e=="uninitialized"}function L(e,n,r,o,u,a){var l=t.createElement("script"),c,h;o=o||C.errorTimeout,l.src=e;for(h in r)l.setAttribute(h,r[h]);n=a?O:n||f,l.onreadystatechange=l.onload=function(){!c&&k(l.readyState)&&(c=1,n(),l.onload=l.onreadystatechange=null)},i(function(){c||(c=1,n(1))},o),E(),u?l.onload():s.parentNode.insertBefore(l,s)}function A(e,n,r,o,u,a){var l=t.createElement("link"),c,h;o=o||C.errorTimeout,n=a?O:n||f,l.href=e,l.rel="stylesheet",l.type="text/css";for(h in r)l.setAttribute(h,r[h]);u||(E(),s.parentNode.insertBefore(l,s),i(n,0))}function O(){var e=u.shift();a=1,e?e.t?i(function(){(e["t"]=="c"?C.injectCss:C.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),O()):a=0}function M(e,n,r,o,f,l,h){function g(t){if(!d&&k(p.readyState)){m.r=d=1,!a&&O();if(t){e!="img"&&i(function(){p.parentNode&&p.parentNode.removeChild(p)},50);for(var r in x[n])x[n].hasOwnProperty(r)&&x[n][r].onload();p.onload=p.onreadystatechange=null}}}h=h||C.errorTimeout;var p=t.createElement(e),d=0,v=0,m={t:r,s:n,e:f,a:l,x:h};x[n]===1&&(v=1,x[n]=[]),e=="object"?(p.data=n,p.setAttribute("type","text/css")):(p.src=n,p.type=e),p.width=p.height="0",p.onerror=p.onload=p.onreadystatechange=function(){g.call(this,v)},u.splice(o,0,m),e!="img"&&(v||x[n]===2?(E(),s.parentNode.insertBefore(p,c?null:s),i(g,h)):x[n].push(p))}function _(e,t,n,r,i){return a=0,t=t||"j",b(e)?M(t=="c"?m:v,e,t,this.i++,n,r,i):(u.splice(this.i++,0,e),u.length==1&&O()),this}function D(){var e=C;return e.loader={load:_,i:0},e}var r=t.documentElement,i=e.setTimeout,s=t.getElementsByTagName("script")[0],o={}.toString,u=[],a=0,f=function(){},l="MozAppearance"in r.style,c=l&&!!t.createRange().compareNode,h=e.opera&&o.call(e.opera)=="[object Opera]",p=!!t.attachEvent&&!h,d="webkitAppearance"in r.style&&!("async"in t.createElement("script")),v=l?"object":p||d?"script":"img",m=p?"script":d?"img":v,g=Array.isArray||function(e){return o.call(e)=="[object Array]"},y=function(e){return Object(e)===e},b=function(e){return typeof e=="string"},w=function(e){return o.call(e)=="[object Function]"},E=function(){if(!s||!s.parentNode)s=t.getElementsByTagName("script")[0]},S=[],x={},T={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}},N,C;C=function(e){function s(e){var t=e.split("!"),n=S.length,r=t.pop(),i=t.length,s={url:r,origUrl:r,prefixes:t},o,u,a;for(u=0;u<i;u++)a=t[u].split("="),o=T[a.shift()],o&&(s=o(s,a));for(u=0;u<n;u++)s=S[u](s);return s}function o(e){var t=e.split("?")[0];return t.substr(t.lastIndexOf(".")+1)}function u(e,t,r,i,u){var a=s(e),f=a.autoCallback,l=o(a.url);if(a.bypass)return;t&&(t=w(t)?t:t[e]||t[i]||t[e.split("/").pop().split("?")[0]]);if(a.instead)return a.instead(e,t,r,i,u);x[a.url]&&a.reexecute!==!0?a.noexec=!0:x[a.url]=1,e&&r.load(a.url,a.forceCSS||!a.forceJS&&"css"==o(a["url"])?"c":n,a.noexec,a.attrs,a.timeout),(w(t)||w(f))&&r.load(function(){D(),t&&t(a.origUrl,u,i),f&&f(a.origUrl,u,i),x[a.url]=2})}function a(e,t){function h(e,r){if(""!==e&&!e)!r&&a();else if(b(e))r||(s=function(){var e=[].slice.call(arguments);o.apply(this,e),a()}),u(e,s,t,0,n);else if(y(e)){l=function(){var t=0,n;for(n in e)e.hasOwnProperty(n)&&t++;return t}();for(c in e)e.hasOwnProperty(c)&&(!r&&!--l&&(w(s)?s=function(){var e=[].slice.call(arguments);o.apply(this,e),a()}:s[c]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),a()}}(o[c])),u(e[c],s,t,c,n))}}var n=!!e.test,r=n?e.yep:e.nope,i=e.load||e.both,s=e.callback||f,o=s,a=e.complete||f,l,c;h(r,!!i||!!e.complete),i&&h(i),!i&&!!e.complete&&h("")}var t,r,i=this.yepnope.loader;if(b(e))u(e,0,i,0);else if(g(e))for(t=0;t<e.length;t++)r=e[t],b(r)?u(r,0,i,0):g(r)?C(r):y(r)&&a(r,i);else y(e)&&a(e,i)},C.addPrefix=function(e,t){T[e]=t},C.addFilter=function(e){S.push(e)},C.errorTimeout=1e4,t.readyState==null&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",N=function(){t.removeEventListener("DOMContentLoaded",N,0),t.readyState="complete"},0)),e.yepnope=D(),e.yepnope.executeStack=O,e.yepnope.injectJs=L,e.yepnope.injectCss=A})(this,document);var placeAd2=function(){},wpAd=wpAd||{},googletag=googletag||{cmd:[]},amznads=amznads||{},treatAsNotIframed=self===top;!!window.TWP&&!!TWP.StaticMethods&&!!TWP.StaticMethods.treatAsNotIframed&&(treatAsNotIframed=TWP.StaticMethods.treatAsNotIframed()),wpAd.cleanScriptTags=function(){},function(e,t){"use strict";function a(e){var t="https:"==document.location.protocol;if(t){e=e.split(/\.(.+)?/)[1];if(typeof e=="undefined"){var n="https://www.washingtonpost.com/wp-srv/ad/loaders/latest/js/min/";n=n.match(/\.(.+)?/)[1],e=n}return"https://www."+e}return e}function f(e){function t(e,t,r,i,s){var o=document.createElement("script"),u=document.getElementsByTagName("head")[0]||document.body;o.setAttribute("data-id",t),o.setAttribute("data-timing",i),o.setAttribute("data-version",s),o.className=r,o.type="text/javascript",o.src=(n?"":"//js.washingtonpost.com/wp-stat/ad/loaders/latest/")+e,u.insertBefore(o,u.childNodes[0])}e==="mobile"?t("js/lib/krux-mobile-control.js","JWSW2rxX","kxct","async","1.9"):t("js/lib/krux-desktop-control.js","IbWIJ0xh","kxct","async","1.9")}function l(){amznads=amznads||{},amznads.tasks=amznads.tasks||[],amznads.asyncParams={id:"3041"};var e="https:"==document.location.protocol;(function(){var e,t=document.getElementsByTagName("script")[0];e=document.createElement("script"),e.type="text/javascript",e.async=!0,e.src="//c.amazon-adsystem.com/aax2/amzn_ads.js",t.parentNode.insertBefore(e,t)})(),amznads.tasks.push(function(){var e="",t=amznads.getTokens();for(var n=0;n<t.length;n++)var r=t[n],i="1"});try{amznads.tasks.push(function(){amznads.setTargetingForGPTAsync("amznslots")})}catch(t){}}function c(){var t="https:"==document.location.protocol,n={wp:"wp"+(t?"_secure":"")+".min.js?cachebuster="+(Math.floor(Math.random()*9e4)+1e4),wp_mobile:"wp_mobile"+(t?"_secure":"")+".min.js?cachebuster="+(Math.floor(Math.random()*9e4)+1e4)},i=e('script[data-ad-site][src*="loader.min.js"]:first'),s=i.data("adPageType")==="responsive",o=i.data("adSite"),a=n[o];!a&&wpAd.loaderConfig&&(r&&console.log("--ADOPS DEBUG-- wpAd.loaderConfig found:",wpAd.loaderConfig),o=wpAd.loaderConfig.site||null,a=n[o],s=wpAd.loaderConfig.pageType==="responsive"?!0:!1),a||(r&&console.log('--ADOPS DEBUG-- Could not find attribute "data-ad-site" or a corresponding value. No valid wpAd.loaderConfig, either. Defaulting to wp.min.js.'),o="wp",a=n.wp);if(s&&(typeof window.mobileMode=="function"&&window.mobileMode()||u.isMobileWidth)){var f=o+(/_mobile$/.test(o)?"":"_mobile");n[f]&&(o=f,a=n[o]),r&&console.log("--ADOPS DEBUG-- Resposive page detected. Attempting to use script:",a)}return r&&console.log("--ADOPS DEBUG-- Loading site script:",a),{script:a,site:o,responsive:s}}function h(){e('*[id^="slug_"][data-ad-type]').hide().each(function(){var t=e(this);placeAd2({where:t.data("adWhere")||window.commercialNode,what:t.data("adType"),delivery:t.data("adDelivery"),onTheFly:t.data("adOnTheFly")})})}function p(t){t&&o[t]&&e("<link />").attr({type:"text/css",rel:"stylesheet",href:(n?"css/":"https://css.washingtonpost.com/wp-stat/ad/loaders/latest/css/")+t+".css"}).appendTo("head")}function d(){var t=c(),n=i+t.script;wpAd.siteInfo=t,wpAd.device=u,wpAd.$=e,!window.commercialNode&&wpAd.siteInfo.site==="wp_mobile"&&(window.commercialNode=e(".page").attr("data-adkey")||"",window.commercialNode=window.commercialNode.replace(/^mob\.wp\./,"")),window.commercialNode==="washingtonpost.com"&&wpAd.device.isMobileWidth&&(window.commercialNode="homepage"),window.top.commercialNode!=="washingtonpost.com"&&(wpAd.siteInfo.site==="wp"?(/kidspost|jobs/i.test(window.commercialNode)||f("desktop"),e.getScript("//js.washingtonpost.com/wp-srv/ad/swfobject.js")):f("mobile")),l(),wpAd.someVar=null,wpAd.internal=function(){e.ajax({type:"GET",url:"https://request-information-api.ext.nile.works/v1/info?callback=?",cache:!0,dataType:"jsonp",jsonpCallback:"cb",success:function(e){wpAd.someVar=e.internal}})},wpAd.internal();var s=document.createElement("img");s.height=1,s.width=1,s.style.borderStyle="none",s.src="//s.amazon-adsystem.com/iui3?d=forester-did&ex-fargs=%3Fid%3D2fac2d4e-1a1f-905e-9caf-296cec356df2%26type%3D55%26m%3D1&ex-fch=416613&ex-src=washingtonpost.com&ex-hargs=v%3D1.0%3Bc%3D1097383749024%3Bp%3D2fac2d4e-1a1f-905e-9caf-296cec356df2";var o=document.getElementsByTagName("body")[0]||document.getElementsByTagName("head")[0]||document.getElementsByTagName("div")[0];o.appendChild(s),p(t.site),e.ajax({url:"//ox-d.washingtonpost.servedbyopenx.com/w/1.0/jstag?nc=701-Washingtonpost",dataType:"script",cache:!0,timeout:400,success:function(){e.ajax({url:n,dataType:"script",cache:!0,crossDomain:!0,timeout:4e3,success:function(){r&&console.log("--ADOPS DEBUG--",n,"loaded"),h()}})},error:function(){e.ajax({url:n,dataType:"script",cache:!0,crossDomain:!0,timeout:4e3,success:function(){r&&console.log("--ADOPS DEBUG--",n,"loaded"),h()}})}})}function v(e,t){if(!e||!t)return!1;var n,r,i,s;e=e.split("."),t=t.split("."),i=t.length;for(s=0;s<i;s++)if(typeof e[s]!="undefined"){n=parseInt(e[s],10),r=parseInt(t[s],10);if(n!==r)return n>r}return!0}window.console=function(){var e,t=function(){},n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],r=n.length,i=window.console=window.console||{};while(r--)e=n[r],i[e]||(i[e]=t);return i}(),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){if(this===undefined||this===null)throw new TypeError('"this" is null or not defined');var n=this.length>>>0;t=+t||0,Math.abs(t)===Infinity&&(t=0),t<0&&(t+=n,t<0&&(t=0));for(;t<n;t++)if(this[t]===e)return t;return-1}),Array.prototype.containsArray=function(e){var t={};for(var n=0;n<this.length;n++)t[this[n]]=n;return t.hasOwnProperty(e)};if(/no_ads/.test(location.search)||!t||!treatAsNotIframed)return treatAsNotIframed||console.log("--ADOPS DEBUG-- Bailed, because we're inside an iframe."),!1;wpAd.executionStart=(new Date).getTime();var n=/localhost/.test(document.domain)&&location.port==="5000"||/file/.test(location.protocol),r=!!/debugadcode/i.test(location.search),i=n?"js/min/":a("http://js.washingtonpost.com/wp-stat/ad/loaders/latest/js/min/"),s="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js",o={wp:!0,wp_mobile:!0},u=function(e){function c(t){var n=e.indexOf(t);return n==-1?"n/a":e.substring(n+t.length+1).split(" ")[0]}var t,n,r=768,i=window.innerWidth||window.screen&&window.screen.width,s=i<r,o=!1,u=!1,a=window.devicePixelRatio>1,f={iOS:/iphone|ipad|ipod/i.test(e),Android:{isAndroid:/android/i.test(e),version:c("Android")},BlackBerry:/blackberry/i.test(e),Windows:/iemobile/i.test(e)},l={iPad:/ipad/i.test(e)},h={OS:{isWindows:/Windows NT/i.test(e),isMac:/Macintosh/i.test(e)},Chrome:{isChrome:/Chrome/i.test(e),version:c("Chrome")},Firefox:{isFirefox:/Firefox/i.test(e),version:c("Firefox")},Safari:{isSafari:/Safari/i.test(e)&&!/Chrome/i.test(e),version:c("Version")},IE:{isIE:/MSIE/i.test(e),version:c("MSIE")}};for(t in f)if(f.hasOwnProperty(t)&&f[t]){o=!0;break}for(n in l)if(l.hasOwnProperty(n)&&l[n]){u=!0;break}return{mobile:f,tablet:l,desktop:h,retina:a,isMobile:o,isTablet:u,width:i,isMobileWidth:s}}(navigator.userAgent);placeAd2=function(){placeAd2.queue=placeAd2.queue||[],placeAd2.queue.push(Array.prototype.slice.call(arguments))},e&&e.fn&&v(e.fn.jquery,"1.7.1")?(r&&console.log("ADOPS DEBUG: jQuery >= 1.7.1, OK"),d()):t([{test:e,yep:["timeout=5000!"+s],callback:function(){r&&console.log("ADOPS DEBUG: jQuery < 1.7.1, using noConflict(true)"),e=window.jQuery.noConflict(!0),d()}},{test:!e,yep:["timeout=5000!"+s],callback:function(){r&&console.log("ADOPS DEBUG: jQuery undefined, loading v1.7.1"),e=window.jQuery,d()}}])}(window.jQuery,window.yepnope);