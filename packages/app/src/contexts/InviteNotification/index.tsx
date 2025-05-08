// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { useNetwork } from 'contexts/Network'
import { useSyncing } from 'hooks/useSyncing'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useOverlay } from 'ui-overlay'
import type {
  InviteConfig,
  InviteNotificationContextInterface,
  InviteType,
  NominatorInvite,
} from './types'

export const InviteNotificationContext =
  createContext<InviteNotificationContextInterface>(
    {} as InviteNotificationContextInterface
  )

export const InviteNotificationProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { network } = useNetwork()
  const { syncing } = useSyncing()
  const { openCanvas } = useOverlay().canvas

  // State for tracking invite status
  const [inviteConfig, setInviteConfig] = useState<InviteConfig | undefined>(
    undefined
  )

  // Whether the invite has been acknowledged
  const [acknowledged, setAcknowledged] = useState<boolean>(false)

  // Function to check hash for invite URL patterns
  const checkHashForInvite = () => {
    const hash = window.location.hash.substring(1) // Remove the # symbol

    // Check if this is an invite URL
    if (hash.includes('/invite/validator/')) {
      const parts = hash.split('/invite/validator/')
      if (parts.length > 1) {
        const validatorParams = parts[1].split('/')
        if (validatorParams.length >= 2) {
          const type: InviteType = 'validator'
          const networkParam = validatorParams[0]
          const validators = validatorParams[1]
          const invite = {
            type,
            network: networkParam,
            invite: {
              validators,
            },
          }
          setInviteConfig(invite)

          // Store in session storage to persist across navigation
          sessionStorage.setItem('inviteActive', 'true')
          sessionStorage.setItem('inviteType', 'validator')
          sessionStorage.setItem(
            'inviteData',
            JSON.stringify({ network: networkParam, validators })
          )
        }
      }
    }
  }

  // Check URL on hash change
  useEffect(() => {
    // Check on mount
    checkHashForInvite()
    // Set up event listener for hash changes
    const handleHashChange = () => {
      checkHashForInvite()
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Check session storage on initial load to restore state
  useEffect(() => {
    const storedInviteActive = sessionStorage.getItem('inviteActive')
    const storedInviteType = sessionStorage.getItem('inviteType') as InviteType
    const storedInviteData = sessionStorage.getItem('inviteData')

    if (storedInviteActive && storedInviteData && storedInviteType) {
      // TODO: Use local storage getter
      const parsedData = JSON.parse(storedInviteData)

      const invite = {
        type: storedInviteType,
        network: parsedData.network,
        invite: parsedData,
      }
      setInviteConfig(invite)
    }
  }, [])

  // Function to dismiss the invite notification
  const dismissInvite = () => {
    setInviteConfig(undefined)

    // Clear from session storage
    sessionStorage.removeItem('inviteActive')
    sessionStorage.removeItem('inviteType')
    sessionStorage.removeItem('inviteData')
  }

  // Function to navigate to the invite page
  const navigateToInvite = () => {
    if (!inviteConfig) {
      return
    }
    if (inviteConfig.type === 'validator') {
      const invite = inviteConfig.invite as NominatorInvite
      window.location.hash = `/invite/validator/${inviteConfig.network}/${invite.validators}`
    }
  }

  // Open pool invite when ready
  useEffect(() => {
    const idFromUrl = extractUrlValue('id')
    if (!syncing) {
      if (extractUrlValue('i') === 'pool' && !isNaN(Number(idFromUrl))) {
        openCanvas({
          key: 'Pool',
          options: { providedPool: { id: Number(idFromUrl) } },
          size: 'xl',
        })
      }
    }
  }, [syncing])

  // Set invite data from URL when the page loads
  useEffect(() => {
    const idFromUrl = extractUrlValue('id')
    if (extractUrlValue('i') === 'pool' && !isNaN(Number(idFromUrl))) {
      const type: InviteType = 'pool'
      const invite = {
        type,
        network,
        invite: {
          poolId: Number(idFromUrl),
        },
      }
      setInviteConfig(invite)
    }
  }, [])

  return (
    <InviteNotificationContext.Provider
      value={{
        dismissInvite,
        navigateToInvite,
        acknowledged,
        setAcknowledged,
        inviteConfig,
      }}
    >
      {children}
    </InviteNotificationContext.Provider>
  )
}

export const useInviteNotification = () => useContext(InviteNotificationContext)
