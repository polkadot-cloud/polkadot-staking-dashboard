// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  copyToClipboard,
  generatePoolInviteUrl,
  generateValidatorInviteUrl,
} from '../utils/inviteHelpers'

export interface InviteGeneratorProps {
  type: 'pool' | 'validator'
}

export const useInviteGenerator = ({ type }: InviteGeneratorProps) => {
  const { activeAccount } = useActiveAccounts()
  const { activePool } = useActivePool()
  const { getNominations } = useBalances()
  const { formatWithPrefs } = useValidators()
  const { network } = useNetwork()
  const { i18n } = useTranslation()

  // Get nominated validators
  const nominatedAddresses = activeAccount ? getNominations(activeAccount) : []
  const nominatedValidators = formatWithPrefs(nominatedAddresses)

  const [selectedPool, setSelectedPool] = useState<string | null>(null)
  const [selectedValidators, setSelectedValidators] = useState<string[]>([])
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)
  const [inviteUrl, setInviteUrl] = useState<string>('')

  // Get pools the user is a member of
  const userPools = activePool ? [activePool] : []

  // Generate invite URL based on type
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

  // Copy invite URL to clipboard
  const copyInviteUrl = async () => {
    const url = inviteUrl || generateInviteUrl()
    const success = await copyToClipboard(url)

    if (success) {
      setCopiedToClipboard(true)
      setTimeout(() => setCopiedToClipboard(false), 3000)
    }

    return success
  }

  // Get pool details for display
  const getPoolDetails = (poolId: string) => {
    const poolData = activePool || { id: '', addresses: { stash: '' } }
    return {
      id: poolId,
      name: poolData.id ? `Pool #${poolId}` : poolId,
      addresses: poolData.addresses || { stash: '' },
    }
  }

  return {
    activeAccount,
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
  }
}
