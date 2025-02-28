// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ComponentBase } from 'types';

/**
 * @name  ModalHardwareItem
 * @summary Inner wrapper for a hardware connect item.
 */
export const ModalHardwareItem = ({ children, style }: ComponentBase) => (
  <div className={'modal-hardware-item'} style={style}>
    {children}
  </div>
);
