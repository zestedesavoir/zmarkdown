const shortid = require('shortid')

module.exports = {
  autolinkHeadings: {
    behaviour: 'append',
  },

  bridge: {
    allowDangerousHTML: true,
  },

  footnotesTitles: 'Retourner au texte de la note $id',

  highlight: {
    ignoreMissing: true,
    plainText:     ['console'],
    aliases:       {tex: ['latex']},
  },

  sanitize: require('../sanitize'),

  postfixFootnotes: `-${shortid.generate()}`,

  postProcessors: {
    iframeWrappers:   require('./iframe-wrappers'),
    footnotesReorder: true,
  },
}
