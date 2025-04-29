// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TxSubmissionItem } from 'controllers/TxSubmission/types'

export interface TxMetaContextInterface {
  uids: TxSubmissionItem[]
  getTxSubmission: (uid?: number) => TxSubmissionItem | undefined
  getTxSubmissionByTag: (tag: string) => TxSubmissionItem | undefined
}
