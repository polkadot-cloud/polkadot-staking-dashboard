// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { appendOrEmpty } from '@w3ux/utils'
import type { ModalWarningsProps } from '../types'

/**
 * @name ModalWarnings
 * @summary Warnings styling.
 */
export const ModalWarnings = ({
  children,
  style,
  withMargin,
}: ModalWarningsProps) => (
  <div
    className={`modal-warnings${appendOrEmpty(withMargin, 'with-margin')}`}
    style={style}
  >
    {children}
  </div>
)
