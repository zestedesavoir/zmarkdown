import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import remarkCaption from '../../remark-captions/src'

import plugin from '../src/'

const config = {
  emoticons: {
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
  },
  classes: 'foo bar',
}

const render = text => unified()
  .use(reParse)
  .use(plugin, config)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

const renderToMarkdown = text => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(plugin, config)
  .use(remarkCaption)
  .processSync(text)

test('emoticons', () => {
  const {contents} = render(dedent`
    Hello :) Hey :D

    :)

    > Citation

    :D This is not a caption

    ![toto](https://zestedesavoir.com/media/galleries/3014/bee33fae-2216-463a-8b85-d1d9efe2c374.png)

    :D This is not a caption

    This is not a smiley:)

    Not :)a smiley either.

    Smiley after another node: [link](#foo) :)

    Smiley after another node w/2 spaces: [link](#foo)  :)

    Smiley after another node w/3 spaces: [link](#foo)   :)
  `)
  expect(contents).toMatchSnapshot()
})

test('emoticons without class', () => {
  const render = text => unified()
    .use(reParse)
    .use(plugin, config)
    .use(remark2rehype)
    .use(stringify)
    .processSync(text)

  delete config.classes

  const {contents} = render(dedent`
    Hello :) Hey :D

    :)

    > Citation

    :D This is not a caption

    ![toto](https://zestedesavoir.com/media/galleries/3014/bee33fae-2216-463a-8b85-d1d9efe2c374.png)

    :D This is not a caption

    This is not a smiley:)

    Not :)a smiley either.

    Smiley after another node: [link](#foo) :)

    Smiley after another node w/2 spaces: [link](#foo)  :)

    Smiley after another node w/3 spaces: [link](#foo)   :)
  `)
  expect(contents).toMatchSnapshot()
})

test('Errors without config', () => {
  const fail = () => unified()
    .use(reParse)
    .use(remark2rehype)
    .use(plugin)
    .use(stringify)
    .processSync('')

  expect(fail).toThrowError(Error)
})

test('renders to markdown', () => {
  const {contents} = renderToMarkdown(dedent`
    Hello :) Hey :D

    :)

    > Citation

    :D This is not a caption

    ![toto](https://zestedesavoir.com/media/galleries/3014/bee33fae-2216-463a-8b85-d1d9efe2c374.png)

    :D This is not a caption

    This is not a smiley:)

    Not :)a smiley either.

    Smiley after another node: [link](#foo) :)

    Smiley after another node w/2 spaces: [link](#foo)  :)

    Smiley after another node w/3 spaces: [link](#foo)   :)
  `)
  expect(contents).toMatchSnapshot()

  const recompiled = renderToMarkdown(contents).contents
  expect(recompiled).toBe(contents)
})
