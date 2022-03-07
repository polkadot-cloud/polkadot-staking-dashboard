// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Item } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';

export const Dropdown = (props: any) => {

  const connect = useConnect();
  const modal = useModal();

  return (
    <ul className='accounts'>
      <Item
        onClick={() => {
          modal.setStatus(1);
          props.toggleMenu(false);
        }}
        whileHover={{ scale: 1.01 }}
      >
        Switch Accounts
      </Item>
      <Item
        onClick={() => {
          connect.disconnect();
          props.toggleMenu(false);
        }}
        whileHover={{ scale: 1.01 }}
        style={{ color: '#ae2324' }}
      >
        Disconnect
      </Item>
    </ul>
  )
}

export default Dropdown;