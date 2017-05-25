// Plugin to contain scripts frequently used across multiple widgets
// Minipersona, report abuse, that sort of thing.
pluckAppProxy.registerPlugin("pluck/comments/comments.js",
// init function, called first time plugin is loaded:
	function ($, jQuery, dmJQuery) {
	    // Pull CSS.
	    if (typeof (pluckAppProxy.pluck_comments_load_css) === 'undefined') {
	        pluckAppProxy.pluck_comments_load_css = function (callback) {
	            pluckAppProxy.pluck_load_css(function () {
	                pluckAppProxy.loadCss("pluck/comments/comments.css", "pluck-comments-css-loaded", function () {
                        if (callback) callback();
	                });
	            });
	        };
	    }
	    pluckAppProxy.pluck_comments_load_css();

	    /**************************************
	    *
	    * pluck/login/comments
	    *
	    **************************************/
	    if (typeof (pluckAppProxy.pluck_login_comment) === 'undefined') {
	        pluckAppProxy.pluck_login_comment = function (topId, parentId, prefs) {
	            if ($.browser.msie && $.browser.version < 8 && $.browser.version >= 7) {
	                $(topId).addClass("pluck-login-comment-input-ie7");
	            }

	            var top = $(topId);
	            var parentTop = $(parentId);

	            // If user is logged into facebook and not our site, let's show him a generic comment dialog.
	            var fbWelcome = $(".pluck-comm-submit-autoLoggedInFacebookUser", parentTop);
	            if (fbWelcome.length > 0) {

				// Yes, that's right.  The login URL is stored in the prefs for login widget,
				// but now we also have a login link in the submit widget
				// So we're filling that one in dynamically with JS
				$('.pluck-comm-submit-login-link', parentTop).attr("href", $('.pluck-login-comment-submit-button', parentTop).attr("href"));
				$('.pluck-comm-submit-login-link', parentTop).click($('.pluck-login-comment-submit-button', parentTop).get(0).onclick);
	                pluckAppProxy.loadPlugins(["pluck/social/social.js"], function () {
	                    pluckAppProxy.pluck_social_facebook_init(function () {
	                        FB.getLoginStatus(function (response) {
	                            // If user exists but is not connected, show a generic "your facebook account" input box for now.
	                            if (response.status == "notConnected" || response.status == "not_authorized") {
	                                $(".pluck-comm-comment-input-fb-auto", parentTop).show();
	                                $(".pluck-login-comment-input", parentTop).hide();
	                            }
	                            // if user exists and is connected, force a login as the pluck user and reload the widget.
	                            else if (response.status == "connected") {
	                                // put up a throbber:
	                                var throbber = $(".pluck-comments-wait", parentTop).clone();
	                                $(".pluck-comm-wait-msg-txt", throbber).html($(".pluck-login-comment-fb-login-msg", parentTop).html());
	                                throbber.insertAfter($(".pluck-comments-wait", parentTop));
	                                pluckAppProxy.displayWait(throbber);
									
	                                // Cleanup other UI elements
	                                $(".pluck-comm-comment-input-fb-auto", parentTop).hide();
	                                $(".pluck-login-comment-links-wrapper", parentTop).hide();
	                                $(".pluck-login-comment-calltoaction", top).css("margin-bottom", "0px"); // Just hide some common goofiness.
	                                $(".pluck-login-comment-input", parentTop).show();

	                                // Login the user
	                                pluckAppProxy.pluck_social_facebook_import_user(function () {
										// Successful login
	                                    // Refresh the comments widget
	                                    pluckAppProxy.pluck_comments_refresh(parentId, null, null, null, null, null, false, true, $(".pluck-login-comment-fb-login-msg", parentTop).html());
	                                }, function(){
										// Failed login
										$(".pluck-comm-comment-input-fb-auto", parentTop).show();
										$(".pluck-login-comment-links-wrapper", parentTop).show();
										$(".pluck-login-comment-input", parentTop).hide();
										throbber.hide();

									},
									true);
	                            }
	                            // User not logged into facebook, business as usual.
	                            // Should only end up here when anonymous commenting is enabled.
	                            // Otherwise fbWelcome won't exist.
	                            else {
	                                // If there's a "make anon" link, we know the user is anonymous, so hide the login box in this case and let him comment anonymously.
	                                var anon = $(".pluck-comm-submit-make-anon-link", fbWelcome);
	                                if (anon.length > 0) {
	                                    $(".pluck-comm-comment-input-fb-auto", parentTop).show();
	                                    $(".pluck-login-comment-input", parentTop).hide();
	                                    fbWelcome.remove();
	                                }
	                                // If the user is not anon, show the login dialog, not the submit dialog.
	                                else {
	                                    $(".pluck-comm-comment-input-fb-auto", parentTop).hide();
	                                    $(".pluck-login-comment-input", parentTop).show();
	                                }
	                            }
	                        });
	                    });
	                });

	                // If anonymous commenting is enabled, there will be a link to comment anonymously.
	                // Removing the pluck-comm-submit-autoLoggedInFacebookUser element will cause later on scripts 
	                // to know that the user would NOT like to use his FB account.
	                $(".pluck-comm-submit-make-anon-link", fbWelcome).click(function () {
	                    fbWelcome.remove();
				  return false;
	                });
	            }
	        };
	    }

	    /**************************************
	    *
	    * pluck/comments/submit
	    *
	    **************************************/
	    if (typeof (pluckAppProxy.pluck_comments_submit) === 'undefined') {
	        pluckAppProxy.pluck_comments_submit = function (formId, parentId, prefs) {
	            var parentTop = $(parentId);
	            prefs = prefs ? prefs : {};
	            if ($.browser.msie) {
	                $(".pluck-comm-socialoptions label", $(formId)).addClass("isie");
	            }
	            var submitData = null;

				var ptype = parentTop.attr("commentOnKeyType");
				if (ptype == "article") ptype = "ExternalResource";
				else if (ptype == "blogpost") ptype = "BlogPost";
				else if (ptype == "photo") ptype = "Photo";
				else if (ptype == "video") ptype = "Video";
				else if (ptype == "gallery") ptype = "Gallery";
				else if (ptype == "review") ptype = "Review";

	            // justFacebook == true when we want to post comment only to facebook and not pluck
	            // this is used when user previously connected to facebook connect but loses 
	            // facebook authentication
	            var doSubmit = function (justFacebook) {
	                var form = $(formId);
	                $('.pluck-error-message, .pluck-confirm-message', form).hide();
	                var comment = $('textarea', form).val();
	                comment = $.trim(comment);
	                if (!comment) {
	                    pluckAppProxy.fadeIn($('.pluck-comm-err-no-comment', form));
	                } else if (typeof (prefs.plckCommentMaxLength) !== 'undefined' && prefs.plckCommentMaxLength < comment.length) {
	                    pluckAppProxy.fadeIn($('.pluck-comm-err-too-long', form));
	                } else {
	                    var form_top = form.parent().parent();
	                    pluckAppProxy.displayWait($('.pluck-comm-submit-wait', form_top));
	                    var params = { contentType: "Json", plckAction: "create", plckCommentBody: comment, plckPageTitle: window.document.title };
	                    if (parentTop.attr("plckArticleTitle")) params.plckArticleTitle = parentTop.attr("plckArticleTitle");
	                    if (parentTop.attr("plckPageTitle")) params.plckPageTitle = parentTop.attr("plckPageTitle");
	                    if (!params.plckPageTitle) params.plckPageTitle = window.document.title;
	                    if (parentTop.attr("plckArticleUrl")) params.plckArticleUrl = parentTop.attr("plckArticleUrl");
	                    if (parentTop.attr("plckOnPageUrl")) params.plckOnPageUrl = parentTop.attr("plckOnPageUrl");
	                    if (!params.plckOnPageUrl) params.plckOnPageUrl = window.location.href;
	                    if (parentTop.attr("plckDiscoverySection")) params.plckDiscoverySection = parentTop.attr("plckDiscoverySection");
	                    if (parentTop.attr("plckDiscoveryCategories")) params.plckDiscoveryCategories = parentTop.attr("plckDiscoveryCategories");

	                    $('input:hidden', form).each(function () { params[this.name] = this.value; });
	                    var twitter = $("input[name='plckTwitterLink']:checked", form).val();
	                    if (twitter) params["plckTwitterLink"] = "true";
	                    var linkedin = $("input[name='plckLinkedInLink']:checked", form).val();
	                    if (linkedin) params["plckLinkedInLink"] = "true";

	                    var facebookCallback = function (data) {
	                        var parentComment = $("input[name='plckParentCommentKey']", form).val();
	                        submitData = data;
	                        data = eval('(' + data + ')');
	                        if (data.success) {
	                            if (data.moderating) {
	                                pluckAppProxy.fadeIn($(".pluck-comm-info-moderating", form));
	                            }
	                            if (twitter && !data.twitter) {
	                                pluckAppProxy.fadeIn($(".pluck-comm-twitter-error", form));
	                            }
	                            if (linkedin && !data.linkedIn) {
	                                pluckAppProxy.fadeIn($(".pluck-comm-linkedIn-error", form));
	                            }
	                            var updateKids = function () {
	                                var comment_top = form.parents('div.pluck-comm-single-comment-main');
	                                var reply_top = form_top.parents('div.pluck-comm-reply-input');
	                                reply_top.hide();
	                                pluckAppProxy.pluck_comments_submit_current = "";
	                                pluckAppProxy.pluck_comments_list_refresh_replies(comment_top, parentId, "2", "1", data.commentId, true);
	                            };
	                            var updateList = function () {
	                                var parentTop = $(parentId);
	                                $(".pluck-nocomm-logo", parentTop).hide();
	                                $(".pluck-comm-first-to-comment", parentTop).hide();
	                                pluckAppProxy.pluck_comments_list_refresh(parentId, null, null, $('.pluck-comm-comment-filters').val(), null, data.commentId);
	                            };
	                            if (parentComment) {
	                                $(".pluck-score-volume[scoreontargetkey='" + parentComment + "']").each(function (i) {
	                                    var vol = $(this);
	                                    vol.attr("activity", "" + (parseInt(vol.attr("activity")) + 1));
	                                });
	                            }

	                            // Call the activity callback for "CommentCreate"
	                            var activityObj = { commentOnKey: params.plckCommentOnKey, commentOnKeyType: params.plckCommentOnKeyType,
	                                parentCommentKey: params.plckParentCommentKey, commentKey: data.commentId, moderated: data.moderating
	                            };

	                            pluckAppProxy.executeActivityCallbacks("CommentCreate", activityObj);

	                            $('.pluck-comm-submit-wait', form_top).hide();
	                            var facebook = $('.pluck-comm-facebook-option input', form);
	                            if (facebook.length >= 1 && facebook.get(0).checked) {
	                                pluckAppProxy.displayWait($('.pluck-comm-submit-wait-fb', form_top));
	                                var url = $("input[name='clientUrl']", form).val();
	                                if (!data.moderating) url = data.commentUrl;
	                                var comment_top = $('div.pluck-comm-input-rounded-wrap');

	                                // initialize FB api now to check if user is logged into facebook
	                                // if user isn't logged in, he will get another dialogue prompting for login
	                                pluckAppProxy.pluck_social_facebook_init(function () {
	                                    pluckAppProxy.pluck_social_facebook_getLoginStatus(function (session) {
	                                        if (session) {
	                                            $('textarea', form).val("");
	                                            $('.pluck-comm-submit-wait-fb', form_top).hide();
	                                            pluckAppProxy.pluck_social_facebook_submitArticleComment($(".pluck-comm-submit-option", form),
													document.title, url, "", comment, [], 'Read the full article', null,
													function () {
													    $('.pluck-comm-submit-wait-fb', form_top).hide();
													    if (!data.moderating) {
													        $('textarea', form).focus();
													        setTimeout(parentComment ? updateKids : updateList, 1);
													    }
													}, function () {
													    $('.pluck-comm-submit-wait-fb', form_top).hide();
														pluckAppProxy.fadeIn($(".pluck-comm-facebook-error", form));
													    $('textarea', form).focus();
													    if (!data.moderating) {
													        setTimeout(parentComment ? updateKids : updateList, 1);
													    }
													}, "Comment", ptype);
	                                        }
	                                        else {
	                                            pluckAppProxy.displayWait($('.pluck-comm-join-facebook-confirm-submit', comment_top));
	                                            $('.pluck-comm-submit-wait-fb', comment_top).hide();
	                                        }
	                                    });
	                                });
	                            } else {
	                                if (!data.moderating) {
	                                    setTimeout(parentComment ? updateKids : updateList, 1);
	                                }
	                                $('textarea', form).val('');
	                            }
	                        } else {
	                            $('.pluck-comm-submit-wait', form_top).hide();
	                            var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
	                            $(".pluck-comm-submit-error-detail", form).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
	                            if (results.errorCode == "FloodControlTriggered") {
	                                pluckAppProxy.fadeIn($(".pluck-comm-submit-flood-error", form));
	                            } else if (results.errorCode == "LargeActionThresholdTriggered") {
	                                pluckAppProxy.fadeIn($(".pluck-comm-submit-large-action-error", form));
	                            } else if (results.status == 6 || results.status == 3 || results.status == 2) {
	                                pluckAppProxy.fadeIn($(".pluck-comm-submit-general-error", form));
	                            } else if (results.status == 5) {
	                                pluckAppProxy.fadeIn($(".pluck-comm-submit-security-error", form));
	                            } else if (results.status == 4) {
	                                pluckAppProxy.fadeIn($(".pluck-comm-submit-deleted-error", form));
	                            } else if (results.status == 1) {
	                                $(".pluck-comm-submit-badword-list", form).html(results.dirtyWordsMsg);
	                                pluckAppProxy.fadeIn($(".pluck-comm-submit-badword-error", form));
	                            }
	                        }
	                    }

	                    if (!justFacebook) {
	                        submitData = null;
	                        pluckAppProxy.callApp("pluck/comments/actions.app", params, facebookCallback);
	                    }
	                    else {
	                        facebookCallback(submitData);
	                    }
	                }
	                return false;
	            };

	            $(formId).submit(function () {
	                // If is anonymous facebook user, import him as a pluck user before posting.
	                var fbWelcome = $(".pluck-comm-submit-autoLoggedInFacebookUser", parentTop);
	                if (fbWelcome.length > 0) {
	                    pluckAppProxy.loadPlugins(["pluck/social/social.js"], function () {
	                        pluckAppProxy.pluck_social_facebook_import_user(function(){
								doSubmit();
							},
							function(){
	                            $('.pluck-comm-submit-wait', parentTop).hide();
								pluckAppProxy.fadeIn($(".pluck-comm-submit-general-error", $(formId)));
							});
	                    });
	                }
	                else {
	                    doSubmit();
	                }
	            });

	            // Wire up minipersona around avatar:
				$(".pluck-comm-sc-avatar-active", $(formId)).hover(function () {
					if (typeof (pluckAppProxy.pluck_user_miniPersona_show) != "function") return;
					var userId = $(this).attr("userId");
					pluckAppProxy.closeDialogs();
					pluckAppProxy.pluck_user_miniPersona_show(this, userId, false, false);
				}, function () {
					if (typeof (pluckAppProxy.pluck_user_miniPersona_show_stop) != "function") return;
					var userId = $(this).attr("userId");
					pluckAppProxy.pluck_user_miniPersona_show_stop(this, userId);
				});

	            $(".pluck-comm-submit", $(formId)).click(function () {
	                $(formId).submit();
	                return false;
	            });
	            $(".pluck-comm-cancel", $(formId)).click(function () {
	                var reply = $(formId).parents(".pluck-comm-comment-input").eq(0);
	                reply.hide();
	                pluckAppProxy.pluck_comments_submit_current = "";
	                $('.pluck-error-message, .pluck-confirm-message', reply).hide();
	                return false;
	            });
	            $(".pluck-comm-comment-connect-twitter-cancel", $(formId)).click(function () {
	                var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
	                $('.pluck-comm-join-twitter-confirm', comment_top).hide();
	                return false;
	            });
	            $(".pluck-comm-comment-connect-linkedin-cancel", $(formId)).click(function () {
	                var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
	                $('.pluck-comm-join-linkedin-confirm', comment_top).hide();
	                return false;
	            });
	            $(".pluck-comm-comment-connect-facebook-cancel", $(formId)).click(function () {
	                var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
	                $('.pluck-comm-join-facebook-confirm', comment_top).hide();
	                $('.pluck-comm-join-facebook-confirm-submit', comment_top).hide();
	                return false;
	            });
	            $(".pluck-comm-comment-connect-twitter-yes", $(formId)).click(function () {
	                var me = this;
	                pluckAppProxy.pluck_social_twitter_startAuth($("input[name='plckUserId']", $(formId)).val(), null, null, function (success, msg, status) {
	                    if (success) $("input[name='plckTwitterLink']", $(formId)).removeClass('pluck-comm-twitter-link-connect').addClass('pluck-comm-twitter-link');
	                    var comment_top = $(me).parents('div.pluck-comm-input-rounded-wrap');
	                    $('.pluck-comm-join-twitter-confirm', comment_top).hide();
	                    $("input[name='plckTwitterLink']", $(formId)).attr('checked', success);
	                });
	                return false;
	            });
	            $(".pluck-comm-comment-connect-linkedin-yes", $(formId)).click(function () {
	                var me = this;
	                pluckAppProxy.pluck_social_linkedIn_startAuth($("input[name='plckUserId']", $(formId)).val(), null, null, function (success, msg, status) {
	                    if (success) $("input[name='plckLinkedInLink']", $(formId)).removeClass('pluck-comm-linkedin-link-connect').addClass('pluck-comm-linkedin-link');
	                    var comment_top = $(me).parents('div.pluck-comm-input-rounded-wrap');
	                    $('.pluck-comm-join-linkedin-confirm', comment_top).hide();
	                    $("input[name='plckLinkedInLink']", $(formId)).attr('checked', success);
	                });
	                return false;
	            });
	            $(".pluck-comm-twitter-link-connect", $(formId)).click(function () {
	                if ($(".pluck-comm-twitter-link-connect", $(formId)).is(':checked')) {
	                    pluckAppProxy.closeDialogs();
	                    var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
	                    pluckAppProxy.displayWait($('.pluck-comm-join-twitter-confirm', comment_top));
	                    return false;
	                }
	                return true;
	            });
	            $(".pluck-comm-linkedin-link-connect", $(formId)).click(function () {
	                if ($(".pluck-comm-linkedin-link-connect", $(formId)).is(':checked')) {
	                    pluckAppProxy.closeDialogs();
	                    var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
	                    pluckAppProxy.displayWait($('.pluck-comm-join-linkedin-confirm', comment_top));
	                    return false;
	                }
	                return true;
	            });
	            $(".pluck-comm-facebook-link-connect", $(formId)).click(function () {
	                if ($(".pluck-comm-facebook-link-connect", $(formId)).is(':checked')) {
	                    pluckAppProxy.closeDialogs();
	                    var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
	                    pluckAppProxy.displayWait($('.pluck-comm-submit-wait-fb', comment_top));
	                    // initialize FB api now so that the onclick event on the login button directly fires FB's API (thus avoiding popup blockers)
	                    pluckAppProxy.pluck_social_facebook_init(function () {
	                        pluckAppProxy.displayWait($('.pluck-comm-join-facebook-confirm', comment_top));
	                        $('.pluck-comm-submit-wait-fb', comment_top).hide();
	                    });
	                    return false;
	                }
	                return true;
	            });

	            // When user clicks yes to our "connect to FB?" dialog... call out to FB's API to log him in to facebook.
	            // After he is successfully logged into facebook, ping pluck to link the accounts together.
	            $(".pluck-comm-comment-connect-facebook-yes", $(formId)).click(function (event) {
					var $this = $(this);
	                var form_top = $this.parents('div.pluck-comm-input-content');
	                pluckAppProxy.pluck_social_facebook_connect($(formId), function (uid) {
	                    $("input[name='plckFacebookLink']", $(formId)).removeClass('pluck-comm-facebook-link-connect').addClass('pluck-comm-facebook-link');
                          $('.pluck-comm-join-facebook-confirm', $(formId)).hide();
	                    $('.pluck-comm-join-facebook-confirm-submit', $(formId)).hide();
	                    pluckAppProxy.displayWait($('.pluck-comm-submit-wait-fb', form_top));

	                    var params = { contentType: "Json", plckAction: "updateExternalUserId", plckUserKey: $("input[name='plckUserId']", $(formId)).val(),
	                        plckKey: "Facebook", plckValue: uid
	                    };
	                    pluckAppProxy.callApp("pluck/user/actions.app", params, function (data) {
	                        $('.pluck-comm-submit-wait-fb', form_top).hide();
	                        $("input[name='plckFacebookLink']", $(formId)).attr('checked', true);
	                        $("input[name='plckFacebookLink']", $(formId)).removeClass('pluck-comm-facebook-link-connect').addClass('pluck-comm-facebook-link');
	                    });

						if($this.hasClass("pluck-comm-comment-connect-facebook-submit")){
							doSubmit(true);
						}
	                }, function () {
                          $('.pluck-comm-join-facebook-confirm', $(formId)).hide();
	                    $("input[name='plckFacebookLink']", $(formId)).attr('checked', false);
	                });
	                event.preventDefault();
	            });

	            var lastKeyTimeout = null;
	            $("textarea.pluck-comment-input-box").keyup(function () {
	                if (lastKeyTimeout) clearTimeout(lastKeyTimeout);
	                var me = $(this);
	                lastKeyTimeout = setTimeout(function () {
	                    var remaining = parseInt(prefs.plckCommentMaxLength) - me.val().length;
	                    var tp = me.parents(".pluck-comm-posting-form");
	                    $(".pluck-comm-counter-wrapper .pluck-comm-counter-count", tp).html(remaining < 0 ? remaining * -1 : remaining);
	                    $(".pluck-comm-counter-wrapper .pluck-comm-counter-50", tp).toggle(remaining == 0 || remaining > 1);
	                    $(".pluck-comm-counter-wrapper .pluck-comm-counter-1", tp).toggle(remaining == 1);
	                    $(".pluck-comm-counter-wrapper .pluck-comm-over-counter-1", tp).toggle(remaining == -1);
	                    $(".pluck-comm-counter-wrapper .pluck-comm-over-counter-50", tp).toggle(remaining < -1);
	                    $(".pluck-comm-counter-wrapper", tp).toggle(remaining < 50);
	                    $('.pluck-comm-err-no-comment', tp).hide();
	                    $('.pluck-comm-err-too-long', tp).hide();
	                }, 500);
	            });

	            $("span.pluck-comm-max-comment-length").html(prefs.plckCommentMaxLength);
	        };
	    }

	    /**************************************
	    *
	    * pluck/comments/list
	    *
	    **************************************/
	    if (typeof (pluckAppProxy.pluck_comments_list) === 'undefined') {
	        pluckAppProxy.pluck_comments_list = function (listId, parentId, prefs, levelNum, displayComment, findCommentNextLevel, isShort) {
	            levelNum = levelNum ? levelNum : 1;
	            prefs = prefs ? prefs : {};
	            var list = $(listId);
	            var parentDiv = parentId ? $(parentId) : $(document);

	            var fadeCommentIn = function (p) {
                    p.show();
	            };

	            var updateCommentState = function (p, state) {
	                p.hide();
	                p.removeClass("pluck-comm-isBlocked");
	                p.removeClass("pluck-user-isHidden");
	                p.removeClass("pluck-user-isIgnored");
	                p.removeClass("pluck-comm-isAbuseReported");
	                p.removeClass("pluck-comm-isUnderReview");
	                p.removeClass("pluck-comm-isVisible");
	                if (state == "deleted") p.addClass("pluck-comm-isDeleted");
	                else if (p.hasClass("pluck-comm-isBlockedOrig")) p.addClass("pluck-comm-isBlocked");
	                else if (p.hasClass("pluck-user-isHiddenOrig")) p.addClass("pluck-user-isHidden");
	                else if (p.hasClass("pluck-comm-isUnderReviewOrig")) p.addClass("pluck-comm-isUnderReview");
	                else if (p.hasClass("pluck-user-isIgnoredOrig")) p.addClass("pluck-user-isIgnored");
	                else if (p.hasClass("pluck-comm-isAbuseReportedOrig")) p.addClass("pluck-comm-isAbuseReported");
	                else p.addClass("pluck-comm-isVisible");
	                fadeCommentIn(p);
	            };

	            var updateShowHiddenInfo = function (p, showIt) {
	                p.hide();
	                if (showIt) p.addClass("pluck-comm-showHiddenInfo");
	                else p.removeClass("pluck-comm-showHiddenInfo");
	                fadeCommentIn(p);
	            };

	            var updateFriendInfo = function (p, isFriend) {
	                p.hide();
	                if (isFriend) p.addClass("pluck-user-isFriend");
	                else p.removeClass("pluck-user-isFriend");
	                fadeCommentIn(p);
	            };

	            var showErrorMessage = function (msgDivClass, comment_top) {
	                $(".pluck-comm-edit-controls", comment_top).hide();
	                pluckAppProxy.fadeIn($(msgDivClass, comment_top), function () {
	                    setTimeout(function () {
	                        pluckAppProxy.fadeOut($(msgDivClass, comment_top), function () {
	                            $(".pluck-comm-edit-controls", comment_top).css('display', 'block');
	                        });
	                    }, 5000);
	                });
	            };

				var actives = $(".pluck-comm-single-comment-top:not(.pluck-comm-isAnonymousTier)", list);
				$(".pluck-comm-sc-avatar-active", actives).hover(function () {
					if (typeof (pluckAppProxy.pluck_user_miniPersona_show) != "function") return;
					var comment_top = $(this).parents('div.pluck-comm-single-comment-main').eq(0).parent();
					var isFeatured = comment_top.hasClass("pluck-user-isFeatured");
					var userId = $(this).attr("userId");
					pluckAppProxy.closeDialogs();
					pluckAppProxy.pluck_user_miniPersona_show(this, userId, isFeatured, false);
				}, function () {
					if (typeof (pluckAppProxy.pluck_user_miniPersona_show_stop) != "function") return;
					var userId = $(this).attr("userId");
					pluckAppProxy.pluck_user_miniPersona_show_stop(this, userId);
				});

	            var buildActivityObj = function (comment_top) {
	                var retval = {};
	                retval.commentKey = comment_top.eq(0).attr("commentId");
	                var list_top = comment_top.parents('div.pluck-comm-ReplyLevel-2');
	                if (list_top.length == 1) {
	                    retval.parentCommentKey = $(".pluck-comm-single-comment-main", list_top.prev()).attr("commentId");
	                } else {
	                    retval.parentCommentKey = '';
	                }
	                var top = comment_top.parents('div.pluck-comm');
	                retval.commentOnKey = top.attr("commentonkey");
	                retval.commentOnKeyType = top.attr("commentonkeytype");
	                return retval;
	            };

	            $(".pluck-comm-report-abuse", list).data("abuseCallback", function (link) {
	                var comment_top = link.parents(".pluck-comm-single-comment-top");
	                comment_top.addClass("pluck-comm-isAbuseReportedOrig");
	                updateCommentState(comment_top, "abusereported");
	            });

	            $(".pluck-comm-comment-delete-yes", list).click(function () {
	                var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
	                pluckAppProxy.displayWait($('.pluck-comm-working', comment_top));
	                $('.pluck-comm-comment-delete-confirm', comment_top).hide();
	                pluckAppProxy.pluck_comments_list_collapse_replies(comment_top, parentId);
	                var commentId = comment_top.eq(0).attr("commentId");
	                if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
	                var params = { contentType: "Json", plckAction: "delete", plckCommentKey: commentId };
	                pluckAppProxy.callApp("pluck/comments/actions.app", params, function (data) {
	                    data = eval('(' + data + ')');
	                    $('.pluck-comm-wait', comment_top).hide();
	                    if (!data.success) {
	                        var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
	                        if (results.status == 4) data.success = true;
	                    }
	                    if (data.success) {
	                        pluckAppProxy.executeActivityCallbacks("CommentDelete", buildActivityObj(comment_top));
	                        $(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function () {
	                            pluckAppProxy.pluck_comments_list_collapse_replies($(this), parentId);
	                            updateCommentState($(this).parent(), "deleted");
	                        });
	                    } else {
	                        showErrorMessage(".pluck-comm-delete-error", comment_top);
	                    }
	                });
	                return false;
	            });
	            $(".pluck-comm-comment-delete-no", list).click(function () {
	                var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
	                $('.pluck-comm-wait', comment_top).hide();
	                return false;
	            });
	            $(".pluck-comm-delete", list).click(function () {
	                pluckAppProxy.closeDialogs();
	                var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
	                pluckAppProxy.displayWait($('.pluck-comm-comment-delete-confirm', comment_top));
	                return false;
	            });
	            $(".pluck-comm-block", list).click(function () {
	                pluckAppProxy.closeDialogs();
	                var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
	                pluckAppProxy.displayWait($('.pluck-comm-working', comment_top));
	                pluckAppProxy.pluck_comments_list_collapse_replies(comment_top, parentId);
	                var commentId = comment_top.eq(0).attr("commentId");
	                if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
	                var params = { contentType: "Json", plckAction: "block", plckBlock: "1", plckCommentKey: commentId };
	                pluckAppProxy.callApp("pluck/comments/actions.app", params, function (data) {
	                    $('.pluck-comm-working', comment_top).hide();
	                    data = eval('(' + data + ')');
	                    if (!data.success) {
	                        var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
	                        if (results.status == 4) data.success = true;
	                    }
	                    if (data.success) {
	                        pluckAppProxy.executeActivityCallbacks("CommentBlock", buildActivityObj(comment_top));
	                        $(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function () {
	                            $(this).parent().addClass("pluck-comm-isBlockedOrig");
	                            updateCommentState($(this).parent(), "reset");
	                        });
	                    } else {
	                        showErrorMessage('.pluck-comm-block-error', comment_top);
	                    }
	                });
	                return false;
	            });
	            $(".pluck-comm-unblock", list).click(function () {
	                pluckAppProxy.closeDialogs();
	                var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
	                pluckAppProxy.displayWait($('.pluck-comm-working', comment_top));
	                var commentId = comment_top.eq(0).attr("commentId");
	                if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
	                var params = { contentType: "Json", plckAction: "block", plckBlock: "0", plckCommentKey: commentId };
	                pluckAppProxy.callApp("pluck/comments/actions.app", params, function (data) {
	                    $('.pluck-comm-working', comment_top).hide();
	                    data = eval('(' + data + ')');
	                    if (!data.success) {
	                        var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
	                        if (results.status == 4) data.success = true;
	                    }
	                    if (!data.success) {
	                        var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
	                        if (results.status == 4) data.success = true;
	                    }
	                    if (data.success) {
	                        pluckAppProxy.executeActivityCallbacks("CommentUnblock", buildActivityObj(comment_top));
	                        $(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function () {
	                            $(this).parent().removeClass("pluck-comm-isBlockedOrig");
	                            updateCommentState($(this).parent(), "reset");
	                        });
	                    } else {
	                        showErrorMessage('.pluck-comm-unblock-error', comment_top);
	                    }
	                });
	                return false;
	            });
	            $("a.pluck-comm-show-hidden-info", list).click(function () {
	                updateShowHiddenInfo($(this).parents('div.pluck-comm-single-comment-main').parent(), true);
	                return false;
	            });
	            $("a.pluck-comm-hide-hidden-info", list).click(function () {
	                updateShowHiddenInfo($(this).parents('div.pluck-comm-single-comment-main').parent(), false);
	                return false;
	            });

	            if (levelNum == 1) {
	                pluckAppProxy.pluck_comments_submit_current = "";
	                $("a.pluck-comm-reply-button-ref", list).click(function () {
	                    pluckAppProxy.closeDialogs();
	                    var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
	                    var commentId = comment_top.eq(0).attr("commentId");
	                    if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
	                    var reply = $(".pluck-comm-reply-input", parentDiv);
	                    if (commentId == pluckAppProxy.pluck_comments_submit_current) {
	                        reply.hide();
	                        pluckAppProxy.pluck_comments_submit_current = "";
	                        $('.pluck-error-message, .pluck-confirm-message', reply).hide();
	                    } else {
	                        $('textarea', reply).val('');
	                        if (pluckAppProxy.pluck_comments_submit_current) reply.hide();
	                        $('.pluck-error-message, .pluck-confirm-message', reply).hide();
	                        pluckAppProxy.pluck_comments_submit_current = commentId;
	                        $("input[name='plckParentCommentKey']", reply).val(pluckAppProxy.pluck_comments_submit_current);
	                        pluckAppProxy.pluck_comments_submit_reply_display(reply, comment_top);
	                    }
	                    return false;
	                });
	                $("select.pluck-comm-comment-filters", list).change(function () { pluckAppProxy.pluck_comments_list_refresh(parentId, "", "", $(this).val(), "", ""); });
	                $("a.pluck-comm-featuredfilter-link", list).click(function () { pluckAppProxy.pluck_comments_list_refresh(parentId, "", "", "", "featured", ""); return false; });
	                $("a.pluck-comm-allfilter-link", list).click(function () { pluckAppProxy.pluck_comments_list_refresh(parentId, "", "", "", "all", ""); return false; });
	                $("a.pluck-comm-friendsfilter-link", list).click(function () { pluckAppProxy.pluck_comments_list_refresh(parentId, "", "", "", "friends", ""); return false; });

	                // Keep this block for backwards compatibility
	                $("a.pluck-comm-pagination-first, a.pluck-comm-pagination-prev, a.pluck-comm-pagination-next, a.pluck-comm-pagination-last", list).click(function () {
	                    pluckAppProxy.pluck_comments_list_refresh(parentId, $(this).attr("pageno"), "", "", "", ""); return false;
	                });
	                // End block

	                $("a.pluck-comm-paged-pagination-button-prev, a.pluck-comm-paged-pagination-button-next, a.pluck-comm-paged-pagination-page", list).click(function () {
	                    pluckAppProxy.pluck_comments_list_refresh(parentId, $(this).attr("pageno"), "", "", "", ""); return false;
	                });

	                $("a.pluck-comm-show-reply-link", list).click(function () {
	                    pluckAppProxy.pluck_comments_list_expand_replies($(this).parents('div.pluck-comm-single-comment-main'), parentId, "2");
	                    return false;
	                });
	                $("a.pluck-comm-hide-reply-link", list).click(function () {
	                    pluckAppProxy.pluck_comments_list_collapse_replies($(this).parents('div.pluck-comm-single-comment-main'), parentId);
	                    return false;
	                });
	                pluckAppProxy.pluck_user_miniPersona_addCallback("setFriend", function (userId) {
	                    $(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function () {
	                        updateFriendInfo($(this).parents(".pluck-comm-single-comment-main").parent(), true);
	                    });
	                });
	                pluckAppProxy.pluck_user_miniPersona_addCallback("unsetFriend", function (userId) {
	                    $(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function () {
	                        updateFriendInfo($(this).parents(".pluck-comm-single-comment-main").parent(), false);
	                    });
	                });
	                pluckAppProxy.pluck_user_miniPersona_addCallback("setEnemy", function (userId) {
	                    $(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function () {
	                        var p = $(this).parents(".pluck-comm-single-comment-main").parent();
	                        p.addClass("pluck-user-isIgnoredOrig");
	                        updateCommentState(p, "reset");
	                    });
	                });
	                pluckAppProxy.pluck_user_miniPersona_addCallback("unsetEnemy", function (userId) {
	                    $(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function () {
	                        var p = $(this).parents(".pluck-comm-single-comment-main").parent();
	                        p.removeClass("pluck-user-isIgnoredOrig");
	                        updateCommentState(p, "reset");
	                    });
	                });
					pluckAppProxy.pluck_user_miniPersona_addCallback("setBlocked", function(userId) {
						$(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function() {
							var p = $(this).parents(".pluck-comm-single-comment-main").parent();
							p.addClass("pluck-user-isHiddenOrig");
							p.removeClass("pluck-comm-showHiddenInfo");
							updateCommentState(p, "reset");
						});
					});
					pluckAppProxy.pluck_user_miniPersona_addCallback("unsetBlocked", function(userId) {
						$(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function() {
							var p = $(this).parents(".pluck-comm-single-comment-main").parent();
							p.removeClass("pluck-user-isHiddenOrig");
							p.removeClass("pluck-comm-showHiddenInfo");
							updateCommentState(p, "reset");
						});
					});
	                if (displayComment) {
	                    var interval = window.setInterval(function () {
	                        if (parentDiv.css("display") != 'none') {
	                            var l = $(".pluck-comm-single-comment-main[commentId='" + displayComment + "']", list);
	                            if (l && l.length > 0) l.get(0).scrollIntoView(true);
	                            if (findCommentNextLevel) {
	                                pluckAppProxy.pluck_comments_list_refresh_replies(l, parentId, "2", "1", findCommentNextLevel);
	                            }
	                            window.clearInterval(interval);
	                        }
	                    }, 200);
	                } else if (isShort.toLowerCase() != "true") {
	                    var u = document.location.href;
	                    var idx = u.indexOf("#");
	                    if (idx != -1) {
	                        var anchor = u.substring(idx + 1);
	                        if (anchor && anchor == "pluck_comments_list") {
	                            var interval = window.setInterval(function () {
	                                if (parentDiv.css("display") != 'none') {
	                                    $(listId).get(0).scrollIntoView(true);
	                                    window.clearInterval(interval);
	                                }
	                            }, 200);
	                        }
	                    }
	                }
	            } else {
	                if (typeof (pluckAppProxy.pluck_reactions_abuse_dialog_link) == "function") pluckAppProxy.pluck_reactions_abuse_dialog_link(list);
	                if (typeof (pluckAppProxy.pluck_util_email_dialog_link) == "function") pluckAppProxy.pluck_util_email_dialog_link(list);
	                if (typeof (pluckAppProxy.pluck_util_permalink_dialog_link) == "function") pluckAppProxy.pluck_util_permalink_dialog_link(list);
	                if (typeof (pluckAppProxy.pluck_util_share_dialog_link) == "function") pluckAppProxy.pluck_util_share_dialog_link(list);
	                // Keep this block for backwards compatibility
	                $("a.pluck-comm-pagination-first, a.pluck-comm-pagination-prev, a.pluck-comm-pagination-next, a.pluck-comm-pagination-last", list).click(function () {
	                    var lnk = $(this);
	                    var pageno = lnk.attr("pageno");
	                    var list_top = lnk.parents('div.pluck-comm-pagination-wrapper').eq(0).parent();
	                    var comment_top = $("div.pluck-comm-single-comment-main", list_top.prev());
	                    pluckAppProxy.pluck_comments_list_refresh_replies(comment_top, parentId, levelNum, pageno, "");
	                    return false;
	                });
	                // End block
	                $("a.pluck-comm-paged-pagination-button-prev, a.pluck-comm-paged-pagination-button-next, a.pluck-comm-paged-pagination-page", list).click(function () {
	                    var lnk = $(this);
	                    var pageno = lnk.attr("pageno");
	                    var list_top = lnk.parents('div.pluck-comm-pagination-wrapper').eq(0).parent();
	                    var comment_top = $("div.pluck-comm-single-comment-main", list_top.prev());
	                    pluckAppProxy.pluck_comments_list_refresh_replies(comment_top, parentId, levelNum, pageno, "");
	                    return false;
	                });

	            }
	            if (typeof (pluckAppProxy.pluck_reactions_score_submit) == "function") pluckAppProxy.pluck_reactions_score_submit(list, ".pluck-comm-score-action-error", ".pluck-comm-score-general-error");

                  if (levelNum == 1) {
                      var isSubwid = parentDiv.parents(".pluck-app").length > 0;
                      if (isSubwid) {
                          var pagWrapper = $(".pluck-comm-pagination-level1", list);
                          var pag = $(".pluck-comm-paged-pagination", pagWrapper);
                          if (pag.length == 0) pagWrapper.hide();
                          else $(".pluck-comm-pagination-logo-area", pagWrapper).css("visibility", "hidden");
                      }
                  }
	        };

	        pluckAppProxy.pluck_comments_list_expand_replies = function (comment_top, parentId, level, pageno, replyCommentId) {
	            pageno = pageno ? pageno : "1";
	            replyCommentId = replyCommentId ? replyCommentId : "";
	            var parent = $(".pluck-comm-show-hide-replies", comment_top);
	            var listId = parent.attr("childlist");
	            if (listId) {
	                $(listId).show();
	                $("a.pluck-comm-show-reply-link", parent).hide();
	                $("a.pluck-comm-hide-reply-link", parent).show();
	            } else {
	                pluckAppProxy.pluck_comments_list_refresh_replies(comment_top, parentId, level, pageno, replyCommentId);
	            }
	        };

	        pluckAppProxy.pluck_comments_list_collapse_replies = function (comment_top, parentId) {
	            var parent = $(".pluck-comm-show-hide-replies", comment_top);
	            var listId = parent.attr("childlist");
	            if (listId) {
	                pluckAppProxy.closeDialogs();
	                $(listId).hide();
	            }
	            $("a.pluck-comm-hide-reply-link", parent).hide();
	            $(".pluck-comm-wait-reply-link", parent).hide();
	            $("a.pluck-comm-show-reply-link", parent).show();
	        };

	        pluckAppProxy.pluck_comments_list_refresh_replies = function (comment_top, parentId, level, pageno, replyCommentId, isGlobal) {
				var parent = $(".pluck-comm-show-hide-replies", comment_top);

				if(!pageno){//this is here to permit returning to the same page after a reply is added to a comment
					if(parent.attr("plcklastonpage")){
						pageno = parent.attr("plcklastonpage");
					}
					else{
						pageno = "1";
					}
				}
				//remember this pageno, used to return to the proper page after a reply is made
		        parent.attr("plcklastonpage", pageno);
				
	            level = level ? level : "2";
	            replyCommentId = replyCommentId ? replyCommentId : "";
	            var listId = parent.attr("childlist");
	            pluckAppProxy.closeDialogs();
				var waiter = $(".pluck-comm-wait-reply-link", parent);

				if (!listId) {
				$("a.pluck-comm-show-reply-link", parent).hide();
				$("a.pluck-comm-hide-reply-link", parent).hide();
				waiter.show();
				parent.show();
				}
	            var commentPath = comment_top.attr("threadpath");

	            var parentCommentId;
	            var matchCommentId = comment_top.attr("commentId");
	            if (matchCommentId.indexOf("F:") == 0) {
	                matchCommentId = matchCommentId.substring(2);
	                parentCommentId = matchCommentId;
	            } else {
	                parentCommentId = matchCommentId;
	                matchCommentId = "F:" + matchCommentId;
	            }
	            var matchComment = $(".pluck-comm-single-comment-main[commentId='" + matchCommentId + "']");

	            var params = {
	                contentType: "Html",
	                plckCommentOnKeyType: parent.attr("commentOnKeyType"),
	                plckCommentOnKey: parent.attr("commentOnKey"),
	                plckParentCommentPath: commentPath,
	                plckSort: "TimeStampAscending",
	                plckOnPage: pageno,
	                plckItemsPerPage: parent.attr("itemsPerPage"),
	                plckFilter: "",
	                plckLevel: level,
	                plckParentHtmlId: parentId.substring(1),
	                plckFindCommentKey: replyCommentId,
	                clientUrl: document.location.href
	            };
	            if (pluckAppProxy.debugLevel) {
	                params["debug"] = pluckAppProxy.debugLevel;
	            }
	            if ($('.pluck-comm-ReplyLevel-1', $(parentId)).hasClass("pluck-comm-narrow")) params.plckCommentListType = "narrow";
	            var getList = function () {
	                pluckAppProxy.displayWait($(".pluck-comments-list-wait", $(listId)));
	                pluckAppProxy.callApp("pluck/comments/list.app", params, function (data) {
	                    var commentTopParent = comment_top.parent();
	                    if (listId) {
	                        $(listId).replaceWith(data);
	                    } else {
	                        comment_top.parent().after(data);
	                    }
	                    var childList = comment_top.parent().next();
	                    parent.attr("childlist", "#" + childList.attr("id"));
	                    var totalcount = childList.attr("totalcount");
	                    $('span.pluck-comm-child-count', comment_top).html(totalcount);
	                    $('span.pluck-comm-child-count-multiple', comment_top).toggle(totalcount != "1");
	                    $('span.pluck-comm-child-count-single', comment_top).toggle(totalcount == "1");
	                    matchComment.each(function () {
	                        var ct = $(this);
	                        var p1 = $(".pluck-comm-show-hide-replies", ct);
	                        var listId = p1.attr("childlist");
	                        if (isGlobal && listId) {
	                            pluckAppProxy.pluck_comments_list_refresh_replies(ct, parentId, level, pageno, "");
	                        } else {
	                            $('span.pluck-comm-child-count', ct).html(totalcount);
	                            $('span.pluck-comm-child-count-multiple', ct).toggle(totalcount != "1");
	                            $('span.pluck-comm-child-count-single', ct).toggle(totalcount == "1");
	                            p1.show();
	                        }
	                    });
	                    childList.show();
	                    $(".pluck-comm-wait-reply-link", parent).hide();
	                    $("a.pluck-comm-show-reply-link", parent).hide();
	                    $("a.pluck-comm-hide-reply-link", parent).show();
	                    if (replyCommentId) {
	                        var l = $(".pluck-comm-single-comment-main[commentId='" + replyCommentId + "']", childList);
	                        if (l && l.length > 0) l.get(0).scrollIntoView(true);
	                    }
	                    var activityObj = { commentOnKey: params.plckCommentOnKey, commentOnKeyType: params.plckCommentOnKeyType, parentCommentKey: parentCommentId,
	                        level: params.plckLevel, sort: params.plckSort, filter: params.plckFilter, onPage: params.plckOnPage,
	                        itemsPerPage: params.plckItemsPerPage, findCommentKey: params.plckFindCommentKey
	                    };
	                    pluckAppProxy.executeActivityCallbacks("CommentsRefresh", activityObj);

	                });
	            };
	            if (listId) {
	                pluckAppProxy.ensureOnScreen(waiter, function () {
	                    getList();
	                });
	            } else {
	                getList();
	            }
	        };

	        pluckAppProxy.pluck_comments_list_refresh = function (parentId, pageno, itemsPerPage, sort, filter, findCommentId, forcePageRefresh) {
	            var parent = $(parentId);
	            var params = {};
	            params.plckOnPage = pageno ? pageno : "1";
	            params.plckItemsPerPage = itemsPerPage ? itemsPerPage : parent.attr("itemsperpage");
	            params.plckSort = sort ? sort : (findCommentId ? "" : parent.attr("sort"));
	            params.plckFilter = filter ? filter : (findCommentId ? "" : parent.attr("filter"));
	            params.plckFindCommentKey = findCommentId ? findCommentId : "";

	            if (parent.attr("pagerefresh") == "true" || forcePageRefresh) {
	                var u = document.location.href;
	                var idx = u.indexOf("#");
	                if (idx != -1) u = u.substring(0, idx);
	                idx = u.indexOf("?");
	                if (idx != -1) {
	                    var query = u.substring(idx + 1);
	                    u = u.substring(0, idx + 1);
	                    var query = query.split("&");
	                    for (var i = 0; i < query.length; i++) {
	                        var idx = query[i].indexOf("=");
	                        if (idx != 1) {
	                            var key = query[i].substring(0, idx);
	                            var lkey = key.toLowerCase();
	                            var val = query[i].substring(idx + 1);
	                            if (lkey != "plckonpage" && lkey != "plckitemsperpage" && lkey != "plcksort" && lkey != "plckfilter" && lkey != "plckfindcommentkey") {
	                                u += key + "=" + val + "&";
	                            }
	                        }
	                    }
	                } else u += "?";
	                if (params.plckOnPage != "1") u += "plckOnPage=" + params.plckOnPage + "&";
	                if (params.plckItemsPerPage != "") u += "plckItemsPerPage=" + params.plckItemsPerPage + "&";
	                if (params.plckSort != "") u += "plckSort=" + params.plckSort + "&";
	                if (params.plckFilter != "") u += "plckFilter=" + params.plckFilter + "&";
	                if (params.plckFindCommentKey != "") u += "plckFindCommentKey=" + params.plckFindCommentKey + "&";
	                if (u.substring(u.length - 1) == "&") u = u.substring(0, u.length - 1);
					
					u += "#pluck_comments_list"

					// If there's no net change to the URL, reload the page 
	                if (document.location.href.indexOf(u) >= 0){
						document.location.reload();
						return;
	                }

	                document.location.href = u;
	                return;
	            }

	            pluckAppProxy.closeDialogs();

	            pluckAppProxy.pluck_comments_submit_current = "";
	            var reply = $(".pluck-comm-reply-input", parent);
	            reply.hide();
	            reply.appendTo(parent);

	            parent.attr("onpage", params.plckOnPage);
	            parent.attr("itemsperpage", params.plckItemsPerPage);
	            parent.attr("sort", params.plckSort);
	            parent.attr("filter", params.plckFilter);

	            var list_parent = $(".pluck-comm-wrapper", parent);

	            params.contentType = "Html";
	            params.plckCommentOnKeyType = parent.attr("commentOnKeyType");
	            params.plckCommentOnKey = parent.attr("commentOnKey");
	            params.plckLevel = "1";
	            params.plckParentHtmlId = parentId.substring(1);
	            params.clientUrl = document.location.href;
	            params.plckCommentListType = parent.attr("listtype");
	            if (pluckAppProxy.debugLevel) params.debug = pluckAppProxy.debugLevel;

	            pluckAppProxy.displayWait($(".pluck-comments-wait", parent));
	            $(".pluck-comm-shortList", list_parent).remove();
	            pluckAppProxy.ensureOnScreen($(".pluck-comm-ReplyLevel-1", list_parent), function () {
	                pluckAppProxy.callApp("pluck/comments/list.app", params, function (data) {
	                    if ($(".pluck-comm-ReplyLevel-1", list_parent).length == 0) {
	                        list_parent.append(data);
	                    } else {
	                        $(".pluck-comm-ReplyLevel-1", list_parent).replaceWith(data);
	                    }
	                    list_parent.show();
	                    var lists = $(".pluck-comm-ReplyLevel-1", list_parent);
	                    if (typeof (pluckAppProxy.pluck_reactions_abuse_dialog_link) == "function") pluckAppProxy.pluck_reactions_abuse_dialog_link(lists);
	                    if (typeof (pluckAppProxy.pluck_util_email_dialog_link) == "function") pluckAppProxy.pluck_util_email_dialog_link(lists);
	                    if (typeof (pluckAppProxy.pluck_util_permalink_dialog_link) == "function") pluckAppProxy.pluck_util_permalink_dialog_link(lists);
	                    if (typeof (pluckAppProxy.pluck_util_share_dialog_link) == "function") pluckAppProxy.pluck_util_share_dialog_link(lists);
	                    pluckAppProxy.ensureOnScreen(lists, function () {
	                        if ($.browser.msie && $.browser.version < 8) {
	                            setTimeout(function () {
	                                $(".pluck-comments-wait", parent).hide();
	                            }, 500);
	                        } else {
	                            $(".pluck-comments-wait", parent).hide();
	                        }
	                    });

	                    var activityObj = { commentOnKey: params.plckCommentOnKey, commentOnKeyType: params.plckCommentOnKeyType, parentCommentKey: "",
	                        level: "1", sort: params.plckSort, filter: params.plckFilter, onPage: params.plckOnPage,
	                        itemsPerPage: params.plckItemsPerPage, findCommentKey: params.plckFindCommentKey
	                    };
	                    pluckAppProxy.executeActivityCallbacks("CommentsRefresh", activityObj);
	                });
	            });
	        };

	        // pluck_comments_refresh
	        // Refreshes the comments widget.
	        // params:
	        //    - parentId - jQuery style ID or jQuery object for the comments widget (i.e. "#comments012341")
	        //    - pageno - (same as standard pas: tag parameter)
	        //    - itemsPerPage - (same as standard pas: tag parameter)
	        //    - sort - (same as standard pas: tag parameter)
	        //    - filter - (same as standard pas: tag parameter)
	        //    - findCommentId - (same as standard pas: tag parameter)
	        //    - forcePageRefresh - by default, we'll try to do an ajax refresh of just the comments widget (based on prefs).  
	        //      If this is set, we'll always do a full page reload.
	        //    - noScroll - by default, we scroll to the top of the comments widget while it refreshes.  Set this to prevent scrolling (i.e. auto-login that happens while the user is reading the article).
	        //    - waitMsg - Overrides the default throbber message with a given string.
	        pluckAppProxy.pluck_comments_refresh = function (parentId, pageno, itemsPerPage, sort, filter, findCommentId, forcePageRefresh, noScroll, waitMsg) {
	            var parent = $(parentId);
	            var params = {};
				
	            params.plckOnPage = pageno ? pageno : "1";
	            params.plckItemsPerPage = itemsPerPage ? itemsPerPage : parent.attr("itemsperpage");
	            params.plckSort = sort ? sort : (findCommentId ? "" : parent.attr("sort"));
	            params.plckFilter = filter ? filter : (findCommentId ? "" : parent.attr("filter"));
	            params.plckFindCommentKey = findCommentId ? findCommentId : "";

	            if (parent.attr("pagerefresh") == "true" || forcePageRefresh) {
	                var u = document.location.href;
	                var idx = u.indexOf("#");
	                if (idx != -1) u = u.substring(0, idx);
	                idx = u.indexOf("?");
	                if (idx != -1) {
	                    var query = u.substring(idx + 1);
	                    u = u.substring(0, idx + 1);
	                    var query = query.split("&");
	                    for (var i = 0; i < query.length; i++) {
	                        var idx = query[i].indexOf("=");
	                        if (idx != 1) {
	                            var key = query[i].substring(0, idx);
	                            var lkey = key.toLowerCase();
	                            var val = query[i].substring(idx + 1);
	                            if (lkey != "plckonpage" && lkey != "plckitemsperpage" && lkey != "plcksort" && lkey != "plckfilter" && lkey != "plckfindcommentkey") {
	                                u += key + "=" + val + "&";
	                            }
	                        }
	                    }
	                } else u += "?";
	                if (params.plckOnPage != "1") u += "plckOnPage=" + params.plckOnPage + "&";
	                if (params.plckItemsPerPage != "") u += "plckItemsPerPage=" + params.plckItemsPerPage + "&";
	                if (params.plckSort != "") u += "plckSort=" + params.plckSort + "&";
	                if (params.plckFilter != "") u += "plckFilter=" + params.plckFilter + "&";
	                if (params.plckFindCommentKey != "") u += "plckFindCommentKey=" + params.plckFindCommentKey + "&";
	                if (u.substring(u.length - 1) == "&") u = u.substring(0, u.length - 1);

	                if (document.location.href.indexOf(u) >= 0) {
	                    u += "#pluck_comments_list"
	                    document.location.href = u;
	                }
	                else {
	                    document.location.reload();
	                }
	                return;
	            }

	            pluckAppProxy.closeDialogs();

	            var throbber = $(".pluck-comments-wait", parent);
	            pluckAppProxy.displayWait(throbber, waitMsg);


	            pluckAppProxy.pluck_comments_submit_current = "";
	            var reply = $(".pluck-comm-reply-input", parent);
	            reply.hide();
	            reply.appendTo(parent);

	            parent.attr("onpage", params.plckOnPage);
	            parent.attr("itemsperpage", params.plckItemsPerPage);
	            parent.attr("sort", params.plckSort);
	            parent.attr("filter", params.plckFilter);

	            var list_parent = $(".pluck-comm-wrapper", parent);

	            params.contentType = "Html";
	            params.plckCommentOnKeyType = parent.attr("commentOnKeyType");
	            params.plckCommentOnKey = parent.attr("commentOnKey");
	            params.plckLevel = "1";
	            params.plckParentHtmlId = parentId.substring(1);
	            params.clientUrl = document.location.href;
	            params.plckCommentListType = parent.attr("listtype");

	            if (pluckAppProxy.debugLevel) params.debug = pluckAppProxy.debugLevel;

	            if (!noScroll) {
	                list_parent.get(0).scrollIntoView(true);
	            }

	            pluckAppProxy.callApp("pluck/comments", params, function (data) {
	                parent.replaceWith(data);
	                if ($.browser.msie) {
	                    setTimeout(function () {
	                        $(".pluck-comments-wait", parent).hide();
	                    }, 500);
	                } else {
	                    $(".pluck-comments-wait", parent).hide();
	                }

	                var list_parent = $(".pluck-comm-wrapper", parent);
	                if (!noScroll) {
	                    list_parent.get(0).scrollIntoView(true);
	                }
	                var activityObj = { commentOnKey: params.plckCommentOnKey, commentOnKeyType: params.plckCommentOnKeyType, parentCommentKey: "",
	                    level: "1", sort: params.plckSort, filter: params.plckFilter, onPage: params.plckOnPage,
	                    itemsPerPage: params.plckItemsPerPage, findCommentKey: params.plckFindCommentKey
	                };
	                pluckAppProxy.executeActivityCallbacks("CommentsRefresh", activityObj);
	            });
	        };
	    }

	    /**************************************
	    *
	    * pluck/comments
	    *
	    **************************************/
	    if (typeof (pluckAppProxy.pluck_comments) === 'undefined') {
	        pluckAppProxy.pluck_comments = function (topId) {
	            pluckAppProxy.registerCssCallback("pluck/comments/comments.css", function () {
	                $.pluckCornerComplete($(topId), function () {
	                    var top = $(topId);
	                    top.prev().hide();
	                    var activityObj = { commentOnKey: top.attr("commentonkey"), commentOnKeyType: top.attr("commentonkeytype") };
	                    top.show();
	                    pluckAppProxy.executeActivityCallbacks("CommentsRendered", activityObj);
	                });
	            });
	        };
	    }
	},

// eachTime function.  Called whenever the plugin is requested, responsible for executing callbacks.
	function ($, jQuery, dmJQuery, callback) {
	    if (callback) {
	        callback();
	    }
	}
);