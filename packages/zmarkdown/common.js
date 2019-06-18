/* global Promise, Set */

const inspect = require('unist-util-inspect')
const unified = require('unified')
const visit = require('unist-util-visit')

const shortid = require('shortid')
const clone = require('clone')

const createWrapper = require('./utils/wrappers')
const remarkParse = require('remark-parse')

const remarkAbbr = require('remark-abbr/src')
const remarkAlign = require('remark-align/src')
const remarkCaptions = require('remark-captions/src')
const remarkComments = require('remark-comments/src')
const remarkCustomBlocks = require('remark-custom-blocks/src')
const remarkDisableTokenizers = require('remark-disable-tokenizers/src')
const remarkEmoticons = require('remark-emoticons/src')
const remarkEscapeEscaped = require('remark-escape-escaped/src')
const remarkGridTables = require('remark-grid-tables/src')
const remarkHeadingShifter = require('remark-heading-shift/src')
const remarkIframes = require('remark-iframes/src')
const remarkImageToFigure = require('./plugins/remark-image-to-figure')
const remarkKbd = require('remark-kbd/src')
const remarkMath = require('remark-math')
const remarkNumberedFootnotes = require('remark-numbered-footnotes/src')
const remarkPing = require('remark-ping/src')
const remarkSubSuper = require('remark-sub-super/src')
const remarkTextr = require('./plugins/remark-textr')
const remarkTrailingSpaceHeading = require('remark-heading-trailing-spaces')

const remark2rehype = require('remark-rehype')

const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const rehypeFootnotesTitles = require('rehype-footnotes-title')
const rehypeHighlight = require('rehype-highlight')
const rehypeHTMLBlocks = require('rehype-html-blocks')
const rehypeKatex = require('rehype-katex')
const rehypeLineNumbers = require('./utils/rehype-line-numbers')
const rehypePostfixFootnotes = require('rehype-postfix-footnote-anchors')
const rehypeSlug = require('rehype-slug')
const rehypeSanitize = require('rehype-sanitize')

const rehypeStringify = require('rehype-stringify')

const remarkConfig = require('./config/remark')

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

const zmdParser = (config, extraRemarkPlugins = []) => {
  const mdProcessor = unified()
    .use(remarkParse, config.reParse)

  if (config.enableTextr && !config.noTypography) {
    mdProcessor.use(remarkTextr, config.textr)
  }

  mdProcessor
    .use(remarkAbbr)
    .use(remarkAlign, config.alignBlocks)
    .use(remarkCaptions, config.captions)
    .use(remarkComments)
    .use(remarkCustomBlocks, config.customBlocks)
    .use(remarkDisableTokenizers, config.disableTokenizers)
    .use(remarkEmoticons, config.emoticons)
    .use(remarkEscapeEscaped, config.escapeEscaped)
    .use(remarkGridTables)
    .use(remarkHeadingShifter, config.headingShifter)
    .use(remarkIframes, config.iframes)
    .use(remarkMath, config.math)
    .use(remarkKbd)
    .use(remarkNumberedFootnotes)
    .use(remarkPing, config.ping)
    .use(remarkSubSuper)
    .use(remarkTrailingSpaceHeading)
    .use(remarkImageToFigure)
    .use(() => (tree, vfile) => {
      /* extract some metadata for frontends */

      // if we don't have any headings, we add a flag to disable
      // the Table of Contents directly in the latex template
      vfile.data.disableToc = true
      visit(tree, 'heading', () => {
        vfile.data.disableToc = false
      })

      // get a unique list of languages used in input
      const languages = new Set()
      visit(tree, 'code', (node) => {
        if (node.lang) languages.add(node.lang)
      })
      vfile.data.languages = [...languages]
    })
    .use(() => (tree, vfile) => {
      // limit AST depth to config.maxNesting
      visit(tree, 'root', (node) => {
        vfile.data.depth = getDepth(node) - 2
      })
      if (vfile.data.depth > config.maxNesting) {
        vfile.fail(`Markdown AST too complex: tree depth > ${config.maxNesting}`)
      }
    })

  if (config.stats) {
    mdProcessor.use(() => (tree, vfile) => {
      let signs = 0
      let words = 0
      visit(tree, 'text', (node) => {
        // +1 stands for EOL char
        signs += node.value.length + 1
        words += node.value.match(/\w+/g).length
      })
      vfile.data.stats = {
        signs: signs,
        words: words,
      }
    })
  }

  for (const record of extraRemarkPlugins) {
    mdProcessor.use(record.obj, record.option)
  }

  return mdProcessor
}

function getHTMLProcessor (config) {
  const parser = zmdParser(config.remarkConfig, config.extraRemarkPlugins)
    .use(remark2rehype, config.remarkConfig.remark2rehype)

  if (config.remarkConfig._test) {
    shortid.generate = () => 'shortId'
  } else {
    parser
      .use(rehypeLineNumbers)
      .use(rehypeHighlight, config.remarkConfig.rehypeHighlight)
  }

  return parser
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, config.remarkConfig.autolinkHeadings)
    .use(rehypeHTMLBlocks)
    .use(rehypeFootnotesTitles, config.remarkConfig.footnotesTitles)
    .use(rehypePostfixFootnotes, `-${shortid.generate()}`)
    .use(rehypeKatex, config.remarkConfig.katex)
    .use(rehypeSanitize, config.remarkConfig.sanitize)
    .use(() => (tree) => {
      Object.keys(wrappers).forEach(nodeName =>
        wrappers[nodeName].forEach(wrapper => {
          visit(tree, wrapper)
        }))
    })
    .use(rehypeStringify)
}

const rendererFactory = (config, processor) => {
  return (input, cb) => {
    const allConfig = clone(config)
    const mdProcessor = processor
      ? processor(allConfig)
      : getHTMLProcessor(allConfig)

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
}

const mdastParser = (opts) =>
  (zmd) =>
    zmdParser(opts.remarkConfig, opts.extraRemarkPlugins).parse(zmd)

function getDepth (node) {
  let maxDepth = 0
  if (node.children) {
    node.children.forEach((child) => {
      const depth = getDepth(child)
      if (depth > maxDepth) {
        maxDepth = depth
      }
    })
  }
  return 1 + maxDepth
}

module.exports = (
  opts = {remarkConfig},
  processor = null
) => {
  if (!opts) {
    opts = {}
  }

  if (!opts.remarkConfig || !Object.keys(opts.remarkConfig).length) {
    opts.remarkConfig = clone(remarkConfig)
  }

  if (!processor) {
    processor = getHTMLProcessor
  }

  return {
    config: opts,
    inspect: inspect,
    parse: mdastParser(opts),
    zmdParser: zmdParser,
    render: rendererFactory(opts, processor),
    rendererFactory: rendererFactory,
  }
}
