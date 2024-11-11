// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlug, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useOverlay } from 'kits/Overlay/Provider';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { ConnectedAccount, HeadingWrapper } from './Wrappers';
import { ButtonText } from 'ui-buttons';

export const Connect = () => {
  const { t } = useTranslation('library');
  const { openModal } = useOverlay().modal;
  const { accounts } = useImportedAccounts();

  return (
    <HeadingWrapper>
      <ConnectedAccount>
        {accounts.length ? (
          <>
            <ButtonText
              text={t('accounts')}
              iconLeft={faWallet}
              onClick={() => {
                openModal({ key: 'Accounts' });
              }}
              style={{ color: 'white', fontSize: '1.05rem' }}
            />
            <span />
            <ButtonText
              text=""
              iconRight={faPlug}
              iconTransform="grow-1"
              onClick={() => {
                openModal({ key: 'Connect' });
              }}
              style={{ color: 'white', fontSize: '1.05rem' }}
            />
          </>
        ) : (
          <ButtonText
            text={t('connect')}
            iconRight={faPlug}
            iconTransform="grow-1"
            onClick={() => {
              openModal({ key: accounts.length ? 'Accounts' : 'Connect' });
            }}
            style={{ color: 'white', fontSize: '1.05rem' }}
          />
        )}
      </ConnectedAccount>
    </HeadingWrapper>
  );
};
