const remarkConfig = require('./remark-config')

const rebberConfig = {
  preprocessors: {
    iframe: require('rebber-plugins/dist/preprocessors/iframe')
  },
  override: {
    abbr: require('rebber-plugins/dist/type/abbr'),
    centerAligned: require('rebber-plugins/dist/type/align'),
    // TODO: 'comment' nodes don't exist!
    // comment: require('rebber-plugins/dist/type/comment'),
    emoticon: require('rebber-plugins/dist/type/emoticon'),
    errorCustomBlock: require('rebber-plugins/dist/type/customBlocks'),
    figure: require('rebber-plugins/dist/type/figure'),
    gridTable: require('rebber-plugins/dist/type/gridTable'),
    informationCustomBlock: require('rebber-plugins/dist/type/customBlocks'),
    inlineMath: require('rebber-plugins/dist/type/math'),
    kbd: require('rebber-plugins/dist/type/kbd'),
    leftAligned: require('rebber-plugins/dist/type/align'),
    math: require('rebber-plugins/dist/type/math'),
    questionCustomBlock: require('rebber-plugins/dist/type/customBlocks'),
    rightAligned: require('rebber-plugins/dist/type/align'),
    secretCustomBlock: require('rebber-plugins/dist/type/customBlocks'),
    sub: require('rebber-plugins/dist/type/sub'),
    sup: require('rebber-plugins/dist/type/sup'),
    tableHeader: require('rebber-plugins/dist/type/tableHeader'),
    warningCustomBlock: require('rebber-plugins/dist/type/customBlocks'),
  },
  emoticons: remarkConfig.emoticons,
  codeAppendiceTitle: 'Annexes',
  customBlocks: {
    map: {
      error: 'Error',
      information: 'Information',
      question: 'Question',
      secret: 'Spoiler',
      warning: 'Warning',
    },
  },
  link: {
    prefix: 'http://zestedesavoir.com'
  },
  image: {
    inlineImage: (node) => `\\inlineImage{${node.url}}`,
    image: (node) => `\\image{${node.url}}`,
  },
  figure: {
    image: (_, caption, extra) => `\\image{${extra.url}}${caption ? `[${caption}]` : ''}\n`
  },
  headings: [
    (val) => `\\levelOneTitle{${val}}\n`,
    (val) => `\\levelTwoTitle{${val}}\n`,
    (val) => `\\levelThreeTitle{${val}}\n`,
    (val) => `\\levelFourTitle{${val}}\n`,
    (val) => `\\levelFiveTitle{${val}}\n`,
    (val) => `\\levelSixTitle{${val}}\n`,
    (val) => `\\levelSevenTitle{${val}}\n`,
  ],
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

module.exports = rebberConfig
