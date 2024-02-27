/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import type { ComponentBase } from 'types';

/**
 * @name ModalCustomHeader
 * @summary The header section along with the title.
 */
export const ModalCustomHeader = ({ children, style }: ComponentBase) => (
  <div className="modal-custom-header" style={style}>
    {children}
  </div>
);
