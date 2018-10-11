const html = require('xou');
const vxv = require('vxv');

const style = vxv`
z-index: 20;
background. white;
position: fixed;
left: 0px;
right: 0px;
bottom: 0px;
top: 38px;
text-align: center;
`;

module.exports = (emitter, state) => {
  if (!state.store.has('onboarding-done')) {
    const element = html`<div>
      <div id="onboarding" class="${style}">
        <h1>Hello world</h1>
      </div>
    </div>`;

    document.body.appendChild(element);

    // state.store.set('onboarding-done', true);
  }
};
