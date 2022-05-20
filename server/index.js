const express = require('express')
  const app = express()
  request = require('request')
  const cors = require('cors')
  const bodyParser = require('body-parser')

  app.use(bodyParser.json());

  app.use(cors())

const host = 'localhost'
const port = 8080

app.get('/', (req, res) => {
  res.send('Server Work!')
})

app.post('/', (req, res) => {
  const data ={
    one: req.body.one,
    two: req.body.two,
    three: req.body.three,
    four: req.body.four,
  }
  request(
        `http://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=${data.one},${data.two},${data.three},${data.four}&adsb=1&air=1&array=1`,
    (err, response, body) => {
      if (err) return res.status(500).send({ message: err })

      return res.send(body)
    }
  )
})

app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
)