const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  configureWebpack: config => {
    config.plugins.push(
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './src/static'),
          to: path.resolve(__dirname, './dist/static')
        }
      ])
    );
    config.module.rules.push({
        test: /\.md$/,
        use: [
            {
                loader: "html-loader"
            },
            {
                loader: "markdown-loader",
                options: {
                    /* your options here */
                }
            }
        ]
    })

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true,
    compress: true,
    host: '0.0.0.0',
    port: '8080',
    proxy: {
      '/article': {
        target: 'http://bbs.yiwise.com'
      },
      '/csrf': {
        target: 'http://bbs.yiwise.com'
      },
      '/apiBlog': {
        target: 'http://bbs.yiwise.com'
      }
    }
  }
}