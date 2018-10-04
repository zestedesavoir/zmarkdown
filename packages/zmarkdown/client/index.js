import dedent from 'dedent'

export const modules = {}
export let defaultType

function validateModule (moduleName) {
  if (modules.length === 0) {
    throw new Error('No module available.')
  }

  if (!moduleName && !defaultType) {
    if (!moduleName || typeof moduleName !== 'string') {
      throw new Error(dedent`Bad type for parameter 'moduleName'.
      Expected 'string' but was: ${typeof moduleName}`)
    }
    throw new Error('This function expects to be called with ' +
      '(str, moduleName = null), moduleName is missing. ' +
      'To omit moduleName parameter you should set the default moduleName.')
  }
}

export function use (obj) {
  if (!obj || (typeof obj !== 'object')) {
    throw new Error('This is not an object')
  }

  // Check the object structure

  if (!obj.hasOwnProperty('name')) {
    throw new Error("missing 'name' in module")
  }
  if (typeof obj.name !== 'string') {
    throw new Error('module name should be a string')
  }
  if (!obj.hasOwnProperty('render')) {
    throw new Error("missing 'render' function in module")
  }
  if (typeof obj.render !== 'function') {
    throw new Error('render is not a function')
  }

  modules[obj.name] = obj
}

export function setDefaultModule (type) {
  if (modules.hasOwnProperty(type)) {
    defaultType = type
  } else {
    throw new Error(`Unknown module name: ${type}`)
  }
}

export function resetDefaultModule () {
  defaultType = null
}

export function render (str, moduleName = null, cb = null) {
  if (modules.length === 0) {
    throw new Error('No module available.')
  }

  switch (typeof moduleName) {
    case 'string':
      if (moduleName && !modules.hasOwnProperty(moduleName)) {
        throw new Error(`Unknown module name: ${moduleName}`)
      }
      break
    case 'function':
      if (!cb) {
        cb = moduleName
      }
      break
    default:
      if (!moduleName && !defaultType) {
        if (moduleName === null) {
          throw new Error(dedent`Bad type for parameter 'moduleName'. Expected 'string'
          or 'function' but was: ${typeof moduleName}`)
        }
        throw new Error('This function expects to be called with ' +
          '(str, moduleName = null, cb = null), moduleName is missing. ' +
          'To omit moduleName parameter you should set the default moduleName.')
      }
  }

  if (!moduleName) {
    moduleName = defaultType
  }

  return modules[moduleName].render(str, cb)
}

export function parse (str, moduleName = null) {
  validateModule(moduleName)

  if (!moduleName) {
    moduleName = defaultType
  }

  return modules[moduleName].parse(str)
}

export function getParser (moduleName = null) {
  validateModule(moduleName)

  if (!moduleName) {
    moduleName = defaultType
  }

  return modules[moduleName].getParser()
}
