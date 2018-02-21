module.exports = (str, len) => {
  len = len || 25;

  if (str.length > len) {
    return str.substr(0, len - 3) + '...';
  }

  return str;
};
