// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { AccountBalance } from 'types'

type Chain = string
type Address = string
type State = Record<Chain, Record<Address, AccountBalance>>

export const _accountBalances = new BehaviorSubject<State>({})
