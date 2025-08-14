'use strict'
const webpack = require('webpack')

module.exports = {
  devServer: {
    port: process.env.VUE_APP_FRONTEND_PORT || 8081, // 添加这行固定端口

    client: {
      logging: 'error', // 只显示错误日志
      overlay: {
        warnings: false,
        errors: true
      }
    },
    proxy: {
      '/api/node': {
        target: 'http://localhost:3001', // 后端 nodejs 运行地址
        changeOrigin: true,
        pathRewrite: {
          '^/api/node': '/api/node' // 去掉 /api/node
        },
      },
      '/api/python': {
        target: 'http://127.0.0.1:3002', // 后端 Django 运行地址
        changeOrigin: true,
        pathRewrite: {
          '^/api/python': '/api/python' // 去掉 /api/python
        },
        // logLevel: 'debug',  // 添加代理日志
        // onProxyReq: (proxyReq, req, res) => {
        //   console.log('\x1b[36m%s\x1b[0m', `[PROXY] ${req.method} ${req.originalUrl} -> ${proxyReq.path}`)  // 使用带颜色的日志
        // }
      }
    },
    // 添加以下配置禁用 ws 检查
    // 关键配置：禁用 WebSocket 错误显示
    client: {
      logging: 'none',         // 禁用所有客户端日志
      overlay: {
        errors: true,         // 显示编译错误
        warnings: false,      // 隐藏警告
        runtimeErrors: false  // 隐藏运行时错误
      },
      reconnect: false        // 禁用自动重连
    },
    // 可选：完全禁用 HMR
    hot: false,
    liveReload: false
  },
  chainWebpack: config => {
    config.plugin('define').use(webpack.DefinePlugin, [{
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
    }])
  },
  configureWebpack: {
    resolve: {
      fallback: {
        vm: require.resolve('vm-browserify'),
        assert: require.resolve('assert/'),
        util: require.resolve('util/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        querystring: require.resolve('querystring-es3'),

        url: require.resolve('url/'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        net: false,
        tls: false,
        fs: false
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    ]
  }
}; 