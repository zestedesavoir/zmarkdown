const visit = require('unist-util-visit')

function plugin () {

  function transformer (tree) {
    const abbrs = {}
    visit(tree, 'element', find(abbrs))
    visit(tree, replace(abbrs))
  }

  function find (abbrs) {
    function one (node, index, parent) {
      if (node.tagName === 'p') {
        for (let i = 0; i < node.children.length; ++i) {
          const child = node.children[i]
          if (child.tagName === 'abbr') {
            // Store abbreviation
            abbrs[child.properties.word] = child.properties.desc
            node.children.splice(i, 1)
            i -= 1
          }
        }
        // Remove paragraph if there is no child
        if (node.children.length === 0) parent.children.splice(index, 1)
      }
    }
    return one
  }

  function replace (abbrs) {
    function escapeRegExp (str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
    }

    const pattern = Object.keys(abbrs).map(escapeRegExp).join('|')
    const regex = new RegExp(`\\b(${pattern})\\b`)

    function one (node, index, parent) {
      if (Object.keys(abbrs).length === 0) return
      if (node.type !== 'text') return

      const keep = regex.exec(node.value)
      if (keep) {
        const newTexts = node.value.split(regex)
        parent.children = []
        for (let i = 0; i < newTexts.length; ++i) {
          const content = newTexts[i]
          if (Object.keys(abbrs).indexOf(content) >= 0) {
            parent.children[i] = {
              type: 'element',
              tagName: 'abbr',
              properties: { title: abbrs[content] },
              children: [ { type: 'text', value: content } ]
            }
          } else {
            parent.children[i] = {
              type: 'text',
              value: content,
            }
          }
        }
      }
    }

    return one
  }

  return transformer
}

module.exports = plugin
