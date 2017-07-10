/**
 * Created by fdambrine on 06/07/17.
 */
module.exports = (node, index, parent) => {
  const linkNode = {
    type: 'link',
    url: node.data.hProperties.src,
    children: [
      {type: 'text', value: node.data.hProperties.src}
    ]
  }
  console.error(node)
  const thumbnailNode = {
    type: 'image',
    url: node.data.thumbnail
  }
  if (parent.type !== 'figure') {
    const figureNode = {
      type: 'figure',
      children: [thumbnailNode, {
        type: 'figcaption',
        children: [linkNode]
      }]
    }
    parent.children.splice(index, 1, figureNode)
  } else {
    parent.children.splice(index, 1, thumbnailNode)
    parent.children[parent.children.length - 1].children.push(linkNode)
  }
}
