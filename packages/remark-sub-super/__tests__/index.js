import dedent from 'dedent'
import {unified} from 'unified'
import reParse from 'remark-parse'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import plugin from '../lib/index'

const render = text => unified()
  .use(reParse)
  .use(remark2rehype)
  .use(plugin)
  .use(rehypeStringify)
  .processSync(text)

test('superscript', () => {
  const {value} = render(dedent`
    Foo ^sup^ kxcvj ^sup *string*^ bar

    not ^ here

    neither \^ here ^ because it's escaped
  `)
  expect(value).toMatchSnapshot()
})

test('subscript', () => {
  const {value} = render(dedent`
    Foo ~sup~ kxcvj ~sup *string*~ bar

    not ~ here

    neither \~ here ~ because it's escaped

    foo ^^a^^ bar
  `)
  expect(value).toMatchSnapshot()
})

test('regression 1', () => {
  const {value} = render(dedent`
    a^b^ a^b^ a^b^ a^b^ a^b^

    a~b~ a~b~ a~b~ a~b~ a~b~

    a~b~ a^b^ a~b~ a^b^ a~b~ a^b^

    a^b^ a~b~ a^b^ a~b~ a^b^ a~b~
  `)
  expect(value).toMatchSnapshot()
})

test('regression 2', () => {
  const {value} = render(dedent`
    Literally s^e^lfies tbh lo-fi. Actually health go retro polaroid\
    sriracha. Kogi live-edge ^mixtape^ marfa street ~art~ synth. Godard\
    synth truffaut selfies, vape fanny  subway tile. Stumptown af pabst,\
    try-hard fam ethical actually four dollar toast. Microdosing ^kogi^\
    brooklyn, locavore jianbing etsy sartorial _YOLO_. Williamsburg salvia\
    photo^a^ booth ^readymade^ listicle man braid. s^e^lfies

    Literally s^e^lfies tbh lo-fi. Actually health goa retro polaroid sriracha.\
    Kogi live-edge ^mixtape^ marfa street ~art~ synth. Godard synth truffaut\
    selfies, vape fanny  subway tile. Stumptown af pabst, try-hard fam ethical\
    actually four dollar toast. Microdosing ^kogi^ brooklyn, locavore jianbing\
    etsy sartorial _YOLO_. Williamsburg salvia photo^a^ booth ^readymade^\
    listicle man braid. s^e^lfies
  `)
  expect(value).toMatchSnapshot()
})

test('disallow empty tags', () => {
  const {value} = render(dedent`
    ^^foo^^
  `)
  expect(value).toMatchSnapshot()
})
