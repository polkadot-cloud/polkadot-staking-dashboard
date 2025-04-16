// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, NetworkId } from 'types'
import type { DisaptchEvent, EventApiStatus, EventKey } from './types/events'

// Format an api status event
export const formatApiStatusEvent = (
  network: NetworkId,
  chain: ChainId,
  status: string,
  err?: Error
): EventApiStatus => ({
  network,
  chain,
  status,
  err,
})

// Dispatch events to the document
export const disaptch = <T extends EventKey>(
  key: EventKey,
  detail: DisaptchEvent[T]
) => {
  document.dispatchEvent(
    new CustomEvent(key, {
      detail,
    })
  )
}
