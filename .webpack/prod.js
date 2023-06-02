'use strict'

const path = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const ZipWebpackPlugin = require('zip-webpack-plugin')

const buildPath = path.resolve('build')
const manifest = require('../src/manifest.json')

module.exports = (env) => ({
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
          /**
           * Remove debugging code like:
           *
           * ```
           * // #region DEBUG recording a log
           * console.log('Hello_World!')
           * // #endregion
           * ```
           */
          {
            loader: 'string-replace-loader',
            options: {
              search: /\/\/\s*?#region\s*DEBUG.*?\/\/\s*?#endregion.*?$/gms,
              replace: '',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Copy static production assets from `public/prod` folder to `dst` folder.
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: 'public/prod',
        },
      ],
    }),
    // Zip `dst` folder into zip file.
    new ZipWebpackPlugin({
      path: buildPath,
      filename: `${manifest.name}_${process.env.npm_package_version}_${
        env.browser ?? 'Chrome'
      }.zip`,
      exclude: 'docs',
    }),
  ],
})
