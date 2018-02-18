'use strict';
const electron = require('electron');
const isDev = require('electron-is-dev');
const window = require('./window');

require('events').EventEmitter.prototype._maxListeners = 100;

const app = electron.app;

app.setName('Cargo');

if (isDev) {
  require('electron-debug')();
}

let mainWindow;

function onClosed() {
  mainWindow = null;
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = window(onClosed);
  }
});

app.on('ready', () => {
  mainWindow = window(onClosed);
});
