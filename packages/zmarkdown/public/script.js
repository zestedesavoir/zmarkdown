Split(['#left', '#right'], {
  sizes: [50, 50],
  minSize: 200,
})

ZMarkdown.use(ZMarkdownZHTML);

ZMarkdown.setDefaultType("zhtml");

const render = document.querySelector('#right > div')
const editor = document.querySelector('#left > textarea')
editor.addEventListener('input', update)

document.addEventListener('DOMContentLoaded', update)

function update () {
  ZMarkdown.render(editor.value).then((vFile) => {
    render.innerHTML = vFile.toString().trim()
  })
}
