const textrApostrophes = require('typographic-apostrophes')
const textrApostrophesForPlurals = require('typographic-apostrophes-for-possessive-plurals')
const textrCopyright = require('typographic-copyright')
const textrEllipses = require('typographic-ellipses')
const textrEmDashes = require('typographic-em-dashes')
const textrEnDashes = require('typographic-en-dashes')
const textrRegisteredTrademark = require('typographic-registered-trademark')
const textrSingleSpaces = require('typographic-single-spaces')
const textrTrademark = require('typographic-trademark')

const textrColon = require('typographic-colon')
const textrEmDash = require('typographic-em-dash')
const textrExclamationMark = require('typographic-exclamation-mark')
const textrGuillemets = require('typographic-guillemets')
const textrPercent = require('typographic-percent')
const textrPermille = require('typographic-permille')
const textrQuestionMark = require('typographic-question-mark')
const textrSemicolon = require('typographic-semicolon')

const defaultConfig = {
  reParse: {
    gfm: true,
    commonmark: false,
    yaml: false,
    footnotes: true,
    /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
    &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
    blocks: [],
  },

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

  headingShifter: 0,

  remark2rehype: {
    allowDangerousHTML: true
  },

  footnotesTitles: 'Retourner au texte de la note $id',

  alignBlocks: {
    center: 'align-center',
    right: 'align-right',
  },

  customBlocks: {
    secret: 'spoiler',
    s: 'spoiler',
    information: 'information ico-after',
    i: 'information ico-after',
    question: 'question ico-after',
    q: 'question ico-after',
    attention: 'warning ico-after',
    a: 'warning ico-after',
    erreur: 'error ico-after',
    e: 'error ico-after',
  },

  escapeEscaped: ['&'],

  emoticons: {
    ':ange:': '/static/smileys/ange.png',
    ':colere:': '/static/smileys/angry.gif',
    'o_O': '/static/smileys/blink.gif',
    ';)': '/static/smileys/clin.png',
    ':diable:': '/static/smileys/diable.png',
    ':D': '/static/smileys/heureux.png',
    '^^': '/static/smileys/hihi.png',
    ':o': '/static/smileys/huh.png',
    ':p': '/static/smileys/langue.png',
    ':magicien:': '/static/smileys/magicien.png',
    ':colere2:': '/static/smileys/mechant.png',
    ':ninja:': '/static/smileys/ninja.png',
    'x(': '/static/smileys/pinch.png',
    ':pirate:': '/static/smileys/pirate.png',
    ":'(": '/static/smileys/pleure.png',
    ':lol:': '/static/smileys/rire.gif',
    ':honte:': '/static/smileys/rouge.png',
    ':-°': '/static/smileys/siffle.png',
    ':)': '/static/smileys/smile.png',
    ':soleil:': '/static/smileys/soleil.png',
    ':(': '/static/smileys/triste.png',
    ':euh:': '/static/smileys/unsure.gif',
    ':waw:': '/static/smileys/waw.png',
    ':zorro:': '/static/smileys/zorro.png',
  },

  math: {
    inlineMathDouble: true
  },

  katex: {
    inlineMathDoubleDisplay: true
  },

  iframes: {
    'www.dailymotion.com': {
      tag: 'iframe',
      width: 480,
      height: 270,
      disabled: false,
      replace: [
        ['video/', 'embed/video/'],
      ]
    },
    'www.vimeo.com': {
      tag: 'iframe',
      width: 500,
      height: 281,
      disabled: false,
      replace: [
        ['http://', 'https://'],
        ['www.', ''],
        ['vimeo.com/', 'player.vimeo.com/video/'],
      ]
    },
    'vimeo.com': {
      tag: 'iframe',
      width: 500,
      height: 281,
      disabled: false,
      replace: [
        ['http://', 'https://'],
        ['www.', ''],
        ['vimeo.com/', 'player.vimeo.com/video/'],
      ]
    },
    'www.youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      removeAfter: '&'
    },
    'youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      removeAfter: '&'
    },
    'youtu.be': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['youtu.be', 'www.youtube.com/embed'],
      ],
      removeAfter: '&'
    },
    'screen.yahoo.com': {
      tag: 'iframe',
      width: 624,
      height: 351,
      disabled: false,
      append: '?format=embed&player_autoplay=false'
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
      removeFileName: true
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
    }
  },

  captions: {
    external: {
      table: 'Table:',
      gridTable: 'Table:',
      code: 'Code:',
      math: 'Equation:',
    },
    internal: {
      iframe: 'Video:',
      math: 'Equation:',
      inlineMath: 'Equation:'
    }
  }
}

const rebberConfig = {
  override: {
    emoticon: require('rebber/dist/custom-types/emoticon'),
    figure: require('rebber/dist/custom-types/figure'),
    sub: require('rebber/dist/custom-types/sub'),
    sup: require('rebber/dist/custom-types/sup'),
    kbd: require('rebber/dist/custom-types/kbd'),
    CenterAligned: require('rebber/dist/custom-types/align'),
    RightAligned: require('rebber/dist/custom-types/align'),
    informationCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    secretCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    errorCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    warningCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    questionCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    abbr: require('rebber/dist/custom-types/abbr'),
    gridTable: require('rebber/dist/custom-types/gridTable'),
    math: require('rebber/dist/custom-types/math'),
    inlineMath: require('rebber/dist/custom-types/math'),
  },
  emoticons: defaultConfig.emoticons,
  codeAppendiceTitle: 'Annexes',
  link: {
    prefix: 'http://zestedesavoir.com'
  },
}

Object.assign(rebberConfig.override, {
  eCustomBlock: (ctx, node) => {
    node.type = 'errorCustomBlock'
    return rebberConfig.override.errorCustomBlock(ctx, node)
  },
  erreurCustomBlock: (ctx, node) => {
    node.type = 'errorCustomBlock'
    return rebberConfig.override.errorCustomBlock(ctx, node)
  },
  iCustomBlock: (ctx, node) => {
    node.type = 'informationCustomBlock'
    return rebberConfig.override.informationCustomBlock(ctx, node)
  },
  qCustomBlock: (ctx, node) => {
    node.type = 'questionCustomBlock'
    return rebberConfig.override.questionCustomBlock(ctx, node)
  },
  sCustomBlock: (ctx, node) => {
    node.type = 'secretCustomBlock'
    return rebberConfig.override.secretCustomBlock(ctx, node)
  },
  aCustomBlock: (ctx, node) => {
    node.type = 'warningCustomBlock'
    return rebberConfig.override.warningCustomBlock(ctx, node)
  },
  attentionCustomBlock: (ctx, node) => {
    node.type = 'warningCustomBlock'
    return rebberConfig.override.warningCustomBlock(ctx, node)
  },
})

defaultConfig.rebber = rebberConfig

module.exports = defaultConfig
