// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util'
import { ellipsisFn } from '@w3ux/utils'
import type { AnyJson } from 'types'

/**
 * @name determinePoolDisplay
 * @summary A pool will be displayed with either its set metadata or its address.
 */
export const determinePoolDisplay = (address: string, batchItem: AnyJson) => {
  // default display value
  const defaultDisplay = ellipsisFn(address, 6)

  // fallback to address on empty metadata string
  let display = batchItem ?? defaultDisplay

  // check if super identity has been byte encoded
  const displayAsBytes = u8aToString(u8aUnwrapBytes(display))
  if (displayAsBytes !== '') {
    display = displayAsBytes
  }
  // if still empty string, default to clipped address
  if (display === '') {
    display = defaultDisplay
  }

  return display
}
