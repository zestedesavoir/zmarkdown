/* eslint-disable max-len */
import {readFileSync as file} from 'fs'
import {join} from 'path'
import unified from 'unified'
import dedent from 'dedent'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import stringifyRemark from 'remark-stringify'

import plugin from '../src/'


const render = text => unified()
  .use(reParse)
  .use(plugin)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

const compiler = text => unified()
  .use(reParse)
  .use(stringifyRemark)
  .use(plugin)
  .processSync(text)

test('grid-table', () => {
  const {contents} = render(file(join(__dirname, 'grid-tables.md')))
  expect(contents).toMatchSnapshot()
})

test('grid-table double', () => {
  const {contents} = render(file(join(__dirname, 'grid-tables.double.md')))
  expect(contents).toMatchSnapshot()
})

test('regression: grid table in fenced code block', () => {
  const {contents} = render(`
\`\`\`
+---+---+---+
| A | B | C |
+===+===+===+
| D | E     |
|   +---+---+
|   | F | G |
+---+---+---+
\`\`\`
`)

  expect(contents).toMatchSnapshot()
})

test('regression: grid table in non-fenced code block', () => {
  const {contents} = render(`
    +---+---+---+
    | A | B | C |
    +===+===+===+
    | D | E     |
    |   +---+---+
    |   | F | G |
    +---+---+---+
`)

  expect(contents).toMatchSnapshot()
})

test('regression: should not crash with two spaces on the next line', () => {
  const {contents} = render(dedent`
    +----+----+
    + :) | :) +
    +----+----+
    ··
    `.replace(/·/g, ' '))

  expect(contents).toMatchSnapshot()
})

test('regression: should be parsed with two spaces on last line', () => {
  const {contents: base} = render(dedent`
    +----+----+
    + :) | :) +
    +----+----+

    hello
    `)

  const {contents} = render(dedent`
    +----+----+
    + :) | :) +
    +----+----+··

    hello
    `.replace(/·/g, ' '))

  expect(contents).toBe(base)
})

test('regression: should not crash with leading space', () => {
  const {contents: base} = render(dedent`
    ax
    +---+
    | b |
    +---+

    hello
    `)

  const {contents} = render(dedent`
    a·
    +---+
    | b |
    +---+

    hello
    `.replace(/·/g, ' '))

  expect(contents).toBe(base.replace('x', ' '))
})

test('regression: should not crash when followed by "sth<space>"', () => {
  const {contents: base} = render(dedent`
    +---+
    | A |
    +===+
    | B |
    +---+
    <-
    bug
    `)

  const {contents} = render(dedent`
    +---+
    | A |
    +===+
    | B |
    +---+
    <-·
    bug
    `.replace(/·/g, ' '))

  expect(contents).toBe(base)
})

test('regression: should ignore spaces at the right of the table', () => {
  const {contents: base} = render(dedent`
    +---+
    | A |
    +===+
    | B |
    +---+

    `)

  const {contents} = render(dedent`
    +---+
    | A |
    +===+···
    | B |·
    +---+

    `.replace(/·/g, ' '))

  expect(contents).toBe(base)
})

test('regression: handles east asian ambiguous width', () => {
  const {contents: base} = render(dedent`
    +---+
    | ï |
    +---+
  `)

  const {contents: test1} = render(dedent`
    +---+
    | é |
    +---+
  `)

  const {contents: test2} = render(dedent`
    +---+
    | Ê |
    +---+
  `)

  const {contents: test3} = render(dedent`
    +---+
    | ﬂ |
    +---+
  `)

  const {contents: test4} = render(dedent`
    +---+
    | ¯ |
    +---+
  `)

  expect(test1).toBe(base.replace('ï', 'é'))
  expect(test2).toBe(base.replace('ï', 'Ê'))
  expect(test3).toBe(base.replace('ï', 'ﬂ'))
  expect(test4).toBe(base.replace('ï', '¯'))
})

test('distinguish between tables of the same width', () => {
  const {contents: test1} = render(dedent`
    +---+---+---+
    | 1 | 2 | 3 |
    +---+---+---+
    |   | a     |
    +---+---+---+
    |     b |   |
    +-------+---+
  `)

  const {contents: test2} = render(dedent`
    +---+---+---+
    | 1 | 2 | 3 |
    +---+---+---+
    |   | a     |
    +---+-------+
    | b |       |
    +---+-------+
  `)

  expect(test1).not.toEqual(test2)
})

test('handles Cyrillic script', () => {
  const {contents: test1} = render(dedent`
    +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
    | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z | z |
    +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
    | А | Б | В | Г | Д | Е | Ё | Ж | З | И | Й | К | Л | М | Н | О | П | Р | С | Т | У | Ф | Х | Ц | Ч | Ш | Щ | Ъ | Ы | Ь | Э | Ю | Я |
    +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
    | а | б | в | г | д | е | ё | ж | з | и | й | к | л | м | н | о | п | р | с | т | у | ф | х | ц | ч | ш | щ | ъ | ы | ь | э | ю | я |
    +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
  `)

  const {contents: test2} = render(dedent`
    +-----+
    | abc |
    +-----+
    | ѥръ |
    +-----+
  `)

  const {contents: test3} = render(dedent`
    +---+
    | Ӂ |
    +---+
  `)

  const {contents: test4} = render(dedent`
    +---+---+
    | z | z |
    +---+---+
    | Ӽ | ӽ |
    +---+---+
    | Ў | ў |
    +---+---+
  `)

  expect(test1).toMatchSnapshot()
  expect(test2).toMatchSnapshot()
  expect(test3).toMatchSnapshot()
  expect(test4).toMatchSnapshot()
})

test('stringify', () => {
  const fileExample = file(join(__dirname, 'grid-tables.md'))
  const {contents} = render(fileExample)
  const contents2 = render(compiler(fileExample)).contents
  expect(contents).toBe(contents2)
})
