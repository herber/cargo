const pages = require('./pages');

module.exports = (url) => {
  if (url.startsWith('file:///')) {
    for (let p in pages) {
      if (url.indexOf(pages[p].substr(1)) != -1) {
        return `https://${ p }`;
      }
    }
  }

  return url;
};
