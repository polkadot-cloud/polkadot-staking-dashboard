// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { ButtonHelp, ButtonInvertRounded } from '@polkadotcloud/dashboard-ui';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { ReactComponent as LedgerLogoSVG } from 'img/ledgerLogo.svg';
import React from 'react';
import { Foot } from './Foot';
import { ConnectItem, HardwareInner } from './Wrappers';

export const Ledger = (): React.ReactElement => {
  const { openHelp } = useHelp();
  const { replaceModalWith } = useModal();

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
            <p>BETA</p>
          </div>
          <div className="row margin">
            <ButtonInvertRounded
              text="USB"
              onClick={() => {
                replaceModalWith('LedgerImport', {}, 'large');
              }}
              iconLeft={faUsb}
              iconTransform="shrink-1"
            />
          </div>
        </div>
        <Foot url="ledger.com" />
      </HardwareInner>
    </ConnectItem>
  );
};
