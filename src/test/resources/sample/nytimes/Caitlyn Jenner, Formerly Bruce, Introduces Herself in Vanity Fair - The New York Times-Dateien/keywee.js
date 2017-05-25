(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)};p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","//dc8xl0ndzn2cb.cloudfront.net/sp.js","snowplow"));  
(function() {
  var _fbq = window._fbq || (window._fbq = []);
  if (!_fbq.loaded) {
    var fbds = document.createElement('script');
    fbds.async = true;
    fbds.src = '//connect.facebook.net/en_US/fbds.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fbds, s);
    _fbq.loaded = true;
  }
  _fbq.push(['addPixelId', '100468016962764']);
})();
(function() {
    var cookie_domain = '.nytimes.com';
    window.snowplow('newTracker', 'cf', 'pixel.keywee.co', {
	appId: '18'
    });
    function setKeyweeAdId(){
	var createCookie = function(name, value, days,domain) {
	    var expires;
	    var cookie;
	    if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	    }
	    else {
		expires = "";
	    }
	    cookie = name + "=" + value + expires + "; path=/;"
	    if(domain){
		cookie = cookie + " Domain="+domain;
	    }
	      document.cookie = cookie;
	};
	var identifier = 'kwp_4';    
	var cookie_identifier = "keywee." + identifier;
	var url_value_match = new RegExp(identifier + "=([^&]*)", "i").exec(window.location.href); 
	var ad_id = url_value_match && unescape(url_value_match[1]) || "";
	if(ad_id != ""){
	    createCookie(cookie_identifier,ad_id,30,cookie_domain);
	}
	window.snowplow('setUserIdFromCookie', cookie_identifier)    
    }    
    setKeyweeAdId();
    window.snowplow('enableActivityTracking', 30, 30);
    window.snowplow('trackPageView');
    window._fbq = window._fbq || [];
    window._fbq.push(['track', 'PixelInitialized', {}]);
})();   
