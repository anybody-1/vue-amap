const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  publicPath: './',
  devServer: {
    https: true
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer([
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: true, // console
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      ])
    }
  }
}