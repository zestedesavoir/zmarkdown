const camelToKebab = (match, l) => `-${l.toLowerCase()}`

const svgTags = [ // complete list of camelCase attributes
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
].reduce((map, tag) => {
  const kebab = tag.replace(/([A-Z])/g, camelToKebab)
  map[kebab] = tag
  return map
}, {})

const kebabRegExp = new RegExp(`( ${Object.keys(svgTags).join('=| ')}=)`, 'g')

const fixSVGAttribute = (match, kebabMatch) => {
  const kebab = kebabMatch.slice(1, -1)
  const camel = svgTags[kebab]
  if (camel) {
    return ` ${camel}=`
  }
  return kebabMatch
}

const fixSVGContent = (match, svgContent, a, b, c, d) => {
  const newContent = svgContent.replace(kebabRegExp, fixSVGAttribute)
  return match.replace(svgContent, newContent)
}

const fixSVG = (content) => {
  return content.replace(/<svg(.*)<\/svg>/, fixSVGContent)
}

module.exports = fixSVG
