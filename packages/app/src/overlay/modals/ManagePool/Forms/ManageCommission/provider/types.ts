// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { MaybeAddress } from 'types'

export interface PoolCommissionContextInterface {
  setCommission: Dispatch<SetStateAction<number>>
  setPayee: Dispatch<SetStateAction<MaybeAddress>>
  setMaxCommission: Dispatch<SetStateAction<number>>
  setChangeRate: Dispatch<SetStateAction<ChangeRateInput>>
  getInitial: (feature: CommissionFeature) => AnyJson
  getCurrent: (feature: CommissionFeature) => AnyJson
  getEnabled: (feature: OptionalCommissionFeature) => boolean
  setEnabled: (feature: OptionalCommissionFeature, enabled: boolean) => void
  isUpdated: (feature: CommissionFeature) => boolean
  hasValue: (feature: OptionalCommissionFeature) => boolean
  resetAll: () => void
}

export interface PoolCommissionProviderProps {
  children: ReactNode
}

export type CompulsoryCommissionFeature = 'commission' | 'payee'

export type OptionalCommissionFeature = 'max_commission' | 'change_rate'

export type CommissionFeature =
  | CompulsoryCommissionFeature
  | OptionalCommissionFeature

export interface ChangeRateInput {
  maxIncrease: number
  minDelay: number
}
