/* eslint-disable no-console */

const app = require('./app')

const server = app.listen(27272, () => {
  const host = server.address().address
  const port = server.address().port

  console.warn('zmarkdown server listening at http://%s:%s', host, port)
})
