const config = {
  reParse: {
    gfm: true,
    commonmark: false,
    yaml: false,
    footnotes: true,
    /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
    &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
    blocks: [],
  },

  headingShifter: 0,

  remark2rehype: {
    allowDangerousHTML: true
  },

  footnotesTitles: 'Retourner au texte de la note $id',

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

  katex: {
    inlineDoubleDisplay: true
  },

}

module.exports = config
