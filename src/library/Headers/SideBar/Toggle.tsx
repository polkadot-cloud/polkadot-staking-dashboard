// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as WalletSVG } from 'img/wallet.svg';
import { useSideBar } from 'contexts/SideBar';
import { useConnect } from 'contexts/Connect';
import { ToggleWrapper } from './Wrappers';
import { Item } from '../Wrappers';

export const Toggle = () => {
  const { activeAccount } = useConnect();
  const { openSideBar, open } = useSideBar();

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
    <ToggleWrapper>
      {!open && activeAccount !== '' && (
        <Item
          style={style}
          onClick={() => {
            openSideBar();
          }}
          whileHover={{ scale: '1.01' }}
        >
          {svg} Wallet
        </Item>
      )}
      {open ? <Item style={style}>{svg} Wallet</Item> : <></>}
    </ToggleWrapper>
  );
};
