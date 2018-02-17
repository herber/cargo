const html = require('xou');
const vxv = require('vxv');
const alert = require('./alert.js');

const styles = vxv`
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

li {
  display: block;
  float: left;
  margin: 0px auto;
  width: 25%;
}

li a {
  display: block;
  color: black;
  text-align: center;
  padding: 14px 16px 14px 16px;
  text-decoration: none;
}

.back, .forward {
  font-size: 12px;
}
`;

let toggle = false;
let a = () => {};

module.exports = (emitter, state) => {
  // const commands = [
  //   { command: 'alt', description: 'Open menu' },
  //   { command: 'command + shift + d', description: 'Open devtools' },
  //   { command: 'command + left', description: 'Go black' },
  //   { command: 'command + right', description: 'Go forward' },
  //   { command: 'command + r', description: 'Reload' },
  //   { command: 'command + h', description: 'Go home' },
  // ]

  // <table>
  // ${commands.map((cmd) => {
  //   return html`<tr>
  //   <td class="shortcut">${ cmd.command }</td>
  //   <td>${ cmd.description }</td>
  //   </tr>`
  // })}
  // </table>

  const element = html`<div class="${ styles }">
    <ul>
      <li><a class="home">Home</a></li>
      <li><a class="about">About</a></li>
      <li><a class="back">◀</a></li>
      <li><a class="forward">▶</a></li>
    </ul>
  </div>`;

  emitter.on('menu-toggle', () => {
    if (toggle) {
      document.querySelector('.home').removeEventListener('click', home);
      document.querySelector('.about').removeEventListener('click', about);
      document.querySelector('.forward').removeEventListener('click', forward);
      document.querySelector('.back').removeEventListener('click', back);

      a();

      toggle = !toggle;
    } else {
      a = alert({
        // heading: 'Menu',
        text: element,
        position: 'bottom'
      });

      document.querySelector('.home').addEventListener('click', home);
      document.querySelector('.about').addEventListener('click', about);
      document.querySelector('.forward').addEventListener('click', forward);
      document.querySelector('.back').addEventListener('click', back);

      toggle = !toggle;
    }
  });

  const forward = () => {
    emitter.emit('webview-forward');
    emitter.emit('menu-toggle');
  };

  const back = () => {
    emitter.emit('webview-back');
    emitter.emit('menu-toggle');
  };

  const home = () => {
    emitter.emit('webview-home');
    emitter.emit('menu-toggle');
  };

  const about = () => {
    emitter.emit('webview-about');
    emitter.emit('menu-toggle');
  };
};
