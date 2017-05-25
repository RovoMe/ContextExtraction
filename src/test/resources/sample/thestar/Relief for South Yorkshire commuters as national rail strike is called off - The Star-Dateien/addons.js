(function (w, d, undefined) {

    var options = {};
    // Check if this has been loaded already
    if (typeof SCRIBBLELIVE === 'object') {
        return;
    }

    // If we've been loaded via an iframe (FiF), we'll setup a bridge to our parent's window object
    if (w.parent !== w && d.getElementById('scribblelive-if-async') &&
        d.getElementById('scribblelive-if-async').nodeName.toLowerCase() === 'script') {
        w = w.parent;
    }
    var eventId = null;

    // If we've been loaded via a regular script tag check if the event id has been passed in the querystring
    var scripts = d.getElementsByTagName('script');

    if (typeof scripts !== "undefined" && scripts !== null && scripts.length > 0 && typeof scripts["sl-libjs"] !== "undefined" && typeof scripts["sl-libjs"].options !== "undefined") {
        options = scripts["sl-libjs"].options;
    }

    // go through the scripts	
    for (var i = 0; i < scripts.length; i++) {
        var match = scripts[i].src.replace(/%20/g, '').match(/modules\/lib\/addons\.js\?id=(\d+)/);
        if (match !== null) {
            if (match[1]) {
                eventId = match[1];
            }
            break;
        }
    }

    /**
    * Returns the namespace specified and creates it if it doesn't exist
    * <pre>
    * SCRIBBLELIVE.namespace("property.package");
    * SCRIBBLELIVE.namespace("SCRIBBLELIVE.property.package");
    * </pre>
    * Either of the above would create SCRIBBLELIVE.property, then
    * SCRIBBLELIVE.property.package
    *
    * Be careful when naming packages. Reserved words may work in some browsers
    * and not others. For instance, the following will fail in Safari:
    * <pre>
    * SCRIBBLELIVE.namespace("really.long.nested.namespace");
    * </pre>
    * This fails because "long" is a future reserved word in ECMAScript
    *
    * @method namespace
    * @static
    * @param  {String*} arguments 1-n namespaces to create
    * @return {Object}  A reference to the last namespace object created
    */
    function namespace() {
        var a = arguments, o = null, i, j, d;
        for (i = 0; i < a.length; i = i + 1) {
            d = a[i].split(".");
            o = SCRIBBLELIVE;
            for (j = 0; j < d.length; j = j + 1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        return o;
    }

    function guard(fn) {
        return function () {
            try {
                return fn.apply(this, arguments);
            } catch (e) {
                // we can log errors here (to a server, etc.)

                console.error('%s: %s', e.name, e.stack);

                // re-throw exception
                throw e;
            }
        };
    }

    // Queue for functions to execute on load of library
    var executeOnLoadFns = [],
    // Error objects stored here
        ERRORS = {},
    // Main Library
        lib = {


            /**
            * Adds the named property (function, object, primitive, etc.) to the SCRIBBLELIVE library using
            * the specified namespace (if no namespace specified, it will add
            * it directly to the SCRIBBLELIVE object).  If executeOnLoad is
            * specified, the function will automatically be executed once the 
            * SCRIBBLELIVE library has finished loading (if a function has been supplied).
            * <pre>
            * SCRIBBLELIVE._provide( 'name', function(){...}, 'package', true|false );
            * SCRIBBLELIVE._provide( 'name', function(){...}, 'SCRIBBLELIVE.package', true|false );
            * </pre>
            *
            * @method _provide
            * @static
            * @param  {String}  name Property name
            * @param  {Any}     prop Property associated to the name (function, object, primitive, etc.)
            * @param  {String*} ns 1-n namespaces to create
            * @param  {Boolean} executeonLoad Whether to auto-execute the function once
            *                   the library has loaded; function will be called with the SCRIBBLELIVE
            *                   library as it's scope (this)
            */
            _provide: function (name, prop, ns, executeOnLoad) {
                // use 'guard' to wrap the function in the error handler
                var f = typeof prop === 'function' ? guard(prop) : prop;

                // is function namespaced?
                if (ns) {
                    if (this.hasOwnProperty(ns)) {
                        this[ns][name] = f;
                    } else {
                        ns = namespace.call(this, ns);
                        ns[name] = f;
                    }
                } else {
                    this[name] = f;
                }

                // execute function on load?
                if (executeOnLoad === true && typeof prop === 'function') {
                    executeOnLoadFns.push(f);
                    // f();
                }
            },

            util: {
                getRandomInt: function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                },

                /**
                * Return an integer hash of the passed-in string.
                *
                * @method hashCode
                * @public
                * @param  {String}  str A string to hash
                * @return {Integer} The hashcode for the passed-in string
                */
                hashCode: function (str) {
                    var hash = 0,
                    char2,
                    i;

                    if (str.length === 0) {
                        return hash;
                    }

                    for (i = 0; i < str.length; i++) {
                        char2 = str.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char2;
                        hash = hash & hash; // Convert to 32bit integer
                    }

                    return hash;
                },

                /**
                * Returns value for the specified cookie name
                *
                * @method getCookie
                * @public
                * @param  {String}      name Name of the cookie
                * @return {String|null} The value for the specified cookie; null if none found.
                */
                getCookie: function (name) {
                    var start = d.cookie.indexOf(name + "="),
                    len = start + name.length + 1,
                    end = d.cookie.indexOf(';', len);

                    if ((!start) && (name !== d.cookie.substring(0, name.length))) {
                        return null;
                    }

                    if (start === -1) {
                        return null;
                    }


                    if (end === -1) {
                        end = d.cookie.length;
                    }
                    return unescape(d.cookie.substring(len, end));
                },

                /**
                * Sets a cookie with the specified name, value, expiry date, path, domain and whether
                * cookie should be transmitted over https
                *
                * @method setCookie
                * @public
                * @param  {String}  name                Name of the cookie
                * @param  {String}  value               The value for the specified cookie
                * @param  {Date}    expires (optional)  Expiry date for the cookie. If not specified 
                *                                       it will expire at the end of session
                * @param  {String}  path (optional)     (e.g., '/', '/mydir') If not specified, defaults 
                *                                       to the current path of the current document location
                * @param  {String}  domain (optional)   If not specified, defaults to the host portion of the 
                *                                       current document location. e.g., 'example.com', '.example.com' 
                *                                       (includes all subdomains), 'subdomain.example.com')
                * @param  {Boolean} secure (optional)   Indicates whether the cookie is only to be transmitted over 
                *                                       secure protocol as https
                */
                setCookie: function (name, value, expires, path, domain, secure) {
                    var today = new Date(),
                    expires_date;

                    today.setTime(today.getTime());
                    if (expires) {
                        expires = expires * 1000 * 60 * 60 * 24;
                    }

                    expires_date = new Date(today.getTime() + (expires));

                    d.cookie = name + '=' + escape(value) +
                    ((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
                    ((path) ? ';path=' + path : '') +
                    ((domain) ? ';domain=' + domain : '') +
                    ((secure) ? ';secure' : '');
                }  
            }

        };

    window.SCRIBBLELIVE = w.SCRIBBLELIVE = lib;

    lib._provide('_setEventId', function (id) {
        eventId = id;
    });


    lib._provide('_setClientId', function (id) {
        clientId = id;
    });

    /* METRICS LIBRARY
    ---------------------------------------------------------- */
    /**
    * Self-executing method that tracks engagement minutes for a given event.
    * The event ID must be specified either as window.eventId, window.ThreadId,
    * window.ScribbleLive_TopPostsWidget.ThreadId or window.LiveArticleEmbed.GetInstance().ThreadId.
    * If no event ID is found, an UnspecifiedEventIdError is thrown.
    *
    * @method track
    * @public
    */
    lib._provide('track', function () {
        var $U = lib.util,
            HitCounter;

        function GetSourceUrl(pSourceType) {
            var Source = "";

            // Embed
            if (pSourceType == 3) {
                Source = document.referrer !== "" ? document.referrer : document.location.href;
            }
            else {
                Source = document.location.href;
            }

            return Source;
        }

        function GetSourceType() {
            // default source type is API unless we determine otherwise
            var $SourceType = 1;

            var Found = false;

            var ExperienceIs = ( typeof SCRIBBLE !== "undefined" && SCRIBBLE.globals && SCRIBBLE.globals.experience && SCRIBBLE.globals.experience.is ? SCRIBBLE.globals.experience.is : undefined );

            // Whitelabel
            if (ExperienceIs && ExperienceIs.whitelabel) {
                $SourceType = 2;
                Found = true;
            }
                // Embed
            else if (ExperienceIs && ExperienceIs.embed) {
                $SourceType = 3;
                Found = true;
            }
                // ScribbleLive.mobi Mobile Template
            else if ((typeof IsMobileSite !== "undefined" && IsMobileSite === true) || (typeof SCRIBBLE !== "undefined" && typeof SCRIBBLE.globals !== "undefined" && SCRIBBLE.globals.mobile === true)) {
                $SourceType = 5;
                Found = true;
            }
                // LiveArticle Embed
            else if (ExperienceIs && ExperienceIs.livearticleEmbed) {
                $SourceType = 6;
                Found = true;
            }
                // Recent Posts Embed
            else if (typeof RecentPosts !== "undefined") {
                $SourceType = 7;
                Found = true;
            }
                // Single Post Page
            else if (ExperienceIs && ExperienceIs.singlePostPage) {
                $SourceType = 8;
                Found = true;
            }
                // Scoreboard
            else if (typeof ScribbleLive_Scoreboard != "undefined") {
                $SourceType = 10;
                Found = true;
            }
            // Pinboard
            else if (ExperienceIs && ExperienceIs.pinboard) {
                $SourceType = 11;
                Found = true;
            }
            else if (ExperienceIs && ExperienceIs.timeline) {
                $SourceType = 12;
                Found = true;
            }
            else if (ExperienceIs && ExperienceIs.contentAtom) {
                $SourceType = 13;
                Found = true;
            }

            return $SourceType;
        }

        HitCounter = function (pIsPageView) {

            var CookiesEnabled = true,
                StatsUserId = null,
                UniquesList = null,
                ItemKey = eventId || window.eventId || null,
                Client = (typeof clientId  === 'undefined' ? -1 : clientId),
                MAXCOOKIELENGTH = 3500,
                MAXVARLENGTH = 20000,
                IsFirstView = pIsPageView,
                CounterImage,
                CookieUniquesList;

            var SourceType = (typeof options.SourceType !== "undefined" ? options.SourceType : GetSourceType());

            if (StatsUserId === null) {
                StatsUserId = $U.getCookie("SLStatUid");

                if (StatsUserId === null) {
                    // Generate a unique ID for the user
                    StatsUserId = $U.hashCode((+d.domain)) + "_" + (new Date()).getTime() + "_" + Math.floor((Math.random() * 10000000) + 1);
                    $U.setCookie("SLStatUid", StatsUserId);

                    CookiesEnabled = ($U.getCookie("SLStatUid") !== null);
                }
            }

            // If no event id is passed in, we'll check for one
            if (ItemKey === null) {
                if (typeof w.ThreadId !== "undefined") {
                    ItemKey = w.ThreadId;
                } else if (typeof w.ScribbleLive_TopPostsWidget !== "undefined") {
                    ItemKey = w.ScribbleLive_TopPostsWidget.ThreadId;
                } else if (typeof w.LiveArticleEmbed !== "undefined" && w.LiveArticleEmbed.GetInstance() !== "undefined" && w.LiveArticleEmbed.GetInstance() !== null) {
                    ItemKey = w.LiveArticleEmbed.GetInstance().ThreadId;
                }
            }

            if ( typeof ItemKey !== "undefined" && ItemKey !== null) {

                if (SourceType !== null) {

                    ItemKey = (ItemKey + "").replace(/\s/ig, "");

                    if (pIsPageView) {
                        if (UniquesList === null) {
                            UniquesList = $U.getCookie("SLStatHist");
                        }

                        if (UniquesList === null) {
                            UniquesList = "";
                        }

                        // If we've already seen that item
                        if (UniquesList.match(new RegExp("(^|\\|)" + ItemKey))) {
                            IsFirstView = false;
                        } else {
                            IsFirstView = true;
                            UniquesList += "|" + ItemKey;

                            if (UniquesList.length > MAXVARLENGTH) {
                                UniquesList = UniquesList.substring(UniquesList.length - MAXVARLENGTH);
                                UniquesList = UniquesList.substring(UniquesList.indexOf("|"));
                            }

                            CookieUniquesList = UniquesList;

                            if (CookieUniquesList.length > MAXCOOKIELENGTH) {
                                CookieUniquesList = CookieUniquesList.substring(CookieUniquesList.length - MAXCOOKIELENGTH);
                                CookieUniquesList = CookieUniquesList.substring(CookieUniquesList.indexOf("|"));
                            }

                            $U.setCookie("SLStatHist", CookieUniquesList);
                        }

                        //document.title = UniquesList;
                    }

                    CounterImage = new Image();
                    CounterImage.src = "//counter.scribblelive.com/?page=" + ItemKey
                            + (pIsPageView ? "&pageview=1" : "")
                            + (IsFirstView ? "&first=1" : "")
                    //+ (CookiesEnabled ? "" : "&nocookies=1")
                            + (StatsUserId ? "&uid=" + StatsUserId : "")
                            + "&rand=" + Math.round(100000000 * Math.random())
                            + "&Source=" + encodeURIComponent(GetSourceUrl(SourceType))
                            + "&SourceType=" + SourceType
                            + (Client !== -1 ? "&Client=" + Client : "");
                }

                setTimeout(function () {
                    HitCounter();
                }, $U.getRandomInt(45000, 57000));
            } else {
                throw new ERRORS.UnspecifiedEventIdError('Event ID (eventId|ThreadId|ScribbleLive_TopPostsWidget|LiveArticleEmbed) should be specified for all API calls.');
            }
        };

        HitCounter(true);

    }, 'metrics', true);   // true = self execute


    /* FUTURE LIBRARY NAMESPACES GO HERE
    ---------------------------------------------------------- */


    /* CUSTOM ERROR OBJECTS
    ---------------------------------------------------------- */

    /**
    * UnspecifiedEventIdError is thrown when no event id (or thread id)
    * has been supplied
    *
    * @method UnspecifiedEventIdError
    * @param  {String} msg Error message to display when thrown (good for console logging)
    */
    ERRORS.UnspecifiedEventIdError = function (msg) {
        this.name = 'UnspecifiedEventIdError';
        this.message = msg || '';
    };
    ERRORS.UnspecifiedEventIdError.prototype = new Error();

    /* STARTUP/BOOTSTRAP
    ---------------------------------------------------------- */
    setTimeout(guard(function () {
        var i, j, _slq;

        // process any pre-defined arguments/parameters defined by 
        // the host page
        // ex: _slq.push(['_setEventId', 'XXXXX']);
        _slq = w._slq || [];
        while (_slq.length) {
            var params = _slq.shift();      // grab first item of queue
            var method = params.shift();    // grab method name from first item of params

            if (typeof lib[method] === 'function') {
                lib[method].apply(lib, params);
            }
        }

        _slq.push = function (params) {
            var method = params.shift();
            if (typeof lib[method] === 'function') {
                lib[method].apply(lib, params);
            }
        }

        // Run through executeOnLoad queue, calling each function
        for (i = 0, j = executeOnLoadFns.length; i < j; i++) {
            executeOnLoadFns[i].call(lib);
        }

        // Check if slAsyncInit has been defined; if so, we'll execute
        // it once all the executeOnLoad functions have been called.
        // This is a nice way to have the host page define async. callbacks 
        if (w.slAsyncInit && !w.slAsyncInit.hasRun) {
            w.slAsyncInit.hasRun = true;
            w.slAsyncInit.call({});
        }

    }), 0);
} (window, document));