// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Item } from './Wrappers';
import { useUi } from '../../contexts/UI';

export const SideMenuToggle = () => {
  const { setSideMenu, sideMenuOpen }: any = useUi();

  return (
    <div className="menu">
      <Item
        style={{ width: '50px', flex: 0 }}
        onClick={() => {
          setSideMenu(sideMenuOpen ? 0 : 1);
        }}
      >
        <span>
          <FontAwesomeIcon icon={faBars} style={{ cursor: 'pointer' }} />
        </span>
      </Item>
    </div>
  );
};
