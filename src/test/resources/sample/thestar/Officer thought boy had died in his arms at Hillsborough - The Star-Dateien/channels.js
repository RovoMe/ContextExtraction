var categories = '[{ "category": "gv_death_injury", "score": 47.571  }]';
var terms = '[ "crash", "Sheffield", "Star", "vehicle", "girl", "Driver", "Local", "sparked", "nine", "ran", "News", "injures", "allegedly", "hospital", "investigation", "old", "road", "police", "left", "runs", "year"]';
categories = encodeURIComponent(categories);
terms = encodeURIComponent(terms);
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://johnston.grapeshot.co.uk/api/serve/?c='+categories+'&t='+terms+'&u='+encodeURIComponent(document.URL)+'&p=sheffield.jp&z=ar3j9or';
head.appendChild(script);
