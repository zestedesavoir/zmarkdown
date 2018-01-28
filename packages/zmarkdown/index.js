const inspect = require('unist-util-inspect')
const toVFile = require('to-vfile')
const unified = require('unified')
const visit = require('unist-util-visit')

const dedent = require('dedent')
const clone = require('clone')

const fixSVG = require('./utils/svg-hack')
const createWrapper = require('./utils/wrappers')
const remarkParse = require('remark-parse')

const remarkAbbr = require('remark-abbr')
const remarkAlign = require('remark-align')
const remarkCaptions = require('remark-captions')
const remarkComments = require('remark-comments')
const remarkCustomBlocks = require('remark-custom-blocks')
const remarkDisableTokenizers = require('remark-disable-tokenizers')
const remarkEmoticons = require('remark-emoticons')
const remarkEscapeEscaped = require('remark-escape-escaped')
const remarkGridTables = require('remark-grid-tables')
const remarkHeadingShifter = require('remark-heading-shift')
const remarkIframes = require('remark-iframes')
const remarkImagesDownload = require('remark-images-download')
const remarkKbd = require('remark-kbd')
const remarkMath = require('remark-math')
const remarkNumberedFootnotes = require('remark-numbered-footnotes')
const remarkPing = require('remark-ping')
const remarkSubSuper = require('remark-sub-super')
const remarkTextr = require('./plugins/remark-textr')
const remarkTrailingSpaceHeading = require('remark-heading-trailing-spaces')

const remark2rehype = require('remark-rehype')

const rehypeKatex = require('rehype-katex')
const rehypeFootnotesTitles = require('rehype-footnotes-title')
const rehypeLineNumbers = require('./utils/rehype-line-numbers')
const rehypeHighlight = require('rehype-highlight')
const rehypeHTMLBlocks = require('rehype-html-blocks')
const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const rehypeSlug = require('rehype-slug')

const rehypeStringify = require('rehype-stringify')

const rebberStringify = require('rebber')

const remarkConfig = require('./config/remark')
const rebberConfig = require('./config/rebber')

const fromFile = (filepath) => toVFile.readSync(filepath)
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

const zmdParser = (config, target) => {
  const mdProcessor = unified()
    .use(remarkParse, config.reParse)

  if (target !== 'latex' && !config.noTypography) {
    mdProcessor
      .use(remarkTextr, config.textr)
  }

  return mdProcessor
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
    .use(remarkImagesDownload, config.imagesDownload)
    .use(remarkMath, config.math)
    .use(remarkKbd)
    .use(remarkNumberedFootnotes)
    .use(remarkPing, config.ping)
    .use(remarkSubSuper)
    .use(remarkTrailingSpaceHeading)
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
}

function getLatexProcessor (remarkConfig, rebberConfig, target) {
  remarkConfig.noTypography = true

  return zmdParser(remarkConfig, target)
    .use(rebberStringify, rebberConfig)
}

function getHTMLProcessor (remarkConfig, rebberConfig, target) {
  const parser = zmdParser(remarkConfig, target)
    .use(remark2rehype, remarkConfig.remark2rehype)

  if (!remarkConfig._test) {
    parser
      .use(rehypeLineNumbers)
      .use(rehypeHighlight, remarkConfig.rehypeHighlight)
  }

  return parser
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, remarkConfig.autolinkHeadings)
    .use(rehypeHTMLBlocks)
    .use(rehypeFootnotesTitles, remarkConfig.footnotesTitles)
    .use(rehypeKatex, remarkConfig.katex)
    .use(() => (tree) => {
      Object.keys(wrappers).forEach(nodeName =>
        wrappers[nodeName].forEach(wrapper => {
          visit(tree, wrapper)
        }))
    })
    .use(rehypeStringify)
}

const postProcess = {
  html (vfile) {
    // SVG hack
    if (vfile.contents && vfile.contents.includes('<svg')) {
      vfile.contents = fixSVG(vfile.contents)
    }
    return vfile
  },
}

const rendererFactory = ({remarkConfig, rebberConfig}, target = 'html') => {

  const postProcessFn = postProcess.hasOwnProperty(target) ? postProcess[target] : undefined

  return (input, cb) => {
    [remarkConfig, rebberConfig] = [clone(remarkConfig), clone(rebberConfig)]

    const mdProcessor = target !== 'html'
      ? getLatexProcessor(remarkConfig, rebberConfig, target)
      : getHTMLProcessor(remarkConfig, rebberConfig, target)

    if (typeof cb !== 'function') {
      return new Promise((resolve, reject) =>
        mdProcessor.process(input, (err, vfile) => {
          if (err) return reject(err)

          if (postProcessFn) vfile = postProcessFn(vfile)
          resolve(vfile)
        }))
    }

    mdProcessor.process(input, (err, vfile) => {
      if (err) return cb(err)

      if (postProcessFn) vfile = postProcessFn(vfile)
      cb(null, vfile)
    })
  }
}

const mdastParser = (opts) => (zmd) => zmdParser(opts.remarkConfig).parse(zmd)

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
  opts = {remarkConfig, rebberConfig},
  target = 'html'
) => {
  if (!opts.remarkConfig || !Object.keys(remarkConfig).length) {
    throw new Error(dedent`
      This module expects to be called with ({remarkConfig, rebberConfig}, target = 'html'),
      remarkConfig is missing!`)
  }
  if (!opts.rebberConfig || !Object.keys(rebberConfig).length) {
    throw new Error(dedent`
      This module expects to be called with ({remarkConfig, rebberConfig}, target = 'html'),
      rebberConfig is missing!`)
  }
  return {
    config: opts,
    inspect: inspect,
    parse: mdastParser(opts),
    rendererFactory: rendererFactory,
    renderString: rendererFactory(opts, target),
    renderFile: (path, cb) => rendererFactory(opts, target)(fromFile(path), cb),
    latexDocumentTemplate: require('./templates/latex-document'),
  }
}
