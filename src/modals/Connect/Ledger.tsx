// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Foot } from './Foot';
import { ConnectItem, HardwareInner } from './Wrappers';

export const Ledger = (): React.ReactElement => {
  return (
    <ConnectItem>
      <HardwareInner>
        <div className="body">[ Ledger Icon ]</div>
        <Foot url="https://ledger.com" />
      </HardwareInner>
    </ConnectItem>
  );
};
