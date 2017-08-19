const remarkConfig = require('./remark-config')

const rebberConfig = {
  override: {
    abbr: require('rebber/dist/custom-types/abbr'),
    centerAligned: require('rebber/dist/custom-types/align'),
    // TODO: 'comment' nodes don't exist!
    // comment: require('rebber/dist/custom-types/comment'),
    emoticon: require('rebber/dist/custom-types/emoticon'),
    errorCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    figure: require('rebber/dist/custom-types/figure'),
    gridTable: require('rebber/dist/custom-types/gridTable'),
    informationCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    inlineMath: require('rebber/dist/custom-types/math'),
    kbd: require('rebber/dist/custom-types/kbd'),
    leftAligned: require('rebber/dist/custom-types/align'),
    math: require('rebber/dist/custom-types/math'),
    questionCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    rightAligned: require('rebber/dist/custom-types/align'),
    secretCustomBlock: require('rebber/dist/custom-types/customBlocks'),
    sub: require('rebber/dist/custom-types/sub'),
    sup: require('rebber/dist/custom-types/sup'),
    tableHeader: require('rebber/dist/custom-types/tableHeader'),
    warningCustomBlock: require('rebber/dist/custom-types/customBlocks'),
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
