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
  const { getPoolMembership } = useBalances()
  const { activeAccount } = useActiveAccounts()
  const { getTransferOptions } = useTransferOptions()
  const { isReadOnlyAccount } = useImportedAccounts()

  const membership = getPoolMembership(activeAccount)
  const { active } = getTransferOptions(activeAccount).pool

  const getCreateDisabled = () => {
    if (!isReady || isReadOnlyAccount(activeAccount) || !activeAccount) {
      return true
    }
    if (
      maxPools &&
      (maxPools.isZero() || bondedPools.length === maxPools?.toNumber())
    ) {
      return true
    }
    return false
  }

  let label

  const getJoinDisabled = () =>
    !isReady ||
    isReadOnlyAccount(activeAccount) ||
    !activeAccount ||
    !bondedPools.length

  if (!membership) {
    label = t('poolMembership')
  } else if (isOwner()) {
    label = `${t('ownerOfPool')} ${membership.poolId}`
  } else if (active?.isGreaterThan(0)) {
    label = `${t('memberOfPool')} ${membership.poolId}`
  } else {
    label = `${t('leavingPool')} ${membership.poolId}`
  }
  return { label, getJoinDisabled, getCreateDisabled }
}
