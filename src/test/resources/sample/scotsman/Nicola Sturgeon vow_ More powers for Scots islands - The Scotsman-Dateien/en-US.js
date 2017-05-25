(function() {
    var translation = {"ERROR_GENERIC_PREFIX":"We were temporarily unable to sign you in. We're really sorry.","ERROR_GENERIC_PREFIX2":"Here's ","ERROR_GENERIC_SUFFIX":" if the problem continues.","ERROR_PREFIX_AOL":"We were unable sign you in. Please check your screenname and try again. Need ","ERROR_PREFIX_BLOGGER":"We were unable sign you in. Please check your domain and try again. Need ","ERROR_PREFIX_NETLOG":"We were unable sign you in. Please check your nickname and try again. Need ","ERROR_PREFIX_OPENID":"We were unable sign you in. Please check your OpenID and try again. Need ","ERROR_PREFIX_USERNAME":"We were unable sign you in. Please check your username and try again. Need ","ERROR_SUFFIX_AOL":"?","ERROR_SUFFIX_BLOGGER":"?","ERROR_SUFFIX_NETLOG":"?","ERROR_SUFFIX_OPENID":"?","ERROR_SUFFIX_USERNAME":"?","HEADER":"Sign in using your account with","HELP":"help","INPUT_EXAMPLE_BLOGGER":"eg: me.blogspot.com or mybloggerdomain.com","INPUT_PROMPT_AOL":"Your AOL screenname","INPUT_PROMPT_BLOGGER":"Your blogger domain","INPUT_PROMPT_LIVEJOURNAL":"Your LiveJournal username","INPUT_PROMPT_NETLOG":"Your Netlog nickname","INPUT_PROMPT_OPENID":"Your OpenID","INPUT_PROMPT_WORDPRESS":"Your WordPress username","SIGNING_IN":"Signing in ...","MORE_INFO":"more info","NOT_YOU":"not you?","PAGE":"page","POWERED_BY_PREFIX":"Social Login ","POWERED_BY_SUFFIX":"by Janrain","SIGN_IN":"Sign In »","TRY_AGAIN":"Try Again","USE_ANOTHER_ACCOUNT":"use another account","WELCOME_BACK":"Welcome back","WELCOME_BACK_PREFIX":"Welcome back, ","WELCOME_BACK_SUFFIX":""};
    if (!janrain.settings.translate || janrain.settings.translate === {}) {
        janrain.settings.translate = translation;
    }
    else {
        for (var str in translation) {
            if(!janrain.settings.translate[str] || str === "POWERED_BY_PREFIX" || str === "POWERED_BY_SUFFIX") {
                janrain.settings.translate[str] = translation[str];
            }
        }
    }
})();
