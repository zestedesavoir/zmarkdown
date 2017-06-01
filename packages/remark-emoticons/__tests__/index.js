import {readdirSync as directory, readFileSync as file} from 'fs'
import {join} from 'path'
import ava from 'ava'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

const base = join(__dirname, 'fixtures')
const specs = directory(base).reduce((tests, contents) => {
  const parts = contents.split('.')
  if (!tests[parts[0]]) {
    tests[parts[0]] = {}
  }
  tests[parts[0]][parts[1]] = file(join(base, contents), 'utf-8')
  return tests
}, {})

const entrypoints = [
  '../dist',
  '../src',
]

entrypoints.forEach(entrypoint => {
  const plugin = require(entrypoint)

  Object.keys(specs).filter(Boolean).forEach(name => {
    const spec = specs[name]

    ava(name, t => {
      const {contents} = unified()
        .use(reParse)
        .use(remark2rehype)
        .use(plugin, {
          ':ange:': '/static/smileys/ange.png',
          ':colere:': '/static/smileys/angry.gif',
          'o_O': '/static/smileys/blink.gif',
          ';)': '/static/smileys/clin.png',
          ':diable:': '/static/smileys/diable.png',
          ':D': '/static/smileys/heureux.png',
          '^^': '/static/smileys/hihi.png',
          ':o': '/static/smileys/huh.png',
          ':p': '/static/smileys/langue.png',
          ':magicien:': '/static/smileys/magicien.png',
          ':colere2:': '/static/smileys/mechant.png',
          ':ninja:': '/static/smileys/ninja.png',
          'x(': '/static/smileys/pinch.png',
          ':pirate:': '/static/smileys/pirate.png',
          ":'(": '/static/smileys/pleure.png',
          ':lol:': '/static/smileys/rire.gif',
          ':honte:': '/static/smileys/rouge.png',
          ':-°': '/static/smileys/siffle.png',
          ':)': '/static/smileys/smile.png',
          ':soleil:': '/static/smileys/soleil.png',
          ':(': '/static/smileys/triste.png',
          ':euh:': '/static/smileys/unsure.gif',
          ':waw:': '/static/smileys/waw.png',
          ':zorro:': '/static/smileys/zorro.png',
        })
        .use(stringify)
        .processSync(spec.fixture)

      t.deepEqual(contents, spec.expected.trim())
    })
  })

  ava('Errors without config', t => {
    const fail = () => unified()
      .use(reParse)
      .use(remark2rehype)
      .use(plugin)
      .use(stringify)
      .processSync('')

    t.throws(
      fail,
      Error,
      'remark-emoticons needs to be passed a configuration object as option'
    )
  })
})
