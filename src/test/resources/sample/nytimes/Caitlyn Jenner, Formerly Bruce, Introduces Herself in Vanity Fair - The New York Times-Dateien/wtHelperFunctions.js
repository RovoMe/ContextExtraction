
var wtHelper = (function(TagxUtils) {

	var getMetaTag = TagxUtils.getMetaTag;
	var addMetaTag = TagxUtils.addMetaTag;
	var _setRegistrationSection = function(section, subsection){
		switch(section) {
			case "Member Center": break; //do nothing
			case "Digital Subscription": break; //do nothing
			default:
			addMetaTag("WT.z_rcgn", section);
			addMetaTag("WT.z_rcgs", subsection);
		} 
	};

	var isSearchEngine = function(refDom) {
		var refType = "";
		if((/google\./.test(refDom) && getReferrerQuery() !== "") || (/search\./.test(refDom)) || (/ask.com/.test(refDom)) || (/altavista.com/.test(refDom))) {
			refType = "1";
		}
		return refType;
	};

	var getPubTypeFromDate = function(pdate) {
		var ret = "web";
		if (pdate !== undefined && pdate.length == 8) {
			var currentDate = new Date();
			var articleDate = new Date();
			articleDate.setDate(pdate.substring(6));
			articleDate.setMonth(pdate.substring(4,6)-1);
			articleDate.setFullYear(pdate.substring(0,4));

			if(articleDate < currentDate) {
				ret = "Archive";
			} 
		} 
		return ret;
	};

	var _setArticleInfo = function(articleID, wtObj, assetObj) {
		var asset = assetObj || {};
		if (articleID !== "") {
			var undef,
				pubDate, 
				rawDate = asset.publishedDate ? asset.publishedDate : null;

			if(rawDate) {
				rawDate = new Date(rawDate)
				pubDate = rawDate.toLocaleDateString().replace(/\//g, '');	
			} else {
				pubDate = getMetaTag("pdate");
			}	
			
			var pubType = getPubTypeFromDate(pubDate); 
			
			wtObj.z_gpt = "Article";
			wtObj.z_gpst = asset.typeOfMaterial ? asset.typeOfMaterial : getMetaTag("tom");
			wtObj.z_hdl = asset.headline? asset.headline : getMetaTag("hdl"); 
			if (pubType == "Archive") {
				wtObj.z_aid = 'nyta-' + articleID;
			} else {
				wtObj.z_aid = articleID;
			}
			wtObj.z_pud = pubDate;
			wtObj.z_put = pubType;

			addMetaTag("WT.z.gsg", pubType);

			if (pubDate && pubDate.length==8) {
				var tYear = pubDate.substring(0,4);
				if (tYear < 2004) {
					wtObj.ti = "Archive Article from " + tYear;
					addMetaTag("DCS.dcsuri", "http://www.nytimes.com/archive/"+tYear+".html");
				}     
				if (pubType == "Archive") {
					if (tYear >=1987) {
						wtObj.z_gat = "1987-Present";
					} else if (tYear >=1981) {
						wtObj.z_gat = "1981-1986";
					} else if (tYear >=1923) {
						wtObj.z_gat = "1923-1980";
					} else {
						wtObj.z_gat = "1851-1922";
					}
				}	 
			}
			wtObj.z_pua = "free";
			var clmst = asset.authors ? asset.authors.join(";") : getParsedAuthors();
			wtObj.z_clmst = clmst; // replace with asset.authors
			setXTS(clmst);
			
			var pageWanted = getQueryParameter("pagewanted");
			if (pageWanted === "") {
				wtObj.z_puv = "Normal"; 
			} else {
				wtObj.z_puv = pageWanted;
			}
		}
	};

	var queryParameterExists = function(name) {
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name;
	  var regex = new RegExp( regexS );
	  return regex.test( window.location.href );

	};

	var getQueryParameter = function(name) {
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( window.location.href );
		if( results == null ) {
			return "";
		} else {
			return results[1];
		}
	};

	var getParsedAuthors = function() {
		var bylVal = getMetaTag("byl");
		bylVal = bylVal.replace("&#8217;","'"); 
	    if (bylVal.indexOf("By ") != -1) {
	      bylVal = bylVal.substring(3);
	      bylValInd = bylVal.indexOf(" and ");
	      if (bylValInd != -1) {
	        bylVal = bylVal.substring(0, bylValInd) + ";" + bylVal.substring(bylValInd+5);
	      }
	    }
	    return bylVal;
	};

	var setXTS = function(clmst) {
		if (/DAVID BROOKS/.test(clmst)||/MAUREEN DOWD/.test(clmst)||/ROGER COHEN/.test(clmst)||/THOMAS L. FRIEDMAN/.test(clmst)||/BOB HERBERT/.test(clmst)||/NICHOLAS D. KRISTOF/.test(clmst)||/PAUL KRUGMAN/.test(clmst)||/FRANK RICH/.test(clmst)||/DAVE ANDERSON/.test(clmst)||/PETER APPLEBOME/.test(clmst)||/HARVEY ARATON/.test(clmst)||/DAN BARRY/.test(clmst)||/JIM DWYER/.test(clmst)||/CLYDE HABERMAN/.test(clmst)||/ADAM LIPTAK/.test(clmst)||/GRETCHEN MORGENSON/.test(clmst)||/JOE NOCERA/.test(clmst)||/JOSEPH NOCERA/.test(clmst)||/FLOYD NORRIS/.test(clmst)||/WILLIAM C. RHODEN/.test(clmst)||/SELENA ROBERTS/.test(clmst)||/GEORGE VECSEY/.test(clmst)||/JOHN VINOCUR/.test(clmst)) {
			addMetaTag("WT.z_gts", "XTS");
		}
	};

	var _setContentInfo = function(wt_contentGroup, WTObj) {

		// read page tags for content groups
		if (wt_contentGroup == "Health") {
			WTObj.z_hgst = getMetaTag("HGST");   // health guide subject type
			WTObj.z_hgsn = getMetaTag("HGSN");   // health guide subject name
		} else if (wt_contentGroup == "Times Topics") {
			WTObj.z_gpt = "Topic";
		} else if (wt_contentGroup == "Books") {
			WTObj.z_bper = getMetaTag("per");
			WTObj.z_ebk = getMetaTag("ttl");

		} else if (wt_contentGroup == "Real Estate" || wt_contentGroup == "Great Homes") {
			WTObj.z_resz = getMetaTag("RESZ");   // real estate search zip codes
			WTObj.z_res = getMetaTag("RES");    // real estate state
			WTObj.z_reco = getMetaTag("RECO");   // real estate counties
			WTObj.z_rer = getMetaTag("RER");    // real estate region 

		} else if (wt_contentGroup == "Theater") {
			WTObj.z_eplay = getMetaTag("ttl");

		} else if (wt_contentGroup == "Travel") {
			//includeFile(js_host+"content/travel_v1.1.js");
			
		} else if (wt_contentGroup == "Movies") {
			//includeFile(js_host+"content/movies_v1.1.js");

		} else if (wt_contentGroup == "Email This") {
			//includeFile(js_host+"content/emailthis_v1.1.js");

		} 
	};

	var _getPubDateRange = function(pdate, WTObj) {
		
		var relativePubDate = "No Pub Date";
		var currentDate = new Date();
		var currentDateMs = currentDate.getTime();

		var pubDate = new Date();
		if (pdate.length==8) {
			var tYear = pdate.substring(0,4);
			var tMonth = pdate.substring(4,6);
			var tDay = pdate.substring(6,8);
			pubDate.setFullYear(tYear,tMonth-1,tDay);
		}
		var pubDateMs = pubDate.getTime();

		var publicDomainStartDate = new Date();
		publicDomainStartDate.setYear(1851);
		publicDomainStartDate.setMonth(0);
		publicDomainStartDate.setDate(1);
		var publicDomainStartDateMs = publicDomainStartDate.getTime();

		var payArchiveStartDate = new Date();
		payArchiveStartDate.setYear(1923);
		payArchiveStartDate.setMonth(0);
		payArchiveStartDate.setDate(1);
		var payArchiveStartDateMs = payArchiveStartDate.getTime();

		var payArchiveEndDate = new Date();
		payArchiveEndDate.setYear(1986);
		payArchiveEndDate.setMonth(11);
		payArchiveEndDate.setDate(31);
		var payArchiveEndDateMs = payArchiveEndDate.getTime();

		var dateDiffMs = currentDateMs - pubDateMs;

		if(dateDiffMs < 0) {
			relativePubDate = "Tomorrow";
		} else if(0 <= dateDiffMs && dateDiffMs < 86400000) {
			relativePubDate = "Same Day";
		} else if(86400000 <= dateDiffMs && dateDiffMs < 172800000) {
			relativePubDate = "1 Day";
		} else if(172800000 <= dateDiffMs && dateDiffMs < 259200000) {
			relativePubDate = "2 Day";
		} else if(259200000 <= dateDiffMs && dateDiffMs < 345600000) {
			relativePubDate = "3 Day";
		} else if(345600000 <= dateDiffMs && dateDiffMs < 432000000) {
			relativePubDate = "4 Day";
		} else if(432000000 <= dateDiffMs && dateDiffMs < 518400000) {
			relativePubDate = "5 Day";
		} else if(518400000 <= dateDiffMs && dateDiffMs < 604800000) {
			relativePubDate = "6 Day";
		} else if(604800000 <= dateDiffMs && dateDiffMs < 691200000) {
			relativePubDate = "7 Day";
		} else if(691200000 <= dateDiffMs && dateDiffMs < 2678400000) {
			relativePubDate = "Month";
		} else if(2678400000 <= dateDiffMs && dateDiffMs < 7776000000) {
			relativePubDate = "90 Day";
		} else if(7776000000 <= dateDiffMs && dateDiffMs < 31536000000) {
			relativePubDate = "1 Year";
		} else if(31536000000 <= dateDiffMs && dateDiffMs < 157680000000) {
			relativePubDate = "5 Years";
		} else if(157680000000 <= dateDiffMs && dateDiffMs < 315360000000) {
			relativePubDate = "10 Years";
		} else if(315360000000 <= dateDiffMs && pubDateMs > payArchiveEndDateMs) {
			relativePubDate = "Post 86";
		} else if(315360000000 <= dateDiffMs && (payArchiveStartDateMs <= pubDateMs && pubDateMs <= payArchiveEndDateMs)) {
			relativePubDate = "Pay Archive";
		} else if(315360000000 <= dateDiffMs && (publicDomainStartDateMs <= pubDateMs && pubDateMs <= payArchiveStartDateMs)) {
			relativePubDate = "Public Domain";
		}

		return relativePubDate
		
	};

	(function() {
		//check for frameset referrer cookie
		var origRefUrl = TagxUtils.getCookie("FramesetReferrer");
		var refUrl = origRefUrl || document.referrer;

		if (refUrl !== undefined && refUrl !== "" ) {
			var refDom = refUrl.match( /:\/\/(www\.)?([^\/:]+)/ ); 
			refDom = refDom[2]?refDom[2]:''; 
			addMetaTag("WT.z_ref", refDom);
			addMetaTag("WT.z_sorg", isSearchEngine(refDom)); 
		}

		// Set campaign information
		var metaEmailCampId = getQueryParameter("emc");
		addMetaTag("WT.mc_id", metaEmailCampId);

		var externalCampId = getQueryParameter("excamp");
		if (externalCampId != "") {
			addMetaTag("WT.mc_id", externalCampId);
			addMetaTag("WT.srch", "1");
		}

		if (getMetaTag("WT.mc_id") != "") {
			addMetaTag("WT.mc_ev", "click"); 
		}

		// Set no_interstitial param
		if (queryParameterExists("no_interstitial")) {
			addMetaTag("WT.z_dirlnk", "1");
		}

	})();

	return {
		setArticleInfo : function(a, b) {
			_setArticleInfo(a, b);
		},
		setRegistrationSection : function(a, b) {
			_setRegistrationSection(a, b);
		},
		setContentInfo : function(a, b) {
			_setContentInfo(a, b);
		},
		getPubDateRange : function(a) {
			return _getPubDateRange(a);
		}
	}	
});


