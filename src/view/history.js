/*
  TODO: add history
*/

module.exports = (emitter) => {
  emitter.on('history-navigated', (history) => {
    const time = (new Date()).getTime();
  });
};
