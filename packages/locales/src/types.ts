// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Locale } from 'date-fns'

export interface LocaleJson {
  [key: string]:
    | string
    | string[]
    | string[][]
    | (string | string[])[]
    | LocaleJson
    | LocaleJson[]
}

export type LocaleJsonValue =
  | string
  | string[]
  | string[][]
  | (string | string[])[]
  | LocaleJson
  | LocaleJson[]

export interface LocaleEntry {
  dateFormat: Locale
  label: string
  variant?: string
}
