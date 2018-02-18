const path = require('path');
module.paths.push(path.resolve('../node_modules'));

const mitt = require('mitt');
const dexie = require('dexie');

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
menu(emitter, state);
keyboard(emitter, state);

setTimeout(() => {
  tabs(emitter, state);
}, 400);

document.querySelector('.urlbar').focus();

let db = new dexie('tabs');
db.version(1).stores({
  tabRestore: 'url'
});

db.tabRestore.count((count) => {
  if (count == 0) {
    emitter.emit('webview-create');
  } else {
    db.tabRestore.each(view => {
      emitter.emit('webview-create', view.url);
    });
  }
})

setInterval(() => {
  db.delete().then(() => {
    try {
      db = new dexie('tabs');
      db.version(1).stores({
        tabRestore: 'url'
      });
    } catch (err) {}

    for (let view of state.views) {
      db.tabRestore.put({ url: document.querySelector('#' + view.id).getURL(), title: document.querySelector('#' + view.id).getTitle() });
    }
  });
}, 500);

emitter.on('tabs-db-flush', () => {
  db.delete();
})
