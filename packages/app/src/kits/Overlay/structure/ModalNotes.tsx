// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { appendOrEmpty } from '@w3ux/utils'
import type { ModalNotesProps } from '../types'

/**
 * @name ModalNotes
 * @summary Note styling.
 */
export const ModalNotes = ({
  children,
  style,
  withPadding,
}: ModalNotesProps) => (
  <div
    className={`modal-notes${appendOrEmpty(withPadding, 'with-padding')}`}
    style={style}
  >
    {children}
  </div>
)
