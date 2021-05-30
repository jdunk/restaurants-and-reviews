module.exports = function matchesEmailRegex(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
};
