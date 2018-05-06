import {readFileSync as file} from 'fs'
import {join} from 'path'
import unified from 'unified'
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

test('stringify', () => {
  const fileExample = file(join(__dirname, 'grid-tables.md'))
  const {contents} = render(fileExample)
  const contents2 = render(compiler(fileExample)).contents
  expect(contents).toBe(contents2)
})
