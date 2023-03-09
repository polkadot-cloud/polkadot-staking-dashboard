// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useOutsideAlerter } from 'library/Hooks';
import { useRef } from 'react';
import type { DropdownProps } from './types';

export const Dropdown = ({ toggleMenu, items }: DropdownProps) => {
  const ref = useRef(null);
  useOutsideAlerter(
    ref,
    () => {
      toggleMenu(false);
    },
    ['dropdown-toggle']
  );

  return (
    <ul className="accounts" ref={ref}>
      {items}
    </ul>
  );
};
