const path = require('path')

module.exports = {
  entry: ['./plugins/client/zhtml'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zmarkdown-zhtml.js',
    library: 'ZMarkdownZHTML',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
}
