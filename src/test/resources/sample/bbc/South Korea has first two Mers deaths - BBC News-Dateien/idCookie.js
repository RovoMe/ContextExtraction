define("idcta/idCookie",["id-config"],function(c){var b={};var f=86400000;var e;function g(){if(!e){e=new d()}else{e.refreshCookie()}return e}function a(h){e=h}function d(){var r=this;this.valid=false;this.id="";this.username="~";this.displayname="";this.timestamp="";this.cookieAgeDays=(typeof c.identity!="undefined"&&c.identity.cookieAgeDays)?c.identity.cookieAgeDays:730;l();this.refreshCookie=function(){i()};this.hasCookie=function(){if(p(r.timestamp)){q()}return r.valid};this.getIdFromCookie=function(){if(p(r.timestamp)){q()}return r.id?r.id:null};this.getNameFromCookie=function(){if(p(r.timestamp)){q()}if(r.displayname!==""){return r.displayname.replace(/\+/g," ")}if(r.username&&!(r.username.charAt(0)==="~")){return r.username}return null};this.getAccessToken=function(v){var s,u,t,v=(typeof v!="undefined")?v:m();if(!this.hasCookie()||v.indexOf("https")==-1){return null}s=(typeof c.identity.accessTokenCookieName!="undefined")?c.identity.accessTokenCookieName:"ckns_IDA-ATKN";t=new RegExp(s+"=([^;]*)");u=document.cookie.match(t);return(u!==null)?u[1]:null};this.isDowngraded=function(){var s=document.cookie.match(/ckpf_ID_DOWNGRADED=1/);if(s){return true}return false};this.hasIplayerUplift=function(){return document.cookie.match(/ckpf_tviplayer_uplift=([^;]*)/)};this.downgrade=function(){var u="ckpf_ID_DOWNGRADED=1;";var t=Date.now()+(r.cookieAgeDays*f);var s=new Date(t-(Date.now()-r.timestamp));document.cookie=u+" Expires="+s.toUTCString()+"; Domain=.bbc.co.uk; Path=/";if(r.hasIplayerUplift()){document.cookie="ckpf_tviplayer_uplift=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.bbc.co.uk; Path=/iplayer"}document.cookie="ckns_IDA-RTKN=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.bbc.co.uk; Path=/; secure";document.cookie="ckns_IDA-IDTKN=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.bbc.co.uk; Path=/; secure";document.cookie="ckns_IDA-ATKN=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.bbc.co.uk; Path=/; secure";document.cookie="ckns_authToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.bbc.co.uk; Path=/; secure"};function m(){return window.location.protocol}function l(){o();i()}function o(){if(typeof window.bbccookies==="object"){var s=document.cookie.match(/ckpf_APHID=([^;]*)/);if(s){if(!window.bbccookies.isAllowed("ckpf_APHID")){h()}}}}function i(){var t=document.cookie.match(/IDENTITY=([^;]*)/);if(t){var s=decodeURIComponent(t[1]).split("|");if(k(s)&&!p(s[3])){r.valid=true;r.id=s[0];r.username=s[1];r.displayname=decodeURIComponent(s[2]);r.timestamp=s[3]}else{q()}}else{j()}}function k(s){return(6<=s.length)}function p(t){var u=r.cookieAgeDays*f,s=new Date().getTime();return(s-t>=u)}function q(){j();n()}function j(){r.valid=false;r.id="";r.username="~";r.displayname="";r.timestamp=""}function n(){document.cookie="IDENTITY=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.bbc.co.uk; Path=/";document.cookie="IDENTITY_ENV=; Expires=Thu, 01 Jan 1970 01:00:00 GMT; Domain=.bbc.co.uk; Path=/";h()}function h(){document.cookie="ckpf_APHID=; Expires=Thu, 01 Jan 1970 01:00:00 GMT; Domain=.bbc.co.uk; Path=/"}}b.getInstance=g;b.setInstance=a;return b});