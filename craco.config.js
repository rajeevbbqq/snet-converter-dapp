const webpack = require('webpack');
const { addBeforeLoader, loaderByName } = require('@craco/craco');

module.exports = {
  reactScriptsVersion: 'react-scripts',
  webpack: {
    alias: {},
    plugins: {
      add: []
    },
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        os: require.resolve('os-browserify/browser'),
        path: false,
        fs: false
      };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser'
        })
      );

      webpackConfig.experiments = {
        asyncWebAssembly: true,
        topLevelAwait: true,
        layers: true
      };

      const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push('.wasm');

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      const wasmLoader = {
        loader: require.resolve('wasm-loader'),
        options: {
          test: /\.wasm$/,
          importMemory: true
          // exclude: /node_modules/
        }
      };

      addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);

      return webpackConfig;
    }
  }
};
