const common = require('../../common')

const parser = common()

export function render (input, cb) {
  return parser.render(input, cb)
}

export const name = 'zhtml'
