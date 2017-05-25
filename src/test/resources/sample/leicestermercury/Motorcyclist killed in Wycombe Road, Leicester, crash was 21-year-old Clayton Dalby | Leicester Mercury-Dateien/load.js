var pm_ppy="northcliffe-network";var pm_geo="US";



var _pmep = '//widget.perfectmarket.com/';
var _pmep_geo = '//geo.perfectmarket.com/';
if (document.URL.indexOf('https://') > -1) {
    _pmep = _pmep.replace(/88\//gi, '90/');
    _pmep_geo = _pmep_geo.replace(/88\//gi, '90/');
}
var _pmpmk = 'northcliffe-network/pmk-201528001.3.js';
var _pmasync = true;
var _pmoptimization = true;
var _pmoptimizationmanipulation = true;
var _pmoptimizationmanipulationmode = 'hide,insert';
var _pmoptimizationpersonalizationdomains = ' ';
var _pmoptimizationinsertdomains = ' ';
var _pmsb = false;
function _pmloadfile(fileName) {
        
          var js,elements = document.getElementsByTagName("head")[0];
          js = document.createElement("script");
          js.setAttribute("type","text/javascript");
          js.setAttribute("src", fileName);
          elements.appendChild(js);
}

var bbVer = getBBVersion();
if (bbVer == null || parseInt(bbVer) > 5) {

var pmk,pmglb,pmfa,pmad,pmdebug_c;pmglb=pmglb||null;pmfa=pmfa||null;pmad=pmad||null;pmdebug_c=pmdebug_c||null;pmk=pmk||null;
var _pmenv = getUrlParameter('pmenv');
if(_pmenv && _pmenv == 'sandbox' && !_pmsb) {_pmep=_pmep.replace('//widget.perfectmarket.com', '//widget.sandbox.perfectmarket.com');_pmep_geo=_pmep_geo.replace('//geo.perfectmarket.com', '//geo.sandbox.perfectmarket.com');var d = new Date();var rand = d.getTime();_pmpmk=pm_ppy+"/load.js?"+rand;}

(function(){
  var sc='script',doc=document;
  _pmloadfile(_pmep+_pmpmk);
})();

function pmws_request_done(){
  var sc="script",doc=document;
  if (doc.all && !window.opera){doc.write('<'+sc+' type="text/javascript" id="pm_contentloadtag" defer="defer" src="javascript:void(0)"><\/'+sc+'>');var pm_contentloadtag = doc.getElementById("pm_contentloadtag");if(pm_contentloadtag)pm_contentloadtag.onreadystatechange = function() { if (this.readyState=="complete") return; } }
  _pmloadfile(_pmep+_pmpmk);
}
}
function getBBVersion() {
    var ua = navigator.userAgent,ver=null,vp,splitUA;
    if (ua.indexOf("BlackBerry") >= 0) {if (ua.indexOf("Version/") >= 0) {vp = ua.indexOf("Version/") + 8;ver = ua.substring(vp, vp + 3);}else {splitUA = ua.split("/"); ver = splitUA[1].substring(0, 3);}}
    return ver;
}
function getUrlParameter(name) {var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);return match && decodeURIComponent(match[1].replace(/\+/g, ' '));}



