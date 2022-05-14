// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Item } from '../Wrappers';
import { ToggleWrapper } from './Wrappers';
import { ReactComponent as WalletSVG } from '../../../img/wallet.svg';
import { useSideBar } from '../../../contexts/SideBar';

export const Toggle = () => {

  const { openSideBar, open } = useSideBar();

  const style = { width: '50px', flex: 0 };

  const svg =
    <div style={{
      width: '1.2rem',
      height: '1.2rem',
      padding: '0.45rem 0'
    }}
    >
      <WalletSVG />
    </div>

  return (
    <ToggleWrapper>
      {!open &&
        <Item
          style={style}
          onClick={() => { openSideBar() }}
          whileHover={{ scale: '1.01' }}
        >
          {svg}
        </Item>
      }
      {open
        ? <Item style={style}>{svg}</Item>
        : <></>
      }
    </ToggleWrapper>
  )
}