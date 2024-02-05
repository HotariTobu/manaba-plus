'use strict'

const webpack = require('webpack')

const glob = require('glob')
const path = require('path')

const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { VuetifyPlugin } = require('webpack-plugin-vuetify')

const colors = require('../src/color.json')

require('../pre/index')()

const srcPath = path.resolve('src')
const dstPath = path.resolve('dst')

// Search entry files.
const entries = Object.fromEntries(
  glob
    .sync('**/index.{ts,js}', {
      cwd: srcPath,
    })
    .map(function (entryPath) {
      const parsedEntryPath = path.parse(entryPath)
      return [
        path.join(parsedEntryPath.dir, parsedEntryPath.name),
        path.join(srcPath, entryPath),
      ]
    }),
)
entries[path.join('style')] = path.join(srcPath, 'style.scss')
console.log('Entries:')
console.log(entries)
console.log()

// To re-use webpack configuration across templates,
// CLI maintains a common webpack configuration file - `webpack.common.js`.
// Whenever user creates an extension, CLI adds `webpack.common.js` file
// in template's `config` folder.
module.exports = function (env) {
  console.log('env:')
  console.log(env)
  console.log()

  return {
    entry: entries,
    output: {
      // to clean up dst folder
      clean: true,
      // the dst folder to output bundles and assets in
      path: dstPath,
      // the filename template for entry chunks
      filename: '[name].js',
    },
    stats: {
      all: false,
      errors: true,
      builtAt: true,
    },
    module: {
      rules: [
        // Help webpack in understanding Vue files imported in .js files.
        {
          test: /\.vue\.(s?[ac]ss)$/,
          use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /(?<!\.vue)\.(s?[ac]ss)$/,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader',
            {
              loader: 'string-replace-loader',
              options: {
                multiple: [
                  { search: '$primary-color', replace: colors.primary },
                  { search: '$secondary-color', replace: colors.primaryLight }
                ]
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader',
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        // Check for images referred in .css files.
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 50 * 1024,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        path: require.resolve('path-browserify'),
      },
      plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    plugins: [
      // Enable `process.env.*`.
      new Dotenv(),
      // Copy static common assets from `public/common` folder to `dst` folder.
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '**/*',
            context: 'public/common',
          },
          {
            from: 'base.json',
            context: 'src/manifest',
            transform: function (buffer) {
              const transformer = require('../pre/manifest')
              return transformer(buffer, env)
            },
            to: 'manifest.json',
          },
        ],
      }),
      // Extract CSS into separate files.
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      // Enable Vue.js
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      new VuetifyPlugin(),
    ],
  }
}
