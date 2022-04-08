// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { useOutsideAlerter } from '../../library/Hooks';

export const Dropdown = (props: any) => {

  const { toggleMenu, items } = props;

  const ref = useRef(null);
  useOutsideAlerter(ref, () => {
    toggleMenu();
  });

  return (
    <ul className='accounts' ref={ref}>
      {items}
    </ul>
  )
}

export default Dropdown;