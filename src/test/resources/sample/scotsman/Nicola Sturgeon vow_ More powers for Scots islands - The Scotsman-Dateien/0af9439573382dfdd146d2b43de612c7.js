Bootstrapper.bindImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;if(window.platform!==undefined){window.gs_channels="default";var url="http://johnston.grapeshot.co.uk/channels.cgi?url\x3d"+encodeURIComponent(""+window.location.href);Bootstrapper.insertScript(url)}},1131609,355749);
Bootstrapper.bindImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;function setAmazonTargeting(){console.log("amazon:ready");var amznads=window.amznads||{};var googletag=window.googletag||{};googletag.cmd=googletag.cmd||[];amznads.asyncParams={id:"3147",callbackFn:function(){try{console.log("Amazon tags setTargetingForGPTAsync");amznads.setTargetingForGPTAsync("amznslots")}catch(e){console.error(e)}},timeout:2E3};amznads.tryGetAdsAsync()}
function loadAmazonTargeting(){Bootstrapper.loadScriptCallback("http://c.amazon-adsystem.com/aax2/amzn_ads.js",function(){if(window.gptReady===true)setAmazonTargeting();else jQuery(document).on("gpt:ready",setAmazonTargeting)})}if(window.platform!==undefined)loadAmazonTargeting()},1131612,355748);
Bootstrapper.bindImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;var loadScriptCallback=function(a,b,d,i){var c=document.getElementsByTagName("script"),h;d=c[0];for(h=0;h<c.length;h++)if(c[h].src===a&&c[h].readyState&&/loaded|complete/.test(c[h].readyState))try{b()}catch(g){window[ensightenOptions.ns].reportException(g)}finally{return}c=document.createElement("script");c.type="text/javascript";c.async=!0;c.src=a;c.id=i;c.onerror=function(){this.addEventListener&&
(this.readyState="loaded")};c.onload=c.onreadystatechange=function(){if(!this.readyState||"complete"===this.readyState||"loaded"===this.readyState){this.onload=this.onreadystatechange=null;this.addEventListener&&(this.readyState="loaded");try{b.call(this)}catch(a){window[ensightenOptions.ns].reportException(a)}}};d.parentNode.insertBefore(c,d)};if(window.platform!==undefined){var populateCCAUDS=function(){window.dartCCKey="ccaud";window.dartCC="";if(typeof window.ccauds!="undefined")for(var cci=0;cci<
window.ccauds.Profile.Audiences.Audience.length;cci++){if(cci>0)window.dartCC+=",";window.dartCC+=window.ccauds.Profile.Audiences.Audience[cci].abbr}};window._cc4810=window._cc4810||{};loadScriptCallback("//tags.crwdcntrl.net/c/4810/cc.js?ns\x3d_cc4810",function(){window._cc4810.bcp();Bootstrapper.loadScriptCallback("//ad.crwdcntrl.net/5/c\x3d4299/pe\x3dy/var\x3dccauds",populateCCAUDS)},document,"LOTCC_4810")}},1131614,355753);