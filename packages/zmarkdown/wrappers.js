module.exports = createWrapper

function createWrapper (tag, classes = [], filter = node => true, subWrapper = null) {
  if (!subWrapper) {
    return new Wrapper(tag, classes, filter, defaultWrapperFunction).wrapAround
  }
  return new Wrapper(tag, classes, filter, recursiveWrapperFunctionFactory(subWrapper)).wrapAround
}

function defaultWrapperFunction (parent, index, node) {
  const wrapperNode = {
    type: this.tag,
    properties: {
      class: this.classes.join(' ')
    },
    children: [node]
  }
  parent.children.splice(index, 1, wrapperNode)
  return wrapperNode
}

function recursiveWrapperFunctionFactory (wrapper) {
  return (parent, index, node) => {
    const subWrapperNode = wrapper.wrapArround(parent, index, node)
    if (!subWrapperNode) {
      return undefined
    }
    const wrapperNode = {
      type: this.tag,
      properties: {
        class: this.classes.join(' ')
      },
      children: [subWrapperNode]
    }
    parent.children.splice(index, 1, wrapperNode)
    return wrapperNode
  }
}


function Wrapper (tag, classes = [], filter = node => true, wrap = defaultWrapperFunction) {
  this.tag = tag
  this.classes = classes
  this.filter = filter
  this.wrapperFunction = wrap.bind(this)
}

Wrapper.prototype.wrapAround = function (parent, index, node) {
  if (this.filter(node) && !node.wrapped) {
    const wrappedNode = this.wrapperFunction(parent, index, node)
    node.wrapped = !!wrappedNode
    return wrappedNode
  }
  return undefined
}
