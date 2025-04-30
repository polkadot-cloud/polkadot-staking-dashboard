// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import type { Sync } from '@w3ux/types'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { useApi } from '../../Api'
import type { FetchedPoolMembers, PoolMemberContext } from './types'

export const [PoolMembersContext, usePoolMembers] =
  createSafeContext<PoolMemberContext>()

export const PoolMembersProvider = ({ children }: { children: ReactNode }) => {
  const { isReady, serviceApi } = useApi()

  // Store whether pool members from api have been fetched
  const fetchedPoolMembersApi = useRef<Sync>('unsynced')

  // Stores fetch pool member data
  const [poolMemberData, setPoolMemberData] = useState<FetchedPoolMembers>({
    poolMembers: [],
    addresses: [],
  })

  // Update poolMembersApi fetched status
  const setFetchedPoolMembersApi = (status: Sync) => {
    fetchedPoolMembersApi.current = status
  }

  const fetchPoolMemberData = async (addresses: string[]) => {
    if (!isReady || !addresses.length) {
      return
    }
    setPoolMemberData({
      poolMembers: [],
      addresses: [],
    })
    const result = {
      addresses,
      poolMembers: (await serviceApi.query.poolMembersMulti(addresses)).map(
        (member, i) => {
          if (!member) {
            return undefined
          }
          return {
            ...member,
            address: addresses[i],
          }
        }
      ),
    }
    setPoolMemberData(result)
  }

  return (
    <PoolMembersContext.Provider
      value={{
        fetchPoolMemberData,
        fetchedPoolMembersApi: fetchedPoolMembersApi.current,
        meta: poolMemberData,
        setFetchedPoolMembersApi,
      }}
    >
      {children}
    </PoolMembersContext.Provider>
  )
}
