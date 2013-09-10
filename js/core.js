/* Globals */
window.currentFile=null;
window.editor=null;
window.simplemode=false;

/* Node imports and WebKit globals */
var gui = require('nw.gui');
var fs = require('fs');
var win=gui.Window.get();