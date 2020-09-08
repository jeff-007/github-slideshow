'use strict'
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: process.env.NODE_ENV === 'development' ? './' : './',
  lintOnSave: false,
  outputDir: '../axios_demo/pack_demo',
  assetsDir: 'static',
  indexPath: 'index.html',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  css: {
    extract: true,
    sourceMap: false,
    requireModuleExtension: false,
    loaderOptions: {
      scss: {
        prependData: `@import "~@/styles/variables.scss";`
      }
    }
  },
}
