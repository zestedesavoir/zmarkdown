export const plugins = {}
export let defaultType

export function use (obj) {
  if (!obj) {
    throw new Error('This is not an object')
  }

  // Check the object structure
  if (!('name' in obj)) {
    throw new Error("missing 'name' in plugin")
  } else if (typeof obj.name !== 'string') {
    throw new Error('Plugin name should be a string')
  }
  if (!('render' in obj)) {
    throw new Error("missing 'render' function in plugin")
  } else if (typeof obj.render !== 'function') {
    throw new Error('render is not a function')
  }

  plugins[obj.name] = obj
}

export function setDefaultType (type) {
  if (type in plugins) {
    defaultType = type
  } else {
    throw new Error(`Unknown type: ${type}`)
  }
}

export function resetDefaultType () {
  defaultType = null
}

export function render (str, type = null, cb = null) {
  if (plugins.length === 0) {
    throw new Error('No plugins available.')
  } else if (!type && !defaultType) {
    throw new Error('This function expects to be called with (str, type = null), ' +
      'type is missing. To omit type parameter you should set the default type.')
  } else if (type && !(type in plugins)) {
    throw new Error(`Unknown type: ${type}`)
  }

  if (!type) {
    type = defaultType
  }

  return plugins[type].render(str, cb)
}
