/* eslint-disable no-console */
import {readdirSync as directory, readFileSync as file, lstatSync as stat} from 'fs'
import {join} from 'path'
import unified from 'unified'
import reParse from 'remark-parse'
import rebber from '../src'

const {toLaTeX} = rebber

const base = join(__dirname, 'fixtures/remark/')
const fixtures = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  if (!tests[parts[0]]) {
    tests[parts[0]] = {}
  }
  if (stat(join(base, contents)).isFile()) {
    tests[parts[0]] = file(join(base, contents), 'utf-8')
  }
  return tests
}, {})

const rebberConfig = {
  blockquote: (text) =>
    `blockquote(${text})`,
  break: () =>
    `break(---)`,
  code: (text, lang) =>
    `code${lang ? lang[0].toUpperCase() + lang.slice(1) : ''}(${text})`,
  // comment: () =>
  //   `break(`,
  definition: (ctx, identifier, url, title) =>
    `definition(identifier=${identifier}, url=${url}, title=${title})`,
  // delete: (text) =>
  //   `delete(${text})`,
  // emphasis: (text) =>
  //   `emphasis(${text})`,
  footnote: (identifier, text, protect) =>
    `footnote(identifier=${identifier}, text=${text}, protect=${protect})`,
  footnoteDefinition: (identifier, text) =>
    `footnoteDefinition(identifier=${identifier}, text=${text})`,
  footnoteReference: (identifier) =>
    `footnoteReference(${identifier})`,
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
    `image(${node.url})`,
  // inlinecode: (text) =>
  //   `inlinecode(${text})`,
  link: (displayedText, url, title) =>
    `link(displayedText=${displayedText}, url=${url}, title=${title})`,
  linkReference: (reference, content) =>
    `linkReference(reference=${reference}, content=${content})`,
  list: (content, isOrdered) =>
    `${isOrdered ? '' : 'un'}orderedList(${content})`,
  listItem: (content) =>
    `listItem(${content})`,
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
    `text(${text})`,
  thematicBreak: () =>
    `thematicBreak(---)`,
}

describe('rebber: remark fixtures', () => {
  Object.keys(fixtures).filter(Boolean).forEach(name => {
    const fixture = fixtures[name]

    test(name, () => {
      const {contents} = unified()
        .use(reParse, {footnotes: true})
        .use(rebber)
        .processSync(fixture)

      expect(contents.trim()).toMatchSnapshot()
    })
  })
})

describe('rebber: remark fixtures with custom macros', () => {
  Object.keys(fixtures).filter(Boolean).forEach(name => {
    const fixture = fixtures[name]

    test(name, () => {
      const {contents} = unified()
        .use(reParse, {footnotes: true})
        .use(rebber, rebberConfig)
        .processSync(fixture)

      expect(contents.trim()).toMatchSnapshot()
    })
  })
})

describe('toLaTeX: remark fixtures', () => {
  Object.keys(fixtures).filter(Boolean).forEach(name => {
    const fixture = fixtures[name]

    test(name, () => {
      const mdast = unified()
        .use(reParse, {footnotes: true})
        .parse(fixture)

      const latex = toLaTeX(mdast, rebberConfig)
      expect(latex).toMatchSnapshot()
    })
  })
})

describe('toLaTeX: remark fixtures with custom macros', () => {
  Object.keys(fixtures).filter(Boolean).forEach(name => {
    const fixture = fixtures[name]

    test(name, () => {
      const mdast = unified()
        .use(reParse, {footnotes: true})
        .parse(fixture)

      const latex = toLaTeX(mdast, rebberConfig)
      expect(latex).toMatchSnapshot()
    })
  })
})
