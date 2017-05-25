/*!
 * Barlesque - ORB and all
 * Copyright (c) 2015 BBC, all rights reserved.
 */
define("orb/api",function(){"use strict";var n={layout:[]},t=(window.orb.fig(),{}),r={layout:function(t){n.layout.push(t)},trigger:function(t,r){if(n[t])for(var i=0,o=n[t].length;o>i;i++)n[t][i](r)},config:function(n,r){return 0===arguments.length?t:1===arguments.length?t[n]:void(t[n]=r)}};return r});