const toVFile = require('to-vfile')
const unified = require('unified')
const inspect = require('unist-util-inspect')
const visit = require('unist-util-visit')

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
const remarkKbd = require('remark-kbd/src')
const remarkMath = require('remark-math')
const remarkNumberedFootnotes = require('remark-numbered-footnotes/src')
const remarkPing = require('remark-ping/src')
const remarkSubSuper = require('remark-sub-super/src')
const remarkTextr = require('./remark-textr')
const remarkTrailingSpaceHeading = require('remark-heading-trailing-spaces')

const remark2rehype = require('remark-rehype')

const rehypeKatex = require('rehype-katex')
const rehypeFootnotesTitles = require('rehype-footnotes-title')
const rehypeHTMLBlocks = require('rehype-html-blocks')
const rehypeStringify = require('rehype-stringify')

const rebberStringify = require('rebber')

const defaultConfig = require('./config')

const fromFile = (filepath) => toVFile.readSync(filepath)

const zmdParser = (config) => {
  const mdProcessor = unified()
    .use(remarkParse, config.reParse)

  if (!config.isTest) {
    mdProcessor
      .use(remarkTextr, config.textr)
  }

  mdProcessor
    .use(remarkAbbr)
    .use(remarkAlign, config.alignBlocks)
    .use(remarkCaptions, config.captions)
    .use(remarkComments)
    .use(remarkCustomBlocks, config.customBlocks)
    .use(remarkDisableTokenizers)
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
    .use(() => {
      return (tree, file) => {
        visit(tree, (node) => {
          if (node._metadata) {
            if (!file.data[node.type]) {
              file.data[node.type] = []
            }
            file.data[node.type].push(node._metadata)
          }
        })
      }
    })
  return mdProcessor
}

const rendererFactory = (config, to = 'html') => (input, cb) => {
  const mdProcessor = zmdParser(config)

  if (to === 'html') {
    mdProcessor
      .use(remark2rehype, config.remark2rehype)

      .use(rehypeHTMLBlocks)
      .use(rehypeFootnotesTitles, config.footnotesTitles)
      .use(rehypeKatex, config.katex)

      .use(rehypeStringify)
  }

  if (to === 'latex') {
    mdProcessor
      .use(rebberStringify, config.rebber)
  }

  if (typeof cb !== 'function') {
    const vfile = mdProcessor.processSync(input)

    const output = {
      metadata: vfile.data,
      content: vfile.contents
    }
    return output
  }

  mdProcessor.process(input, (err, vfile) => {
    if (err) return cb(err)

    const output = {
      metadata: vfile.data,
      content: vfile.contents
    }
    cb(null, output)
  })
}

const mdastParser = (opts) => (zmd) => zmdParser(opts).parse(zmd)

module.exports = (opts = defaultConfig, to = 'html') => ({
  config: opts,
  inspect: inspect,
  parse: mdastParser(opts),
  rendererFactory: rendererFactory,
  renderString: rendererFactory(opts, to),
  renderFile: (path, cb) => rendererFactory(opts, to)(fromFile(path), cb),
})
