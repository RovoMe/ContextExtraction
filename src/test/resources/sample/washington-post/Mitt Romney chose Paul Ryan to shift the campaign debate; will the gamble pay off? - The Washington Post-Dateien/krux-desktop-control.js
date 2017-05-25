window.Krux||((Krux=function(){Krux.q.push(arguments)}).q=[]);
(function(){
  var k=document.createElement('script');k.type='text/javascript';k.async=true;
  var m,src=(m=location.href.match(/\bkxsrc=([^&]+)/))&&decodeURIComponent(m[1]);
  k.src = /^https?:\/\/([a-z0-9_\-\.]+\.)?krxd\.net(:\d{1,5})?\//i.test(src) ? src : src === "disable" ? "" :
  (location.protocol==="https:"?"https:":"http:")+"//cdn.krxd.net/controltag?confid=IbWIJ0xh"
  ;
  var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(k,s);
}());
(function() {
  function retrieve(n){
    var m, k='kx'+n;
    if (window.localStorage) {
      return window.localStorage[k] || "";
    } else if (navigator.cookieEnabled) {
      m = document.cookie.match(k+'=([^;]*)');
      return (m && unescape(m[1])) || "";
    } else {
      return '';
    }
  }

  Krux.user = retrieve('user');

  Krux.segments = retrieve('segs') ? retrieve('segs').split(',') : [];
}());