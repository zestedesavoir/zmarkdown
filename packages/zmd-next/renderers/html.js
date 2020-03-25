const rendererForge   = require('./rendererForge')

const remark2rehype   = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')

const defaultStringifierList = {
  lineNumbers:      require('../plugins/rehype-line-numbers'),
  highlight:        require('rehype-highlight'),
  autolinkHeadings: require('rehype-autolink-headings'),
  footnotesTitles:  require('rehype-footnotes-title'),
  htmlBlocks:       require('rehype-html-blocks'),
  katex:            require('rehype-katex'),
  postfixFootnotes: require('rehype-postfix-footnote-anchors'),
  slug:             require('rehype-slug'),
  sanitize:         require('rehype-sanitize'),
}

// KaTeX uses globals: load the mhchem extension
require('katex/dist/contrib/mhchem')

const postProcessorList = {
  iframeWrappers:   require('../postprocessors/html-iframe-wrappers'),
  footnotesReorder: require('../postprocessors/html-footnotes-reorder'),
}

module.exports = (tokenizer, config) => {
  tokenizer
    .use(remark2rehype, config.bridge)

  rendererForge(
    tokenizer,
    defaultStringifierList,
    postProcessorList,
  )(config)

  return tokenizer
    .use(rehypeStringify, config.stringify)
}