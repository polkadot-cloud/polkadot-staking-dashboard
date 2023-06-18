// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTranslation } from 'react-i18next';
import { ReactComponent as WalletIcon } from '../../img/ic_wallet.svg';
import { HeadingWrapper, Item } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('library');
  const { openModalWith } = useModal();
  const { activeAccount, accounts } = useConnect();
  return (
    <HeadingWrapper>
      <Item
        className="connect"
        onClick={() => {
          openModalWith(accounts.length ? 'Accounts' : 'Connect', {}, 'large');
        }}
      >
        <WalletIcon className="icon" width="13.5" height="11.7" />
        <span>{activeAccount ? t('accounts') : t('connect')}</span>
      </Item>
    </HeadingWrapper>
  );
};
