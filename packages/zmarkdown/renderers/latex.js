const rebberStringify = require('rebber/src')

// Rebber is actually a stringifier-only
module.exports = (tokenizer, config) => {
  return tokenizer
    .use(rebberStringify, config)
}
