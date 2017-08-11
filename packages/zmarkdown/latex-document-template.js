const template = ({
  contentType,
  title,
  authors,
  license,
  smileysDirectory,
  disableToc = false,
  latex
}) => {
  if (
    !contentType ||
    !title ||
    !Array.isArray(authors) ||
    !license ||
    !smileysDirectory ||
    !latex
  ) {
    throw new Error(
      `Missing arguments, here's what I got: ` +
      `${JSON.stringify({contentType, title, authors, license, smileysDirectory, latex}, null, 2)}`)
  }

  return `\\documentclass[${contentType}]{zmdocument}

\\usepackage{blindtext}
\\title{${title}}
\\author{${authors.join(', ')}}
\\licence{${license}}

\\smileysPath{${smileysDirectory}}
\\makeglossaries

\\begin{document}
\\maketitle
${disableToc ? '' : '\\tableofcontents'}

${latex}
\\end{document}`
}

module.exports = template
