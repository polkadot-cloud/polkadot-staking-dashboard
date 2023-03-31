// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        loader: 'worker-loader',
        options: {
          inline: true,
        },
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          inline: true,
        },
      },
      {
        test: /\.m?js$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        resolve: {
          fullySpecified: false
        }
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      sourceMap: true,
      terserOptions: {
        compress: {
          drop_console: true,
        },
      }
    })],
  },
};
