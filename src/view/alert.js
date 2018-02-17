const xou = require('xou');
const vxv = require('vxv');

const alertStyles = vxv`
  font-family: sans-serif;
  left: 0px;
  right: 0px;
  position: fixed;
  padding: 8px 15px;
  background: white;
  text-align: center;
  opacity: 0;
  transition: all .3s;
  margin: 0px;
  padding: 0px;

  & h1 {
    margin: 10px 0px 5px 0px;
  }

  & p {
    margin: 0px 0px 0px 0px;
  }

  &.top {
    border-bottom: solid #E0E0E0 1px;
    top: 0px;
  }

  &.bottom {
    border-top: solid #E0E0E0 1px;
    bottom: 0px;
  }
`;

module.exports = opts => {
  opts.classes = opts.classes || [];
  opts.position = opts.position || 'top';

  opts.classes = typeof opts.classes == 'string' ? [opts.classes] : opts.classes;

  if (opts.position !== 'top' && opts.position !== 'bottom') {
    throw new Error('position must be `top` or `bottom`');
  }

  const heading = (opts.noH1 == false) ? xou`<h1>${opts.heading}</h1>` : '';

  const element = xou`<div class="${alertStyles} ${opts.position} ${opts.classes.join(' ')}">
    ${ heading }
    <p>${opts.text}</p>
  </div>`;

  document.body.appendChild(element);

  setTimeout(() => {
    element.style.opacity = 1;
  }, 5);

  const fn = () => {
    element.style.opacity = 0;

    setTimeout(() => {
      element.remove();
    }, 300);
  };

  return fn;
};
