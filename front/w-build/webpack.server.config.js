const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const devConfigFn = require('./webpack.dev.config');
const { build } = require('../w-config');

const { buildRoot } = build;

module.exports = () =>
  devConfigFn({ server: true }).then((config) =>
    merge(config, {
      plugins: [new webpack.HotModuleReplacementPlugin()],
      devServer: {
        contentBase: resolve(buildRoot, '..'),
        hot: true,
        // host: '0.0.0.0',
        noInfo: true,
        stats: 'errors-only',
        open: true,
        proxy: [
          {
            context: ['/v1'], // 路径前缀
            target: 'http://182.92.148.131/', // 服务器ip
            // target: 'http://10.10.30.60:8283/', // 服务器ip
            changeOrigin: true,
            logLevel: 'debug',
          },
        ],
      },
    })
  );
