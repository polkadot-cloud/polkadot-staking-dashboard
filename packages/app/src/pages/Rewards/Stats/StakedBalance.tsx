// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { Number } from 'library/StatCards/Number'
import { useTranslation } from 'react-i18next'
import { planckToUnitBn } from 'utils'

export const StakedBalance = () => {
  const { t } = useTranslation('pages')
  const {
    networkData: { unit, units },
  } = useNetwork()
  const { activeAccount } = useActiveAccounts()
  const { getStakedBalance } = useTransferOptions()

  // Determine the actual staked balance to display
  const stakedBalance = getStakedBalance(activeAccount)

  // Determine help key depending on if custom balance is active
  const helpKey = 'Your Balance'

  const params = {
    label: t('rewards.stakedBalance'),
    value: planckToUnitBn(stakedBalance, units).toNumber(),
    decimals: 3,
    unit: `${unit}`,
    helpKey,
  }

  return <Number {...params} />
}
