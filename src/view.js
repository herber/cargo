const path = require('path');
module.paths.push(path.resolve('../node_modules'));

const mitt = require('mitt');
const keyval = require('idb-keyval');
// const Store = require('electron-store');

const webview = require('./view/webview');
const keyboard = require('./view/keyboard');
const menu = require('./view/menu');
const titlebar = require('./view/titlebar');
const tabs = require('./view/tabs');
const progress = require('./view/progress');
const history = require('./view/history');
// const onboarding = require('./view/onboarding');

const emitter = mitt();
// const store = new Store();

const state = {
  url: 'https://home.cargo',
  views: [],
  // store
};

titlebar(emitter, state);
progress(emitter);
history(emitter);
webview(emitter, state);
menu(emitter, state);
keyboard(emitter, state);
// onboarding(emitter, state);

setTimeout(() => {
  tabs(emitter, state);
}, 200);

document.querySelector('.urlbar').focus();

keyval.get('tabs').then((val) => {
  if (val == undefined) {
    keyval.set('tabs', []);
  }

  if (val.length == 0) {
    emitter.emit('webview-create');
  } else {
    for (let v of val) {
      emitter.emit('webview-create', v);
    }
  }
})

setInterval(() => {
  const tabs = [];

  for (let view of state.views) {
    tabs.push(document.querySelector('#' + view.id).getURL());
  }

  keyval.set('tabs', tabs);
}, 500);

emitter.on('tabs-db-flush', () => {
  keyval.set('tabs', []);
});
