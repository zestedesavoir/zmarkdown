const clone = require('clone')

const remarkConfig = require('../remark-config')
const rebberConfig = require('../rebber-config')
remarkConfig.noTypography = true
remarkConfig.ping.pingUsername = () => false

const zmarkdown = require('../')

const renderString = (config = {remarkConfig, rebberConfig}) =>
  (input) =>
    zmarkdown(config, 'latex').renderString(input).contents

const renderFile = (config = {remarkConfig, rebberConfig}) =>
  (input) =>
    zmarkdown(config, 'latex').renderFile(input).contents

const remarkConfigOverride = (config) => {
  const newConfig = clone(remarkConfig)
  Object.assign(newConfig, config)
  return {
    remarkConfig: newConfig,
    rebberConfig: rebberConfig
  }
}

describe('#heading-shift', () => {

  it(`shifts in range`, () => {
    const config = remarkConfigOverride({ headingShifter: 1 })
    expect(renderString(config)('### should be h4')).toMatchSnapshot()
  })

  it(`shifts past range`, () => {
    const config = remarkConfigOverride({ headingShifter: 10 })
    expect(renderString(config)('### should be h6')).toMatchSnapshot()
  })

  it(`shifts before range`, () => {
    const config = remarkConfigOverride({ headingShifter: -10 })
    expect(renderString(config)('### should be h1')).toMatchSnapshot()
  })
})

describe('#basic', () => {
  const dir = `${__dirname}/fixtures/basic/`

  it(`properly renders amps-and-angle-encoding.txt`, () => {
    const filepath = `${dir}/amps-and-angle-encoding.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders angle-links-and-img.txt`, () => {
    const filepath = `${dir}/angle-links-and-img.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders auto-links.txt`, () => {
    const filepath = `${dir}/auto-links.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders backlash-escapes.txt`, () => {
    const filepath = `${dir}/backlash-escapes.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders blockquotes-with-code-blocks.txt`, () => {
    const filepath = `${dir}/blockquotes-with-code-blocks.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders codeblock-in-list.txt`, () => {
    const filepath = `${dir}/codeblock-in-list.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders hard-wrapped.txt`, () => {
    const filepath = `${dir}/hard-wrapped.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders horizontal-rules.txt`, () => {
    const filepath = `${dir}/horizontal-rules.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders inline-html-advanced.txt`, () => {
    const filepath = `${dir}/inline-html-advanced.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders inline-html-comments.txt`, () => {
    const filepath = `${dir}/inline-html-comments.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders inline-html-simple.txt`, () => {
    const filepath = `${dir}/inline-html-simple.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders links-inline.txt`, () => {
    const filepath = `${dir}/links-inline.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders links-reference.txt`, () => {
    const filepath = `${dir}/links-reference.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders literal-quotes.txt`, function () {
    const filepath = `${dir}/literal-quotes.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })


  it(`properly renders nested-blockquotes.txt`, () => {
    const filepath = `${dir}/nested-blockquotes.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders ordered-and-unordered-list.txt`, () => {
    const filepath = `${dir}/ordered-and-unordered-list.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders strong-and-em-together.txt`, () => {
    const filepath = `${dir}/strong-and-em-together.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders tabs.txt`, () => {
    const filepath = `${dir}/tabs.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders tidyness.txt`, () => {
    const filepath = `${dir}/tidyness.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })
})

describe('#extensions', () => {
  const dir = `${__dirname}/fixtures/extensions/`

  it(`properly renders fenced_code.txt`, () => {
    const filepath = `${dir}/fenced_code.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders github_flavored.txt`, () => {
    const filepath = `${dir}/github_flavored.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  describe('#extra', () => {
    const dir = `${__dirname}/fixtures/extensions/extra/`

    it(`properly renders abbr.txt`, () => {
      const filepath = `${dir}/abbr.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders extra_config.txt`, function () {
      const filepath = `${dir}/extra_config.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders footnote_many_footnotes.txt`, () => {
      const filepath = `${dir}/footnote_many_footnotes.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders footnote_placeholder.txt`, function () {
      const filepath = `${dir}/footnote_placeholder.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders footnote.txt`, () => {
      const filepath = `${dir}/footnote.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders named_markers.txt`, function () {
      const filepath = `${dir}/named_markers.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders tables.txt`, () => {
      const filepath = `${dir}/tables.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders tables-2.txt`, () => {
      const filepath = `${dir}/tables-2.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })
  })
})

describe('#misc', () => {
  const dir = `${__dirname}/fixtures/misc/`

  it(`properly renders adjacent-headers.txt`, () => {
    const filepath = `${dir}/adjacent-headers.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders amp-in-url.txt`, () => {
    const filepath = `${dir}/amp-in-url.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders ampersand.txt`, () => {
    const filepath = `${dir}/ampersand.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders arabic.txt`, () => {
    const filepath = `${dir}/arabic.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders autolinks_with_asterisks.txt`, function () {
    const filepath = `${dir}/autolinks_with_asterisks.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders backtick-escape.txt`, () => {
    const filepath = `${dir}/backtick-escape.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders blank_lines_in_codeblocks.txt`, () => {
    const filepath = `${dir}/blank_lines_in_codeblocks.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders blank-block-quote.txt`, () => {
    const filepath = `${dir}/blank-block-quote.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders block_html_attr.txt`, () => {
    const filepath = `${dir}/block_html_attr.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders block_html_simple.txt`, () => {
    const filepath = `${dir}/block_html_simple.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders block_html5.txt`, () => {
    const filepath = `${dir}/block_html5.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders blockquote-below-paragraph.txt`, () => {
    const filepath = `${dir}/blockquote-below-paragraph.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders blockquote-hr.txt`, function () {
    const filepath = `${dir}/blockquote-hr.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders blockquote.txt`, () => {
    const filepath = `${dir}/blockquote.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders bold_links.txt`, () => {
    const filepath = `${dir}/bold_links.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders br.txt`, () => {
    const filepath = `${dir}/br.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders bracket_re.txt`, () => {
    const filepath = `${dir}/bracket_re.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders brackets-in-img-title.txt`, function () {
    const filepath = `${dir}/brackets-in-img-title.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders code-first-line.txt`, () => {
    const filepath = `${dir}/code-first-line.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders comments.txt`, () => {
    const filepath = `${dir}/comments.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders CRLF_line_ends.txt`, () => {
    const filepath = `${dir}/CRLF_line_ends.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders div.txt`, () => {
    const filepath = `${dir}/div.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders em_strong.txt`, () => {
    const filepath = `${dir}/em_strong.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders em-around-links.txt`, () => {
    const filepath = `${dir}/em-around-links.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders email.txt`, () => {
    const filepath = `${dir}/email.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders escaped_chars_in_js.txt`, () => {
    const filepath = `${dir}/escaped_chars_in_js.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders funky-list.txt`, function () {
    const filepath = `${dir}/funky-list.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders h1.txt`, () => {
    const filepath = `${dir}/h1.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders hash.txt`, function () {
    const filepath = `${dir}/hash.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders header-in-lists.txt`, function () {
    const filepath = `${dir}/header-in-lists.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders headers.txt`, function () {
    const filepath = `${dir}/headers.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders hline.txt`, function () {
    const filepath = `${dir}/hline.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders html-comments.txt`, function () {
    const filepath = `${dir}/html-comments.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders html.txt`, function () {
    const filepath = `${dir}/html.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders image_in_links.txt`, () => {
    const filepath = `${dir}/image_in_links.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders image-2.txt`, () => {
    const filepath = `${dir}/image-2.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders image.txt`, () => {
    const filepath = `${dir}/image.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders ins-at-start-of-paragraph.txt`, () => {
    const filepath = `${dir}/ins-at-start-of-paragraph.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders inside_html.txt`, () => {
    const filepath = `${dir}/inside_html.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders lazy-block-quote.txt`, () => {
    const filepath = `${dir}/lazy-block-quote.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders link-with-parenthesis.txt`, () => {
    const filepath = `${dir}/link-with-parenthesis.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders lists.txt`, () => {
    const filepath = `${dir}/lists.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders lists2.txt`, () => {
    const filepath = `${dir}/lists2.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders lists3.txt`, () => {
    const filepath = `${dir}/lists3.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders lists4.txt`, () => {
    const filepath = `${dir}/lists4.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders lists5.txt`, () => {
    const filepath = `${dir}/lists5.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders lists6.txt`, function () {
    const filepath = `${dir}/lists6.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders lists7.txt`, function () {
    const filepath = `${dir}/lists7.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders lists8.txt`, () => {
    const filepath = `${dir}/lists8.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders markup-inside-p.txt`, function () {
    const filepath = `${dir}/markup-inside-p.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders mismatched-tags.txt`, () => {
    const filepath = `${dir}/mismatched-tags.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders missing-link-def.txt`, function () {
    const filepath = `${dir}/missing-link-def.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders more_comments.txt`, function () {
    const filepath = `${dir}/more_comments.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders multi-line-tags.txt`, () => {
    const filepath = `${dir}/multi-line-tags.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders multi-paragraph-block-quote.txt`, () => {
    const filepath = `${dir}/multi-paragraph-block-quote.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders multi-test.txt`, function () {
    const filepath = `${dir}/multi-test.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders multiline-comments.txt`, function () {
    const filepath = `${dir}/multiline-comments.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders nested-lists.txt`, function () {
    const filepath = `${dir}/nested-lists.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders nested-patterns.txt`, () => {
    const filepath = `${dir}/nested-patterns.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders normalize.txt`, () => {
    const filepath = `${dir}/normalize.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders numeric-entity.txt`, () => {
    const filepath = `${dir}/numeric-entity.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders para-with-hr.txt`, () => {
    const filepath = `${dir}/para-with-hr.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders php.txt`, () => {
    const filepath = `${dir}/php.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders pre.txt`, function () {
    const filepath = `${dir}/pre.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders raw_whitespace.txt`, function () {
    const filepath = `${dir}/raw_whitespace.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders russian.txt`, () => {
    const filepath = `${dir}/russian.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders smart_em.txt`, () => {
    const filepath = `${dir}/smart_em.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders some-test.txt`, function () {
    const filepath = `${dir}/some-test.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders span.txt`, () => {
    const filepath = `${dir}/span.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders strong-with-underscores.txt`, () => {
    const filepath = `${dir}/strong-with-underscores.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders stronintags.txt`, function () {
    const filepath = `${dir}/stronintags.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders tabs-in-lists.txt`, function () {
    const filepath = `${dir}/tabs-in-lists.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders two-spaces.txt`, function () {
    const filepath = `${dir}/two-spaces.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders uche.txt`, function () {
    const filepath = `${dir}/uche.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders underscores.txt`, () => {
    const filepath = `${dir}/underscores.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders url_spaces.txt`, function () {
    const filepath = `${dir}/url_spaces.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

})

describe('#options', () => {
  const dir = `${__dirname}/fixtures/options/`

  it(`properly renders no-attributes.txt`, () => {
    const filepath = `${dir}/no-attributes.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })
})

describe('#php', () => {
  const dir = `${__dirname}/fixtures/php/`

  it(`properly renders Code Spans.txt`, () => {
    const filepath = `${dir}/Code Spans.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders Code block on second line.txt`, () => {
    const filepath = `${dir}/Code block on second line.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders Email auto links.txt`, function () {
    const filepath = `${dir}/Email auto links.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders Horizontal Rules.txt`, () => {
    const filepath = `${dir}/Horizontal Rules.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders Inline HTML (Simple).txt`, function () {
    const filepath = `${dir}/Inline HTML (Simple).txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders Inline HTML comments.txt`, () => {
    const filepath = `${dir}/Inline HTML comments.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders Links, inline style.txt`, function () {
    const filepath = `${dir}/Links, inline style.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it(`properly renders MD5 Hashes.txt`, () => {
    const filepath = `${dir}/MD5 Hashes.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders Nesting.txt`, function () {
    const filepath = `${dir}/Nesting.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders Parens in URL.txt`, function () {
    const filepath = `${dir}/Parens in URL.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders Tight blocks.txt`, function () {
    const filepath = `${dir}/Tight blocks.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })
})

describe('#pl', () => {
  describe.skip('#Tests_2004', function () {
    const dir = `${__dirname}/fixtures/pl/Tests_2004/`

    it(`properly renders Amps and angle encoding.txt`, () => {
      const filepath = `${dir}/Amps and angle encoding.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Auto links.txt`, () => {
      const filepath = `${dir}/Auto links.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Backslash escapes.txt`, () => {
      const filepath = `${dir}/Backslash escapes.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Blockquotes with code blocks.txt`, () => {
      const filepath = `${dir}/Blockquotes with code blocks.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Hard-wrapped paragraphs with list-like lines.txt`, () => {
      const filepath = `${dir}/Hard-wrapped paragraphs with list-like lines.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Horizontal rules.txt`, () => {
      const filepath = `${dir}/Horizontal rules.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Inline HTML (Advanced).txt`, () => {
      const filepath = `${dir}/Inline HTML (Advanced).txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Inline HTML (Simple).txt`, () => {
      const filepath = `${dir}/Inline HTML (Simple).txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Inline HTML comments.txt`, () => {
      const filepath = `${dir}/Inline HTML comments.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Links, inline style.txt`, () => {
      const filepath = `${dir}/Links, inline style.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Links, reference style.txt`, () => {
      const filepath = `${dir}/Links, reference style.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Literal quotes in titles.txt`, () => {
      const filepath = `${dir}/Literal quotes in titles.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Nested blockquotes.txt`, () => {
      const filepath = `${dir}/Nested blockquotes.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Ordered and unordered lists.txt`, () => {
      const filepath = `${dir}/Ordered and unordered lists.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Strong and em together.txt`, () => {
      const filepath = `${dir}/Strong and em together.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Tabs.txt`, () => {
      const filepath = `${dir}/Tabs.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Tidyness.txt`, () => {
      const filepath = `${dir}/Tidyness.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Yuri-Attributes.txt`, () => {
      const filepath = `${dir}/Yuri-Attributes.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Yuri-Email.txt`, () => {
      const filepath = `${dir}/Yuri-Email.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Yuri-Links-in-Headers.txt`, () => {
      const filepath = `${dir}/Yuri-Links-in-Headers.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })
  })

  describe('#Tests_2007', () => {
    const dir = `${__dirname}/fixtures/pl/Tests_2007/`

    it(`properly renders Amps and angle encoding.txt`, () => {
      const filepath = `${dir}/Amps and angle encoding.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Auto links.txt`, () => {
      const filepath = `${dir}/Auto links.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Blockquotes with code blocks.txt`, () => {
      const filepath = `${dir}/Blockquotes with code blocks.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders Hard-wrapped paragraphs with list-like lines.txt`, function () {
      const filepath = `${dir}/Hard-wrapped paragraphs with list-like lines.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Horizontal rules.txt`, () => {
      const filepath = `${dir}/Horizontal rules.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders Inline HTML (Advanced).txt`, function () {
      const filepath = `${dir}/Inline HTML (Advanced).txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders Inline HTML (Simple).txt`, function () {
      const filepath = `${dir}/Inline HTML (Simple).txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Inline HTML comments.txt`, () => {
      const filepath = `${dir}/Inline HTML comments.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders Links, inline style.txt`, function () {
      const filepath = `${dir}/Links, inline style.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Links, shortcut references.txt`, () => {
      const filepath = `${dir}/Links, shortcut references.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders Literal quotes in titles.txt`, function () {
      const filepath = `${dir}/Literal quotes in titles.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Nested blockquotes.txt`, () => {
      const filepath = `${dir}/Nested blockquotes.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Ordered and unordered lists.txt`, () => {
      const filepath = `${dir}/Ordered and unordered lists.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Strong and em together.txt`, () => {
      const filepath = `${dir}/Strong and em together.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Tabs.txt`, () => {
      const filepath = `${dir}/Tabs.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders Tidyness.txt`, () => {
      const filepath = `${dir}/Tidyness.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })
  })
})

describe('#zds', () => {
  const dir = `${__dirname}/fixtures/zds/`

  it.skip(`properly renders rediger_sur_zds_part1.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part1.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part2.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part2.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part3.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part3.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part4.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part4.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part5.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part5.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part6.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part6.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part7.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part7.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part8.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part8.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part9.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part9.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  it.skip(`properly renders rediger_sur_zds_part10.txt`, function () {
    const filepath = `${dir}/rediger_sur_zds_part10.txt`
    expect(renderFile()(filepath).trim()).toMatchSnapshot()
  })

  describe('#extensions', () => {
    const dir = `${__dirname}/fixtures/zds/extensions/`

    it(`properly renders align.txt`, () => {
      const filepath = `${dir}/align.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it.skip(`properly renders comments_config.txt`, function () {
      const filepath = `${dir}/comments_config.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders comments.txt`, () => {
      const filepath = `${dir}/comments.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders customblock.txt`, () => {
      const filepath = `${dir}/customblock.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders delext.txt`, () => {
      const filepath = `${dir}/delext.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders emoticons.txt`, () => {
      const filepath = `${dir}/emoticons.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders grid_tables.txt`, () => {
      const filepath = `${dir}/grid_tables.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders kbd.txt`, () => {
      const filepath = `${dir}/kbd.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders math.txt without custom config`, () => {
      const filepath = `${dir}/math.txt`
      const config = remarkConfigOverride({ katex: {}, math: {} })
      const rendered = renderFile(config)(filepath)
      expect((rendered.match(/\$\$/g) || []).length).toBe(0)
      expect((rendered.match(/\\\[/g) || []).length).toBe(1)
      expect((rendered.match(/\$/g) || []).length).toBe(6)
    })

    it(`properly renders math.txt`, () => {
      const filepath = `${dir}/math.txt`
      const rendered = renderFile()(filepath)
      expect((rendered.match(/\$\$/g) || []).length).toBe(4)
      expect((rendered.match(/\\\[/g) || []).length).toBe(1)
      expect((rendered.match(/\$/g) || []).length).toBe(10)
    })

    it.skip(`properly renders smart_legend.txt`, function () {
      const filepath = `${dir}/smart_legend.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })
    it.skip(`properly renders smart_legend_bis.txt`, function () {
      const filepath = `${dir}/smart_legend_bis.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders subsuperscript.txt`, () => {
      const filepath = `${dir}/subsuperscript.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders urlize.txt`, () => {
      const filepath = `${dir}/urlize.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders video_extra.txt`, () => {
      const filepath = `${dir}/video_extra.txt`
      const config = remarkConfigOverride({ iframes: {
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
          append: 'embedded/result,js,html,css/'
        }
      }})
      expect(renderFile(config)(filepath).trim()).toMatchSnapshot()
    })

    it(`properly renders video.txt`, () => {
      const filepath = `${dir}/video.txt`
      expect(renderFile()(filepath).trim()).toMatchSnapshot()
    })
  })
})
