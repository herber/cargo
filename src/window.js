const electron = require('electron');
const path = require('path');
const platform = require('./utils/platform.js');

module.exports = (onClosed) => {
  const display = electron.screen.getPrimaryDisplay();

  let width = Math.floor(display.workAreaSize.width * 0.7);
  let height = Math.floor(display.workAreaSize.height * 0.8);

  if (width > 1440) width = 1440;
  if (height > 900) height = 900

  let image = electron.nativeImage.createFromPath(path.join(__dirname, './static/icon.png'));

  const win = new electron.BrowserWindow({
    width,
    height,
    minWidth: 800,
    minHeight: 500,
    center: true,
    vibrancy: 'light',
    background: '#ffffff',
    titleBarStyle: 'hiddenInset',
    frame: platform() != 'mac' ? false : true,
    show: false,
    webPreferences: {
      nodeIntegration: true
    },
    title: 'Cargo',
    icon: image
  });

  win.once('ready-to-show', () => {
    win.show()
  });

  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', onClosed);

  if (platform() == 'windows') {
    win.setMenu(null);
  } else {
    const menu = electron.Menu.buildFromTemplate([
      {
        label: 'Cargo',
        submenu: [
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {role: 'undo'},
          {role: 'redo'},
          {type: 'separator'},
          {role: 'cut'},
          {role: 'copy'},
          {role: 'paste'},
          {role: 'pasteandmatchstyle'},
          {role: 'delete'},
          {role: 'selectall'}
        ]
      },
      {
        label: 'View',
        submenu: [
          {role: 'reload'},
          {role: 'forcereload'},
          {role: 'toggledevtools'},
          {type: 'separator'},
          {role: 'resetzoom'},
          {role: 'zoomin'},
          {role: 'zoomout'},
          {type: 'separator'},
          {role: 'togglefullscreen'}
        ]
      },
      {
        role: 'window',
        submenu: [
          {role: 'minimize'},
          {role: 'close'}
        ]
      }
    ]);

    win.setMenu(menu);
  }

  return win;
};
