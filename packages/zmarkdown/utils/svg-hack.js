// complete list of camelCase attributes
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
const camelAttributes = [
  'allowReorder', 'attributeName', 'attributeType', 'autoReverse',
  'baseFrequency', 'baseProfile', 'calcMode', 'clipPathUnits', 'contentScriptType',
  'contentStyleType', 'diffuseConstant', 'edgeMode', 'externalResourcesRequired',
  'filterRes', 'filterUnits', 'glyphRef', 'gradientTransform', 'gradientUnits',
  'kernelMatrix', 'kernelUnitLength', 'keyPoints', 'keySplines', 'keyTimes', 'lengthAdjust',
  'limitingConeAngle', 'markerHeight', 'markerUnits', 'markerWidth', 'maskContentUnits',
  'maskUnits', 'numOctaves', 'pathLength', 'patternContentUnits', 'patternTransform',
  'patternUnits', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'preserveAlpha',
  'preserveAspectRatio', 'primitiveUnits', 'refX', 'refY', 'repeatCount', 'repeatDur',
  'requiredExtensions', 'requiredFeatures', 'specularConstant', 'specularExponent',
  'spreadMethod', 'startOffset', 'stdDeviation', 'stitchTiles', 'surfaceScale',
  'systemLanguage', 'tableValues', 'targetX', 'targetY', 'textLength', 'viewBox',
  'viewTarget', 'xChannelSelector', 'yChannelSelector', 'zoomAndPan',
]

const camelToKebab = (match, l) => `-${l.toLowerCase()}`
// build a hashmap of {'foo-bar': 'fooBar'}
const kebabToCamel = camelAttributes.reduce((map, camelAttribute) => {
  const kebabAttribute = camelAttribute.replace(/([A-Z])/g, camelToKebab)
  map[kebabAttribute] = camelAttribute
  return map
}, {})

const kebabRegExp = new RegExp(`( ${Object.keys(kebabToCamel).join('=| ')}=)`, 'g')

const fixSVGAttribute = (match, kebabMatch) => {
  const kebabAttribute = kebabMatch.slice(1, -1)
  const camel = kebabToCamel[kebabAttribute]
  if (camel) {
    return ` ${camel}=`
  }
  return kebabMatch
}

const fixSVGContent = (match, svgContent) => {
  const newContent = svgContent.replace(kebabRegExp, fixSVGAttribute)
  return match.replace(svgContent, newContent)
}

const matchSVG = new RegExp('<svg(.*)</svg>', 's')
const fixSVG = (content) => {
  return content.replace(matchSVG, fixSVGContent)
}

module.exports = fixSVG
