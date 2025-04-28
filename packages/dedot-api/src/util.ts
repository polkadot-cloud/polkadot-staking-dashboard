// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatAccountSs58 } from '@w3ux/utils'
import type { SubmittableExtrinsic } from 'dedot'
import type { ChainId, ImportedAccount } from 'types'

// Gets added and removed accounts by comparing two lists of accounts
export const diffImportedAccounts = (
  prev: ImportedAccount[],
  cur: ImportedAccount[]
) => {
  const getAccountId = (account: ImportedAccount): string =>
    `${account.source}:${account.address}`

  const prevMap = new Map(prev.map((a) => [getAccountId(a), a]))
  const curMap = new Map(cur.map((a) => [getAccountId(a), a]))

  const added = [...curMap.keys()]
    .filter((k) => !prevMap.has(k))
    .map((k) => curMap.get(k)!)

  const removed = [...prevMap.keys()]
    .filter((k) => !curMap.has(k))
    .map((k) => prevMap.get(k)!)

  return { added, removed }
}

// Gets added and removed pool ids by comparing two lists of pool ids
export const diffPoolIds = (prev: number[], cur: number[]) => {
  const prevSet = new Set(prev)
  const curSet = new Set(cur)

  const added = cur.filter((id) => !prevSet.has(id))
  const removed = prev.filter((id) => !curSet.has(id))

  return { added, removed }
}

// Gets the account record key for a specific chain and account
export const getAccountKey = (chain: ChainId, account: ImportedAccount) =>
  `${chain}:${account.source}:${account.address}`

// Gets type-safe keys from an object
export const keysOf = <T extends Record<string, unknown>>(obj: T) =>
  Object.keys(obj) as (keyof typeof obj)[]

// Casts a transaction to a SubmittableExtrinsic type
export const asTx = <T>(tx: T) => tx as SubmittableExtrinsic

// Casts a transaction array to a SubmittableExtrinsic[] type
export const asTxs = <T>(txs: T[]) =>
  // for each array element, cast to SubmittableExtrinsic
  txs.map((t) => t as SubmittableExtrinsic)

// Format account adddresses to an ss58 format
export const formatAccountAddresses = (
  accounts: ImportedAccount[],
  ss58: number
): ImportedAccount[] =>
  accounts
    .map((account) => {
      const address = formatAccountSs58(account.address, ss58)
      if (!address) {
        return undefined
      }
      return {
        ...account,
        address,
      }
    })
    .filter((account) => account !== undefined)
