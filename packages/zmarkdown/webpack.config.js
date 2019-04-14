const path = require('path')

const mode = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'

const defaultConf = {
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}

module.exports = [
  Object.assign({}, defaultConf, {
    name: 'ZMarkdown',
    entry: ['@babel/polyfill', './client/index'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'zmarkdown.js',
      library: 'ZMarkdown',
    },
  }),
  Object.assign({}, defaultConf, {
    name: 'ZMarkdownZHTML',
    entry: ['./modules/zhtml'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'zmarkdown-zhtml.js',
      library: 'ZMarkdownZHTML',
    },
  }),
  Object.assign({}, defaultConf, {
    name: 'ZMarkdownZLatex',
    entry: ['./modules/zlatex'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'zmarkdown-zlatex.js',
      library: 'ZMarkdownZLatex',
    },
  }),
]
