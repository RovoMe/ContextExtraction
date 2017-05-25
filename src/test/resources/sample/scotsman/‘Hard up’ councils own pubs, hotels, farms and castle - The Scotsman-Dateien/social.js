// Plugin to contain scripts frequently used across multiple widgets
// Minipersona, report abuse, that sort of thing.
pluckAppProxy.registerPlugin("pluck/social/social.js",
	// init function, called first time plugin is loaded:
	function ($, jQuery, dmJQuery){
		// Pull CSS.

		if (typeof(pluckAppProxy.pluck_social_load_css) === 'undefined') {
			window.pluckLoadScript(pluckAppProxy.genericBaseUrl + "Direct/JavascriptSDKProxy.js");
			pluckAppProxy.pluck_social_load_css = function(callback) {
				pluckAppProxy.pluck_load_css(function() {
					pluckAppProxy.loadCss("pluck/social/social.css", "pluck-social-css-loaded", function() {
						if (callback) callback();
					});
				});
			};
		}
		pluckAppProxy.pluck_social_load_css();

		/**************************************
		 *
		 * pluck/social/facebook
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_facebook) === 'undefined') {
			pluckAppProxy.pluck_social_facebook_status = null;
			pluckAppProxy.pluck_social_facebook_dialog_callback = null;
			pluckAppProxy.pluck_social_facebook_featureloader_included = false;
			pluckAppProxy.pluck_social_facebook = function (dialogId, parentId, opts) {
				opts = opts ? opts : {};
				opts.connectStatus = null;
				opts.connectUid = null;
				pluckAppProxy.pluck_social_facebook_status = opts;

				pluckAppProxy.registerDialog(dialogId, function(id) {
				});
				pluckAppProxy.pluck_dialog_register("facebook", parentId, dialogId);

				if(opts.RequiredPermissions){
					dmJQuery.merge(pluckAppProxy.pluck_social_facebook_requiredPerms, opts.RequiredPermissions.split(/\s*,\s*/));
				}

				pluckAppProxy.pluck_social_facebook_init();
			};
			
			// Permissions that we always require the user to give us.
			// These are permissions that are absolutely required and should not be editable by customers.  Permissions defined in FacebookPrefs.RequiredPermissions will be merged into these.
			pluckAppProxy.pluck_social_facebook_requiredPerms = [
				"publish_stream" // Allows us to syndicate comments, etc.
			];

			pluckAppProxy.parseFacebookSession = function(response){
				if(response.session){
					return response.session;
				}
				else if (response.authResponse){
					return {
						"access_token": response.authResponse.accessToken,
						"uid": response.authResponse.userID
					};
				}
				else{
					return null;
				}
			};
			
			// Checks whether the user is logged in and whether or not he has adequate permissions.
			// callback will be passed a session object if user is logged in, null if he is not.
			pluckAppProxy.pluck_social_facebook_getLoginStatus = function(callback){
				if(pluckAppProxy.pluck_social_facebook_sessionCache){
					// Easy out.  We already cached a session.
					if(callback){
						callback(pluckAppProxy.pluck_social_facebook_sessionCache.session);
					}
				}
				else{
					// FB.getLoginStatus tells us whether the user is logged in.
					FB.getLoginStatus(function(response){
						var session = pluckAppProxy.parseFacebookSession(response);

						if(session){
							// Session exists.  Let's check if user has all the permissions we care about.
						    FB.api('/me/permissions', function (permissionsResponse) {
						        var allPerms = false;
						        if (permissionsResponse && permissionsResponse.data) {
						            var permissions = permissionsResponse.data.shift();
						            if (permissions) {
						                allPerms = true;
						                for (var i in pluckAppProxy.pluck_social_facebook_requiredPerms) {
						                    var p = pluckAppProxy.pluck_social_facebook_requiredPerms[i];
						                    if (!permissions[p] || permissions[p] == 0) {
						                        allPerms = false;
						                        break;
						                    }
						                }
						            }
						        }

						        if (allPerms) {
						            // All good.  Cache the session.
						            pluckAppProxy.pluck_social_facebook_sessionCache = { "session": session };

						            if (callback) {
						                callback(session);
						            }
						        }
						        else if (callback) {
						            // Not logged in fully. Cache a null session so we don't make a ton of round trips checking for things we know are false.

						            // Cache whatever permissionsResponse we have.
						            pluckAppProxy.pluck_social_facebook_sessionCache = { "session": null };
						            callback(null);
						        }
						    });
						}
						else{
							// Not logged in fully. Cache a null session so we don't make a ton of round trips checking for things we know are false.
							// Cache whatever response we have.
							pluckAppProxy.pluck_social_facebook_sessionCache = {"session": null};
							callback(null);
						}
					});
				}
			};

			// Loads the facebook API and inits it.
			// params:
			//     callback : Function to call after successfully loaded.  See documentation for FB.getLoginStatus : http://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
			//     failCallback : Facebook times out and does nothing in some edge cases.  Callback for when that happens.
			//     failTimeout : In miliseconds, the max amount of time to wait for facebook to get status.  Defaults to 5 seconds.
			//     iterCount : (don't worry about this).  Work around a race condition by re-checking iterCount number of times to see if FB is defined.  This is just used in the recursive calls, not for you.)
			pluckAppProxy.pluck_social_facebook_init = function(callback, failCallback, failTimeout, iterCount) {
				var handleFailure = function(){
					pluckAppProxy.log("Failed to load Facebook SDK", "ERROR");
					// When failing, reset the "featureloader included" flag so we'll try and re-include it later.
					pluckAppProxy.pluck_social_facebook_featureloader_included = false;

					if(failCallback){
						failCallback();
					}
				};

				var opts = pluckAppProxy.pluck_social_facebook_status;
				// If no API key or user is Anonymous, do nothing, call callback immediately.
				if(!opts.ApiKey || opts.ApiKey == "") {
					if(callback) callback();
					return;
				}
				if (!iterCount) iterCount = 0;
				if (iterCount > 10){ 
					// Too many iterations waiting for facebook to init.  Hit the fail callback.
					handleFailure();
					return;
				}

				//Crazy hack for removing document.write
				if ($("#fb-root").length == 0) {
					$("body").prepend('<div id="fb-root"></div>');
				}

				// Race condition where Fb isn't loaded yet...
				if (!window.FB) {
					if (pluckAppProxy.pluck_social_facebook_featureloader_included) {
						setTimeout(function() {
							pluckAppProxy.pluck_social_facebook_init(callback, failCallback, failTimeout, ++iterCount);
						}, 10 * (iterCount+1));
					} else {
						pluckAppProxy.pluck_social_facebook_featureloader_included = true;
						pluckAppProxy.loadScript(document.location.protocol + '//connect.facebook.net/en_US/all.js', function() {
							pluckAppProxy.pluck_social_facebook_init(callback, failCallback, failTimeout, ++iterCount);
						});
					}
					return;
				}

				if (!opts.initialized) {
					opts.initialized = true;
					FB.init({appId: opts.ApiKey, status: true, cookie: true, xfbml: true, oauth: true});
				}
				
				// Setup a timeout incase the facebook call fails.
				var failTimer = null;
				var callFailed = false;
				if(failCallback){
					if(!failTimeout){
						failTimeout = 5000;
					}
					failTimer = setTimeout(function(){
						handleFailure();
						callFailed = true;	
					}, failTimeout);
				}
				
				pluckAppProxy.pluck_social_facebook_getLoginStatus(function(response){
					// If we've already passed the fail timeout, just bail.
					if(callFailed){
						return;
					}
					
					// Clear any pending fail callbacks before it's too late.
					if(failTimeout){
						clearTimeout(failTimer);
						failTimer = null;
					}
					
					if(callback){
						callback(response);
					}
				});
			};

			pluckAppProxy.pluck_social_facebook_private_requireSession = function(callback, cancelCallback) {
				pluckAppProxy.pluck_social_facebook_init(function(){
					pluckAppProxy.pluck_social_facebook_getLoginStatus(function(session){
						if(session){
							if(callback){
								callback(session.uid, session);
							}
						}
						else{
							FB.login(function(response){
								var session = pluckAppProxy.parseFacebookSession(response);

								// cache the sesssion so later calls to pluck_social_facebook_getLoginStatus don't make a permissions popup...
								pluckAppProxy.pluck_social_facebook_sessionCache = {"session": session};

								if(session){
									if(callback){
										callback(session.uid, session);
									}
								}
								else{
									if(cancelCallback){
										cancelCallback();
									}
								}
							}, {"scope": pluckAppProxy.pluck_social_facebook_requiredPerms.join(",")});
						}
					});
				}, cancelCallback);
			};

			pluckAppProxy.pluck_social_facebook_connect = function(target, callback, cancelCallback, parentId) {
				pluckAppProxy.pluck_social_facebook_private_requireSession(function(uid, session) {
					if (callback) callback(uid, session, parentId);
				}, function() {
					if (cancelCallback) cancelCallback(parentId);
				}, true);
			};

		    pluckAppProxy.pluck_social_facebook_button_login = function(parent, wait_message) {
		        if (parent.data('isComments')) {
		            parent.data('wait', dmJQuery(".pluck-comments-wait", parent));
		            pluckAppProxy.displayWait(parent.data('wait'));
		            var list_parent = dmJQuery(".pluck-comm-wrapper", parent);
		            if (list_parent.get(0)) {
		                list_parent.get(0).scrollIntoView();
		            }
		        } else if (parent.data('isForums')) {
		            parent.data('wait', dmJQuery(".pluck-forums-wait", parent));
		            pluckAppProxy.displayWait(parent.data('wait'));
		        } else {
		            parent.data('wait', dmJQuery(".pluck-wait", parent));
		            dmJQuery(".pluck-wait-msg-text").html(wait_message);
		            pluckAppProxy.displayWait(parent.data('wait'));
		        }
		        pluckAppProxy.pluck_social_facebook_connect(null,
		            pluckAppProxy.pluck_social_facebook_buttonSuccess, pluckAppProxy.pluck_social_facebook_buttonFailure, parent);
		    };
		    
		    pluckAppProxy.pluck_social_facebook_buttonSuccess = function(uid, session, jQueryParent) {
		        pluckAppProxy.pluck_social_facebook_import_user(
		            // Success callback
		            function() {
		                window.focus();
		                if (dmJQuery(jQueryParent).data('isComments')) {
		                    pluckAppProxy.pluck_comments_refresh(jQueryParent);
		                } else if (dmJQuery(jQueryParent).data('isForums')) {
		                    pluckAppProxy.replaceHashParamsAndGo({});
		                } else {
		                    window.location.reload(true);
		                }
		            },
		            // Failure callback
		            function() {
		                dmJQuery(jQueryParent).data('button').show();
		                window.focus();
		                if (dmJQuery(jQueryParent).data('isComments')) {
		                    pluckAppProxy.pluck_comments_refresh(jQueryParent);
		                } else if (dmJQuery(jQueryParent).data('isForums')) {
		                    pluckAppProxy.replaceHashParamsAndGo({});
		                }
		                dmJQuery(jQueryParent).data('wait').hide();
		            }
		        );
		    };

		    pluckAppProxy.pluck_social_facebook_buttonFailure = function(jQueryParent) {
		        if (dmJQuery(jQueryParent).data('isComments')) {
		            window.location.reload(true);
		        } else {
		            dmJQuery(jQueryParent).data('wait').hide();
		            dmJQuery(jQueryParent).data('button').show();
		        }
		    };

			pluckAppProxy.pluck_social_facebook_logout = function(callback) {
				pluckAppProxy.pluck_social_facebook_init(function() {
					FB.logout(callback);
				});
			};


			// Post a comment (or really any feed story) to 
			// The accepted parameters for this have changed over the years as facebook has rampantly changed their SDKs.
			//     target - jQuery object representing the parent element of the form doing the submission.  Not actually used anywhere....
			//     
			pluckAppProxy.pluck_social_facebook_submitArticleComment = function(target, title, url, excerpt, comment_body, images, actionText, shareText, callback, cancelCallback, contentType, parentContentType) {
				if (excerpt && excerpt.length > 200) {
					excerpt = excerpt.substring(0, 200) + "...";
				}
				var val = {
					"url": url,
					"title": title,
					"description": excerpt
				}
				if (contentType) val.contentType = contentType;
				if (parentContentType) val.parentContentType = parentContentType;
				pluckAppProxy.pluck_social_facebook_submitFeedStory(comment_body, val, callback, cancelCallback);
			};

			// Post a generic feed story to facebook. Params:
			// - message: The main message to post.  required
			// - opts: dict of optional parameters:
			//   - url: the url of a link
			//   - title: if url defined, the title of the link
			//   - description: if url provided, this shows up as the links' preview text
			//   - caption: shows up below the preview text.
			//   - actions: action links across the bottom.  [{"name": "submit a review today!", "link": "http://www.foo.com"}, ...]
			// - callback: after post is sent
			// - cancelCallback: if user cancels post or if any errors happen
			pluckAppProxy.pluck_social_facebook_submitFeedStory = function(message, opts, callback, cancelCallback){
				opts = opts || {};

				pluckAppProxy.pluck_social_facebook_init(function() {
					pluckAppProxy.pluck_social_facebook_private_requireSession(function(uid, session) {
						var cmd = new PluckSDK.SendFacebookMessageActionRequest({FacebookAccessToken: session["access_token"], Body: message, Url: opts.url });

						if (opts.title) cmd.Title = opts.title;
						if (opts.description) cmd.Description = opts.description;
						if (opts.contentType) cmd.ContentTypes = opts.contentType.split(/\s*,\s*/);
						if (opts.parentContentType) cmd.ParentContentTypes = opts.parentContentType.split(/\s*,\s*/);

						if (opts.actions){
							cmd.Actions = [];
							for(var i=0; i<opts.actions.length; i++){
								cmd.Actions.push(new PluckSDK.SiteLifeKeyValuePair({Key: opts.actions[i].link, Value: opts.actions[i].name}));
							}
						}

						PluckSDK.SendRequests(cmd, function(responses) {
							var data = responses[0];
							if (data.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
								callback()
							} else {
								cancelCallback();
							}
						});
					}, cancelCallback);
				}, cancelCallback);
			};
			
			// Creates a Pluck user based on the currently logged in Facebook user.
			// Params:
			//     successCallback: 
			//     failCallback: 
			//     isPassiveLogin: Set this to true if login should only happen when a positive match is found.  
			//                     For example, when Facebook AutoLogin is enabled, we check if the current Facebook user matches a pluck user who might not be currently logged in.
			//                     In cases where customers have their own ClientSideLogin workflow defined, we don't want to invoke login UIs on page load.
			pluckAppProxy.pluck_social_facebook_import_user = function(successCallback, failCallback, isPassiveLogin){
				successCallback = successCallback || function(){};
				failCallback = failCallback || function(){};

				pluckAppProxy.pluck_social_facebook_init(function() {
					pluckAppProxy.pluck_social_facebook_private_requireSession(function(uid, session) {
						if(session){
							PluckSDK.SendRequests(
								new PluckSDK.BeginFacebookLoginActionRequest({
									AccessToken: session.access_token
								}),
								function(responses){
									var loginResp = responses[0];

									if( loginResp.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK ){										
										var clientSideLoginParams = eval( "(" + loginResp.ClientSideLogin + ")");

										if (loginResp.User){
											successCallback(session);
										} 
										else if (clientSideLoginParams) {
											if(isPassiveLogin){
												failCallback(session);
											}
											else{
												pluckAppProxy.executeActivityCallbacks("CompleteSocialAuthentication", { 
													hint: clientSideLoginParams, // whatever hint information the customer sent back when we called out to them.
													service: "Facebook",
													session: session,
													successCallback: function(signedUserToken){
														// We need to update the user's facebook ID so we can properly log him in next time.
														var cmd = new PluckSDK.CompleteFacebookLoginActionRequest({
															FacebookId: "" + uid, 
															UserKey: signedUserToken.UserKey,
															DisplayName: signedUserToken.DisplayName,
															Email: signedUserToken.Email,
															AvatarUrl: signedUserToken.AvatarUrl,
															Sig: signedUserToken.Sig
														});
														PluckSDK.SendRequests(cmd, function(responses){
															var data = responses[0];
														
															if (data.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
																	successCallback(session);
															}
															else {
																failCallback(session);
															}
														});
													},
													failCallback: function(){
														failCallback(session);
													}
												});
											}
										}
										else{
											failCallback(session);
										}
									}
									else{
										failCallback(session);
									}
								}
							);
						}
						else{
							failCallback(session);
						}
					}, function() {
						failCallback(null);
					});
				});
			};
			
			// Redraw fbml.  Optionally pass in a jQuery or DOM object to only render children of that object.
			pluckAppProxy.pluck_social_facebook_redraw_fbml = function(parent){
				var targ = parent;
				try{
					targ = parent.get(0);
				}
				catch(e){
				}
				FB.XFBML.parse(targ);
			};
		}

	    /**************************************
         *
         * pluck/social/googleplus
         *
         **************************************/
	    if (typeof(pluckAppProxy.pluck_social_googleplus) === 'undefined') {
	        pluckAppProxy.pluck_social_googleplus_status = null;
	        pluckAppProxy.pluck_social_googleplus = function(opts) {
	            opts = opts ? opts : {};
	            pluckAppProxy.pluck_social_googleplus_status = opts;
	            pluckAppProxy.pluck_social_googleplus.readyToLoad = false;
	        };
	        if (typeof(gapi) === 'undefined') {
	            pluckAppProxy.loadScript('https://apis.google.com/js/client:plusone.js');
	        }
	        
	        /**
             * Logs in if ready condition is met.  Otherwise stores parameters.
             */
	        pluckAppProxy.pluck_social_googleplus_prepareLogin = function(response, callback, preUserImportCallbackEnabled) {
	            if (pluckAppProxy.pluck_social_googleplus.readyToLoad == true) {
	                if (!response) {
	                    response = pluckAppProxy.pluck_social_googleplus.loginResponse;
	                    callback = pluckAppProxy.pluck_social_googleplus.loginCallback;
	                    preUserImportCallbackEnabled = pluckAppProxy.pluck_social_googleplus.preUserImportCallbackEnabled;
	                    
	                }
	                pluckAppProxy.pluck_social_googleplus_attemptLogin(response, callback, preUserImportCallbackEnabled);
	                return;
	            }
	            pluckAppProxy.pluck_social_googleplus.loginResponse = response;
	            pluckAppProxy.pluck_social_googleplus.loginCallback = callback;
	            pluckAppProxy.pluck_social_googleplus.preUserImportCallbackEnabled = preUserImportCallbackEnabled;
	            
	        };
	        
	        /**
             * Sets a precondition which makes it login if we have approval.  This is the
             * behavior of hitting a login button.
             */
	        pluckAppProxy.pluck_social_googleplus_catalyzeLogin = function () {
	            pluckAppProxy.pluck_social_googleplus.readyToLoad = true;
	            if (pluckAppProxy.pluck_social_googleplus.loginResponse) {
	                pluckAppProxy.pluck_social_googleplus_prepareLogin(null, null, null);
	            }
	        };

	        /**
             * Contact google server with response from login information.
             */
	        pluckAppProxy.pluck_social_googleplus_attemptLogin = function (session, callback, preUserImportCallbackEnabled) {
	            if (session.error) {
	                return;
	            }
	            PluckSDK.SendRequests(new PluckSDK.GooglePlusLoginActionRequest({
	                OneTimeCode: session.code
	                }),
	                function (responses) {
	                    var loginResponse = responses[0];
	                    if (loginResponse.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
	                        var clientSideLoginParams = eval("(" + loginResponse.ClientSideLogin + ")");

	                        if (loginResponse.User) {
	                            callback();
	                        } else if (clientSideLoginParams && preUserImportCallbackEnabled) {
	                            pluckAppProxy.executeActivityCallbacks("CompleteSocialAuthentication", {
	                                hint: clientSideLoginParams, // whatever hint information the customer sent back when we called out to them.
	                                service: "GooglePlus",
	                                session: session,
	                                successCallback: function (signedUserToken) {
	                                    // We need to update the user's google id so we can properly log him in next time.
	                                    PluckSDK.SendRequests(new PluckSDK.CompleteGooglePlusLoginActionRequest({
	                                        GooglePlusId: "" + loginResponse.GooglePlusId,
	                                        UserKey: signedUserToken.UserKey,
	                                        DisplayName: signedUserToken.DisplayName,
	                                        Email: signedUserToken.Email,
	                                        AvatarUrl: signedUserToken.AvatarUrl,
	                                        Sig: signedUserToken.Sig
	                                    }), 
	                                    function (responses) {
	                                        var data = responses[0];

	                                        if (data.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
	                                            callback();
	                                        }
	                                        else {
	                                            callback();//fail
	                                        }
	                                    });
	                                },
	                                failCallback: function () {
	                                    callback();//fail
	                                }
	                            });
	                        }
	                    }


	                });
	        };

	        // If a user has connected but has an expired token, this will refresh it.
	        // clientId and scope are needed to pull auth from Google.
	        // connectCallback is run on success.
	        // errorCallback is run on error.
	        pluckAppProxy.pluck_social_googleplus_reconnect = function 
	            (clientId, scope, connectCallback, errorCallback) {
	            gapi.auth.authorize({
	                client_id: clientId,
	                immediate: true,
	                scope: scope,
	                response_type: 'code'
	            }, function (authResult) {
	                if (!authResult.error) {
	                    var request = new PluckSDK.GooglePlusLoginActionRequest();
	                    connectCallback = connectCallback || function () { };
	                    request.OneTimeCode = authResult.code;
	                    PluckSDK.SendRequests([request], connectCallback);
	                } else {
	                    if (errorCallback) {
	                        errorCallback(authResult);
	                    } else {
	                        pluckAppProxy.log("Google rejected authorization.", "ERROR");
	                    }
	                }
                    
	            });
	        };

	        /**
             * Attempt to execute a command.  If it fails, reconnect and try again.
             */
	        pluckAppProxy.pluck_social_googleplus_insist = function (clientId, scope, requests, callback) {
	            callback = callback || function() {};
	            PluckSDK.SendRequests(requests, function (responses) {
	                if ((responses[0].ResponseStatus.Exceptions)
	                    && (responses[0].ResponseStatus.Exceptions.length)) {
	                    pluckAppProxy.pluck_social_googleplus_reconnect(clientId, scope, function() {
	                        PluckSDK.SendRequests([requests], callback);
	                    });
	                } else {
	                    callback(responses);
	                }
	            });
	        };

	        pluckAppProxy.pluck_social_googleplus_sync = function(clientId, scope, callback) {
	            pluckAppProxy.pluck_social_googleplus_checkLoginStatus(clientId, scope, function() {
	                var req = new PluckSDK.GooglePlusSyncRequest();
	                PluckSDK.SendRequests(req, callback);
	            }, function() {
	                pluckAppProxy.log("Did could not authenticate with Google.", "ERROR");
	            });

	        };

	    }

	    var myWindow;

		var open_window_centered = function (url, width, height) {
			var left = parseInt((screen.availWidth/2) - (width/2));
			var top = parseInt((screen.availHeight/2) - (height/2));
			var windowFeatures = "width=" + width + ",height=" + height + ",status,resizable,left=" + left + ",top=" + top + "screenX=" + left + ",screenY=" + top;
			return window.open(url, "subWind", windowFeatures);
		}


		/**************************************
		 *
		 * pluck/social/twitter
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_twitter) === 'undefined') {
			pluckAppProxy.pluck_social_twitter_status = null;
			pluckAppProxy.pluck_social_twitter = function (opts) {
				opts = opts ? opts : {};
				pluckAppProxy.pluck_social_twitter_status = opts;
			};

			pluckAppProxy.pluck_social_twitter_startAuth = function(userKey, errorDiv, errorMsgDiv, callback) {
				pluckAppProxy.pluck_social_twitter_status.loginCallback = callback;
				var url = pluckAppProxy.baseUrl + "pluck/social/twitter/connect.app?plckUserKey=" + userKey;
				pluckAppProxy.pluck_social_twitter_status.loginWindow = open_window_centered(url, 750, 675);

				// make sure there's only one interval waiting for auth.
				if(pluckAppProxy.pluck_social_twitter_status.loginWindowCheckTimeout){
					clearTimeout(pluckAppProxy.pluck_social_twitter_status.loginWindowCheckTimeout);
				}				
				
				pluckAppProxy.pluck_social_twitter_status.loginWindowCheckTimeout = setTimeout(pluckAppProxy.pluck_social_twitter_authWindowCheck, 10);
			};
			
			pluckAppProxy.pluck_social_twitter_authWindowCheck = function(){
				if(!pluckAppProxy.pluck_social_twitter_status.loginWindow || pluckAppProxy.pluck_social_twitter_status.loginWindow.closed){
					// OK, window is closed.  Now fetch the user and see if he's actually connected to twitter or if he canceled
					pluckAppProxy.callApp("pluck/social/isUserConnectedToService", {"service": "Twitter"}, function(resp){
						pluckAppProxy.pluck_social_twitter_completeAuth(resp.toLowerCase() == "true");
					});
				}
				else{
					pluckAppProxy.pluck_social_twitter_status.loginWindowCheckTimeout = setTimeout(pluckAppProxy.pluck_social_twitter_authWindowCheck, 10);
				}
			};

			pluckAppProxy.pluck_social_twitter_completeAuth = function(success, errorCode, errorMessage) {
				if(pluckAppProxy.pluck_social_twitter_status.loginWindowCheckTimeout){
					clearTimeout(pluckAppProxy.pluck_social_twitter_status.loginWindowCheckTimeout);
					pluckAppProxy.pluck_social_twitter_status.loginWindowCheckTimeout = null;
				}
				
				if (pluckAppProxy.pluck_social_twitter_status.loginWindow) {
					try{
						pluckAppProxy.pluck_social_twitter_status.loginWindow.close();
					}
					catch (e) {}

					if (window.focus) {
						try {
					            window.focus();
						} catch (e) {}
					}
					pluckAppProxy.pluck_social_twitter_status.loginWindow = null;
				}
				var callback = pluckAppProxy.pluck_social_twitter_status.loginCallback;
				pluckAppProxy.pluck_social_twitter_status.loginCallback = null;
				if (callback) {
					callback(success, errorCode, errorMessage);
				}
			};

			// This is for use with backward compatibility to old twitter apps.
			window.twitterAuthComplete = function(screenName, userKey) {
				pluckAppProxy.pluck_social_twitter_completeAuth(true);
			};
		}

		/**************************************
		 *
		 * pluck/social/twitter/inviteDialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_twitter_inviteDialog) === 'undefined') {
			pluckAppProxy.pluck_social_twitter_inviteDialog = function (dialogId, parentId, twitterUrl) {
				pluckAppProxy.pluck_dialog_register("twitterInvite", parentId, dialogId);
				pluckAppProxy.registerDialog(dialogId, function(id) {
				});

				var dialog = $(dialogId);
				var lastKeyTimeout = null;
				$("textarea", dialog).keyup(function() {
					if (lastKeyTimeout) clearTimeout(lastKeyTimeout);
					var me = $(this);
					lastKeyTimeout = setTimeout(function() {
						var remaining = 140 - me.val().length;
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-1", dialog).toggle(remaining == 1);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-1", dialog).toggle(remaining == -1);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-50", dialog).toggle(remaining < -1);
						$(".pluck-twitter-invite-counter-wrapper", dialog).toggle(remaining < 50);
					}, 500);
				});

				$(".pluck-twitter-invite-submit", dialog).click(function() {
					var form = $(".pluck-twitter-invite-form", dialog);
					var tweet = $('textarea', form).val();
					tweet = $.trim(tweet);
					if (tweet.length > 140) return false;

					$('.pluck-error-message', form).hide();
					var form_top = $(this).parents('div.pluck-twitter-invite-dialog');
					pluckAppProxy.displayWait($('.pluck-twitter-invite-wait', form_top));
					var params = { contentType: "Json", plckAction: "sendTweet", plckTweet: tweet };
					pluckAppProxy.callApp("pluck/social/twitter/actions.app", params, function(data) {
						$('.pluck-twitter-invite-wait', form_top).hide();
						data = eval('(' + data + ')');
						if (data.success) {
							pluckAppProxy.fadeOut(dialog);
						} else {
							$(".pluck-error-message", dialog).hide();
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-twitter-invite-tweet-error", dialog).show();
						}
					});
					return false;
				});

				$(".pluck-twitter-invite-cancel", dialog).click(function() {
					$("textarea", dialog).val($("input.pluck-twitter-invite-default-message", dialog).val());
					pluckAppProxy.fadeOut(dialog);
					return false;
				});
				pluckAppProxy.pluck_social_twitter_inviteDialog_link(parentId);
				if (twitterUrl) {
					var params = { contentType: "Json", plckAction: "shortenUrl", plckUrl: twitterUrl };
					pluckAppProxy.callApp("pluck/util/share/actions.app", params, function(data) {
						data = eval('(' + data + ')');
						if (data.success) {
							var defVal = $("input.pluck-twitter-invite-default-message", dialog).val();
							defVal = defVal + " " + data.shortUrl;
							$("input.pluck-twitter-invite-default-message", dialog).val(defVal);
						}
					});
				}
			};

			pluckAppProxy.pluck_social_twitter_inviteDialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-social-twitter-inviteDialog-set", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.pluck_social_twitter_inviteDialog_show($(this));
						return false;
					});
				});
			};
			pluckAppProxy.pluck_social_twitter_inviteDialog_show = function (obj) {
				var displayType = obj.attr("dialogdisplay");
				var img = $("img", obj);
				if (img.length > 0) {
					obj = img.eq(0);
				}

				var dialog = pluckAppProxy.pluck_find_dialog("twitterInvite", obj);
				if (!dialog) return;
				$('.pluck-error-message', dialog).hide();
				$("textarea", dialog).val($("input.pluck-twitter-invite-default-message", dialog).val());
				var remaining = 140 - $("textarea", dialog).val().length;
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-1", dialog).toggle(remaining == 1);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-1", dialog).toggle(remaining == -1);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-50", dialog).toggle(remaining < -1);
				$(".pluck-twitter-invite-counter-wrapper", dialog).toggle(remaining < 50);

				var offsets = "";
				if (displayType == "baseline") {
					offsets = { top: 9, left: (obj.width() + 10) * -1 };
				} else {
					offsets = { top: ($.browser.msie && $.browser.version < 8 ? dialog.outerHeight() : dialog.height()), left: Math.round((dialog.width() - obj.width()) / 2) };
				}
				pluckAppProxy.displayDialog(dialog, obj, offsets, function() {
					$("textarea", dialog).focus();
				});
			};
		}

		/**************************************
		 *
		 * pluck/social/linkedIn
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_linkedIn) === 'undefined') {
			pluckAppProxy.pluck_social_linkedIn_status = null;
			pluckAppProxy.pluck_social_linkedIn = function (opts) {
				opts = opts ? opts : {};
				pluckAppProxy.pluck_social_linkedIn_status = opts;
			};

			pluckAppProxy.pluck_social_linkedIn_startAuth = function(userKey, errorDiv, errorMsgDiv, callback) {
				pluckAppProxy.pluck_social_linkedIn_status.loginCallback = callback;
				var url = pluckAppProxy.baseUrl + "pluck/social/linkedIn/connect.app?plckUserKey=" + userKey;
				pluckAppProxy.pluck_social_linkedIn_status.loginWindow = open_window_centered(url, 750, 675);
				
				// make sure there's only one interval waiting for auth.
				if(pluckAppProxy.pluck_social_linkedIn_status.loginWindowCheckTimeout){
					clearTimeout(pluckAppProxy.pluck_social_linkedIn_status.loginWindowCheckTimeout);
				}				
				
				pluckAppProxy.pluck_social_linkedIn_status.loginWindowCheckTimeout = setTimeout(pluckAppProxy.pluck_social_linkedIn_authWindowCheck, 10);
			};

			pluckAppProxy.pluck_social_linkedIn_authWindowCheck = function(){
				if(!pluckAppProxy.pluck_social_linkedIn_status.loginWindow || pluckAppProxy.pluck_social_linkedIn_status.loginWindow.closed){
					// OK, window is closed.  Now fetch the user and see if he's actually connected to linkedIn or if he canceled
					pluckAppProxy.callApp("pluck/social/isUserConnectedToService", {"service": "LinkedIn"}, function(resp){
						pluckAppProxy.pluck_social_linkedIn_completeAuth(resp.toLowerCase() == "true");
					});
				}
				else{
					pluckAppProxy.pluck_social_linkedIn_status.loginWindowCheckTimeout = setTimeout(pluckAppProxy.pluck_social_linkedIn_authWindowCheck, 10);
				}
			};
			
			pluckAppProxy.pluck_social_linkedIn_completeAuth = function(success, errorCode, errorMessage) {
				if(pluckAppProxy.pluck_social_linkedIn_status.loginWindowCheckTimeout){
					clearTimeout(pluckAppProxy.pluck_social_linkedIn_status.loginWindowCheckTimeout);
					pluckAppProxy.pluck_social_linkedIn_status.loginWindowCheckTimeout = null;
				}
				
				if (pluckAppProxy.pluck_social_linkedIn_status.loginWindow) {
					try{
						pluckAppProxy.pluck_social_linkedIn_status.loginWindow.close();
					} catch (e) {}

					if (window.focus) {
						try {
					            window.focus();
						} catch (e) {}
					}
					pluckAppProxy.pluck_social_linkedIn_status.loginWindow = null;
				}
				var callback = pluckAppProxy.pluck_social_linkedIn_status.loginCallback;
				pluckAppProxy.pluck_social_linkedIn_status.loginCallback = null;
				if (callback) {
					callback(success, errorCode, errorMessage);
				}
			};

			// This is for use with backward compatibility to old twitter apps.
			window.linkedInAuthComplete = function(profileName, userKey) {
				pluckAppProxy.pluck_social_linkedIn_completeAuth(true);
			};
		}

		/**************************************
		 *
		 * pluck/social/linkedIn/inviteDialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_linkedIn_inviteDialog) === 'undefined') {
			pluckAppProxy.pluck_social_linkedIn_inviteDialog = function (dialogId, parentId, linkedInUrl) {
				pluckAppProxy.pluck_dialog_register("linkedInInvite", parentId, dialogId);
				pluckAppProxy.registerDialog(dialogId, function(id) {
				});

				var dialog = $(dialogId);
				var lastKeyTimeout = null;
				$("textarea", dialog).keyup(function() {
					if (lastKeyTimeout) clearTimeout(lastKeyTimeout);
					var me = $(this);
					lastKeyTimeout = setTimeout(function() {
						var remaining = 1000 - me.val().length;
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-1", dialog).toggle(remaining == 1);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-1", dialog).toggle(remaining == -1);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-50", dialog).toggle(remaining < -1);
						$(".pluck-linkedIn-invite-counter-wrapper", dialog).toggle(remaining < 50);
					}, 500);
				});

				$(".pluck-linkedIn-invite-submit", dialog).click(function() {
					var form = $(".pluck-linkedIn-invite-form", dialog);
					var message = $('textarea', form).val();
					message = $.trim(message);
					if (message.length > 1000) return false;

					$('.pluck-error-message', form).hide();
					var form_top = $(this).parents('div.pluck-linkedIn-invite-dialog');
					pluckAppProxy.displayWait($('.pluck-linkedIn-invite-wait', form_top));
					var params = { contentType: "Json", plckAction: "sendLinkedIn", plckMessage: message };
					pluckAppProxy.callApp("pluck/social/linkedIn/actions.app", params, function(data) {
						$('.pluck-linkedIn-invite-wait', form_top).hide();
						data = eval('(' + data + ')');
						if (data.success) {
							pluckAppProxy.fadeOut(dialog);
						} else {
							$(".pluck-error-message", dialog).hide();
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-linkedIn-invite-tweet-error", dialog).show();
						}
					});
					return false;
				});

				$(".pluck-linkedIn-invite-cancel", dialog).click(function() {
					$("textarea", dialog).val($("input.pluck-linkedIn-invite-default-message", dialog).val());
					pluckAppProxy.fadeOut(dialog);
					return false;
				});
				pluckAppProxy.pluck_social_linkedIn_inviteDialog_link(parentId);
				if (linkedInUrl) {
					var params = { contentType: "Json", plckAction: "shortenUrl", plckUrl: linkedInUrl };
					pluckAppProxy.callApp("pluck/util/share/actions.app", params, function(data) {
						data = eval('(' + data + ')');
						if (data.success) {
							var defVal = $("input.pluck-linkedIn-invite-default-message", dialog).val();
							defVal = defVal + " " + data.shortUrl;
							$("input.pluck-linkedIn-invite-default-message", dialog).val(defVal);
						}
					});
				}
			};

			pluckAppProxy.pluck_social_linkedIn_inviteDialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-social-linkedIn-inviteDialog-set", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.pluck_social_linkedIn_inviteDialog_show($(this));
						return false;
					});
				});
			};
			pluckAppProxy.pluck_social_linkedIn_inviteDialog_show = function (obj) {
				var displayType = obj.attr("dialogdisplay");
				var img = $("img", obj);
				if (img.length > 0) {
					obj = img.eq(0);
				}

				var dialog = pluckAppProxy.pluck_find_dialog("linkedInInvite", obj);
				if (!dialog) return;
				$('.pluck-error-message', dialog).hide();
				$("textarea", dialog).val($("input.pluck-linkedIn-invite-default-message", dialog).val());
				var remaining = 1000 - $("textarea", dialog).val().length;
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-1", dialog).toggle(remaining == 1);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-1", dialog).toggle(remaining == -1);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-50", dialog).toggle(remaining < -1);
				$(".pluck-linkedIn-invite-counter-wrapper", dialog).toggle(remaining < 50);

				var offsets = "";
				if (displayType == "baseline") {
					offsets = { top: 9, left: (obj.width() + 10) * -1 };
				} else {
					offsets = { top: ($.browser.msie && $.browser.version < 8 ? dialog.outerHeight() : dialog.height()), left: Math.round((dialog.width() - obj.width()) / 2) };
				}
				pluckAppProxy.displayDialog(dialog, obj, offsets, function() {
					$("textarea", dialog).focus();
				});
			};
		}

		/**************************************
		 *
		 * pluck/social/syndication
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_syndication) === 'undefined') {
			pluckAppProxy.pluck_social_syndication = function (htmlId, parentId, params) {
				var top = $(htmlId);
				var parent = null;
				if (parentId && parentId != "#") {
					parent = $(parentId);
					if (parent.length == 0) parent = null;
				}
				if (!parent) parent = $("body");

				$(".pluck-social-syndication-facebook-connect", top).click(function() {
					if (!$(this).hasClass("pluck-social-syndication-facebook-connect")) return true;
					if ($(this).is(':checked')) {
						pluckAppProxy.closeDialogs();
						pluckAppProxy.displayWait($(".pluck-social-syndication-facebook-wait", parent));
						pluckAppProxy.ensureOnScreen($(".pluck-social-syndication-facebook-wait", parent));
						pluckAppProxy.pluck_social_facebook_init(function() {
							pluckAppProxy.displayWait($(".pluck-social-syndication-facebook-connect-confirm", parent));
							$(".pluck-social-syndication-facebook-wait", parent).hide();
							pluckAppProxy.ensureOnScreen($(".pluck-social-syndication-facebook-connect-confirm", parent));
						});
						return false;
					}
					return true;
				});

				$(".pluck-social-syndication-linkedIn-connect", top).click(function() {
					if (!$(this).hasClass("pluck-social-syndication-linkedIn-connect")) return true;
					if ($(this).is(':checked')) {
						pluckAppProxy.closeDialogs();
						pluckAppProxy.displayWait($(".pluck-social-syndication-linkedIn-connect-confirm", parent));
						pluckAppProxy.ensureOnScreen($(".pluck-social-syndication-linkedIn-connect-confirm", parent));
						return false;	
					}
					return true;
				});

				$(".pluck-social-syndication-twitter-connect", top).click(function() {
					if (!$(this).hasClass("pluck-social-syndication-twitter-connect")) return true;
					if ($(this).is(':checked')) {
						pluckAppProxy.closeDialogs();
						pluckAppProxy.displayWait($(".pluck-social-syndication-twitter-connect-confirm", parent));
						pluckAppProxy.ensureOnScreen($(".pluck-social-syndication-twitter-connect-confirm", parent));
						return false;	
					}
					return true;
				});

				pluckAppProxy.registerCssCallback("pluck/social/social.css", function() {
					top.show();
				});
			};
		}

		/**************************************
		 *
		 * pluck/social/syndication/messages
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_syndication_messages) === 'undefined') {
			pluckAppProxy.pluck_social_syndication_messages = function (htmlId, parentId, params) {
				var top = $(htmlId);
				var parent = null;
				if (parentId && parentId != "#") {
					parent = $(parentId);
					if (parent.length == 0) parent = null;
				}
				if (!parent) parent = $("body");

				$(".pluck-social-syndication-linkedIn-yes", top).click(function() {
					$(".pluck-social-syndication-linkedIn-connect-confirm", top).hide();
					pluckAppProxy.displayWait($(".pluck-social-syndication-linkedIn-wait", top));
					pluckAppProxy.pluck_social_linkedIn_startAuth(params.plckUserId, null, null, function(success, msg, status) {
						$(".pluck-social-syndication-linkedIn-wait", top).hide();
						var cb = $(".pluck-social-syndication-linkedIn", parent);
						if (success) {
							cb.removeClass("pluck-social-syndication-linkedIn-connect");
							cb.attr("checked", true);
							pluckAppProxy.ensureOnScreen(cb);
						} else {
							cb.removeAttr("checked");
							pluckAppProxy.displayWait($(".pluck-social-syndication-linkedIn-connect-error", top));
						}
					});
					return false;
				});

				$(".pluck-social-syndication-linkedIn-no", top).click(function() {
					$(".pluck-social-syndication-linkedIn-connect-confirm", top).hide();
					var cb = $(".pluck-social-syndication-linkedIn", parent);
					pluckAppProxy.ensureOnScreen(cb);
					return false;
				});

				$(".pluck-social-syndication-linkedIn-connect-error a", top).click(function() {
					$(".pluck-social-syndication-linkedIn-connect-error", top).hide();
					var cb = $(".pluck-social-syndication-linkedIn", parent);
					pluckAppProxy.ensureOnScreen(cb);
					return false;
				});

				$(".pluck-social-syndication-twitter-yes", top).click(function() {
					$(".pluck-social-syndication-twitter-connect-confirm", top).hide();
					pluckAppProxy.displayWait($(".pluck-social-syndication-twitter-wait", top));
					pluckAppProxy.pluck_social_twitter_startAuth(params.plckUserId, null, null, function(success, msg, status) {
						$(".pluck-social-syndication-twitter-wait", top).hide();
						var cb = $(".pluck-social-syndication-twitter", parent);
						if (success) {
							cb.removeClass("pluck-social-syndication-twitter-connect");
							cb.attr("checked", true);
							pluckAppProxy.ensureOnScreen(cb);
						} else {
							cb.removeAttr("checked");
							pluckAppProxy.displayWait($(".pluck-social-syndication-twitter-connect-error", top));
						}
					});
					return false;
				});

				$(".pluck-social-syndication-twitter-no", top).click(function() {
					$(".pluck-social-syndication-twitter-connect-confirm", top).hide();
					var cb = $(".pluck-social-syndication-twitter", parent);
					pluckAppProxy.ensureOnScreen(cb);
					return false;
				});

				$(".pluck-social-syndication-twitter-connect-error a", top).click(function() {
					$(".pluck-social-syndication-twitter-connect-error", top).hide();
					var cb = $(".pluck-social-syndication-twitter", parent);
					pluckAppProxy.ensureOnScreen(cb);
					return false;
				});

				$(".pluck-social-syndication-facebook-yes", top).click(function(e) {
					$(".pluck-social-syndication-facebook-connect-confirm", top).hide();
					pluckAppProxy.displayWait($(".pluck-social-syndication-facebook-wait", top));

					// work around a bug in Facebook's code that causes our calls ot it to throw security exceptions in IE.
					// tell jQuery to prevent from redirecting the user to "#" right away, so we don't have to rely on return false down below to do it...
					e.preventDefault();
					try{
						pluckAppProxy.pluck_social_facebook_connect(top, function(uid) {
							var cmd = new PluckSDK.UpdateUserExternalIdActionRequest({UserKey: new PluckSDK.UserKey({Key: params.plckUserId}), ExternalSiteName: "Facebook", ExternalSiteUserId: uid });
							PluckSDK.SendRequests(cmd, function(responses) {
								$(".pluck-social-syndication-facebook-wait", top).hide();
								var cb = $(".pluck-social-syndication-facebook", parent);
								cb.removeClass("pluck-social-syndication-facebook-connect");
								cb.attr("checked", true);
								pluckAppProxy.ensureOnScreen(cb);
							});
						}, function() {
							$(".pluck-social-syndication-facebook-wait", top).hide();
							var cb = $(".pluck-social-syndication-facebook", parent);
							cb.removeAttr("checked");
							pluckAppProxy.displayWait($(".pluck-social-syndication-facebook-connect-error", top));
						});
					}
					catch(exception){
					}

					return false;
				});
				
				$(".pluck-social-syndication-facebook-no", top).click(function() {
					$(".pluck-social-syndication-facebook-connect-confirm", top).hide();
					var cb = $(".pluck-social-syndication-facebook", parent);
					pluckAppProxy.ensureOnScreen(cb);
					return false;
				});

				$(".pluck-social-syndication-facebook-connect-error a", top).click(function() {
					$(".pluck-social-syndication-facebook-connect-error", top).hide();
					var cb = $(".pluck-social-syndication-facebook", parent);
					pluckAppProxy.ensureOnScreen(cb);
					return false;
				});

				pluckAppProxy.registerCssCallback("pluck/social/social.css", function() {
					top.show();
				});
			};

			pluckAppProxy.social_syndicate = function(parentHtmlId, message, body, url, fbCallToAction, successCallback, failureCallback, template, contentType, parentContentType, optionChosen) {
				var success = true;
				var cleanUp = function() {
					if (success && successCallback) {
						successCallback();
					} else if (failureCallback) {
						failureCallback();
					} else if (successCallback) {
						successCallback();
					}
				};


				if (!message) {
					cleanUp();
					return false;
				}
				var parent = null;
				if (parentHtmlId && parentHtmlId != "#") {
					if (parentHtmlId.indexOf("#") != 0) parentHtmlId = "#" + parentHtmlId;
					parent = $(parentHtmlId);
					if (parent.length == 0) parent = null;
				}
				if (!parent) parent = $("body");
				var toggles = $(".pluck-social-syndication", parent);
				if (toggles.length != 1) {
					cleanUp();
					return false;
				}
	
				var messages = $(".pluck-social-syndication-messages", parent);
				if (messages.length != 1) {
					cleanUp();
					return false;
				}
				
				url = url ? url : "";
				body = body ? body : "";
				fbCallToAction = fbCallToAction ? fbCallToAction : ""
				var sendTwitter = function() {
					if ($(".pluck-social-syndication-twitter", toggles).is(":checked")) {
						pluckAppProxy.displayWait($(".pluck-social-syndication-twitter-wait", messages));
						var cmd = new PluckSDK.SendTwitterMessageActionRequest({Message: message, Url: url });
						if (template) cmd.Template = template;
						if (contentType) cmd.ContentTypes = contentType.split(/\s*,\s*/);
						if (parentContentType) cmd.ParentContentTypes = parentContentType.split(/\s*,\s*/);
						if (optionChosen) cmd.ContentTypes = (cmd.ContentTypes || []).concat(optionChosen.split(/\s*,\s*/));
						PluckSDK.SendRequests(cmd, function(responses) {
							var data = responses[0];
							$(".pluck-social-syndication-twitter-wait", messages).hide();
							if (data.ResponseStatus.StatusCode != PluckSDK.ResponseStatusCode.OK) {
								var dialog = $(".pluck-social-syndication-twitter-syndicate-error", messages);
								var btn = $("a", dialog);
								btn.unbind();
								btn.click(function() {
									dialog.hide();
									sendLinkedIn();
								});
								pluckAppProxy.displayWait(dialog);
								success = false;
							} else {
								sendLinkedIn();
							}
						});
					} else {
						sendLinkedIn();
					}
				};

				var sendLinkedIn = function() {
					if ($(".pluck-social-syndication-linkedIn", toggles).is(":checked")) {
						pluckAppProxy.displayWait($(".pluck-social-syndication-linkedIn-wait", messages));
						var cmd = new PluckSDK.SendLinkedInMessageActionRequest({Message: message, Url: url });
						if (template) cmd.Template = template;
						if (contentType) cmd.ContentTypes = contentType.split(/\s*,\s*/);
						if (parentContentType) cmd.ParentContentTypes = parentContentType.split(/\s*,\s*/);
						if (optionChosen) cmd.ContentTypes = (cmd.ContentTypes || []).concat(optionChosen.split(/\s*,\s*/));
						PluckSDK.SendRequests(cmd, function(responses) {
							var data = responses[0];
							$(".pluck-social-syndication-linkedIn-wait", messages).hide();
							if (data.ResponseStatus.StatusCode != PluckSDK.ResponseStatusCode.OK) {
								var dialog = $(".pluck-social-syndication-linkedIn-syndicate-error", messages);
								var btn = $("a", dialog);
								btn.unbind();
								btn.click(function() {
									dialog.hide();
									sendFacebook();
								});
								pluckAppProxy.displayWait(dialog);
								success = false;
							} else {
								sendFacebook();
							}
						});
					} else {
						sendFacebook();
					}
				};

				var sendFacebook = function() {
					if ($(".pluck-social-syndication-facebook", toggles).is(":checked")) {
						pluckAppProxy.displayWait($(".pluck-social-syndication-facebook-wait", top));
						var rawBody = $.trim(body.replace(/(<([^>]+)>)/ig, ""));
						
						var fbParams = {};
						fbParams.url = url;
						
						if (fbCallToAction && typeof(fbCallToAction) !== "string") {
							fbParams = $.extend(fbParams, fbCallToAction);
						} else {
							fbParams.title = message;
							fbParams.description = "";
							fbParams.actions = [{ name: fbCallToAction, link: url}];
						}
						if (contentType) fbParams.contentType = contentType;
						if (parentContentType) fbParams.parentContentType = parentContentType;
						if (optionChosen) fbParams.contentType = (fbParams.contentType ? fbParams.contentType + "," : "") + optionChosen;
						
						pluckAppProxy.pluck_social_facebook_submitFeedStory(rawBody, fbParams,
							function() {
								$(".pluck-social-syndication-facebook-wait", top).hide();
								cleanUp();
							}, function() {
								$(".pluck-social-syndication-facebook-wait", top).hide();
								var dialog = $(".pluck-social-syndication-facebook-syndicate-error", messages);
								var btn = $("a", dialog);
								btn.unbind();
								btn.click(function() {
									dialog.hide();
									cleanUp();
								});
								pluckAppProxy.displayWait(dialog);
								success = false;
							}
						);
					} else {
						cleanUp();
					}
				}

				sendTwitter();
				return true;
			};
		}

		/**************************************
		 *
		 * pluck/social/syndicateOnDemand
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_syndicateOnDemand) === 'undefined') {
			pluckAppProxy.pluck_social_syndicateOnDemand = function (htmlId, dialogId, parentId, params) {
				var top = $(htmlId);
				var dialog = $(dialogId);
				var parent = null;
				if (parentId && parentId != "#") {
					parent = $(parentId);
					if (parent.length == 0) parent = null;
				}
				if (!parent) parent = $("body");
				top.data("params", params);

				var dialogInit = false;
				var inProgress = false;
				var initDialog = function() {
					if (dialogInit) return;
					dialogInit = true;
					dialog.detach();
					$("body").append(dialog);

					var cmds = [];
					var userKey = new PluckSDK.UserKey({Key: params.userKey });
					
					var facebook = $(".pluck-social-syndicateOnDemand-dialog-facebook", dialog);
					if (facebook.hasClass("pluck-social-syndicateOnDemand-dialog-auth")) {
						var fbconnected = $(".pluck-social-syndicateOnDemand-dialog-connected", facebook);
						FB.getLoginStatus(function(response) {
							var session = pluckAppProxy.parseFacebookSession(response);
							if (!session) {
								fbconnected.html(params.NotLoggedInFacebook);
							} else if (session.uid != params.plckFacebookUserId) {
								FB.api('/me/permissions', function (response) {
								    var allPerms = false;
								    if (response && response.data) {
								        var permissions = response.data.shift();
								        if (permissions) {
								            allPerms = true;
								            for (var i in pluckAppProxy.pluck_social_facebook_requiredPerms) {
								                var p = pluckAppProxy.pluck_social_facebook_requiredPerms[i];
								                if (!permissions[p] || permissions[p] == 0) {
								                    allPerms = false;
								                    break;
								                }
								            }
								        }
								    }

								    if (!allPerms) {
								        facebook.removeClass("pluck-social-syndicateOnDemand-dialog-auth");
								        $("a.pluck-social-syndicateOnDemand-dialog-checkbox", facebook).removeClass("pluck-social-syndicateOnDemand-dialog-checked");
								        return;
								    }
								    pluckAppProxy.callApp("pluck/social/facebook/screenname", { access_token: session.access_token }, function (data) {
								        data = JSON.parse(data);
								        var val = params.ConnectedAsFacebook.replace("%name%", data.facebookName);
								        fbconnected.html(val);
								    });
								});
							} else {
								pluckAppProxy.callApp("pluck/social/facebook/screenname", { access_token: session.access_token }, function(data) {
									data = JSON.parse(data);
									var val = params.ConnectedAsFacebook.replace("%name%", data.facebookName);
									fbconnected.html(val);
								});
							}
						});
					}

					var twitter = $(".pluck-social-syndicateOnDemand-dialog-twitter", dialog);
					if (twitter.hasClass("pluck-social-syndicateOnDemand-dialog-auth")) {
						var twconnected = $(".pluck-social-syndicateOnDemand-dialog-connected", twitter);
						PluckSDK.SendRequests(new PluckSDK.TwitterScreenNameRequest({ UserKey: userKey }), function(responses) {
							var data = responses[0];
							var val = "";
							if (data.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
								val = params.ConnectedAsTwitter.replace("%name%", data.ScreenName);
								twconnected.html(val).show();
							}
							else{
								cleanUpConnect();
								twitter.removeClass("pluck-social-syndicateOnDemand-dialog-auth");
								$(".pluck-social-syndicateOnDemand-dialog-connect", twitter).show();
								setStatus($("a.pluck-social-syndicateOnDemand-dialog-checkbox", twitter), false);
							}

						});
					}

					var linkedIn = $(".pluck-social-syndicateOnDemand-dialog-linkedIn", dialog);
					if (linkedIn.hasClass("pluck-social-syndicateOnDemand-dialog-auth")) {
						var liconnected = $(".pluck-social-syndicateOnDemand-dialog-connected", linkedIn);
						PluckSDK.SendRequests(new PluckSDK.LinkedInProfileNameRequest({ UserKey: userKey }), function(responses) {
							var data = responses[0];
							var val = params.ConnectedFailLinkedIn;
							if (data.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
								val = params.ConnectedAsLinkedIn.replace("%name%", data.ProfileName);
								liconnected.html(val).show();
							}
							else{
								cleanUpConnect();
								linkedIn.removeClass("pluck-social-syndicateOnDemand-dialog-auth");
								$(".pluck-social-syndicateOnDemand-dialog-connect", linkedIn).show();
								setStatus($("a.pluck-social-syndicateOnDemand-dialog-checkbox", linkedIn), false);
							}
						});
					}
				};

				var updateTextboxClass = function() {
					var checkLength = false;
					$(".pluck-social-syndicateOnDemand-dialog-checked", dialog).each(function() {
						if (checkLength) return;
						var p = $(this).parent();
						if (p.hasClass("pluck-social-syndicateOnDemand-dialog-twitter") ||
						    p.hasClass("pluck-social-syndicateOnDemand-dialog-linkedIn")) {
							checkLength = true;
						}
					});
					var textarea = $(".pluck-social-syndicateOnDemand-dialog-message textarea", dialog);
					var clz = "pluck-social-syndicateOnDemand-dialog-oversize";
					if (checkLength) {
						var length = textarea.val().length;
						if (length > 119) {
							textarea.addClass(clz);
						} else {
							textarea.removeClass(clz);
						}
					} else {
						textarea.removeClass(clz);
					}
				};

				var connectFacebook = function() {
					var facebook = $(".pluck-social-syndicateOnDemand-dialog-facebook", dialog);
					try {
						pluckAppProxy.pluck_social_facebook_connect(top, function(uid, session) {
							var cmds = [];
							var ukey = new PluckSDK.UserKey({Key: params.plckUserId});
							cmds.push(new PluckSDK.UpdateUserExternalIdActionRequest({UserKey: ukey, ExternalSiteName: "Facebook", ExternalSiteUserId: uid }));
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "FacebookMyComments", Value: "true" }));
							PluckSDK.SendRequests(cmds, function(responses) { });
							pluckAppProxy.callApp("pluck/social/facebook/screenname", { access_token: session.access_token }, function(data) {
								data = JSON.parse(data);
								var val = params.ConnectedAsFacebook.replace("%name%", data.facebookName);
								$(".pluck-social-syndicateOnDemand-dialog-connected", facebook).html(val);
								$(".pluck-social-syndicateOnDemand-dialog-checkbox", facebook).addClass("pluck-social-syndicateOnDemand-dialog-checked pluck-social-syndicateOnDemand-dialog-initChecked");
								facebook.addClass("pluck-social-syndicateOnDemand-dialog-auth");
								cleanUpConnect();
								var activityObj = {parentId: parentId, htmlId: htmlId, service: "Facebook" };
								pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandConnect", activityObj);

							});
						}, function() {
							cleanUpConnect();
						});
					} catch(e) {
						cleanUpConnect();
					}

					return false;
				};

				var sendFacebook = function(info) {
					var facebook = $(".pluck-social-syndicateOnDemand-dialog-facebook", dialog);
					var lbl = $(".pluck-social-syndicateOnDemand-dialog-progress", facebook);
					if ($(".pluck-social-syndicateOnDemand-dialog-checked", facebook).length > 0) {
						facebook.data("info", info);
						lbl.html(params.ProgressSharing);

						var bdy = info.body ? info.body : "";
						var rawBody = $.trim(bdy.replace(/(<([^>]+)>)/ig, ""));
						var fbParams = {};
						fbParams.url = info.url;
						fbParams.title = info.fbTitle;
						fbParams.description = rawBody;
						if (info.fbCallToAction) {
							fbParams.actions = [{ name: info.fbCallToAction, link: info.url}];
						}
						if (info.contentType) fbParams.contentType = info.contentType;
						if (info.parentContentType) fbParams.parentContentType = info.parentContentType;
						if (info.optionChosen) fbParams.contentType = (fbParams.contentType ? fbParams.contentType + "," : "") + info.optionChosen;
						pluckAppProxy.pluck_social_facebook_submitFeedStory(info.message, fbParams,
							function() {
								info.facebookStatus = "success";
								lbl.html(params.ProgressSuccess);
								sendTwitter(info);
							}, function() {
								facebook.addClass("pluck-social-syndicateOnDemand-dialog-failure");
							}
						);
					} else {
						sendTwitter(info);
					}
				}

				var connectTwitter = function() {
					var twitter = $(".pluck-social-syndicateOnDemand-dialog-twitter", dialog);
					pluckAppProxy.pluck_social_twitter_startAuth(params.plckUserId, null, null, function(success, msg, status) {
						if (success) {
							var ukey = new PluckSDK.UserKey({Key: params.plckUserId});
							var cmds = [];
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "TweetMyComments", Value: "true" }));
							cmds.push(new PluckSDK.TwitterScreenNameRequest({ UserKey: ukey }));
							PluckSDK.SendRequests(cmds, function(responses) {
								var data = responses[1];
								var val = params.ConnectedFailTwitter;
								if (data.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
									val = params.ConnectedAsTwitter.replace("%name%", data.ScreenName);
								}
								$(".pluck-social-syndicateOnDemand-dialog-connected", twitter).html(val);
								$(".pluck-social-syndicateOnDemand-dialog-checkbox", twitter).addClass("pluck-social-syndicateOnDemand-dialog-checked pluck-social-syndicateOnDemand-dialog-initChecked");
								twitter.addClass("pluck-social-syndicateOnDemand-dialog-auth");
								cleanUpConnect();
								var activityObj = {parentId: parentId, htmlId: htmlId, service: "Twitter" };
								pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandConnect", activityObj);

							});
						} else {
							cleanUpConnect();
						}
					});
					return false;
				};

				var sendTwitter = function(info) {
					var twitter = $(".pluck-social-syndicateOnDemand-dialog-twitter", dialog);
					var lbl = $(".pluck-social-syndicateOnDemand-dialog-progress", twitter);
					if ($(".pluck-social-syndicateOnDemand-dialog-checked", twitter).length > 0) {
						twitter.data("info", info);
						lbl.html(params.ProgressSharing);
						var cmd = new PluckSDK.SendTwitterMessageActionRequest({Message: info.message, Url: info.url });
						if (info.template) cmd.Template = info.template;
						
						if (info.contentType) cmd.ContentTypes = info.contentType.split(/\s*,\s*/);
						if (info.parentContentType) cmd.ParentContentTypes = info.parentContentType.split(/\s*,\s*/);
						if (info.optionChosen) cmd.ContentTypes = (cmd.ContentTypes || []).concat(info.optionChosen.split(/\s*,\s*/));
						
						PluckSDK.SendRequests(cmd, function(responses) {
							var data = responses[0];
							if (data.ResponseStatus.StatusCode != PluckSDK.ResponseStatusCode.OK) {
								twitter.addClass("pluck-social-syndicateOnDemand-dialog-failure");
							} else {
								info.twitterStatus = "success";
								lbl.html(params.ProgressSuccess);
								sendLinkedIn(info);
							}
						});
					} else {
						sendLinkedIn(info);
					}
				};

				var connectLinkedIn = function() {
					var linkedIn = $(".pluck-social-syndicateOnDemand-dialog-linkedIn", dialog);
					pluckAppProxy.pluck_social_linkedIn_startAuth(params.plckUserId, null, null, function(success, msg, status) {
						if (success) {
							var ukey = new PluckSDK.UserKey({Key: params.plckUserId});
							var cmds = [];
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "LinkedInMyComments", Value: "true" }));
							cmds.push(new PluckSDK.LinkedInProfileNameRequest({ UserKey: ukey }));
							PluckSDK.SendRequests(cmds, function(responses) {
								var data = responses[1];
								var val = params.ConnectedFailLinkedIn;
								if (data.ResponseStatus.StatusCode == PluckSDK.ResponseStatusCode.OK) {
									val = params.ConnectedAsLinkedIn.replace("%name%", data.ProfileName);
								}
								$(".pluck-social-syndicateOnDemand-dialog-connected", linkedIn).html(val);
								$(".pluck-social-syndicateOnDemand-dialog-checkbox", linkedIn).addClass("pluck-social-syndicateOnDemand-dialog-checked pluck-social-syndicateOnDemand-dialog-initChecked");
								linkedIn.addClass("pluck-social-syndicateOnDemand-dialog-auth");
								cleanUpConnect();

								var activityObj = {parentId: parentId, htmlId: htmlId, service: "LinkedIn" };
								pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandConnect", activityObj);
							});
						} else {
							cleanUpConnect();
						}
					});
					return false;
				};

				var sendLinkedIn = function(info) {
					var linkedIn = $(".pluck-social-syndicateOnDemand-dialog-linkedIn", dialog);
					var lbl = $(".pluck-social-syndicateOnDemand-dialog-progress", linkedIn);
					if ($(".pluck-social-syndicateOnDemand-dialog-checked", linkedIn).length > 0) {
						linkedIn.data("info", info);
						lbl.html(params.ProgressSharing);
						var cmd = new PluckSDK.SendLinkedInMessageActionRequest({Message: info.message, Url: info.url });
						if (info.template) cmd.Template = info.template;
						
						if (info.contentType) cmd.ContentTypes = info.contentType.split(/\s*,\s*/);
						if (info.parentContentType) cmd.ParentContentTypes = info.parentContentType.split(/\s*,\s*/);
						if (info.optionChosen) cmd.ContentTypes = (cmd.ContentTypes || []).concat(info.optionChosen.split(/\s*,\s*/));

						PluckSDK.SendRequests(cmd, function(responses) {
							var data = responses[0];
							if (data.ResponseStatus.StatusCode != PluckSDK.ResponseStatusCode.OK) {
								linkedIn.addClass("pluck-social-syndicateOnDemand-dialog-failure");
							} else {
								info.linkedInStatus = "success";
								lbl.html(params.ProgressSuccess);
								cleanUp(info);
							}
						});
					} else {
						cleanUp(info);
					}
				};

				var cleanUpConnect = function() {
					inProgress = false;
					$(".pluck-social-syndicateOnDemand-dialog-service", dialog).removeClass("pluck-social-syndicateOnDemand-dialog-connecting");
					$("textarea", dialog).removeAttr("disabled");
					var btn = $("a.pluck-social-syndicateOnDemand-dialog-syndicate", dialog);
					if ($("a.pluck-social-syndicateOnDemand-dialog-checked", dialog).length == 0) {
						btn.addClass("pluck-social-syndicateOnDemand-dialog-nosyndicate");
					} else {
						btn.removeClass("pluck-social-syndicateOnDemand-dialog-nosyndicate");
					}
					$(".pluck-social-syndicateOnDemand-dialog-controls", dialog).css("visibility", "visible");
				};

				var cleanUp = function(info) {
					var ukey = new PluckSDK.UserKey({Key: params.plckUserId});
					var cmds = [];
					if (info.facebookStatus == "success") {
						var facebook = $(".pluck-social-syndicateOnDemand-dialog-facebook", dialog);
						var cb = $(".pluck-social-syndicateOnDemand-dialog-checkbox", facebook);
						var isChecked = cb.hasClass("pluck-social-syndicateOnDemand-dialog-checked");
						var initChecked = cb.hasClass("pluck-social-syndicateOnDemand-dialog-initChecked");
						if (isChecked && !initChecked) {
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "FacebookMyComments", Value: "true" }));
						} else if (!isChecked && initChecked) {
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "FacebookMyComments", Value: "false" }));
						}
					}
					if (info.twitterStatus == "success") {
						var twitter = $(".pluck-social-syndicateOnDemand-dialog-twitter", dialog);
						var cb = $(".pluck-social-syndicateOnDemand-dialog-checkbox", twitter);
						var isChecked = cb.hasClass("pluck-social-syndicateOnDemand-dialog-checked");
						var initChecked = cb.hasClass("pluck-social-syndicateOnDemand-dialog-initChecked");
						if (isChecked && !initChecked) {
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "TweetMyComments", Value: "true" }));
						} else if (!isChecked && initChecked) {
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "TweetMyComments", Value: "false" }));
						}
					}
					if (info.linkedInStatus == "success") {
						var linkedIn = $(".pluck-social-syndicateOnDemand-dialog-linkedIn", dialog);
						var cb = $(".pluck-social-syndicateOnDemand-dialog-checkbox", linkedIn);
						var isChecked = cb.hasClass("pluck-social-syndicateOnDemand-dialog-checked");
						var initChecked = cb.hasClass("pluck-social-syndicateOnDemand-dialog-initChecked");
						if (isChecked && !initChecked) {
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "LinkedInMyComments", Value: "true" }));
						} else if (!isChecked && initChecked) {
							cmds.push(new PluckSDK.UpdateUserExtendedPrefActionRequest({ UserKey: ukey, Key: "LinkedInMyComments", Value: "false" }));
						}
					}
					if (cmds.length) {
						PluckSDK.SendRequests(cmds, function() {} );
					}
					window.setTimeout(function() {
						var syndicate = top.data("syndicate");
						top.removeData("syndicate");
						top.addClass("pluck-social-syndicateOnDemand-disabled");
						if (params.plckSyndicateOnDemandVisualMode == "oninit") {
							top.hide();
						}

						pluckAppProxy.fadeOut(dialog, function() {
							$(".pluck-social-syndicateOnDemand-dialog-service", dialog).removeClass("pluck-social-syndicateOnDemand-dialog-sharing");
							$("textarea", dialog).removeAttr("disabled");
							$(".pluck-social-syndicateOnDemand-dialog-controls", dialog).css("visibility", "visible");
						});
						inProgress = false;

						var activityObj = {parentId: parentId, htmlId: htmlId };
						activityObj.message = syndicate.message;
						if (syndicate.body) activityObj.body = syndicate.body;
						if (syndicate.url) activityObj.url = syndicate.url;
						if (syndicate.fbCallToAction) activityObj.fbCallToAction = syndicate.fbCallToAction;
						if (syndicate.template) activityObj.template = syndicate.template;
						if (syndicate.contentType) activityObj.contentType = syndicate.contentType;
						if (syndicate.parentContentType) activityObj.parentContentType = syndicate.parentContentType;
						if (syndicate.optionChosen) activityObj.optionChosen = syndicate.optionChosen;
						activityObj.facebookStatus = info.facebookStatus;
						activityObj.twitterStatus = info.twitterStatus;
						activityObj.linkedInStatus = info.linkedInStatus;
						pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandComplete", activityObj);
					}, 1000);
				};

				$("a.pluck-social-syndicateOnDemand-link", top).click(function() {
					var syndicate = top.data("syndicate");
					if (!syndicate) return false;
					initDialog();
					$("textarea", dialog).val(syndicate.message);
					updateTextboxClass();
					$(".pluck-social-syndicateOnDemand-dialog-counter", dialog).html(syndicate.message ? syndicate.message.length : 0);

					dialog.css("visibility", "hidden");
					dialog.show();

					var wrapper = $(".pluck-social-syndicateOnDemand-dialog-wrapper", dialog);

					var doc = $(document);
					var win = $(window);

					dialog.width(doc.width());
					dialog.height(doc.height());

					var left = ((win.width() - wrapper.outerWidth()) / 2) + doc.scrollLeft();
					var top1 = ((win.height() - wrapper.outerHeight()) / 2) + doc.scrollTop();

					wrapper.css("left", (left < 0 ? 0 : left) + "px");
					wrapper.css("top", (top1 < 0 ? 0 : top1) + "px");

					var workareaHeight = $(".pluck-social-syndicateOnDemand-dialog-workarea", wrapper).height();

					var modalClose = $(".pluck-social-syndicateOnDemand-dialog-modalClose", dialog);
					left = (win.width() - 26) + doc.scrollLeft();
					top1 = doc.scrollTop() + 10;
					modalClose.css("left", (left < 0 ? 0 : left) + "px");
					modalClose.css("top", (top1 < 0 ? 0 : top1) + "px");

					dialog.hide();
					dialog.css("visibility", "visible");
					pluckAppProxy.fadeIn(dialog, function() {
						$("textarea", dialog).focus();
						var activityObj = { parentId: parentId, htmlId: htmlId };
						pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandDialogRendered", activityObj);

					});
					return false;
				});

				dialog.keydown(function(event) {
					if (inProgress) return true;
					if (event.which == 27) { // return or tab
						event.stopPropagation();
						event.preventDefault();
						$("a.pluck-social-syndicateOnDemand-dialog-cancel", dialog).click();
						return false;
					}
					return true;
				});


				$("a.pluck-social-syndicateOnDemand-dialog-connect, a.pluck-social-syndicateOnDemand-dialog-connect-icon", dialog).click(function(e) {
					if (inProgress) return false;

					var service = $(this).parents(".pluck-social-syndicateOnDemand-dialog-service");
					inProgress = true;
					$("textarea", dialog).attr("disabled", "true");
					$(".pluck-social-syndicateOnDemand-dialog-controls", dialog).css("visibility", "hidden");
					$(".pluck-social-syndicateOnDemand-dialog-progress", service).html(params.ProgressConnecting);
					service.addClass("pluck-social-syndicateOnDemand-dialog-connecting");

					if (service.hasClass("pluck-social-syndicateOnDemand-dialog-facebook")) {
						// work around a bug in Facebook's code that causes our calls ot it to throw security exceptions in IE.
						// tell jQuery to prevent from redirecting the user to "#" right away, so we don't have to rely on return false down below to do it...
						e.preventDefault();
						connectFacebook();
					} else if (service.hasClass("pluck-social-syndicateOnDemand-dialog-twitter")) {
						connectTwitter();
					} else if (service.hasClass("pluck-social-syndicateOnDemand-dialog-linkedIn")) {
						connectLinkedIn();
					}

					return false;
				});

				var setStatus = function(link, enabled){
					var clz = "pluck-social-syndicateOnDemand-dialog-checked";
					if (!enabled) {
						link.removeClass(clz);
					}
					else {
						link.addClass(clz);
					}

					var btn = $("a.pluck-social-syndicateOnDemand-dialog-syndicate", dialog);
					if ($("a.pluck-social-syndicateOnDemand-dialog-checked", dialog).length == 0) {
						btn.addClass("pluck-social-syndicateOnDemand-dialog-nosyndicate");
					} else {
						btn.removeClass("pluck-social-syndicateOnDemand-dialog-nosyndicate");
					}
					updateTextboxClass();
					return false;					
				};

				$("a.pluck-social-syndicateOnDemand-dialog-checkbox", dialog).click(function() {
					if (inProgress) return false;
					var link = $(this);
					
					var clz = "pluck-social-syndicateOnDemand-dialog-checked";
					return setStatus(link, !link.hasClass(clz)); 
				});

				var lastKeyTimeout = null;
				$(".pluck-social-syndicateOnDemand-dialog-message textarea", dialog).keyup(function() {
					if (lastKeyTimeout) clearTimeout(lastKeyTimeout);
					var me = $(this);
					lastKeyTimeout = setTimeout(function() {
						var length = me.val().length;
						$(".pluck-social-syndicateOnDemand-dialog-counter", dialog).html(length);
						updateTextboxClass();
					}, 500);
				});

				$("a.pluck-social-syndicateOnDemand-dialog-syndicate", dialog).click(function() {
					if (inProgress) return false;
					if ($(this).hasClass("pluck-social-syndicateOnDemand-dialog-nosyndicate")) return false;

					var newMessage = $.trim($("textarea", dialog).val());
					if (newMessage.length == 0) {
						$(".pluck-social-syndicateOnDemand-dialog-message-error", dialog).show();
						return false;
					}
					$(".pluck-social-syndicateOnDemand-dialog-message-error", dialog).hide();
					$("textarea", dialog).attr("disabled", "true");
					$(".pluck-social-syndicateOnDemand-dialog-controls", dialog).css("visibility", "hidden");

					var facebook = $(".pluck-social-syndicateOnDemand-dialog-facebook", dialog);
					var lbl = $(".pluck-social-syndicateOnDemand-dialog-progress", facebook);
					if ($(".pluck-social-syndicateOnDemand-dialog-checked", facebook).length > 0) {
						lbl.html(params.ProgressPending);
					} else {
						lbl.html(params.ProgressNoConnect);
					}
					facebook.addClass("pluck-social-syndicateOnDemand-dialog-sharing");

					var twitter = $(".pluck-social-syndicateOnDemand-dialog-twitter", dialog);
					lbl = $(".pluck-social-syndicateOnDemand-dialog-progress", twitter);
					if ($(".pluck-social-syndicateOnDemand-dialog-checked", twitter).length > 0) {
						lbl.html(params.ProgressPending);
					} else {
						lbl.html(params.ProgressNoConnect);
					}
					twitter.addClass("pluck-social-syndicateOnDemand-dialog-sharing");

					var linkedIn = $(".pluck-social-syndicateOnDemand-dialog-linkedIn", dialog);
					lbl = $(".pluck-social-syndicateOnDemand-dialog-progress", linkedIn);
					if ($(".pluck-social-syndicateOnDemand-dialog-checked", linkedIn).length > 0) {
						lbl.html(params.ProgressPending);
					} else {
						lbl.html(params.ProgressNoConnect);
					}
					linkedIn.addClass("pluck-social-syndicateOnDemand-dialog-sharing");

					var info = $.extend({ facebookStatus: "none", twitterStatus: "none", linkedInStatus: "none" }, top.data("syndicate"));
					info.message = newMessage;
					sendFacebook(info);
					return false;
				});

				$("a.pluck-social-syndicateOnDemand-dialog-cancel, a.pluck-social-syndicateOnDemand-dialog-modalClose", dialog).click(function() {
					if (inProgress) return false;
					pluckAppProxy.fadeOut(dialog);
					if (params.plckSyndicateOnDemandVisualMode == "oninit") {
						pluckAppProxy.fadeIn(top, function() {
							var activityObj = { parentId: parentId, htmlId: htmlId };
							pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandCancel", activityObj);
						});
					}						
					return false;
				});

				$("a.pluck-social-syndicateOnDemand-dialog-tryAgain", dialog).click(function() {
					var service = $(this).parents(".pluck-social-syndicateOnDemand-dialog-service");
					var info = service.data("info");
					service.removeClass("pluck-social-syndicateOnDemand-dialog-failure");
					if (service.hasClass("pluck-social-syndicateOnDemand-dialog-facebook")) {
						sendFacebook(info);
					} else if (service.hasClass("pluck-social-syndicateOnDemand-dialog-twitter")) {
						sendTwitter(info);
					} else if (service.hasClass("pluck-social-syndicateOnDemand-dialog-linkedIn")) {
						sendLinkedIn(info);
					}
					return false;
				});

				$("a.pluck-social-syndicateOnDemand-dialog-skip", dialog).click(function() {
					var service = $(this).parents(".pluck-social-syndicateOnDemand-dialog-service");
					var info = service.data("info");
					$(".pluck-social-syndicateOnDemand-dialog-progress", service).html(params.ProgressSkip);
					service.removeClass("pluck-social-syndicateOnDemand-dialog-failure");
					if (service.hasClass("pluck-social-syndicateOnDemand-dialog-facebook")) {
						info.facebookStatus = "skip";
						sendTwitter(info);
					} else if (service.hasClass("pluck-social-syndicateOnDemand-dialog-twitter")) {
						info.twitterStatus = "skip";
						sendLinkedIn(info);
					} else if (service.hasClass("pluck-social-syndicateOnDemand-dialog-linkedIn")) {
						info.linkedInStatus = "skip";
						cleanUp(info);
					}
					return false;
				});

				pluckAppProxy.registerCssCallback("pluck/social/social.css", function() {
					var activityObj = { parentId: parentId, htmlId: htmlId };
					if (params.plckSyndicateOnDemandVisualMode != "oninit") {
						top.show();
						pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandShow", activityObj);
					}
					pluckAppProxy.executeActivityCallbacks("SyndicateOnDemandLoad", activityObj);
				});
			};

			pluckAppProxy.pluck_social_syndicateOnDemand_setup = function(parentHtmlId, syndicationInfo) {
				var parent = null;
				if (parentHtmlId && parentHtmlId != "#") {
					if (parentHtmlId.indexOf("#") != 0) parentHtmlId = "#" + parentHtmlId;
					parent = $(parentHtmlId);
					if (parent.length == 0) parent = null;
				}
				if (!parent) parent = $("body");
				var btn = $(".pluck-social-syndicateOnDemand", parent);
				if (btn.length != 1) return false;

				if (!syndicationInfo || !syndicationInfo.message) {
					btn.removeData("syndicate");
					btn.addClass("pluck-social-syndicateOnDemand-disabled");
					return true;
				}

				var syndicate = { message: syndicationInfo.message }
				if (syndicationInfo.body) syndicate.body = syndicationInfo.body;
				if (syndicationInfo.url) {
					var url = syndicationInfo.url;
					var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
					if (regexp.test(url)) syndicate.url = url;
					else syndicate.url = document.location.href;
				} else {
					syndicate.url = document.location.href;
				}
				if (syndicationInfo.fbCallToAction) syndicate.fbCallToAction = syndicationInfo.fbCallToAction;
				if (syndicationInfo.fbTitle) syndicate.fbTitle = syndicationInfo.fbTitle;
				else syndicate.fbTitle = document.title;
				if (syndicationInfo.template) syndicate.template = syndicationInfo.template;
				if (syndicationInfo.contentType) syndicate.contentType = syndicationInfo.contentType;
				if (syndicationInfo.parentContentType) syndicate.parentContentType = syndicationInfo.parentContentType;
				if (syndicationInfo.optionChosen) syndicate.optionChosen = syndicationInfo.optionChosen;

				btn.data("syndicate", syndicate);
				btn.removeClass("pluck-social-syndicateOnDemand-disabled");

				var params = btn.data("params");
				if (params && params.plckSyndicateOnDemandVisualMode == "oninit") {
					$("a.pluck-social-syndicateOnDemand-link", btn).click();
				} else if (params && params.plckSyndicateOnDemandDisplayMode == "checkbox") {
					if ($("input:checked", btn).length > 0) {
						$("a.pluck-social-syndicateOnDemand-link", btn).click();
					}
				}

				return true;
			};
		}

		/**************************************
		 *
		 * pluck/social/pinterest/button
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_pinterest_button) === 'undefined') {
			pluckAppProxy.pluck_social_pinterest_button_counter = 0;
			pluckAppProxy.pluck_social_pinterest_button_readySet = false;
			pluckAppProxy.pluck_social_pinterest_button_timer = null;
			pluckAppProxy.pluck_social_pinterest_button = function (htmlId, opts) {
				if (!pluckAppProxy.pluck_social_pinterest_button_readySet) {
					pluckAppProxy.pluck_social_pinterest_button_readySet = true;
					$(document).ready(pluckAppProxy.pluck_social_pinterest_button_init);
				}
				$(htmlId).click(function() { return false; });
			};

			pluckAppProxy.pluck_social_pinterest_button_execute = function() {
				var btns = $(".pluck-pinit-button");
				if (btns.length == 0) {
					pluckAppProxy.pluck_social_pinterest_button_timer = null;
					return;
				}
				btns.addClass("pin-it-button").removeClass("pluck-pinit-button");
				pluckAppProxy.pluck_social_pinterest_button_timer = null;

				var scriptUrl = "//assets.pinterest.com/js/pinit.js?plck=" + pluckAppProxy.pluck_social_pinterest_button_counter++;
				// Do NOT use window.pluckLoadScript or the pluckAppProxy equiv - need to load regardless of state of skipJS
				var elem = document.createElement('script');
				elem.setAttribute('src', scriptUrl);
				elem.setAttribute('type', 'text/javascript');

				// if we're using Internet Explorer, use the onreadystatechange event; otherwise, use onload
				if ((/msie/i).test(navigator.userAgent)) {
					elem.onreadystatechange = function () {
						if (this.readyState === 'loaded' || this.readyState === 'complete') {
							if (!pluckAppProxy.pluck_social_pinterest_button_timer)
								pluckAppProxy.pluck_social_pinterest_button_timer = window.setTimeout(pluckAppProxy.pluck_social_pinterest_button_execute, 500);
						}
					};
				} else {
					elem.onload = function () {
						if (!pluckAppProxy.pluck_social_pinterest_button_timer)
							pluckAppProxy.pluck_social_pinterest_button_timer = window.setTimeout(pluckAppProxy.pluck_social_pinterest_button_execute, 500);
					};
				}
				document.getElementsByTagName('head')[0].appendChild(elem);
			};
			pluckAppProxy.pluck_social_pinterest_button_init = function() {
				pluckAppProxy.pluck_social_pinterest_button_readySet = false;
				if (pluckAppProxy.pluck_social_pinterest_button_timer) {
					return;
				}
				pluckAppProxy.pluck_social_pinterest_button_timer = window.setTimeout(pluckAppProxy.pluck_social_pinterest_button_execute, 500);
			};				
		}
	},
	
	// eachTime function.  Called whenever the plugin is requested, responsible for executing callbacks.
	function ($, jQuery, dmJQuery, callback){
		if(callback){
			callback();
		}
	}
);