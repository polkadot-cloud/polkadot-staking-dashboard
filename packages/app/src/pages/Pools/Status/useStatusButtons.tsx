// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTranslation } from 'react-i18next'

export const useStatusButtons = () => {
  const { t } = useTranslation('pages')
  const {
    isReady,
    poolsConfig: { maxPools },
  } = useApi()
  const { isOwner } = useActivePool()
  const { bondedPools } = useBondedPools()
  const { getStakingLedger } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { isReadOnlyAccount } = useImportedAccounts()

  const { poolMembership } = getStakingLedger(activeAddress)
  const { active } = getTransferOptions(activeAddress).pool

  const getCreateDisabled = () => {
    if (!isReady || isReadOnlyAccount(activeAddress) || !activeAddress) {
      return true
    }
    if ((maxPools && maxPools === 0) || bondedPools.length === maxPools) {
      return true
    }
    return false
  }

  let label

  const getJoinDisabled = () =>
    !isReady ||
    isReadOnlyAccount(activeAddress) ||
    !activeAddress ||
    !bondedPools.length

  if (!poolMembership) {
    label = t('poolMembership')
  } else if (isOwner()) {
    label = `${t('ownerOfPool')} ${poolMembership.poolId}`
  } else if (active?.isGreaterThan(0)) {
    label = `${t('memberOfPool')} ${poolMembership.poolId}`
  } else {
    label = `${t('leavingPool')} ${poolMembership.poolId}`
  }
  return { label, getJoinDisabled, getCreateDisabled }
}
