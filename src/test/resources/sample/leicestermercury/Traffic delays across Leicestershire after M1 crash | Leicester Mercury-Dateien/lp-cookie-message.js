/**
 * jQuery Migration
 * Cookies Notification
 * 
 */ 

jQuery(document).ready(function() {
	
		var seenCookieMessage = jQuery.cookie('cookieMessage');
		var messageText="Find out more here";
		var messageBodyText="This site uses cookies. By continuing to browse the site you are agreeing to our use of cookies. ";
		var termsLink="/privacypolicy.html";
		var closeMessage = "&#215;";
		var closeTitle = "Close";		
		
		if(!seenCookieMessage){

			var newDiv = '<div class="alert alert-info alert-dismissable" id="cookieTime"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>'+messageBodyText+'&nbsp;</strong><a class="alert-link" href="'+termsLink+'" title="'+messageText+'">'+messageText+'</a></div>';			
			jQuery('body').prepend(newDiv);
			LP.Ads.DC.reposition();
						
			
			$('#cookieTime').bind('closed.bs.alert', function () {
				setTimeout(function(){
					LP.Ads.DC.reposition();
				},10);
			});
							
			// SET EXPIRATION DATE
			var expireDate = new Date();
			expireDate.setTime(expireDate.getTime() + (2 * 365 * 24 * 60 * 60 * 1000));
			// SET COOKIE
			jQuery.cookie("cookieMessage", "true", {	expires : expireDate,	path    : '/'	});	
		}
			
 });

