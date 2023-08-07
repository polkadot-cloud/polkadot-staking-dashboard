// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUi } from 'contexts/UI';
import { Item } from './Wrappers';

export const SideMenuToggle = () => {
  const { setSideMenu, sideMenuOpen } = useUi();

  return (
    <div className="menu">
      <Item
        style={{ width: '50px', flex: 0 }}
        onClick={() => {
          setSideMenu(!sideMenuOpen);
        }}
      >
        <span>
          <FontAwesomeIcon className="icon" icon={faBars} />
        </span>
      </Item>
    </div>
  );
};
