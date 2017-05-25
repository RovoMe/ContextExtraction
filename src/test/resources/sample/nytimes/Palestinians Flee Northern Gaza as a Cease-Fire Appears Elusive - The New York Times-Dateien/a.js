/************ TAGX dynamic tags ************************/

(function() {
var tagger = new TAGX.Tagger();
TAGX.config = {};
TAGX.config.analyticsReady = function() { return (window.NYTD && window.NYTD.EventTracker && window.dcsMultiTrack) ? true : false }
var data = {"asset":{"url":"http://www.nytimes.com/2014/07/14/world/middleeast/israel-gaza.html","type":"Article","id":100000002997609,"authors":["ISABEL KERSHNER","STEVEN ERLANGER"],"headline":"Palestinians Flee Northern Gaza as a Cease-Fire Appears Elusive","section":"World","subsection":"Middle East","desFacets":["Civilian Casualties","International Relations","Palestinians"],"orgFacets":"","perFacets":["Netanyahu, Benjamin"],"geoFacets":["Gaza Strip","Israel","West Bank"],"kicker":"","publishedDate":1405310400000,"seoHeadline":"","desk":"Foreign","typeOfMaterial":"News","source":"The New York Times","contentTone":"","slug":"","wordCount":"","languageCode":"","printSection":"","printPage":"","originalDesk":"","assetId":""},"user":{"uid":0,"subscription":{"subscriptions":"","isNewsSubscriber":""},"loggedIn":false,"type":"anon","capabilities":[]},"static":{"env":{"ga_tracking_id_web":"UA-58630905-1","domain_event_tracker":"et.nytimes.com","domain_js_https":"static.nytimes.com","domain_js":"graphics8.nytimes.com","domain_www":"www.nytimes.com"},"comscoreKwd":{"business":"business","business - global":"global","Business Day - Dealbook":"dealbook","business - economy":"economy","business - energy-environment":"energy_environment","business - media":"media","business - smallbusiness":"smallbusiness","your-money":"your_money","Business Day - Economy":"economix","Business - Media and Advertising":"mediadecoder","Business Day - Small Business":"boss","Business Day - Your Money":"bucks","Business - Markets":"markets","Autos - wheels":"wheels","Science - Environment":"green","technology":"technology","technology - personaltech":"personaltech","Technology - bits":"bits","Technology - Personal Tech":"gadgetwise","Technology - pogue":"pogue","General - open":"open","style":"style","fashion":"fashion","dining":"dining","garden":"garden","fashion - weddings":"weddings","t-magazine":"t_magazine","T:Style - tmagazine":"t_style","Style - Dining":"dinersjournal","Style - Fashion":"runway","Style - parenting":"parenting","arts":"arts","arts - design":"design","books":"books","arts - dance":"dance","movies":"movies","arts - music":"music","arts - television":"television","theater":"theater","arts - video-games":"video_games","Arts - Event Search":"event_search","Arts - artsbeat":"artsbeat","Movies - carpetbagger":"carpetbagger","health":"health","health - research":"research","health - nutrition":"nutrition","health - policy":"policy","health - views":"views","Health - Health Guide":"health_guide","Health - well":"well","Health - newoldage":"newoldage","Health - consults":"consults","science":"science","science - earth":"earth","science - space":"space","Science - scientistatwork":"scientistatwork","Opinion - dotearth":"dotearth"}},"referrerDerived":{"source":null,"subchannel":null,"type":"earned","channel":null},"ga":{"derivedDesk":"international_desk","webPubDate_year":"","webPubDate_date":"","webPubDate_dow":"","webPubDate_tod":"","webPubDate_lastupdate":"2014-07-14-13","webPubDate_month":"","campaignMapping":{}},"cookies":{"NYT-Edition":"","nyt-a":"446b0ae2b88ba6cf5746fee1de710cff"},"page":{"url":{"query":{"module":"","pgtype":"","region":"","src":"","contentCollection":""},"path":"/2014/07/14/world/middleeast/israel-gaza.html","protocol":"http"}},"geo":{"dmaCode":501},"sourceApp":"nyt-v5","wt":{"dcsid":"dcspjt2na00000wcnvo8wdaeo_7q9o","contentgroup":"World","subcontentgroup":"Middle East"},"TAGX":{"ID":"e57998810129ee548797e7a0b04583b3","L":{"sessionIndex":"20","sessionStart":"1451181771729","isNewSession":"1","lastRequest":"1451181771729","prevRequest":"1433202073675","firstReferrer":"http://www.nytimes.com/","firstLanding":"http://www.nytimes.com/2014/07/14/world/middleeast/israel-gaza.html?_r=0","firstSeen":"1405271867238","browserSession":"4","activeDays":"[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]","pageIndex":"1"}},"agentID":"446b0ae2b88ba6cf5746fee1de710cff"};
var foldl=function(t,a,n){if(n.length<1)return a;var r=n.splice(0,1);return foldl(t,t(a,r),n)},getData=function(t){return foldl(function(t,a){try{return void 0===t[a]?"":t[a]}catch(n){return""}},data,t.split("."))};TAGX.data={get:getData,set:function(t,a){var n=t.split("."),r=n.pop();getData(n.join("."))[r]=a}};

// Tags
tagger.define("page.dom.custom", function (callback) {
    TAGX.$.domReady(function () {
        callback(function (params, callback) {
            var tagCtx = this;
            if (params.length > 0) {
                TAGX.$(TAGX).one(params[0], function (eventData) {
                    if (typeof tagCtx.eventsData === 'undefined') {
                        tagCtx.eventsData = {};
                    }
                    tagCtx.eventsData[params[0]] = eventData || {};
                    callback(true);
                });
            }
        });
    });
}
);tagger.tag().repeat('many').condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["abtest"], callback); }).run(function () {var _func = function() {var event = (this.eventsData ? this.eventsData.abtest : null);
if (event) {
    new NYTD.EventTracker().track(event);
    if (event.module !== null) {
        event.module = null;
    }
}
};try { (_func.bind(this))(); } catch (err) { console.error("adx-ab-allocation proxy", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }).run(function () {var _func = function() {var
  imageViewerTrack;

imageViewerTrack = function (eventData) {
  var
    data = TAGX.Utils.jsonObjToDCSparams(eventData);
  data.push('WT.z_dcsm', '1');
  data.push('WT.z_gpt', 'Multimedia');
  data.push('WT.z_gpst', eventData.module);
  data.push('WT.ti', 'Video Click to Play');
  data.push('DCS.dcssip', location.hostname);
  data.push('DCS.dcsuri', '/Video-Click-to-Play');
  dcsMultiTrack.apply(this, data);
};

TAGX.$(TAGX).on('media-viewer-play-video', imageViewerTrack);
};try { (_func.bind(this))(); } catch (err) { console.error("BX-2001 - Play Video Interaction", err); }});tagger.tag().repeat('many').condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["comscore-pageview-candidate"], callback); }).run(function () {var _func = function() {
/*** comscore tag for page view candidate ***/
/* relay */
TAGX.$(TAGX).trigger("loaded:comscoreVendorCode.js");
TAGX.$(TAGX).trigger("loaded:comscore.js");

};try { (_func.bind(this))(); } catch (err) { console.error("Comscore page view candidate tag", err); }});tagger.tag().repeat('many').condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["module-impression"], callback); }).run(function () {var _func = function() {var evtData = this.eventsData['module-impression'];
var moduleName = evtData.module.toLowerCase();
	
if (moduleName !== "ad") {

	var priorityObj = {
		gateway: 1,
		growl : 1,
        notification : 1
	};
	if(priorityObj.hasOwnProperty(moduleName)) {
		evtData.priority = true;
	}

	NYTD.pageEventTracker.addModuleImpression(evtData);	
}
};try { (_func.bind(this))(); } catch (err) { console.error("ET Module Impressions", err); }});tagger.tag().repeat('many').condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["module-interaction"], callback); }).run(function () {var _func = function() {/* ET module interactions tag */
var evtData = this.eventsData["module-interaction"];
NYTD.EventTracker().track(evtData);

};try { (_func.bind(this))(); } catch (err) { console.error("ET Module Interactions", err); }});tagger.tag().run(function () {var _func = function() {NYTD = window.NYTD || {};
NYTD.EventTrackerPageConfig = NYTD.EventTrackerPageConfig || {};
NYTD.EventTrackerPageConfig.event = NYTD.EventTrackerPageConfig.event || {};
TAGX.Utils.copyObj(NYTD.EventTrackerPageConfig.event, {
    pageMetaData: {
        value: function () {
            var name, content, i;
            var tags = document.getElementsByTagName('meta');
            var whiteListObj = {PT:"", CG:"", SCG:"", byl:"", tom:"", hdl:"", ptime:"", cre:"", articleid:"", channels:"", CN:"", CT:"", des:""};
            for (i = 0; i < tags.length; i += 1) {
                name = tags[i].getAttribute('name');
                content = tags[i].getAttribute('content');
                if (typeof name === 'string' && typeof content === 'string') {
                    if (whiteListObj.hasOwnProperty(name)) {
                        whiteListObj[name] = content;
                    }
                    
                }
            }
            
            // augment channels with scg stuff
            if (whiteListObj.CG.toLowerCase() === 'opinion') {
                whiteListObj.channels += whiteListObj.channels === '' ? '' : ';';
                whiteListObj.channels += whiteListObj.CG.toLowerCase();
            }
            
            return TAGX.Utils.stringifyJson(whiteListObj);
        }
    }
});
};try { (_func.bind(this))(); } catch (err) { console.error("ET Page Meta Override", err); }});tagger.tag().run(function () {var _func = function() {/* jshint -W097 */
/* global TAGX */
'use strict';
var i, pe;
var priorityEvents = [{
    eventName: 'page-break-equiv-nyt4',
    eventFields: ['nyt4pg']
}];
var setPriority = function (evtData, fields) {
    var i, fieldcount1, fieldcount2;
    var _fields = fields || [];
    fieldcount1 = 0;
    fieldcount2 = _fields.length;
    for (i = _fields.length - 1;i >= 0;i--) {
        if (typeof evtData[_fields[i]] !== 'undefined') {
            fieldcount1++;
        }
    }
    if (fieldcount1 === fieldcount2 && evtData.priority !== true) {
            evtData.priority = true;
    }
};
for (i = priorityEvents.length - 1;i >= 0;i--) {
    pe = priorityEvents[i];
    TAGX.$(TAGX).on(pe.eventName, setPriority, pe.eventFields);
}

};try { (_func.bind(this))(); } catch (err) { console.error("ET - prioritize page interaction events", err); }});tagger.tag().repeat('many').condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["track-page-view"], callback); }).run(function () {var _func = function() {/* tracking page view via the proxy */
var datum = this.eventsData["track-page-view"];
if(datum) {
    // move // moduleData out of the way
    if(JSON) {
        var mData = JSON.parse(datum.moduleData), attr;
        for(attr in mData) {
            if(mData.hasOwnProperty(attr) && !datum.hasOwnProperty(attr)) {
                datum[attr] = mData[attr];
            }
        }
    } else {
        // rename it to event data for now
        datum.eventData = datum.moduleData;
    }
    delete datum.moduleData;
    var extras = {
        sendMeta: true,
        useFieldOverwrites: true,
        buffer: false,
        collectClientData: true
    }
    datum.totalTime = 0;
    NYTD.EventTracker().track(datum, extras);
}
};try { (_func.bind(this))(); } catch (err) { console.error("ET Proxy Page View Tracking", err); }});tagger.tag().run(function () {var _func = function() {(
        function(f,b,e,v,n,t,s){
                n=window.fbq=function(){
                       var foo = n.callMethod? n.callMethod.apply(n,arguments): n.queue.push(arguments)
                    };
                n.version='1.0';
                n.pixelId=e;
                n.queue=[];
                t=f.createElement(b);
                t.async=true;
                t.src=v;
                s=f.getElementsByTagName(b)[0];
                s.parentNode.insertBefore(t,s)
            })(document,'script','592202027582499','//connect.facebook.net/en_US/fbevents.js');
// Custom audience - simple standard event
var meterCount = '';
var meterObject = TAGX.Utils.getMeterValue('v');
if (typeof meterObject !== 'undefined' && meterObject !== null) {
    meterCount = meterObject.v || '';
}
var facebookRegex = /\/FBIOS/i;
fbq('reportPageView', {
    mc: meterCount,
    sourceApp: TAGX.Utils.getMetaTag('sourceApp'),
    fbBrowser: facebookRegex.test(navigator.userAgent),
    userAgent: navigator.userAgent
});
};try { (_func.bind(this))(); } catch (err) { console.error("Facebook audience development pixel - sitewide", err); }});tagger.tag().run(function () {var _func = function() {var url, qsMap, sourceApp, urlparts, nytm_v, dim21_asset_type, query_fix;
var utils = TAGX.Utils;
var getMetaTag = utils.getMetaTag;
var asset_url = TAGX.data.get('asset.url');
var getUid = function() {
    var uid = TAGX.data.get('user.uid');
    var td = TAGX.data.get("TAGX");
    if (uid === 0 || !uid || uid === 1) {
        if (td.L && td.L.uid) {
            return td.L.uid;
        }
        return null;
    } else {
        return uid;
    }
};
var isEmptyValue = function (value) {
    return (typeof value === 'undefined' || value === null || value === '');
};
var zeroPadding = function (val) {
    return (val < 10 ? '0' + val : val);
};
var pdateFormat = function(date) {
    var match;
    if (date instanceof Date) {
        return [date.getFullYear(), zeroPadding(date.getMonth() + 1), zeroPadding(date.getDate())].join('-');
    } else if (typeof date === 'string' && (match = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(date)) && match.length === 7) {
        return match.splice(1, 3).join('-');
    }
    return '';
};
var ptimeFormat = function (dtStr) {
    var match;
    if (typeof dtStr === 'number') {
        var date = new Date(dtStr);
        return [
            pdateFormat(date),
            [zeroPadding(date.getHours()), zeroPadding(date.getMinutes())].join(':')
        ].join(' ');
    }
    else if (typeof dtStr === 'string' && (match = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(dtStr)) && match.length === 7) {
        return [pdateFormat(dtStr), match.splice(1, 2).join(':')].join(' ');
    }
    return '';
};
var getSubscriberSince = function() {
    var date;
    var int = (typeof subs[0].purchaseDate === 'number') ? subs[0].purchaseDate : undefined;
    if (typeof subs[0].purchaseDate === 'string') {
        int = parseInt(subs[0].purchaseDate, 10);
    }
    if (typeof int === 'number') {
        date = new Date(int);
    }
    return pdateFormat(date);
};
var getValue = function (val, defVal, retNullStr) {
    var argLen = arguments.length;
    var value = val;
    var defaultValue = '';
    var returnNullString = false;
    if (argLen === 2) {
        returnNullString = defVal;
    }
    else if (argLen === 3) {
        defaultValue = defVal;
        returnNullString = retNullStr;
    }
    if (isEmptyValue(value)) {
        if (isEmptyValue(defaultValue)) {
            return (returnNullString === true ? 'null' : '');
        }
        else {
            return defaultValue.toLowerCase ? defaultValue.toLowerCase() : defaultValue;
        }
    }
    if (typeof value === 'object') {
        if (value instanceof Array) {
            return value.join('|').toLowerCase();
        }
        else {
            return utils.stringifyJson(value);
        }
    }
    return value.toLowerCase ? value.toLowerCase() : value;
};
var mergeObjects = function (target, source, skip) {
    var k;
    for (k in source) if (source.hasOwnProperty(k)) {
        if (!isEmptyValue(source[k]) &&
            (isEmptyValue(target[k]) || skip !== true)) {
            target[k] = source[k];
        }
    }
};
var wordCountSize = function (count) {
    if (count < 100) {
        return 'BLURB_Under_100';
    } else if (count < 400) {
        return 'SUPER_SHORT_100_399';
    } else if (count < 800) {
        return 'SHORT_400_799';
    } else if (count < 1200) {
        return 'MEDIUM_800_1199';
    } else if (count < 1600) {
        return 'LONG_1200_1600';
    } else {
        return 'HEAVE_Over_1600';
    }
};

var subs = TAGX.data.get('user.subscription.subscriptions');
if ('string' === typeof subs) {
    if (subs === '') {
        subs = [{}];
    }
    else {
        try { subs = JSON.parse(subs); }
        catch (err) { console.error('Error parsing "user.subscription.subscriptions"', err); subs = [{}]; }
    }
}
if ((!Array.isArray(subs)) || subs.length === 0) {
    subs = [{}];
}

try {
    qsMap = utils.QsTomap();
    sourceApp = getMetaTag('sourceApp');
    urlparts = (function (url) {
        return [url[0], (url[1] ? url[1].split('#')[0] : '')];
    })(window.location.href.split('?'));
    nytm_v = (function (nytmv) {
        return nytmv && nytmv.hasOwnProperty('v') ? nytmv.v : '';
    })(utils.getMeterValue('v'));
    dim21_asset_type = (function (asset_type) {
        if (asset_type === 'SectionFront' &&
            /(international|www|mobile)\.(stg\.)?nytimes\.com\/(index\.html)?$/.test(asset_url)) {
            return 'nyt_homepage';
        }
        return asset_type;
    })(TAGX.data.get('asset.type'));
    query_fix = (function () {
        if (sourceApp === 'nyt-search' && !isEmptyValue(location.hash) && /^#\//.test(location.hash)) {
            return '?q=' + location.hash.split('/')[1];
        }
        return '';
    })();
    TAGX.config = TAGX.config || {};
    TAGX.config.GoogleAnalytics = {
        id: TAGX.data.get('static.env.ga_tracking_id_web'),
        // tracker: 'c3p0',
        createOptions: {
            cookieName: 'walley',
            cookieDomain: '.nytimes.com',
            name: 'r2d2'
        },
        fieldObject: {
            location: (asset_url || urlparts[0]) + query_fix,
            dimension1: urlparts[0],
            dimension4: getValue(getMetaTag('CG'), true),
            dimension10: getValue(TAGX.data.get('referrerDerived.source'), true),
            dimension13: getValue(TAGX.data.get('referrerDerived.subchannel'), true),
            dimension14: getValue(TAGX.data.get('ga.derivedDesk'), true),
            dimension15: getValue(TAGX.data.get('referrerDerived.type'), true),
            dimension16: getValue(TAGX.data.get('referrerDerived.channel'), true),
            dimension17: getValue(TAGX.data.get('asset.id'), getMetaTag('articleid'), true),
            dimension18: getValue(TAGX.data.get('asset.authors'), getMetaTag('byl').replace(/^[Bb]y /, ''), true),
            dimension19: getValue(TAGX.data.get('asset.headline'), getMetaTag('hdl'), true),
            dimension21: getValue(dim21_asset_type, getMetaTag('PT'), true),
            dimension23: getValue(TAGX.data.get('asset.section'), getMetaTag('CG'), true),
            dimension25: getValue(TAGX.data.get('asset.subsection'), getMetaTag('SCG'), true),
            dimension42: getValue(getMetaTag('sourceApp'), 'nyt4', true),
            dimension60: getUid() || 'null',
            dimension62: getValue(TAGX.data.get('cookies.NYT-Edition'), true),
            dimension63: getValue(TAGX.data.get('cookies.nyt-a'), true),
            dimension64: getValue(TAGX.data.get('user.loggedIn'), true),
            dimension65: getValue(TAGX.data.get('user.type'), true),
            // Push Order "B"
            dimension2: urlparts[0] + (urlparts[1] ? '?' + urlparts[1] : ''),
            dimension6: getValue(TAGX.data.get('page.url.query.module'), qsMap.module, true), //Referring_Module
            dimension7: getValue(TAGX.data.get('page.url.query.pgtype'), qsMap.pgtype, true), //Referring_Page_Type
            dimension8: getValue(TAGX.data.get('page.url.query.region'), qsMap.region, true), //Referring_Region
            dimension9: getValue(document.referrer.split('?')[0], true), //Referring_Page
            // dimension10: getValue(TAGX.data.get('page.url.query.src'), qsMap.src, true), //SRC
            dimension12: getValue(getMetaTag('SCG'), true),
            dimension43: getValue(TAGX.data.get('asset.desFacets'), getMetaTag('des'), true),
            dimension44: getValue(TAGX.data.get('asset.orgFacets'), getMetaTag('org'), true),
            dimension45: getValue(TAGX.data.get('asset.perFacets'), getMetaTag('per'), true),
            dimension46: getValue(TAGX.data.get('asset.geoFacets'), getMetaTag('geo'), true),
            // dimension47: 'collection group',     //Collection_Group
            dimension59: getUid(),
            dimension61: getValue(nytm_v, true),
            dimension66: getValue(TAGX.data.get('geo.dmaCode'), true),
            dimension67: getValue(TAGX.data.get('user.subscription.isNewsSubscriber'), true), //Is_News_Subscriber
            dimension68: getValue(getMetaTag('channels'), true), //Channels
            contentGroup1: getValue(TAGX.data.get('asset.section'), getMetaTag('CG'), true),
            contentGroup2: getValue(TAGX.data.get('asset.subsection'), getMetaTag('SCG'), true),
            contentGroup3: getValue(getMetaTag('PT'), true),
            contentGroup4: getValue(getMetaTag('PST'), true),
            // push order C
            dimension3: getValue(urlparts[1], true),
            dimension5: /^paidpost/.test(window.location.hostname) ? 1 : 0,
            dimension11: getValue(TAGX.data.get('page.url.query.contentCollection'), qsMap.contentCollection, true),
            dimension20: getValue(TAGX.data.get('asset.kicker'), true),
            dimension22: getValue(ptimeFormat(TAGX.data.get('asset.publishedDate')), ptimeFormat(getMetaTag('ptime')), true),
            dimension24: getValue(TAGX.data.get('asset.seoHeadline'), true),
            dimension38: getValue(TAGX.data.get('asset.desk'), true),
            dimension39: getValue(TAGX.data.get('asset.typeOfMaterial'), getMetaTag('tom'), true),
            dimension40: getValue(TAGX.data.get('asset.source'), getMetaTag('cre'), true),
            dimension129: getValue(new Date().getHours(), true),
            dimension130: getValue(TAGX.Utils.getCookie('NYT-wpAB'), ''),
            dimension133: getValue(TAGX.data.get('TAGX.ID'), ''),
            // push order D
            dimension50: getValue(getMetaTag('PST'), true), //Page SubType
            // push order D
            dimension26: getValue(TAGX.data.get('ga.webPubDate_year'), true), //Publish_Year_Web
            dimension27: getValue(TAGX.data.get('ga.webPubDate_date'), true), //Publish_Date_Web
            dimension28: getValue(TAGX.data.get('ga.webPubDate_dow'), true), //Publish_Day_of_Week_Web
            dimension29: getValue(TAGX.data.get('ga.webPubDate_tod'), true), //Publish_Time_of_Day
            dimension30: getValue(TAGX.data.get('ga.webPubDate_lastupdate'), true), //Publish_Last_Update_Web
            dimension48: getValue(TAGX.data.get('ga.webPubDate_month'), true), //Publish_Month_Web
            // sprint 69 (BX-6594)
            dimension31: getValue(TAGX.$('*[data-total-count]').last().data('totalCount'), true), //Character_Count
            dimension34: getValue(TAGX.data.get('asset.contentTone'), getMetaTag('tone'), true), //Content_Tone
            dimension36: getValue(TAGX.data.get('asset.slug'), getMetaTag('slug'), true), //Slug
            dimension37: getValue(TAGX.data.get('asset.wordCount'), true), //Word_Count
            dimension101: getValue(TAGX.data.get('asset.languageCode'), true), //Multi-lingual_asset
            dimension121: getValue(TAGX.data.get('asset.printSection') + TAGX.data.get('asset.printPage'), true), //Print_section
            // sprint 70 (BX-6833)
            dimension52: getValue(getMetaTag('applicationName'), true),
            // sprint 73 (BX-7023)
            dimension49: getValue(wordCountSize(TAGX.data.get('asset.wordCount')), true),
            dimension92: getValue(subs[0].offerChainId, true),
            dimension95: getValue(getSubscriberSince(), true),
            dimension96: getValue(subs[0].bundle, true),
            dimension53: getValue(TAGX.data.get('asset.originalDesk'), true)
        }
    };
    mergeObjects(TAGX.config.GoogleAnalytics.fieldObject, TAGX.data.get('ga.campaignMapping'));
    if (typeof getUid() === 'number' && getUid() !== 0) {
        TAGX.config.GoogleAnalytics.createOptions.userId = getUid();
    }
} catch (e) {
    url = '//' + TAGX.data.get('static.env.domain_event_tracker') + '/pixel?' + utils.mapToQs({
        subject: 'ga-debug',
        url: window.location.href,
        payload: utils.stringifyJson({
            error: {
                message: e.message || 'unknown error',
                stack: e.stack || 'no stack trace available'
            }
        }),
        doParse: utils.stringifyJson(['payload'])
    });
    TAGX.$('<img>').css({'border-style':'none'}).attr({height:1,width:1,src:url}).appendTo('body');
}
};try { (_func.bind(this))(); } catch (err) { console.error("GA Config - Web", err); }});tagger.tag().run(function () {var _func = function() {/* if this page is not the top document it should not be counted as a site wide page */
if (window.top != window.self) {
    var exceptions = {
        "/regilite": 1
    };
    var setSubject = function() {
        var defValue = "iframedNYTpage";
        if (exceptions.hasOwnProperty( TAGX.data.get('page.url.path') ) || TAGX.data.get('sourceApp') === "nyt-fb-native-external-iframe") {
            defValue = "page";
        }
        return defValue;
    };
    NYTD = window.NYTD || {};
    NYTD.EventTrackerPageConfig = NYTD.EventTrackerPageConfig || {};
    NYTD.EventTrackerPageConfig.event = NYTD.EventTrackerPageConfig.event || {};
    TAGX.Utils.copyObj(NYTD.EventTrackerPageConfig.event, {
        siteWide: {
            value: 0
        },
        subject: {
            value: setSubject()
        },
        instant: {
            value: true
        }
    });
}
};try { (_func.bind(this))(); } catch (err) { console.error("iFramed NYT Page", err); }});tagger.tag().run(function () {var _func = function() {(function () {
    // cache tools
    var meta = TAGX.Utils.getMetaTag;

    // record social sign on click
    TAGX.$(document).on('mousedown', '.oauth-ew5_btn, .oauth-button', function (e) {

        var el = TAGX.$(this);
        var elHtml = el.html();

        // find out which provider was used
        var provider = 'Unknown';
        if (elHtml.indexOf('Google') !== -1) {
            provider = 'Google';
        }

        if (elHtml.indexOf('Facebook') !== -1) {
            provider = 'Facebook';
        }

        var data = {
            'module': 'social-signon',
            'version': provider,
            'action': 'signon',
            'pgType': meta('PT')
        };

        TAGX.EventProxy.trigger('SocialSignOn', data, 'interaction');
    });

    // switch from login to regi or vice versa
    TAGX.$(document).on('mousedown', 'a.log-in, .login-modal .registration-modal-trigger, .registration-modal .login-modal-trigger', function (e) {

        var el = TAGX.$(this);

        // find out which action
        var action;
        elHtml = el.html();
        if (elHtml.indexOf('Create') !== -1 || elHtml.indexOf('Sign Up') !== -1 || elHtml.indexOf('Register') !== -1) {
            action = 'switchtoregi';
        } else {
            action = 'switchtologin';
        }

        var data = {
            'module': 'social-signon',
            'version': 'NYTimes',
            'action': action,
            'pgType': meta('PT')
        };

        TAGX.EventProxy.trigger('NYTimesSignOn', data, 'interaction');
    });

    // traditional login and regi
    TAGX.$(document).on('mousedown', '#main .loginButton, #main .login-button, .login-modal .login-button, .registration-modal .register-button', function (e) {

        var el = TAGX.$(this);

        // find out which action
        var action;
        elHtml = el.html();

        if (elHtml.indexOf('CREATE') !== -1 || elHtml.indexOf('Create') !== -1) {
            action = 'register';
        } else {
            action = 'login';
        }

        var data = {
            'module': 'social-signon',
            'version': 'NYTimes',
            'action': action,
            'pgType': meta('PT')
        };

        // capture newsletters if regi
        if (action === 'register') {
            var newsletters = [];
            TAGX.$('.registrationForm input[type="checkbox"]:checked').each(function (element, index) {
                var el = TAGX.$(element);
                newsletters.push(el.val());
            });
            data.mData = newsletters.toString();
        }

        TAGX.EventProxy.trigger('NYTimesSignOn', data, 'interaction');
    });
})();
};try { (_func.bind(this))(); } catch (err) { console.error("NYT SSO", err); }});tagger.tag().repeat('many').condition(function (callback) { (TAGX.Ops.and.call(this, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:comscoreVendorCode.js"], callback); }, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:comscore.js"], callback); }))(callback); }).run(function () {var _func = function() {var canonical, cg, extractContent, getUrl, href, queryString, scg, tagComscore, url;

extractContent = function(el) {
  var content;
  content = null;
  if (el !== null && el !== void 0 && el.length > 0 && el[0].content !== null && el[0].content !== void 0) {
    content = el[0].content;
  }
  return content;
};

getUrl = function(url, canonical, query) {
  var href;
  href = canonical !== null && canonical !== void 0 ? canonical : url;
  href += '?' + query;
  return href;
};

tagComscore = function(udm, keyMapping, url, cg, scg) {
  var comscoreConfig, comscoreKeyword, comscoreMappingKey, udmURL;
  comscoreMappingKey = [];
  comscoreConfig = ['c1=2', 'c2=3005403'];
  if (cg !== null && cg !== void 0) {
    comscoreMappingKey.push(cg);
  }
  if (scg !== null && scg !== void 0 && scg !== '') {
    comscoreMappingKey.push(scg);
  }
  comscoreKeyword = keyMapping[comscoreMappingKey.join(' - ')];
  if (url.indexOf('markets.on.nytimes.com') !== -1) {
    if (url.indexOf('portfolio') !== -1) {
      comscoreKeyword = 'portfolio';
    }
    if (url.indexOf('screener') !== -1) {
      comscoreKeyword = 'screener';
    }
    if (url.indexOf('analysis_tools') !== -1) {
      comscoreKeyword = 'analysis_tools';
    }
  }
  if (comscoreKeyword !== void 0) {
    comscoreConfig.push('comscorekw=' + comscoreKeyword);
  }
  udmURL = 'http';
  udmURL += url.charAt(4) === 's' ? 's://sb' : '://b';
  udmURL += '.scorecardresearch.com/b?';
  udmURL += comscoreConfig.join('&');
  return udm(udmURL);
};

href = window.location.href;

queryString = document.location.search;

canonical = extractContent(document.getElementsByName('canonicalURL'));

cg = extractContent(document.getElementsByName('CG'));

scg = extractContent(document.getElementsByName('SCG'));

url = getUrl(href, canonical, queryString);

tagComscore(udm_, TAGX.data.get('static.comscoreKwd'), url, cg, scg);
};try { (_func.bind(this))(); } catch (err) { console.error("Comscore Tag", err); }});tagger.tag().run(function () {var _func = function() {var script = document.createElement("script");
var html = "window.Krux||((Krux=function(){Krux.q.push(arguments)}).q=[]);" +
    "(function(){ var k=document.createElement('script');k.type='text/javascript';k.async=true;var m,src=(m=location.href.match(/\bkxsrc=([^&]+)\b/))&&decodeURIComponent(m[1]); k.src=(location.protocol==='https:'?'https:':'http:')+'//cdn.krxd.net/controltag?confid=HrUwtkcl'; var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(k,s); })();";
TAGX.$(script).attr({
    "class": "kxct",
    "data-id": "HrUwtkcl",
    "data-version": "async:1.7",
    "type": "text/javascript"
});
script.text = html;
TAGX.$("head").append(script)
};try { (_func.bind(this))(); } catch (err) { console.error("Global - Krux control tag", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }).run(function () {var _func = function() {(function (z_aca) {
    var name;
    var commentEventHandler = function (eventData, eventName) {
        var data = TAGX.Utils.jsonObjToDCSparams(eventData).concat(["WT.z_dcsm", "1", "WT.gcom", "Com"]);
        var zaca = z_aca[eventName];
        if (zaca && typeof zaca === "object") {
            zaca = zaca[eventData.eventName];
        }
        dcsMultiTrack.apply(this, data.concat(["WT.z_aca", zaca]));
    };
    for (name in z_aca) {
        if (z_aca.hasOwnProperty(name)) {
            TAGX.$(TAGX).on(name, commentEventHandler, name);
        }
    }
})({
    "comments-open-panel": "More-coms",
    "comments-read-more": "More-coms-in-panel",
    "post-comment": "Post",
    "recommend-comment": { "Rec": "Rec", "Un-Rec": "Un-rec" },
    "load-replies": "All-replies",
    "load-more-comments": "More-coms-in-panel",
    "auto-open-comments-panel": "More-coms"
})
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - Webtrends comments", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }).run(function () {var _func = function() {TAGX.$(TAGX).on("masthead-search-click", function (evtData) {
    var mydata = TAGX.Utils.jsonObjToDCSparams(evtData);
    dcsMultiTrack.apply(this, mydata.concat(["WT.z_dcsm", "1"]));
})
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - Webtrends Masthead Search Click", err); }});tagger.tag().condition(function (callback) { (TAGX.Ops.and.call(this, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:WTHelperFunctions.js"], callback); }))(callback); }).run(function () {var _func = function() {
var intervalId, howManyTimes = 0, maxChecks = 5, done = 0, WTData = [];

var meterIsReady = function(mtr) {
    // check if the NYTD.Meter.loaded
    if (mtr && typeof mtr === 'object' && mtr.final === true && done === 0) {
        // remove the interval
        clearInterval(intervalId);
        done = 1;
        var meterValue = TAGX.Utils.getMeterValue(["imv", "ica"]);
        if (meterValue && meterValue.imv !== null) {
            WTData.push("WT.z_imv");
            WTData.push("" + meterValue.imv);
        }
        if (meterValue && meterValue.ica !== null) {
            WTData.push("WT.z_ica");
            WTData.push("" + meterValue.ica);
        }

        // make tha call
        dcsMultiTrack.apply(window, WTData.concat(["WT.z_dcsm", "1"]))
    } else {
        // howManyTimes
        if(howManyTimes > maxChecks) {
            clearInterval(intervalId); // don't do it no more    
        }
    }
};

var getMeterObj = function(root, meterReadyCallBack) {
        'use strict';

        // exports for NYT5
        if (typeof define === "function" && define.amd) {
            require(['auth/mtr'], function (mtr) {
                meterReadyCallBack(mtr);
            });
        } else if (typeof window.NYTD === 'object') {
            meterReadyCallBack(NYTD.Meter);
        }
};

intervalId = setInterval(function() {
        // check if the meter is ready again.
        howManyTimes++;
        getMeterObj(window, meterIsReady);
    }, 250)

};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - Webtrends Meter Values", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }).run(function () {var _func = function() {var mapping = {
    "Share-facebook": {
        ti: "Article-Tool-Share-facebook",
        dcsuri: "/Article-Tool-Share-facebook.html"
    },
    "Share-twitter": {
        ti: "Article-Tool-Share-Twitter",
        dcsuri: "/Article-Tool-Share-Twitter.html"
    },
    "Share-linkedin": {
        ti: "Article-Tool-Share-LinkedIn",
        dcsuri: "/Article-Tool-Share-LinkedIn.html"
    },
    "Share-email": {
        ti: "Article-Tool-Share-Email",
        dcsuri: "/Article-Tool-Share-Email.html"
    },
    "Share-Digg": {
        ti: "Article-Tool-Share-Digg",
        dcsuri: "/Article-Tool-Share-Digg.html"
    },
    "Share-reddit": {
        ti: "Article-Tool-Share-Reddit",
        dcsuri: "/Article-Tool-Share-Reddit.html"
    },
    "Share-Tumblr": {
        ti: "Article-Tool-Share-Tumblr",
        dcsuri: "/Article-Tool-Share-Tumblr.html"
    },
    "Share-Permalink": {
        ti: "Article-Tool-Share-Permalink",
        dcsuri: "/Article-Tool-Share-Permalink.html"
    },
    "Share-google": {
        ti: "Article-Tool-Share-GooglePlus",
        dcsuri: "/Article-Tool-Share-GooglePlus.html"
    },
    "Share-ShowAll": {
        ti: "Article-Tool-Share-ShowAll",
        dcsuri: "/Article-Tool-Share-ShowAll.html"
    },
    "ArticleTool-print": {
        ti: "Article-Tool-Print",
        dcsuri: "/Article-Tool-Print.html"
    },
    "ArticleTool-reprints": {
        ti: "Article-Tool-Reprints",
        dcsuri: "/Article-Tool-Reprints.html"
    },
    "ArticleTool-save": {
        ti: "Article-Tool-Save",
        dcsuri: "/Article-Tool-Save.html"
    },
    "Share-Facebook": {
        ti: "Article-Tool-Share-facebook",
        dcsuri: "/Article-Tool-Share-facebook.html",
        gcom: "Com"
    },
    "Share-Twitter": {
        ti: "Article-Tool-Share-Twitter",
        dcsuri: "/Article-Tool-Share-Twitter.html",
        gcom: "Com"
    }
};
var eventHandler = function (eventData) {
    var evtData, dcssip, dcsuri, addition, gcom;
    var dcs = window.webtrendsAsyncInit;
    var map = mapping[eventData.eventName];
    if (!dcs) {
        return;
    }

    evtData = TAGX.Utils.jsonObjToDCSparams(eventData);
    addition = ["WT.z_dcsm", "1", "WT.z_loc", eventData.region];

    if (map) {
        dcssip = dcs.DCS.dcssip;
        dcsuri = dcs.DCS.dcsuri;
        dcs.DCS.dcssip = "www.nytimes.com";
        dcs.DCS.dcsuri = map.dcsuri;
        addition = addition.concat(["WT.ti", map.ti]);
        if (map.gcom || eventData.version === "CommentsPanel") {
            addition = addition.concat(["WT.gcom", (map.gcom || "Com")]);
        }
    }

    dcsMultiTrack.apply(this, evtData.concat(addition));

    if (map) {
        dcs.DCS.dcssip = dcssip;
        dcs.DCS.dcsuri = dcsuri;
    }
};
TAGX.$(TAGX).on("share-tools-click", eventHandler);
TAGX.$(TAGX).on("comments-share", eventHandler)
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - WebTrends - ShareTools", err); }});tagger.tag().condition(function (callback) { (TAGX.Ops.and.call(this, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:WTHelperFunctions.js"], callback); }))(callback); }).run(function () {var _func = function() {var dcs=window.dcs || "";
var source_app_map = {
    "blogs": "nyt-v5"
};
/* Init WebTrends */
window.webtrendsAsyncInit=(function(){
    var colMeta = null;
    var getMetaTag = TAGX.Utils.getMetaTag;
    var pagetype = getMetaTag("PT");

    dcs = new Webtrends.dcs();
    dcs.init({
        dcsid: TAGX.data.get('wt.dcsid') || "dcsym57yw10000s1s8g0boozt_9t1x",
        domain: "wt.o.nytimes.com",
        timezone: -5,
        i18n: false,
        anchor: false,
        fpcdom: (function(d){
            return d.length >= 2 ? d.slice(-2).join('.') : '';
        })(window.location.hostname.split('.')),
        plugins:{
        }
    });

    dcs.WT.cg_n = TAGX.data.get('wt.contentgroup');
    dcs.WT.cg_s = TAGX.data.get('wt.subcontentgroup');

    dcs.WT.z_rmid = TAGX.Utils.getCookie("RMID");
    dcs.WT.z_nyts = TAGX.Utils.getCookie("NYT-S");
    dcs.WT.z_nytd = TAGX.Utils.getCookie("nyt-d");
    dcs.WT.z_stcap = TAGX.data.get('user.capabilities');
    dcs.WT.z_stat = TAGX.data.get('user.type');

    dcs.WT.z_gpt = pagetype;
    dcs.WT.z_gpst = getMetaTag("PST");      // page subtype
    dcs.WT.cre = getMetaTag("cre"); 

    dcs.WT.z_gpsst = getMetaTag("PSST");     // page sub 2 type
    dcs.WT.z_gpssst = getMetaTag("PSSST");    // page sub 3 type
    dcs.WT.z_pc = getMetaTag("PC");       // partner content
    dcs.WT.z_ps = getMetaTag("PS");       // partner supplied 
    dcs.WT.z_puv = getMetaTag("PUV");      // publish view
    dcs.WT.z_gosst = getMetaTag("GOOST");    // global onsite search
    dcs.WT.z_gosst = getMetaTag("GOSST");    // global onsite search
    dcs.WT.z_gsac = getMetaTag("GSAC");     // global search auto complete
    dcs.WT.z_gtn = getMetaTag("GTN");      // global topic name
    dcs.WT.gcom = getMetaTag("GCOM");     // global - community page
    dcs.WT.z_tvt = getMetaTag("TVT");      // travel meta tag
    dcs.WT.z_tvn = getMetaTag("TVN");      // travel meta tag
    dcs.WT.z_tvid = getMetaTag("TVID");     // travel meta tag
    dcs.WT.z_tDest = getMetaTag("TDES");     // travel meta tag
    dcs.WT.z_tRegion = getMetaTag("TDREG");    // travel meta tag
    dcs.WT.z_gblc = getMetaTag("GBLC");      // global - blogs 
    dcs.WT.z_bn = getMetaTag("BN");
    dcs.WT.z_hpt = getMetaTag("HPT");      // home page type - Extra

    // Collection pages.
    colMeta = getMetaTag("CN");
    if (typeof colMeta == "string" && colMeta.length > 0) {
        dcs.WT.z_collection = colMeta;
    }
    colMeta = getMetaTag("CT");
    if (typeof colMeta == "string" && colMeta.length > 0) {
        dcs.WT.z_collectiontype = colMeta;
    }
    colMeta = null;

    // Set global cookie tracking info
    if (/NYT-Global/.test(document.cookie)) {
        dcs.WT.gv = "2";
    } else if (/edition\|GLOBAL/.test(document.cookie)) {
        dcs.WT.gv = "1";
    }
    dcs.WT.sourceapp = source_app_map[TAGX.data.get('sourceApp')] || TAGX.data.get('sourceApp'); // source app

    // Set article information
    var metaArticleId = TAGX.data.get('asset.assetId');
    if(!metaArticleId || metaArticleId === "") {
        metaArticleId = getMetaTag("articleid");
    }
    
    var wtHelperFn; 
    try {
        wtHelperFn = new wtHelper(TAGX.Utils);
    } catch(e) {
        //console.log(e);    
        // now what???
    }
    
    if (metaArticleId !== "" && getMetaTag("PST") !== "Comments Overflow" && wtHelperFn) {
        wtHelperFn.setArticleInfo(metaArticleId, dcs.WT);
    } else {
        //setCommentOverflowInfo(metaArticleId);
    }

    if(dcs.WT.z_pud && dcs.WT.z_pud !== "" ) {
        dcs.WT.z_pudr = wtHelperFn.getPubDateRange(dcs.WT.z_pud);
        dcs.WT.z_pyr = dcs.WT.z_pud.substring(0, 4);
    }

    if(wtHelperFn) {
        // set registration values
        wtHelperFn.setRegistrationSection(TAGX.data.get('wt.contentgroup'), TAGX.data.get('wt.subcontentgroup'));
        wtHelperFn.setContentInfo(TAGX.data.get('wt.contentgroup'), dcs.WT);

        
        // Set interactive information

        var tomMetaTag = TAGX.data.get('asset.typeOfMaterial') !== "" ? TAGX.data.get('asset.typeOfMaterial') : getMetaTag("tom");
        if (tomMetaTag == "interactive_graphic" || tomMetaTag == "interactive_feature" || tomMetaTag == "Interactive Feature") {
            dcs.WT.z_gpt = "Multimedia";
            dcs.WT.z_gpst = "Flash";
        }

        // Set imagepages 
        if (/^\/imagepages/.test(TAGX.data.get('page.url.path'))) {
            TAGX.Utils.addMetaTag("PT", "Multimedia");
            TAGX.Utils.addMetaTag("PST", "Image");

        }

        // Set slideshow information
        if ((tomMetaTag == "Slideshow") || (/^\/slideshow\/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\//.test(TAGX.data.get('page.url.path')))) {
            
            dcs.WT.z_gpt = "Multimedia";
            dcs.WT.z_gpst = "Slideshow";
            TAGX.Utils.addMetaTag("WT.z_pud", getMetaTag("pdate"));
            TAGX.Utils.addMetaTag("WT.z_sssn", getMetaTag("SSSN"));
            TAGX.Utils.addMetaTag("WT.z_ssts", getMetaTag("SSTS"));
            TAGX.Utils.addMetaTag("WT.z_sse", getMetaTag("SSE"));    
        }

        // set Sunday Review info
        if ((/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/sunday-review\//.test(TAGX.data.get('page.url.path'))) || 
             (/[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]\/opinion\/sunday\//.test(TAGX.data.get('page.url.path')))) {
            dcs.WT.cg_n = "Opinion";
            dcs.WT.cg_s = "Sunday Review";
        }

        
    }
    // same as set section front function
    if ( dcs.WT.z_gpt == "Section Front" && dcs.WT.cg_s) {
        TAGX.Utils.addMetaTag("WT.z_gpst", "Subsection Front");
    }

    if (TAGX.data.get('user.uid')) {
        dcs.WT.dcsvid = TAGX.data.get('user.uid');
    }
    dcs.WT.rv = (TAGX.data.get('user.loggedIn') === true ? "1" : "0");

    if (TAGX.Utils.getMetaTag("errorpage") === "true") {
        dcs.WT.cg_n = "Member Center";
        dcs.WT.z_gpt = "Member Center";
        dcs.WT.z_gpst = "Error Page";
        TAGX.Utils.addMetaTag("WT.ti", "The New York Times > Page Not Found");
    }
                                      
    // if channels information is available
    if (TAGX.Utils.getMetaTag("channels") !== "") {
        dcs.DCS.channels = TAGX.Utils.getMetaTag("channels");
    }                                  

    if (pagetype === "article") {
        dcs.DCS.nyt4pg = "1";
    }
	// Don't send WT.z_aid if WT.z_recipeid exists. Workaround for recipe pages.
	if (TAGX.Utils.getMetaTag('WT.z_recipeid')) {
		delete dcs.WT.z_aid;
	}

    dcs.track({finish: function(dcs, options) {
        // After page load data sent, clear dcsqry (parameter-value pairs in Address Bar)
        dcs.DCS.dcsqry = "";
        dcs.DCS.nyt4pg = "";
//        dcs.DCS.nyt4totpg = "";
    }});

    return dcs;
}());
};try { (_func.bind(this))(); } catch (err) { console.error("Webtrends Init Tag", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }).run(function () {var _func = function() {var pattern = /^MiddleRight([\d]+)$/;
TAGX.$(TAGX).one("scroll-update-char-count", function (eventData) {
    var lastpage = 1;
    var pageNum = ((eventData && typeof eventData.numPages === "number") ? eventData.numPages : 1);
    if (pageNum === 1) {
        return;
    }
    TAGX.$(TAGX).on("ad-render", function (eventData) {
        var match, page;
        if (eventData && "AdImpression" === eventData.eventName) {
            if (eventData.version === "Box1") {
                page = pageNum;
            }
            else if ((match = pattern.exec(eventData.version))) {
                page = parseInt(match[1], 10) + 1;
            }
            if (lastpage < page && page <= pageNum) {
                lastpage = page;
                dcsMultiTrack.apply(this, ["WT.z_dcsm", "1", "DCSext.nyt4pg", page, "DCSext.nyt4totpg", pageNum.toString()]);
                try {
                    NYTD.pageEventTracker.updateData({"nyt4pg" : page, "nyt4totpg": pageNum.toString()}); 
                    NYTD.pageEventTracker.shortCircuit();   
                } catch(e) {

                }
            }
        }
    });
})
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - WT - NYT4 Page Break", err); }});tagger.tag().condition(function (callback) { (TAGX.Ops.and.call(this, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:WTHelperFunctions.js"], callback); }))(callback); }).run(function () {var _func = function() {var eventHandler = function (evtData) {
    var data = TAGX.Utils.jsonObjToDCSparams(evtData);
    dcsMultiTrack.apply(this, data.concat(["WT.z_dcsm", "1"]));
};
TAGX.$(TAGX).on("ribbon-page-right", eventHandler);
TAGX.$(TAGX).on("ribbon-page-left", eventHandler)
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - WT - Track Ribbon interactions", err); }});tagger.tag().run(function () {var _func = function() {var parser = document.createElement('a');
    parser.href = document.referrer;
var url = "//s.tagsrvcs.com/2/818492/analytics.js?pp=" + parser.hostname + "&sn=" + TAGX.data.get('asset.section') + "&c1=" + encodeURIComponent(location.href) + "&ui=" + encodeURIComponent(TAGX.data.get('cookies.nyt-a')) + "&dt=8184921433871988867000";
TAGX.Utils.includeFile(url, true, "body", false, null);
};try { (_func.bind(this))(); } catch (err) { console.error("whiteops", err); }});tagger.tag().run(function () {var _func = function() {TAGX.ScrollManager.trackImpression([".related-coverage-marginalia"], function() {
    TAGX.EventProxy.trigger("related-coverage-marginalia", {
        module: "RelatedCoverage-Marginalia",
        eventName: "Impression",
        pgType: TAGX.Utils.getMetaTag("PT"),
        contentCollection: TAGX.Utils.getMetaTag("CG"),
        priority: true
    }, "impression");
});
};try { (_func.bind(this))(); } catch (err) { console.error("related article module impression", err); }});tagger.tag().run(function () {var _func = function() {var jsHost = TAGX.data.get('page.url.protocol') === 'https' ? TAGX.data.get('static.env.domain_js_https') : TAGX.data.get('static.env.domain_js');

TAGX.$(TAGX).on('loaded:EventTracker.js', function() {
    // Load the show_ads.js file
    head.js('//' + jsHost + '/bi/js/analytics/show_ads.js', function() {
        // show_ads.js sets TAGX.adBlockDetected to false
        // If the JS file is blocked by an ad blocker it will be undefined
        // Update ET with this information
        NYTD.pageEventTracker.updateData({'adBlockEnabled': (TAGX.adBlockDetected !== false)});
    }); 
});
};try { (_func.bind(this))(); } catch (err) { console.error("Detect Ad Block", err); }});tagger.tag().run(function () {var _func = function() {/****** start of DY tag *****/
TAGX.$("<div id='DYSCR'></div>").appendTo('body');
window.DY = {scsec : 8765260 ,API: function(){(DY.API.actions = DY.API.actions || []).push(arguments)}};
(function(){
	var d=document,e='createElement',a='appendChild',g='getElementsByTagName',m='getElementById',i=d[e]('iframe'); 
	i.id=i.name='DY-iframe'; i.style.display='none'; i.width=i.height='1px';d[m]('DYSCR')[a](i);
	DY.x = function(w) { var d=w.document, s=d[e]('script');s.type='text/javascript'; s.async=true;          s.src=('https:'==d.location.protocol?'http://st.dynamicyield.com'.replace('http:','https:') : 'http://st.dynamicyield.com')+'/ast?sec='+DY.scsec; 
	d[g]('head')[0][a](s);}; var c = i.contentWindow.document;
	c.open().write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><body onload="parent.DY.x(window)" style="margin:0"></'+'body></html>');
	c.close();
})();
/******* end of DY tag *******/ 

};try { (_func.bind(this))(); } catch (err) { console.error("Dynamic Yield Tag*", err); }});tagger.tag().repeat('many').condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["page-interaction"], callback); }).run(function () {var _func = function() {var eData = this.eventsData["page-interaction"];
if(eData) {
    delete eData.module; // to prevent confussion.
    NYTD.pageEventTracker.updateData(eData);
    if ((eData.depth && typeof eData.depth === 'number') || eData.priority === true) { // ideally we get priority flag in the event
        delete eData.priority; // to prevent confussion
        NYTD.pageEventTracker.shortCircuit();  
    }
}
};try { (_func.bind(this))(); } catch (err) { console.error("ET Page Interactions", err); }});tagger.tag().run(function () {var _func = function() {if (typeof NYTD === 'undefined' || typeof NYTD.pageEventTracker === 'undefined') {
	var jsHost = TAGX.data.get('page.url.protocol') === 'https' ? TAGX.data.get('static.env.domain_js_https') : TAGX.data.get('static.env.domain_js');
	TAGX.Utils.includeFile('//' + jsHost + '/bi/js/analytics/EventTracker.js', false, 'body', true, 'loaded:EventTracker.js');
}
};try { (_func.bind(this))(); } catch (err) { console.error("Event Tracker Lib Include", err); }});tagger.tag().run(function () {var _func = function() {var tracker, createOptions, tracker2;
var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
var debugThruET = (TAGX.config ? TAGX.config.GoogleAnalyticsDebug : false);
function trigger (name) {
    if (!debugThruET) {
        return;
    }
    TAGX.$(TAGX).trigger('ga-steps', { name: name });
}
if (window.top == window.self || TAGX.data.get('sourceApp') == "nyt-fb-native-external-iframe") {
    trigger('ga_loaded');
    if (ga_cfg && ga_cfg.id) {
        tracker = ga_cfg.tracker || 'ga';
        tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
        createOptions = ga_cfg.createOptions || '.nytimes.com';
        (function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js',tracker);
    
        window[tracker]('create', ga_cfg.id, createOptions);
        if (ga_cfg.fieldObject) {
          window[tracker](tracker2 + 'set', ga_cfg.fieldObject);
        }
        window[tracker](tracker2 + 'send', 'pageview');
        trigger('ga_fired');
    }
    trigger('ga_done');
}
};try { (_func.bind(this))(); } catch (err) { console.error("GA pageview", err); }});tagger.tag().run(function () {var _func = function() {/**** start of chartbeat tag ****/
function getChartbeatDomain() {
    var domain = '', 
        edition = unescape(document.cookie).match('NYT-Edition=([^;]+)');

    if (edition && edition[1] && edition[1].indexOf("edition|GLOBAL") !== -1) {
        domain = "international.nytimes.com";
    } else {
        domain = TAGX.data.get('static.env.domain_www')
    }
    return domain;
}

function getChartbeatPath() {
    var path = '';

    // regex to strip out anything preceeding nytimes.com/*
    regex = /(^.*)(nytimes.com.*)/;

    // replace function to generate value for chartbeat config path variable
    // if a match isn't found, the standard canonical URL will be returned
    path = TAGX.Utils.getCanonicalUrl().replace(regex, "$2")

    // i.e. the `path` variable should be the same for both of these pages:
    // http://mobile.nytimes.com/blogs/cityroom/2015/07/21/the-wonder-of-a-book/
    // http://cityroom.blogs.nytimes.com/2015/07/21/the-wonder-of-a-book/
    // `path: "nytimes.com/2015/07/21/the-wonder-of-a-book/"`
    return path;
}

window._sf_async_config = {
    uid: 16698,
    domain: getChartbeatDomain(),
    pingServer: "pnytimes.chartbeat.net",
    useCanonical: false,
    path: getChartbeatPath(),
    title: TAGX.data.get('asset.headline')
};

try {
  window._sf_async_config.sections = [TAGX.data.get('wt.contentgroup'), TAGX.data.get('wt.subcontentgroup'), (TAGX.data.get('ga.derivedDesk') || '')].join(",");
} catch(e){}

try {
  window._sf_async_config.authors = (TAGX.data.get('asset.authors')) + "".replace('By ', '').toLowerCase().replace(/\b[a-z]/g, function(){return arguments[0].toUpperCase();});
} catch(e){}

window._sf_endpt = (new Date()).getTime();
var scriptUrl = ((("https:" == document.location.protocol) ? "https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/" : "http://static.chartbeat.com/") + "js/chartbeat.js");
TAGX.Utils.includeFile(scriptUrl, false, 'body', true, null); 
/**** end of chartbeat tag ****/
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - ChartBeat Tag", err); }});tagger.tag().run(function () {var _func = function() {var https = (document.location.protocol === "https:");
var ccLibScript = (https ? "//sb" : "//b") + ".scorecardresearch.com/c2/3005403/cs.js";
TAGX.Utils.includeFile(ccLibScript, false, "body", true, "loaded:comscore.js"); 

var jsHost = (https ? TAGX.data.get('static.env.domain_js_https') : TAGX.data.get('static.env.domain_js'));
TAGX.Utils.includeFile("//" + jsHost + "/bi/js/analytics/comscore.js", false, "body", true, "loaded:comscoreVendorCode.js")
};try { (_func.bind(this))(); } catch (err) { console.error("Comscore Lib Include", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:ga.js"], callback); }).run(function () {var _func = function() {var googleAnalyticsTrackerID = {"Travel":"UA-4406282-79", "Business":"UA-4406282-80", "Health":"UA-4406282-81"};

if (googleAnalyticsTrackerID[TAGX.data.get('wt.contentgroup')] !== undefined){
	try {
		var pageTracker = _gat._getTracker(googleAnalyticsTrackerID[TAGX.data.get('wt.contentgroup')]); 
		pageTracker._trackPageview();
	} catch(err) {}
}
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - Google Analytics Page Tracker", err); }});tagger.tag().run(function () {var _func = function() {// Nielsen tagging
(function () {
  var d = new Image(1, 1);
  d.onerror = d.onload = function () {
    d.onerror = d.onload = null;
  };
  d.src = ["//secure-us.imrworldwide.com/cgi-bin/m?ci=us-nytimes&cg=0&cc=1&si=",
           escape(window.location.href), "&rp=", escape(document.referrer),
           "&ts=compact&rnd=", (new Date()).getTime()].join('');
})();
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - Nielsen Tag", err); }});tagger.tag().run(function () {var _func = function() {var jsHost = TAGX.data.get('page.url.protocol') === 'https' ? TAGX.data.get('static.env.domain_js_https') : TAGX.data.get('static.env.domain_js');

TAGX.Utils.includeFile("//" + jsHost + "/bi/js/analytics/wtHelperFunctions.js", false, "head", true, "loaded:WTHelperFunctions.js");
TAGX.Utils.includeFile("//" + jsHost + "/bi/js/analytics/webtrends.js", false, 'body', true, "loaded:webtrends.js");
};try { (_func.bind(this))(); } catch (err) { console.error("Webtrends Lib Include", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }).run(function () {var _func = function() {var
  imageViewerTrack;

imageViewerTrack = function (eventData) {
  var
    data = TAGX.Utils.jsonObjToDCSparams(eventData);
  data.push('WT.z_dcsm', '1');
  data.push('WT.z_gpt', 'Multimedia');
  data.push('WT.z_gpst', eventData.module);
  data.push('WT.z_sssn', eventData.mdata.currentSlide);
  data.push('WT.z_ssts', eventData.mdata.totalSlides);
  if (eventData.mdata.currentSlide === eventData.mdata.totalSlides) {
    data.push('WT.z_sse', 'finish');
  }
  dcsMultiTrack.apply(this, data);
};

TAGX.$(TAGX).on('media-viewer-opened', imageViewerTrack);
TAGX.$(TAGX).on('media-viewer-next-image', imageViewerTrack);
TAGX.$(TAGX).on('media-viewer-prev-image', imageViewerTrack);
};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - Image Viewer Interaction", err); }});tagger.tag().run(function () {var _func = function() {TAGX.ScrollManager.trackImpression([".email-signup-frame"],	function () { 
	TAGX.EventProxy.trigger("newsletterPromo-impression", 
		{
			module: "newsletter-signup-module", 
			eventName: "Impression", 
			pgType: TAGX.Utils.getMetaTag("PT"),
			contentCollection: TAGX.Utils.getMetaTag("CG"),
			priority: true
		}, 
		"impression");
});
};try { (_func.bind(this))(); } catch (err) { console.error("newsletter signup module impressions", err); }});tagger.tag().condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["loaded:webtrends.js"], callback); }).run(function () {var _func = function() {var
  slideshowTrack;
  
slideshowTrack = function (eventData) {
  "use strict";
  var
    data = TAGX.Utils.jsonObjToDCSparams(eventData);
  data.push('WT.z_dcsm', '1');
  data.push('WT.z_gpt', 'Multimedia');
  data.push('WT.z_gpst', eventData.module);
  data.push('WT.z_sssn', eventData.mdata.currentSlide);
  data.push('WT.z_ssts', eventData.mdata.totalSlides);
  if (eventData.mdata.currentSlide === eventData.mdata.totalSlides) {
    data.push('WT.z_sse', 'finish');
  }
  dcsMultiTrack.apply(this, data);
};

TAGX.$(TAGX).on('embedded-slideshow-next-image', slideshowTrack);
TAGX.$(TAGX).on('embedded-slideshow-prev-image', slideshowTrack);
TAGX.$(TAGX).on('embedded-slideshow-dot', slideshowTrack);

};try { (_func.bind(this))(); } catch (err) { console.error("NYT5 - Slideshow Interaction", err); }});tagger.tag().repeat('many').condition(function (callback) { (TAGX.Ops.or.call(this, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["gateway-load"], callback); }, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["gateway-login-click"], callback); }))(callback); }).run(function () {var _func = function() {var mapping = {
    "common": [
        'WT.cg_n', 'Digital Subscription',
        'WT.z_gpt', 'E-Commerce',
        'WT.z_gpst', 'Purchase',
        'WT.si_n', 'Digital Subscription',
        'WT.si_x', '1',
        'WT.cg_s', (/edition|GLOBAL/.test(document.cookie) ? 'IHT' : 'NYT'),
        'WT.rv', (TAGX.data.get('user.loggedIn') === true ? "1" : "0"),
        'WT.z_ica', "0",
        'WT.z_imv', "0",
        'WT.es', document.location.host + document.location.pathname
    ],
    "impression" : { dcsuri: '/mem/purchase/gateway', ti: 'Gateway', dcsid: 'dcsv96qcv000008alp4trgo0q_7h8h' },
    "login-click" : { dcsuri: '/mem/purchase/gateway/login', ti: 'Gateway - Login', z_dcsm: '1', dcsid: 'dcsv96qcv000008alp4trgo0q_7h8h' }
};
var eventData = this.eventsData["gateway-load"] || this.eventsData["gateway-login-click"];
var evtData, dcssip, dcsuri, dcsid, addition;
var dcs = window.webtrendsAsyncInit;
var map = mapping[eventData.eventName.toLowerCase()];

if (/*!dcs || */!eventData || !map) { return; } // need to have proper data

addition = mapping.common.concat(["DCS.dcsuri", map.dcsuri, "WT.ti", map.ti, "DCS.dcssip", "myaccount.nytimes.com"]);

if(map.z_dcsm) { 
    addition = addition.concat(["WT.z_dcsm", map.z_dcsm]); 
}

evtData = TAGX.Utils.jsonObjToDCSparams(eventData); // event data to array

if(dcs) {
    // save originals
    dcsid = dcs.dcsid;

    // overwrite values
    dcs.dcsid = map.dcsid;
} else {
    //save originals
    dcsid = dcsInit.dcsid;
    // overwrite
    dcsInit.dcsid = map.dcsid
    
}

// make the call
dcsMultiTrack.apply(this, evtData.concat(addition));

if(dcs) {
    // restore
    dcs.dcsid = dcsid;
} else {
    dcsInit.dcsid = dcsid
}
};try { (_func.bind(this))(); } catch (err) { console.error("WebTrends - Gateway Tag", err); }});tagger.tag().repeat('many').condition(function (callback) { (TAGX.Ops.or.call(this, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["growl-load"], callback); }, function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["growl-login-click"], callback); }))(callback); }).run(function () {var _func = function() {var mapping = {
   "common": [
        'WT.cg_n',            'Digital Subscription',
        'WT.z_gpt',           'E-Commerce',
        'WT.z_gpst',          'Purchase',
        'WT.si_n',            'Digital Subscription',
        'WT.si_x',            '8',
        'WT.cg_s',            (/edition\|GLOBAL/.test(document.cookie) ?  'IHT' : 'NYT'),
        'WT.rv',              (TAGX.data.get('user.loggedIn') === true ? "1" : "0"),
        'WT.es',              document.location.host + document.location.pathname,
        'WT.z_dcsm',          '1',
        'WT.z_ica',           '0',
        'WT.z_imv',           '0'
    ],
    "growl-load" : { dcsuri: '/mem/purchase/growl', ti: 'Growl', dcsid: 'dcsv96qcv000008alp4trgo0q_7h8h'},
    "impression" : { dcsuri: '/mem/purchase/growl', ti: 'Growl', dcsid: 'dcsv96qcv000008alp4trgo0q_7h8h'},
    "login-click": { dcsuri: '/mem/purchase/growl/login', ti: 'Growl - Login', dcsid: 'dcsv96qcv000008alp4trgo0q_7h8h'}
};

var excludeCampaingList = {
    "nyt2013_abTest_regiAt6_growl_container" : 1, 
    "nyt2013_abTest_regiAt6_setup" : 1, 
    "nyt2013_abTest_regiAt6_display" : 1, 
    "nyt2013_abTest_regiAt6_display_10Plus" : 1, 
    "nyt2013_abTest_regiAt6_finalize}" : 1
}

var eventData = this.eventsData["growl-load"] || this.eventsData["growl-login-click"];
var evtData, dcssip, dcsuri, dcsid, addition, specifics;
var dcs = window.webtrendsAsyncInit;
var map = mapping[eventData.eventName.toLowerCase()];
if ( !eventData || !map) { return; } // need to have proper data

// check exlude list
if (eventData.contentId && excludeCampaingList && excludeCampaingList[eventData.contentId] === 1 ) {
    // return, we dont want to count these hits
    return;    
}

addition = mapping.common.concat(["DCS.dcsuri", map.dcsuri, "WT.ti", map.ti, "DCS.dcssip", "myaccount.nytimes.com"]);

evtData = TAGX.Utils.jsonObjToDCSparams(eventData); // event data to array

if(dcs) {
    // save originals
    dcsid = dcs.dcsid;

    // overwrite values
    dcs.dcsid = map.dcsid;
} else {
    //save originals
    dcsid = dcsInit.dcsid;
    // overwrite
    dcsInit.dcsid = map.dcsid
    
}

// make the call
dcsMultiTrack.apply(this, evtData.concat(addition));

if(dcs) {
    // restore
    dcs.dcsid = dcsid;
} else {
    dcsInit.dcsid = dcsid
}

};try { (_func.bind(this))(); } catch (err) { console.error("WebTrends - Growl Tag", err); }});tagger.tag().run(function () {var _func = function() {var script = document.createElement('script');
var body = document.getElementsByTagName('body')[0];

script.type = 'text/javascript';
script.src = '//cdn.optimizely.com/js/3013110282.js';

body.appendChild(script);
};try { (_func.bind(this))(); } catch (err) { console.error("Optimizely", err); }});tagger.tag().run(function () {var _func = function() {var head = document.getElementsByTagName('head')[0],
    script;
    script = document.createElement('script'),
    script.setAttribute('type', 'text/javascript');
script.setAttribute('src', '//dc8xl0ndzn2cb.cloudfront.net/js/nytimes/v1/keywee.js');
head.appendChild(script);
};try { (_func.bind(this))(); } catch (err) { console.error("Keywee Analytics Pixel", err); }});tagger.tag().run(function () {var _func = function() {var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
var tracker = ga_cfg ? ga_cfg.tracker || 'ga' : 'ga';
var tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
var scrollingHasStarted = false;

// On page load:
window[tracker](tracker2+'send', 'event', 'scroll', 'page_load', {'nonInteraction': 1});

// Events: Scrolling starts, and scrolling reaches the end of the article:
TAGX.EventProxy.on('scroll-update-char-count', function (dataObj) {
    
    // Scrolling starts:
    if (!scrollingHasStarted) {
        window[tracker](tracker2+'send', 'event', 'scroll', 'scroll_start', {'nonInteraction': 1});
        scrollingHasStarted = true;
    }
    
    // Scrolling reaches the end of the article:
    if (dataObj['totalChars'] == dataObj['viewedChars']) {
        window[tracker](tracker2+'set', 'metric5', 1);
        window[tracker](tracker2+'send', 'event', 'scroll', 'article_complete', {'nonInteraction': 0});
        window[tracker](tracker2+'set', 'metric5', 0);
    }
});

// Event: Scrolling reaches the end of the page:
TAGX.EventProxy.on('scroll-depth', function (dataObj) {
    // Note that because of lazy-loading of images the scroll depth may be
    // greater than 100% (and 100% may not indicate the very end of the page):
    if (dataObj['depth'] >= 100) {
        window[tracker](tracker2+'send', 'event', 'scroll', 'page_complete', {'nonInteraction': 0});
    }
});
};try { (_func.bind(this))(); } catch (err) { console.error("GA Scroll Events", err); }});tagger.tag().repeat('many').condition(function (callback) { TAGX.Ops.on.call(this, "page.dom.custom", ["tagx-event-video"], callback); }).run(function () {var _func = function() {var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
var eo = this.eventsData['tagx-event-video'];
if (ga_cfg && ga_cfg.id && eo) {
    var videoCategoryName = 'Video | ' + (eo.version || '');
    var videoName = (eo.mData ? (eo.mData.videoName || '') : '');
    var cds = {
        dimension55: eo.mData.videoFranchise || "null",
        dimension56: eo.mData.videoSection || "null",
        dimension57: eo.mData.videoPrimaryPlaylistId || "null",
        dimension71: eo.mData.videoDuration || "null",
        dimension72: eo.mData.playerVersion || "null"
    };
    var extendCds = function(obj) {
        return TAGX.Utils.copyObj(obj, cds);
    };
    var mapping = {
        'ad-complete': [videoCategoryName, 'ad complete', videoName, cds],
        'ad-pause': [videoCategoryName, 'ad pause', videoName, cds],
        'ad-resume': [videoCategoryName, 'ad resume', videoName, cds],
        'ad-start': [videoCategoryName, 'ad start', videoName, cds],
        'auto-play-next': [videoCategoryName, 'autoplay next', videoName, extendCds({metric2: 1})],
        'auto-play-start': [videoCategoryName, 'autoplay start', videoName, extendCds({metric2: 1})],
        'exit-fullscreen': [videoCategoryName, 'exit fullscreen', videoName, cds],
        'go-fullscreen': [videoCategoryName, 'go fullscreen', videoName, cds],
        'hd-off': [videoCategoryName, 'hd off', videoName, cds],
        'hd-on': [videoCategoryName, 'hd on', videoName, cds],
        'pause': [videoCategoryName, 'pause', videoName, cds],
        'percent-25-viewed': [videoCategoryName, 'viewed: 25%', videoName, cds],
        'percent-50-viewed': [videoCategoryName, 'viewed: 50%', videoName, cds],
        'percent-75-viewed': [videoCategoryName, 'viewed: 75%', videoName, cds],
        'resume': [videoCategoryName, 'resume', videoName, cds],
        'share-embed': [videoCategoryName, 'share: embed', videoName, extendCds({metric4: 1})],
        'share-facebook': [videoCategoryName, 'share: facebook', videoName, extendCds({metric4: 1})],
        'share-twitter': [videoCategoryName, 'share: twitter', videoName, extendCds({metric4: 1})],
        'skip-ad': [videoCategoryName, 'ad skip', videoName, cds],
        'user-play': [videoCategoryName, 'user play', videoName, extendCds({metric1: 1})],
        'video-complete': [videoCategoryName, 'viewed:100%', videoName, extendCds({metric3: 1})],
        'video-load': [videoCategoryName, 'video load', videoName, cds],
        'media-error': [videoCategoryName, 'media-error', videoName, extendCds({'nonInteraction': true})],
        'cherry-api-request-error': [videoCategoryName, 'cherry-api-request-error', videoName, extendCds({'nonInteraction': true})],
        'fw-admanager-load-error': [videoCategoryName, 'fw-admanager-load-error', videoName, extendCds({'nonInteraction': true})],
        'qos-library-load-failure': [videoCategoryName, 'qos-library-load-failure', videoName, extendCds({'nonInteraction': true})],
        'rendition-not-found': [videoCategoryName, 'rendition-not-found', videoName, extendCds({'nonInteraction': true})]
    };
    var action = mapping[eo.eventName];
    if (!action) {
        return;
    }
    var tracker = ga_cfg.tracker || 'ga';
    var tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
    var args = action.slice(0);
    args.unshift(tracker2 + 'send', 'event');
    window[tracker].apply(window, args);
}
};try { (_func.bind(this))(); } catch (err) { console.error("GA Video Event Tag 2", err); }});tagger.tag().run(function () {var _func = function() {var times = 0;
var timer = setInterval(function() {
    if (TAGX.$('#nyt-button-sub').length > 0) {
        TAGX.$('<img>').css({'display': 'none'}).attr({
          height: 1,
          width: 1,
          border: 0,
          src: '//nytimes.activate.ensighten.com/redirect?si=1015&cw_si=1015&cw_ei=3&ei=3&pa=-6&url=https%3A//analytics.twitter.com/i/adsct%3Fp_id%3D906%26p_user_id%3D%7Bc_uuid%7D'
        }).appendTo('body');
        clearInterval(timer);
    } else if (times > 12) {
        clearInterval(timer);
    }
    times++;
}, 500);
};try { (_func.bind(this))(); } catch (err) { console.error("Subscribe Button Twitter Pixel", err); }});tagger.tag().run(function () {var _func = function() {var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
var tracker = ga_cfg ? ga_cfg.tracker || 'ga' : 'ga';
var tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
var $ = TAGX.$;

$(document.body).on("click", "a", function (e) {
    if (!/nytimes|nytco/.test(e.currentTarget.hostname) && TAGX.$(e.currentTarget).parents('.sharetools-story ul').length == 0 && TAGX.$(e.currentTarget).parents('.sharetools-menu').length == 0 && TAGX.$(e.currentTarget).parents('.sharetools').length == 0 && TAGX.$(e.currentTarget).parents('.share-list').length == 0) {
        window[tracker](tracker2+'send', 'event', 'out_bound_clicks', 'out_bound_click', $(e.currentTarget).text().trim() + '|' + e.currentTarget.href);
    }
});
};try { (_func.bind(this))(); } catch (err) { console.error("GA Outbound Clicks", err); }});tagger.tag().run(function () {var _func = function() {/* Start NYT-V5: Brand Signals */

var a = document;
var b = a.createElement("script");
a = a.getElementsByTagName("script")[0];
b.type="text/javascript";
b.async= !0;

// get data from TagX
var userData = TAGX.data.get('TAGX.L');
var visits = userData['sessionIndex'];
var avgSessionTime = userData['avgSessionTime'];
var firstReferrer = userData['firstReferrer'];
var pageIndex = userData['pageIndex'];

// make it easier to understand what is being sent
var params = [
    'firstimp_bsg=' + pageIndex,
    'loyalty_bsg=' + visits,
    'avgsestime_bsg=' + avgSessionTime,
    'referral_bsg=' + firstReferrer
].join('&');

b.src = "http://js.moatads.com/googleessencenyt485873431/moatcontent.js?" + params;
a.parentNode.insertBefore(b,a);

/* End NYT-V5: Brand Signals */
};try { (_func.bind(this))(); } catch (err) { console.error("Brand Signals", err); }});tagger.tag().run(function () {var _func = function() {'use strict';

var utils = TAGX.Utils;

// This function comes from "GA newsletter event tracking"
var trackEvent = (function () {
    var tracker, tracker2;
    var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
    if (ga_cfg && ga_cfg.id) {
        tracker = ga_cfg.tracker || 'ga';
        tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
        return function (category, action, label, non_interaction, cus_met) {
            var cmObj;
            var args = [tracker2 + 'send', 'event', category, action, label];
            if (non_interaction) {
                cmObj = TAGX.Utils.copyObj(cmObj || {}, {nonInteraction: 1});
            }
            if (cus_met) {
                cmObj = cmObj || {};
                cmObj['metric' + cus_met] = 1;
            }
            if (cmObj) {
                args.push(cmObj);
            }
            window[tracker].apply(window, args);
        };
    }
    return function () {
        console.debug('event ignored because there\'s no config/id');
    };
})();


function shareName (name) {
   switch (name) {
      case "Share-facebook":
         return "facebook";
      case "Share-email":
         return "email";
      case "Share-twitter":
         return "twitter";
      case "Share-pinterest":
         return "pinterest";
      case "Share-linkedin":
         return "linkedin";
      case "Share-google":
         return "google";
      case "Share-reddit":
         return "reddit";
      default:
         return name;
   }
}

function actionName (action) {
   if (action.match(/^Share-/)) {
      return "share: " + shareName(action);
   } else {
      switch (action) {
         case "ArticleTool-save":
            return "save";
         default: return action;
      }
   }
}

TAGX.EventProxy.on('share-tools-click', function (dataObj) {
   var articleTitle = utils.getMetaTag('hdl');
   switch (dataObj['region']) {
      case "Masthead":
         if (dataObj['eventName'] == "Share-ShowAll") {
            trackEvent('Share tools | Masthead', 'tools menu click', articleTitle, true);
         } else {
            trackEvent('Share tools | Masthead', 'Share: ' + shareName(dataObj['eventName']), articleTitle, true);
         }
         break;
      case "ToolsMenu":
         trackEvent('Share tools | Masthead', 'Tools menu: ' + actionName(dataObj['eventName']), articleTitle, true);
         break;
      case "Body":
         if (dataObj['eventName'] == "Share-ShowAll") {
            trackEvent('Share tools | Body', 'tools menu click', articleTitle, true);
         } else {
            trackEvent('Share tools | Body', 'Share: ' + shareName(dataObj['eventName']), articleTitle, true, 'share ' + shareName(dataObj['eventName']));
         }
         break;
      case "ToolsMenu":
         break;
   }
});

};try { (_func.bind(this))(); } catch (err) { console.error("GA Share Tools Tracking", err); }});tagger.tag().run(function () {var _func = function() {'use strict';

var utils = TAGX.Utils;
var canonical = TAGX.data.get('asset.url');

// This function comes from "GA newsletter event tracking"
var trackEvent = (function () {
    var tracker, tracker2;
    var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
    if (ga_cfg && ga_cfg.id) {
        tracker = ga_cfg.tracker || 'ga';
        tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
        return function (category, action, label, non_interaction, cus_met) {
            var cmObj;
            var args = [tracker2 + 'send', 'event', category, action, label];
            if (non_interaction) {
                cmObj = TAGX.Utils.copyObj(cmObj || {}, {nonInteraction: 1});
            }
            if (cus_met) {
                cmObj = cmObj || {};
                cmObj['metric' + cus_met] = 1;
            }
            if (cmObj) {
                args.push(cmObj);
            }
            window[tracker].apply(window, args);
        };
    }
    return function () {
        console.debug('event ignored because there\'s no config/id');
    };
})();

var canonicalURL = document.querySelector('link[rel="canonical"]').href;

TAGX.EventProxy.on('comments-open-panel', function (dataObj) {
    switch(dataObj['region']) {
        // Masthead speech bubble:
        case 'TopBar':
            trackEvent('Comments | Article Page', 'Open | Story Header', canonicalURL, true);
            break;
        // Masthead speech bubble:
        case 'Header':
            trackEvent('Comments | Article Page', 'Open | Story Header', canonicalURL, true);
            break;
        // "See all comments":
        case 'Marginalia':
            trackEvent('Comments | Article Page', 'Open | See All Comments Link', canonicalURL, true);
            break;
        // Large speech bubble:
        case 'Body':
            trackEvent('Comments | Article Page', 'Open | Article Body', canonicalURL, true);
            break;
    }
});

TAGX.EventProxy.on('recommend-comment', function(dataObj) {
    if (dataObj['action'] === "Click" && dataObj['region'] === "Comments") {
        trackEvent('Comments | Article Page', 'Recommend | Authenticated', canonicalURL, true);
    }
});

TAGX.EventProxy.on('load-more-comments', function(dataObj) {
    if (dataObj['action'] === "Click" && dataObj['region'] === "Comments") {
        trackEvent('Comments | Article Page', 'Read More', canonicalURL, true);
    }
});

TAGX.EventProxy.on('post-comment-new', function(dataObj) {
    trackEvent('Comments | Article Page', 'Comment Submit', canonicalURL, true)
});
TAGX.EventProxy.on('comments-submit-new', function(dataObj) {
    trackEvent('Comments | Article Page', 'Comment Submit', canonicalURL, true)
});

TAGX.EventProxy.on('post-comment-reply', function(dataObj) {
    trackEvent('Comments | Article Page', 'Reply Submit  | Email Notification', canonicalURL, true)
});
TAGX.EventProxy.on('comments-submit-reply', function(dataObj) {
    trackEvent('Comments | Article Page', 'Reply Submit  | Email Notification', canonicalURL, true)
});

TAGX.EventProxy.on('comment-flag-click', function(dataObj) {
    trackEvent('Comments | Article Page', 'Flag | Authenticated', canonicalURL, true)
});
TAGX.EventProxy.on('comments-user-flagged', function(dataObj) {
    trackEvent('Comments | Article Page', 'Flag | Authenticated', canonicalURL, true)
});

TAGX.EventProxy.on('click-view-all', function(dataObj) {
    trackEvent('Comments | Article Page', 'Open | View all Comments Link', canonicalURL, true)
});


TAGX.EventProxy.on('comments-share', function(dataObj) {
    if (dataObj['module'] === "ShareTools" && dataObj['action'] === 'Click' && dataObj['region'] === "Comments") {
        var socialNetwork;
        switch (dataObj['eventName']) {
            case 'Share-twitter':
                socialNetwork = 'Twitter';
                break;
            case 'Share-facebook':
                socialNetwork = 'Facebook';
                break;
            default:
                socialNetwork = dataObj['eventName'];
        };
        trackEvent('Share Tools | Comment Module', 'Share Comment | ' + socialNetwork, canonicalURL, true)
    };
});
};try { (_func.bind(this))(); } catch (err) { console.error("GA Comment Tracking", err); }});tagger.tag().run(function () {var _func = function() {'use strict';

var utils = TAGX.Utils;

// This function comes from "GA newsletter event tracking"
var trackEvent = (function () {
    var tracker, tracker2;
    var ga_cfg = (TAGX.config ? TAGX.config.GoogleAnalytics : null);
    if (ga_cfg && ga_cfg.id) {
        tracker = ga_cfg.tracker || 'ga';
        tracker2 = (ga_cfg.createOptions && ga_cfg.createOptions.name ? ga_cfg.createOptions.name + '.' : '');
        return function (category, action, label, non_interaction, cus_met) {
            var cmObj;
            var args = [tracker2 + 'send', 'event', category, action, label];
            if (non_interaction) {
                cmObj = TAGX.Utils.copyObj(cmObj || {}, {nonInteraction: 1});
            }
            if (cus_met) {
                cmObj = cmObj || {};
                cmObj['metric' + cus_met] = 1;
            }
            if (cmObj) {
                args.push(cmObj);
            }
            window[tracker].apply(window, args);
        };
    }
    return function () {
        console.debug('event ignored because there\'s no config/id');
    };
})();

var canonicalURL = TAGX.Utils.getCanonicalUrl();
var target = TAGX.Utils.QsTomap()["target"];

if (target === "comments") {
    var pgType = TAGX.Utils.QsTomap()["pgtype"];
    var ref = TAGX.Utils.QsTomap()["ref"] || "No region";
    var region = TAGX.Utils.QsTomap()["region"] || "No region";
    
    if (pgType === "Homepage") {
        trackEvent("Comments | Homepage", "Open | "+region, canonicalURL, false);
    } else {
        trackEvent("Comments | Section Front", "Open | "+ref, canonicalURL, false);
    }
}
};try { (_func.bind(this))(); } catch (err) { console.error("GA Comment Tracking (Page Load)", err); }});
TAGX.taggerReady=true;
})();
