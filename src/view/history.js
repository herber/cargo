const html = require('xou');
const vxv = require('vxv');
const alert = require('./alert.js');
const dotify = require('./utils/dotify');

const styles = vxv`
height: calc(100vh - 40px);
overflow: auto;

ul {
  margin: 0;
  padding: 0;
  overflow: hidden;
  max-width: 720px;
  margin: auto;
}

li {
  text-align: left;
  display: block;
  margin: 0px auto;
  border: solid #efefef 1px;
  padding: 10px;
  margin: 10px;
}

.title {
  font-size: 1.3em;
}

.time {
  font-size: .8em;
  color: #757575;
}

.url {
  font-size: .9em;
}

a {
  color: black;
}

a:hover {
  text-decoration: underline;
}
`;

const overlayStyles = vxv`
  width: 550px;
  height: 38px;
  position: fixed;
  top: 0px;
  margin: 0px auto;
  z-index: 100;
  background: white;
  left: 0px;
  right: 0px;
  text-align: center;
  line-height: 38px;
  font-size: .8em;
`;

let toggle = false;
let a = () => {};

// const db = new dexie('history');
//
// db.version(1).stores({
//   visit: 'url, title, timestamp'
// });

module.exports = emitter => {
  const titleBarOverlay = html`<div class="${overlayStyles}">History</div>`;

  const element = html`<div class="${styles}">
    <ul class="history">
    </ul>
  </div>`;

  emitter.on('history-toggle', () => {
    if (toggle) {
      a();

      toggle = !toggle;

      document.body.removeChild(titleBarOverlay);
    } else {
      a = alert({
        // heading: 'Menu',
        text: element,
        position: 'bottom'
      });

      document.body.appendChild(titleBarOverlay);

      const history = document.querySelector('.history');

      for (let child of history.childNodes) {
        history.removeChild(child);
      }

      // db.visit
      //   .where('timestamp')
      //   .above(25)
      //   .reverse()
      //   .each(data => {
      //     const date = new Date();
      //     date.setTime(data.timestamp);
      //
      //     const li = html`<li>
      //     <span class="title">${dotify(data.title, 30)}</span>
      //     <span class="time">${date.toLocaleString()}</span>
      //     <br>
      //     <span class="url"><a onclick=${() => {
      //       emitter.emit('tabs-create', data.url);
      //       a();
      //       toggle = !toggle;
      //     }}>${dotify(data.url, 30)}</a></span>
      //   </li>`;
      //
      //     history.appendChild(li);
      //   });

      toggle = !toggle;
    }
  });

  emitter.on('history-navigated', data => {
    const time = new Date().getTime();

    // db.visit.add({
    //   url: data.url,
    //   title: data.title,
    //   timestamp: time
    // });
  });
};
