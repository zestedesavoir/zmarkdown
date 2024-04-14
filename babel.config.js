module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: '> 1%, not dead',
          node: '16.0'
        }
      }
    ]
  ],
  ignore: ['node_modules']
}
