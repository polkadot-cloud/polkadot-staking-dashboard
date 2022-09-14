// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as WalletSVG } from 'img/wallet.svg';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { Wrapper } from './Wrappers';
import { Item } from '../Wrappers';

export const AccountsButton = () => {
  const { activeAccount, accounts } = useConnect();
  const { openModalWith } = useModal();

  const style = { flex: 0 };

  const svg = (
    <div
      style={{
        width: '1rem',
        height: '1rem',
        padding: '0.6rem 0',
        marginRight: '0.75rem',
      }}
    >
      <WalletSVG />
    </div>
  );

  return (
    <Wrapper>
      {activeAccount && (
        <Item
          style={style}
          onClick={() => {
            openModalWith(
              'ConnectAccounts',
              { section: accounts.length ? 1 : 0 },
              'large'
            );
          }}
          whileHover={{ scale: '1.01' }}
        >
          {svg} Accounts
        </Item>
      )}
    </Wrapper>
  );
};
