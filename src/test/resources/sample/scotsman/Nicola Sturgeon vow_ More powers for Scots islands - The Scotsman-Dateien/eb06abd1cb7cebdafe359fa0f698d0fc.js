Bootstrapper.bindImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;if(window.platform!==undefined){var CoremetricsService=function(){var instance;var createInstance=function(Coremetrics){var _coremetrics=Coremetrics;var setCoremetricsClientId=function(){console.log("Set Client id:"+[_coremetrics.coremetricsClientId,_coremetrics.isCoremetricsClientManaged,_coremetrics.coremetricsCollectionDomain,_coremetrics.coremetricsCookieDomain].join());
return cmSetClientID(_coremetrics.coremetricsClientId,_coremetrics.isCoremetricsClientManaged,_coremetrics.coremetricsCollectionDomain,_coremetrics.coremetricsCookieDomain)};var createPageViewTagWithElementAttributes=function(){if(_coremetrics.coremetricsElementAttributes||_coremetrics.coremetricsElementAttributes!==""){console.log("Page view tag with attributes: "+[_coremetrics.coremetricsPageId,Coremetrics.coremetricsCategoryId,_coremetrics.coremetricsElementAttributes].join());return cmCreatePageviewTag(_coremetrics.coremetricsPageId,
Coremetrics.coremetricsCategoryId,"","",_coremetrics.coremetricsElementAttributes)}else{console.log("Page view tag without attributes: "+[_coremetrics.coremetricsPageId,Coremetrics.coremetricsCategoryId,_coremetrics.searchTerm].join());return cmCreatePageviewTag(_coremetrics.coremetricsPageId,Coremetrics.coremetricsCategoryId,"")}};var pageViewTargetting=function(){if(_coremetrics&&!_coremetrics.delayCoremetricsPageViewTag){setCoremetricsClientId();return createPageViewTagWithElementAttributes()}return};
return{coremetrics:_coremetrics,setCoremetricsClientId:setCoremetricsClientId,createPageViewTagWithElementAttributes:createPageViewTagWithElementAttributes,pageViewTargetting:pageViewTargetting}};return{facade:function(){if(!instance){instance=createInstance(Coremetrics);try{instance.pageViewTargetting()}catch(e){console.error(e)}}return instance}}}();CoremetricsService.facade()}},1158541,340828);
Bootstrapper.bindDOMParsed(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;setTimeout(function(){var a=document.createElement("script");var b=document.getElementsByTagName("script")[0];a.src=document.location.protocol+"//script.crazyegg.com/pages/scripts/0018/3606.js?"+Math.floor((new Date).getTime()/36E5);a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)},1)},1162767,340850);
Bootstrapper.bindDOMLoaded(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;function getCookieValue(ckie,nme){var splitValues;for(var i=0;i<ckie.length;i++){splitValues=ckie[i].split("\x3d");var key=splitValues[0];key=key.replace(/^\s*/gi,"");if(key==nme)return splitValues[1]}return 0}function counterCookie(){var adName="rfiAdServeCountY";var num_of_hours_to_save_cookie=1;var cookie=document.cookie;var counter=0;var nvpair=cookie.split(";");var checkCookie=
parseInt(getCookieValue(nvpair,adName),10);if(checkCookie!=0||checkCookie!="")counter=checkCookie;counter++;var newCookieDate=new Date;newCookieDate.setTime(newCookieDate.getTime()+num_of_hours_to_save_cookie*60*60*1E3);var newCookie=adName+"\x3d"+counter;newCookie+="; expires\x3d"+newCookieDate.toGMTString()+"; path\x3d/";window.document.cookie=newCookie;return counter}(function(){var count=counterCookie();var protocol="https:"==document.location.protocol?"https:":"http:";(new Image(1,1)).src=protocol+
"//p.rfihub.com/ca.gif?rb\x3d20647\x26ca\x3d20682871\x26ra\x3d"+Math.random()+"\x26ud\x3d"+count;if(count==+3)(new Image(1,1)).src=protocol+"//p.rfihub.com/ca.gif?rb\x3d20647\x26ca\x3d20682873\x26ra\x3d"+Math.random()+"\x26ud\x3d"+count})()},1126809,355314);