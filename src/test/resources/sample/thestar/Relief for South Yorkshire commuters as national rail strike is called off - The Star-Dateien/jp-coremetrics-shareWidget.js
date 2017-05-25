$(document).on("jpdna.gplus.share", function () {
	if (articleID !== undefined) {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Google Plus", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Article-_-" + articleID);
	}
	else {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Google Plus", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Event-_-");
	}
});

$(document).on("jpdna.facebook.share", function () {
	if (articleID !== undefined) {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Facebook", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Article-_-" + articleID);
	}
	else {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Facebook", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Event-_-");
	}
});

$(document).on("jpdna.twitter.share", function () {
	if (articleID !== undefined) {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Twitter", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Article-_-" + articleID);
	}
	else {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Twitter", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Event-_-");
	}
});

$(document).on("jpdna.mail.share", function () {
	if (articleID !== undefined) {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Email", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Article-_-" + articleID);
	}
	else {
		cmCreateConversionEventTag(wtSiteCode.toUpperCase() + " | " + "Email", 2, wtSiteCode.toUpperCase() + " | " + "Social Share", 0, "-_-Event-_-");
	}
});
