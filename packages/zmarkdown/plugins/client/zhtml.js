const common = require('../../common')

let parser = common()

export function render (input, cb) {
  return parser.render(input, cb)
}

export function parse (input) {
  return parser.parse(input)
}

export function getParser () {
  return parser
}

export function initialize (config) {
  parser = common(config)
}

export const name = 'zhtml'
