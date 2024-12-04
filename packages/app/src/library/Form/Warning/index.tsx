// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WarningProps } from '../types'
import { Wrapper } from './Wrapper'

export const Warning = ({ text }: WarningProps) => (
  <Wrapper>
    <h4>{text}</h4>
  </Wrapper>
)
