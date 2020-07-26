import {readdirSync as directory, readFileSync as file, lstatSync as stat} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
import footnotes from 'remark-footnotes'
import rebber from '../src'

const rebberConfig = {
  blockquote: (text) =>
    `[blockquote(${text})]`,
  break: () =>
    `[break(---)]`,
  code: (text, lang) =>
    `[code${lang ? lang[0].toUpperCase() + lang.slice(1) : ''}(${text})]`,
  // comment: () =>
  //   `break(`,
  definition: (ctx, identifier, url, title) =>
    `[definition(identifier=${identifier}, url=${url}, title=${title})]`,
  // delete: (text) =>
  //   `delete(${text})`,
  // emphasis: (text) =>
  //   `emphasis(${text})`,
  headings: [
    (text) => `heading1(${text})`,
    (text) => `heading2(${text})`,
    (text) => `heading3(${text})`,
    (text) => `heading4(${text})`,
    (text) => `heading5(${text})`,
    (text) => `heading6(${text})`,
    (text) => `heading7(${text})`,
  ],
  // html: (text) =>
  //   `html(${text})`,
  image: (node) =>
    `[image(${node.url})]`,
  // inlinecode: (text) =>
  //   `inlinecode(${text})`,
  link: (displayText, url, title) =>
    `[link(displayText=${displayText}, url=${url}, title=${title})]`,
  linkReference: (reference, content) =>
    `[linkReference(reference=${reference}, content=${content})]`,
  list: (content, isOrdered) =>
    `[${isOrdered ? '' : 'un'}orderedList(${content})]`,
  listItem: (content) =>
    `[listItem(${content})]`,
  // paragraph: (text) =>
  //   `paragraph(${text})`,
  // raw: (text) =>
  //   `raw(${text})`,
  // strong: (text) =>
  //   `strong(${text})`,
  // table: (ctx, node) => {
  //   return node.children.map(n => `row(${one(n)})`).join('\n')
  // },
  // tableCell: (ctx, node) =>
  //   `tableCell(${one(node)})`,
  // tableRow: (ctx, node) =>
  //   `tableRow(${one(node)})`,
  text: (text) =>
    `[text(${text})]`,
  thematicBreak: () =>
    `[thematicBreak(---)]`,
}

const specs = hydrateFixtures()

describe('rebber: remark specs', () => {
  Object.keys(specs).filter(Boolean).forEach(name => {
    const spec = specs[name]

    test(name, () => {
      const {contents} = unified()
        .use(reParse)
        .use(footnotes, {inlineNotes: true})
        .use(rebber)
        .processSync(spec)

      expect(contents.trim()).toMatchSnapshot(name)
    })
  })
})

describe('rebber: remark specs with config: custom macros', () => {
  Object.keys(specs).filter(Boolean).forEach(name => {
    const spec = specs[name]

    test(name, () => {
      const {contents} = unified()
        .use(reParse)
        .use(footnotes, {inlineNotes: true})
        .use(rebber, rebberConfig)
        .processSync(spec)

      expect(contents.trim()).toMatchSnapshot()
    })
  })
})

describe('toLaTeX: remark specs', () => {
  Object.keys(specs).filter(Boolean).forEach(name => {
    const spec = specs[name]

    test(name, () => {
      const mdast = unified()
        .use(reParse)
        .use(footnotes, {inlineNotes: true})
        .parse(spec)

      const latex = rebber.toLaTeX(mdast)

      expect(latex).toMatchSnapshot(name)
    })
  })
})

/* helpers */
function hydrateFixtures () {
  const base = join(__dirname, `fixtures/`)
  return directory(base)
    .reduce((tests, filename) => {
      const parts = filename.split('.')
      if (stat(join(base, filename)).isFile()) {
        tests[parts[0]] = file(join(base, filename), 'utf-8').trim()
      }
      return tests
    }, {})
}
