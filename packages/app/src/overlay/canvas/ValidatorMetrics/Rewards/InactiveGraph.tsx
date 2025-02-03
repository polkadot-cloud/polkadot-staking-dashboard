// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PayoutLine } from 'library/Graphs/PayoutLine'

export const InactiveGraph = ({
  width,
  height,
}: {
  width: string | number
  height: string | number
}) => <PayoutLine syncing={false} entries={[]} width={width} height={height} />
