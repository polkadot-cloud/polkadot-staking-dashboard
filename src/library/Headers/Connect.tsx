// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPlug, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonText } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTranslation } from 'react-i18next';
import { ConnectedAccount, HeadingWrapper, Item } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('library');
  const { openModalWith } = useModal();
  const { accounts } = useConnect();
  return (
    <HeadingWrapper>
      {accounts.length ? (
        <ConnectedAccount>
          <ButtonText
            text={t('accounts')}
            iconLeft={faWallet}
            onClick={() => {
              openModalWith('Accounts', {}, 'large');
            }}
            style={{ color: 'var(--text-color-invert' }}
          />
          <span />
          <ButtonText
            text=""
            iconRight={faPlug}
            iconTransform="grow-1"
            onClick={() => {
              openModalWith('Connect', {}, 'large');
            }}
            style={{ color: 'var(--text-color-invert' }}
          />
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
