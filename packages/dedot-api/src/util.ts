// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DisaptchEvent, EventKey } from './types/events'

// Dispatch events to the document
export const disaptch = <T extends EventKey>(
  key: EventKey,
  detail: DisaptchEvent[T]
) => {
  document.dispatchEvent(
    new CustomEvent(key, {
      detail: { ...detail },
    })
  )
}
