(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(o,r){"use strict";var t="undefined"!=typeof window?window.$:"undefined"!=typeof global?global.$:null;module.exports=r(o,exports,t,window.WURFL||{})}(this,function(o,r,t,e){"use strict";var f=function(){var o=function(o){return f.platform?f.platform:"Desktop"===e.form_factor||"Tablet"===e.form_factor||"Smart-TV"===e.form_factor||"Other non-Mobile"===e.form_factor?"desktop":"Smartphone"===e.form_factor||"Feature Phone"===e.form_factor||"Other Mobile"===e.form_factor?"mobile":void 0};return{getPlatform:o}};return window.Taboola=f,f});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=taboola.min.js.map
