// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ellipsisFn } from '@w3ux/utils'
import type { IdentityOf, SuperIdentity, SuperOf } from 'types'

// Format identities into records with addresses as keys
export const formatIdentities = (
  addresses: string[],
  identities: IdentityOf[]
) =>
  identities.reduce((acc: Record<string, IdentityOf | undefined>, cur, i) => {
    acc[addresses[i]] = cur
    return acc
  }, {})

// Format super identities into records with addresses as keys
export const formatSuperIdentities = (supers: SuperOf[]) =>
  supers.reduce((acc: Record<string, SuperIdentity>, cur) => {
    if (!cur) {
      return acc
    }
    acc[cur.address] = {
      superOf: {
        identity: cur.identity,
        value: cur.value,
      },
      value: cur.value?.value || '',
    }
    return acc
  }, {})

// Format an identity value, falling back to an ellipsis of the address if no identity is provided
export const formatIdentityValue = (address: string, identity?: string) =>
  identity || ellipsisFn(address, 8)
