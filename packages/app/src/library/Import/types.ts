// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction, ImportedAccount } from '@w3ux/types'
import type { FunctionComponent, SVGProps } from 'react'

export interface HeadingProps {
  connectTo?: string
  disabled?: boolean
  handleReset?: () => void
  Icon?: FunctionComponent<SVGProps<SVGSVGElement>>
  title: string
}

export interface AddressProps {
  address: string
  index: number
  initial: string
  disableEditIfImported?: boolean
  renameHandler: AnyFunction
  existsHandler: AnyFunction
  openRemoveHandler: AnyFunction
  openConfirmHandler: AnyFunction
  t: {
    tImport: string
    tRemove: string
  }
}

export interface ConfirmProps {
  address: string
  index: number
  addHandler: (
    network: string,
    address: string,
    index: number,
    callback?: () => void
  ) => ImportedAccount | null
}

export interface RemoveProps {
  address: string
  getHandler: (network: string, address: string) => ImportedAccount | null
  removeHandler: (
    network: string,
    address: string,
    callback?: () => void
  ) => void
}
