(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
!function(t,i){"use strict";var n="undefined"!=typeof window?window.$:"undefined"!=typeof global?global.$:null;module.exports=i(t,exports,n)}(this,function(t,i,n){"use strict";function s(t,i,n){return this.list=t,this.i=0,this.callback=i,this.interval=n,this}s.prototype.callEach=function(){var t=this.callback(this.list[this.i],this.i);this.i++,(t===!1||this.list.length<=this.i)&&this.stop()},s.prototype.start=function(){this.interval=setInterval(this.callEach.bind(this),this.interval)},s.prototype.stop=function(){clearInterval(this.interval)},n.fn.periodicalEach=function(t,i){if(void 0===this.length||0===this.length)return this;var n=new s(this,t,i);return n.start(),this},n.periodicalEach=function(t,i,n){if(void 0===t||0===t.length)return t;var e=new s(t,i,n);return e.start(),e}});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
