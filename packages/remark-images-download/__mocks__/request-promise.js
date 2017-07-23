const path = require('path')
const url = require('url')

const responses = {
  'ok.png': {
    headers: {
      'content-type': 'image/png',
      'content-length': 12345,
    },
  },
  'too-big.png': {
    headers: {
      'content-type': 'image/png',
      'content-length': 99999999,
    },
  },
  'wrong-mime.png': {
    headers: {
      'content-type': 'text/plain',
      'content-length': 12345,
    },
  },
  'wrong.ext': {
    headers: {
      'content-type': 'image/png',
      'content-length': 12345,
    },
  }
}


function request ({uri}) {
  const parsedURI = url.parse(uri)
  const filename = path.basename(parsedURI.pathname)
  const response = responses[filename] || responses['ok.png']
  return new Promise((resolve, reject) => {
    process.nextTick(() => resolve({response: response, body: 'foobar img content!'}))
  })
}

request.head = ({uri}) => {
  const parsedURI = url.parse(uri)
  const filename = path.basename(parsedURI.pathname)
  const response = responses[filename] || responses['ok.png']
  return new Promise((resolve, reject) =>
    process.nextTick(() => resolve({response: response, body: 'foobar img content!'})))
}

module.exports = request
