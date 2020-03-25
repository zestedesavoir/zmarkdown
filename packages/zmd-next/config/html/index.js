const createWrapper = require('../../postprocessors/wrappers')

const jsFiddleAndInaFilter = node => {
  if (node.properties.src) {
    return node.properties.src.includes('jsfiddle.') || node.properties.src.includes('ina.')
  }
  return false
}

module.exports = {
  autolinkHeadings: {
    behaviour: 'append',
  },

  bridge: {
    allowDangerousHTML: true,
  },

  footnotesTitles: 'Retourner au texte de la note $id',

  headingShifter: 0,

  highlight: {
    ignoreMissing: true,
    plainText: ['console'],
    aliases: {tex: ['latex']},
  },

  sanitize: require('../sanitize'),

  postProcessors: {
    iframeWrappers: {
      iframe: [
        createWrapper(
          'iframe',
          ['div', 'div'],
          [['video-wrapper'], ['video-container']],
          node => !jsFiddleAndInaFilter(node),
        ),
        createWrapper('iframe', 'div', ['iframe-wrapper'], jsFiddleAndInaFilter),
      ],
      table: [
        createWrapper('table', 'div', ['table-wrapper']),
      ],
    },
    footnotesReorder: true,
  }
}