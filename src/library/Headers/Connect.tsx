// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTranslation } from 'react-i18next';
import { ConnectedAccount, HeadingWrapper, Item } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('library');
  const { openModalWith } = useModal();
  const { activeAccount, accounts } = useConnect();
  return (
    <HeadingWrapper>
      {activeAccount ? (
        <ConnectedAccount>
          <button
            type="button"
            className="connect"
            onClick={() => {
              openModalWith('Accounts', {}, 'large');
            }}
          >
            <FontAwesomeIcon
              icon={faWallet}
              className="icon"
              transform="shrink-2"
            />
            <span>{t('accounts')}</span>
          </button>
          <div className="account-label" />
          <button
            type="button"
            className="connect"
            onClick={() => {
              openModalWith('Connect', {}, 'large');
            }}
          >
            <FontAwesomeIcon
              icon={faWallet}
              className="icon"
              transform="shrink-2"
            />
            <span>Extensions</span>
          </button>
        </ConnectedAccount>
      ) : (
        <Item
          className="connect"
          onClick={() => {
            openModalWith(
              accounts.length ? 'Accounts' : 'Connect',
              {},
              'large'
            );
          }}
        >
          <FontAwesomeIcon
            icon={faWallet}
            className="icon"
            transform="shrink-2"
          />
          <span>{t('connect')}</span>
        </Item>
      )}
    </HeadingWrapper>
  );
};
