// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EraPointsLine } from 'library/Graphs/EraPointsLine'

export const InactiveGraph = ({
  width,
  height,
}: {
  width: string | number
  height: string | number
}) => (
  <EraPointsLine syncing={false} entries={[]} width={width} height={height} />
)
