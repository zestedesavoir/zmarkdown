import dedent from 'dedent'
import {unified} from 'unified'
import reParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import iframesPlugin from '../lib/index'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import rehypeStringify from 'rehype-stringify'

const render = async (text, config) => unified()
  .use(reParse)
  .use(remarkGfm)
  .use(iframesPlugin, config)
  .use(remark2rehype)
  .use(rehypeStringify)
  .process(text)

const renderMarkdown = async (text, config) => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(iframesPlugin, config)
  .process(text)

const providers = [
  {
    hostname: ['youtube.com', 'www.youtube.com', 'youtu.be'],
    width: 560,
    height: 315,
    disabled: false,
    oembed: 'https://www.youtube.com/oembed'
  },
  {
    hostname: ['jsfiddle.net', 'www.jsfiddle.net'],
    width: 560,
    height: 560,
    disabled: false,
    match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
    transformer: embedLink => `${embedLink.replace('http://', 'https://')}embedded/result,js,html,css/`
  }
]

test('works with oembed', async () => {
  const {value} = await render(dedent`
    !(https://www.youtube.com/watch?v=FdltlrKFr1w)

    Not parsed:

    !(https://www.youtube.com/watch?v=FdltlrKFr1w)
    with text after

    https://www.youtube.com/watch?v=FdltlrKFr1w
  `, {providers})

  expect(value).toMatchSnapshot()
})

test('works with transformer', async () => {
  const {value} = await render(dedent`
    !(http://jsfiddle.net/Sandhose/BcKhe/1/)

    !(http://jsfiddle.net/zgjhjv9j/)

    !(http://jsfiddle.net/zgjhjv9j/1/)

    Not parsed:

    !(http://jsfiddle.net/Sandhose/BcKhe/)
  `, {providers})

  expect(value).toMatchSnapshot()
})

test('fails without config', async () => {
  expect(render('')).rejects.toThrowError(Error)
})

test('fails with empty config', async () => {
  expect(render('', {})).rejects.toThrowError(Error)
})


test('fails with invalid config', async () => {
  expect(render('', '')).rejects.toThrowError(Error)
})

test('oembed falls back', async () => {
  const providers = [
    {
      hostname: ['youtube.com', 'www.youtube.com', 'youtu.be'],
      width: 560,
      height: 315,
      disabled: false,
      oembed: 'http://example.com:7777/oembed'
    }
  ]

  const result = await render(dedent`
    !(https://www.youtube.com/watch?v=FdltlrKFr1w)
  `, {providers})

  expect(result.messages[0].message).toContain('failed')
  expect(result.value).toMatchSnapshot()
})

test('fails on invalid url', async () => {
  const result = await render(dedent`
    !(https//www.youtube.com/watch?v=FdltlrKFr1w)
  `, {providers})

  expect(result.messages[0].message).toContain('invalid')
  expect(result.value).not.toContain('iframe')
})

test('allow thumbnails', async () => {
  providers[1].thumbnail = 'https://zestedesavoir.com/media/galleries/3795/e55907f1-1459-44fe-bba6-5e509b61a477.png.60x60_q95_crop.jpg'

  const {value} = await render(dedent`
    !(http://jsfiddle.net/Sandhose/BcKhe/1/)
  `, {providers})

  expect(value).toMatchSnapshot()

  providers[1].thumbnail = () => 'https://zestedesavoir.com/media/galleries/3795/e55907f1-1459-44fe-bba6-5e509b61a477.png.60x60_q95_crop.jpg'

  const {value: withFunction} = await render(dedent`
    !(http://jsfiddle.net/Sandhose/BcKhe/1/)
  `, {providers})
  expect(withFunction).toEqual(value)
})

test('fails on disabled provider', async () => {
  providers[0].disabled = true

  const result = await render(dedent`
    !(https://www.youtube.com/watch?v=FdltlrKFr1w)
  `, {providers})

  expect(result.messages[0].message).toContain('not supported')
  expect(result.value).not.toContain('iframe')
})

test('allows lazy loading', async () => {
  const providers = [
    {
      hostname: ['youtube.com', 'www.youtube.com', 'youtu.be'],
      width: 560,
      height: 315,
      disabled: false,
      lazyLoad: true,
      oembed: 'https://www.youtube.com/oembed',
    }
  ]

  const {value} = await render('!(http://youtube.com/watch?v=FdltlrKFr1w)', {providers})
  expect(value).toContain('loading="lazy"')
})

test('compiles to Markdown', async () => {
  providers[0].disabled = false

  const txt = dedent`
    A [link with **bold**](http://example.com)

    !(https://www.youtube.com/watch?v=FdltlrKFr1w)

    These ones should not be allowed by config:

    !(http://jsfiddle.net/Sandhose/BcKhe/1/)

    !(http://jsfiddle.net/zgjhjv9j/)

    !(http://jsfiddle.net/zgjhjv9j/1/)

    !(http://jsfiddle.net/Sandhose/BcKhe/)

    Foo !(this is a parenthesis) bar
  `
  const {value} = await renderMarkdown(txt, {providers})
  expect(value).toMatchSnapshot()

  providers[1].disabled = true
  const {value: withJsFiddleActivated} = await renderMarkdown(txt, {providers})
  expect(withJsFiddleActivated).toMatchSnapshot()
})
