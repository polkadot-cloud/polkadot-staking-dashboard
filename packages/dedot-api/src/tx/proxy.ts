// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient, SubmittableExtrinsic } from 'dedot'
import type { StakingChain } from '../types'

export const proxy = <T extends StakingChain>(
  api: DedotClient<T>,
  real: string,
  call: SubmittableExtrinsic
): SubmittableExtrinsic => {
  // TODO: Test call format is correct
  // @ts-expect-error Proxy type too complex to determine
  const tx = asTx(api.tx.proxy.proxy(real, undefined, call.toU8a()))
  return tx
}
