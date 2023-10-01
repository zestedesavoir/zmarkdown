const path = require('path')

const mode = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'

const defaultConf = {
  resolve: {
    fallback: {
      assert: require.resolve('assert'),
      path:   require.resolve('path-browserify'),
      url:    require.resolve('url'),
    },
  },
  mode,
  module: {
    rules: [
      {
        test:    /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use:     {
          loader: 'babel-loader',
        },
      },
    ],
  },
}

const makeExportObject = (type) => {
  const upperType = type.toUpperCase()

  return Object.assign({}, defaultConf, {
    name:   `ZMarkdown${upperType}`,
    entry:  [`./client/${type}`],
    output: {
      path:     path.resolve(__dirname, 'client/dist'),
      filename: `zmarkdown-${type}.js`,
      library:  `ZMarkdown${upperType}`,
    },
  })
}

module.exports = ['zmdast', 'zhtml', 'zhlite', 'zlatex'].map(makeExportObject)
