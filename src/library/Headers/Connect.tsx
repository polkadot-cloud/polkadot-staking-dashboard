// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTranslation } from 'react-i18next';
import { HeadingWrapper, Item } from './Wrappers';
import { ReactComponent as WalletIcon } from '../../img/ic_wallet.svg';

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
        <WalletIcon className="icon" height={'16'} width={'auto'}/>
        <span>{activeAccount ? t('accounts') : t('connect')}</span>
      </Item>
    </HeadingWrapper>
  );
};
