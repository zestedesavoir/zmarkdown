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
      ':ange:': '/static/smileys/ange.svg',
      ':colere:': '/static/smileys/angry.svg',
      'o_O': '/static/smileys/blink.svg',
      ';)': '/static/smileys/clin.svg',
      ':B': '/static/smileys/b.svg',
      ':diable:': '/static/smileys/diable.svg',
      ':D': '/static/smileys/heureux.svg',
      '^^': '/static/smileys/hihi.svg',
      ':o': '/static/smileys/huh.svg',
      ':p': '/static/smileys/langue.svg',
      ':magicien:': '/static/smileys/magicien.svg',
      ':colere2:': '/static/smileys/mechant.svg',
      ':ninja:': '/static/smileys/ninja.svg',
      '>_<': '/static/smileys/pinch.svg',
      'X/': '/static/smileys/pinch.svg',
      ':pirate:': '/static/smileys/pirate.svg',
      ":'(": '/static/smileys/pleure.svg',
      ':lol:': '/static/smileys/rire.svg',
      ':honte:': '/static/smileys/rouge.svg',
      ':-°': '/static/smileys/siffle.svg',
      ':)': '/static/smileys/smile.svg',
      ':soleil:': '/static/smileys/soleil.svg',
      ':(': '/static/smileys/triste.svg',
      ':euh:': '/static/smileys/unsure.svg',
      ':waw:': '/static/smileys/waw.svg',
      ':zorro:': '/static/smileys/zorro.svg',
      '^(;,;)^': '/static/smileys/cthulhu.svg',
      ':bounce:': '/static/smileys/bounce.svg',
      ':popcorn:': '/static/smileys/popcorn.svg',
      ':démon:': '/static/smileys/f47f.svg',
      ':demon:': '/static/smileys/f47f.svg',
      ':content:': '/static/smileys/f600.svg',
      ':joyeux:': '/static/smileys/f601.svg',
      ':mortderire:': '/static/smileys/f602.svg',
      ':daccord:': '/static/smileys/f603.svg',
      ':eneffet:': '/static/smileys/f604.svg',
      ':eneffetgené:': '/static/smileys/f605.svg',
      ':eneffetgene:': '/static/smileys/f605.svg',
      'x)': '/static/smileys/f606.svg',
      ':innocent:': '/static/smileys/f607.svg',
      ':démonjoyeux:': '/static/smileys/f608.svg',
      ':demonjoyeux:': '/static/smileys/f608.svg',
      ':clindoeil:': '/static/smileys/f609.svg',
      ':rejouis:': '/static/smileys/f60a.svg',
      ':yum:': '/static/smileys/f60b.svg',
      ':soulagé:': '/static/smileys/f60c.svg',
      ':soulage:': '/static/smileys/f60c.svg',
      '<3': '/static/smileys/f60d.svg',
      ':confiant:': '/static/smileys/f60e.svg',
      ':malicieux:': '/static/smileys/f60f.svg',
      ':indifférent:': '/static/smileys/f610.svg',
      ':indifferent:': '/static/smileys/f610.svg',
      ':détaché:': '/static/smileys/f611.svg',
      ':detache:': '/static/smileys/f611.svg',
      ':lassé:': '/static/smileys/f612.svg',
      ':lasse:': '/static/smileys/f612.svg',
      ':sueurfroide:': '/static/smileys/f613.svg',
      ':insatisfait:': '/static/smileys/f614.svg',
      ':-/': '/static/smileys/f615.svg',
      ':contrarié:': '/static/smileys/f616.svg',
      ':contrarie:': '/static/smileys/f616.svg',
      ':bisou:': '/static/smileys/f617.svg',
      ':bisoucoeur:': '/static/smileys/f618.svg',
      ':bisousourire:': '/static/smileys/f619.svg',
      ':bisourougir:': '/static/smileys/f61a.svg',
      ':-P': '/static/smileys/f61b.svg',
      ';-P': '/static/smileys/f61c.svg',
      'x-P': '/static/smileys/f61d.svg',
      ':déçuinquiet:': '/static/smileys/f61e.svg',
      ':decuinquiet:': '/static/smileys/f61e.svg',
      ':inquiet:': '/static/smileys/f61f.svg',
      ':fâché:': '/static/smileys/f620.svg',
      ':fache:': '/static/smileys/f620.svg',
      ':fâchérouge:': '/static/smileys/f621.svg',
      ':facherouge:': '/static/smileys/f621.svg',
      ':tristelarme:': '/static/smileys/f622.svg',
      'x(': '/static/smileys/f623.svg',
      ':fulminant:': '/static/smileys/f624.svg',
      ':deçularme:': '/static/smileys/f625.svg',
      ':decularme:': '/static/smileys/f625.svg',
      ':déçu:': '/static/smileys/f626.svg',
      ':decu:': '/static/smileys/f626.svg',
      ':déçutriste:': '/static/smileys/f627.svg',
      ':decutriste:': '/static/smileys/f627.svg',
      ':déçuangoissé:': '/static/smileys/f628.svg',
      ':decuangoisse:': '/static/smileys/f628.svg',
      ':éreinté:': '/static/smileys/f629.svg',
      ':ereinte:': '/static/smileys/f629.svg',
      ':somnole:': '/static/smileys/f62a.svg',
      ':fatigué:': '/static/smileys/f62b.svg',
      ':fatigue:': '/static/smileys/f62b.svg',
      ':grimace:': '/static/smileys/f62c.svg',
      ':pleure:': '/static/smileys/f62d.svg',
      ':ébahi:': '/static/smileys/f62e.svg',
      ':ebahi:': '/static/smileys/f62e.svg',
      ':étonné:': '/static/smileys/f62f.svg',
      ':etonne:': '/static/smileys/f62f.svg',
      ':angoissé:': '/static/smileys/f630.svg',
      ':angoisse:': '/static/smileys/f630.svg',
      ':hurlantdepeur:': '/static/smileys/f631.svg',
      ':abasourdi:': '/static/smileys/f632.svg',
      ':surprisrougi:': '/static/smileys/f633.svg',
      ':dort:': '/static/smileys/f634.svg',
      ':vertige:': '/static/smileys/f635.svg',
      ':muet:': '/static/smileys/f636.svg',
      ':masquetissu:': '/static/smileys/f637.svg',
      ':nonsatisfait:': '/static/smileys/f641.svg',
      ':satisfait:': '/static/smileys/f642.svg',
      ':inversé:': '/static/smileys/f643.svg',
      ':inverse:': '/static/smileys/f643.svg',
      ':regardauciel:': '/static/smileys/f644.svg',
      ':bouchezipper:': '/static/smileys/f910.svg',
      ':appâtdugain:': '/static/smileys/f911.svg',
      ':appatdugain:': '/static/smileys/f911.svg',
      ':thermomètre:': '/static/smileys/f912.svg',
      ':intello4yeux:': '/static/smileys/f913.svg',
      ':pensif:': '/static/smileys/f914.svg',
      ':blessé:': '/static/smileys/f915.svg',
      ':blesse:': '/static/smileys/f915.svg',
      ':bienveillant:': '/static/smileys/f917.svg',
      ':nausée:': '/static/smileys/f922.svg',
      ':nausee:': '/static/smileys/f922.svg',
      ':pliéderire:': '/static/smileys/f923.svg',
      ':pliederire:': '/static/smileys/f923.svg',
      ':baver:': '/static/smileys/f924.svg',
      ':pinocchio:': '/static/smileys/f925.svg',
      ':eternuer:': '/static/smileys/f927.svg',
      ':quésaco:': '/static/smileys/f928.svg',
      ':quesaco:': '/static/smileys/f928.svg',
      ':regardfan:': '/static/smileys/f929.svg',
      ':hébété:': '/static/smileys/f92a.svg',
      ':hebete:': '/static/smileys/f92a.svg',
      ':chut:': '/static/smileys/f92b.svg',
      ':fureur:': '/static/smileys/f92c.svg',
      ':bailler:': '/static/smileys/f92d.svg',
      ':vomir:': '/static/smileys/f92e.svg',
      ':tropcogiter:': '/static/smileys/f92f.svg',
      ':amoureux:': '/static/smileys/f970.svg',
      ':fêter:': '/static/smileys/f973.svg',
      ':feter:': '/static/smileys/f973.svg',
      ':maldecoeur:': '/static/smileys/f974.svg',
      ':avoirchaud:': '/static/smileys/f975.svg',
      ':avoirfroid:': '/static/smileys/f976.svg',
      ':désolé:': '/static/smileys/f97a.svg',
      ':desole:': '/static/smileys/f97a.svg',
      ':triste:': '/static/smileys/2639.svg',
      ':rougir:': '/static/smileys/263a.svg',
    },
    classes: 'smiley',
  },

  math: {
    inlineMathDouble: true,
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
    defaultImagePath: 'black.png',
    defaultOn: {
      statusCode: true,
      mimeType: false,
      fileTooBig: false,
    },
    downloadDestination: './img/',
    maxlength: 1000000,
    dirSizeLimit: 10000000,
  },
  sanitize: sanitizeConfig,
}

module.exports = remarkConfig
