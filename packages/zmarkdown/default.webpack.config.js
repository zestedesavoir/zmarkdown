const path = require('path')

module.exports = {
  entry: ['babel-polyfill', './client/index'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zmarkdown.js',
    library: 'ZMarkdown',
  },
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
