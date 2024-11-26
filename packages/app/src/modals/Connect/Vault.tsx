// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react';
import { useHelp } from 'contexts/Help';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalConnectItem } from 'kits/Overlay/structure/ModalConnectItem';
import { ModalHardwareItem } from 'kits/Overlay/structure/ModalHardwareItem';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonHelp, ButtonPrimaryInvert, ButtonText } from 'ui-buttons';

export const Vault = (): ReactElement => {
  const { t } = useTranslation('modals');
  const { openHelp } = useHelp();
  const { replaceModal } = useOverlay().modal;
  const url = 'signer.parity.io';

  return (
    <ModalConnectItem>
      <ModalHardwareItem>
        <div className="body">
          <div className="status">
            <ButtonHelp onClick={() => openHelp('Polkadot Vault')} />
          </div>
          <div className="row">
            <PolkadotVaultSVG className="logo vault" />
          </div>
          <div className="row margin">
            <ButtonText
              text="Polkadot Vault"
              disabled
              marginRight
              style={{
                opacity: 1,
                color: 'var(--accent-color-primary)',
                fontFamily: 'Poppins700',
              }}
            />
          </div>
          <div className="row margin">
            <ButtonPrimaryInvert
              text={t('import')}
              onClick={() => {
                replaceModal({ key: 'ImportVault' });
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
