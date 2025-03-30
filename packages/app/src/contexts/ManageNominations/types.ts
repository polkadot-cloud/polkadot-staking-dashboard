// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction } from '@w3ux/types'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { Validator } from 'types'

export interface ManageNominationsContextInterface {
  method: string | null
  setMethod: Dispatch<SetStateAction<string | null>>
  fetching: boolean
  setFetching: Dispatch<SetStateAction<boolean>>
  height: number | null
  setHeight: Dispatch<SetStateAction<number | null>>
  defaultNominations: Validator[]
  nominations: Validator[]
  setNominations: Dispatch<SetStateAction<Validator[]>>
  heightRef: RefObject<HTMLDivElement>
  updateSetters: (setters: AnyFunction[], nominations: Validator[]) => void
  resetNominations: (setters: AnyFunction[]) => void
  revertNominations: () => void
}
