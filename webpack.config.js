// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        loader: "worker-loader",
        options: {
          inline: true
        }
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          inline: true
        }
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};