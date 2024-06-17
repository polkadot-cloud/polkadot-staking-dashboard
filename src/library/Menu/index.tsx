// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react';
import { useMenu } from 'contexts/Menu';
import { Wrapper } from './Wrappers';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';

export const Menu = () => {
  const {
    open,
    show,
    inner,
    closeMenu,
    position: [x, y],
    checkMenuPosition,
  } = useMenu();

  const menuRef = useRef(null);

  // Handler for closing the menu on window resize.
  const resizeCallback = () => {
    closeMenu();
  };

  // Close the menu if clicked outside of its container.
  useOutsideAlerter(menuRef, () => {
    closeMenu();
  });

  // Check position and show the menu if menu has been opened.
  useEffect(() => {
    if (open) {
      checkMenuPosition(menuRef);
    }
  }, [open]);

  // Close the menu on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  return (
    open && (
      <Wrapper
        ref={menuRef}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          zIndex: 999,
          opacity: show ? 1 : 0,
        }}
      >
        {inner}
      </Wrapper>
    )
  );
};
