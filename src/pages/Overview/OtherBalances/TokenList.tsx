// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from 'types';
import { Token } from './Token';

export const TokenList = ({ tokens }: any) => {
  return (
    <div className="symbols">
      {tokens.map((t: AnyJson, i: number) => (
        <div key={`token_list_${i}`} className="token">
          <Token token={t.assetType.Token} />
        </div>
      ))}
    </div>
  );
};
