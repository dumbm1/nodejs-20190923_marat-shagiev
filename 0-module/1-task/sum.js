function sum(a, b) {
  if (!isNumber(a) || !isNumber(b)) throw new TypeError();
  return +a + +b;

  function isNumber(a) {
    return isFinite(a) && a === parseInt(a, 10);
  }
}

module.exports = sum;
