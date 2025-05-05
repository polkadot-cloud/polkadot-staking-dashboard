// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import {
  copyToClipboard,
  generatePoolInviteUrl,
  generateValidatorInviteUrl,
} from '../utils/inviteHelpers'

/**
 * Interface for the props of the useInviteManagement hook
 */
export interface InviteManagementProps {
  type: 'pool' | 'validator'
}

/**
 * A consolidated hook for managing invites, combining URL generation and display functionality
 * @param props - Configuration props for the hook
 * @returns All invite-related utilities and state
 */
export const useInviteManagement = ({ type }: InviteManagementProps) => {
  // Context hooks
  const { activeAddress } = useActiveAccounts()
  const { activePool } = useActivePool()
  const { getNominations } = useBalances()
  const { formatWithPrefs } = useValidators()
  const { network } = useNetwork()
  const { i18n } = useTranslation()
  const { setModalResize } = useOverlay().modal

  // ==================== URL GENERATION STATE ====================
  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [selectedValidators, setSelectedValidators] = useState<string[]>([])
  const [inviteUrl, setInviteUrl] = useState<string>('')
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)

  // ==================== URL DISPLAY STATE ====================
  const [showFullUrl, setShowFullUrl] = useState(false)

  // Get nominated validators for the active account
  const nominatedAddresses = activeAddress ? getNominations(activeAddress) : []
  const nominatedValidators = formatWithPrefs(nominatedAddresses)

  // Get pools the user is a member of
  const userPools = activePool ? [activePool] : []

  // ==================== URL GENERATION LOGIC ====================
  /**
   * Generates an invite URL based on the selected type, pool, or validators
   * @returns The generated invite URL
   */
  const generateInviteUrl = () => {
    let url = ''

    if (type === 'pool' && selectedPool) {
      url = generatePoolInviteUrl(selectedPool, network, i18n.language)
    } else if (type === 'validator' && selectedValidators.length > 0) {
      url = generateValidatorInviteUrl(
        selectedValidators,
        network,
        i18n.language
      )
    }

    setInviteUrl(url)
    return url
  }

  /**
   * Copies the invite URL to the clipboard and shows a temporary success message
   * @returns Promise that resolves to true if successful
   */
  const copyInviteUrl = async () => {
    const url = inviteUrl || generateInviteUrl()
    const success = await copyToClipboard(url)

    if (success) {
      setCopiedToClipboard(true)
      setTimeout(() => setCopiedToClipboard(false), 3000)
    }

    return success
  }

  /**
   * Gets pool details for display purposes
   * @param poolId - The ID of the pool
   * @returns An object with pool display details
   */
  const getPoolDetails = (poolId: string) => {
    const poolData = activePool || { id: '', addresses: { stash: '' } }
    return {
      id: poolId,
      name: poolData.id ? `Pool #${poolId}` : poolId,
      addresses: poolData.addresses || { stash: '' },
    }
  }

  // ==================== URL DISPLAY LOGIC ====================
  /**
   * Shortens a URL for display purposes
   * @param urlString - The URL to shorten
   * @returns Shortened URL with ellipsis in the middle
   */
  const shortenUrl = (urlString: string) => {
    if (!urlString || urlString.length <= 60) {
      return urlString
    }
    return `${urlString.substring(0, 30)}...${urlString.substring(urlString.length - 30)}`
  }

  /**
   * Toggles between full and shortened URL display
   */
  const toggleUrlDisplay = () => {
    setShowFullUrl(!showFullUrl)
  }

  // Resize modal when URL display changes
  useEffect(() => {
    if (showFullUrl) {
      // Use requestAnimationFrame to ensure DOM has updated before resizing
      const frameId = requestAnimationFrame(() => {
        setModalResize()
      })

      return () => cancelAnimationFrame(frameId)
    }
  }, [showFullUrl, setModalResize])

  // Compute the display URL based on current state
  const displayUrl = showFullUrl ? inviteUrl : shortenUrl(inviteUrl)

  // Return a unified API that separates concerns internally
  return {
    // URL generation API
    generation: {
      activeAddress,
      userPools,
      selectedPool,
      setSelectedPool,
      selectedValidators,
      setSelectedValidators,
      generateInviteUrl,
      copyInviteUrl,
      copiedToClipboard,
      inviteUrl,
      getPoolDetails,
      nominatedValidators,
    },
    // URL display API
    display: {
      showFullUrl,
      displayUrl,
      toggleUrlDisplay,
    },
  }
}
