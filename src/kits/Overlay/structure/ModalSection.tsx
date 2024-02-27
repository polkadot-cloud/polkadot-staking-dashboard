/* @license Copyright 2024 @polkadot-cloud/library authors & contributors
SPDX-License-Identifier: GPL-3.0-only */

import { appendOrEmpty } from '@w3ux/utils';
import type { ModalSectionProps } from '../types';

/**
 * @name  ModalSection
 * @summary Section wrapper.
 */
export const ModalSection = ({ children, style, type }: ModalSectionProps) => (
  <div
    className={`${appendOrEmpty(type === 'carousel', 'modal-carousel')}${appendOrEmpty(
      type === 'tab',
      'modal-tabs'
    )}`}
    style={style}
  >
    {children}
  </div>
);
