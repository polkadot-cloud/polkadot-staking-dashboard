// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChrome, faUsb } from '@fortawesome/free-brands-svg-icons';
import {
  faExclamationTriangle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ButtonHelp,
  ButtonPrimaryInvert,
  ButtonText,
  ModalConnectItem,
  ModalHardwareItem,
} from '@polkadot-cloud/react';
import { inChrome } from '@polkadot-cloud/utils';
import React from 'react';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import LedgerLogoSVG from 'img/ledgerLogo.svg?react';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const Ledger = (): React.ReactElement => {
  const { openHelp } = useHelp();
  const { replaceModal } = useOverlay().modal;
  const { name } = useApi().network;
  const url = 'ledger.com';

  // Only render on Polkadot and Kusama networks.
  if (!['polkadot', 'kusama'].includes(name)) {
    return <></>;
  }

  return (
    <ModalConnectItem>
      <ModalHardwareItem>
        <div className="body">
          <div className="status">
            <ButtonHelp onClick={() => openHelp('Ledger Hardware Wallets')} />
          </div>
          <div className="row">
            <LedgerLogoSVG className="logo mono" />
          </div>
          <div className="row margin">
            <ButtonText
              text={name === 'polkadot' ? 'BETA' : 'EXPERIMENTAL'}
              disabled
              marginRight
              iconLeft={name === 'polkadot' ? undefined : faExclamationTriangle}
              style={{ opacity: 0.5 }}
            />
            <ButtonText
              text="Chrome / Brave"
              disabled
              iconLeft={faChrome}
              style={{ opacity: 0.5 }}
            />
          </div>
          <div className="row margin">
            <ButtonPrimaryInvert
              text="USB"
              onClick={() => replaceModal({ key: 'ImportLedger' })}
              iconLeft={faUsb}
              iconTransform="shrink-1"
              disabled={!inChrome()}
            />
          </div>
        </div>
        <div className="foot">
          <a
            className="link"
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
          >
            {url}
            <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
          </a>
        </div>
      </ModalHardwareItem>
    </ModalConnectItem>
  );
};
