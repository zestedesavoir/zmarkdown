Split(['#left', '#center', '#right'], {
  minSize: 200,
})

Split(['#left-top', '#left-bottom'], {
  sizes: [75, 25],
  direction: 'vertical'
})

Split(['#center-top', '#center-bottom'], {
  sizes: [75, 25],
  direction: 'vertical'
})

ZMarkdown.use(ZMarkdownZHTML);
ZMarkdown.use(ZMarkdownZLatex);

ZMarkdown.setDefaultModule('zhtml');

const ansiUp = new AnsiUp()
const editor = document.querySelector('#left-top > textarea')
const ast = document.querySelector('#left-bottom > pre > code')
const render = document.querySelector('#center-top > div')
const html = document.querySelector('#center-bottom > pre > code')
const latex = document.querySelector('#right > pre')
editor.addEventListener('input', update)

document.addEventListener('DOMContentLoaded', update)

function buildSpoilers (elems) {
  elems.forEach(elem => {
    if (!elem.classList.contains('spoiler-build')) {
      let a = document.createElement('a');
      a.textContent = 'Afficher/Masquer le contenu masqué'
      a.classList.add('spoiler-title')
      a.classList.add('ico-after')
      a.classList.add('view')
      a.href = '#'
      a.onclick = (e) => {
        elem.style.display = !elem.style.display || elem.style.display === 'none' ? 'block' : 'none'
        e.preventDefault()
      }
      elem.parentNode.insertBefore(a, elem)
      elem.classList.add('spoiler-build')
    }
  })
}

function update () {
  ZMarkdown.render(editor.value).then((vFile) => {
    render.innerHTML = vFile.toString().trim()
    html.textContent = vFile.toString().trim()
    buildSpoilers(render.querySelectorAll('.custom-block-spoiler'))
  })
  ZMarkdown.render(editor.value, 'zlatex').then((vFile) => {
    latex.textContent = vFile.toString().trim()
  })
  const mdast = ZMarkdown.parse(editor.value)
  ast.innerHTML = ansiUp.ansi_to_html(ZMarkdown.getParser().inspect.color(mdast))
}
