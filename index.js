const fs = require('fs')
const unified = require('unified')
const reParse = require('remark-parse')
const math = require('remark-math')
const katex = require('rehype-katex')
const stringify = require('rehype-stringify')
const remark2rehype = require('remark-rehype')
const inspect = require('unist-util-inspect')

const align = require('./packages/align')
const headingShifter = require('./packages/heading-shift')
const htmlBlocks = require('./packages/html-blocks')
const escapeEscaped = require('./packages/escape-escaped')
const kbd = require('./packages/kbd')
const customBlocks = require('./packages/custom-blocks')
const subSuper = require('./packages/sub-super')
const emoticons = require('./packages/emoticons')
const numberedFootnotes = require('./packages/numbered-footnotes')
const footnotesTitles = require('./packages/footnotes-title')
const video = require('./packages/iframes')

const defaultConfig = require('./config')

const fromFile = (filepath) => fs.readFileSync(filepath)

const processor = (config) =>
  unified()
    .use(reParse, config.reParse)
    .use(headingShifter, config.headingShifter)
    .use(numberedFootnotes)
    .use(remark2rehype, config.remark2rehype)
    .use(footnotesTitles, config.footnotesTitles)
    .use(customBlocks, config.customBlocks)
    .use(align)
    .use(math)
    .use(htmlBlocks)
    .use(escapeEscaped, config.escapeEscaped)
    .use(kbd)
    .use(video, {
      'www.dailymotion.com': {
        tag: 'iframe',
        width: 480,
        height: 270,
        activated: true,
        replace: {
          'video/': 'embed/video/'
        }
      },
      'www.vimeo.com': {
        tag: 'iframe',
        width: 500,
        height: 281,
        activated: true,
        replace: {
          'http://': 'https://',
          'www.': '',
          'vimeo.com/': 'player.vimeo.com/video/'
        }
      },
      'vimeo.com': {
        tag: 'iframe',
        width: 500,
        height: 281,
        activated: true,
        replace: {
          'http://': 'https://',
          'www.': '',
          'vimeo.com/': 'player.vimeo.com/video/'
        }
      },
      'www.youtube.com': {
        tag: 'iframe',
        width: 560,
        height: 315,
        activated: true,
        replace: {
          'watch?v=': 'embed/',
          'http://': 'https://'
        },
        removeAfter: '&'
      },
      'youtube.com': {
        tag: 'iframe',
        width: 560,
        height: 315,
        activated: true,
        replace: {
          'watch?v=': 'embed/',
          'http://': 'https://'
        },
        removeAfter: '&'
      },
      'youtu.be': {
        tag: 'iframe',
        width: 560,
        height: 315,
        activated: true,
        replace: {
          'watch?v=': 'embed/',
          'youtu.be': 'www.youtube.com/embed'
        },
        removeAfter: '&'
      },
      'screen.yahoo.com': {
        tag: 'iframe',
        width: 624,
        height: 351,
        activated: true,
        append: '?format=embed&amp;player_autoplay=false'
      },
      'www.ina.fr': {
        tag: 'iframe',
        width: 620,
        height: 349,
        activated: true,
        replace: {
          'www.': 'player.',
          '/video/': '/player/embed/'
        },
        append: '/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/560/315/1/148db8',
        removeFileName: true
      },
      'www.jsfiddle.net': {
        tag: 'iframe',
        width: 560,
        height: 560,
        activated: true,
        replace: {
          'http://': 'https://'
        },
        append: 'embedded/result,js,html,css/'
      },
      'jsfiddle.net': {
        tag: 'iframe',
        width: 560,
        height: 560,
        activated: true,
        replace: {
          'http://': 'https://'
        },
        append: 'embedded/result,js,html,css/'
      }
    })
    .use(katex)
    .use(stringify)
    .use(subSuper)
    .use(emoticons, config.emoticons)
    .use(katex, config.katex)
    .use(stringify)

const parse = (opts) => (zmd) => processor(opts).parse(zmd)
const transform = (opts) => (ast) => processor(opts).runSync(ast)
const render = (opts) => (ast) => processor(opts).stringify(ast)

const renderString = (opts) => (string) => render(opts)(transform(opts)(parse(opts)(string)))
const renderFile = (opts) => (filepath) => renderString(opts)(fromFile(filepath))

module.exports = (opts = defaultConfig) => ({
  inspect: inspect,
  parse: parse(opts),
  transform: transform(opts),
  renderFile: renderFile(opts),
  renderString: renderString(opts),
})
