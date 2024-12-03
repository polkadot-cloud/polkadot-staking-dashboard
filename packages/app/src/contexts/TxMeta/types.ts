// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TxSubmissionItem } from 'api/types'

export interface TxMetaContextInterface {
  uids: TxSubmissionItem[]
  getTxSubmission: (uid?: number) => TxSubmissionItem | undefined
  getTxSubmissionByTag: (tag: string) => TxSubmissionItem | undefined
}
