(function ($, document, window) {
    'use strict';
    var _document = $(document);
    window.janrain.settings.providers = [
        'facebook',
        'twitter',
        'googleplus',
        "linkedin",
        "live_id",
        'yahoo',
        'amazon'
    ];

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function centerModalPopup(element) {
        element.css({
            'padding-top': function () { //vertical centering
                var height = ($(window).height() - $(this).find('.modal-content').height()) / 2;
                return (height >= 0) ? height : 0;
            }
        });
    }

    function janrainDisplayNameValidation(name, value, validation) {
        validation.pending();
        var regex = /^([A-Za-z0-9]+ ?)*$/;
        if (regex.test(value)) {
            validation.valid();
            return true;

        } else {
            validation.notValid("Invalid");
            return false;
        }
    }

    function janrainCaptureWidgetLoad() {
        janrain.capture.ui.registerFunction('regex_displayName_validation', janrainDisplayNameValidation);

        JanrainCaptureHelper.start();

        $(window).on({
            resize: function () {
                if($('html').hasClass("ios")) {
                    if ($('.modal').is(":visible") || $('#janrainModalOverlay').is(":visible")) {
                        centerModalPopup($('.modal'));
                        var scrollCurrent = document.body.scrollTop;
                        var scrollTo = (document.body.scrollTop === 0) ? 10: scrollCurrent;
                        setTimeout(function(){
                            $('body, html')
                                .animate({scrollTop: scrollTo - 1})
                                .scrollTop(scrollTo - 1);
                        }, 400);
                    }
                }
            }
        });

    }

    var loginView = new LoginRegisterView();
    var screenName = getParameterByName('screenName');
    var currentPage = window.location.pathname;
    var referrer = "";
    var cluster = siteStyle;

    LoginRegister.initVariables(loginView, currentPage, referrer, screenName, cluster); 
    if (!window.janrainWidgetLoaded) {
        _document.on("janrainWidgetOnload", LoginRegister.initJanrainEventHandlers); 
    } else {
        LoginRegister.initJanrainEventHandlers();
    }
    if (!window.janrainCaptureWidgetLoaded) {
        _document.on("janrainCaptureWidgetOnLoad", janrainCaptureWidgetLoad); 
    } else {
        janrainCaptureWidgetLoad();
    }

}(jQuery, document, window));
