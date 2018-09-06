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

export function setDefaultProcessor (type) {
  if (plugins.hasOwnProperty(type)) {
    defaultType = type
  } else {
    throw new Error(`Unknown processor (plugin name): ${type}`)
  }
}

export function resetDefaultProcessor () {
  defaultType = null
}

export function render (str, name = null, cb = null) {
  if (plugins.length === 0) {
    throw new Error('No plugins available.')
  }

  switch (typeof name) {
    case 'string':
      if (name && !plugins.hasOwnProperty(name)) {
        throw new Error(`Unknown processor (plugin name): ${name}`)
      }
      break
    case 'function':
      if (!cb) {
        cb = name
      }
      break
    default:
      if (!name && !defaultType) {
        if (name === null) {
          throw new Error(`Bad type for parameter 'name'. Expected 'string'
          or 'function' but was: ${typeof name}`)
        }
        throw new Error('This function expects to be called with (str, name = null, cb = null), ' +
          'name is missing. To omit name parameter you should set the default name.')
      }
  }

  if (!name) {
    name = defaultType
  }

  return plugins[name].render(str, cb)
}
