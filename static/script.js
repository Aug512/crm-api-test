'use strict'

const USERS_COUNTER = 4
const MIN_BIRTH_DATE = Date.parse(new Date(0)); //01.01.1970
const MAX_BIRTH_DATE = Date.parse(new Date(2000, 12, 31)); //YYYY, MM, DD
const libs = [    // Заполнил по рандомным топам из интернета для некоторого разнообразия
  {
    names: [
      'Елена',
      'Анна',
      'Наталья',
      'Ольга',
      'Светлана',
      'Юлия',
      'Мария',
      'Ирина',
      'Екатерина',
      'Татьяна',
    ],
    surNames: [
      'Смирнова',
      'Иванова',
      'Кузнецова',
      'Соколова',
      'Попова',
      'Лебедева',
      'Козлова',
      'Новикова',
      'Морозова',
      'Петрова',
    ],
    protoNames: [
      'Александровна',
      'Алексеевна',
      'Сергеевна',
      'Андреевна',
      'Дмитриевна',
      'Михайловна',
      'Павловна',
      'Ивановна',
      'Константиновна',
      'Викторовна',
    ]
  },
  {
    names: [
      'Александр',
      'Алексей',
      'Сергей',
      'Андрей',
      'Дмитрий',
      'Михаил',
      'Павел',
      'Илья',
      'Константин',
      'Виктор',
    ],
    surNames: [
      'Смирнов',
      'Иванов',
      'Кузнецов',
      'Соколов',
      'Попов',
      'Лебедев',
      'Козлов',
      'Новиков',
      'Морозов',
      'Петров',
    ],
    protoNames: [
      'Александрович',
      'Алексеевич',
      'Сергеевич',
      'Андреевич',
      'Дмитриевич',
      'Михайлович',
      'Павлович',
      'Иванович',
      'Константинович',
      'Викторович',
    ]
  },
]

const getButton = document.getElementById('get')
const setButton = document.getElementById('generate')

class User {
  constructor(id) {
    this.number = id
    this.sex = Math.round(Math.random())
    this.firstName = libs[this.sex].names[Math.round(Math.random() * 9)]
    this.secondName = libs[this.sex].surNames[Math.round(Math.random() * 9)]
    this.patronName = libs[this.sex].protoNames[Math.round(Math.random() * 9)]
    this.phone = this.generatePhone()
    this.birthDate = this.generateBirthDate()
    this._age = this.getAge()
    this.clientGroups = this.getClientGroup(this._age)
  }

  generatePhone() {
    let phone = '7'
    for (let i = 0; i < 10; i++) {
      phone += Math.round(Math.random() * 9)
    }
    return phone
  }

  generateBirthDate() {
    const unixValue = Math.round(Math.random() * (MAX_BIRTH_DATE - MIN_BIRTH_DATE)) + MIN_BIRTH_DATE //в данном случае минимум не обязателен, но пусть будет для реалистичности

    const formatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }
    const birthDate = new Date(unixValue)

    return new Intl.DateTimeFormat('ru-RU', formatOptions).format(birthDate)
  }

  getAge() {
    const [day, month, year] = this.birthDate.split('.')

    return Math.floor((new Date().getTime() - new Date(year, month - 1, day)) / (365.25 * 24 * 3600 * 1000))
  }

  getClientGroup(age) {

    if (age > 30) {
      return '7%_discount'
    } else if (age >= 20) {
      return '5%_discount'
    } else {
      return '3%_discount'
    }
  }
}

const getIndex = (n) => {
  const ids = [1, 2]

  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
    ids.push(c)
  }
  return ids
}

const usersIds = getIndex(USERS_COUNTER)

const usersArr = usersIds.map(userId => new User(userId))

const formatUserData = (user) => {
  return `phone=${user.phone}`+
  `&number=${user.number}`+
  `&first_name=${user.firstName}`+
  `&patron_name=${user.patronName}`+
  `&second_name=${user.secondName}`+
  `&client_groups=${user.clientGroups}`+
  `&sex=${user.sex}`+
  `&birth_date=${user.birthDate}`
}

let counter = 0
function fetchUntil(maxValue) {

  setTimeout(() => { 
    fetch('/clients/create', {
      method: 'POST',
      headers: {
        ['Content-Type']: 'application/json;charset=utf-8',
      },
      body: JSON.stringify({data: formatUserData(usersArr[counter])})
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))  
    .then(counter++)
    .then(setTimeout(() => {if (counter < maxValue) fetchUntil(maxValue)}, 0))
  }, 1000)  
}

const getData = (url) => {
  fetch(url, {method: 'GET'})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
}

const setData = (url, userData) => {
  fetch(url, {method: 'POST', ...userData})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
}

getButton.addEventListener('click', () => getData('/clients/get'))
setButton.addEventListener('click', () => fetchUntil(USERS_COUNTER))

