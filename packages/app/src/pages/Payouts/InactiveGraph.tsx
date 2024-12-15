// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxPayoutDays } from 'consts'
import { PayoutBar } from 'library/Graphs/PayoutBar'
import { PayoutLine } from 'library/Graphs/PayoutLine'

export const InactiveGraph = () => (
  <>
    <PayoutBar
      days={MaxPayoutDays}
      height="165px"
      data={{ payouts: [], unclaimedPayouts: [], poolClaims: [] }}
      nominating={false}
      inPool={false}
    />
    <PayoutLine
      days={MaxPayoutDays}
      average={10}
      height="65px"
      data={{ payouts: [], unclaimedPayouts: [], poolClaims: [] }}
      nominating={false}
      inPool={false}
    />
  </>
)
