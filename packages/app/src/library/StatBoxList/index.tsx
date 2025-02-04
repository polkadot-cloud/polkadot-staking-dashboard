// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import { StatBoxRow } from 'ui-core/base'
import { ListWrapper } from './Wrapper'

export const StatBoxList = ({ children }: { children: ReactNode }) => (
  <StatBoxRow>
    <ListWrapper>{children}</ListWrapper>
  </StatBoxRow>
)
