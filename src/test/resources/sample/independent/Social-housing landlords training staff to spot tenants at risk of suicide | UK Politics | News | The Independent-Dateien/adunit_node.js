// Versions:
// 0.71 23/7/15
// added mobile specific MPU slot, mpu8
//
// 0.7 13/7/15:
// parter slot size updates, from 245x260/245x261 to 245x210/241x211
//
// 0.69 06/7/15:
// partnerMapping updates, each slot now has its own mapping.
// Added article and pagetype keyvalue targeting.
// Updated mpu6 and mpu7 slot sizes to 300x254
//
// 0.68 01/7/15 - partnerMapping updates
// 0.67 30/6/15 - Partners slot 6-10 changes
// 0.66 23/6/15 - using mpu5 for gallery ad slot, added mpu5Mapping and 320x51 size
// 0.65 22/6/15 - overlay mapping fix
// 0.6 18/6/15 - additional mapping


// Krux
window.Krux||((Krux=function(){Krux.q.push(arguments);}).q=[]); (function(){
    function retrieve(n){
        var m, k='kx'+n;
        if (window.localStorage) {
            return window.localStorage[k] || ""; } else if (navigator.cookieEnabled) {
            m = document.cookie.match(k+'=([^;]*)');
            return (m && unescape(m[1])) || ""; } else {
            return ''; }
    }
    Krux.user = retrieve('user');
    Krux.segments = retrieve('segs') && retrieve('segs').split(',') || [];
})();

// Load GPT asynchronously
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') +
    '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
})();

// GPT slots
var gptAdSlots = [],
    esGPT = '/71347885/_main_independent';

if (location.origin === 'http://uat.independent.co.uk' || location.origin === 'http://uat-origin.independent.co.uk' || location.origin === 'http://dev.independent.co.uk') {
    esGPT = '/71347885/test_main_independent';
}

if (typeof gptPath !== "undefined"){
    gptPath = gptPath.replace(/[-]/g, '/');
    esGPT += gptPath;
}

googletag.cmd.push(function() {

    var ldrMapping = googletag.sizeMapping().
        // if greater than 990px wide serve 970x250 or 728x90
        addSize([990, 0], [[970, 250],[728, 90]]).
        // if greater than 750px wide serve 728x90
        addSize([750, 0], [728, 90]).
        // else serve 320x50
        addSize([0, 0], [320, 50]).
        build();

    var mpuMapping0 = googletag.sizeMapping().
        // if greater than 620px wide serve 300x600 or 300x250
        addSize([620, 0], [[300, 600],[300, 250]]).
        // else serve 300x250
        addSize([0, 0], [300, 250]).
        build();

    var mpuMapping1 = googletag.sizeMapping().
        // if greater than 620px wide serve 300x601 or 300x251
        addSize([620, 0], [[300, 601],[300, 251]]).
        // else serve 300x250
        addSize([0, 0], [300, 251]).
        build();

    var mpuMapping2 = googletag.sizeMapping().
        // if greater than 620px wide serve 300x602 or 300x252
        addSize([620, 0], [[300, 602],[300, 252]]).
        // else serve 300x250
        addSize([0, 0], [300, 252]).
        build();

    var mpuMapping5 = googletag.sizeMapping().
        // if greater than 930px wide serve 300x255, else serve 320x51
        addSize([930, 0], [300, 255]).
        // else serve 300x250
        addSize([0, 0], [320, 51]).
        build();

    var partnerMapping1 = googletag.sizeMapping().
        // always show partner1
        addSize([0, 0], [245, 210]).
        build();

    var partnerMapping2 = googletag.sizeMapping().
        // if greater than 530px wide serve partner2
        addSize([535, 0], [245, 210]).
        addSize([0, 0], []).
        build();

    var partnerMapping3 = googletag.sizeMapping().
        // if greater than 765px wide serve partner3
        addSize([765, 0], [245, 210]).
        addSize([0, 0], []).
        build();

    var partnerMapping4 = googletag.sizeMapping().
        // if greater than 1065px wide serve partner4
        addSize([1065, 0], [245, 210]).
        addSize([0, 0], []).
        build();

    var partnerMapping5 = googletag.sizeMapping().
        // if greater than 1330px wide serve partner5
        addSize([1330, 0], [245, 210]).
        addSize([0, 0], []).
        build();

    var partnerMapping6 = googletag.sizeMapping().
        // always show partner1
        addSize([0, 0], [245, 211]).
        build();

    var partnerMapping7 = googletag.sizeMapping().
        // if greater than 530px wide serve partner2
        addSize([535, 0], [245, 211]).
        addSize([0, 0], []).
        build();

    var partnerMapping8 = googletag.sizeMapping().
        // if greater than 765px wide serve partner8
        addSize([765, 0], [245, 211]).
        addSize([0, 0], []).
        build();

    var partnerMapping9 = googletag.sizeMapping().
        // if greater than 1065px wide serve partner4
        addSize([1065, 0], [245, 211]).
        addSize([0, 0], []).
        build();

    var partnerMapping10 = googletag.sizeMapping().
        // if greater than 1330px wide serve partner5
        addSize([1330, 0], [245, 211]).
        addSize([0, 0], []).
        build();

    var overlayMapping = googletag.sizeMapping().
        // if less than 500px wide serve 320x480
        addSize([0, 0], [320, 480]).
        addSize([500, 0], []).
        build();

    // inSkin targeting var
    var fn_pageskin = "no";
    if (screen.width >= 1280) { fn_pageskin = "yes"; }
    // Define the fourth slot
    // gptAdSlots[3] = googletag.defineSlot(esGPT,[8, 8],'inskin8x8').
    //     setCollapseEmptyDiv(true).
    //     setTargeting("inskin", fn_pageskin).
    //     addService(googletag.pubads());

    // Define the second slot
    gptAdSlots[1] = googletag.defineOutOfPageSlot(esGPT,'outofpageslot').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "outofpageslot").
        addService(googletag.pubads());

    // Define the twenty sixth slot - TEADS Inboard slot
    gptAdSlots[25] = googletag.defineSlot(esGPT,[4, 4],'teadsib').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "teadsib").
        setTargeting("inskin", fn_pageskin).
        addService(googletag.pubads());

    // Define the third slot
    gptAdSlots[2] = googletag.defineSlot(esGPT,[5, 5],'teads').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "teads").
        setTargeting("inskin", fn_pageskin).
        addService(googletag.pubads());

    // Define the first slot
    gptAdSlots[0] = googletag.defineSlot(esGPT,[[320, 50], [728, 90], [970, 250]],'leaderboard').
        defineSizeMapping(ldrMapping).
        setCollapseEmptyDiv(true).
        setTargeting("tile", "leaderboard").
        setTargeting("inskin", fn_pageskin).
        addService(googletag.pubads());

    // Define the fifth slot
    gptAdSlots[4] = googletag.defineSlot(esGPT,[[300, 250], [300, 600]],'mpu0').
        defineSizeMapping(mpuMapping0).
        setCollapseEmptyDiv(true).
        setTargeting("tile", "mpu0").
        addService(googletag.pubads());

    // // Define the sixth slot
    // gptAdSlots[5] = googletag.defineSlot(esGPT,[[300, 251], [300, 601]],'mpu1').
    //     defineSizeMapping(mpuMapping1).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "mpu1").
    //     addService(googletag.pubads());

    // // Define the seventh slot
    // gptAdSlots[6] = googletag.defineSlot(esGPT,[[300, 252], [300, 602]],'mpu2').
    //     defineSizeMapping(mpuMapping2).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "mpu2").
    //     addService(googletag.pubads());

    // // Define the eigth slot
    // gptAdSlots[7] = googletag.defineSlot(esGPT,[300, 253],'mpu3').
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "mpu3").
    //     addService(googletag.pubads());

    // // Define the ninth slot
    // gptAdSlots[8] = googletag.defineSlot(esGPT,[300, 254],'mpu4').
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "mpu4").
    //     addService(googletag.pubads());

  // Define the tenth slot for gallery
  gptAdSlots[9] = googletag.defineSlot(esGPT,[[300, 255], [320, 51]],'mpu5').
      defineSizeMapping(mpuMapping5).
      setCollapseEmptyDiv(true).
      setTargeting("tile", "mpu5").
      addService(googletag.pubads());

    // Define the eleventh slot
    gptAdSlots[10] = googletag.defineSlot(esGPT,[245, 210],'partner1').
        defineSizeMapping(partnerMapping1).
        setCollapseEmptyDiv(true).
        setTargeting("tile", "partner1").
        addService(googletag.pubads());

    // Define the twelfth slot
    gptAdSlots[11] = googletag.defineSlot(esGPT,[245, 210],'partner2').
        defineSizeMapping(partnerMapping2).
        setCollapseEmptyDiv(true).
        setTargeting("tile", "partner2").
        addService(googletag.pubads());

    // // Define the thirteenth slot
    // gptAdSlots[12] = googletag.defineSlot(esGPT,[245, 210],'partner3').
    //     defineSizeMapping(partnerMapping3).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner3").
    //     addService(googletag.pubads());

    // // Define the fourteenth slot
    // gptAdSlots[13] = googletag.defineSlot(esGPT,[245, 210],'partner4').
    //     defineSizeMapping(partnerMapping4).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner4").
    //     addService(googletag.pubads());

    // // Define the fifteenth slot
    // gptAdSlots[14] = googletag.defineSlot(esGPT,[245, 210],'partner5').
    //     defineSizeMapping(partnerMapping5).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner5").
    //     addService(googletag.pubads());

    // // Define the sixteenth slot
    // gptAdSlots[15] = googletag.defineSlot(esGPT,[245, 211],'partner6').
    //     defineSizeMapping(partnerMapping6).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner6").
    //     addService(googletag.pubads());

    // // Define the seventeenth slot
    // gptAdSlots[16] = googletag.defineSlot(esGPT,[245, 211],'partner7').
    //     defineSizeMapping(partnerMapping7).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner7").
    //     addService(googletag.pubads());

    // // Define the eighteenth slot
    // gptAdSlots[17] = googletag.defineSlot(esGPT,[245, 211],'partner8').
    //     defineSizeMapping(partnerMapping8).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner8").
    //     addService(googletag.pubads());

    // // Define the nineteenth slot
    // gptAdSlots[18] = googletag.defineSlot(esGPT,[245, 211],'partner9').
    //     defineSizeMapping(partnerMapping9).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner9").
    //     addService(googletag.pubads());

    // // Define the twentieth slot
    // gptAdSlots[19] = googletag.defineSlot(esGPT,[245, 211],'partner10').
    //     defineSizeMapping(partnerMapping10).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "partner10").
    //     addService(googletag.pubads());

    // Define the twenty first slot - znaptag
    gptAdSlots[20] = googletag.defineSlot(esGPT,[9, 9],'znaptag').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "znaptag").
        addService(googletag.pubads());


    // Define the twenty second slot - article partner slot
    gptAdSlots[21] = googletag.defineSlot(esGPT,[300, 254],'mpu6').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "mpu6").
        addService(googletag.pubads());

    // Define the twenty third slot - article partner slot
    // gptAdSlots[22] = googletag.defineSlot(esGPT,[300, 254],'mpu7').
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "mpu7").
    //     addService(googletag.pubads());

    // // Define the twenty fourth slot
    // gptAdSlots[23] = googletag.defineSlot(esGPT,[320, 480],'overlay').
    //     defineSizeMapping(overlayMapping).
    //     setCollapseEmptyDiv(true).
    //     setTargeting("tile", "overlay").
    //     addService(googletag.pubads());

    // Define the twenty fifth slot - perform video slot
    gptAdSlots[24] = googletag.defineSlot(esGPT,[300, 260],'perform').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "perform").
        addService(googletag.pubads());

    // Define the twenty seventh slot - mobile MPU
    gptAdSlots[26] = googletag.defineSlot(esGPT,[300, 258],'mpu8').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "mpu8").
        addService(googletag.pubads());

    // Define the twenty eighth slot - thirdparty tag
    gptAdSlots[27] = googletag.defineSlot(esGPT,[3, 3],'thirdparty01').
        setCollapseEmptyDiv(true).
        setTargeting("tile", "thirdparty01").
        addService(googletag.pubads());

    // Configure SRA
    googletag.pubads().enableSingleRequest();

    // targeting
    googletag.pubads().setTargeting("ksg", Krux.segments);
    googletag.pubads().setTargeting("kuid", Krux.user);
    googletag.pubads().setTargeting("khost", encodeURIComponent(location.hostname));
    googletag.pubads().setTargeting("article", articleId);
    googletag.pubads().setTargeting("pagetype", pageType);
    googletag.pubads().setTargeting("topictag", topicTags);

  googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    if (typeof event.slot.f.tile[0] !== "undefined" && event.slot.f.tile[0] === "leaderboard"){
        var tile = document.getElementById(event.slot.f.tile[0]);
        tile.style.height = event.size[1]+'px';
    }
  });

    // Start ad fetching
    googletag.enableServices();
});
