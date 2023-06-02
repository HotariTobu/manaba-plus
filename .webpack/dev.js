'use strict'

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  // Expand source code into the compiled file.
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [
    // Copy static debug assets from `public/dev` folder to `dst` folder.
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: 'public/dev',
        },
      ],
    }),
  ],
}
