const assert = require('assert')

const template = ({
  contentType,
  title,
  authors,
  license,
  licenseDirectory,
  smileysDirectory,
  disableToc = false,
  latex,
}) => {
  assert(contentType, 'Error with argument: "contentType"')
  assert(title, 'Error with argument: "title"')
  assert(Array.isArray(authors), 'Error with argument: "authors"')
  assert(license, 'Error with argument: "license"')
  assert(smileysDirectory, 'Error with argument: "smileysDirectory"')
  assert(latex, 'Error with argument: "latex"')
  const shortLicenseName = license.toLowerCase().replace('cc-', '')

  return `\\documentclass[${contentType}]{zmdocument}

\\usepackage{blindtext}
\\title{${title}}
\\author{${authors.join(', ')}}
\\licence[${licenseDirectory}/${shortLicenseName}.svg]{${license}}\
{https://creativecommons.org/licenses/${shortLicenseName}/4.0/legalcode}

\\smileysPath{${smileysDirectory}}
\\makeglossaries

\\begin{document}
\\maketitle
${disableToc ? '' : '\\tableofcontents'}

${latex}
\\end{document}`
}

module.exports = template
