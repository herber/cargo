const mousetrap = require('mousetrap');

module.exports = (emitter, state) => {
  mousetrap.bind(['alt'], () => {
    emitter.emit('tabs-toggle');
    return false;
  });

  mousetrap.bind(['command+m', 'ctrl+m'], () => {
    emitter.emit('menu-toggle');
    return false;
  });

  mousetrap.bind(['command+shift+d', 'ctrl+shift+d'], () => {
    emitter.emit('webview-devtools');
    return false;
  });

  mousetrap.bind(['command+shift+a', 'ctrl+shift+a'], () => {
    emitter.emit('webview-about');
    return false;
  });

  Mousetrap.bind(['command+left', 'ctrl+left'], () => {
    emitter.emit('webview-back');
    return false;
  });

  Mousetrap.bind(['command+right', 'ctrl+right'], () => {
    emitter.emit('webview-forward');
    return false;
  });

  Mousetrap.bind(['command+r', 'ctrl+r', 'f5'], () => {
    emitter.emit('webview-reload');
    return false;
  });

  Mousetrap.bind(['command+h', 'ctrl+h'], () => {
    emitter.emit('webview-home');
    return false;
  });

  Mousetrap.bind(['command+t', 'ctrl+t'], () => {
    emitter.emit('tabs-create');
    return false;
  });

  Mousetrap.bind(['command+w', 'ctrl+w'], () => {
    emitter.emit('tabs-remove-current');
    return false;
  });

  Mousetrap.bind(['command+shift+left', 'ctrl+shift+left'], () => {
    emitter.emit('tabs-prev');
    return false;
  });

  Mousetrap.bind(['command+shift+right', 'ctrl+shift+right'], () => {
    emitter.emit('tabs-next');
    return false;
  });

  Mousetrap.bind(['command+0', 'ctrl+0'], () => {
    emitter.emit('tabs-last');
    return false;
  });

  let fullscreen = false;

  Mousetrap.bind(['f11'], () => {
    const remote = require('electron').remote;
    let w = remote.getCurrentWindow();

    fullscreen = !fullscreen;
    w.setFullScreen(fullscreen);

    return false;
  });

  for (let i = 1; i <= 9; i++) {
    Mousetrap.bind(['command+' + i, 'ctrl+' + i], () => {

      emitter.emit('tabs-go-to', i - 1);
      return false;
    });
  }
};
