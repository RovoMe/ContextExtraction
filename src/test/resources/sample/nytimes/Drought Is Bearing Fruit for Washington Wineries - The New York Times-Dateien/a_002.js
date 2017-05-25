function splitIndexSlots(){for(var e=new Array,t=new Array,n=0;n<index_slots.length;n++){var i=index_slots[n].split("_"),d=i.shift(),s=d,a=i.join("_");"O"==s?e.push(a):"P"==s&&t.push(a)}return[e,t]}function clearTargeting(e){for(var t=[],n=[],i=[],d=splitIndexSlots(),s=d[0],a=d[1],o=0;o<s.length;o++)s[o]!=e&&(t.push(s[o]),i.push("O_"+s[o]));for(var o=0;o<a.length;o++)a[o]!=e&&(n.push(a[o]),i.push("P_"+a[o]));index_slots=i,googletag&&googletag.pubads&&googletag.pubads().setTargeting&&(s.length>0?googletag.pubads().setTargeting("IOM",s):googletag.pubads().setTargeting("IOM",[]),a.length>0?googletag.pubads().setTargeting("IPM",a):googletag.pubads().setTargeting("IPM",[]))}function cygnus_index_judge(e){for(var t={},n=/^[OM]_(?:T([0-9])_)?(.*)_.*$/,i=[],d=0;d<e.length;d++)if("P"!==e[d].split("_")[0]){var s=n.exec(e[d]);if("undefined"!=typeof s&&null!==s){var a,o;if(a=s[1],o=s[2],("undefined"==typeof a||null===a)&&(a=0),t[o]=t[o]||{},"undefined"==typeof t[o].tier||t[o].tier<a){t[o].tier=a;var r=e[d];if(a>0){var _=e[d].split("_"),u=_.shift(),g=_.join("_");_.shift();var l=_.join("_");r=u+"_"+l,_IndexRequestData.targetIDToBid[l]=_IndexRequestData.targetIDToBid[g]}t[o].target=r}}}else i.push(e[d]);var p=[];for(var f in t)t.hasOwnProperty(f)!==!1&&p.push(t[f].target);return p.concat(i)}function cygnus_index_parse_res(e){try{if(e){if("object"!=typeof _IndexRequestData||"object"!=typeof _IndexRequestData.impIDToSlotID||"undefined"==typeof _IndexRequestData.impIDToSlotID[e.id])return;var t,n=0;"object"==typeof _IndexRequestData.reqOptions&&"object"==typeof _IndexRequestData.reqOptions[e.id]&&("function"==typeof _IndexRequestData.reqOptions[e.id].callback&&(t=_IndexRequestData.reqOptions[e.id].callback),"number"==typeof _IndexRequestData.reqOptions[e.id].targetMode&&(n=_IndexRequestData.reqOptions[e.id].targetMode)),_IndexRequestData.lastRequestID=e.id;for(var i=[],d="undefined"==typeof e.seatbid?0:e.seatbid.length,s=0;d>s;s++)for(var a=0;a<e.seatbid[s].bid.length;a++){var o=e.seatbid[s].bid[a];if("object"==typeof o.ext&&"string"==typeof o.ext.pricelevel&&"undefined"!=typeof _IndexRequestData.impIDToSlotID[e.id][o.impid]){var r=_IndexRequestData.impIDToSlotID[e.id][o.impid];"undefined"==typeof index_slots&&(index_slots=[]),"undefined"==typeof _IndexRequestData.targetIDToBid&&(_IndexRequestData.targetIDToBid={});var _,u;"string"==typeof o.ext.dealid?(_=1===n?r+o.ext.pricelevel:r+"_"+o.ext.dealid,u="P_"):(_=r+o.ext.pricelevel,u="O_"),index_slots.push(u+_),void 0===_IndexRequestData.targetIDToBid[_]?_IndexRequestData.targetIDToBid[_]=[o.adm]:_IndexRequestData.targetIDToBid[_].push(o.adm);var g={};g.impressionID=o.impid,"undefined"!=typeof o.ext.dealid&&(g.dealID=o.ext.dealid),g.bid=o.price,g.slotID=r,g.priceLevel=o.ext.pricelevel,g.target=u+_,i.push(g)}}"function"==typeof t&&(0===i.length?t(e.id):t(e.id,i)),index_slots=cygnus_index_judge(index_slots),cygnus_report("rb","RB="+index_slots.join())}}catch(l){}"undefined"==typeof index_slots&&(index_slots=[]),cygnus_index_set_targets()}function cygnus_index_set_targets(){"function"==typeof window.cygnus_index_ready_state&&window.cygnus_index_ready_state(),window.index_slots_last=index_slots,index_slots=[]}function cygnus_log(){}function index_render(e,t){"undefined"==typeof index_demand&&(index_demand={});for(var n=t.split("_"),i=n[0],d=0;d<index_slots_render.length;d++)if("string"==typeof index_slots_render[d]["O_"+t]){cygnus_log("unpack tier"+t),t=index_slots_render[d]["O_"+t];var s=t.split("_");t=s[1]+"_"+s[2]+"_"+s[3],i=s[1]+"_"+s[2]}cygnus_log("index_render: "+t);try{var a=_IndexRequestData.targetIDToBid[t].pop();null!=a?(e.write(a),cygnus_report("ri","RI="+t),cygnus_log("Logged demand for slot "+i),index_demand[i]=1,delete index_no_demand[i]):cygnus_report("rinull","RINULL="+t)}catch(o){}}function cygnus_report(e,t){}function cygnus_copy(e){var t=new Object;for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function getSlotInfo(e){for(var t=0;t<cygnus_index_args.slots.length;t++){var n=cygnus_index_args.slots[t];if(n.id==e)return n}}index_slot_to_size={},index_slots_render=[],index_slots_add=[];var cygnus_tid=4;cygnus_index_stats={sampling:{defaults:1,rd:.01,rb:.01,rdp:.01,ri:.1,rinull:1,gstatus:0}};
;cygnus_index_parse_res({"seatbid":[{"bid":[{"adomain":["www.vonage.com"],"adid":"2707435","impid":"13","id":"1","ext":{"pricelevel":"_b1d365b5","dspid":57,"advbrandid":1877,"advbrand":"Vonage Holdings Corporation"},"adm":"<img style='display:none' border=0 width=0 height=0 src='//eqv-390.eqv-rtb1.rfihub.com/adb.gif?ms=&ri=49a1b3d263c988b11a8f6fc856f445f8&po=19&ra=1822449900.4970885478973065'><script type=\"text/rfitag\" id='__rfi_script_49a1b3d263c988b11a8f6fc856f445f8_p'><div style=\"position:relative;margin:0;marginLeft:0;marginRight:0;marginTop:0;marginBottom:0;padding:0;paddingLeft:0;paddingRight:0;paddingTop:0;paddingBottom:0; width:300px; height:250px; float:none\"><span id=\"__rfi__RFIM_M6__\" style=\"height:250px; width:300px; display:block\"><noscript>\n\n\n<a href=\"http://__RFIM_e__/acn/b/__RFIM_c__https://servedby.flashtalking.com/click/8/54666;1489940;0;209;0/?ft_width=300&ft_height=250&url=7751685\" target=\"_blank\">\n\n\n<img border=\"0\" src=\"https://fw.adsafeprotected.com/rfw/servedby.flashtalking.com/47472/6591718/imp/8/54666;1489940;205;gif;RocketFuelUSFTSection;RocketfuelVonageUSCorePROSOCMFTDisplaySiteAffAsegDesktop300x250CPMNA/?adsafe_preview=__RFIM_M13__\"></a>\n\n\n</noscript>\n\n\n__RFIM_a__ language=\"Javascript1.1\" type=\"text/javascript\">\n\n\nvar ftClick = \"http://__RFIM_e__/acs/b/__RFIM_c__\";\n\n\nvar ftExpTrack_1489940 = \"\";\n\n\nvar ftX = \"\";\n\n\nvar ftY = \"\";\n\n\nvar ftZ = \"\";\n\n\nvar ftOBA = 1;\n\n\nvar ftContent = \"\";\n\n\nvar ftCustom = \"\";\n\n\nvar ftSection = \"__RFIM_M4__\";\n\n\nvar ft300x250_OOBclickTrack = \"\";\n\n\nvar ftRandom = Math.random()*1000000;\n\n\nvar ftBuildTag1 = \"<scr\";\n\n\nvar ftBuildTag2 = \"</\";\n\n\nvar ftClick_1489940 = ftClick;\n\n\nif(typeof(ft_referrer)==\"undefined\"){var ft_referrer=(function(){var r=\"\";if(window==top){r=window.location.href;}else{try{r=window.parent.location.href;}catch(e){}r=(r)?r:document.referrer;}while(encodeURIComponent(r).length>1000){r=r.substring(0,r.length-1);}return r;}());}\n\n\nvar ftDomain = (window==top)?\"\":(function(){var d=document.referrer,h=(d)?d.match(\"(?::q/q/)+([qw-]+(q.[qw-]+)+)(q/)?\".replace(/q/g,decodeURIComponent(\"%\"+\"5C\")))[1]:\"\";return (h&&h!=location.host)?\"&ft_ifb=1&ft_domain=\"+encodeURIComponent(h):\"\";}());\n\n\nvar ftTag = ftBuildTag1 + 'ipt language=\"javascript1.1\" type=\"text/javascript\" ';\n\n\nftTag += 'src=\"https://fw.adsafeprotected.com/rjss/servedby.flashtalking.com/47472/6591720/imp/8/54666;1489940;201;js;RocketFuelUSFTSection;RocketfuelVonageUSCorePROSOCMFTDisplaySiteAffAsegDesktop300x250CPMNA/?ftx='+ftX+'&fty='+ftY+'&ftadz='+ftZ+'&ftscw='+ftContent+'&ft_custom='+ftCustom+'&ft_section='+ftSection+'&ftOBA='+ftOBA+ftDomain+'&ft_referrer='+encodeURIComponent(ft_referrer)+'&cachebuster='+ftRandom+'&adsafe_preview=__RFIM_M13__\" id=\"ftscript_300x250\" name=\"ftscript_300x250\"';\n\n\nftTag += '>' + ftBuildTag2 + 'script>';\n\n\ndocument.write(ftTag);\n\n\n__RFIM_b__></span></div><img style='display:none' border=0 width=0 height=0 src='//eqv-390.eqv-rtb1.rfihub.com/adb.gif?ms=__RFIM_d__&ri=49a1b3d263c988b11a8f6fc856f445f8&po=24&ra=1822449900.38399502261937957'></script><script type=\"text/javascript\">(function(A){var B=document,C=function(c){return encodeURIComponent(c).replace(/[!'()~]/g,escape).replace(/\\*/g,\"%2A\")},D=function(c){return decodeURIComponent(c.replace(/\\%21/g,\"!\").replace(/\\%27/g,\"'\").replace(/\\%28/g,\"(\").replace(/\\%29/g,\")\").replace(/\\%7E/g,\"~\").replace(/\\+/g,\" \"))},V=function(){return new Date().getTime()},E=(function(){var u=\"\",r=\"\",s=\"\",t=\"\";try{u=location;u=u&&u.href;u=u?C(u):\"\";r=B&&B.referrer;r=r?C(r):\"\";s=C(A.b);t=r==\"\"?u:r}catch(e){}return{u:u,r:r,s:s,t:t}})(),G=(function(){var s=!1;try{var p=B.location.protocol;s=A.j||A.l||p&&p==\"https:\"}catch(e){}return s})(),H=G?\"https://\":\"http://\",I=function(c){return!A.j&&G?c.replace(/http:/g,\"https:\"):c},J=function(c){return A.e?I(c):c},K=function(m,p,l){var i=new Image(1,1);i.src=H+A.d+\"/adb.gif?\"+\"ms=\"+C(m)+\"&po=\"+p+\"&lev=\"+l+\"&ri=\"+A.c+\"&ra=\"+(V()%1000000000)+Math.random()},W=function(t){var q=/__RFIM_([^_]+)__/g,o=A.a;t=t.replace(q,function(a,b){return o[b].p?D(o[b].o):o[b].o});q.test(t)&&K(t,23,201);return t},X=function(t){var x=window.btoa;if(x)return x(t).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=/g,'.');var o=\"\",a,b,c,d,e,f,g,i=0,k=\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.\";while(i<t.length){a=t.charCodeAt(i++);b=t.charCodeAt(i++);c=t.charCodeAt(i++);d=a>>2;e=((a&3)<<4)|(b>>4);f=((b&15)<<2)|(c>>6);g=c&63;if(isNaN(b)){f=g=64}else if(isNaN(c)){g=64}o=o+k.charAt(d)+k.charAt(e)+k.charAt(f)+k.charAt(g)}return o},F=(function(){try{var h=B.getElementById(\"__rfi_script_\"+A.c+\"_p\").innerHTML,o=A.a,n=A.h===\"\"?\"\":\"<img style='display:none' border=0 width=0 height=0 src='\"+H+A.k+A.h+\"' />\",i=\"\";o[\"a\"]={\"o\":\"<script\",\"p\":0};o[\"b\"]={\"o\":\"</script\",\"p\":0};o[\"c\"]={\"o\":A.f+'/'+(A.g===\"\"?'n':X(A.g))+'/',\"p\":0};o[\"d\"]={\"o\":h.length,\"p\":0};o[\"e\"]={\"o\":A.d,\"p\":0};o[\"M6\"]={\"o\":A.c,\"p\":0};o[\"M10\"]={\"o\":E.t,\"p\":0};if(A.i!==\"\"){i=H+A.d+A.i+\"&ct=\"+V()+\"&rs=\"+E.s+\"&pe=\"+E.u+\"&pf=\"+E.r;i=i.length>=4096?i.substr(0,4095):i;i=\"\\x3cscr\"+\"ipt type='text/javascript' src='\"+i+\"'>\"+\"\\x3c/scr\"+\"ipt>\"}h=J(W(h))+I(n)+I(W(i));B.write(h)}catch(e){K(e,21,201)}})()})({\"a\":{\"M13\":{\"o\":\"0\",\"p\":0},\"M4\":{\"o\":\"2079\",\"p\":0}},\"b\":\"\",\"c\":\"49a1b3d263c988b11a8f6fc856f445f8\",\"d\":\"a.rfihub.com\",\"e\":!0,\"f\":\"c3Q9aHRtbCZhYT0xOTY3ODMxLDE4NzY1OTMzLDg1NzI4MSwzNjQ2MDEwNyw0OTk0NSw1NTY4NzksNDlhMWIzZDI2M2M5ODhiMTFhOGY2ZmM4NTZmNDQ1ZjgscCwyODYsMTc5NTM3LDE4NDY5MTE1LDE3OTY5MSw0NDY2NzEmbXQ9MSZyYj0yMDc5JnJlPTM3NDQ3JmhjaT0mdXVpZD0xMDQxNTI3NzgzMjgxMDUwMjY2JmRpPSZkYz0zJmRpc3JjPTAmZGlkPXRpZF81NTY4Nzl8bWVkX3JlZ3VsYXI.\",\"g\":\"\",\"j\":!1,\"l\":!1,\"k\":\"eqv-390.eqv-rtb1.rfihub.com\",\"h\":\"/bn/bk.gif?bt=1451182244990&ri=49a1b3d263c988b11a8f6fc856f445f8&rb=2079&re=37447&ep=1.59&rt=556879&ai=1967831&dc=3&di=&co=bB%3Atrue%2CserverId%3Aeqv-390%2Cbt%3A1451182244990%2Cip%3A108.54.241.206%2CuG%3A0%2Coptimize%3Afalse%2Cdid%3Atid_556879%7Cmed_regular%2CdiSrc%3A0%2CscoreMicroConversions%3A0%2CuV%3A659903%2CuD%3A0%2CnewUser%3Afalse%2CuE%3A0%2Csej%3Afalse%2CscoreMicroClicks%3A0%2CexId%3AD735AC8012F18A8E%2Curl%3Aeqv-390.eqv-rtb1.rfihub.com%2CisFp%3A0%2CisSkip%3Afalse%2Cmt%3A1%2CisAI%3Atrue%2Cuuid%3A1041527783281050266\",\"i\":\"/bn/imp.js?bt=1451182244990&aeh=1&w=300&h=250&co=bB%3Atrue%2CserverId%3Aeqv-390%2Cbt%3A1451182244990%2Cip%3A108.54.241.206%2CuG%3A0%2Coptimize%3Afalse%2Cdid%3Atid_556879%7Cmed_regular%2CdiSrc%3A0%2CscoreMicroConversions%3A0%2CuV%3A659903%2CuD%3A0%2CnewUser%3Afalse%2CuE%3A0%2Csej%3Afalse%2CscoreMicroClicks%3A0%2CexId%3AD735AC8012F18A8E%2Curl%3Aeqv-390.eqv-rtb1.rfihub.com%2CisFp%3A0%2CisSkip%3Afalse%2Cmt%3A1%2CisAI%3Atrue%2Cuuid%3A1041527783281050266&ep=1.59&ri=49a1b3d263c988b11a8f6fc856f445f8&ai=1967831&rt=556879&re=37447&rb=2079&ra=&hl=__RFIM_d__&sc=1&bs=0&dc=3&di=&ug=168044\",\"y\":25});</script>\n<img style='display:none' border=0 width=0 height=0 src='//eqv-390.eqv-rtb1.rfihub.com/adb.gif?ms=&ri=49a1b3d263c988b11a8f6fc856f445f8&po=20&ra=1822449900.24888053479991779'><iframe src=\"http://a037.casalemedia.com/ifnotify?c=294FEB&r=F10FD03A&t=567F48A4&u=Vm45R3lzQW9KME1BQUhZRFFxVUFBQUJO&m=d2a5bdb862322a92b7eb16024da78620&wp=97&aid=D735AC8012F18A8E&tid=0&s=2906C&cp=1.51&n=www.nytimes.com&epr=456357241\" width=\"0\" height=\"0\" frameborder=\"0\" scrolling=\"no\" style=\"display:none;\" marginheight=\"0\" marginwidth=\"0\"></iframe>"}],"seat":"1"}],"cur":"USD","id":456357241});