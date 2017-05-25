(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ElementTracker = require('./lib/element-tracker');
var initReport     = require('./lib/init-report');
var trackScrolling = require('./lib/track-scrolling');
var scrollDepth    = require('./lib/scroll-depth');
var _ads            = require('./lib/ads');
var _utils         = require('./util/utils');

var _omniture = require('./lib/analytics-services/omniture');
var _comscore = require('./lib/analytics-services/comscore');
var _chartbeat = require('./lib/analytics-services/chartbeat');
var _effectiveMeasure = require('./lib/analytics-services/effective-measure');
var _signalTracker = require('./lib/signal-tracker');
var _loxodo = require('./lib/analytics-services/lox');

(function($){
	TWP = window.TWP || {};
	TWP.Analytics = TWP.Analytics || {};
	TWP.Analytics.report = TWP.Analytics.report || {};
	TWP.Analytics.isMobile = TWP.Analytics.isMobile || _utils.isMobile;
	TWP.Analytics.checkAds = TWP.Analytics.checkAds || _ads.check;
	TWP.Analytics.init = TWP.Analytics.init || function(config) {
		if (typeof this.readyState === 'undefined') this.readyState = false;
		
		config = config || {};
		TWP.Analytics.config = $.extend(true, {
			suite: 'production',
			service: {
				omniture: true,
				omnitureTest: false,
				//comscore: (self === top) || _utils.isExternalEmbed(),
				comscore: true,
				effectiveMeasure: true,
				chartbeat: self===top,
				signalTracker: true
			},
			suppressTrackPageLoad: false
		}, config);

		// Needs to be set early for ads
		if (!window.wp_pvid) {
			wp_pvid = Math.round( Math.random()*Math.pow(10,13) )+'-'+new Date().getTime();
		}

		if (!! TWP.Analytics.config.service.signalTracker ) {
			_signalTracker.init();
		}

		if (!! (TWP.Analytics.config.service.omniture || TWP.Analytics.config.service.omnitureTest) ) {
			TWP.Analytics.initOmniture();
		}

		if (!! TWP.Analytics.config.service.comscore ) {
			TWP.Analytics.initComScore();
		}

		if (!! TWP.Analytics.config.service.chartbeat ) {
			TWP.Analytics.initChartbeat();
		}

		if (!! TWP.Analytics.config.service.effectiveMeasure ) {
			TWP.Analytics.initEffectiveMeasure();
		}

		TWP.Analytics.initReport();
	};

	TWP.Analytics.initOmniture = TWP.Analytics.initOmniture || _omniture.init;
	TWP.Analytics.omnitureReady = TWP.Analytics.omnitureReady || function(cb) { return _omniture.state.ready(cb); };
	TWP.Analytics.report.omniture = {
		name: 'Omniture',
		on: false
	};

	TWP.Analytics.initComScore = TWP.Analytics.initComScore || _comscore.init;
	TWP.Analytics.report.comscore = {
		name: 'comScore',
		on: false
	};

	TWP.Analytics.initChartbeat = TWP.Analytics.initChartbeat || _chartbeat.init;
	TWP.Analytics.report.chartbeat = {
		name: 'Chartbeat',
		on: false
	};

	TWP.Analytics.initEffectiveMeasure = TWP.Analytics.initEffectiveMeasure || _effectiveMeasure.init;
	TWP.Analytics.report.effectiveMeasure = {
		name: 'Effective Measure',
		on: false
	};

	TWP.Analytics.loxodo = _loxodo.implementation;

	TWP.Analytics.signalTracker = TWP.Analytics.signalTracker || _signalTracker;
	TWP.Analytics.trackScrolling = TWP.Analytics.trackScrolling || trackScrolling;
	TWP.Analytics.scrollDepth = TWP.Analytics.scrollDepth || scrollDepth;
	TWP.Analytics.ElementTracker = TWP.Analytics.ElementTracker || ElementTracker;
	TWP.Analytics.initReport = TWP.Analytics.initReport || initReport;

})(jQuery);

},{"./lib/ads":2,"./lib/analytics-services/chartbeat":3,"./lib/analytics-services/comscore":5,"./lib/analytics-services/effective-measure":8,"./lib/analytics-services/lox":11,"./lib/analytics-services/omniture":14,"./lib/element-tracker":18,"./lib/init-report":19,"./lib/scroll-depth":20,"./lib/signal-tracker":21,"./lib/track-scrolling":23,"./util/utils":24}],2:[function(require,module,exports){
var _utils = require('../util/utils');

module.exports = {
	check: checkAds
}

function checkAds(timeout) {
	
	var adIds = {
		desktop: ['#slug_leaderboard', '#slug_flex_ss_bb_hp', '#slug_leaderboard_bottom', '#slug_inline_bb'],
		mobile: ['#slug_fixedBottom', '#slug_mob_bigbox']
	};

	var deferred = jQuery.Deferred();
	var blockerDetected = false;
	var adElements = [];

	setTimeout(function() {
			
		var ids = _utils.isMobile() ? adIds.mobile : adIds.desktop;

		for (var i = 0; i < ids.length; i++) {
			var adId = ids[i];
			var adElem = jQuery(adId);
			if (adElem[0]) adElements.push(adElem);
		}

		if (!adElements.length > 0) {
			blockerDetected = true;
		}

		for (var i = 0; i < adElements.length; i++) {
			(function($element) {

				var element = $element[0];
				var iframeChild = $element.children('iframe');
				var elemId = $element.attr('id');
				var elemHeight = $element.height();
				var elemWidth = $element.width();

				if (!elemHeight > 0 || !elemWidth > 0) {
					blockerDetected = true;
				}

				if (window.getComputedStyle !== undefined) {

					var baitTemp = window.getComputedStyle(element, null);
					if (baitTemp.getPropertyValue('display') == 'none'
					|| baitTemp.getPropertyValue('visibility') == 'hidden') {
						blockerDetected = true;
					}

				}

			}(adElements[i]))
		}

		deferred.resolve(blockerDetected);
	}, timeout);

	return deferred.promise();
}

},{"../util/utils":24}],3:[function(require,module,exports){
var init = require('./init');

module.exports = {
  init: init
};

},{"./init":4}],4:[function(require,module,exports){
var _utils = require('../../../util/utils');

var tref = _utils.getQueryParam('tref');

function getChartbeatUrl(trackingType) {
  var _protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
  var scriptPath;
  switch(trackingType) {
    case 'fbinstant':
      scriptPath = 'static2.chartbeat.com/js/chartbeat_fiadev.js';
      break;
    default:
      scriptPath = 'static.chartbeat.com/js/chartbeat.js';
  }

  return _protocol + scriptPath;
}

module.exports = function initChartbeat(config) {
  TWP.Analytics.report.chartbeat.on = true;
  TWP.Analytics.report.chartbeat.loaded = false;
  
  // NOTE: START Global variable
  window._sf_startpt = (new Date()).getTime();
  
  _sf_async_config = window._sf_async_config || {};
  _sf_async_config = jQuery.extend({
    uid: 19624,
    domain: "washingtonpost.com",
    playerdomain: "www.washingtonpost.com",
    sections: _getChartbeatSections(),
    authors: _getChartbeatAuthors(),
    path: _getChartbeatPath(),
    title: _getChartbeatTitle(),
    useCanonical: (window.wp_meta_data&&wp_meta_data.isErrorPage) ? false : true
  }, _sf_async_config);
  // NOTE: END Global variable

  function _getChartbeatSections() {
    var sections = [];
    var section = (!!window.wp_section) ? wp_section : (TWP.Data&&TWP.Data.Tracking) ? TWP.Data.Tracking.props.section : (window.thisNode) ? thisNode.split('/')[0] : "";
    if (!!section) sections.push(section);
    
    var blogname = (!!window.wp_blogname) ? wp_blogname : (TWP.Data&&TWP.Data.Tracking) ? TWP.Data.Tracking.props.blogname : "";
    if (!!blogname) sections.push(blogname);
    
    var contentType = (!!window.wp_content_type) ? wp_content_type : (TWP.Data&&TWP.Data.Tracking) ? TWP.Data.Tracking.props.content_type : "";
    if (!!contentType) {
      var contentTypeWhiteList = ['article', 'gallery', 'video', 'graphic', 'discussion', 'quiz', 'knowledge quiz', 'personality quiz', 'kindle', 'topic', 'interactive graphics'];
      if (contentType === 'blog') contentType = 'article';
      if (contentTypeWhiteList.indexOf(contentType) != -1) sections.push(contentType);
    }
    
    return sections.join(',') || "no category";
  }

  function _getChartbeatAuthors() {
    var authorList = '';
    
    if (!!window.wp_author) {
      authorList = wp_author;
    } else if (TWP.Data&&TWP.Data.Tracking&&TWP.Data.Tracking.props&&!!TWP.Data.Tracking.props.author) {
      authorList = TWP.Data.Tracking.props.author;
    }
    
    return authorList.split('; ').join(',') || 'no author';
  }

  function _getChartbeatPath() {
    var path = window.document.location.pathname.split(';jsessionid=')[0];
    if (!!tref) path += ('?tref=' + tref);
    return path;
  }

  function _getChartbeatTitle() {
    return (window.wp_meta_data && wp_meta_data.isHomepage) ? "Homepage" : "";
  }

  jQuery(document).ready(function() {
    var _chartbeatUrl = getChartbeatUrl(tref);
    
    jQuery.ajax(_chartbeatUrl, {
      dataType: "script",
      cache: true,
      success: function() {
        TWP.Analytics.report.chartbeat.loaded = true;
      }
    });
  });
};

},{"../../../util/utils":24}],5:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./init":6,"dup":3}],6:[function(require,module,exports){
module.exports = function initComScore(config) {
  TWP.Analytics.report.comscore.on = true;
  TWP.Analytics.report.comscore.loaded = false;
  
  // NOTE: START Global variable
  _comscore = window._comscore || [];
  _comscore.push({ c1: "2", c2: "3005617" });
  // NOTE: END Global variable
  
  jQuery(document).ready(function(){
    var _comscoreUrl = ( ("https:" == document.location.protocol) ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";
    
    jQuery.ajax(_comscoreUrl, {
      dataType: "script",
      cache: true,
      success: function(){
        TWP.Analytics.report.comscore.loaded = true;
      }
    });
  });
};

},{}],7:[function(require,module,exports){
module.exports = {
	sendPageView: function() {
		window._em && _em.trackAjaxPageview && _em.trackAjaxPageview()
	}
};

},{}],8:[function(require,module,exports){
var init = require('./init');
var implementation = require('./implementation');

module.exports = {
  init: init,
  sendPageView: implementation.sendPageView
};

},{"./implementation":7,"./init":9}],9:[function(require,module,exports){
module.exports = function initEffectiveMeasure(config) {
  TWP.Analytics.report.effectiveMeasure.on = true;
  TWP.Analytics.report.effectiveMeasure.loaded = false;

  var _em = document.createElement('script'); _em.type = 'text/javascript'; _em.async = true;
  _em.src = ('https:' == document.location.protocol ? 'https://me-ssl' : 'http://me-cdn') + '.effectivemeasure.net/em.js';
  var _script = document.getElementsByTagName('script')[0]; _script.parentNode.insertBefore(_em, _script);

  _em.onload = function() {
    TWP.Analytics.report.effectiveMeasure.loaded = true;
  };
};

},{}],10:[function(require,module,exports){
var _utils = require('../../../util/utils');
var logger = require('./logger');

var endpoint = 'https://cdn-api.arcpublishing.com/v1.0/loxodo/datapoint/save';

// wp loxodo config
// ================
var orgId = 'wpniwashpostcom';
var siteId = !!window.wp_site ? wp_site : 'www.washingtonpost.com';

// uuid storage keys
// =================
var UID_KEY = 'wp_vi';
var IID_KEY = 'lox_iid';
var SID_KEY = 'lox_sid';

// uuids
// =====
var uid = getUUID(); // user
var iid = generateUUID(); // interaction
var sid = getPersistentUUID(SID_KEY); // session

module.exports = {
  extract: extract,
  sendData: sendData,
  getIID: getIID,
  getUID: getUID,
  getSID: getSID
};

function extract(obj, options) {

  var extraction = {};

  if (typeof obj !== 'object') return extraction;

  var linkTrackVars = obj.linkTrackVars;

  var dataPattern = /pageName|prop|eVar|channel|hier|pageType|list|events|products|campaign/;
  var metaDataPattern = /referrer|server|NameSpace|zip|browser|resolution|purchaseID|^u$|plugins|pageURL|linkTypecolorDepth|trackingServer|^un$|cookies|java|currencyCode/;

  for (var key in obj) {
    var val = obj[key];
    
    if (typeof val != 'function' && !!val) {
      if (key.match(metaDataPattern)) {

        extraction[key] = val;
      
      } else if (key.match(dataPattern)) {

        if (options && options.partial) {
          if (linkTrackVars.indexOf(key) > -1)
            extraction[key] = val;
        } else {
          extraction[key] = val;
        }

      }
    }
  }

  if ('events' in extraction && typeof extraction.events === 'string')
    extraction.events = extraction.events.split(',');

  extraction = Object.keys(extraction).length ? extraction : null;

  return extraction;
}

function getUUID() {
  var uuid = getPersistentUUID(UID_KEY);
	if (!uuid) {
		uuid = generateUUID();
		setPersistentUUID(UID_KEY, uuid);
	}

  return uuid;
}

function getPersistentUUID(localStorageKey) {
	return _utils.readValue(localStorageKey);
}

function setPersistentUUID(localStorageKey, value) {
	return _utils.persistValue(localStorageKey, value);
}

function generateUUID(){
  var d = new Date().getTime();
  
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r&0x3 | 0x8)).toString(16);
  });

  return uuid;
}

function processData(data) {
  try {
    return JSON.stringify(data);
  } catch(e) {
    logger.error(e);
    return JSON.stringify({ prop30: 'Client: bad data' });
  }
}

function sendData(data, options) {
  // disable loxodo in embedded content
  if (window.self !== window.top) {
    return;
  }

  logger.log('sd');

  if (!!options && typeof options === 'object') {
    if ('mode' in options) {
      if (!('eventType' in data)) {
        data.eventType = options.mode;
      }
    }
  } else {
    throw new Error("sendData - options parameter must be an object");
  }

  if (data.eventType === 'pv') {
    iid = generateUUID();
  }

  data.orgId = orgId;
  data.siteId = siteId;

	if (!!uid) data.uid = uid;
	if (!!iid) data.iid = iid;
	if (!!sid) data.sid = sid;

  var payload = processData(data);

  var ajaxOptions = {
    type: "POST",
    url: endpoint,
    data: payload,
    contentType: 'application/json; charset=utf-8'
  };

  return jQuery.ajax(ajaxOptions)
    .then(function(response) {
			uid = (!!response && !!response.uid) ? response.uid : uid;
			iid = (!!response && !!response.iid) ? response.iid : iid;
			sid = (!!response && !!response.sid) ? response.sid : sid;

			setPersistentUUID(UID_KEY, uid);
			setPersistentUUID(IID_KEY, iid);
			setPersistentUUID(SID_KEY, sid);
      logger.log('sd success:', response);
    })

    .then(null, function(error) {
      logger.error("sd failure:", error);
    });
}

function getIID() {
  return iid;
}

function getUID() {
  return uid;
}

function getSID() {
	return sid;
}

},{"../../../util/utils":24,"./logger":12}],11:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = {
  implementation: implementation
};

},{"./implementation":10}],12:[function(require,module,exports){
var _utils = require('../../../util/utils');
module.exports = new _utils.Log({
  namespace: "LOXODO",
  fmtOptions: {
    "color": "#27ae60",
    "font-weight": "bold",
    "text-decoration": "underline"
  }
});

},{"../../../util/utils":24}],13:[function(require,module,exports){
var effectiveMeasure = require('../effective-measure');
var omnitureState = require('./state');
var internal      = require('../lox').implementation;
// var scrollDepth   = require('../../scroll-depth');
var _utils        = require('../../../util/utils');
var logger        = require('./logger');

var comscoreLogger = new _utils.Log({
  namespace: "COMSCORE",
  fmtOptions: {
    "color": "#8e44ad",
    "font-weight": "bold",
    "text-decoration": "underline"
  }
});

var twpOmnitureInitialized = false;

module.exports    = loadOmniture;

function loadOmniture(config) {
  /* SiteCatalyst code version: H.24.2.
  Copyright 1997-2007 Omniture, Inc. More info available at
  http://www.omniture.com */
  /************************ ADDITIONAL FEATURES ************************
       Plugins
  */
  /* Specify the Report Suite ID(s) to track here */
  window.s_account = window.s_account || "wpniwashpostcom";
  window.s = s_gi(s_account);
  
  /************************** CONFIG SECTION **************************/
  /* You may add or alter any code config here. */
  /* E-commerce Config */
  s.currencyCode = "USD"
  /* Link Tracking Config */
  s.trackDownloadLinks = true
  s.trackExternalLinks = true
  s.trackInlineStats = true
  s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,doc,pdf,xls,ics"
  s.linkInternalFilters = "javascript:,washingtonpost.com,www.facebook.com/plugins," + window.location.host
  s.linkLeaveQueryString = false
  s.linkTrackVars = "server"
  s.linkTrackEvents = "None"

  // DST dates for time parting
  s.dstStart = "03/11/2012";
  s.dstEnd = "11/04/2012";

  /* Plugin Config */
  s.usePlugins = true

  function s_doPlugins(s) {
    /* Add calls to plugins here */

    // var URL = window.location.host + window.location.pathname;
    
    /* Plugin Example: getQueryParam v2.0 */
    if (typeof s.campaign == 'undefined' || (typeof s.campaign == 'string' && s.campaign == '')) {
  		if (!!s.getQueryParam('wpsrc')) {
  			s.campaign = s.getQueryParam('wpsrc');
  		} else if (!!s.getQueryParam('wpmk')) {
  			s.campaign = s.getQueryParam('wpmk');
  		} else if (!!s.getQueryParam('wpmm')) {
  			s.campaign = s.getQueryParam('wpmm');
  		}
  	}

    if (typeof s.eVar3 == 'undefined' || (typeof s.eVar3 == 'string' && s.eVar3 == ''))
      s.eVar3 = s.getQueryParam('wpisrc');
    
    if (!document.referrer.toString().match(/washingtonpost\.com/))
      s.eVar29 = s.getQueryParam('wprss');

    /* Plugin Example: getValOnce v0.2 */
  	s.campaign = s.getValOnce(s.campaign,"s_campaign",0);
    s.eVar3 = s.getValOnce(s.eVar3, 's_eVar3', 0);
    s.eVar29 = s.getValOnce(s.eVar29, 's_eVar29', 0);

    /* Set event1 (page view) on every non-iframed page */
    /* Set event32 on every iframed page */
    /* unless wp_suppressDefaultEvent === true */
    
    wp_defaultEvents = (s.isNotIframe() ? 'event1' : 'event32') + ',event105'; // event105: UPC
    wp_events = !!window.wp_events ? wp_events : '';
    wp_events = !!window.wp_suppressDefaultEvent ? wp_events : wp_defaultEvents + ',' + wp_events;
    s.events = !!s.events ? s.events : s.getUniqueEvents(wp_events);

    /* Set eVar 1 & 2 to PN and Channel  */
    s.eVar1 = (typeof(wp_evar1) != "undefined") ? wp_evar1 : s.pageName;
    s.eVar2 = (typeof(wp_evar2) != "undefined") ? wp_evar2 : s.channel;
    /*
  		5/30/2012 - CRK Added wp_evar1 and wp_evar2 for iframe video
    */

    /* Set eVar11 to prop25 (blog name) */
    s.eVar11 = (typeof s.prop25 != "undefined") ? s.prop25 : '';

    /* Set DSLV & New vs Repeat  */
    try {
      s.prop18 = s.getNewRepeat();
    } catch (e) {
      s.prop18 = "nocategory";
      // s.prop18=e.description;
      // alert("Error calling s.getNewRepeat(): "+e.description );
    }

    s.prop17 = s.getDaysSinceLastVisit('s_lv');
    s.prop17 = s.getAndPersistValue(s.prop17, 's_dslv', 0);
    s.eVar14 = s.prop18;
    s.eVar15 = s.prop17;

    /* Get Visit Num */
    try {
      s.eVar16 = s.getVisitNum('m', 's_vmonthnum', 's_monthinvisit');
    } catch (e) {
      s.eVar16 = "nocategory";
      // s.eVar16=e.description;
      // alert("Error calling s.getVisitNum(): "+e.description );
    }

    /* Plugin Example: timeparting - EST - hour,day,weekday */
    var wp_current_year = new Date().getFullYear() + '';
    s.prop8 = s.getTimeParting('d', '-5', wp_current_year);
    s.prop9 = s.getTimeParting('h', '-5', wp_current_year);
    s.prop10 = s.getTimeParting('w', '-5', wp_current_year);
    // Ideally, we'd capture the year with an SSI, but because thise file is used on servers where SSIs might not be supported, not doing that.

    /* Set hierarchy to prop23 */
    s.prop23 = s.hier1;

    /* Set eVar18 to entry content type */
    var ct = s.prop3
    var isEP = s.c_r('s_wp_ep');
    if (!isEP && ct) {
      s.c_w('s_wp_ep', ct, 0)
      s.eVar18 = ct;
    }

    /* Look for Navigation ID - Set prop28 & 29 */
    var pp = s.getPreviousPage();
    var ppn = s.getPreviousValue(s.pageName, 'gvp_p5');
    var nid = s.getQueryParam('nid')
    if (nid) {
      s.prop28 = nid;
    }
    s.prop29 = ppn;

    var ppv;
    try {
      ppv = s.getPercentPageViewed(s.pageName);
    } catch(e) {
      logger.error('initialized before ready.');
    }
    // true if prev page id matches prev page name
    if (ppv && typeof ppv === 'object' && ppv[0] === ppn) {
      // initial_percent_viewed|max_percent_viewed
      var p61 = [ppv[2], ppv[1]].join('|');
      s.prop61 = p61;
    }

    /* Look for Navigation ID - Set prop28 & 29 */
    var ppc = s.getPreviousValue(s.channel, 'gvp_p51');
    ppc = (!ppc) ? 'entry' : ppc;
    s.prop51 = ppc + '>' + s.channel;

    /* Look for homepage id - Set prop 27 if HP value is previous page */
    var hpid = s.getQueryParam('hpid');
    if (hpid && (ppn == "wp - homepage" || ppn == "wp - homepage - regional")) {
      s.prop27 = hpid;
      s.eVar19 = s.prop27;
    }

    var hpv = s.getQueryParam('hpv'); //multimedia check
    if (hpid && hpv == "national") {
      pp = "wp - homepage";
      s.prop27 = pp + ' - ' + hpid;
      s.eVar19 = s.prop27;
    }

    if (hpid && hpv == "default") {
      pp = "wp - homepage";
      s.prop27 = pp + ' - ' + hpid;
      s.eVar19 = s.prop27;
    }

    if (hpid && hpv == "override") {
      pp = "wp - homepage";
      s.prop27 = pp + ' - ' + hpid;
      s.eVar19 = s.prop27;
    }

    if (s.server == "washingtonpost.com jobs") {
      s.eVar4 = s.prop6
    }

    var temp1 = s.getQueryParam('reload');
    var temp2 = s.getQueryParam('sub');
    if (temp1 == "true") {
      s.prop31 = "site reload"
    };

    if (temp2 && temp2.toLowerCase() == "ar") {
      s.prop31 = "completed sign in"
    }

    if (temp2 && temp2.toLowerCase() == "new") {
      s.prop31 = "completed registration"
    }

    if (typeof s.prop20 == 'undefined'){
      s.prop20 = s.getQueryParam('tid');
      s.eVar20 = s.prop20;
    }

    if (typeof s.prop20 == 'undefined'){
      s.prop20 = s.getQueryParam('fb_Ref');
      s.eVar20 = s.prop20;
    }

    if (!s.eVar31) {
      if (navigator.userAgent.match(/(iPad|SCH-I800|PlayBook|A500|Kindle)/i)) {
        s.eVar31 = "tablet";
      } else {
        s.eVar31 = "desktop";
      }
    }

    /* Facebook Referral Tracking */
    /* Turned off for Spring 2011 release
    	s.eVar9=s.facebookSocialReferrers();
    	s.eVar9=s.getValOnce(s.eVar9,"s_fr",0);
    	s.events=s.eVar9?s.apl(s.events,'event14',',',2):s.events;
    	s.eVar6=s.getPreviousValue(s.pageName,'gvp_pn');
    */

    /* Set event20 as visit entry event (wether the referrer is external, or the page is a direct load) */
    s._referrer = s._2referrer = s.referrer ? s.referrer : document.referrer;
    if (!s._referrer) {
      s._referrer = s._2referrer = s._entry = "Direct-Load";
    }

    if (s._referrer) {
      s._referrer = s._referrer.indexOf('?') > -1 ? s._referrer.substring("0", s._referrer.indexOf('?')) : s._referrer;
      s._urlCheck = s.split(s.linkInternalFilters, ",");
      s._urlCheckLength = s._urlCheck.length - 1;
      for (s._for = 0; s._for <= s._urlCheckLength; s._for++) {
        s._urlReferrer = s._referrer.indexOf(s._urlCheck[s._for]) > -1 ? "1" : "0";
        if (s._urlReferrer == "1") {
          s._entry = "0";
        }
      }
    }

    if (s._entry != "0") {
      s._referrerPass = s._2referrer;
      s._referrerPass = s.getValOnce(s._referrerPass, 's._ref', 0);
      if (s._referrerPass) {
        s.events = s.apl(s.events, 'event20', ',', 2)
      }
    }

    /* New vs Repeat  */
    if (s.pageName == "wp - homepage - local") {
      try {
        s.prop15 = s.getNewRepeat('', 's_npr');
      } catch (e) {
        s.prop15 = "nocategory";
        // s.prop15=e.description;
        // alert("Error calling s.getNewRepeat('','s_npr'): "+e.description );
      }
    }

    // Commented out: 3/14/2013 by CRK
    // s.measurementPlugin(13049183,'washingtonpost2',1);

		// sailthru user uuid
		var sailthruUid = s.getQueryParam('uid');
		if (!!sailthruUid) {
			s.eVar34 = sailthruUid;
		}

  }
  s.doPlugins = s_doPlugins
  /************************** PLUGINS SECTION *************************/
  /* You may insert any plugins you wish to use here.                 */
  /*
   * facebookSocialReferrers v1.0 - stopping the referrer inflation and tracking this in another var
   */
  /* Turned off for Spring 2011 release
  s.facebookSocialReferrers=new Function("l",""
  +"var s=this,g,i,j,m,n,d,x,a,q,r,T,Y,f,P,b,c;x=g=s.referrer?s.referre"
  +"r:document.referrer;g=g.toLowerCase();if(g){z=g.indexOf('?');i=z>-1"
  +"?z:g.length;j=g.substring(0,i);a=s.facebookSocial;a=s.split(a,'>');"
  +"for(m=0;m<a.length;m++){q=s.split(a[m],'|');r=s.split(q[1],',');for"
  +"(T=0;T<r.length;T++){Y=r[T].toLowerCase();i=j.indexOf(Y);if(i>-1){f"
  +"=s.getQueryParam('u','',g);if(f){P=q[0];d=s.linkInternalFilters.toL"
  +"owerCase();d=s.split(d,',');l=l?l-1:1;s.referrer=d[l]}}}}}return P");
  */

  /*
   * getUniqueEvents
   */
  s.getUniqueEvents = function(events) {
    events = !! events ? events.split(',') : '';
    var u = {}, a = [];
    
    for (var i = 0, l = events.length; i < l; ++i) {
      var e = events[i].replace(/^\s+|\s$/g, '');
      
      if (typeof u[e] == 'undefined' && e != '') {
        u[e] = 1;
        a.push(e);
      }
    }

    return a.sort().join(',');
  };

  /*
   * Plugin: getValOnce_v1.0
   */
  s.getValOnce = new Function("v", "c", "e", "" + "var s=this,a=new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c" + ");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return" + " v==k?'':v");

  /*
   * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
   */
  s.split = new Function("l", "d", "" + "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x" + "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
  /*
   * Plugin Utility: apl v1.1
   */
  s.apl = new Function("L", "v", "d", "u", "" + "var s=this,m=0;if(!L)L='';if(u){var i,n,a=s.split(L,d);for(i=0;i<a." + "length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas" + "e()));}}if(!m)L=L?L+d+v:v;return L");

  /*
   * Plugin: getQueryParam 2.4
   */
  s.getQueryParam = new Function("p", "d", "u", "h", "" + "var s=this,v='',i,j,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.loca" + "tion);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0" + "?p.length:i;t=s.p_gpv(p.substring(0,i),u+'',h);if(t){t=t.indexOf('#" + "')>-1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substrin" + "g(i==p.length?i:i+1)}return v");
  s.p_gpv = new Function("k", "u", "h", "" + "var s=this,v='',q;j=h==1?'#':'?';i=u.indexOf(j);if(k&&i>-1){q=u.sub" + "string(i+1);v=s.pt(q,'&','p_gvf',k)}return v");
  s.p_gvf = new Function("t", "k", "" + "if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T" + "rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s." + "epa(v)}return''");

  /*
   * Plugin: getAndPersistValue 0.3 - get a value on every page
   */
  s.getAndPersistValue = new Function("v", "c", "e", "" + "var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if(" + "v)s.c_w(c,v,e?a:0);return s.c_r(c);");

  /*
   * Plugin: Days since last Visit 1.1.H - capture time from last visit
   */
  s.getDaysSinceLastVisit = new Function("c", "" + "var s=this,e=new Date(),es=new Date(),cval,cval_s,cval_ss,ct=e.getT" + "ime(),day=24*60*60*1000,f1,f2,f3,f4,f5;e.setTime(ct+3*365*day);es.s" + "etTime(ct+30*60*1000);f0='Cookies Not Supported';f1='First Visit';f" + "2='More than 30 days';f3='More than 7 days';f4='Less than 7 days';f" + "5='Less than 1 day';cval=s.c_r(c);if(cval.length==0){s.c_w(c,ct,e);" + "s.c_w(c+'_s',f1,es);}else{var d=ct-cval;if(d>30*60*1000){if(d>30*da" + "y){s.c_w(c,ct,e);s.c_w(c+'_s',f2,es);}else if(d<30*day+1 && d>7*day" + "){s.c_w(c,ct,e);s.c_w(c+'_s',f3,es);}else if(d<7*day+1 && d>day){s." + "c_w(c,ct,e);s.c_w(c+'_s',f4,es);}else if(d<day+1){s.c_w(c,ct,e);s.c" + "_w(c+'_s',f5,es);}}else{s.c_w(c,ct,e);cval_ss=s.c_r(c+'_s');s.c_w(c" + "+'_s',cval_ss,es);}}cval_s=s.c_r(c+'_s');if(cval_s.length==0) retur" + "n f0;else if(cval_s!=f1&&cval_s!=f2&&cval_s!=f3&&cval_s!=f4&&cval_s" + "!=f5) return '';else return cval_s;");

  /*                                                                  
   * Plugin: getVisitNum - version 3.0
   */
  s.getVisitNum = new Function("tp", "c", "c2", "" + "var s=this,e=new Date,cval,cvisit,ct=e.getTime(),d;if(!tp){tp='m';}" + "if(tp=='m'||tp=='w'||tp=='d'){eo=s.endof(tp),y=eo.getTime();e.setTi" + "me(y);}else {d=tp*86400000;e.setTime(ct+d);}if(!c){c='s_vnum';}if(!" + "c2){c2='s_invisit';}cval=s.c_r(c);if(cval){var i=cval.indexOf('&vn=" + "'),str=cval.substring(i+4,cval.length),k;}cvisit=s.c_r(c2);if(cvisi" + "t){if(str){e.setTime(ct+1800000);s.c_w(c2,'true',e);return str;}els" + "e {return 'unknown visit number';}}else {if(str){str++;k=cval.substri" + "ng(0,i);e.setTime(k);s.c_w(c,k+'&vn='+str,e);e.setTime(ct+1800000);" + "s.c_w(c2,'true',e);return str;}else {s.c_w(c,e.getTime()+'&vn=1',e)" + ";e.setTime(ct+1800000);s.c_w(c2,'true',e);return 1;}}");
  s.dimo = new Function("m", "y", "" + "var d=new Date(y,m+1,0);return d.getDate();");
  s.endof = new Function("x", "" + "var t=new Date;t.setHours(0);t.setMinutes(0);t.setSeconds(0);if(x==" + "'m'){d=s.dimo(t.getMonth(),t.getFullYear())-t.getDate()+1;}else if(" + "x=='w'){d=7-t.getDay();}else {d=1;}t.setDate(t.getDate()+d);return " + "t;");

  /*
   * Plugin: getPercentPageViewed v1.71
   */
  s.getPercentPageViewed=new Function("n","" + "var s=this,W=window,EL=W.addEventListener,AE=W.attachEvent,E=['load" + "','unload','scroll','resize','zoom','keyup','mouseup','touchend','o" + "rientationchange','pan'];W.s_Obj=s;s_PPVid=(n=='-'?s.pageName:n)||s" + ".pageName||location.href;if(!W.s_PPVevent){s.s_PPVg=function(n,r){v" + "ar k='s_ppv',p=k+'l',c=s.c_r(n||r?k:p),a=c.indexOf(',')>-1?c.split(" + "',',10):[''],l=a.length,i;a[0]=unescape(a[0]);r=r||(n&&n!=a[0])||0;" + "a.length=10;if(typeof a[0]!='string')a[0]='';for(i=1;i<10;i++)a[i]=" + "!r&&i<l?parseInt(a[i])||0:0;if(l<10||typeof a[9]!='string')a[9]='';" + "if(r){s.c_w(p,c);s.c_w(k,'?')}return a};W.s_PPVevent=function(e){va" + "r W=window,D=document,B=D.body,E=D.documentElement,S=window.screen|" + "|0,Ho='offsetHeight',Hs='scrollHeight',Ts='scrollTop',Wc='clientWid" + "th',Hc='clientHeight',C=100,M=Math,J='object',N='number',s=W.s_Obj|" + "|W.s||0;e=e&&typeof e==J?e.type||'':'';if(!e.indexOf('on'))e=e.subs" + "tring(2);s_PPVi=W.s_PPVi||0;if(W.s_PPVt&&!e){clearTimeout(s_PPVt);s" + "_PPVt=0;if(s_PPVi<2)s_PPVi++}if(typeof s==J){var h=M.max(B[Hs]||E[H" + "s],B[Ho]||E[Ho],B[Hc]||E[Hc]),X=W.innerWidth||E[Wc]||B[Wc]||0,Y=W.i" + "nnerHeight||E[Hc]||B[Hc]||0,x=S?S.width:0,y=S?S.height:0,r=M.round(" + "C*(W.devicePixelRatio||1))/C,b=(D.pageYOffset||E[Ts]||B[Ts]||0)+Y,p" + "=h>0&&b>0?M.round(C*b/h):0,O=W.orientation,o=!isNaN(O)?M.abs(o)%180" + ":Y>X?0:90,L=e=='load'||s_PPVi<1,a=s.s_PPVg(s_PPVid,L),V=function(i," + "v,f,n){i=parseInt(typeof a==J&&a.length>i?a[i]:'0')||0;v=typeof v!=" + "N?i:v;v=f||v>i?v:i;return n?v:v>C?C:v<0?0:v};if(new RegExp('(iPod|i" + "Pad|iPhone)').exec(navigator.userAgent||'')&&o){o=x;x=y;y=o}o=o?'P'" + ":'L';a[9]=L?'':a[9].substring(0,1);s.c_w('s_ppv',escape(W.s_PPVid)+" + "','+V(1,p,L)+','+(L||!V(2)?p:V(2))+','+V(3,b,L,1)+','+X+','+Y+','+x" + "+','+y+','+r+','+a[9]+(a[9]==o?'':o))}if(!W.s_PPVt&&e!='unload')W.s" + "_PPVt=setTimeout(W.s_PPVevent,333)};for(var f=W.s_PPVevent,i=0;i<E." + "length;i++)if(EL)EL(E[i],f,false);else if(AE)AE('on'+E[i],f);f()};v" + "ar a=s.s_PPVg();return!n||n=='-'?a[1]:a");

  /*
   * Plugin: getTimeParting 2.0
   */
  s.getTimeParting = new Function("t", "z", "y", "l", "" + "var s=this,d,A,U,X,Z,W,B,C,D,Y;d=new Date();A=d.getFullYear();Y=U=S" + "tring(A);if(s.dstStart&&s.dstEnd){B=s.dstStart;C=s.dstEnd}else{;U=U" + ".substring(2,4);X='090801|101407|111306|121104|131003|140902|150801" + "|161306|171205|181104|191003';X=s.split(X,'|');for(W=0;W<=10;W++){Z" + "=X[W].substring(0,2);if(U==Z){B=X[W].substring(2,4);C=X[W].substrin" + "g(4,6)}}if(!B||!C){B='08';C='01'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;}D" + "=new Date('1/1/2000');if(D.getDay()!=6||D.getMonth()!=0){return'Dat" + "a Not Available'}else{z=z?z:'0';z=parseFloat(z);B=new Date(B);C=new" + " Date(C);W=new Date();if(W>B&&W<C&&l!='0'){z=z+1}W=W.getTime()+(W.g" + "etTimezoneOffset()*60000);W=new Date(W+(3600000*z));X=['Sunday','Mo" + "nday','Tuesday','Wednesday','Thursday','Friday','Saturday'];B=W.get" + "Hours();C=W.getMinutes();D=W.getDay();Z=X[D];U='AM';A='Weekday';X='" + "00';if(C>30){X='30'}if(B>=12){U='PM';B=B-12};if(B==0){B=12};if(D==6" + "||D==0){A='Weekend'}W=B+':'+X+U;if(y&&y!=Y){return'Data Not Availab" + "le'}else{if(t){if(t=='h'){return W}if(t=='d'){return Z}if(t=='w'){r" + "eturn A}}else{return Z+', '+W}}}");

  /*
   * Plugin: getPreviousValue_v1.0 - return previous value of designated
   *   variable (requires split utility)
   */
  s.getPreviousValue = new Function("v", "c", "el", "" + "var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el" + "){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i" + "){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)" + ":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?" + "s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");
  /*
   * Plugin: getPreviousPage_v1.1 - return previous page based on event list
   */
  s.getPreviousPage = new Function("el", "" + "var s=this,pid,i,j,e;if(el){if(s.events){while(el){if(pid){break;}i" + "=el.indexOf(',');i=i<0?el.length:i;e=s.events;while(e){j=e.indexOf(" + "',');j=j<0?e.length:j;if(e.substring(0,j)==el.substring(0,i)){pid=s" + ".p_gpp();}e=e.substring(j==e.length?j:j+1);}el=el.substring(i==el.l" + "ength?i:i+1);}}}else{pid=s.p_gpp();}return pid;");
  /*
   * Utility Function: p_gpp
   */
  s.p_gpp = new Function("" + "var s=this,p,i;p=s.rq(s.un);i=p.indexOf('pid=')+4;p=p.substring(i,p" + ".length);i=p.indexOf('&');p=p.substring(0,i);p=unescape(p);return p" + ";");
  /*
   * Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
   */
  s.getNewRepeat = new Function("d", "cn", "" + "var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:" + "'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length=" + "=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct" + "-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N" + "ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}");
  /*
   * Function - read combined cookies v 0.2
   */
  s.c_rr = s.c_r;
  s.c_r = new Function("k", "" + "var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;if(v)ret" + "urn v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;i=" + "c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';'" + ",i);m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:" + "m));if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.get" + "Time()){if(toxicOmnitureCounter<20){toxicOmnitureCounter++;d.setTim" + "e(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}else{toxicOmnitureC" + "ounter=0;throw new ThreateningStackOverflowException()}}return v;");
  /*
   * Function - write combined cookies v 0.2
   */
  s.c_wr = s.c_w;
  s.c_w = new Function("k", "v", "e", "" + "var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv," + "c,i,t;d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s" + ".ape(k);pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1){pv=pv.substr" + "ing(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);i=sv" + ".indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.i" + "ndexOf(';',i)+1);sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime())" + "{pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';pc=1;}}else{sv+=' '+k+'" + "='+s.ape(v)+';';sc=1;}if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t" + ".indexOf(';')!=-1){var t1=parseInt(t.substring(t.indexOf('|')+1,t.i" + "ndexOf(';')));t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.set" + "Time(ht);s.c_wr(pn,pv,d);}return v==s.c_r(s.epa(k));");
  /*
   * Function - Get Full Referring Domains
   */
  s.getFullReferringDomains = new Function("" + "var s=this,dr=window.document.referrer,n=s.linkInternalFilters.spli" + "t(',');if(dr){var r=dr.split('/')[2],l=n.length;for(i=0;i<=l;i++){i" + "f(r.indexOf(n[i])!=-1){r='';i=l+1;}}return r}");
  /*
   * Function - measurementPlugin
   */
  s.measurementPlugin = new Function("Z", "B", "N", "Y", "" + "var s=this,r,t,f,D,E,P,F,Q,G,H,j=Z+'&',c,d,l,S,C,T,U='',M,O=s._o2d," + "V,W,X,z='prop,eVar,hier',q,p='channel,server,products,purchaseID,zi" + "p,state,pageType';Y=Y?Y:'12/31/2050';j=B?j+'ns_site='+B+'&':j;j=s_a" + "ccount?j+'rsid='+s_account+'&':j;X=new Date();Y=new Date(Y);if(X<Y)" + "{function R(x,o,n){var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x" + ".substring(0,i)+n+x.substring(i+o.length);i=x.indexOf(o,i+l)}return" + " x}function A(u,v){var y,x=0,w=new Array;while(u){y=u.indexOf(v);y=" + "y>-1?y:u.length;w[x++]=u.substring(0,y);u=u.substring(y+v.length)}r" + "eturn w}if(s.linkType=='o'){G='o';H=s.linkName}else{F=s.p_gh();if(F" + "){F=F.indexOf('?')>-1?F.substring(0,F.indexOf('?')):F;E=A(s.linkInt" + "ernalFilters,',');for(Q=0;Q<E.length;Q++){if(F.indexOf(E[Q])>-1){W=" + "1}}G=W==1?G:'e';I=A(F,'/');P=A(s.linkDownloadFileTypes,',');for(Q=0" + ";Q<P.length;Q++){if(I&&I[I.length-1].indexOf('.'+P[Q])>-1)G='d'}if(" + "G)H=F}}if(O==1||G){j=s.pageName?j+'name='+s.pageName:j+'name='+s.wd" + ".location;l=A(z,',');q=A(p,',');if(O==1){for(var i in s){if(typeof " + "s[i]!='undefined'&&s[i]){for(c=0;c<3;c++){if(i.indexOf(l[c])>-1){d=" + "s[i]+'';V=R(i,'prop','p');V=R(V,'eVar','e');j=j+'&'+V+'='+d}}for(c=" + "0;c<7;c++){if(i==q[c]){j=j+'&'+i+'='+s[i]}}if(i=='events')j=j+'&'+i" + "+'='+s[i]+','}}}else if(G!='undefined'){j=j+'&lt='+G;j=j+'&ln='+H;j" + "=j+'&ns_type=hidden';r=String(s.linkTrackVars);t=String(s.linkTrack" + "Events);f=String(s.events);l=A(r,',');S=A(t,',');T=A(f,',');s.event" + "s='';for(c=0;c<S.length;c++){for(C=0;C<T.length;C++){if(S[c]==T[C])" + "{U=U+','+T[C]}}}s.events=U.substring(1,U.length);for(var i in s){if" + "(typeof s[i]!='undefined'&&s[i]){for(c=0;c<8;c++){if(i==l[c]){d=s[i" + "]+'';V=R(i,'prop','p');V=R(V,'eVar','e');j=j+'&'+V+'='+d}}}}}M=N==1" + "?'&visid='+s.c_r('s_vi'):'';j=j.toLowerCase()+M;s.udm_('http'+(docu" + "ment.location.href.charAt(4)=='s'?'s://sb':'://b')+'.scorecardresea" + "rch.com/b?c1=2&c2='+j);s._o2d=0}}");
  s._o2d = 1;
  s.udm_ = new Function("a", "" + "var b='comScore=',c=document,d=c.cookie,e='',f='indexOf',g='substri" + "ng',h='length',i=2048,j,k='&ns_',l='&',m,n,o,p,q=window,r=q.encodeU" + "RIComponent||escape;if(d[f](b)+1)for(o=0,n=d.split(';'),p=n[h];o<p;" + "o++)m=n[o][f](b),m+1&&(e=l+unescape(n[o][g](m+b[h])));a+=k+'_t='+ +(" + "new Date)+k+'c='+(c.characterSet||c.defaultCharset||'')+'&c8='+r(c." + "title)+e+'&c7='+r(c.URL)+'&c9='+r(c.referrer),a[h]>i&&a[f](l)>0&&(j" + "=a[g](0,i-8).lastIndexOf(l),a=(a[g](0,j)+k+'cut='+r(a[g](j+1)))[g](" + "0,i)),c.images?(m=new Image,q.ns_p||(ns_p=m),m.src=a):c.write(\"<\"" + ",\"p\",\"><\",'img src=\"',a,'\" height=\"1\" width=\"1\" alt=\"*\"" + "',\"><\",\"/p\",\">\")");
  s.p_gh = new Function("" + "var s=this;if(!s.eo&&!s.lnk)return '';var o=s.eo?s.eo:s.lnk,y=s.ot(" + "o),n=s.oid(o),x=o.s_oidt;if(s.eo&&o==s.eo){while(o&&!n&&y!='BODY'){" + "o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';y=s." + "ot(o);n=s.oid(o);x=o.s_oidt}}return o.href?o.href:'';");

  /* WARNING: Changing any of the below variables will cause drastic
  changes to how your visitor data is collected.  Changes should only be
  made when instructed to do so by your account manager.*/
  s.visitorNamespace = "wpni"
  s.trackingServer = "metrics.washingtonpost.com"
  s.trackingServerSecure = "smetrics.washingtonpost.com"
  s.dc = 112
  //s.vmk="46BF8B07"

  /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
  window.s_objectID = undefined;
  window.s_code = '';

  function s_gi(un, pg, ss) {
    var c = "s.version='H.24.2';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(m,\"\\n\",\"\\\\n\"),\"" + "\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}return y};s.fl=function(x,l){retur" + "n x?(''+x).substring(0,l):x};s.co=function(o){if(!o)return o;var n=new Object,x;for(x in o)if(x.indexOf('select')<0&&x.indexOf('filter')<0)n[x]=o[x];return n};s.num=function(x){x=''+x;for(var p=0;p" + "<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;return 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',i,c=s.charSet,n,l,e,y='';c=c?c.toU" + "pperCase():'';if(x){x=''+x;if(s.em==3)x=encodeURIComponent(x);else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.substring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h" + ".substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=escape(''+x);x=s.rep(x,'+','%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('" + "%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x)" + "{var s=this;if(x){x=s.rep(''+x,'+',' ');return s.em==3?decodeURIComponent(x):unescape(x)}return x};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substri" + "ng(0,y);r=s[f](t,a);if(r)return r;z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a" + "=a.substring(0,c);if(t.substring(0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var" + " s=this;s.fsg='';s.pt(x,',','fsf',f);return s.fsg};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\");s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=unde" + "fined){if(typeof(v)!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';" + "s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostname,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?pa" + "rseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'.','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.a" + "pe(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd" + "(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie" + "=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':'');return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s." + "_in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i;l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(" + "x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return " + "r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s.wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfs" + "oe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0;return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=thi" + "s,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet" + "('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)for(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=fun" + "ction(){};s.mr=function(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Obje" + "ct,l,imn='s_i_'+(un),im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p" + "=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.version+(s.tcn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl" + "(rs,2047)}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window" + ".s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;return ''}imn+='_'+s.rc[un];s.rc[un]++}im=s.wd[imn];if(!im)im=s.wd[imn]=new Image;im." + "s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;if" + "(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im.src=rs;if((!ta||ta=='_self'||ta=='_top'||(s.wd.na" + "me&&ta==s.wd.name))&&rs.indexOf('&pe=')>=0){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg" + "=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s" + "=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,l=0,q,a,b='',c='',t;if(x&&x.length>255){y=''+x;i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCas" + "e();j=0;if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='https://')j+=8;i=h.indexOf(\"/\",j);if(i>0){h=h.substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l" + "=',q,ie,start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l=',p,ei,';if(l&&q){a=s.sp(q,'&');if(a&&a.length>1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.su" + "bstring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'+c;else c=''}i=253-(q.length-c.length)-y.length;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f" + "){var s=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextData\")k=\"c\";if(v){for(sk in v) {if((!f||sk.substring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=" + "0)){nfm=0;if(nfl)for(nfn=0;nfn<nfl.length;nfn++)if(sk.substring(0,nfl[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.substring(f.length);if(sk.length>0){nke=sk.in" + "dexOf('.');if(nke>0){nk=sk.substring(0,nke);nf=(f?f:'')+nk+'.';if(!nfl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='boolean'){if(sv)sv='true';else sv='false'}if(s" + "v){if(vfp=='retrieveLightData'&&f.indexOf('.contextData.')<0){sp=sk.substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='channel')sk='ch';else if(sk=='campaign')sk='v0';e" + "lse if(s.num(ss)){if(sp=='prop')sk='c'+ss;else if(sp=='eVar')sk='v'+ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}}if(qs" + "!='')qs+='&.'+k}return qs};s.hav=function(){var s=this,qs='',l,fv='',fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s.vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType" + "){fv=s.linkTrackVars;fe=s.linkTrackEvents;if(s.pe){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;" + "if(fe){fe=','+fe+',';if(fv)fv+=',events,'}if (s.events2)e=(e?',':'')+s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(!v)if(k=='events'&&" + "e){v=e;e=''}if(v&&(!fv||fv.indexOf(','+k+',')>=0)&&k!='linkName'&&k!='linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pageURL" + "'){q='g';v=s.fl(v,255)}else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'){q='vmf';if(s.ssl&&s.visitorMigrationS" + "erverSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1';else if(s.em==2||s" + ".em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider')q='vvp';else if(k=='currencyCode')q='" + "cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';else if(k=='javascriptVersion')q='j';els" + "e if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q='ct';else if(k=='homepage')q='hp';else" + " if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextData'){qs+=s.s2q('c',s[k],fv,k,0);v=''}else if(k=='lightProfileID')q" + "='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProfileID)v=''}else if(k=='retrieveLightProfiles')q='mtsr';else if(k==" + "'deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eVar')q='v'+n;else if(" + "b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase(" + "):'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';if(t&&h." + "indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h=h.toLowerCase();if(" + "s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.substring(0,1)!='#'&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';r" + "eturn ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=s.co(this);s.t();s.lnk=0;if(b)return this[b](e);return true');s.bc=new Function('e','var s=s_c_il['+s._in+']," + "f,tcf;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;s.eo=e.srcElement?e.srcElement:e.target;tcf=new Function(\"s\",\"var e;try{if(s.eo&&(s.eo.tagName||s.eo.parentElement||s.eo.parentNode))s.t()}catch(e" + "){}\");tcf(s);s.eo=0');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&" + "&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/" + "':'')+h}return h};s.ot=function(o){var t=o.tagName;if((''+o.tagUrn)!='undefined'||((''+o.scopeName)!='undefined'&&(''+o.scopeName).toUpperCase()!='HTML'))return '';t=t&&t.toUpperCase?t.toUpperCase(" + "):'';if(t=='SHAPE')t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0" + ";if(t&&!o.s_oid){p=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",'" + "'),\"\\t\",''),' ','');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){" + "o.s_oid=s.fl(n,100);o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+','" + ")>=0){if(u!=s.un&&s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un" + ");return s.pt(un,',','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){" + "var s=this;s.squ[un]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)i" + "f(x&&(!Object||!Object.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v" + "+=(v?'&':'')+s.sqq[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o" + "=s.d.links[i];oc=o.onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(" + "s.apv>3&&(!s.isie||!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener)s.b.addEventListener('click',s.bc,false);else s.eh(s.wd,'onload',0," + "s.wdl)}};s.vs=function(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n" + "){if(!s.c_w(k,x,e))return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0" + "&&m){var n=t.substring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n," + "i;s.un=s.un.toLowerCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.u" + "n.substring(0,i)};s.sa=function(un){var s=this;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r," + "l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;" + "m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m" + "._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s" + "[g+\"_c\"],m,x,f=0;if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if" + "((\"\"+x).indexOf(\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl" + ")for(i=0;i<s.m_nl.length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]" + "){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=" + "g[i];if(o)s.loadModule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.su" + "bstring(0,i)}else g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=" + "s_c_il['+s._in+'],o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s" + ".maxDelay=250;if(!o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o" + ".type=\"text/javascript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o')" + ";o=tcf(s,c,i,u,f1,f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.voa=fun" + "ction(vo,r){var s=this,l=s.va_g,i,k,v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData\")&&s[k])for(x in s[k])if(!v[x])v[x]=s[k][x];s[k]=" + "v}}};s.vob=function(vo){var s=this,l=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<" + "s.dll.length;i++){vo=s.dll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxD" + "elay)}else s.dll=0');s.dl=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()}" + ";s.track=s.t=function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y=tm.getYear(),v" + "t=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q='',qs='',code=''" + ",vb=new Object;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(String&&String.proto" + "type){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;tcf=new Function('o','" + "var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next)j='1.7'}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if" + "(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElem" + "ent.offsetWidth;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}re" + "turn hp');hp=tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&" + "pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.con" + "nectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.vob(vb);s.voa(vo)}if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);var l=s.wd.location,r=tfs.document.referrer;if(!s.pageURL)s.pa" + "geURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo" + "&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if(o){oc=o.onclick?''+o.onclick:'';if((oc.indexOf('s_gs(')>=0&&oc.indexOf('." + "s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.linkType?s.linkType.toLowerCase():s.lt(h);" + "if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');q+='&pe='+s.pe+(h?'&pev1='+s.ape(h):'')+(l?'&pev2='+s.ape(l):'');}else trk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex" + ";if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else trk=0}" + "if(trk||qs){s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retrieveLi" + "ghtProfiles=s.deleteLightProfiles=''}s.sq(qs)}}else s.dl(vo);if(vo)s.voa(vb,1);s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo=s.wd." + "s_linkName=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo){var s=this;s.lnk=s.co(o);s.linkType=t;s.linkName=n;s.t(vo)};s.trackLight=function(p,ss,i,vo){var s=this;s.lightProfile" + "ID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){var s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l.length;i++){t=l[i];if(t&&t._c=='s_l'&&t.tagConta" + "inerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n,x.u,x.d)}if(t.ml)for(x in t.ml)if(s[x]){y=s[x];" + "x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf('s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i++){x=t.mmq[i];if(s[x.m]){y=s[x.m];if(y[x.f]&&ty" + "peof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=window;s.ssl=(s.wd.location.protocol.toLowerCase().in" + "dexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.indexOf('Netscape6/');var " + "apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns=(apn=='Netscape');s.iso" + "pera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat(i)}else if(s.ns6>0)s.ap" + "v=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase();s.em=(i=='%C4%80'?2:(i" + "=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='dynamicVariablePrefix,visitorID,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet,visitorNamespace,cooki" + "eDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCode,lightProfileID,lightStoreForSeconds,lightIncrementBy,retrieveLightProfiles,deleteLightProfiles,retrieveLightData';s." + "va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,contextData,lightProfileID,lightStoreForSeconds,lightIncrementBy';s.vl_t=s.vl_l+',variableProvider," + "channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,events2,products,linkName,linkType';var n;for(n=1;n<=75;n++){s.vl_t+=',prop'+n+',eVar'+n;s.vl_m+=',prop'+n+',eVar'+n}for(n" + "=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,javaEnabled,cookiesEnabled,browserWi" + "dth,browserHeight,connectionType,homepage,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBuffer" + "edRequests,mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,lin" + "kDownloadFileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTrackVars,_1_referrer,un';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=n" + "ew Object;s.retrieveLightData=new Object;if(!ss)s.wds();if(pg){s.wd.s_co=function(o){s_gi(\"_\",1,1).co(o)};s.wd.s_gs=function(un){s_gi(un,1,1).t()};s.wd.s_dc=function(un){s_gi(un,1).t()}}",
        w = window,
        l = w.s_c_il,
        n = navigator,
        u = n.userAgent,
        v = n.appVersion,
        e = v.indexOf('MSIE '),
        m = u.indexOf('Netscape6/'),
        a, i, j, x, s;
    
    if (un) {
      un = un.toLowerCase();
      if (l)
        for (j = 0; j < 2; j++)
          for (i = 0; i < l.length; i++) {
            s = l[i];
            x = s._c;
            if ((!x || x == 's_c' || (j > 0 && x == 's_l')) && (s.oun == un || (s.fs && s.sa && s.fs(s.oun, un)))) {
              if (s.sa) s.sa(un);
              if (x == 's_c') return s
            } else s = 0
          }
    }

    w.s_an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    w.s_sp = new Function("x", "d", "var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst" + "ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
    w.s_jn = new Function("a", "d", "var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
    w.s_rep = new Function("x", "o", "n", "return s_jn(s_sp(x,o),n)");
    w.s_d = new Function("x", "var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d" + "=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn(" + "x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
    w.s_fe = new Function("c", "return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
    w.s_fa = new Function("f", "var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':" + "a");
    w.s_ft = new Function("c", "c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i" + "f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")" + "'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
    c = s_d(c);
      
    if (e > 0) {
      a = parseInt(i = v.substring(e + 5));
      if (a > 3) a = parseFloat(i)
    } else if (m > 0) a = parseFloat(u.substring(m + 10));
    else a = parseFloat(v); if (a < 5 || v.indexOf('Opera') >= 0 || u.indexOf('Opera') >= 0) c = s_ft(c);
    if (!s) {
      s = new Object;
      if (!w.s_c_in) {
        w.s_c_il = new Array;
        w.s_c_in = 0
      }
      s._il = w.s_c_il;
      s._in = w.s_c_in;
      s._il[s._in] = s;
      w.s_c_in++;
    }

    s._c = 's_c';
    (new Function("s", "un", "pg", "ss", c))(s, un, pg, ss);
    return s
  }

  function s_giqf() {
    var w = window,
        q = w.s_giq,
        i, t, s;
    
    if (q)
      for (i = 0; i < q.length; i++) {
        t = q[i];
        s = s_gi(t.oun);
        s.sa(t.un);
        s.setTagContainer(t.tagContainerName)
      }
    w.s_giq = 0
  }
  s_giqf()



  // Test & Target Plug-In
  // depends on /wp-srv/otto/js/mbox.js
  /*
  if (typeof mboxLoadSCPlugin == "function")
  	mboxLoadSCPlugin(s);
  */
  /* end s_code */

  /* START: TWP vars, fns, objs, etc. */
  /* START: s.initForTwp */
  s.initForTwp = function() {

    /* Facebook domains */
    s.facebookSocial = "facebook - recommendations|facebook.com/plugins/recommendations.php>facebook - friends activity|facebook.com/plugins/activity.php"

    /* You may give each page an identifying name, server, and channel on the next lines. */
    if (typeof(wp_section) != "undefined") {
      wp_section = wp_section.replace(/\//, " - ");
    }

    if (typeof(wp_subsection) != "undefined") {
      wp_subsection = wp_subsection.replace(/\//, " - ");
    }
    /* need to test */

    if (typeof(wp_page_name) != "undefined") {
      s.pageName = wp_page_name.replace(/<[a-zA-Z\/][^>]*>/g, "");

      //remove session id
      s.pageName = s.pageName.replace(/\;jsessionid\=.{23}/g, "");
    } else {
      s.pageName = "wp - " + document.location.pathname + " - " + document.title;

      //remove html
      s.pageName = s.pageName.replace(/<[a-zA-Z\/][^>]*>/g, "");

      //remove session id
      s.pageName = s.pageName.replace(/\;jsessionid\=.{23}/g, "");

      //var doc_url = document.location.href;

      //if (doc_url.indexOf("ac2/wp-dyn?")>0)
      //{
      //	s.prop50=doc_url.substr(doc_url.indexOf("ac2/wp-dyn?")+10);
      //}
    }

    if (typeof(wp_channel) != "undefined") {
      s.channel = (wp_channel.indexOf("wp - ") >= 0) ? wp_channel : "wp - " + wp_channel;
    } else if (typeof(wp_section) != "undefined") {
      s.channel = (wp_section.indexOf("wp - ") >= 0) ? wp_section.split('/')[0] : "wp - " + wp_section.split('/')[0];
    } else if (typeof(wp_hierarchy) != "undefined") {
      s.channel = (wp_hierarchy.indexOf("wp - ") >= 0) ? wp_hierarchy.split('|')[0] : "wp - " + wp_hierarchy.split('|')[0];
    } else {
      s.channel = "wp - nocategory";
    }

    // <meta name="eomportal-instanceid" content="135" />

    s_portalInstance = "";
    if (document.getElementsByName('eomportal-instanceid').length) {
      s_portalInstance = document.getElementsByName('eomportal-instanceid')[0].getAttribute('content');
    }

    s.server = "washingtonpost.com";
    s.server += (s_portalInstance) ? ":" + s_portalInstance : "";

    s.pageType = (window.wp_page_type) ? wp_page_type : "";
    /*
    s.prop1
    	wp_sectionfront=wp_sectionfront.toLowerCase();
    	s.prop1=(wp_sectionfront.indexOf("wp - ")>=0||wp_sectionfront.length == 0)?wp_sectionfront:"wp - " + wp_sectionfront;
    */
    if (typeof(wp_print_section) != "undefined") {
      wp_print_section = wp_print_section.toLowerCase();
      s.prop1 = wp_print_section;
    } else {
      s.prop1 = "Not in Print";
    }

    if (typeof(wp_subsection) != "undefined") {
      wp_subsection = wp_subsection.toLowerCase();
      s.prop2 = (wp_subsection.indexOf("wp - ") >= 0 || wp_subsection.length == 0) ? wp_subsection : "wp - " + wp_subsection;
    }

    if (typeof(wp_content_type) != "undefined") {
      s.prop3 = wp_content_type.toLowerCase();
    }

    if (typeof(wp_source) != "undefined") {
      s.prop4 = wp_source.toLowerCase();
    } else {
      s.prop4 = "washingtonpost.com";
    }

    if (typeof(wp_site) != "undefined") {
      s.prop58 = wp_site.toLowerCase();
    } else {
      s.prop58 = "www.washingtonpost.com";
    }

    var tref = s.getQueryParam('tref');
    if (!!tref) {
      s.prop58 = tref;
    }

    if (typeof(wp_author) != "undefined") {
      s.prop5 = wp_author.toLowerCase();
    }

    if (typeof(wp_search_keywords) != "undefined") {
      s.prop6 = wp_search_keywords.toLowerCase();
    }

    if (typeof(wp_search_type) != "undefined") {
      s.prop7 = wp_search_type.toLowerCase();
    }

    s.prop8 = "";
    s.prop9 = "";
    s.prop10 = "";
    s.prop11 = "";
    if (typeof(wp_content_id) != "undefined") {
      // s.prop13=wp_content_id;
      s.prop12 = wp_content_id;
      if (window.wp_application) {
        s.prop13 = "";
      }
      if (window.wp_content_id) {
        s.prop13 = wp_content_id + " - " + window.wp_headline;
      }
      /* killed for eidos
    	if ( window.wp_section && window.wp_section == "interactivity")
    	{
    		s.prop13 = "" ;
    	}
    	*/
    }

    if (typeof(wp_page_num) != "undefined") {
      s.prop14 = wp_page_num;
    }

    /* killed 3/2012 - never used
    if (typeof(wp_op_ranking) != "undefined")
    {
    	s.prop16=wp_op_ranking.toLowerCase();
    }
    */
        /* killed for eidos
    if (typeof(wp_printed) != "undefined") {
    	s.prop19="printed page";
    }
    */

    if (typeof(wp_search_result_count) != "undefined") {
      s.prop21 = wp_search_result_count;
    }

    /* killed for eidos
    if (typeof(wp_story_id) != "undefined")
    {
    	s.prop22=wp_story_id;
    }
    */
        /* killed for eidos
    if (typeof(wp_topic) != "undefined")
    {
    	s.prop24=wp_topic;
    }
    */

    if (typeof(wp_story_type) != "undefined") {
      s.prop24 = wp_story_type;
    }

    if (typeof(wp_blogname) != "undefined") {
      s.prop25 = wp_blogname;
    }

    if (typeof(wp_columnname) != "undefined") {
      s.prop26 = wp_columnname;
    }

    /* killed for eidos
    if (typeof(wp_application) != "undefined")
    {
    	s.prop32=wp_application;
    }
    */

    s.recipeForRecVidABTest = null;
    s.getCookieForRecVidABTest = function() {
      if (s.recipeForRecVidABTest == null) {
        var countBuckets = 6;
        var cookieVal = null;
        if (document.cookie.match(/recvidabrecipe=([^;]+)/)) {
          cookieVal = RegExp.$1;
        } else {
          // var today = new Date();
          // var dateExpiration = new Date(today.getTime() + 52 * 7 * 24 * 60 * 60 * 1000); //expiration one year from now
          // var expiration = dateExpiration.toGMTString();

          //get the bucket, a number from 0 to countBuckets
          var rnd = Math.random();
          var numBucket = Math.floor(rnd * countBuckets);
          cookieVal = "" + numBucket;

          //get the domain, so that this cookie will survive any twp sub-domains:
          var theDomain = document.domain.split(".")[1] + "." + document.domain.split(".")[2];
          document.cookie = "recvidabrecipe=" + escape(numBucket) + "; path=/; domain=" + theDomain;

          //check to see if the cookie was set.  If not, we retrict to 1, 4 or 5
          if (!document.cookie.match(/recvidabrecipe=([^;]+)/)) {
            var recipe = 1 + Math.floor(rnd * 3); //creates a value 1, 2 or 3
            if (recipe != 1) {
              recipe += 2; //2 becomes 4, 3 becomes 5
            }
            cookieVal = "" + recipe;
          }
        }
        s.recipeForRecVidABTest = cookieVal;
      }

      return s.recipeForRecVidABTest;
    }

    //cookie for AB Test for recommende vid - only do this on article pages and on the fix
    if ((typeof(wp_content_type) != "undefined" && wp_content_type.toLowerCase() == "article") ||
      (typeof(wp_blogname) != "undefined" && wp_blogname == "the-fix")) {
      s.prop32 = "video recommendation - recipe " + s.getCookieForRecVidABTest();
    }

    s.getRegistrationStatus = function() {
      var regStatus = "anonymous";
      if (document.cookie.match(/wpniuser=([^;]+)/)) {
        regStatus = "wp registration";
      }
      if (document.cookie.indexOf("fbuid") != -1) {
        regStatus = "facebook connect";
      }
      return regStatus;
    }
    getFBConnectUserName = s.getRegistrationStatus;
    s.prop33 = s.getRegistrationStatus();

    function getUserName() {
      var username;
      if (document.cookie.match(/wpniuser=([^;]+)/)) {
        return RegExp.$1;
      }
      return username;
    }

    /* START: s.prop34 */
    if (typeof(wp_news_or_commercial) != "undefined") {
      s.prop34 = wp_news_or_commercial;
    } else {
      s.prop34 = "News";
      if (s.channel.match(/^(wp - )?(cars|classifieds|jobs|real ?estate|rentals)/)) {
        s.prop34 = "Commercial";
      }
    }
    /* END: s.prop34 */

    // killed 03/2012 - replaced with s.getFullReferringDomains();
    // s.prop35=(document.referrer)?(document.referrer).toString().match(/https?\:\/\/([^\/]+)\//)[1] : '' ;
    s.prop35 = s.getFullReferringDomains();

    s.getPersonalPostStatus = function() {
      var ppStatus = "anonymous";
      var ppRe = /(?:^|;)\s*pp_([^=]{32,32})=([^;]+)/;
      if (ppRe.test(document.cookie)) {
        if ((RegExp.$2) == "no_id_set") {
          ppStatus = "no_id_set";
        } else {
          ppStatus = "personal post";
        }
      }
      
      return ppStatus;
    }
    s.prop37 = s.getPersonalPostStatus();

    if (typeof(wp_published) != "undefined") {
      s.prop38 = wp_published;
    }

    if (typeof(wp_commercial_node) != "undefined") {
      s.prop39 = wp_commercial_node;
    }

    function _getScreenOrientation(){
      switch (window.orientation) {
        case 0:
          return 'portrait';
          // break;
        
        case 180:
          return 'portrait';
          // break;
        
        case 90:
          return 'landscape';
          // break;
        
        case -90:
          return 'landscape';
          // break;
        
        default:
          return undefined;
      }
    }

    var _screenOrientation = _getScreenOrientation();
    if (_screenOrientation) {
        s.eVar39 = _screenOrientation;
    } else {
        s.eVar39 = '';
    }

    if (typeof(wp_content_category) != "undefined") {
      s.prop40 = wp_content_category;
    }

    s.prop41 = getUserName();
    
    if ( !! window.wp_site_identity) {
      s.prop52 = wp_site_identity;
    } else {
      if (document.cookie.match(/X-WP-Split=([^;]+)/)) {
        s.prop52 = 'prodportal-' + RegExp.$1;
      } else {
        s.prop52 = 'unknown';
      }
    }

    if (document.cookie.match(/wapo_login_id=([^;]+)/)) {
      s.prop59 = RegExp.$1;
    } else {
      s.prop59 = "";
    }

    var protocol = window.document.location.protocol;
    s.prop62 = protocol.match(/http/) ? protocol.replace(':', '') : '';

    if (typeof(wp_platform) != "undefined") {
      s.prop70 = wp_platform;
		  s.eVar70 = s.prop70;
    } else if (!!window.wp_meta_data && !!wp_meta_data.platform) {
      s.prop70 = wp_meta_data.platform;
	    s.eVar70 = s.prop70;
    }

    if (!window.wp_pvid) {
      wp_pvid = Math.round(Math.random() * Math.pow(10, 13)) + '-' + new Date().getTime();
    }
    s.prop73 = wp_pvid;

    /* E-commerce Variables */
    s.campaign = (typeof s.campaign == 'undefined') ? "" : s.campaign;
    s.state = "";
    s.zip = "";
    s.events = "";
    s.products = "";
    s.purchaseID = "";
    s.eVar1 = (typeof(wp_evar1) != "undefined") ? wp_evar1 : s.pageName;
    s.eVar2 = (typeof(wp_evar2) != "undefined") ? wp_evar2 : s.channel;
    s.eVar3 = (typeof(wp_evar3) != "undefined") ? wp_evar3 : '';
    s.eVar4 = (typeof(wp_evar4) != "undefined") ? wp_evar4 : '';
    s.eVar5 = (typeof(wp_evar5) != "undefined") ? wp_evar5 : '';
    s.eVar6 = (typeof(wp_evar6) != "undefined") ? wp_evar6 : '';
    s.eVar7 = (typeof(wp_evar7) != "undefined") ? wp_evar7 : '';
    s.eVar8 = (typeof(wp_evar8) != "undefined") ? wp_evar8 : s.prop5;
    s.eVar9 = (typeof(wp_evar9) != "undefined") ? wp_evar9 : '';
    s.eVar10 = (typeof(wp_evar10) != "undefined") ? wp_evar10 : s.prop16;
    s.eVar11 = (typeof(wp_evar11) != "undefined") ? wp_evar11 : '';
    s.eVar12 = (typeof(wp_evar12) != "undefined") ? wp_evar12 : '';
    s.eVar13 = (typeof(wp_evar13) != "undefined") ? wp_evar13 : '';
    s.eVar14 = (typeof(wp_evar14) != "undefined") ? wp_evar14 : '';
    s.eVar15 = (typeof(wp_evar15) != "undefined") ? wp_evar15 : '';
    s.eVar16 = (typeof(wp_evar16) != "undefined") ? wp_evar16 : '';
    s.eVar17 = (typeof(wp_evar17) != "undefined") ? wp_evar17 : s.prop3;
    s.eVar18 = (typeof(wp_evar18) != "undefined") ? wp_evar18 : '';
    s.eVar19 = (typeof(wp_evar19) != "undefined") ? wp_evar19 : '';
    s.eVar20 = (typeof(wp_evar20) != "undefined") ? wp_evar20 : '';
    s.eVar21 = (typeof(wp_evar21) != "undefined") ? wp_evar21 : '';
    s.eVar22 = (typeof(wp_evar22) != "undefined") ? wp_evar22 : '';
    s.eVar23 = (typeof(wp_evar23) != "undefined") ? wp_evar23 : '';
    s.eVar24 = (typeof(wp_evar24) != "undefined") ? wp_evar24 : '';
    s.eVar25 = (typeof(wp_evar25) != "undefined") ? wp_evar25 : '';
    s.eVar26 = (typeof(wp_evar26) != "undefined") ? wp_evar26 : '';
    s.eVar27 = (typeof(wp_evar27) != "undefined") ? wp_evar27 : '';
    s.eVar29 = (typeof(wp_evar29) != "undefined") ? wp_evar29 : '';
    s.eVar30 = (typeof(wp_evar30) != "undefined") ? wp_evar30 : '';
    s.eVar31 = (typeof(wp_evar31) != "undefined") ? wp_evar31 : '';
    s.eVar32 = (typeof(wp_evar32) != "undefined") ? wp_evar32 : '';
    s.eVar33 = (typeof(wp_evar33) != "undefined") ? wp_evar33 : s.prop33;
    s.eVar34 = (typeof(wp_evar34) != "undefined") ? wp_evar34 : '';
    s.eVar35 = (typeof(wp_evar35) != "undefined") ? wp_evar35 : s.prop35;
    // s.eVar35=(typeof(wp_evar35)!="undefined")?wp_evar35:s.getValOnce(s.prop35,'s_ev35',0);
    s.eVar36 = (typeof(wp_evar36) != "undefined") ? wp_evar36 : '';
    s.eVar37 = (typeof(wp_evar37) != "undefined") ? wp_evar37 : '';
    s.eVar38 = (typeof(wp_evar38) != "undefined") ? wp_evar38 : '';
    // s.eVar39 = (typeof(wp_evar39) != "undefined") ? wp_evar39 : '';
    s.eVar40 = (typeof(wp_evar40) != "undefined") ? wp_evar40 : '';
    s.eVar41 = (typeof(wp_evar41) != "undefined") ? wp_evar41 : '';
    s.eVar42 = (typeof(wp_evar42) != "undefined") ? wp_evar42 : '';
    s.eVar43 = (typeof(wp_evar43) != "undefined") ? wp_evar43 : '';
    s.eVar44 = (typeof(wp_evar44) != "undefined") ? wp_evar44 : '';
    s.eVar45 = (typeof(wp_evar45) != "undefined") ? wp_evar45 : '';
    s.eVar46 = (typeof(wp_evar46) != "undefined") ? wp_evar46 : '';
    s.eVar47 = (typeof(wp_evar47) != "undefined") ? wp_evar47 : '';
    s.eVar48 = (typeof(wp_evar48) != "undefined") ? wp_evar48 : '';
    s.eVar49 = (typeof(wp_evar49) != "undefined") ? wp_evar49 : '';
    s.eVar50 = (typeof(wp_evar50) != "undefined") ? wp_evar50 : '';
    s.eVar51 = (typeof(wp_evar51) != "undefined") ? wp_evar51 : '';
    s.eVar52 = (typeof(wp_evar52) != "undefined") ? wp_evar52 : s.prop52;
    s.eVar53 = (typeof(wp_evar53) != "undefined") ? wp_evar53 : '';
    s.eVar54 = (typeof(wp_evar54) != "undefined") ? wp_evar54 : '';
    s.eVar55 = (typeof(wp_evar55) != "undefined") ? wp_evar55 : '';
    s.eVar56 = (typeof(wp_evar56) != "undefined") ? wp_evar56 : '';
    s.eVar57 = (typeof(wp_evar57) != "undefined") ? wp_evar57 : '';
    s.eVar58 = (typeof(wp_evar58) != "undefined") ? wp_evar58 : s.prop58;
    s.eVar59 = (typeof(wp_evar59) != "undefined") ? wp_evar59 : s.prop59;
    s.eVar60 = s.prop60 = (typeof(wp_evar60) != "undefined") ? wp_evar60 : ''; //paywall tracking
    s.eVar61 = (typeof(wp_evar61) != "undefined") ? wp_evar61 : '';
    s.eVar62 = (typeof(wp_evar62) != "undefined") ? wp_evar62 : ((typeof s.prop41 !== 'undefined') ? "logged in" : "logged out"); //paywall tracking
    s.eVar63 = (typeof(wp_evar63) != "undefined") ? wp_evar63 : '';
    s.eVar64 = (typeof(wp_evar64) != "undefined") ? wp_evar64 : ''; //paywall tracking
    s.eVar65 = s.prop65 = (typeof(wp_evar65) != "undefined") ? wp_evar65 : ''; //paywall tracking
    s.eVar66 = s.prop66 = (typeof(wp_evar66) != "undefined") ? wp_evar66 : ''; //paywall tracking
    s.eVar67 = (typeof(wp_evar67) != "undefined") ? wp_evar67 : '';
    s.eVar68 = (typeof(wp_evar68) != "undefined") ? wp_evar68 : '';
    s.eVar69 = (typeof(wp_evar69) != "undefined") ? wp_evar69 : '';
    // s.eVar70 = (typeof(wp_evar70) != "undefined") ? wp_evar70 : '';
    // s.eVar71 = (typeof(wp_evar71) != "undefined") ? wp_evar71 : '';
    s.eVar72 = (typeof(wp_evar72) != "undefined") ? wp_evar72 : '';
    s.eVar73 = (typeof(wp_evar73) != "undefined") ? wp_evar73 : '';
    s.eVar74 = (typeof(wp_evar74) != "undefined") ? wp_evar74 : '';
    s.eVar75 = (typeof(wp_evar75) != "undefined") ? wp_evar75 : '';
    /* Hierarchy Variables */
    if (typeof(wp_hierarchy) != "undefined") {
      s.hier1 = wp_hierarchy.toLowerCase();
    } else {
      s.hier1 = "nocategory";
    }
    /* killed for eidos
    s.hier2="washingtonpost.com|" + s.hier1;
    */
    /* killed for eidos
    function setWpStoryIdForOmniture( wp_story_id ) {
  	 s.prop22 = wp_story_id ;
    }
    */

		// if (!twpOmnitureInitialized) {
			twpOmnitureInitialized = true;
			jQuery(window.document).trigger('twpOmnitureInit');
		// }
  };
  /* END: s.initForTwp */

  /* START: Initialize wp_ variables from TWP.Data.Tracking.props, if available */
  s.copyTrackingPropsToWd = function(props) {
  	if (!!props) {
      for (p in props) {
        window["wp_" + p] = props[p];
      }
  	}
  }
  s.copyTWPToWd = function() {
    if (
      window.TWP &&
      TWP.Data &&
      TWP.Data.Tracking &&
      TWP.Data.Tracking.props
    ) {
		  s.copyTrackingPropsToWd(TWP.Data.Tracking.props);
    }
  }
  /* END: Initialize wp_ variables from TWP.Data.Tracking.props, if available */

  /* START: s.sendPageViewToOmniture family */
  s.nullifyOnResend = ['events', 'campaign', 'prop20', 'prop27', 'prop61', 'prop71', 'eVar3', 'eVar13', 'eVar20', 'eVar29', 'eVar71'];
  function _sendPageViewToOmniture(props, nullify) {
    logger.log('sendPageView - props:', props);
    var oldProps = {};

    props = props || {};
    props.keepPropsActive = !!props.keepPropsActive;
    props.events = s.getUniqueEvents( (!!props.events)?props.events+',event1':'event1' );

    if (Object.prototype.toString.call(nullify) === '[object Array]') {
      nullify = nullify.concat(s.nullifyOnResend);
    } else {
      nullify = s.nullifyOnResend;
    }

    for (var i = 0; i < nullify.length; i++) {
      s[nullify[i]] = null;
      window['wp_' + nullify[i].toLowerCase()] = '';
    }

    // START: wp_pvid/s.prop73 needs a new value for each page view
    if (!window.wp_pvid) {
      wp_pvid = Math.round(Math.random() * Math.pow(10, 13)) + "-" + new Date().getTime();
    } else {
      wp_pvid = wp_pvid.split("-")[0] + "-" + new Date().getTime();
    }
    s.prop73 = wp_pvid;
    // END: wp_pvid/s.prop73 needs a new value for each page view

    for (p in props) {
      // Save old props so they can be restored later.
      if (!props.keepPropsActive) {
        oldProps[p] = s[p];
      }

      s[p] = props[p];
    }

    if (props.keepPropsActive && typeof props.track_scrolling == 'boolean') {
      wp_track_scrolling = props.track_scrolling;
    }

    s.t();
    s.sendPageViewToComscore();
    effectiveMeasure.sendPageView();

    var extractedData = internal.extract(s);
    if (extractedData) internal.sendData(extractedData, { mode: 'pv' });

    // Restore s with oldProps
    if (!props.keepPropsActive) {
      for (prop in oldProps) {
        s[prop] = oldProps[prop];
      }
    }
  }
  s.sendPageViewToOmniture = function(props, nullify, options) {
    if (typeof options === 'object') {
      if (options.wait) {
        return omnitureState.ready(function() {
          _sendPageViewToOmniture(props, nullify);
        });
      }
    }

    _sendPageViewToOmniture(props, nullify);
  };

  s.getPageViewPropsFromTrackingData = function(props) {
  	props = props || {};
  	
    return {
  		referrer:(typeof props.referrer != 'undefined') ? props.referrer : 'http://www.washingtonpost.com' ,
  		pageName:(typeof props.page_name != 'undefined') ? props.page_name : (typeof s.pageName != 'undefined') ? s.pageName : '' ,
  		channel:(typeof props.channel != 'undefined') ? props.channel : (typeof s.channel != 'undefined') ? s.channel : '' ,
  		hier1:(typeof props.hierarchy != 'undefined') ? props.hierarchy : (typeof s.hier1 != 'undefined') ? s.heir1 : '' ,
  		pageType:(typeof props.page_type != 'undefined') ? props.page_type : (typeof s.pageType != 'undefined') ? s.pageType : '' ,
  		prop2:(typeof props.channel != 'undefined') ? props.channel : (typeof s.prop2 != 'undefined') ? s.prop2 : '' ,
  		prop3:(typeof props.content_type != 'undefined') ? props.content_type : (typeof s.prop3 != 'undefined') ? s.prop3 : '' ,
  		prop4:(typeof props.source != 'undefined') ? props.source.toLowerCase() : (typeof s.prop4 != 'undefined') ? s.prop4 : '' ,
  		prop5:(typeof props.author != 'undefined') ? props.author : (typeof s.prop5 != 'undefined') ? s.prop5 : '' ,
  		prop12:(typeof props.content_id != 'undefined') ? props.content_id : (typeof s.prop12 != 'undefined') ? s.prop12 : '' ,
  		prop13:(typeof props.content_id != 'undefined' && typeof props.headline != 'undefined') ? props.content_id+' - '+props.headline : (typeof s.prop13 != 'undefined') ? s.prop13 : '' ,
  		prop14:(typeof props.page_num != 'undefined') ? props.page_num : (typeof s.prop14 != 'undefined') ? s.prop14 : '' ,
  		prop16:(typeof props.op_ranking != 'undefined') ? props.op_ranking : (typeof s.prop16 != 'undefined') ? s.prop16 : '' ,
  		prop24:(typeof props.story_type != 'undefined') ? props.story_type : (typeof s.prop24 != 'undefined') ? s.prop24 : '' ,
  		prop25:(typeof props.blogname != 'undefined') ? props.blogname : (typeof s.prop25 != 'undefined') ? s.prop25 : '' ,
  		prop26:(typeof props.columnname != 'undefined') ? props.columnname : (typeof s.prop26 != 'undefined') ? s.prop26 : '' ,
  		prop34:(typeof props.news_or_commercial != 'undefined') ? props.news_or_commercial : (typeof s.prop34 != 'undefined') ? s.prop34 : '' ,
  		prop38:(typeof props.published != 'undefined') ? props.published : (typeof s.prop38 != 'undefined') ? s.prop38 : '' ,
  		prop39:(typeof props.commercial_node != 'undefined') ? props.commercial_node : (typeof s.prop39 != 'undefined') ? s.prop39 : '' ,
  		prop40:(typeof props.content_category != 'undefined') ? props.content_category : (typeof s.prop40 != 'undefined') ? s.prop40 : '' ,
  		prop70:(typeof props.platform != 'undefined') ? props.platform : (typeof s.prop70 != 'undefined') ? s.prop70 : '' ,
  		track_scrolling:(typeof props.track_scrolling == 'boolean') ? props.track_scrolling : (typeof wp_track_scrolling == 'boolean') ? wp_track_scrolling : false ,
  	};
  };

  s.sendPageViewToOmnitureWithFullReset = function(props, nullify) {
    s.copyTWPToWd();
    s.initForTwp();
    s.sendPageViewToOmniture(props, nullify);
  };

  s.sendPageViewToComscoreDontPanic = function() {
    comscoreLogger.log("DON'T PANIC: pageview will be sent on the live site");
  };

  s.sendPageViewToComscore = function() {
    // for comscore panelist tracking.
    try {
      /* NOTE: Only works when this URL will resolve */
      if ( !! window.location.hostname.match(/\.washingtonpost\.com/)) {
        comscoreLogger.log("Sending pageview");
        pvcUrl = "https://js.washingtonpost.com/wp-stat/comscore/pageview_candidate.txt";
        
        var i = new Image();
        
        i.onload = i.onerror = function() {
          jQuery.ajax(
            pvcUrl, {
              dataType: "text",
              cache: false,
              error: function() {}
            }
          );
        }

        i.src = (("https:" == document.location.protocol) ? "https://sb" : "http://b") + ".scorecardresearch.com/b?c1=2&c2=3005617" + "&c7=" + encodeURI(jQuery("meta[property='og:url']").attr("content") || location.href);
      } else {
        s.sendPageViewToComscoreDontPanic();
      }
    } catch (e) {
      // TODO: put data into TWP.SiteAnalytics.report on the fact that
      // additional pageViews to comScore won't work.
      // perhaps just check this: !!window.location.hostname.match(/\.washingtonpost\.com/)
    }
  };
  /* END: s.sendPageViewToOmniture family */

  /* START: sendDataToOmniture */
  function _sendDataToOmniture(customLinkName, events, props) {
    // START: abort if no s_acount or no customLinkName or no events and props
    if (typeof s_account != "undefined" && customLinkName && (events || props)) {
      logger.log('sendData -', 'customLinkName:', customLinkName, '| events:', events, '| props:', props);
      var oldProps = {};
      var oldLinkTrackVars = s.linkTrackVars;
      var oldLinkTrackEvents = s.linkTrackEvents;
      var propPattern = /^(prop|eVar|channel|hier|pageName|pageType|list)/;

      // START: make sure events is a string
      if (events) {
        if (typeof events == "string") {} else if (typeof events == "object" && events.join) {
          events = events.join(',')
        } else {
          events = null
        }
      }
      // END: make sure events is a string

      // START: make sure props is an object
      if (props) {
        if (typeof props == "object") {} else {
          props = null
        }
      }
      // END: make sure props is an object

      // START: only continue of both props and events haven't been nulled out
      if (events || props) {
        // START: set linkTrackVars
        var linkTrackVars = [];
        
        if (events)
          linkTrackVars[linkTrackVars.length] = "events";
        
        if (props) {
          for (prop in props) {
            if (prop.match(propPattern))
              linkTrackVars[linkTrackVars.length] = prop;
          }
        }
        // START: set linkTrackVars

        // START: if no linkTrackVars, no point in doing anything
        if (linkTrackVars.length || !! customLinkName) {
          s.linkTrackVars = linkTrackVars;
          
          if (events)
            s.linkTrackEvents = events;
          
          for (prop in props) {
            if (prop.match(propPattern)) {
              // save old props
              oldProps[prop] = s[prop];
              s[prop] = props[prop];
            }
          }
          
          if (events) {
            oldProps.events = s.events;
            s.events = events;
          }

          var oldUsePlugins = s.usePlugins;
          s.usePlugins = false;

          // The Holy Grail:
          s.tl(true, 'o', customLinkName);

          s.usePlugins = oldUsePlugins;

          var extractedData = internal.extract(s, { partial: true });
          if (extractedData) internal.sendData(extractedData, { mode: 'd' });

          // Restore s with oldProps
          for (prop in oldProps) {
            if (prop.match(propPattern)) {
              s[prop] = oldProps[prop];
            }
          }

          s.linkTrackVars = oldLinkTrackVars;
          s.linkTrackEvents = oldLinkTrackEvents;
        }
        // END: if no linkTrackVars, no point in doing anything
      }
      // END: only continue of both props and events haven't been nulled out
    }
    // END: abort if no s_account and no events or props
  }

  s.sendDataToOmniture = function(customLinkName, events, props, options) {
    
    if (typeof options === 'object') {
      if (options.wait) {
        return omnitureState.ready(function() {
          _sendDataToOmniture(customLinkName, events, props);
        });
      }
    }

    _sendDataToOmniture(customLinkName, events, props);

  };

  sendDataToOmniture = sendEventToOmniture = sendDataToOmnitureFromEvri = s.sendDataToOmniture;
  /* END: sendDataToOmniture */

  window.toxicOmnitureCounter = 0;

  function ThreateningStackOverflowException() {
    this.description = "Threatening Stack Overflow Exception";
    this.name = "ThreateningStackOverflowException";
    this.number = "";
    this.message = this.description;
  }

  s.isNotIframe = function(){
  	return (self === top) || (self !== top && !!self.document.referrer.match(/https?:\/\/([^\.]+\.)?(stumbleupon|jungroup|hyprmx|facebook|flickr|snip|wapo)\.(com|ly|st)\//) ) ;
  }
  /* END: TWP vars, fns, objs, etc. */

  // initialize lots of variables
  s.copyTWPToWd();
  s.initForTwp();
  /************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
  function waitForPaywallTracking(setTimer, checkCount) {
    checkCount += 1;
    logger.log("WAIT FOR PAYWALL: " + setTimer);
    logger.log("CHECKCOUNT: " + checkCount);
    if ((s && window.TWP && TWP.Identity && TWP.Identity.paywall && TWP.Identity.paywall.pwresp) || checkCount > 6 || setTimer !== true) {
      // initialize lots of variables
      s.copyTWPToWd();
      s.initForTwp();
      
      if ( s.isNotIframe() ) {
        s_code = s.t();

        var extractedData = internal.extract(s);
        if (extractedData) internal.sendData(extractedData, { mode: 'pv' });
      } else {
        s.sendDataToOmniture('iframe', 'event32', s);
      }

      omnitureState.setReady();
		  
      jQuery(window.document).off("onTwpMeterComplete.omniture");
      logger.log("PAYWALL VARIABLES: 60: " + s.eVar60 + " 64:" + s.eVar64 + " 65: " + s.eVar65 + " 66: " + s.eVar66);

    } else {
      setTimeout(function() {
        waitForPaywallTracking(true, checkCount)
      }, 500);
    }
  }

  if ((typeof _suppressTrackPageLoad == 'undefined' || !_suppressTrackPageLoad) && !config.suppressTrackPageLoad) {
    if (window.TWP &&
        TWP.Identity &&
        TWP.Identity.paywall &&
        TWP.Identity.paywall.requireTracking === true &&
        !TWP.Identity.paywall.pwresp) {
        
          jQuery(window.document).on("onTwpMeterComplete.omniture", function(event) {
            waitForPaywallTracking(true, checkCount = 0)
          });
          	
    			// sf pw failsafe
          if (window.location && location.pathname && /^\/sf\//.test(location.pathname)) {
            jQuery(document).ready(function() {
              setTimeout(function() {
                logger.log('timeout');
                waitForPaywallTracking(true, checkCount = 0);
              }, 500);  
            });
          }

    } else {
      waitForPaywallTracking(false);
    }
  } else {
    omnitureState.setReady();
  }
  /* End SiteCatalyst code version: H.24.2 */
}

},{"../../../util/utils":24,"../effective-measure":8,"../lox":11,"./logger":16,"./state":17}],14:[function(require,module,exports){
var init  = require('./init');
var state = require('./state')

module.exports = {
  init: init,
  state: state
};

},{"./init":15,"./state":17}],15:[function(require,module,exports){
var _loadOmniture = require('./implementation');

module.exports = function initOmniture(config) {
  var includeOmniture = true;
  switch(TWP.Analytics.config.suite){
    case "preproduction":
      // NOTE: For now, not using mobile suite.
      // window.s_account=(TWP.Analytics.isMobile())?"wpniwpmobileprodpp":"wpniwashpostcomEidospp";
      window.s_account="wpniwashpostcomEidospp";
      break;
    case "production":
      // NOTE: For now, not using mobile suite.
      // window.s_account=(TWP.Analytics.isMobile())?"wpniwpmobileprod":"wpniwashpostcom";
      window.s_account="wpniwashpostcom";
      break;
    default:
      includeOmniture = false;
  }

  if(includeOmniture){

    _loadOmniture(TWP.Analytics.config);
    
    TWP.Analytics.report.omniture.on=true;
    TWP.Analytics.report.omniture.loaded=true;
    TWP.Analytics.report.omniture.suite=s_account;
    TWP.Analytics.report.omniture.testCode=!!TWP.Analytics.config.service.omnitureTest;
    jQuery(document).trigger('TWP.Analytics.omnitureLoaded');

    if (!!window.s){
      TWP.Analytics.uploadData = s.sendDataToOmniture;
      TWP.Analytics.triggerPageView = s.sendPageViewToOmniture;
      TWP.Analytics.triggerFullPageView = s.sendPageViewToOmnitureWithFullReset;
      TWP.Analytics.trackScrolling();
    }
  } // if(includeOmniture)
    
};

},{"./implementation":13}],16:[function(require,module,exports){
var _utils = require('../../../util/utils');
module.exports = new _utils.Log({
  namespace: "OMNITURE",
  fmtOptions: {
    "color": "#2980b9",
    "font-weight": "bold",
    "text-decoration": "underline"
  }
});

},{"../../../util/utils":24}],17:[function(require,module,exports){
var StateStore = require('../../state-store');
var omnitureState = new StateStore({
  eventName: 'twpOmnitureReady',
  service: 'OMNITURE'
});

module.exports = omnitureState;

},{"../../state-store":22}],18:[function(require,module,exports){
var _utils = require('../util/utils');

// Objects instantiated by ElementTracker execute a configurable callback
// that runs when a scrolling pageview should fire.
module.exports = (function() {

  var $w = jQuery(window);

  // returns true if any part of the element is in viewport
  function isElementInViewport(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) el = el[0];
    var rect = el.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function ElementTracker(config) {

    if (typeof config !== 'object') throw new Error('ElementTracker: first argument must be a configuration object');
    if (!('element' in config)) throw new Error('ElementTracker: configuration object must have "element" property');

    var _elem = jQuery(config.element);
    var _container = ('container' in config) ? jQuery(config.container) : jQuery(window);
    var _lastPosition = null;
    var _lastPageNum = null;
    var _lastPage = null;
    var _cb = null;

    this.getElem = function() {return _elem;};
    this.getContainer = function() {return _container;};
    this.getLastPosition = function() {return _lastPosition;};
    this.getLastPageNum = function() {return _lastPageNum;};
    this.getLastPage = function() {return _lastPage;};
    this.getCb = function() {return _cb;};
    this.setCb = function(cb) {
      if (_checkViewport) {
        _cb = _utils.debounce(function() {
          if (isElementInViewport(_elem)) {
            var pos = _currentPosition();
            var pg = _currentPage();
            if (_checkPosition(pos, pg)) {
              if (typeof cb === 'function') cb();
            }
          }
        }, 500);
      } else {
        _cb = _utils.debounce(function() {
          var pos = _currentPosition();
          var pg = _currentPage();
          if (_checkPosition(pos, pg)) {
            if (typeof cb === 'function') cb();
          }
        }, 500);
      }
    };

    var _checkViewport = ('checkViewport' in config) ? config.checkViewport : false;
    var _containerOffsetTop = _container.offset() ? _container.offset().top : 0;
    var _offsetTop = _elem.offset().top - _containerOffsetTop;

    function _currentPage(){return Math.floor( Math.abs((_currentPosition() - _offsetTop)) / _pageHeight())+1;}
    function _checkPosition(pos,pg){
      if(
        pos == _currentPosition()
        && pg != _lastPage
        && Math.abs((_lastPosition || _offsetTop) - pos) >= _pageHeight()
      ){
        _lastPosition = pos;
        _lastPage = pg;
        _lastPageNum = 'page_' + pg;
        return true;
      }
    }
    function _screenFactor(){return TWP.Analytics.isMobile() ? 4 : 2 ;}
    function _pageHeight(){return $w.height()*_screenFactor();}
    function _currentPosition(){return _container.scrollTop();}
  }

  ElementTracker.prototype.onPageView = function(cb) {
    if (!cb || typeof cb !== 'function') throw new Error('ElementTracker: onPageView expects a function');
    this.setCb(cb);
    return this;
  };

  ElementTracker.prototype.startTracking = function() {
    var cb = this.getCb();
    if (!cb) throw new Error('ElementTracker: must configure an onPageView callback before calling startTracking');
    this.getContainer().on('scroll', cb);
    return this;
  };

  ElementTracker.prototype.stopTracking = function() {
    var cb = this.getCb();
    if (!cb) throw new Error('ElementTracker: must configure an onPageView callback before calling stopTracking');
    this.getContainer().off('scroll', cb);
    return this;
  };

  ElementTracker.prototype.runCallback = function() {
    var cb = this.getCb();
    cb();
    return this;
  };

  return ElementTracker;
})();

},{"../util/utils":24}],19:[function(require,module,exports){
var _utils = require('../util/utils');

// creates a DOM node that displays analytics debug info
// when debugAnalytics is present in the query string
module.exports = function(){
  if (_utils.debugMode) {
    jQuery(document).ready(function(){
      var debugIntervalCount = 0;
      var debugInterval = setInterval(function(){
        debugIntervalCount += 1;

        var services = ['omniture','comscore','chartbeat'];
        jQuery( '#debugAnalytics' ).remove();

        var data = "";
        var log = "";
        for(var i=0;i < services.length;i++){
          var service = services[i];
          if(!! TWP.Analytics.report[service] ){
            var report = TWP.Analytics.report[service];
            data+='<div style="text-align:left;"><b>'+report.name+':</b> ';
            for(var p in report){
              if (p != 'name') data += p+':'+report[p]+'; ';
            }
            if(service=='omniture' && report.on){
              if(typeof wp_track_scrolling != 'undefined'){
                data += 'track_scrolling:'+!!wp_track_scrolling;
              } else {
                data += 'track_scrolling:false';
              }
              if(!!window.wp_page_num){
                if( debugIntervalCount > 60){
                  data += '';
                } else {
                  data += ' ('+wp_page_num+')';
                }
              }
              data += '; ';
            }
            if(service=='omniture' && report.on){
              log += '<a href="javascript:void(0);" onClick="(window.console&&console.log(s))">s</a> ';
            }
            if(service=='chartbeat' && report.on){
              log += '<a href="javascript:void(0);" onClick="(window.console&&console.log(_sf_async_config))">_sf_async_config</a> ';
            }
            data+="</div>";
          }
        }

        if (!!log) {
          log = '<div style="text-align:left;"><b>log to console:</b> '+log+'</div>';
        }
        jQuery('body').children(':first').before(
          jQuery('<div id="debugAnalytics" style="text-align:center;font-family:courier,serif;font-size:14px;"><div style="width:80%;text-align:left;padding:10px;background-color:#F9F9F9;border:1px dashed #2F6FAB;margin:10px auto;">'+data+log+'</div></div>')
        );

        if( debugIntervalCount > 60){
          clearInterval(debugInterval);
        }
      },1000);
    });
  }
};

},{"../util/utils":24}],20:[function(require,module,exports){
var _utils = require('../util/utils');

module.exports = {
  track: trackScrollDepth,
  get: getScrollDepth
};

var $w = jQuery(window);
var wHeight = $w.height();

function getScrollDepth(previousPageName) {
  return (previousPageName === _utils.readValue('wp_s_d_pp')) ? _utils.readValue('wp_s_d') : null;
}

function trackScrollDepth(scrollingElement) {

  var $scrollingElement = jQuery(scrollingElement);
  var scrollableHeight = ((scrollingElement === window.document) ? $scrollingElement.height() : $scrollingElement.prop('scrollHeight')) - wHeight;

  _utils.persistValue('wp_s_d_pp', wp_page_name);

  $scrollingElement.on('scroll', _utils.debounce(function() {
    
    var percentageScrolled = ($scrollingElement.scrollTop() / scrollableHeight) * 100;
    _utils.persistValue('wp_s_d', percentageScrolled);

    if (_utils.shouldLog)
      console.log('percent scrolled:', getScrollDepth(wp_page_name));

  }, 500));

}

},{"../util/utils":24}],21:[function(require,module,exports){
var _utils = require('../util/utils');
module.exports = (function() {
  
  var persistenceKey = "b_sig";
  var sessionHistoryTimeLimit = 30;
  var thirtyMinutes = 1000 * 60 * 30;

  // localStorage
  var localData = {
    sessions: [],
    sessionTimes: {}
  };
  var initialLocalData = {};
  jQuery.extend(initialLocalData, localData);

  // sessionStorage
  var sessionData = {
    referralDomain: null,
    pagesSeeninSession: 0,
    recordedSessionCount: false,
    updatedAt: new Date()
  };
  var initialSessionData = {};
  jQuery.extend(initialSessionData, sessionData);

  function readPersistentData() {
    sessionData = JSON.parse(sessionStorage.getItem(persistenceKey));
    localData = JSON.parse(localStorage.getItem(persistenceKey));
    if (sessionData === null || typeof(sessionData) !== "object" || ((new Date()) - sessionData.updatedAt) > thirtyMinutes) {
      sessionData = {};
      jQuery.extend(sessionData, initialSessionData)
    }
    if (localData === null || typeof(localData) !== "object") {
      localData = {};
      jQuery.extend(localData, initialLocalData)
    }
    rewritePersistentData();
  }

  function initBeforeUnload() {
    if (typeof(window.onbeforeunload) !== "undefined") {
      var date = new Date();
      
      // calculates the length of the PV and persists the data
      var handler = function beforeUnloadHandler() {
        var sessionDuration = Math.round(((new Date()) - date) / 1000); // unit: seconds
        localData.sessionTimes[currentDate()] = (localData.sessionTimes[currentDate()] || 0) + sessionDuration;
        persistData();
      };
      jQuery(window).on("beforeunload", handler);
    }
  }

  function setReferrer() {
    sessionData.referralDomain = sessionData.referralDomain || document.referrer;
  }

  function rejectExpiredSessions() {
    var expireDate = currentDate() - sessionHistoryTimeLimit;
    
    var newSessionTimes = {};
    for (var sessionDate in localData.sessionTimes) {
      if (localData.sessionTimes.hasOwnProperty(sessionDate) && sessionDate > expireDate) {
        newSessionTimes[sessionDate] = localData.sessionTimes[sessionDate];
      }
    }
    localData.sessionTimes = newSessionTimes;
    
    var newSessions = [];
    for (sessionDate in localData.sessions) {
      (function(sessionDate) {
        var sesDate = localData.sessions[sessionDate];
        if (sesDate > expireDate) newSessions.push(sesDate);
      }(sessionDate));
    }
    localData.sessions = newSessions;
  }

  function incrementPagesSeen() {
    sessionData.pagesSeeninSession++
  }

  function recordCurrentSession() {
    if (!sessionData.recordedSessionCount) {
      localData.sessions.push(currentDate());
      sessionData.recordedSessionCount = true;
    }
  }

  function persistData() {
    sessionData.updatedAt = new Date();
    sessionStorage.setItem(persistenceKey, JSON.stringify(sessionData));
    localStorage.setItem(persistenceKey, JSON.stringify(localData))
  }

  function currentDate() {
    var msSince2015 = (new Date()) - (new Date(2015, 0, 0));
    var dayInMs = 1000 * 60 * 60 * 24;
    return Math.ceil(msSince2015 / dayInMs);
  }

  function sessions() {
    return localData.sessions.length;
  }

  function avgSessionTime() {
    var sessionsAmt = localData.sessions.length;
    if (sessionsAmt < 1) {
      return 0;
    }

    var expireDate = currentDate() - sessionHistoryTimeLimit;
    var totalSessionTime = 0;
    
    for (var sessionDate in localData.sessionTimes) {
      if (!localData.sessionTimes.hasOwnProperty(sessionDate) && sessionDate > expireDate) {
        continue;
      }

      totalSessionTime += localData.sessionTimes[sessionDate];
    }
    return Math.ceil(totalSessionTime / sessionsAmt);
  }

  function rewritePersistentData() {
    for (var prop in initialLocalData) {
      localData[prop] = localData[prop] || initialLocalData[prop]
    }
    for (prop in initialSessionData) {
      sessionData[prop] = sessionData[prop] || initialSessionData[prop]
    }
  }

  function results() {
    return {
      loyalty_bsg: sessions(),
      avgsestime_bsg: avgSessionTime(),
      firstimp_bsg: sessionData.pagesSeeninSession,
      referral_bsg: sessionData.referralDomain
    };
  }

  function createScript() {
    var queryParams = [];
    var _results = results();
    for (var result in _results) {
      queryParams.push(encodeURIComponent(result) + "=" + encodeURIComponent(_results[result]));
    }

    var scriptPath;
    if (_utils.hasJSON && _utils.hasStorage) {
      scriptPath = "https://z.moatads.com/washpost421KqtH31/moatcontent.js?" + queryParams.join("&");
    } else {
      scriptPath = "https://z.moatads.com/washpost421KqtH31/moatcontent.js";
    }

    var _moatRequest = _utils.loadScript(scriptPath);
    if (!!_moatRequest) {
      window._moatState = _moatRequest;
    }
  }

  return {
    init: function() {
      if (_utils.hasJSON && _utils.hasStorage) {
        readPersistentData();
        initBeforeUnload();
        setReferrer();
        rejectExpiredSessions();
        recordCurrentSession();
        incrementPagesSeen();
        persistData(); 
      }
      createScript();
    },
    results: results
  };
})();

},{"../util/utils":24}],22:[function(require,module,exports){
var _utils = require('../util/utils');
var $doc = jQuery(window.document);

module.exports = StateStore;

function StateStore(config) {
  'use strict';

  if ('service' in config) this.service = config.service;
  if ('eventName' in config) this.eventName = config.eventName;

  this.readyState = false;
}

StateStore.prototype.ready = function(cb) {
  if (this.readyState) {
    if (_utils.shouldLog) console.log(this.service + ' - ready(immediate)');
    return cb();
  } else {
    if (_utils.shouldLog) console.log(this.service + ' - waiting for ' + this.eventName);
    var _self = this;
    
    function readyHandler(e) {
      _self.readyState = true;
      if (_utils.shouldLog) console.log(_self.service + ' - ready(event)');
      return cb();
    }
    
    $doc.one(_self.eventName, readyHandler);
    
    setTimeout(function() {
      $doc.off(_self.eventName, readyHandler);
      if (_utils.shouldLog) console.log(_self.service + ' - timeout');
      return readyHandler();
    }, 5000);
  }
};

StateStore.prototype.setReady = function() {
  this.readyState = true;
  jQuery(window.document).trigger(this.eventName);
};

},{"../util/utils":24}],23:[function(require,module,exports){
module.exports = function(){

  var $w = jQuery(window);
  function _screenFactor(){return TWP.Analytics.isMobile() ? 4 : 2 ;}
  function _pageHeight(){return $w.height()*_screenFactor();}
  function _currentPosition(){return $w.scrollTop();}
  function _currentPage(){return Math.floor( _currentPosition()/_pageHeight() )+1;}

  TWP.Analytics.scrollingConfig = {
    lastPosition:_currentPosition(),
    lastPage:_currentPage()
  };

  function _checkPosition(pos,pg,ts){
    if(
      pos == _currentPosition()
      && pg != TWP.Analytics.scrollingConfig.lastPage
      && Math.abs(TWP.Analytics.scrollingConfig.lastPosition - pos) >= _pageHeight()
    ){
      TWP.Analytics.scrollingConfig.lastPosition = pos;
      TWP.Analytics.scrollingConfig.lastPage = pg;
      // NOTE: START Global variable
      wp_page_num = "page_"+pg;
      // NOTE: END Global variable
      if (!!ts) {
        TWP.Analytics.triggerPageView({
          prop14:wp_page_num
        });
      }
    }
  }

  $w.scroll(function(){
    var pos = _currentPosition();
    var pg = _currentPage();
    // closure voodoo here
    setTimeout((function(arg1,arg2,arg3){
      return function(){
        _checkPosition(arg1,arg2,arg3);
      };
    }(pos,pg,window.wp_track_scrolling)),500);
  });

};

},{}],24:[function(require,module,exports){
var hasStorage = (function() {
  var storageTest = new Date();
  try {
    localStorage.setItem(storageTest, storageTest);
    localStorage.removeItem(storageTest);
    return true;
  } catch (e) {
    return false;
  }
}());

var hasJSON = (function() {
  return !!window.JSON && typeof(JSON.parse) === 'function';
}());

var persistValue, readValue, deleteValue;
if (hasStorage) {
  persistValue = function(key, val) { return localStorage.setItem(key, val); };
  readValue = function(key) { return localStorage.getItem(key); };
  deleteValue = function(key) { return localStorage.removeItem(key); };
} else {
  persistValue = function(key, val) { return createCookie(key, val, 30); };
  readValue = function(key) { return readCookie(key); };
  deleteValue = function(key) { return deleteCookie(key); };
}

var hasConsole = !!window.console && !!console.log;
var debugAnalytics = !!document.location.search.match(/debugAnalytics=([^;]+)/);
var debugMode = debugAnalytics && RegExp.$1 === 'true';
var shouldLog = hasConsole && (readValue('__debugAnalytics') || (debugAnalytics && RegExp.$1 === 'log'));

module.exports = {
  hasStorage: hasStorage,
  hasJSON: hasJSON,
  hasConsole: hasConsole,
  debugMode: debugMode,
  shouldLog: shouldLog,
  debounce: debounce,
  createCookie: createCookie,
  readCookie: readCookie,
  deleteCookie: deleteCookie,
  persistValue: persistValue,
  readValue: readValue,
  deleteValue: deleteValue,
  getQueryParam: getQueryParam,
  Log: Log,
  loadScript: loadScript,
  isMobile: isMobile,
  isExternalEmbed: isExternalEmbed
};

function isMobile() { return jQuery(window).width() < 768; }

function debounce(func, wait, immediate) {
  var timeout;
  
  return function() {
    var context = this;
    var args = arguments;
    
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }

  return null;
}

function deleteCookie(name) {
  createCookie(name, "", -1);
}

function getQueryParam(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var _slice = Array.prototype.slice;

function Log(config) {
  this.namespace = config.namespace || '';
  this.lineNums = config.lineNums || false;
  
  var fmtOpts = config.fmtOptions;
  var fmt = '';
  if (typeof fmtOpts == 'object') {
    for (var option in fmtOpts) {
      fmt += (option + ':' + fmtOpts[option] + ';');
    }
  } else if (typeof fmtOpts === 'string') {
    fmt = fmtOpts;
  }

  this.fmt = fmt;
}

Log.prototype.format = function() {
  // config
  // var msgSeparator        = ' ';
  var lineSparator        = '\n';
  
  // get caller line number
  var lineNum             = getLineNumber();
  
  var namespace           = '%c#' + this.namespace + '%c';
  var msgInfo             = lineNum;
  var msg                 = _slice.call(arguments, 0);
  
  // tokens for string formatting of metadata and msg
  var infoToken           = getTokenForType(msgInfo);
  var msgTokens           = msg.map(function(msgString) { return getTokenForType(msgString); }).join(' ');
  var fullTokens          = ([namespace].concat(msgTokens));
  
  if (this.lineNums) {
    fullTokens = fullTokens.concat(infoToken);
  }

  var styles              = [this.fmt, '']; // second index is empty string to remove styles from msg
  var output              = [fullTokens.join(lineSparator)].concat(styles, msg);
  
  if (this.lineNums) {
    output = output.concat(msgInfo);
  }

  return output;
};

Log.prototype.log = function log() {
  var args = _slice.call(arguments, 0);
  if (shouldLog) return console.log.apply(console, this.format.apply(this, args));
};

Log.prototype.error = function error() {
  var args = _slice.call(arguments, 0);
  if (shouldLog) return console.error.apply(console, this.format.apply(this, args));
};

function getTokenForType(data) {
  var type = typeof(data);
  switch(type) {
    case 'string':
      return '%s';
    case 'number':
      return '%f';
    case 'object':
      return '%O';
  }
}

function getLineNumber() {
  return (new Error()).stack.split("\n")[4].trim();
}

function isIE () {
  var navigatorString = navigator.userAgent.toLowerCase();
  return (navigatorString.indexOf('msie') != -1) ? parseInt(navigatorString.split('msie')[1]) : false;
}

function loadScript(path) {
  var _deferred = new jQuery.Deferred();

  var a=document,
      b=a.createElement("script"),
      a=a.getElementsByTagName("script")[0];

  b.type="text/javascript";
  b.async=!0;
  b.src=path;

  b.onload = function() { _deferred.resolve(path + ' loaded'); };
  b.onerror = function() { _deferred.reject(path + ' error'); };

  a.parentNode.insertBefore(b,a);

  var ieVersion = isIE();
  if (ieVersion && ieVersion < 9) {
    return null;
  }

  return _deferred.promise();
}

function isExternalEmbed() {
	var isEmbed = window.self !== window.top;
	var isExternal;
	try {
		isExternal = !/washingtonpost\.com/.test(window.top.location.hostname);
	} catch(e) {
		isExternal = true;
	}

	return isEmbed && isExternal;
}

},{}]},{},[1]);
