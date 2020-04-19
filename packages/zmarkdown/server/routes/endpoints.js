const bodyParser = require('body-parser')
const express    = require('express')

const controllerFactory = require('../factories/controller-factory')

const router = express.Router()

router.post(
  '/html',
  bodyParser.json({limit: '300kb'}),
  controllerFactory('html'),
)

router.post(
  '/latex',
  bodyParser.json({limit: '300kb'}),
  controllerFactory('latex'),
)

router.post(
  '/epub',
  bodyParser.json({limit: '300kb'}),
  controllerFactory('epub'),
)

router.post(
  '/latex-document',
  bodyParser.json({limit: '300kb'}),
  controllerFactory('latex', require('../templates/latex-document')),
)

router.get('/', (_, res) => {
  res.send('zmd is running!\n')
})

module.exports = router
