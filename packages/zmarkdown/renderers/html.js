const rendererForge = require('./renderer-forge')

const remark2rehype = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')

const defaultStringifierList = {
  highlight: require('rehype-highlight'),
  slug: require('rehype-slug'),
  autolinkHeadings: require('rehype-autolink-headings'),
  footnotesTitles: require('rehype-footnotes-title'),
  htmlBlocks: require('rehype-html-blocks'),
  katex: require('rehype-katex'),
  postfixFootnotes: require('rehype-postfix-footnote-anchors'),
  sanitize: require('rehype-sanitize')
}

// KaTeX uses globals: load the mhchem extension
require('katex/dist/contrib/mhchem')

const postProcessorList = {
  footnotesReorder: require('../postprocessors/html-footnotes-reorder'),
  iframeWrappers: require('../postprocessors/html-iframe-wrappers'),
  lazyLoadImages: require('../postprocessors/html-lazy-load-images'),
  wrapCode: require('../postprocessors/html-wrap-code')
}

module.exports = (tokenizer, config) => {
  tokenizer
    .use(remark2rehype, config.bridge)

  rendererForge(
    tokenizer,
    defaultStringifierList,
    postProcessorList
  )(config)

  return tokenizer
    .use(rehypeStringify, config.stringify)
}
