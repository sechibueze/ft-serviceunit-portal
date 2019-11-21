let data = [
  {
    firstname: 'Sam',
    lastname: 'chibueze'
  },
  {
    firstname: 'Chidinma',
    lastname: 'Darlington'
  },
  {
    firstname: 'Abigail',
    lastname: 'Tiamiyt'
  }
]

function sortObj(array, key = '') {
  return array.sort((a, b) => {
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

console.log(sortObj(data, 'lastname'))
