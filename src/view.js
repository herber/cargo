const path = require('path');
module.paths.push(path.resolve('../node_modules'));

const mitt = require('mitt');

const webview = require('./view/webview');
const keyboard = require('./view/keyboard');
const menu = require('./view/menu');
const titlebar = require('./view/titlebar');
const tabs = require('./view/tabs');
const progress = require('./view/progress');
const history = require('./view/history');

const emitter = mitt();
const state = {
  url: 'https://home.cargo',
  views: []
};

titlebar(emitter, state);
progress(emitter);
history(emitter);
webview(emitter, state);
emitter.emit('webview-create');
menu(emitter, state);
keyboard(emitter, state);

setTimeout(() => {
  tabs(emitter, state);
}, 400);

document.querySelector('.urlbar').focus();
