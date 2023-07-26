// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as IBTCSVG } from 'config/tokens/ibtc.svg';
import { ReactComponent as DOTSVG } from 'config/tokens/dot.svg';
import { ReactComponent as INTRSVG } from 'config/tokens/intr.svg';
import { ReactComponent as USDTSVG } from 'config/tokens/usdt.svg';

export const TokenSVGs = () => {
  return (
    <div className="svgs">
      <div className="token">
        <USDTSVG style={{ height: '100%' }} />
      </div>
      <div className="token">
        <INTRSVG style={{ height: '100%' }} />
      </div>
      <div className="token">
        <IBTCSVG style={{ height: '100%' }} />
      </div>
      <div className="token">
        <DOTSVG style={{ height: '100%' }} />
      </div>
    </div>
  );
};
