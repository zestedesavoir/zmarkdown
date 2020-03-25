const text = `
Hello, this is a *short* text to see if everything works **fine**!

# It should work...
`

const zmarkdown = require('./common')

const htmlParser = zmarkdown('html');

htmlParser(text).then(val => console.log(val))

htmlParser(text, (err, vfile) => {
  if(err) console.error(err)
  console.log(vfile)
})