// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react';
import { useOverlay } from 'kits/Overlay/Provider';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { ButtonText } from 'kits/Buttons/ButtonText';
import { ModalHardwareItem } from 'kits/Overlay/structure/ModalHardwareItem';
import { ModalConnectItem } from 'kits/Overlay/structure/ModalConnectItem';

export const WalletConnect = (): ReactElement => {
  const { t } = useTranslation('modals');
  const { replaceModal } = useOverlay().modal;
  const url = 'reown.com';

  return (
    <ModalConnectItem>
      <ModalHardwareItem>
        <div className="body">
          <div className="row">
            <WalletConnectSVG className="logo" />
          </div>
          <div className="row margin">
            <ButtonText
              text="Wallet Connect"
              disabled
              style={{ opacity: 0.75 }}
            />
          </div>
          <div className="row margin">
            <ButtonPrimaryInvert
              text={t('connect')}
              onClick={() => {
                replaceModal({ key: 'ImportWalletConnect' });
              }}
              iconLeft={faLink}
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
