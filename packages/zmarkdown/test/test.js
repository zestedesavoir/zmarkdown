const fs = require('fs')

const chai = require('chai')
const expect = require('chai').expect
const defaultConfig = require('../config')

chai.use(require('./helper'))

const loadFixture = (filepath) => String(fs.readFileSync(filepath.replace('.txt', '.html')))

const zmarkdown = require('../')
const renderString = (config = defaultConfig) => zmarkdown(config).renderString
const renderFile = (config = defaultConfig) => zmarkdown(config).renderFile

const configOverride = (config) => {
  const newConfig = JSON.parse(JSON.stringify(defaultConfig))
  Object.assign(newConfig, config)
  return newConfig
}

describe.skip('HTML rendering', function () {
  describe('#heading-shift', function () {

    it(`shifts in range`, function () {
      const config = configOverride({ headingShifter: 1 })
      expect(renderString(config)('### should be h4')).to.have.html('<h4> should be h4</h4>')
    })

    it(`shifts past range`, function () {
      const config = configOverride({ headingShifter: 10 })
      expect(renderString(config)('### should be h6')).to.have.html('<h6> should be h6</h6>')
    })

    it(`shifts before range`, function () {
      const config = configOverride({ headingShifter: -10 })
      expect(renderString(config)('### should be h1')).to.have.html('<h1> should be h1</h1>')
    })
  })

  describe('#basic', function () {
    const dir = `${__dirname}/fixtures/basic/`

    it(`properly renders amps-and-angle-encoding.txt`, function () {
      const filepath = `${dir}/amps-and-angle-encoding.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders angle-links-and-img.txt`, function () {
      const filepath = `${dir}/angle-links-and-img.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders auto-links.txt`, function () {
      const filepath = `${dir}/auto-links.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders backlash-escapes.txt`, function () {
      const filepath = `${dir}/backlash-escapes.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders blockquotes-with-code-blocks.txt`, function () {
      const filepath = `${dir}/blockquotes-with-code-blocks.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders codeblock-in-list.txt`, function () {
      const filepath = `${dir}/codeblock-in-list.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders hard-wrapped.txt`, function () {
      const filepath = `${dir}/hard-wrapped.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders horizontal-rules.txt`, function () {
      const filepath = `${dir}/horizontal-rules.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders inline-html-advanced.txt`, function () {
      const filepath = `${dir}/inline-html-advanced.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders inline-html-comments.txt`, function () {
      const filepath = `${dir}/inline-html-comments.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders inline-html-simple.txt`, function () {
      const filepath = `${dir}/inline-html-simple.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders links-inline.txt`, function () {
      const filepath = `${dir}/links-inline.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders links-reference.txt`, function () {
      const filepath = `${dir}/links-reference.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders literal-quotes.txt`, function () {
      const filepath = `${dir}/literal-quotes.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders markdown-documentation-basics.txt`, function () {
      const filepath = `${dir}/markdown-documentation-basics.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders markdown-syntax.txt`, function () {
      const filepath = `${dir}/markdown-syntax.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders nested-blockquotes.txt`, function () {
      const filepath = `${dir}/nested-blockquotes.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders ordered-and-unordered-list.txt`, function () {
      const filepath = `${dir}/ordered-and-unordered-list.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders strong-and-em-together.txt`, function () {
      const filepath = `${dir}/strong-and-em-together.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders tabs.txt`, function () {
      const filepath = `${dir}/tabs.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders tidyness.txt`, function () {
      const filepath = `${dir}/tidyness.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })
  })

  describe('#extensions', function () {
    const dir = `${__dirname}/fixtures/extensions/`

    it(`properly renders fenced_code.txt`, function () {
      const filepath = `${dir}/fenced_code.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders github_flavored.txt`, function () {
      const filepath = `${dir}/github_flavored.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    describe('#extra', function () {
      const dir = `${__dirname}/fixtures/extensions/extra/`

      it(`properly renders abbr.txt`, function () {
        const filepath = `${dir}/abbr.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders extra_config.txt`, function () {
        const filepath = `${dir}/extra_config.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders footnote_many_footnotes.txt`, function () {
        const filepath = `${dir}/footnote_many_footnotes.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders footnote_placeholder.txt`, function () {
        const filepath = `${dir}/footnote_placeholder.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders footnote.txt`, function () {
        const filepath = `${dir}/footnote.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders markdown-syntax.txt`, function () {
        const filepath = `${dir}/markdown-syntax.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders named_markers.txt`, function () {
        const filepath = `${dir}/named_markers.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders tables.txt`, function () {
        const filepath = `${dir}/tables.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe('#misc', function () {
    const dir = `${__dirname}/fixtures/misc/`

    it(`properly renders adjacent-headers.txt`, function () {
      const filepath = `${dir}/adjacent-headers.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders amp-in-url.txt`, function () {
      const filepath = `${dir}/amp-in-url.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders ampersand.txt`, function () {
      const filepath = `${dir}/ampersand.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders arabic.txt`, function () {
      const filepath = `${dir}/arabic.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders autolinks_with_asterisks.txt`, function () {
      const filepath = `${dir}/autolinks_with_asterisks.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders backtick-escape.txt`, function () {
      const filepath = `${dir}/backtick-escape.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders blank_lines_in_codeblocks.txt`, function () {
      const filepath = `${dir}/blank_lines_in_codeblocks.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders blank-block-quote.txt`, function () {
      const filepath = `${dir}/blank-block-quote.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders block_html_attr.txt`, function () {
      const filepath = `${dir}/block_html_attr.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders block_html_simple.txt`, function () {
      const filepath = `${dir}/block_html_simple.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders block_html5.txt`, function () {
      const filepath = `${dir}/block_html5.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders blockquote-below-paragraph.txt`, function () {
      const filepath = `${dir}/blockquote-below-paragraph.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders blockquote-hr.txt`, function () {
      const filepath = `${dir}/blockquote-hr.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders blockquote.txt`, function () {
      const filepath = `${dir}/blockquote.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders bold_links.txt`, function () {
      const filepath = `${dir}/bold_links.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders br.txt`, function () {
      const filepath = `${dir}/br.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders bracket_re.txt`, function () {
      const filepath = `${dir}/bracket_re.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders brackets-in-img-title.txt`, function () {
      const filepath = `${dir}/brackets-in-img-title.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders code-first-line.txt`, function () {
      const filepath = `${dir}/code-first-line.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders comments.txt`, function () {
      const filepath = `${dir}/comments.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders CRLF_line_ends.txt`, function () {
      const filepath = `${dir}/CRLF_line_ends.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders div.txt`, function () {
      const filepath = `${dir}/div.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders em_strong_complex.txt`, function () {
      const filepath = `${dir}/em_strong_complex.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders em_strong.txt`, function () {
      const filepath = `${dir}/em_strong.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders em-around-links.txt`, function () {
      const filepath = `${dir}/em-around-links.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders email.txt`, function () {
      const filepath = `${dir}/email.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders escaped_chars_in_js.txt`, function () {
      const filepath = `${dir}/escaped_chars_in_js.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders funky-list.txt`, function () {
      const filepath = `${dir}/funky-list.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders h1.txt`, function () {
      const filepath = `${dir}/h1.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders hash.txt`, function () {
      const filepath = `${dir}/hash.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders header-in-lists.txt`, function () {
      const filepath = `${dir}/header-in-lists.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders headers.txt`, function () {
      const filepath = `${dir}/headers.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders hline.txt`, function () {
      const filepath = `${dir}/hline.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders html-comments.txt`, function () {
      const filepath = `${dir}/html-comments.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders html.txt`, function () {
      const filepath = `${dir}/html.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders image_in_links.txt`, function () {
      const filepath = `${dir}/image_in_links.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders image-2.txt`, function () {
      const filepath = `${dir}/image-2.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders image.txt`, function () {
      const filepath = `${dir}/image.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders ins-at-start-of-paragraph.txt`, function () {
      const filepath = `${dir}/ins-at-start-of-paragraph.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders inside_html.txt`, function () {
      const filepath = `${dir}/inside_html.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders japanese.txt`, function () {
      const filepath = `${dir}/japanese.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lazy-block-quote.txt`, function () {
      const filepath = `${dir}/lazy-block-quote.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders link-with-parenthesis.txt`, function () {
      const filepath = `${dir}/link-with-parenthesis.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lists.txt`, function () {
      const filepath = `${dir}/lists.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lists2.txt`, function () {
      const filepath = `${dir}/lists2.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lists3.txt`, function () {
      const filepath = `${dir}/lists3.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lists4.txt`, function () {
      const filepath = `${dir}/lists4.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lists5.txt`, function () {
      const filepath = `${dir}/lists5.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders lists6.txt`, function () {
      const filepath = `${dir}/lists6.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lists7.txt`, function () {
      const filepath = `${dir}/lists7.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders lists8.txt`, function () {
      const filepath = `${dir}/lists8.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders markup-inside-p.txt`, function () {
      const filepath = `${dir}/markup-inside-p.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders mismatched-tags.txt`, function () {
      const filepath = `${dir}/mismatched-tags.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders missing-link-def.txt`, function () {
      const filepath = `${dir}/missing-link-def.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders more_comments.txt`, function () {
      const filepath = `${dir}/more_comments.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders multi-line-tags.txt`, function () {
      const filepath = `${dir}/multi-line-tags.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders multi-paragraph-block-quote.txt`, function () {
      const filepath = `${dir}/multi-paragraph-block-quote.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders multi-test.txt`, function () {
      const filepath = `${dir}/multi-test.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders multiline-comments.txt`, function () {
      const filepath = `${dir}/multiline-comments.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders nested-lists.txt`, function () {
      const filepath = `${dir}/nested-lists.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders nested-patterns.txt`, function () {
      const filepath = `${dir}/nested-patterns.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders normalize.txt`, function () {
      const filepath = `${dir}/normalize.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders numeric-entity.txt`, function () {
      const filepath = `${dir}/numeric-entity.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders para-with-hr.txt`, function () {
      const filepath = `${dir}/para-with-hr.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders php.txt`, function () {
      const filepath = `${dir}/php.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders pre.txt`, function () {
      const filepath = `${dir}/pre.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders raw_whitespace.txt`, function () {
      const filepath = `${dir}/raw_whitespace.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders russian.txt`, function () {
      const filepath = `${dir}/russian.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders smart_em.txt`, function () {
      const filepath = `${dir}/smart_em.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders some-test.txt`, function () {
      const filepath = `${dir}/some-test.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders span.txt`, function () {
      const filepath = `${dir}/span.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders strong-with-underscores.txt`, function () {
      const filepath = `${dir}/strong-with-underscores.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders stronintags.txt`, function () {
      const filepath = `${dir}/stronintags.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders tabs-in-lists.txt`, function () {
      const filepath = `${dir}/tabs-in-lists.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders two-spaces.txt`, function () {
      const filepath = `${dir}/two-spaces.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders uche.txt`, function () {
      const filepath = `${dir}/uche.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders underscores.txt`, function () {
      const filepath = `${dir}/underscores.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders url_spaces.txt`, function () {
      const filepath = `${dir}/url_spaces.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

  })

  describe('#options', function () {
    const dir = `${__dirname}/fixtures/options/`

    it(`properly renders no-attributes.txt`, function () {
      const filepath = `${dir}/no-attributes.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })
  })

  describe('#php', function () {
    const dir = `${__dirname}/fixtures/php/`

    it(`properly renders Code Spans.txt`, function () {
      const filepath = `${dir}/Code Spans.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders Code block on second line.txt`, function () {
      const filepath = `${dir}/Code block on second line.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders Email auto links.txt`, function () {
      const filepath = `${dir}/Email auto links.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders Horizontal Rules.txt`, function () {
      const filepath = `${dir}/Horizontal Rules.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders Inline HTML (Simple).txt`, function () {
      const filepath = `${dir}/Inline HTML (Simple).txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders Inline HTML comments.txt`, function () {
      const filepath = `${dir}/Inline HTML comments.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders Links, inline style.txt`, function () {
      const filepath = `${dir}/Links, inline style.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it(`properly renders MD5 Hashes.txt`, function () {
      const filepath = `${dir}/MD5 Hashes.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders Nesting.txt`, function () {
      const filepath = `${dir}/Nesting.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders Parens in URL.txt`, function () {
      const filepath = `${dir}/Parens in URL.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders Tight blocks.txt`, function () {
      const filepath = `${dir}/Tight blocks.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })
  })

  describe('#pl', function () {
    describe.skip('#Tests_2004', function () {
      const dir = `${__dirname}/fixtures/pl/Tests_2004/`

      it(`properly renders Amps and angle encoding.txt`, function () {
        const filepath = `${dir}/Amps and angle encoding.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Auto links.txt`, function () {
        const filepath = `${dir}/Auto links.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Backslash escapes.txt`, function () {
        const filepath = `${dir}/Backslash escapes.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Blockquotes with code blocks.txt`, function () {
        const filepath = `${dir}/Blockquotes with code blocks.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Hard-wrapped paragraphs with list-like lines.txt`, function () {
        const filepath = `${dir}/Hard-wrapped paragraphs with list-like lines.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Horizontal rules.txt`, function () {
        const filepath = `${dir}/Horizontal rules.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Inline HTML (Advanced).txt`, function () {
        const filepath = `${dir}/Inline HTML (Advanced).txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Inline HTML (Simple).txt`, function () {
        const filepath = `${dir}/Inline HTML (Simple).txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Inline HTML comments.txt`, function () {
        const filepath = `${dir}/Inline HTML comments.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Links, inline style.txt`, function () {
        const filepath = `${dir}/Links, inline style.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Links, reference style.txt`, function () {
        const filepath = `${dir}/Links, reference style.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Literal quotes in titles.txt`, function () {
        const filepath = `${dir}/Literal quotes in titles.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Markdown Documentation - Basics.txt`, function () {
        const filepath = `${dir}/Markdown Documentation - Basics.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Markdown Documentation - Syntax.txt`, function () {
        const filepath = `${dir}/Markdown Documentation - Syntax.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Nested blockquotes.txt`, function () {
        const filepath = `${dir}/Nested blockquotes.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Ordered and unordered lists.txt`, function () {
        const filepath = `${dir}/Ordered and unordered lists.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Strong and em together.txt`, function () {
        const filepath = `${dir}/Strong and em together.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Tabs.txt`, function () {
        const filepath = `${dir}/Tabs.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Tidyness.txt`, function () {
        const filepath = `${dir}/Tidyness.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Yuri-Attributes.txt`, function () {
        const filepath = `${dir}/Yuri-Attributes.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Yuri-Email.txt`, function () {
        const filepath = `${dir}/Yuri-Email.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Yuri-Links-in-Headers.txt`, function () {
        const filepath = `${dir}/Yuri-Links-in-Headers.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })
    })

    describe('#Tests_2007', function () {
      const dir = `${__dirname}/fixtures/pl/Tests_2007/`

      it(`properly renders Amps and angle encoding.txt`, function () {
        const filepath = `${dir}/Amps and angle encoding.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Auto links.txt`, function () {
        const filepath = `${dir}/Auto links.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Blockquotes with code blocks.txt`, function () {
        const filepath = `${dir}/Blockquotes with code blocks.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Hard-wrapped paragraphs with list-like lines.txt`, function () {
        const filepath = `${dir}/Hard-wrapped paragraphs with list-like lines.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Horizontal rules.txt`, function () {
        const filepath = `${dir}/Horizontal rules.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Inline HTML (Advanced).txt`, function () {
        const filepath = `${dir}/Inline HTML (Advanced).txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Inline HTML (Simple).txt`, function () {
        const filepath = `${dir}/Inline HTML (Simple).txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Inline HTML comments.txt`, function () {
        const filepath = `${dir}/Inline HTML comments.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Links, inline style.txt`, function () {
        const filepath = `${dir}/Links, inline style.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Links, shortcut references.txt`, function () {
        const filepath = `${dir}/Links, shortcut references.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Literal quotes in titles.txt`, function () {
        const filepath = `${dir}/Literal quotes in titles.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Markdown Documentation - Basics.txt`, function () {
        const filepath = `${dir}/Markdown Documentation - Basics.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Markdown Documentation - Syntax.txt`, function () {
        const filepath = `${dir}/Markdown Documentation - Syntax.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Nested blockquotes.txt`, function () {
        const filepath = `${dir}/Nested blockquotes.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Ordered and unordered lists.txt`, function () {
        const filepath = `${dir}/Ordered and unordered lists.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Strong and em together.txt`, function () {
        const filepath = `${dir}/Strong and em together.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders Tabs.txt`, function () {
        const filepath = `${dir}/Tabs.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders Tidyness.txt`, function () {
        const filepath = `${dir}/Tidyness.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })
  describe('#zds', function () {
    const dir = `${__dirname}/fixtures/zds/`

    it.skip(`properly renders rediger_sur_zds_part1.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part1.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part2.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part2.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part3.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part3.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part4.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part4.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part5.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part5.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part6.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part6.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part7.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part7.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part8.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part8.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part9.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part9.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    it.skip(`properly renders rediger_sur_zds_part10.txt`, function () {
      const filepath = `${dir}/rediger_sur_zds_part10.txt`
      expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
    })

    describe('#extensions', function () {
      const dir = `${__dirname}/fixtures/zds/extensions/`

      it(`properly renders align.txt`, function () {
        const filepath = `${dir}/align.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders comments_config.txt`, function () {
        const filepath = `${dir}/comments_config.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders comments.txt`, function () {
        const filepath = `${dir}/comments.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders customblock.txt`, function () {
        const filepath = `${dir}/customblock.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders delext.txt`, function () {
        const filepath = `${dir}/delext.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders emoticons.txt`, function () {
        const filepath = `${dir}/emoticons.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it.skip(`properly renders grid_tables.txt`, function () {
        const filepath = `${dir}/grid_tables.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders kbd.txt`, function () {
        const filepath = `${dir}/kbd.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders math.txt without custom config`, function () {
        const filepath = `${dir}/math.txt`
        const config = configOverride({ katex: {}, math: {} })
        const rendered = renderFile(config)(filepath)
        expect((rendered.match(/katex-mathml/g) || []).length).to.equal(4)
        expect((rendered.match(/span class="katex-display"/g) || []).length).to.equal(1)
        expect((rendered.match(/inlineMath inlineMathDouble/g) || []).length).to.equal(0)
        expect((rendered.match(/div class="math"/g) || []).length).to.equal(1)
      })

      it(`properly renders math.txt`, function () {
        const filepath = `${dir}/math.txt`
        const rendered = renderFile()(filepath)
        expect((rendered.match(/katex-mathml/g) || []).length).to.equal(4)
        expect((rendered.match(/span class="katex-display"/g) || []).length).to.equal(3)
        expect((rendered.match(/inlineMath inlineMathDouble/g) || []).length).to.equal(2)
        expect((rendered.match(/div class="math"/g) || []).length).to.equal(1)
      })

      it.skip(`properly renders smart_legend.txt`, function () {
        const filepath = `${dir}/smart_legend.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders subsuperscript.txt`, function () {
        const filepath = `${dir}/subsuperscript.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders urlize.txt`, function () {
        const filepath = `${dir}/urlize.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders video_extra.txt`, function () {
        const filepath = `${dir}/video_extra.txt`
        const config = configOverride({ iframes: {
          'www.youtube.com': {
            tag: 'iframe',
            width: 560,
            height: 315,
            enabled: true,
            replace: {
              'watch?v=': 'embed/',
              'http://': 'https://'
            },
            removeAfter: '&'
          },
          'jsfiddle.net': {
            tag: 'iframe',
            width: 560,
            height: 560,
            enabled: false,
            replace: {
              'http://': 'https://'
            },
            append: 'embedded/result,js,html,css/'
          }
        }})
        expect(renderFile(config)(filepath)).to.have.html(loadFixture(filepath))
      })

      it(`properly renders video.txt`, function () {
        const filepath = `${dir}/video.txt`
        expect(renderFile()(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })
})
