var array = [
  {
    id: 1,
    name: 'carrots',
    description: 'carrots',
    price_in_cents: 1000,
    picture_url: 'google it'
  },
  {
    id: 2,
    name: 'spinach',
    description: 'spinach',
    price_in_cents: 700,
    picture_url: 'google it again'
  },
  {
    id: 3,
    name: 'cookies',
    description: 'cookies',
    price_in_cents: 900,
    picture_url: 'not google it'
  },
  {
    id: 4,
    name: 'Pizza',
    description: 'Pizza',
    price_in_cents: 1500,
    picture_url: 'you dont know pizza'
  }
];
const arrayToObject = (arr, keyField) =>
    arr.reduce((obj, item) => {
    obj[item[keyField]] = item
    return obj
  }, {})
const peopleObject = arrayToObject(array, "id")
console.log(peopleObject)



const data = [
  { key: 1, name: "A", condition: true },
  { key: 4, name: "B", condition: false },
  { key: 7, name: "C", condition: true },
  { key: 11, name: "D", condition: true },
  { key: 12, name: "E", condition: false }
]



const arrayToObject3 = (arr) =>
Object.assign({}, arr.map(item => ({ item})))

const arrayToObject4 = (arr) =>
arr.reduce((obj, item) => (( item), obj), {});



console.log("----------key------------")

console.log(arrayToObject4(data))
