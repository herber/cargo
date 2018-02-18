const html = require('xou');
const vxv = require('vxv');
const { parse } = require('tldjs');
const normalizeUrl = require('normalize-url');
const url = require('url');
const electron = require('electron');
const { BrowserWindow } = electron.remote;
const path = require('path');

const pages = require('./pages');

const isCargoUrl = (url) => {
  if (url.startsWith('file:///')) {
    for (let p in pages) {
      if (url.indexOf(pages[p].substr(1)) != -1) {
        return true;
      }
    }
  }

  return false;
};

const uuid = () => {
  let uuid = '', i, random;

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }

    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return uuid;
}

module.exports = (emitter, state) => {
  let focusedView = -1;

  /*
    DOM Listeners
  */
  const didStartLoading = () => {
    emitter.emit('progress-start');
  };

  const didStopLoading = () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.style.background = 'white';
    emitter.emit('progress-stop');
  };

  const pageTitleUpdated = () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    state.title = 'Loading';

    try {
      state.title = webview.getTitle();
    } catch (err) {}

    emitter.emit('titlebar-title-updated');
    emitter.emit('tabs-render');
  };

  const didNavigate = () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    state.url = webview.getURL();
    emitter.emit('titlebar-url-updated');
    emitter.emit('history-navigated', { url: state.url, title: webview.getTitle() });
  };

  const click = () => {
    emitter.emit('titlebar-title-updated');
  };

  const loadingError = (err) => {
    console.log(err);
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.setAttribute('src', './pages/error.html');
  };

  const newWindow = (e) => {
    const protocol = url.parse(e.url).protocol;

    if (e.disposition == 'new-window') {
      let win = new BrowserWindow({
        width: 800,
        height: 600,
        modal: true,
        webPreferences: {
          nodeIntegration: false
        },
        title: 'Cargo',
        icon: path.join(__dirname, '../static/icon.png')
     });

      win.on('closed', () => {
        win = null
      });

      win.loadURL(e.url);
    } else if (e.disposition == 'foreground-tab' || e.disposition == 'background-tab' || e.disposition == 'default' || e.disposition == 'other') {
      emitter.emit('tabs-create', e.url);
    }
  };

  /*
    Tab management methods
  */
  const changeView = (id) => {
    const el = state.views[id];

    if (focusedView >= 0) state.views[focusedView].element.style.display = 'none';

    el.element.style.display = 'block';
    el.element.focus();

    focusedView = id;

    pageTitleUpdated();

    emitter.emit('tabs-render');
  };

  const create = (src) => {
    const id = '_wv_' + uuid();
    src = src || './pages/home.html';

    const viewElement = html`<div style="display: none;">
      <webview id="${ id }" src="${ src }" allowpopups autosize style="width: 100%; height: calc(100vh - 40px);"></webview>
    </div>`;

    document.body.appendChild(viewElement);

    state.views.push({
      element: viewElement,
      id
    });

    changeView(state.views.length - 1);

    const webview = document.querySelector(`#${ id }`);

    webview.addEventListener('did-start-loading', didStartLoading);
    webview.addEventListener('did-stop-loading', didStopLoading);
    webview.addEventListener('page-title-updated', pageTitleUpdated);
    webview.addEventListener('did-navigate', didNavigate);
    webview.addEventListener('click', click);
    webview.addEventListener('did-fail-load', loadingError);
    webview.addEventListener('new-window', newWindow);

    return state.views.length - 1;
  };

  const remove = (id) => {
    const el = state.views[id];

    const webview = document.querySelector(`#${ el.id }`);

    webview.removeEventListener('did-start-loading', didStartLoading);
    webview.removeEventListener('did-stop-loading', didStopLoading);
    webview.removeEventListener('page-title-updated', pageTitleUpdated);
    webview.removeEventListener('did-navigate', didNavigate);
    webview.removeEventListener('click', click);
    webview.removeEventListener('did-fail-load', loadingError);
    webview.removeEventListener('new-window', newWindow);

    state.views.splice(id, 1);
    focusedView = 0;

    if (state.views.length == 0) {
      emitter.emit('tabs-db-flush');

      const remote = require('electron').remote;
      let w = remote.getCurrentWindow();
      w.close();
    }

    id = id - 1;

    if (id < 0) {
      id = 0;
    }

    changeView(id);
  };

  /*
    Events
  */
  emitter.on('webview-create', create);
  emitter.on('webview-remove', remove);
  emitter.on('webview-change', changeView);

  emitter.on('webview-set-focus', () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.focus();
  });

  emitter.on('webview-devtools', () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.openDevTools();
  });

  emitter.on('webview-back', () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.goBack();
  });

  emitter.on('webview-forward', () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.goForward();
  });

  emitter.on('webview-reload', () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.reload();
  });

  emitter.on('webview-home', () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.setAttribute('src', './pages/home.html');
  });

  emitter.on('webview-about', () => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.setAttribute('src', './pages/about.html');
  });

  emitter.on('navigate', (slug) => {
    const webview = document.querySelector(`#${ state.views[focusedView].id }`);
    webview.focus();

    const url = normalizeUrl(slug);
    const parsed = parse(url, true);

    if (!slug.startsWith('http://') && !slug.startsWith('https://')) {
      slug = 'http://' + slug;
    }

    if (url.startsWith('file:///')) {
      return webview.loadURL(slug);
    }

    if (parsed.domain != null && parsed.isValid == true) {
      if (pages[parsed.domain] != null) {
        webview.setAttribute('src', pages[parsed.domain]);
      } else {
        webview.loadURL(slug);
      }
    } else {
      webview.loadURL(`https://duckduckgo.com/?q=${ document.querySelector('.urlbar').value }`);
    }
  });

  emitter.on('tabs-next', () => {
    if (focusedView + 1 < state.views.length) {
      changeView(focusedView + 1);
    }
  });

  emitter.on('tabs-prev', () => {
    if (focusedView - 1 >= 0) {
      changeView(focusedView - 1);
    }
  });

  emitter.on('tabs-go-to', (id) => {
    if (id < state.views.length && id >= 0) {
      changeView(id);
    }
  });

  emitter.on('tabs-last', () => {
    changeView(state.views.length - 1);
  });
};
