// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction, AnyJson, DisplayFor } from '@w3ux/types'
import type { NominationSelection, Validator } from 'types'

export interface GenerateNominationsProps {
  setters: AnyFunction[]
  displayFor?: DisplayFor
  allowRevert?: boolean
}

export type NominationSelectionWithResetCounter = NominationSelection & {
  reset: number
}

export type AddNominationsType =
  | 'High Performance Validator'
  | 'Active Validator'
  | 'Random Validator'

export interface SelectHandler {
  title: string
  onSelected: boolean
  isDisabled: () => boolean
  popover: {
    node: React.FC<AnyJson>
    text: string
    callback: (args: { selected: AnyJson[]; callback?: AnyFunction }) => void
  }
}

export interface ListControlsProps {
  selectHandlers: Record<string, SelectHandler>
  filterHandlers: AnyJson[]
  displayFor: DisplayFor
}

export interface PromptProps {
  callback: (newNominations: Validator[]) => void
  nominations: Validator[]
}

export interface RevertPromptProps {
  onRevert: () => void
}

export interface RemoveSelectedProps {
  text: string
  controlKey: string
  onRevert: () => void
  onClose: () => void
}
