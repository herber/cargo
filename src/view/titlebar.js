const html = require('xou');
const vxv = require('vxv');
const vkey = require('vkey');
const betterUrl = require('./utils/betterURL');

require('electron-titlebar');

const topbarStyle = vxv`
  width: 100%;
  -webkit-app-region: drag;

  & .bar {
    border-bottom: solid #BDBDBD 1px;
    background: white;
  }

  & .bg {
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 40px;
    text-align: center;
    color: #616161;
  }

  & .input {
    text-align: center;
    background: white;
    color: #616161;
    padding: 5px 10px;
    width: 550px;
    margin: 7px auto 0px auto;
    border: solid transparent 1px;
    border-radius: 3px;
    outline: none;
    transition: all .3s;
    -webkit-app-region: no-drag;
    left: 0px;
    right: 0px;
    top: 0px;
    position: fixed;

    &:hover, &:focus {
      border: solid #BDBDBD 1px;
      background: #FAFAFA;
    }

    &::-moz-selection { background: yellow; }
    &::selection { background: yellow; }
  }
`;

module.exports = (emitter, state) => {
  let width = document.body.clientWidth - 300;
  if (width > 500) width = 500;

  const element = html`<div>
    <div class="${topbarStyle}">
      <div id="electron-titlebar" class="inset bar"></div>
      <span class="bg"></span>
      <input type="text" class="input urlbar" style="width: ${width}px" value="${state.url}">
    </div>
  </div>`;

  document.body.appendChild(element);

  emitter.on('titlebar-title-updated', () => {
    if (!state.hovering) {
      document.querySelector('.urlbar').value = state.title;
    }
  });

  emitter.on('titlebar-url-updated', () => {
    if (state.hovering) {
      document.querySelector('.urlbar').value = betterUrl(state.url);
    }
  });

  document.querySelector('.urlbar').addEventListener('mouseover', () => {
    document.querySelector('.urlbar').value = betterUrl(state.url);
    document.querySelector('.urlbar').focus();
    document.querySelector('.urlbar').select();

    state.hovering = true;
  });

  document.querySelector('.urlbar').addEventListener('mouseleave', () => {
    document.querySelector('.urlbar').value = state.title;
    document.querySelector('.urlbar').blur();

    emitter.emit('webview-set-focus');
    state.hovering = false;
  });

  document.querySelector('.urlbar').addEventListener(
    'keydown',
    ev => {
      if (vkey[ev.keyCode] == '<enter>') {
        ev.preventDefault();
        emitter.emit('navigate', document.querySelector('.urlbar').value);
      }
    },
    false
  );
};
