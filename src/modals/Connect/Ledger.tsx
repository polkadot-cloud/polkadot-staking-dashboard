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
import { useHelp } from 'contexts/Help';
import LedgerLogoSVG from '@polkadot-cloud/assets/extensions/svg/ledger.svg?react';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';

export const Ledger = () => {
  const { openHelp } = useHelp();
  const { replaceModal } = useOverlay().modal;
  const { network } = useNetwork();
  const url = 'ledger.com';

  // Only render on Polkadot and Kusama networks.
  if (!['polkadot', 'kusama'].includes(network)) {
    return null;
  }

  return (
    <ModalConnectItem>
      <ModalHardwareItem>
        <div className="body">
          <div className="status">
            <ButtonHelp onClick={() => openHelp('Ledger Hardware Wallets')} />
          </div>
          <div className="row">
            <LedgerLogoSVG className="logo" />
          </div>
          <div className="row margin">
            <ButtonText
              text={network === 'polkadot' ? 'BETA' : 'EXPERIMENTAL'}
              disabled
              marginRight
              iconLeft={
                network === 'polkadot' ? undefined : faExclamationTriangle
              }
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
