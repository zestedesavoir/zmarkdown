export const plugins = {}
export let defaultType

export function use (obj) {
  if (!obj || (typeof obj !== 'object')) {
    throw new Error('This is not an object')
  }

  // Check the object structure

  if (!obj.hasOwnProperty('name')) {
    throw new Error("missing 'name' in plugin")
  }
  if (typeof obj.name !== 'string') {
    throw new Error('Plugin name should be a string')
  }
  if (!obj.hasOwnProperty('render')) {
    throw new Error("missing 'render' function in plugin")
  }
  if (typeof obj.render !== 'function') {
    throw new Error('render is not a function')
  }

  plugins[obj.name] = obj
}

export function setDefaultType (type) {
  if (plugins.hasOwnProperty(type)) {
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
  }

  switch (typeof type) {
    case 'string':
      if (type && !plugins.hasOwnProperty(type)) {
        throw new Error(`Unknown type: ${type}`)
      }
      break
    case 'function':
      if (!cb) {
        cb = type
      }
      break
    default:
      if (!type && !defaultType) {
        if (type === null) {
          throw new Error(`Bad type for parameter 'type'. Expected 'string'
          or 'function' but was: ${typeof type}`)
        }
        throw new Error('This function expects to be called with (str, type = null, cb = null), ' +
          'type is missing. To omit type parameter you should set the default type.')
      }
  }

  if (!type) {
    type = defaultType
  }

  return plugins[type].render(str, cb)
}
