// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Token } from './Token';

export const TokenList = ({ tokens }: any) => {
  return (
    <div className="symbols">
      {tokens.map((symbol: string) => (
        <div key={`token_list_${symbol}`} className="token">
          <Token symbol={symbol} />
        </div>
      ))}
    </div>
  );
};
