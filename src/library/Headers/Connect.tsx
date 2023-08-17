// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlug, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { ConnectedAccount, HeadingWrapper } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('library');
  const { openModalWith } = useModal();
  const { accounts } = useConnect();
  return (
    <HeadingWrapper>
      <ConnectedAccount>
        {accounts.length ? (
          <>
            <ButtonText
              text={t('accounts')}
              iconLeft={faWallet}
              onClick={() => {
                openModalWith('Accounts', {}, 'large');
              }}
              style={{ color: 'white', fontSize: '1.05rem' }}
            />
            <span />
            <ButtonText
              text=""
              iconRight={faPlug}
              iconTransform="grow-1"
              onClick={() => {
                openModalWith('Connect', {}, 'large');
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
              openModalWith(
                accounts.length ? 'Accounts' : 'Connect',
                {},
                'large'
              );
            }}
            style={{ color: 'white', fontSize: '1.05rem' }}
          />
        )}
      </ConnectedAccount>
    </HeadingWrapper>
  );
};
