Split(['#left', '#center', '#right'], {
  minSize: 200,
})

ZMarkdown.use(ZMarkdownZHTML);
ZMarkdown.use(ZMarkdownZLatex);

ZMarkdown.setDefaultProcessor("zhtml");

const render = document.querySelector('#center > div')
const latex = document.querySelector('#right > div')
const editor = document.querySelector('#left > textarea')
editor.addEventListener('input', update)

document.addEventListener('DOMContentLoaded', update)

function update () {
  ZMarkdown.render(editor.value).then((vFile) => {
    render.innerHTML = vFile.toString().trim()
  })
  ZMarkdown.render(editor.value, 'zlatex').then((vFile) => {
    latex.innerHTML = vFile.toString().trim()
  })
}
