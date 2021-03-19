const express = require('express')
const config = require('config')
const request = require('request')

const PORT = config.get('port') || 5000
const app = express()
const [accId, userId, accessToken] = [config.get('accId'), config.get('userId'), config.get('accessToken')]

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))

app.use(express.json())
app.use(express.static('static'))

app.post('/clients/create', async (req, res) => {
  try {
    request({
      method: 'POST',
      url: `https://klientiks.ru/clientix/Restapi/add/a/${accId}/u/${userId}/t/${accessToken}/m/Clients/`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: req.body.data
    }, function (body) {
      res.status(201).send({message: 'User was successfully created'})
    });
  } catch (err) {
    res.status(500).json({message: 'Something goes wrong...'})
  }
})

app.get('/clients/get', async (req, res) => {
  try {
    request(`https://klientiks.ru/clientix/Restapi/list/a/${accId}/u/${userId}/t/${accessToken}/m/clients/date/2018-10-10`, function (error, response, body) {
      res.status(200).send(body)
    })
  } catch (error) {
    res.status(500).json({message: 'Something goes wrong...'})
  }
})
