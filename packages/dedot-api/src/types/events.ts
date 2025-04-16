// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, NetworkId } from 'types'

export interface DisaptchEvent {
  apiStatus: EventApiStatus
}

export type EventKey = keyof DisaptchEvent

export type EventApiStatus = {
  network: NetworkId
  chain: ChainId
  status: string
  err?: Error
}
