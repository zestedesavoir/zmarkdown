/* eslint-disable no-console */
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const zmdVersion = require('../package.json').version

function controllerFactory (handler) {
  return (req, res) => {
    handler(req.body.md, req.body.opts, (err, result) => {
      if (err) {
        Raven.captureException(err, {req, result})
        res.status(500).json(result)
        return
      }

      res.json(result)
    })
  }
}

const Raven = require('raven')
Raven.config(process.env.SENTRY_DSN, {
  release: process.env.SENTRY_RELEASE || zmdVersion,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.ZDS_ENVIRONMENT,
}).install()

const {
  toEPUB,
  toHTML,
  toLatex,
  toLatexDocument,
} = require('./handlers')(Raven)

const app = express()

app.use(cors())

app.use(Raven.requestHandler())
app.use(Raven.errorHandler())

app.use('/static', express.static(path.join(__dirname, 'static')))

app.post('/epub', bodyParser.json({limit: '5mb'}), controllerFactory(toEPUB))
app.post('/html', bodyParser.json({limit: '300kb'}), controllerFactory(toHTML))
app.post('/latex', bodyParser.json({limit: '5mb'}), controllerFactory(toLatex))
app.post('/latex-document', bodyParser.json({limit: '5mb'}), controllerFactory(toLatexDocument))

const munin = require('./munin')
app.get('/munin/config/:plugin', munin('config'))
app.get('/munin/:plugin', munin())

app.get('/', (req, res) => {
  res.send('zmd is running\n')
})

module.exports = app
