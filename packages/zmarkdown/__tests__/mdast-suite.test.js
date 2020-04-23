const dedent = require('dedent')
const renderString = require('../common')()

test('renders correctly', () => {
  const p = renderString(dedent`
    # foo
    **something else**
  `)

  return expect(p).toMatchSnapshot()
})
