const visit = require('unist-util-visit')

function plugin () {
  return function transformer (tree) {
    const abbrs = {}
    /*
    TODO: we can probably do much better!
    We could do the exact same but on remark instead! Then later on stringifying
    would give HTML and that's it!
    No need to do another 'special' pass for rehype.
    */
    visit(tree, 'element', find(abbrs))
    /*
    we would only keep the following visit, the previous one would be remark-abbr
    but slightly modified to store the 'abbrs' in a global obj as seen here
    */
    visit(tree, replace(abbrs))
  }

  function find (abbrs) {
    return function one (node, index, parent) {
      if (node.tagName !== 'p') return

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.tagName !== 'abbr') continue

        const abbr = child.properties['data-abbr']
        // remove useless property of abbr node
        child.properties['data-abbr'] = null
        // Store abbr node for later use
        abbrs[abbr] = child
        node.children.splice(i, 1)
        i -= 1
      }
      // Remove paragraph if there is no child
      if (node.children.length === 0) parent.children.splice(index, 1)
    }
  }

  function replace (abbrs) {
    function escapeRegExp (str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // eslint-disable-line no-useless-escape
    }

    const pattern = Object.keys(abbrs).map(escapeRegExp).join('|')
    const regex = new RegExp(`\\b(${pattern})\\b`)

    function one (node, index, parent) {
      if (Object.keys(abbrs).length === 0) return
      if (!node.children) return

      // If a text node is present in child nodes, check if an abbreviation is present
      for (let c = 0; c < node.children.length; c++) {
        const child = node.children[c]
        if (node.tagName === 'abbr' || child.type !== 'text') continue
        if (!regex.test(child.value)) continue

        // Transform node
        const newTexts = child.value.split(regex)

        // Remove old text node
        node.children.splice(c, 1)

        // Replace abbreviations
        for (let i = 0; i < newTexts.length; i++) {
          const content = newTexts[i]
          if (abbrs.hasOwnProperty(content)) {
            node.children.splice(c + i, 0, abbrs[content])
          } else {
            node.children.splice(c + i, 0, {
              type: 'text',
              value: content,
            })
          }
        }
      }
    }
    return one
  }
}

module.exports = plugin
