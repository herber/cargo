const html = require('xou');
const vxv = require('vxv');
const alert = require('./alert.js');
const pages = require('./pages.js');

const styles = vxv`
top: 41px;
left: 0px;
right: 0px;
position: fixed;
padding: 8px 15px;
background: white;
text-align: center;
margin: 0px;
padding: 0px;
border-bottom: solid #E0E0E0 1px;
transition: opacity .3s;

display: none;
opacity: 0;

:global(.tabs) {
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  margin-top: 41px;
}

:global(.simplebar-scrollbar) {
  border-radius: 0px!important;
}

:global(.simplebar-track.horizontal) {
  height: 3px;
}

:global(.horizontal.simplebar-track .simplebar-scrollbar) {
  top: 0px;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow-x: auto;
  overflow-y: hidden;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  margin-bottom: -1px;
}

li {
  margin-top: 0px;
  display: inline-block;
  margin: 0px auto;
  width: 180px;
  padding: 10px 16px 10px 16px;
  border-right: solid #E0E0E0 1px;
  heigth: 100%;
  transition: all .3s;
  position: relative;
  font-size: 12px;
  font-weight: 500;
}

li a {
  color: black;
  text-align: center;
  text-decoration: none;
}

li:hover {
  background: #F5F5F5;

  .close {
    opacity: 1;
  }
}

li.active {
  border-bottom: solid black 1px;

  .close {
    opacity: 1;
  }
}

.back, .forward {
  font-size: 12px;
}

.close {
  position: absolute !important;
  right: 7px;
  top: 9px;
  opacity: 0;
  transition: all .3s;
  cursor: pointer;
}

.close:hover {
  font-weight: 900;
}
`;

let toggle = false;
let a = () => {};

const dotify = (str) => {
  if (str.length > 25) {
    return str.substr(0, 22) + '...';
  }

  return str;
};

const betterUrl = (url) => {
  if (url.startsWith('file:///')) {
    for (let p in pages) {
      if (url.indexOf(pages[p].substr(1)) != -1) {
        return `https://${ p }`;
      }
    }
  }

  return url;
};

module.exports = (emitter, state) => {
  const render = () => {
    const el = html`<div class="${ styles }">
      <ul class="tabs-bar">
        ${ state.views.map((view, id) => {
          const webview = document.querySelector(`#${ view.id }`);
          const active = view.element.style.display == 'block' ? true : false;
          let title = 'Loading';

          try {
            title = dotify(webview.getTitle());
          } catch (err) {}

          if (title == '' || title == ' ' || title == undefined) {
            title = dotify(webview.getURL());
          }

          if (title == '' || title == ' ' || title == undefined) {
            title = dotify(betterUrl(webview.getAttribute('src')) || 'Loading');
          }

          let closeClicked = false;

          return html`<li class="${ active == true ? 'active' : '' }" onclick=${ () => {
            if (!closeClicked) {
              emitter.emit('webview-change', id);
              emitter.emit('tabs-render');
            }
          } }><a class="nav">${ title } <span class="close" onclick=${ (e) => {
            closeClicked = true;
            e.preventDefault();
            emitter.emit('webview-remove', id);

            setTimeout(() => {
              closeClicked = false;
            }, 10);
          } }>×</span></a></li>`
        }) }
      </ul>
    </div>`;

    new SimpleBar(el.querySelector('.tabs-bar'));

    if (toggle) {
      el.style.opacity = '0';
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
      el.style.opacity = '1';
    }

    return el;
  }

  const element = render();
  let closeTabsTimeout = setTimeout(() => {
    emitter.emit('tabs-toggle');
  }, 10000);;

  document.body.appendChild(element);

  emitter.on('tabs-render', () => {
    const newEl = render();
    html.update(element, newEl);
    clearTimeout(closeTabsTimeout);
    closeTabsTimeout = setTimeout(() => {
      emitter.emit('tabs-toggle');
    }, 10000);
  });

  emitter.on('tabs-toggle', () => {
    if (element.style.display == 'block') {
      clearTimeout(closeTabsTimeout);

      element.style.opacity = '0';

      setTimeout(() => {
        element.style.display = 'none';
      }, 280);

      toggle = false;
    } else {
      element.style.display = 'block';

      setTimeout(() => {
        element.style.opacity = '1';
      }, 5);

      toggle = true;

      clearTimeout(closeTabsTimeout);
      closeTabsTimeout = setTimeout(() => {
        emitter.emit('tabs-toggle');
      }, 10000);
    }
  });

  emitter.on('tabs-create', (src) => {
    emitter.emit('webview-create', src);
    emitter.emit('tabs-render');
  });

  emitter.on('tabs-remove-current', () => {
    state.views.forEach((view, id) => {
      const active = view.element.style.display == 'block' ? true : false;

      if (active) {
        emitter.emit('webview-remove', id);
        emitter.emit('tabs-render');
      }
    });
  });
};
