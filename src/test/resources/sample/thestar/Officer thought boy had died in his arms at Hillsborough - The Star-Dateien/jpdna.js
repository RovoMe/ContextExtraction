(function(f,t){var v="jpdna.gplus.share",n="jpdna.facebook.share",b="jpdna.twitter.share",l="jpdna.mail.share";function q(x,y,z,B,A){x.on("click",function(C){if(f("#nativeShareTools").length===0){C.preventDefault();x.trigger(A);k(y,z,B)}else{x.trigger(A)}})}function k(y,z,C){var B,A,x;C=C||500;z=z||500;A=window.screenLeft||0;x=window.screenTop||0;B="toolbar=yes, scrollbars=yes, resizable=yes, width="+z+", height="+C+", left="+A+", top="+x;window.open(y,null,B)}function p(y){var x,A,D,z,C,B;x=y.attr("data-base-share-url");A=y.attr("data-window-width");D=y.attr("data-window-height");C=y.attr("data-tweet-text");B=y.attr("data-share-link");z=x+encodeURIComponent(C)+"&url="+encodeURIComponent(B);q(y,z,A,D,b)}function o(z,x,A,y){z.attr("href",x+"subject="+A+"&body="+y)}function d(z){var x,A,y;x=z.attr("data-base-share-url");A=encodeURIComponent(z.attr("data-email-subject"));y=encodeURIComponent(z.attr("data-email-body"));o(z,x,A,y);z.on("click",function(){z.trigger(l)})}function c(z,y){var x,C,D,B,A;x=z.attr("data-base-share-url");B=z.attr("data-window-width");D=z.attr("data-window-height");C=encodeURIComponent(z.attr("data-url-to-share")||location.href);A=x+C;q(z,A,B,D,y)}function w(x){c(x,n)}function a(x){c(x,v)}function i(x,y){return x.attr("data-provider")===y}function j(x){return x==="facebook"}function g(x){return x==="twitter"}function m(x){return x==="gplus"}function s(x){return x==="email"}function u(x){return x.attr("data-provider")}function r(x){return x.attr("data-sharetool-initialized")?true:false}function h(x){x.attr("data-sharetool-initialized","true")}function e(y,z){var x=f(z),A;if(r(x)){return}h(x);A=u(x);if(j(A)){w(x);return}if(g(A)){p(x);return}if(m(A)){a(x);return}if(s(A)){d(x);return}}f.fn.sharetool=function(){console.debug("here");return this.each(e)};f(document).ready(function(){});t.sharetool={initShareProvider:e,initFacebook:w,initTwitter:p,initGplus:a,initShareByEmail:d}})(jQuery,(typeof jpdna!=="undefined"?jpdna:window.jpdna={}));