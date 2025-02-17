// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxPayoutDays } from 'consts'
import { AveragePayoutLine } from 'library/Graphs/AveragePayoutLine'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import type { PayoutHistoryProps } from 'pages/Rewards/types'

type Props = Omit<
  PayoutHistoryProps & {
    nominating: boolean
    inPool: boolean
  },
  'payoutsList' | 'setPayoutsList'
>

export const ActiveGraph = ({
  nominating,
  inPool,
  payoutGraphData: { payouts, unclaimedPayouts, poolClaims },
  loading,
}: Props) => (
  <>
    <PayoutBar
      days={MaxPayoutDays}
      height="165px"
      data={{ payouts, unclaimedPayouts, poolClaims }}
      nominating={nominating}
      inPool={inPool}
      syncing={loading}
    />
    <AveragePayoutLine
      days={MaxPayoutDays}
      average={10}
      height="65px"
      data={{ payouts, unclaimedPayouts, poolClaims }}
      nominating={nominating}
      inPool={inPool}
    />
  </>
)
