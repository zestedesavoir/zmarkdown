import { micromark } from 'micromark'
import micromarkPing from '../lib/index'
import micromarkPingHtml from '../lib/html'

const specificationTests = {
  'works': ['@foo', '<p><a href="/@foo">@foo</a></p>'],
  'with stars': ['@**foo bar**', '<p><a href="/@foo%20bar">@foo bar</a></p>'],
  'opening with two stars': ['@*foo bar**', '<p>@<em>foo bar</em>*</p>'],
  'closing with two stars': ['@**foo bar*', '<p>@*<em>foo bar</em></p>'],
  'opening must close': ['@**foo bar', '<p>@**foo bar</p>'],
  'escape opening': ['@\\**foo bar**', '<p>@**foo bar**</p>'],
  'escape closing': ['@**foo bar\\**', '<p>@*<em>foo bar*</em></p>'],
  'escape at': ['\\@foo', '<p>@foo</p>'],
  'needs content - simple': ['@', '<p>@</p>'],
  'needs content - starred': ['@****', '<p>@****</p>'],
  'can contain Unicode': ['@Moté', '<p><a href="/@Mot%C3%A9">@Moté</a></p>'],
  'can contain star - lonely': ['@*', '<p><a href="/@*">@*</a></p>'],
  'can contain star - surrounded': ['@foo*bar', '<p><a href="/@foo*bar">@foo*bar</a></p>'],
  'no unescaped star': ['@*****', '<p>@*****</p>'],
  'escaped star': ['@**\\***', '<p><a href="/@*">@*</a></p>'],
  'space break ping': ['@foo bar', '<p><a href="/@foo">@foo</a> bar</p>'],
  'cannot contain inline - link': ['@**[link](hello)**', '<p><a href="/@%5Blink%5D(hello)">@[link](hello)</a></p>'],
  'is textual': ['**@foo**', '<p><strong><a href="/@foo">@foo</a></strong></p>', true],
  'intertwines with strong': ['**@**foo**', '<p><strong>@</strong>foo**</p>', true],
  'can contain references': ['@**&#35;**', '<p><a href="/@#">@#</a></p>'],
  'can contain references': ['@&#35;', '<p><a href="/@&amp;amp;#35;">@&amp;#35;</a></p>'],
}

const renderString = (fixture) =>
  micromark(fixture, {
    extensions: [micromarkPing()],
    htmlExtensions: [micromarkPingHtml]
  })

describe('conforms to the specification', () => {
  for (const test in specificationTests) {
    const jestFunction = (!specificationTests[test][2]) ? it : it.skip

    jestFunction(test, () => {
      const [input, expectedOutput] = specificationTests[test]
      const output = renderString(input)

      expect(output).toEqual(expectedOutput)
    })
  }
})
