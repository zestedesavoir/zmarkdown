import path from 'path'
import express from 'express'

const app = express()
app.use('/', express.static(path.join(__dirname, 'files')))

const server = app.listen(27273, () => {})

module.exports = server
