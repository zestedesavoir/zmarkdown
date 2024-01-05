const visit = require('unist-util-visit')

module.exports = () => tree => {
  visit(tree, node => {
    if (node.type !== 'element' ||
        node.tagName !== 'img' ||
        !node.properties.src) return

    // Ignore smileys, which may be eagerly loaded
    if (node.properties.class &&
        node.properties.class.includes('smiley')) return

    node.properties.loading = 'lazy'
  })
}
