// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGear, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useStaking } from 'contexts/Staking'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSyncing } from 'hooks/useSyncing'
import { useUnstaking } from 'hooks/useUnstaking'
import { useOverlay } from 'kits/Overlay/Provider'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'

export const PayoutDestinationStatus = () => {
  const { t } = useTranslation('pages')
  const { getPayee } = useBalances()
  const { syncing } = useSyncing()
  const { inSetup } = useStaking()
  const { openModal } = useOverlay().modal
  const { isFastUnstaking } = useUnstaking()
  const { getPayeeItems } = usePayeeConfig()
  const { activeAccount } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()

  const payee = getPayee(activeAccount)

  // Get payee status text to display.
  const getPayeeStatus = () => {
    if (inSetup()) {
      return t('nominate.notAssigned')
    }
    const status = getPayeeItems(true).find(
      ({ value }) => value === payee.destination
    )?.activeTitle

    if (status) {
      return status
    }
    return t('nominate.notAssigned')
  }

  // Get the payee destination icon to display, falling back to wallet icon.
  const payeeIcon = inSetup()
    ? undefined
    : getPayeeItems(true).find(({ value }) => value === payee.destination)
        ?.icon || faWallet

  return (
    <Stat
      label={t('nominate.payoutDestination')}
      helpKey="Payout Destination"
      icon={payeeIcon}
      stat={getPayeeStatus()}
      buttons={
        !inSetup()
          ? [
              {
                title: t('nominate.update'),
                icon: faGear,
                small: true,
                disabled:
                  syncing ||
                  inSetup() ||
                  isReadOnlyAccount(activeAccount) ||
                  isFastUnstaking,
                onClick: () => openModal({ key: 'UpdatePayee', size: 'sm' }),
              },
            ]
          : []
      }
    />
  )
}
