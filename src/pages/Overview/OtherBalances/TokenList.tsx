// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Token } from './Token';

export const TokenList = () => {
  return (
    <div className="svgs">
      <div className="token">
        <Token token="DOT" />
      </div>
      <div className="token">
        <Token token="IBTC" />
      </div>
      <div className="token">
        <Token token="INTR" />
      </div>
      <div className="token">
        <Token token="USDT" />
      </div>
    </div>
  );
};
