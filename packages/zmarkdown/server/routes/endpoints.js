const bodyParser = require('body-parser')
const express    = require('express')

const controllerFactory = require('../factories/controller-factory')

const router = express.Router()
const limit = '300kb'

router.post(
  '/html',
  bodyParser.json({limit}),
  controllerFactory('html'),
)

router.post(
  '/latex',
  bodyParser.json({limit}),
  controllerFactory('latex'),
)

router.post(
  '/epub',
  bodyParser.json({limit}),
  controllerFactory('epub'),
)

router.post(
  '/latex-document',
  bodyParser.json({limit: '3mb'}),
  controllerFactory('latex', require('../templates/latex-document')),
)

router.get('/', (_, res) => {
  res.send('zmd is running!\n')
})

module.exports = router
