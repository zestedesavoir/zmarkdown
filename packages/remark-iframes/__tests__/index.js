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

  ava('video', t => {
    const config = {
      'www.dailymotion.com': {
        tag: 'iframe',
        width: 480,
        height: 270,
        disabled: false,
        replace: [
          ['video/', 'embed/video/'],
        ]
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
        ]
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
        ]
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
        removeAfter: '&'
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
        removeAfter: '&'
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
        removeAfter: '&'
      },
      'screen.yahoo.com': {
        tag: 'iframe',
        width: 624,
        height: 351,
        disabled: false,
        append: '?format=embed&player_autoplay=false'
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
        removeFileName: true
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

    const {contents} = unified()
      .use(reParse)
      .use(plugin, config)
      .use(remark2rehype)
      .use(stringify)
      .processSync(specs['video'].fixture)

    t.deepEqual(contents, specs['video'].expected.trim())
  })

  ava('extra', t => {
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
        removeAfter: '&'
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

    const {contents} = unified()
      .use(reParse)
      .use(plugin, config)
      .use(remark2rehype)
      .use(stringify)
      .processSync(specs['extra'].fixture)

    t.deepEqual(contents, specs['extra'].expected.trim())
  })

  ava('Errors without config', t => {
    const fail = () => unified()
      .use(reParse)
      .use(plugin)
      .use(remark2rehype)
      .use(stringify)
      .processSync('')

    t.throws(
      fail,
      Error,
      'remark-iframes needs to be passed a configuration object as option'
    )
  })

  ava('Errors with empty config', t => {
    const fail = () => unified()
      .use(reParse)
      .use(plugin, {})
      .use(remark2rehype)
      .use(stringify)
      .processSync('')

    t.throws(
      fail,
      Error,
      'remark-iframes needs to be passed a configuration object as option'
    )
  })


  ava('Errors with invalid config', t => {
    const fail = () => unified()
      .use(reParse)
      .use(plugin, 'foo')
      .use(remark2rehype)
      .use(stringify)
      .processSync('')

    t.throws(
      fail,
      Error,
      'remark-iframes needs to be passed a configuration object as option'
    )
  })
})
