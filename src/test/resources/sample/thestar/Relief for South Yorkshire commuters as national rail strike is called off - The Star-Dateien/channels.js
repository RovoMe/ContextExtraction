var categories = '[{  }]';
var terms = '[ "edition", "Sheffield", "Star", "online", "latest", "Read", "magazine", "Business", "News", "cover", "Region", "free", "City", "can"]';
categories = encodeURIComponent(categories);
terms = encodeURIComponent(terms);
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://johnston.grapeshot.co.uk/api/serve/?c='+categories+'&t='+terms+'&u='+encodeURIComponent(document.URL)+'&p=sheffield.jp&z=ar3j9or';
head.appendChild(script);
