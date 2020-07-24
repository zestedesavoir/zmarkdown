import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import rehypeStringify from 'rehype-stringify'
import remark2rehype from 'remark-rehype'

import htmlBlocks from '../src/'

const render = (use, text) => unified()
  .use(reParse, {
    gfm: true,
    commonmark: false,
    footnotes: true,
    /* sets list of known blocks to nothing, otherwise <h3>hey</h3> would become
    &#x3C;h3>hey&#x3C;/h3> instead of <p>&#x3C;h3>hey&#x3C;/h3></p> */
    blocks: [],
  })
  .use(remark2rehype, {allowDangerousHtml: true})
  .use(use ? htmlBlocks : () => {})
  .use(rehypeStringify)
  .processSync(text)

Array.from([[true, 'with'], [false, 'without']]).forEach(([use, str]) => {
  it(`should process simple div ${str} rehype-html-blocks`, () => {
    const {contents} = render(use, dedent`
    <div id="sidebar">

       _foo_

    </div>

    And now in uppercase:

    <DIV>
    foo
    </DIV>
  `)

    expect(contents).toMatchSnapshot()
  })

  it(`should process inline html ${str} rehype-html-blocks`, () => {
    const {contents} = render(use, dedent`
      Here's a simple block:

      <div>
        foo
      </div>

      This should be a code block, though:

        <div>
          foo
        </div>

      As should this:

        <div>foo</div>

      Now, nested:

      <div>
        <div>
          <div>
            foo
          </div>
        </div>
      </div>

      This should just be an HTML comment:

      <!-- Comment -->

      Multiline:

      <!--
      Blah
      Blah
      -->

      Code block:

        <!-- Comment -->

      Just plain comment, with trailing spaces on the line:

      <!-- foo -->

      Code:

        <hr />

      Hr's:

      <hr>

      <hr/>

      <hr />

      <hr>

      <hr/>

      <hr />

      <hr class="foo" id="bar" />

      <hr class="foo" id="bar"/>

      <hr class="foo" id="bar" >

      <some [weird](http://example.com) stuff>
    `)
    expect(contents).toMatchSnapshot()
  })

  it(`should process multi-line tags ${str} rehype-html-blocks`, () => {
    const {contents} = render(use, dedent`

      <div>

      asdf asdfasd

      </div>

      <div>

      foo bar

      </div>
      No blank line.
    `)
    expect(contents).toMatchSnapshot()
  })

  it(`should render the same ${str} rehype-html-blocks`, () => {
    const {contents} = render(use, dedent`
      **<DIV>
      foo
      </DIV>**
    `)
    expect(contents).toMatchSnapshot()
  })
})
