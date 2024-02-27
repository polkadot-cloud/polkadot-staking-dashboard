/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { appendOrEmpty } from '@w3ux/utils';
import type { ModalConnectItemProps } from '../types';

/**
 * @name  ModalConnectItem
 * @summary Wrapper for a modal connect item.
 */
export const ModalConnectItem = ({
  children,
  style,
  canConnect,
}: ModalConnectItemProps) => (
  <div
    className={`modal-connect-item${appendOrEmpty(canConnect, 'can-connect')}`}
    style={style}
  >
    {children}
  </div>
);
