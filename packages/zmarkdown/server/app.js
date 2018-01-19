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
        Raven.captureException(err, {req})
        console.error(err)
        res.status(500).json(null)
        return
      }

      res.json(result)
    })
  }
}

const Raven = require('raven')
Raven.config(process.env.SENTRY_DSN, {
  release: process.env.SENTRY_RELEASE || zmdVersion,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.ZDS_ENVIRONMENT
}).install()

const {
  toHTML,
  toLatex,
  toLatexDocument,
} = require('./handlers')(Raven)

const app = express()

app.use(cors())

app.use(Raven.requestHandler())
app.use(Raven.errorHandler())

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.json({limit: '5mb'}))
app.post('/latex', controllerFactory(toLatex))
app.post('/latex-document', controllerFactory(toLatexDocument))
app.post('/html', controllerFactory(toHTML))

module.exports = app
