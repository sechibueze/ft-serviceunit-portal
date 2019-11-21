module.exports = function (arrayOfObj, key = '') {
  return arrayOfObj.sort((a, b) => {
    let first = a[key].toUpperCase();
    let second = b[key].toUpperCase();

    if (first < second) {
      return -1
    }
    if (first > second) {
      return 1
    }

    return 0;
  })
}