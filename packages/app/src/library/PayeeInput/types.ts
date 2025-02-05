// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PayeeConfig } from 'contexts/Setup/types'
import type { Dispatch, SetStateAction } from 'react'
import type { MaybeAddress } from 'types'

export interface PayeeInputProps {
  payee: PayeeConfig
  account: MaybeAddress
  setAccount: Dispatch<SetStateAction<MaybeAddress>>
  handleChange: (a: MaybeAddress) => void
}
