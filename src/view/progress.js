const nprogress = require('nprogress');

module.exports = (emitter) => {
  nprogress.configure({ showSpinner: false });

  emitter.on('progress-start', () => {
    nprogress.start();
  });

  emitter.on('progress-stop', () => {
    nprogress.done();
  })
};
