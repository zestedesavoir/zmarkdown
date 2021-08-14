module.exports = {
  disabled:         true,
  defaultImagePath: 'black.png',
  defaultOn:        {
    statusCode:  true,
    invalidPath: true,
    mimeType:    false,
    fileTooBig:  false,
  },
  downloadDestination: './img/',
  maxlength:           1000000,
  dirSizeLimit:        10000000,
}
