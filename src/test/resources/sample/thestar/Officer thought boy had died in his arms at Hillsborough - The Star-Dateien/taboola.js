(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(e,t){"use strict";var i="undefined"!=typeof window?window.$:"undefined"!=typeof global?global.$:null;module.exports=t(e,exports,i,window.WURFL||{})}(this,function(e,t,i,n){"use strict";var r=function(){var e=function(){return r.platform?r.platform:"Desktop"===n.form_factor||"Tablet"===n.form_factor||"Smart-TV"===n.form_factor||"Other non-Mobile"===n.form_factor?"desktop":"Smartphone"===n.form_factor||"Feature Phone"===n.form_factor||"Other Mobile"===n.form_factor?"mobile":void 0};return{getPlatform:e}};return window.Taboola=r,r});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=taboola.min.js.map
