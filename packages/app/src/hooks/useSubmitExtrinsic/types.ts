// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SubmittableExtrinsic } from 'dedot'
import type { MaybeAddress } from 'types'

export interface UseSubmitExtrinsicProps {
  tx: SubmittableExtrinsic | undefined
  tag?: string
  from: MaybeAddress
  shouldSubmit: boolean
  callbackSubmit?: () => void
  callbackInBlock?: () => void
}

export interface UseSubmitExtrinsic {
  uid: number
  onSubmit: () => void
  proxySupported: boolean
  submitAddress: MaybeAddress
}
