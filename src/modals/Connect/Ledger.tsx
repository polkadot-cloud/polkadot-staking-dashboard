// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPlug } from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useHelp } from 'contexts/Help';
import { ReactComponent as LedgerLogoSVG } from 'img/ledgerLogo.svg';
import React from 'react';
import { Foot } from './Foot';
import { ConnectItem, HardwareInner } from './Wrappers';

export const Ledger = (): React.ReactElement => {
  const { openHelp } = useHelp();

  return (
    <ConnectItem>
      <HardwareInner>
        <div className="body">
          <div className="status">
            <ButtonHelp onClick={() => openHelp('Ledger Hardware Wallets')} />
          </div>
          <div className="row">
            <LedgerLogoSVG className="logo ledger" />
          </div>
          <div className="row">
            <ButtonSecondary text="USB" iconLeft={faPlug} lg />
          </div>
        </div>
        <Foot url="ledger.com" />
      </HardwareInner>
    </ConnectItem>
  );
};
