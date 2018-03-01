import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import stringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'

import plugin from '../src/'


const render = (text, config) => unified()
  .use(reParse)
  .use(plugin, config)
  .use(remark2rehype)
  .use(stringify)
  .processSync(text)

const renderMarkdown = (text, config) => unified()
  .use(reParse)
  .use(remarkStringify)
  .use(plugin, config)
  .processSync(text)

test('video', () => {
  const config = {
    'www.dailymotion.com': {
      tag: 'iframe',
      width: 480,
      height: 270,
      disabled: false,
      replace: [
        ['video/', 'embed/video/'],
      ],
    },
    'www.vimeo.com': {
      tag: 'iframe',
      width: 500,
      height: 281,
      disabled: false,
      replace: [
        ['http://', 'https://'],
        ['www.', ''],
        ['vimeo.com/', 'player.vimeo.com/video/'],
      ],
    },
    'vimeo.com': {
      tag: 'iframe',
      width: 500,
      height: 281,
      disabled: false,
      replace: [
        ['http://', 'https://'],
        ['www.', ''],
        ['vimeo.com/', 'player.vimeo.com/video/'],
      ],
    },
    'www.youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      thumbnail: {
        format: 'http://img.youtube.com/vi/{id}/0.jpg',
        id: '.+/(.+)$',
      },
      removeAfter: '&',
    },
    'youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      thumbnail: {
        format: 'http://img.youtube.com/vi/{id}/0.jpg',
        id: '.+/(.+)$',
      },
      removeAfter: '&',
    },
    'youtu.be': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['youtu.be', 'www.youtube.com/embed'],
      ],
      thumbnail: {
        format: 'http://img.youtube.com/vi/{id}/0.jpg',
        id: '.+/(.+)$',
      },
      removeAfter: '&',
    },
    'screen.yahoo.com': {
      tag: 'iframe',
      width: 624,
      height: 351,
      disabled: false,
      append: '?format=embed&player_autoplay=false',
    },
    'www.ina.fr': {
      tag: 'iframe',
      width: 620,
      height: 349,
      disabled: false,
      replace: [
        ['www.', 'player.'],
        ['/video/', '/player/embed/'],
      ],
      append: '/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/560/315/1/148db8',
      removeFileName: true,
    },
    'www.jsfiddle.net': {
      tag: 'iframe',
      width: 560,
      height: 560,
      disabled: false,
      replace: [
        ['http://', 'https://'],
      ],
      append: 'embedded/result,js,html,css/',
      match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
    },
    'jsfiddle.net': {
      tag: 'iframe',
      width: 560,
      height: 560,
      disabled: false,
      replace: [
        ['http://', 'https://'],
      ],
      append: 'embedded/result,js,html,css/',
      match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
    },
  }

  const {contents} = render(dedent`
    Test video
    ==========

    !(https://www.youtube.com/watch?v=BpJKvrjLUp0)

    !(https://www.dailymotion.com/video/x2y6lhm)

    !(http://vimeo.com/133693532)

    !(https://screen.yahoo.com/weatherman-gives-forecast-using-taylor-191821481.html)

    A [link with **bold**](http://example.com)

    !(https://youtu.be/BpJKvrjLUp0)

    !(http://youtube.com/watch?v=BpJKvrjLUp0)

    !(http://jsfiddle.net/Sandhose/BcKhe/1/)

    !(http://jsfiddle.net/zgjhjv9j/)

    !(http://jsfiddle.net/zgjhjv9j/1/)

    !(https://www.youtube.com/watch?v=1Bh4DZ2xGmw&ab_channel=DestinationPr%C3%A9pa)

    !(http://www.ina.fr/video/MAN9062216517/)

    This one should not be allowed:

    !(http://jsfiddle.net/Sandhose/BcKhe/)

    !(https://www.youtube.com/watch?v=BpJKvrjLUp0)
    with text after
  `, config)

  expect(contents).toMatchSnapshot()
})

test('extra', () => {
  const config = {
    'www.youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      ignoredQueryStrings: ['feature'],
      removeAfter: '&',
    },
    'jsfiddle.net': {
      tag: 'iframe',
      width: 560,
      height: 560,
      disabled: true,
      replace: [
        ['http://', 'https://'],
      ],
      append: 'embedded/result,js,html,css/',
    },
  }

  const {contents} = render(dedent`
    Test video extra
    ================

    A [link with **bold**](http://example.com)

    !(https://www.youtube.com/watch?v=BpJKvrjLUp0)
    
    !(https://www.youtube.com/watch?feature=embedded&v=BpJKvrjLUp0)

    These ones should not be allowed by config:

    !(http://jsfiddle.net/Sandhose/BcKhe/1/)

    !(http://jsfiddle.net/zgjhjv9j/)

    !(http://jsfiddle.net/zgjhjv9j/1/)

    !(http://jsfiddle.net/Sandhose/BcKhe/)
  `, config)

  expect(contents).toMatchSnapshot()
})

test('Errors without config', () => {
  const fail = () => render('')
  expect(fail).toThrowError(Error)
})

test('Errors with empty config', () => {
  const fail = () => render('', {})
  expect(fail).toThrowError(Error)
})


test('Errors with invalid config', () => {
  const fail = () => render('', '')
  expect(fail).toThrowError(Error)
})


test('Compiles to Markdown', () => {
  const config = {
    'www.youtube.com': {
      tag: 'iframe',
      width: 560,
      height: 315,
      disabled: false,
      replace: [
        ['watch?v=', 'embed/'],
        ['http://', 'https://'],
      ],
      removeAfter: '&',
    },
    'jsfiddle.net': {
      tag: 'iframe',
      width: 560,
      height: 560,
      disabled: true,
      replace: [
        ['http://', 'https://'],
      ],
      append: 'embedded/result,js,html,css/',
      match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
      thumbnail: {
        format: 'http://www.unixstickers.com/image/data/stickers' +
        '/jsfiddle/JSfiddle-blue-w-type.sh.png',
      },
    },
  }
  const txt = dedent`
    Test compiles remark iframes
    ============================

    A [link with **bold**](http://example.com)

    !(https://www.youtube.com/watch?v=BpJKvrjLUp0)

    These ones should not be allowed by config:

    !(http://jsfiddle.net/Sandhose/BcKhe/1/)

    !(http://jsfiddle.net/zgjhjv9j/)

    !(http://jsfiddle.net/zgjhjv9j/1/)

    !(http://jsfiddle.net/Sandhose/BcKhe/)

    Hello !(this is a parenthesis) guys
  `
  const {contents} = renderMarkdown(txt, config)
  expect(contents).toMatchSnapshot()

  const recompiled = renderMarkdown(contents.replace(/&#x3A;/g, ':'), config).contents
  expect(recompiled).toBe(contents)

  config['jsfiddle.net'].disabled = false
  const withJsFiddleActivated = renderMarkdown(txt, config).contents
  expect(withJsFiddleActivated).toMatchSnapshot()

  const recompiledWithJsFiddleActivated = renderMarkdown(withJsFiddleActivated.replace(/&#x3A;/g, ':'), config).contents
  expect(recompiledWithJsFiddleActivated).toBe(withJsFiddleActivated)
})
