/**
 * This plugin adds a class precising the language
 * to code blocks (.hljs-code-div).
 */

const visit = require('unist-util-visit')

module.exports = () => (tree) => {
  visit(tree, (node) => {
    // filter super code blocks
    if (node.type === 'element' &&
        node.tagName === 'div' &&
        node.properties &&
        node.properties.className &&
        node.properties.className.includes('hljs-code-div')
    ) {
      // get pre > code
      const preElem = node.children.filter(c =>
        c.type === 'element' && c.tagName === 'pre')

      if (preElem.length === 1) {
        const classes = preElem[0].children[0].properties.className
        if (!classes) return

        const langClass = classes.filter(c => c.startsWith('language'))
        if (langClass.length === 0 || langClass[0].length < 9) return

        const language = langClass[0].substring(9)

        // rewrite class name
        if (langClass.length === 1 && language !== 'div') {
          node.properties.className.push(`hljs-code-${language}`)
        }
      }
    }
  })
}
