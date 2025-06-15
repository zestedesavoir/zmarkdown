export default function disablePlugin (options = []) {
  const data = this.data()

  function add (field, value) {
    if (data[field]) data[field].push(value)
    else data[field] = [value]
  }

  add('micromarkExtensions', { disable: { null: options } })
}
