const response = {
  headers: {
    'content-type': 'image/png',
    'content-length': 12345,
  },
}

const error = null

export default function request (uri, callback) {
  process.nextTick(() =>
    callback(error, response, 'foobar image content'))
}

request.head = (uri, callback) => {
  process.nextTick(() =>
    callback(error, response))
}
