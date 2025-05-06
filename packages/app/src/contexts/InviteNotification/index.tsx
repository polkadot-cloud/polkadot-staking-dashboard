// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

export type InviteType = 'pool' | 'validator' | null

export interface InviteNotificationContextInterface {
  inviteActive: boolean
  inviteType: InviteType
  inviteData: Record<string, string>
  setInviteActive: (active: boolean) => void
  setInviteType: (type: InviteType) => void
  setInviteData: (data: Record<string, string>) => void
  dismissInvite: () => void
  navigateToInvite: () => void
}

export const InviteNotificationContext =
  createContext<InviteNotificationContextInterface>(
    {} as InviteNotificationContextInterface
  )

export const InviteNotificationProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  // State for tracking invite status
  const [inviteActive, setInviteActive] = useState<boolean>(false)
  const [inviteType, setInviteType] = useState<InviteType>(null)
  const [inviteData, setInviteData] = useState<Record<string, string>>({})

  // Function to check hash for invite URL patterns
  const checkHashForInvite = () => {
    const hash = window.location.hash.substring(1) // Remove the # symbol

    // Check if this is an invite URL
    if (hash.includes('/invite/pool/')) {
      const parts = hash.split('/invite/pool/')
      if (parts.length > 1) {
        const poolParams = parts[1].split('/')
        if (poolParams.length >= 2) {
          const network = poolParams[0]
          const poolId = poolParams[1]

          // Set the invite data
          setInviteType('pool')
          setInviteData({ network, poolId })
          setInviteActive(true)

          // Store in session storage to persist across navigation
          sessionStorage.setItem('inviteActive', 'true')
          sessionStorage.setItem('inviteType', 'pool')
          sessionStorage.setItem(
            'inviteData',
            JSON.stringify({ network, poolId })
          )
        }
      }
    } else if (hash.includes('/invite/validator/')) {
      const parts = hash.split('/invite/validator/')
      if (parts.length > 1) {
        const validatorParams = parts[1].split('/')
        if (validatorParams.length >= 2) {
          const network = validatorParams[0]
          const validators = validatorParams[1]

          // Set the invite data
          setInviteType('validator')
          setInviteData({ network, validators })
          setInviteActive(true)

          // Store in session storage to persist across navigation
          sessionStorage.setItem('inviteActive', 'true')
          sessionStorage.setItem('inviteType', 'validator')
          sessionStorage.setItem(
            'inviteData',
            JSON.stringify({ network, validators })
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

    // Clean up event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Check session storage on initial load to restore state
  useEffect(() => {
    const storedInviteActive = sessionStorage.getItem('inviteActive')
    const storedInviteType = sessionStorage.getItem('inviteType') as InviteType
    const storedInviteData = sessionStorage.getItem('inviteData')

    if (storedInviteActive === 'true' && storedInviteType) {
      setInviteActive(true)
      setInviteType(storedInviteType)

      if (storedInviteData) {
        try {
          const parsedData = JSON.parse(storedInviteData)
          setInviteData(parsedData)
        } catch (e) {
          // Failed to parse invite data from session storage
        }
      }
    }
  }, [])

  // Function to dismiss the invite notification
  const dismissInvite = () => {
    setInviteActive(false)
    setInviteType(null)
    setInviteData({})

    // Clear from session storage
    sessionStorage.removeItem('inviteActive')
    sessionStorage.removeItem('inviteType')
    sessionStorage.removeItem('inviteData')
  }

  // Function to navigate to the invite page
  const navigateToInvite = () => {
    if (!inviteActive || !inviteType) {
      return
    }

    let url = ''
    if (inviteType === 'pool') {
      url = `/invite/pool/${inviteData.network}/${inviteData.poolId}`
    } else if (inviteType === 'validator') {
      url = `/invite/validator/${inviteData.network}/${inviteData.validators}`
    }

    // Use window.location to navigate
    if (url) {
      window.location.hash = url
    }
  }

  return (
    <InviteNotificationContext.Provider
      value={{
        inviteActive,
        inviteType,
        inviteData,
        setInviteActive,
        setInviteType,
        setInviteData,
        dismissInvite,
        navigateToInvite,
      }}
    >
      {children}
    </InviteNotificationContext.Provider>
  )
}

export const useInviteNotification = () => useContext(InviteNotificationContext)
