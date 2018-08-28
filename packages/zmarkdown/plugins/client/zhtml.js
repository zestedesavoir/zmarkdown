const visit = require('unist-util-visit')

const shortid = require('shortid')
const clone = require('clone')
const createWrapper = require('../../utils/wrappers')

const remarkConfig = require('../../config/remark')

const remark2rehype = require('remark-rehype')

const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const rehypeFootnotesTitles = require('rehype-footnotes-title')
const rehypeHighlight = require('rehype-highlight')
const rehypeHTMLBlocks = require('rehype-html-blocks')
const rehypeKatex = require('rehype-katex')
const rehypeLineNumbers = require('../../utils/rehype-line-numbers')
const rehypePostfixFootnotes = require('rehype-postfix-footnote-anchors')
const rehypeSlug = require('rehype-slug')

const rehypeStringify = require('rehype-stringify')

const jsFiddleAndInaFilter = node => {
  if (node.properties.src) {
    return node.properties.src.includes('jsfiddle.') || node.properties.src.includes('ina.')
  }
  return false
}

const wrappers = {
  iframe: [
    createWrapper(
      'iframe',
      ['div', 'div'],
      [['video-wrapper'], ['video-container']],
      node => !jsFiddleAndInaFilter(node)
    ),
    createWrapper('iframe', 'div', ['iframe-wrapper'], jsFiddleAndInaFilter),
  ],
  table: [
    createWrapper('table', 'div', ['table-wrapper']),
  ],
}

const zmdParser = require('../../zmdParser')

function getHTMLProcessor () {
  const config = clone(remarkConfig)

  const parser = zmdParser(config, 'html')
    .use(remark2rehype, config.remark2rehype)

  if (config._test) {
    shortid.generate = () => 'shortId'
  } else {
    parser
      .use(rehypeLineNumbers)
      .use(rehypeHighlight, config.rehypeHighlight)
  }

  return parser
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, config.autolinkHeadings)
    .use(rehypeHTMLBlocks)
    .use(rehypeFootnotesTitles, config.footnotesTitles)
    .use(rehypePostfixFootnotes, `-${shortid.generate()}`)
    .use(rehypeKatex, config.katex)
    .use(() => (tree) => {
      Object.keys(wrappers).forEach(nodeName =>
        wrappers[nodeName].forEach(wrapper => {
          visit(tree, wrapper)
        }))
    })
    .use(rehypeStringify)
}

export function render (input, cb) {
  const mdProcessor = getHTMLProcessor()

  if (typeof cb !== 'function') {
    return new Promise((resolve, reject) =>
      mdProcessor.process(input, (err, vfile) => {
        if (err) return reject(err)

        resolve(vfile)
      }))
  }

  mdProcessor.process(input, (err, vfile) => {
    if (err) return cb(err)

    cb(null, vfile)
  })
}

export const name = 'zhtml'
