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
  {
    ...defaultConf,
    name: 'ZMarkdown',
    entry: ['babel-polyfill', './client/index'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'zmarkdown.js',
      library: 'ZMarkdown',
    },
  },
  {
    ...defaultConf,
    name: 'ZMarkdownZHTML',
    entry: ['./plugins/client/zhtml'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'zmarkdown-zhtml.js',
      library: 'ZMarkdownZHTML',
    },
  }]