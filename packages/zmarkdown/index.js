const inspect = require('unist-util-inspect')
const toVFile = require('to-vfile')
const visit = require('unist-util-visit')

const shortid = require('shortid')
const dedent = require('dedent')
const clone = require('clone')

const createWrapper = require('./utils/wrappers')

const remarkImagesDownload = require('remark-images-download/src')

const remark2rehype = require('remark-rehype')

const rehypeAutolinkHeadings = require('rehype-autolink-headings')
const rehypeFootnotesTitles = require('rehype-footnotes-title')
const rehypeHighlight = require('rehype-highlight')
const rehypeHTMLBlocks = require('rehype-html-blocks')
const rehypeKatex = require('rehype-katex')
const rehypeLineNumbers = require('./utils/rehype-line-numbers')
const rehypePostfixFootnotes = require('rehype-postfix-footnote-anchors')
const rehypeSlug = require('rehype-slug')

const rehypeStringify = require('rehype-stringify')

const rebberStringify = require('rebber/src')

const remarkConfig = require('./config/remark')
const rebberConfig = require('./config/rebber')

const zParser = require('./zmdParser')

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
  return zParser(config, target).use(remarkImagesDownload, config.imagesDownload)
}

function getLatexProcessor (remarkConfig, rebberConfig, target) {
  remarkConfig.noTypography = true

  return zmdParser(remarkConfig, target)
    .use(rebberStringify, rebberConfig)
}

function getHTMLProcessor (remarkConfig, rebberConfig, target) {
  const parser = zmdParser(remarkConfig, target)
    .use(remark2rehype, remarkConfig.remark2rehype)

  if (remarkConfig._test) {
    shortid.generate = () => 'shortId'
  } else {
    parser
      .use(rehypeLineNumbers)
      .use(rehypeHighlight, remarkConfig.rehypeHighlight)
  }

  return parser
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, remarkConfig.autolinkHeadings)
    .use(rehypeHTMLBlocks)
    .use(rehypeFootnotesTitles, remarkConfig.footnotesTitles)
    .use(rehypePostfixFootnotes, `-${shortid.generate()}`)
    .use(rehypeKatex, remarkConfig.katex)
    .use(() => (tree) => {
      Object.keys(wrappers).forEach(nodeName =>
        wrappers[nodeName].forEach(wrapper => {
          visit(tree, wrapper)
        }))
    })
    .use(rehypeStringify)
}

const rendererFactory = ({remarkConfig, rebberConfig}, target = 'html') => {

  return (input, cb) => {
    [remarkConfig, rebberConfig] = [clone(remarkConfig), clone(rebberConfig)]

    const mdProcessor = target !== 'html'
      ? getLatexProcessor(remarkConfig, rebberConfig, target)
      : getHTMLProcessor(remarkConfig, rebberConfig, target)

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

const mdastParser = (opts) => (zmd) => zmdParser(opts.remarkConfig).parse(zmd)

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
