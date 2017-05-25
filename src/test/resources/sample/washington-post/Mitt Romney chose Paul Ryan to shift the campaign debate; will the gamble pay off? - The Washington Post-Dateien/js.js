/**/
(function() {
    metric = function(url, wait)
    {
        setTimeout(function() {
                var e = document.createElement("img");
                e.src = url;
            }, wait);
    }

    var intervals = [0, 10];
    var inlen = intervals.length;
    for (var k = 0; k < inlen; ++k)
        this.metric("https://pixel.mathtag.com/misc/img?mm_bnc&bcdv="+k, intervals[k] * 1000);
})();

//used to sync advertiser without leaking referer to final destination
	    var frm = document.createElement('iframe');
	    frm.style.visibility = 'hidden';
	    frm.style.display = 'none';
	    frm.src = "https://pixel.mathtag.com/sync/iframe?mt_adid=109699&v1=&v2=&v3=&s1=&s2=&s3=&no_log&mathid_data=%7B%22dv1%22%3A%22TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTAuMTE7IHJ2OjQyLjApIEdlY2tvLzIwMTAwMTAxIEZpcmVmb3gvNDIuMA%3D%3D%22%2C%22dv2%22%3A%22NzY1NzliZmVmMDVmNTM5NTE2ODQxODYyZjUzOGZjM2I%3D%22%2C%22dv3%22%3A%22YjQ3NjU2ZGVkN2RmNGIxMjQxZDNmNTQ3ZmZjNzkwY2Q%3D%22%2C%22dv4%22%3A%22MTQ0MHw5MDB8MTQ0MHw4NzN8MjR8fA%3D%3D%22%2C%22dv5%22%3A%22QW1lcmljYS9OZXdfWW9yaw%3D%3D%22%2C%22dv6%22%3A%22%22%2C%22dv7%22%3A%22MA%3D%3D%22%2C%22dv8%22%3A%22dHJ1ZXx0cnVlfHRydWU%3D%22%2C%22dv9%22%3A%22fGRlfA%3D%3D%22%2C%22dv10%22%3A%22TW96aWxsYXxOZXRzY2FwZXxNYWNJbnRlbHw%3D%22%7D&mt_uuid=91e153b2-90f3-4f00-a588-3a42eb502288&no_iframe=1";
	    document.body.appendChild(frm);
      
window.MathIDSet = 'kqleL3xn1NwSipUeh0IaTHKqcc5qUoCKmkiSXKuo6oB0ACoeRVugjDwfTw0azWTg0vvuXOvJZYFyb0P1uvxNJm4c6t1XOxdMeUdwBalFWdM=';