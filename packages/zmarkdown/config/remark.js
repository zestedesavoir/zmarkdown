const textrApostrophes = require('typographic-apostrophes')
const textrApostrophesForPlurals = require('typographic-apostrophes-for-possessive-plurals')
const textrCopyright = require('typographic-copyright')
const textrEllipses = require('typographic-ellipses')
const textrEmDashes = require('typographic-em-dashes')
const textrEnDashes = require('typographic-en-dashes')
const textrRegisteredTrademark = require('typographic-registered-trademark')
const textrSingleSpaces = require('typographic-single-spaces')
const textrTrademark = require('typographic-trademark')

const textrColon = require('typographic-colon/src')
const textrEmDash = require('typographic-em-dash/src')
const textrExclamationMark = require('typographic-exclamation-mark/src')
const textrGuillemets = require('typographic-guillemets/src')
const textrPercent = require('typographic-percent/src')
const textrPermille = require('typographic-permille/src')
const textrQuestionMark = require('typographic-question-mark/src')
const textrSemicolon = require('typographic-semicolon/src')

const gh = require('hast-util-sanitize/lib/github')
const katex = require('./sanitize-katex')
const merge = require('deepmerge')

const sanitizeConfig = merge.all([gh, katex, {
  tagNames: ['span', 'abbr', 'figure', 'figcaption', 'iframe'],
  attributes: {
    a: ['ariaHidden', 'class', 'className'],
    div: ['id', 'class', 'className'],
    span: ['id'],
    h1: ['ariaHidden'],
    h2: ['ariaHidden'],
    h3: ['ariaHidden'],
    abbr: ['title'],
    img: ['class'],
    code: ['className'],
    th: ['colspan', 'colSpan', 'rowSpan', 'rowspan'],
    td: ['colspan', 'colSpan', 'rowSpan', 'rowspan'],
    iframe: ['allowfullscreen', 'frameborder', 'height', 'src', 'width'],
  },
  protocols: {
    href: ['ftp', 'dav', 'sftp', 'magnet', 'tftp', 'view-source'],
    src: ['ftp', 'dav', 'sftp', 'tftp'],
  },
  clobberPrefix: '',
  clobber: [],
}])

const remarkConfig = {
  maxNesting: 100,
  reParse: {
    gfm: true,
    commonmark: false,
    footnotes: true,
    pedantic: false,
    /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
    &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
    blocks: [],
  },

  enableTextr: true,
  textr: {
    plugins: [
      textrApostrophes,
      textrApostrophesForPlurals,
      textrEllipses,
      textrEmDashes,
      textrEnDashes,
      textrCopyright,
      textrRegisteredTrademark,
      textrSingleSpaces,
      textrTrademark,

      textrColon,
      textrEmDash,
      textrExclamationMark,
      textrGuillemets,
      textrPercent,
      textrPermille,
      textrQuestionMark,
      textrSemicolon,
    ],
    options: {
      locale: 'fr',
    },
  },

  autolinkHeadings: {
    behaviour: 'append',
  },

  headingShifter: 0,

  remark2rehype: {
    allowDangerousHTML: true,
  },

  rehypeHighlight: {
    ignoreMissing: true,
    plainText: ['console'],
    aliases: {tex: ['latex']},
  },

  footnotesTitles: 'Retourner au texte de la note $id',

  alignBlocks: {
    center: 'align-center',
    right: 'align-right',
  },

  customBlocks: {
    secret: {
      classes: 'custom-block-spoiler',
      title: 'optional',
    },
    s: {
      classes: 'custom-block-spoiler',
      title: 'optional',
    },
    information: {
      classes: 'custom-block-information',
      title: 'optional',
    },
    i: {
      classes: 'custom-block-information',
      title: 'optional',
    },
    question: {
      classes: 'custom-block-question',
      title: 'optional',
    },
    q: {
      classes: 'custom-block-question',
      title: 'optional',
    },
    attention: {
      classes: 'custom-block-warning',
      title: 'optional',
    },
    a: {
      classes: 'custom-block-warning',
      title: 'optional',
    },
    erreur: {
      classes: 'custom-block-error',
      title: 'optional',
    },
    e: {
      classes: 'custom-block-error',
      title: 'optional',
    },
    neutre: {
      classes: 'custom-block-neutral',
      title: 'required',
    },
    n: {
      classes: 'custom-block-neutral',
      title: 'required',
    },
  },

  escapeEscaped: ['&'],

  emoticons: {
    emoticons: {
      ':ange:': '/static/smileys/svg/ange.svg',
      ':colere:': '/static/smileys/svg/angry.svg',
      'o_O': '/static/smileys/svg/blink.svg',
      ';)': '/static/smileys/svg/clin.svg',
      ':B': '/static/smileys/svg/b.svg',
      ':diable:': '/static/smileys/svg/diable.svg',
      ':D': '/static/smileys/svg/heureux.svg',
      '^^': '/static/smileys/svg/hihi.svg',
      ':o': '/static/smileys/svg/huh.svg',
      ':p': '/static/smileys/svg/langue.svg',
      ':magicien:': '/static/smileys/svg/magicien.svg',
      ':colere2:': '/static/smileys/svg/mechant.svg',
      ':ninja:': '/static/smileys/svg/ninja.svg',
      'x(': '/static/smileys/svg/pinch.svg',
      '>_<': '/static/smileys/svg/pinch.svg',
      'X/': '/static/smileys/svg/pinch.svg',
      ':pirate:': '/static/smileys/svg/pirate.svg',
      ":'(": '/static/smileys/svg/pleure.svg',
      ':lol:': '/static/smileys/svg/rire.svg',
      ':honte:': '/static/smileys/svg/rouge.svg',
      ':-°': '/static/smileys/svg/siffle.svg',
      ':)': '/static/smileys/svg/smile.svg',
      ':soleil:': '/static/smileys/svg/soleil.svg',
      ':(': '/static/smileys/svg/triste.svg',
      ':euh:': '/static/smileys/svg/unsure.svg',
      ':waw:': '/static/smileys/svg/waw.svg',
      ':zorro:': '/static/smileys/svg/zorro.svg',
      '^(;,;)^': '/static/smileys/svg/cthulhu.svg',
      ':bounce:': '/static/smileys/svg/bounce.svg',
      ':popcorn:': '/static/smileys/svg/popcorn.svg',
      ':démon:': '/static/smileys/svg/f47f.svg',
      ':demon:': '/static/smileys/svg/f47f.svg',
      ':content:': '/static/smileys/svg/f600.svg',
      ':joyeux:': '/static/smileys/svg/f601.svg',
      ':mortderire:': '/static/smileys/svg/f602.svg',
      ':daccord:': '/static/smileys/svg/f603.svg',
      ':eneffet:': '/static/smileys/svg/f604.svg',
      ':eneffetgené:': '/static/smileys/svg/f605.svg',
      ':eneffetgene:': '/static/smileys/svg/f605.svg',
      'x)': '/static/smileys/svg/f606.svg',
      ':innocent:': '/static/smileys/svg/f607.svg',
      ':démonjoyeux:': '/static/smileys/svg/f608.svg',
      ':demonjoyeux:': '/static/smileys/svg/f608.svg',
      ':clindoeil:': '/static/smileys/svg/f609.svg',
      ':rejouis:': '/static/smileys/svg/f60a.svg',
      ':yum:': '/static/smileys/svg/f60b.svg',
      ':soulagé:': '/static/smileys/svg/f60c.svg',
      ':soulage:': '/static/smileys/svg/f60c.svg',
      '<3': '/static/smileys/svg/f60d.svg',
      ':confiant:': '/static/smileys/svg/f60e.svg',
      ':malicieux:': '/static/smileys/svg/f60f.svg',
      ':indifférent:': '/static/smileys/svg/f610.svg',
      ':indifferent:': '/static/smileys/svg/f610.svg',
      ':détaché:': '/static/smileys/svg/f611.svg',
      ':detache:': '/static/smileys/svg/f611.svg',
      ':lassé:': '/static/smileys/svg/f612.svg',
      ':lasse:': '/static/smileys/svg/f612.svg',
      ':sueurfroide:': '/static/smileys/svg/f613.svg',
      ':insatisfait:': '/static/smileys/svg/f614.svg',
      ':-/': '/static/smileys/svg/f615.svg',
      ':contrarié:': '/static/smileys/svg/f616.svg',
      ':contrarie:': '/static/smileys/svg/f616.svg',
      ':bisou:': '/static/smileys/svg/f617.svg',
      ':bisoucoeur:': '/static/smileys/svg/f618.svg',
      ':bisousourire:': '/static/smileys/svg/f619.svg',
      ':bisourougir:': '/static/smileys/svg/f61a.svg',
      ':-P': '/static/smileys/svg/f61b.svg',
      ';-P': '/static/smileys/svg/f61c.svg',
      'x-P': '/static/smileys/svg/f61d.svg',
      ':déçuinquiet:': '/static/smileys/svg/f61e.svg',
      ':decuinquiet:': '/static/smileys/svg/f61e.svg',
      ':inquiet:': '/static/smileys/svg/f61f.svg',
      ':fâché:': '/static/smileys/svg/f620.svg',
      ':fache:': '/static/smileys/svg/f620.svg',
      ':fâchérouge:': '/static/smileys/svg/f621.svg',
      ':facherouge:': '/static/smileys/svg/f621.svg',
      ':tristelarme:': '/static/smileys/svg/f622.svg',
      'x(': '/static/smileys/svg/f623.svg',
      ':fulminant:': '/static/smileys/svg/f624.svg',
      ':deçularme:': '/static/smileys/svg/f625.svg',
      ':decularme:': '/static/smileys/svg/f625.svg',
      ':déçu:': '/static/smileys/svg/f626.svg',
      ':decu:': '/static/smileys/svg/f626.svg',
      ':déçutriste:': '/static/smileys/svg/f627.svg',
      ':decutriste:': '/static/smileys/svg/f627.svg',
      ':déçuangoissé:': '/static/smileys/svg/f628.svg',
      ':decuangoisse:': '/static/smileys/svg/f628.svg',
      ':éreinté:': '/static/smileys/svg/f629.svg',
      ':ereinte:': '/static/smileys/svg/f629.svg',
      ':somnole:': '/static/smileys/svg/f62a.svg',
      ':fatigué:': '/static/smileys/svg/f62b.svg',
      ':fatigue:': '/static/smileys/svg/f62b.svg',
      ':grimace:': '/static/smileys/svg/f62c.svg',
      ':pleure:': '/static/smileys/svg/f62d.svg',
      ':ébahi:': '/static/smileys/svg/f62e.svg',
      ':ebahi:': '/static/smileys/svg/f62e.svg',
      ':étonné:': '/static/smileys/svg/f62f.svg',
      ':etonne:': '/static/smileys/svg/f62f.svg',
      ':angoissé:': '/static/smileys/svg/f630.svg',
      ':angoisse:': '/static/smileys/svg/f630.svg',
      ':hurlantdepeur:': '/static/smileys/svg/f631.svg',
      ':abasourdi:': '/static/smileys/svg/f632.svg',
      ':surprisrougi:': '/static/smileys/svg/f633.svg',
      ':dort:': '/static/smileys/svg/f634.svg',
      ':vertige:': '/static/smileys/svg/f635.svg',
      ':muet:': '/static/smileys/svg/f636.svg',
      ':masquetissu:': '/static/smileys/svg/f637.svg',
      ':nonsatisfait:': '/static/smileys/svg/f641.svg',
      ':satisfait:': '/static/smileys/svg/f642.svg',
      ':inversé:': '/static/smileys/svg/f643.svg',
      ':inverse:': '/static/smileys/svg/f643.svg',
      ':regardauciel:': '/static/smileys/svg/f644.svg',
      ':bouchezipper:': '/static/smileys/svg/f910.svg',
      ':appâtdugain:': '/static/smileys/svg/f911.svg',
      ':appatdugain:': '/static/smileys/svg/f911.svg',
      ':thermomètre:': '/static/smileys/svg/f912.svg',
      ':intello4yeux:': '/static/smileys/svg/f913.svg',
      ':pensif:': '/static/smileys/svg/f914.svg',
      ':blessé:': '/static/smileys/svg/f915.svg',
      ':blesse:': '/static/smileys/svg/f915.svg',
      ':bienveillant:': '/static/smileys/svg/f917.svg',
      ':nausée:': '/static/smileys/svg/f922.svg',
      ':nausee:': '/static/smileys/svg/f922.svg',
      ':pliéderire:': '/static/smileys/svg/f923.svg',
      ':pliederire:': '/static/smileys/svg/f923.svg',
      ':baver:': '/static/smileys/svg/f924.svg',
      ':pinocchio:': '/static/smileys/svg/f925.svg',
      ':eternuer:': '/static/smileys/svg/f927.svg',
      ':quésaco:': '/static/smileys/svg/f928.svg',
      ':quesaco:': '/static/smileys/svg/f928.svg',
      ':regardfan:': '/static/smileys/svg/f929.svg',
      ':hébété:': '/static/smileys/svg/f92a.svg',
      ':hebete:': '/static/smileys/svg/f92a.svg',
      ':chut:': '/static/smileys/svg/f92b.svg',
      ':fureur:': '/static/smileys/svg/f92c.svg',
      ':bailler:': '/static/smileys/svg/f92d.svg',
      ':vomir:': '/static/smileys/svg/f92e.svg',
      ':tropcogiter:': '/static/smileys/svg/f92f.svg',
      ':amoureux:': '/static/smileys/svg/f970.svg',
      ':fêter:': '/static/smileys/svg/f973.svg',
      ':feter:': '/static/smileys/svg/f973.svg',
      ':maldecoeur:': '/static/smileys/svg/f974.svg',
      ':avoirchaud:': '/static/smileys/svg/f975.svg',
      ':avoirfroid:': '/static/smileys/svg/f976.svg',
      ':désolé:': '/static/smileys/svg/f97a.svg',
      ':desole:': '/static/smileys/svg/f97a.svg',
      ':triste:': '/static/smileys/svg/2639.svg',
      ':rougir:': '/static/smileys/svg/263a.svg'
    },
    classes: 'smiley',
  },

  math: {
    inlineMathDouble: true,
  },

  katex: {
    inlineMathDoubleDisplay: true,
  },

  iframes: {
    'www.dailymotion.com': {
      width: 480,
      height: 270,
      disabled: false,
      oembed: 'https://www.dailymotion.com/services/oembed',
    },
    'www.vimeo.com': {
      width: 500,
      height: 281,
      disabled: false,
      oembed: 'https://vimeo.com/api/oembed.json',
    },
    'vimeo.com': {
      width: 500,
      height: 281,
      disabled: false,
      oembed: 'https://vimeo.com/api/oembed.json',
    },
    'www.youtube.com': {
      width: 560,
      height: 315,
      disabled: false,
      oembed: 'https://www.youtube.com/oembed',
    },
    'youtube.com': {
      width: 560,
      height: 315,
      disabled: false,
      oembed: 'https://www.youtube.com/oembed',
    },
    'youtu.be': {
      width: 560,
      height: 315,
      disabled: false,
      oembed: 'https://www.youtube.com/oembed',
    },
    'soundcloud.com': {
      width: 500,
      height: 305,
      disabled: false,
      oembed: 'https://soundcloud.com/oembed',
    },
    'www.ina.fr': {
      tag: 'iframe',
      width: 620,
      height: 349,
      disabled: false,
      replace: [
        ['www.', 'player.'],
        ['/video/', '/player/embed/'],
      ],
      append: '/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/560/315/1/148db8',
      removeFileName: true,
    },
    'www.jsfiddle.net': {
      tag: 'iframe',
      width: 560,
      height: 560,
      disabled: false,
      replace: [
        ['http://', 'https://'],
      ],
      append: 'embedded/result,js,html,css/',
      match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
      thumbnail: {
        format: 'http://www.unixstickers.com/image/data/stickers' +
        '/jsfiddle/JSfiddle-blue-w-type.sh.png',
      },
    },
    'jsfiddle.net': {
      tag: 'iframe',
      width: 560,
      height: 560,
      disabled: false,
      replace: [
        ['http://', 'https://'],
      ],
      append: 'embedded/result,js,html,css/',
      match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
      thumbnail: {
        format: 'http://www.unixstickers.com/image/data/stickers' +
        '/jsfiddle/JSfiddle-blue-w-type.sh.png',
      },
    },
  },

  captions: {
    external: {
      table: 'Table:',
      gridTable: 'Table:',
      code: 'Code:',
      math: 'Equation:',
      iframe: 'Video:',
    },
    internal: {
      math: 'Equation:',
      inlineMath: 'Equation:',
      image: 'Figure:',
    },
  },

  ping: {
    pingUsername: (_username) => true,
    userURL: (username) => `/membres/voir/${username}/`,
    usernameRegex: /\B@(?:\*\*([^*]+)\*\*|(\w+))/,
  },

  disableTokenizers: {},

  imagesDownload: {
    disabled: true,
    downloadDestination: './img/',
    maxlength: 1000000,
    dirSizeLimit: 10000000,
  },
  sanitize: sanitizeConfig,
}

module.exports = remarkConfig
