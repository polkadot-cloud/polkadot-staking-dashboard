// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useMenu } from 'contexts/Menu';
import type { MenuItem } from 'contexts/Menu/types';
import { ItemWrapper } from './Wrappers';

export const MenuList = ({ items }: { items: MenuItem[] }) => {
  const { closeMenu } = useMenu();

  return (
    <>
      {items.map((item, i: number) => {
        const { icon, title, cb } = item;

        return (
          <ItemWrapper
            key={`menu_item_${i}`}
            onClick={() => {
              cb();
              closeMenu();
            }}
          >
            {icon}
            <div className="title">{title}</div>
          </ItemWrapper>
        );
      })}
    </>
  );
};
