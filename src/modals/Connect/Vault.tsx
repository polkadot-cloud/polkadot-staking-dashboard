// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ButtonHelp,
  ButtonPrimaryInvert,
  ButtonText,
  ModalConnectItem,
  ModalHardwareItem,
} from '@polkadot-cloud/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { ReactComponent as VaultSVG } from 'img/polkadotVault.svg';

export const Vault = (): React.ReactElement => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const { replaceModalWith } = useModal();
  const url = 'signer.parity.io';

  return (
    <ModalConnectItem>
      <ModalHardwareItem>
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
                replaceModalWith('ImportVault', {}, 'large');
              }}
              iconLeft={faQrcode}
              iconTransform="shrink-1"
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
