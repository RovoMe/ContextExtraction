TWP=TWP||{};TWP.Onlinegame=TWP.Onlinegame||{};TWP.Onlinegame.loaded=TWP.Onlinegame.loaded||false;
(function($){if(TWP.Onlinegame.loaded)return;else TWP.Onlinegame.loaded=true;if(!window.isMobile.any())$(".game-module .game-widgets-container .flash").show();else{$(".game-module .game-widgets-container .flash").remove();$(".game-module.html5").hide()}var paddingInWidth=30;var defaultWidth=731;var defaultHeight=480;$(".games").on("click","a[data-toggle\x3d'game-trigger']",function(){var that=this;var gpwidth=parseInt($(this).find(".game-item").attr("iframewidth"));gpwidth=gpwidth>0?gpwidth:defaultWidth;
var gpheight=parseInt($(this).find(".game-item").attr("iframeheight"));gpheight=gpheight>0?gpheight:defaultHeight;var containerWidth=$(this).parents(".game-module").width();$(this).parents(".game-module").find(".game-player-container iframe").attr("width",gpwidth);if(isIE8()){console.log("IE8!!!!");$(this).parents(".game-module").find(".game-player-container-inner").css("width",gpwidth+"px")}$(this).parents(".game-module").find(".game-player-container iframe").attr("height",gpheight);$(this).parents(".game-module").find(".game-player-container").css("margin-left",
containerWidth+"px");$(this).parents(".game-module").find(".game-player-container img").attr("src",$(this).find(".game-item").attr("screenshot"));$(this).parents(".game-module").find(".game-player-container img").attr("width",gpwidth);$(this).parents(".game-module").find(".game-player-container img").css("opacity","1");$(this).parents(".game-module").find(".game-player-container img").show();$(this).parents(".game-module").find(".game-player-container").show();$(this).parents(".game-module").find(".game-player-container").animate({marginLeft:containerWidth-
gpwidth-paddingInWidth},1E3,function(){$(that).parents(".game-module").find(".game-player-container iframe").attr("src",$(that).find(".game-item").attr("onlineembeddedgameurl"));$(that).parents(".game-module").find(".game-player-container img").animate({opacity:0},1E3,function(){$(that).parents(".game-module").find(".game-player-container img").hide()})})});$(".main-column.game-module").on("click","a[data-toggle\x3d'game-trigger']",function(){var that=this;var gpwidth=parseInt($(this).find(".game-item").attr("iframewidth"));
gpwidth=gpwidth>0?gpwidth:defaultWidth;var gpheight=parseInt($(this).find(".game-item").attr("iframeheight"));gpheight=gpheight>0?gpheight:defaultHeight;var containerWidth=$(this).parents(".game-module").width();var containerHeight=$(this).parents(".game-module").height();console.log("game player width \x3d "+gpwidth);console.log("game player height \x3d "+gpheight);$(this).parents(".game-module").find(".game-player-container").css("width",gpwidth+paddingInWidth+"px");$(this).parents(".game-module").find(".game-player-container iframe").attr("width",
gpwidth);$(this).parents(".game-module").find(".game-player-container iframe").attr("height",gpheight);$(this).parents(".game-module").find(".game-player-container").css("margin-top",containerHeight+"px");$(this).parents(".game-module").find(".game-player-container img").attr("src",$(this).find(".game-item").attr("screenshot"));$(this).parents(".game-module").find(".game-player-container img").attr("width",gpwidth);$(this).parents(".game-module").find(".game-player-container img").css("opacity","1");
$(this).parents(".game-module").find(".game-player-container img").show();$(this).parents(".game-module").find(".game-player-container").show();$(this).parents(".game-module").find(".game-player-container").animate({marginTop:containerHeight-gpheight-paddingInWidth},1E3,function(){console.log("anminate is done!");$(that).parents(".game-module").find(".game-player-container iframe").attr("src",$(that).find(".game-item").attr("onlineembeddedgameurl"));$(that).parents(".game-module").find(".game-player-container img").animate({opacity:0},
1E3,function(){$(that).parents(".game-module").find(".game-player-container img").hide()})})});$(".game-module").on("click",".game-player-container .close-button",function(){$(this).parents(".game-module").find("iframe").attr("src","");$(this).parent().hide();$(this).parents(".game-module").find(".game-player-container").css({left:0})});function isIE7(){return $.browser.msie&&$.browser.version.substring(0,1)=="7"}function isIE8(){return $.browser.msie&&$.browser.version.substring(0,1)==="8"}function isIE9(){return $.browser.msie&&
$.browser.version.substring(0,1)==="9"}})(jQuery);