// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonHelp,
  ButtonPrimaryInvert,
  ButtonText,
} from '@polkadotcloud/core-ui';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { ReactComponent as VaultSVG } from 'img/polkadotVault.svg';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Foot } from './Foot';
import { ConnectItem, HardwareInner } from './Wrappers';

export const Vault = (): React.ReactElement => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const { replaceModalWith } = useModal();

  return (
    <ConnectItem>
      <HardwareInner>
        <div className="body">
          <div className="status">
            <ButtonHelp onClick={() => openHelp('Polkadot Vault')} />
          </div>
          <div className="row">
            <VaultSVG className="logo vault" />
          </div>
          <div className="row margin">
            <ButtonText
              text="Polkadot Vault"
              disabled
              marginRight
              style={{
                opacity: 1,
                color: 'var(--network-color-primary)',
                fontFamily: 'Unbounded',
              }}
            />
          </div>
          <div className="row margin">
            <ButtonPrimaryInvert
              text={t('import')}
              onClick={() => {
                replaceModalWith('VaultImport', {}, 'large');
              }}
              iconLeft={faQrcode}
              iconTransform="shrink-1"
            />
          </div>
        </div>
        <Foot url="signer.parity.io" />
      </HardwareInner>
    </ConnectItem>
  );
};
