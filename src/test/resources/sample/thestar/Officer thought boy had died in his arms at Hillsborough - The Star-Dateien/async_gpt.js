(function($){
	function insert(adtag, html) {
		$adTag = $(adtag);		
		var tryAfter = $adTag.attr("data-try-after");
		var elseAfter = $adTag.attr("data-finally-after");	
		var tryBefore = $adTag.attr("data-try-before");
		var elseBefore = $adTag.attr("data-finally-before");
		var before = $adTag.attr("data-insert-before");
		var append = $adTag.attr("data-append-to");
		var tryAppend = $adTag.attr("data-try-append");
		var prepend = $adTag.attr("data-prepend-to");
		var replace = $adTag.attr("data-replace");	
		if($adTag.prop('tagName') == "SCRIPT") {
			var $adtag = $();
			var $target;			
			if(tryAfter) {
				$target = $(tryAfter);
				$target.after(html);
				$target.each(function(i, el){
					var $el = $(el);
					var $next = $el.next();
					if($next.hasClass("adTag")) {
						$adtag = $adtag.add($next)
					} else {
						$adtag = $adtag.add($next.find(".adTag"));
					}
				});
				if($adtag.length == 0 && elseAfter) {
					$target = $(elseAfter);
					$target.after(html);
					$target.each(function(i, el){
						var $el = $(el);
						var $next = $el.next();
						if($next.hasClass("adTag")) {
							$adtag = $adtag.add($next)
						} else {
							$adtag = $adtag.add($next.find(".adTag"));
						}
					});
				} else if ($adtag.length == 0 && elseBefore) {
					$target = $(elseBefore);
					$target.before(html);
					$target.each(function(i, el){
						var $el = $(el);
						var $prev = $el.prev();
						if($prev.hasClass("adTag")) {
							$adtag = $adtag.add($prev)
						} else {
							$adtag = $adtag.add($prev.find(".adTag"));
						}
					});
				}
			} else if (tryBefore) {
				$target = $(tryBefore);
				$target.before(html);
				$target.each(function(i, el){
					var $el = $(el);
					var $prev = $el.prev();
					if($prev.hasClass("adTag")) {
						$adtag = $adtag.add($prev)
					} else {
						$adtag = $adtag.add($prev.find(".adTag"));
					}
				});
				if($adtag.length == 0 && elseAfter) {
					$target = $(elseAfter);
					$target.after(html);
					$target.each(function(i, el){
						var $el = $(el);
						var $next = $el.next();
						if($next.hasClass("adTag")) {
							$adtag = $adtag.add($next)
						} else {
							$adtag = $adtag.add($next.find(".adTag"));
						}
					});
				} else if ($adtag.length == 0 && elseBefore) {
					$target = $(elseBefore);
					$target.before(html);
					$target.each(function(i, el){
						var $el = $(el);
						var $prev = $el.prev();
						if($prev.hasClass("adTag")) {
							$adtag = $adtag.add($prev)
						} else {
							$adtag = $adtag.add($prev.find(".adTag"));
						}
					});
				}
			} else if (before) {
				$target = $(before);
				$target.before(html);
				$adtag = $target.prev(".adTag");
			} else if(tryAppend) {
				$target = $(tryAppend);
				$target.append(html);
				$adtag = $target.find(".adTag");
			} else if (replace) {
				$target = $(replace);
				$parent = $target.parent();
				$target.replaceWith(html);
				$adtag = $parent.find(".adTag");
			}
			return $adtag;
		}
		if(insertAfter || insertBefore || appendTo || prependTo || replace) {
			if (insertAfter) {
				$(insertAfter).first().after($adTag);
			} else if (insertBefore) {
				$(insertBefore).first().before($adTag);
			} else if (appendTo) {
				$(appendTo).first().append($adTag);
			} else if (prependTo) {
				$(prependTo).first().prepend($adTag);
			}
		}
		return $(insertAfter).first().find(".adTagReady");
	}

	//console.log("AsyncGPT");
	var $adTags = $(".adGPTTag").not(".adTagAsync");
	$adTags.addClass("adTagAsync");

	window.MPUPos = window.MPUPos || 0;
	window.adTag = window.adTag || 1;

	$adTags.each(function(){
		//console.log(this);		
		var $adTag = $(this);
		var triggerOn = $adTag.attr("data-trigger-on");
		var triggerOnce = $adTag.attr("data-trigger-once");
		var refreshOn = $adTag.attr("data-refresh-on");

	if($adTag.prop("tagName") === "SCRIPT") {
		if(triggerOn) {
			$(document).on(triggerOn, function(){
				var $adTag = $(this);
				var tmpl = Handlebars.compile($adTag.html());
				if($adTag.attr("data-has-pos") != "true") {
					window.adTag++;
					window.MPUPos++;
				}
				var htmpl = tmpl({
					adTags: $("div.adGPTTag:visible").length + 1,
					adTagsReady: $("div.adGPTTag.adTagReady:visible").length + 1,
					MPUs: $("div.MPU.adTagReady:visible").length + 1,
					wAdTag: window.adTag,
					wMPU: window.MPUPos
				});	
				var $adtag = insert($adTag, htmpl);				
				//console.log($adtag);
				$(document).on("breakpoint:change", function(){					
					var $adtag = this.filter(":visible").not(".adTagReady");
					if($adtag.length > 0) {
						$adtag.addClass("adTagReady");
						$(document).trigger("adtags:ready", {adtags:$adtag});
					}
				}.bind($adtag));
				var $adtag = $adtag.filter(":visible").not(".adTagReady");
				if($adtag.length > 0) {
					$adtag.addClass("adTagReady");
					$(document).trigger("adtags:ready", {adtags:$adtag});
				}
			}.bind($adTag));
		} 
		if (triggerOnce) {
			if (window.gptReady) {
				var tmpl = Handlebars.compile($adTag.html());		
				if($adTag.attr("data-has-pos") != "true") {
					window.adTag++;
					window.MPUPos++;
				}
				var htmpl = tmpl({
					adTags: $("div.adGPTTag:visible").length + 1,
					adTagsReady: $("div.adGPTTag.adTagReady:visible").length + 1,
					MPUs: $("div.MPU.adTagReady:visible").length + 1,
					wAdTag: window.adTag,
					wMPU: window.MPUPos
				});				
				var $adtag = insert($adTag, htmpl);				
				$(document).on("breakpoint:change", function(){					
					var $adtag = this.filter(":visible").not(".adTagReady");
					if($adtag.length > 0) {
						$adtag.addClass("adTagReady");
						$(document).trigger("adtags:ready", {adtags:$adtag});
					}
				}.bind($adtag));
				var $adtag = $adtag.filter(":visible").not(".adTagReady");
				if($adtag.length > 0) {
					$adtag.addClass("adTagReady");
					$(document).trigger("adtags:ready", {adtags:$adtag});
				}
			} else {
			$(document).on("gpt:ready", function() {
				var $adTag = $(this);
				var tmpl = Handlebars.compile($adTag.html());			
				if($adTag.attr("data-has-pos") != "true") {
					window.adTag++;
					window.MPUPos++;
				}
				var htmpl = tmpl({
					adTags: $("div.adGPTTag:visible").length + 1,
					adTagsReady: $("div.adGPTTag.adTagReady:visible").length + 1,
					MPUs: $("div.MPU.adTagReady:visible").length + 1,
					wAdTag: window.adTag,
					wMPU: window.MPUPos
				});				
				var $adtag = insert($adTag, htmpl);				
				//console.log($adtag);
				$(document).on("breakpoint:change", function(){					
					var $adtag = this.filter(":visible").not(".adTagReady");
					if($adtag.length > 0) {
						$adtag.addClass("adTagReady");
						$(document).trigger("adtags:ready", {adtags:$adtag});
					}
				}.bind($adtag));
				var $adtag = $adtag.filter(":visible").not(".adTagReady");
				if($adtag.length > 0) {
					$adtag.addClass("adTagReady");
					$(document).trigger("adtags:ready", {adtags:$adtag});
				}
			}.bind($adTag));
			}
		}
	// NOSCRIPT
	} else {
		if(triggerOnce === "gpt:ready") {
			if(window.gptReady && $adTag.is(":visible")) {
				if($adTag.attr("data-has-pos") != "true") {
					window.adTag++;
					window.MPUPos++;
					$adTag.attr("data-adtag-pos", "mpu"+window.MPUPos);
				}
				$adTag.addClass("adTagReady");						
				$(document).trigger("adtags:ready", {adtags:$adTag});
			} else {
				$(document).on("gpt:ready", function(){					
					if($adTag.is(":visible")) {
						console.log("gpt:ready trigger");
						//console.log($adTag[0]);
						if($adTag.attr("data-has-pos") != "true") {
							window.adTag++;
							window.MPUPos++;
							$adTag.attr("data-adtag-pos", "mpu"+window.MPUPos);
						}
						$adTag.addClass("adTagReady");						
						$(document).trigger("adtags:ready", {adtags:$adTag});						
					}
				});
			}
		}
		$(document).on("breakpoint:change", function(){		
			var $adTag = $(this);	
			if($adTag.is(":visible") && !$adTag.hasClass("adTagReady")) {
				$adTag.addClass("adTagReady");
				$(document).trigger("adtags:ready", {adtags:$adTag});
			}
		}.bind($adTag));
		}	
	});
})(jQuery);
