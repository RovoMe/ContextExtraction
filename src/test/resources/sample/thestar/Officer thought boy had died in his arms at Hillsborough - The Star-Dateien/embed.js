var SCRBBL = function (b, n) { var d = b.SCRBBL || {}; d.define = function (l, a) { "function" === typeof l && (a = l, l = ""); for (var f = d, m = (a || function () { return {} }).call({}, b), c = l.split("."), h = c.shift() ; h;) f = f[h] ? f[h] : f[h] = {}, h = c.shift(); for (var k in m) m.hasOwnProperty(k) && (f[k] = m[k]); return f }; d.use = function (b) { return d.define(b) }; return d }(window);
SCRBBL.define("utils", function (b, n) {
    return {
        is: { nativ: function (d) { return d && -1 < String(d).toLowerCase().indexOf("[native code]") }, objectEmpty: function (d) { for (var b in d) return !1; return !0 }, mobile: function () { return null != navigator.userAgent.match(/(Android|webOS|iPhone|iPod|BlackBerry|BB|IEMobile|Opera Mini)/ig) && null != navigator.userAgent.match(/(Mobile|Tablet)/ig) ? !0 : !1 } }, getDataAttrs: function (d) {
            var b = {}; d = d.attributes; for (var a, f = 0, m = d.length; f < m; f++) a = d[f], /^data-/.test(a.name) && (b[a.name.substr(5)] =
            a.value); return b
        }, createGUID: function () { return "xxxxxxxx".replace(/[xy]/g, function (d) { var b = 16 * Math.random() | 0; return ("x" == d ? b : b & 3 | 8).toString(16) }) }
    }
});
SCRBBL.define("utils.es5", function (b, n) {
    var d = b.document, l = b.SCRBBL.use("utils"); return {
        getElementsByClassName: function (a, f, b) {
            f = f || d; b = b || "*"; var c = []; if (l.is.nativ(d.getElementsByClassName)) f = f.getElementsByClassName(a), "*" !== b && l.is.nativ(Array.prototype.filter) ? (b = b.toUpperCase(), c = Array.prototype.filter.call(f, function (c) { return c.nodeName == b })) : c = c.slice.call(f, 0); else {
                var h = 0, k; if (l.is.nativ(d.evaluate)) for (f = d.evaluate(".//" + b + '[contains(concat(" ", @class, " "), " ' + a + ' ")]', f, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null) ; k = f.snapshotItem(h++) ;) c.push(k); else { var p = new RegExp("(^|\\s)" + a + "(\\s|$)"), g; for (f = f.getElementsByTagName(b) ; k = f[h++];) (g = k.className) && (g == a || p.test(g)) && c.push(k) }
            } return c
        }
    }
});
SCRBBL.define("inst", function (b, n) {
    var d = b.SCRBBL, l = d.use("utils"), a = function (b) { b = b.split("/"); var a = { type: b[1], id: parseInt(b[2], 10), theme: {}, state: {} }; if (!a.type.match(/event|board|timeline|slideshow|post|article|mobile|livescoreboard|manualscoreboard/ig)) throw !0; a.theme.id = 4 <= b.length ? parseInt(b[3], 10) : 0; return a }; return {
        create: function (b) {
            for (var m = {}, c = {}, h, k, p = 0, g = b.length; p < g; p++) {
                k = {}; h = b[p]; m = l.getDataAttrs(h); if (l.is.objectEmpty(m) || m.src === n) k.error = { code: 1, text: '&lt;div&gt; element with class name "scrbbl-embed" found but missing "data-src" attribute.' };
                else { try { k = a(m.src) } catch (q) { k.error = { code: 0, text: 'Error parsing the "data-src" attribute.' } } k.params = m } k.el = h; k.guid = l.createGUID(); c[k.guid] = k
            } d.instance = c
        }, parsesrc: a
    }
});
SCRBBL.define("messages", function (b, n) {
    var d = b.SCRBBL, l = b.document; d.use("utils"); var a = d.use("render.dims"), f = {
        theme: function (c, h) { var b = c.el.getElementsByTagName("iframe")[0]; c.theme = h.args.theme; b.width = b.style.width = a.width(c); b.height = b.style.height = a.height(c); c.theme.size.width_autoscale && (b.style.width = "50px", b.style.minWidth = a.width(c)); (c.params.height || c.theme.size && c.theme.size.height) && m(c, { action: "height.resize" }) }, autoscale: function (c, b) {
            var k = c.el.getElementsByTagName("iframe")[0];
            k.height = k.style.height = a.height(c, b.args.height + "")
        }, login: {
            opened: function (c, h) { c.state.open = !0; f.login.scroll.call(this, c); d.on(b, "scroll", function () { f.login.scroll.call(this, c) }) }, closed: function (c, h) { var a = b.SCRBBL, d = !0; c.state.open = !1; for (var g in a.instance) if (!a.instance[g].error && a.instance[g].state.open) { d = !1; break } d && a.off(b, "scroll") }, scroll: function (c) {
                var h = b.SCRBBL, a = l.body.scrollTop || l.documentElement.scrollTop, d = b.innerHeight; c = []; for (var g in h.instance) !h.instance[g].error && h.instance[g].state.open &&
                c.push(h.instance[g]); for (var f in c) if (h = c[f].el.getElementsByTagName("iframe")[0], g = h.getBoundingClientRect(), 0 < g.bottom && g.top < (b.innerHeight || l.documentElement.clientHeight)) { g = h; for (h = 0; g;) h += g.offsetTop, g = g.offsetParent; m(c[f], { action: "login.adjust", A: a, B: d, C: h }) }
            }
        }, lightbox: {
            opened: function (c, a) { c.state.open = !0; f.lightbox.scroll.call(this, c); d.on(b, "scroll", function () { f.lightbox.scroll.call(this, c) }) }, closed: function (c, a) {
                var k = b.SCRBBL, d = !0; c.state.open = !1; for (var g in k.instance) if (!k.instance[g].error &&
                k.instance[g].state.open) { d = !1; break } d && k.off(b, "scroll")
            }, scroll: function (c) {
                var a = b.SCRBBL, d = l.body.scrollTop || l.documentElement.scrollTop, f = b.innerHeight; c = []; for (var g in a.instance) !a.instance[g].error && a.instance[g].state.open && c.push(a.instance[g]); for (var n in c) if (a = c[n].el.getElementsByTagName("iframe")[0], g = a.getBoundingClientRect(), 0 < g.bottom && g.top < (b.innerHeight || l.documentElement.clientHeight)) {
                    g = a; for (a = 0; g;) a += g.offsetTop, g = g.offsetParent; m(c[n], {
                        action: "lightbox.adjust", A: d, B: f,
                        C: a
                    })
                }
            }
        }
    }, m = function (c, a) { if (c) { var b = c.el.getElementsByTagName("iframe")[0]; a = a || {}; b.contentWindow.postMessage([{ sender: "SCRBBL", guid: c.guid, args: a }], "*") } }; return {
        receive: function () {
            d.on(b, "message", function (c) {
                var a, b = f; "string" !== typeof a || -1 === navigator.userAgent.indexOf("MSIE 8.0") && -1 === navigator.userAgent.indexOf("MSIE 9.0") ? a = c.data[0] : (a = JSON.parse(c.data), a = a[0]); if (a !== n && a.sender !== n && "SCRBBL" == a.sender && (c = d.instance[a.guid], c !== n)) {
                    for (var l = a.args.action.split("."), g = l.shift() ; g;) b =
                    b.hasOwnProperty(g) ? b[g] : n, g = l.shift(); b && b.call(this, c, a)
                }
            })
        }, send: m
    }
});
SCRBBL.define("render.iframe", function (b, n) {
    var d = b.SCRBBL, l = b.document; d.use("utils"); var a = d.use("render.dims"), f = d.use("messages"), m = function (a) {
        var b = l.getElementById("scrbbl-js").src.split("/widgets/embed.js")[0], d, f = "", g; if (a.params) for (d in a.params) a.params.hasOwnProperty(d) && 0 == d.indexOf(a.type + "-") && (g = d.replace(a.type + "-", "")) && (g = encodeURIComponent(g) + "=" + encodeURIComponent(a.params[d]), f = f + "&" + g); d = /[\?&]_scrbbl=([^&#]*)/.exec(l.location.search); d = null === d ? null : d[1]; return b + {
            event: "/Embed/v7.aspx",
            board: "/widgets/pinboard/pinboard.aspx", article: "", timeline: "/widgets/timeline/timeline.aspx", slideshow: "", post: "/Embed/post.aspx", mobile: "/Event/mobile.aspx", livescoreboard: "/widgets/livescoreboard/livescoreboard.aspx", manualscoreboard: "/widgets/manualscoreboard/manualscoreboard.aspx"
        }[a.type] + "?Id=" + a.id + (0 !== a.theme.id ? "&ThemeId=" + a.theme.id : "") + (null !== d ? "&_scrbbl=" + d : "") + f
    }; return {
        iframe: function (c) {
            var b = navigator.appVersion.match("MSIE 8") || navigator.appVersion.match("MSIE 9"), b = '<iframe name="' +
            c.guid + '" width="' + a.width(c) + '" height="' + a.height(c) + '" frameborder="0" allowtransparency="true" ' + (b ? 'scrolling="yes" ' : 'scrolling="no" ') + 'title="scrbbl:' + c.type + ' ScribbleLive Embed" src="' + m(c) + '" class="scrbbl-embed scrbbl-' + c.type + '" style="border: none; visibility: visible;' + (a.width(c) ? " width:" + a.width(c) + ";" : "") + (a.height(c) ? " height:" + a.height(c) + ";" : "") + '"></iframe>'; c.el.style.visibility = "hidden"; c.el.innerHTML = b; d.on(c.el.getElementsByTagName("iframe")[0], "load", function () {
                c.el.style[c.el.style.removeProperty ?
                "removeProperty" : "removeAttribute"]("visibility"); (c.params.height || c.theme.size && !c.theme.size.height_autoscale && c.theme.size.height) && f.send(c, { action: "height.fixed" })
            })
        }
    }
});
SCRBBL.define("render.dims", function (b, n) {
    var d = b.document; b.SCRBBL.use("utils"); var l = function (a) { return a ? (a + "").match(/px|\%/ig) ? a : a + "px" : "" }; return {
        width: function (a) { var f = "", f = d.querySelector === n, f = a.params.width ? a.params.width : !b.postMessage || f ? "100%" : 0 !== a.theme.id && a.theme.size && a.theme.size.width_autoscale ? "100%" : 0 !== a.theme.id && a.theme.size && a.theme.size.width ? a.theme.size.width : "100%"; return l(f) }, height: function (a, f) {
            var m = "", m = {
                event: "500px", board: "500px", article: "500px", timeline: (800 <
                b.innerHeight ? "800" : b.innerHeight + 25) + "px", slideshow: "500px", post: "200px", mobile: "100%", livescoreboard: "500px", manualscoreboard: "500px"
            }, c = d.querySelector === n, m = a.params.height ? a.params.height : !b.postMessage || c ? m[a.type] : 0 !== a.theme.id && a.theme.size && a.theme.size.height_autoscale ? f ? f : m[a.type] : 0 !== a.theme.id && a.theme.size && a.theme.size.height ? a.theme.size.height : f ? f : m[a.type]; return l(m)
        }
    }
});
SCRBBL.define(function (b, n) {
    var d = b.SCRBBL, l = b.document, a = d.use("utils"), f = d.use("inst"), m = d.use("render.iframe"), c = d.use("messages"), h = function () { }, k = function () { }; "addEventListener" in b ? (h = function (a, b, c) { a.addEventListener(b, c, !1) }, k = function (a, b, c) { a.removeEventListener(b, c, !1) }) : "attachEvent" in b && (h = function (a, b, c) { a.attachEvent("on" + b, c) }, k = function (a, b, c) { a.detachEvent("on" + e, c) }); return {
        go: function () {
            var b = !1, g; f.create(a.es5.getElementsByClassName("scrbbl-embed", l, "div")); for (var h in d.instance) g =
            d.instance[h], g.error || (m.iframe(g), b = !0); b && c.receive()
        }, on: h, off: k
    }
}); SCRBBL.go();