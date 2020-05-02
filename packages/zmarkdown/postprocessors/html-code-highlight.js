const visit = require('unist-util-visit')
const unified = require('unified')
const rehypeParse = require('rehype-parse')
const rehypeStringify = require('rehype-stringify')

const toHtml = unified()
  .use(rehypeStringify)
  .stringify

const fromHtml = unified()
  .use(rehypeParse, {fragment: true})
  .parse

module.exports = () => (tree, vfile) => {
  visit(tree, 'element', node => {
    if (node.tagName !== 'div' ||
        !node.properties.className ||
        !node.properties.className.includes('hljs-code-div') ||
        node.children.length !== 2) {
      return
    }

    // This is fixed because we use a custom handler
    const lineNumberDiv = node.children[0]
    const codeBlock = node.children[1].children[0]

    // Create a shadow element to remove all the crap from code.hljs
    // This shadow element is renderer to html, and we'll add hll spans around
    // matching lines.
    // At the end, it is reparsed to HAST
    const shadowElement = toHtml({
      type:     'root',
      children: codeBlock.children,
    })

    // Get the lines to highlight relative to the first
    const hlLines = lineNumberDiv.children
      .reduce((acc, val, i) => {
        if ((val.properties && val.properties.className) === 'hll') {
          acc.push(i)
        }

        return acc
      }, [])

    // Create a new code block in raw HTML, with lines highlighted
    const newCodeBlock = shadowElement
      .split('\n')
      .map((line, i) => {
        if (hlLines.includes(i)) {
          return `<span class="hll">${line}</span>`
        } else {
          return line
        }
      })

    // Insert new children
    node.children[1].children[0].children = fromHtml(newCodeBlock.join('\n')).children
  })
}
