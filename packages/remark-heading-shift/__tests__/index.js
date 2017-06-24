import dedent from 'dedent'
import remark from 'remark'

import plugin from '../src/'

Array.from([null, 0, 1, -1, 3]).forEach(shift => {
  test(`shift ${shift}`, () => {
    const {contents} = remark()
      .use(plugin, shift)
      .processSync(dedent`
        # remark-heading-shift

        ## Example

        ## API

        ### foo

        ## Contributing
      `)
    expect(contents).toMatchSnapshot()
  })
})
