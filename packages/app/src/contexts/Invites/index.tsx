// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  getLocalInviteConfig,
  removeLocalInviteConfig,
  setLocalInviteConfig,
} from './local'
import type { InviteConfig, InvitesContextInterface, InviteType } from './types'

export const InvitesContext = createContext<InvitesContextInterface>(
  {} as InvitesContextInterface
)

export const InvitesProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()

  // State for tracking invite status
  const [inviteConfig, setInviteConfig] = useState<InviteConfig | undefined>(
    getLocalInviteConfig()
  )

  // Whether the invite has been acknowledged
  const [acknowledged, setAcknowledged] = useState<boolean>(false)

  // Function to dismiss the invite notification
  const dismissInvite = () => {
    setInviteConfig(undefined)
    removeLocalInviteConfig()
  }

  // NOTE: Auto opening of invites is currently disabled.
  // const { openCanvas } = useOverlay().canvas
  // const { syncing } = useSyncing([
  //   'initialization',
  //   'bonded-pools',
  //   'active-pools',
  // ])
  // Open pool invite when ready
  // useEffect(() => {
  //   const idFromUrl = extractUrlValue('id')
  //   if (!syncing) {
  //     if (extractUrlValue('i') === 'pool' && !isNaN(Number(idFromUrl))) {
  //       openCanvas({
  //         key: 'Pool',
  //         options: { providedPool: { id: Number(idFromUrl) } },
  //         size: 'xl',
  //       })
  //     }
  //   }
  // }, [syncing])

  // Set invite data when the page loads
  useEffect(() => {
    const idFromUrl = extractUrlValue('id')
    if (extractUrlValue('i') === 'pool' && !isNaN(Number(idFromUrl))) {
      setLocalInviteConfig({
        type: 'pool',
        network,
        invite: {
          poolId: Number(idFromUrl),
        },
      })
      const type: InviteType = 'pool'
      const invite = {
        type,
        network,
        invite: {
          poolId: Number(idFromUrl),
        },
      }
      setInviteConfig(invite)
      setAcknowledged(true)
    }
  }, [])

  return (
    <InvitesContext.Provider
      value={{
        dismissInvite,
        acknowledged,
        setAcknowledged,
        inviteConfig,
      }}
    >
      {children}
    </InvitesContext.Provider>
  )
}

export const useInvites = () => useContext(InvitesContext)
