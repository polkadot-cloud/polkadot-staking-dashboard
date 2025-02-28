// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react';
import { useMenu } from 'contexts/Menu';
import { useOutsideAlerter } from 'library/Hooks';
import { ItemWrapper, Wrapper } from './Wrappers';
import type { AnyJson } from 'types';

export const Menu = () => {
  const menu = useMenu();
  const { position } = menu;

  const ref = useRef(null);

  useEffect(() => {
    if (menu.open === 1) {
      menu.checkMenuPosition(ref);
      // check position
    }
  }, [menu.open]);

  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  const resizeCallback = () => {
    menu.closeMenu();
  };

  useOutsideAlerter(
    ref,
    () => {
      menu.closeMenu();
    },
    ['ignore-open-menu-button']
  );

  return (
    menu.open === 1 && (
      <Wrapper
        ref={ref}
        style={{
          position: 'absolute',
          left: `${position[0]}px`,
          top: `${position[1]}px`,
          zIndex: 99,
          opacity: menu.show === 1 ? 1 : 0,
        }}
      >
        {menu.items.map((item: AnyJson, i: number) => {
          const { icon, title, cb } = item;

          return (
            <ItemWrapper
              key={`menu_item_${i}`}
              onClick={() => {
                cb();
                menu.closeMenu();
              }}
            >
              {icon}
              <div className="title">{title}</div>
            </ItemWrapper>
          );
        })}
      </Wrapper>
    )
  );
};
