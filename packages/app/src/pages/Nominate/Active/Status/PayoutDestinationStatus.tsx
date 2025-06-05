// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGear, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useStaking } from 'contexts/Staking'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'

export const PayoutDestinationStatus = () => {
  const { t } = useTranslation('pages')
  const { syncing } = useSyncing()
  const { isNominator } = useStaking()
  const { openModal } = useOverlay().modal
  const { getStakingLedger } = useBalances()
  const { isFastUnstaking } = useUnstaking()
  const { getPayeeItems } = usePayeeConfig()
  const { activeAddress } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()

  const payee = getStakingLedger(activeAddress).payee

  // Get payee status text to display.
  const getPayeeStatus = () => {
    if (!isNominator) {
      return t('notAssigned')
    }
    const status = getPayeeItems(true).find(
      ({ value }) => value === payee?.destination
    )?.activeTitle

    if (status) {
      return status
    }
    return t('notAssigned')
  }

  // Get the payee destination icon to display, falling back to wallet icon.
  const payeeIcon = !isNominator
    ? undefined
    : getPayeeItems(true).find(({ value }) => value === payee?.destination)
        ?.icon || faWallet

  return (
    <Stat
      label={t('payoutDestination')}
      helpKey="Payout Destination"
      icon={payeeIcon}
      stat={getPayeeStatus()}
      buttons={
        isNominator && !isReadOnlyAccount(activeAddress)
          ? [
              {
                title: t('update'),
                icon: faGear,
                small: true,
                disabled: syncing || !isNominator || isFastUnstaking,
                onClick: () => openModal({ key: 'UpdatePayee', size: 'sm' }),
              },
            ]
          : []
      }
    />
  )
}
