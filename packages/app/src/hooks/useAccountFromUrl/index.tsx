// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { Notifications } from 'controllers/Notifications'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useAccountFromUrl = () => {
  const { t } = useTranslation('app')
  const { accounts } = useImportedAccounts()
  const { accountsInitialised } = useOtherAccounts()
  const { activeAddress, setActiveAccount } = useActiveAccounts()

  // Set active account if url var present and accounts initialised
  useEffect(() => {
    if (accountsInitialised) {
      const val = extractUrlValue('a')
      if (val) {
        const account = accounts.find((a) => a.address === val)
        if (account && activeAddress !== val) {
          const { address, source } = account
          setActiveAccount({ address, source })

          Notifications.emit({
            title: t('accountConnected'),
            subtitle: `${t('connectedTo')} ${account.name}.`,
          })
        }
      }
    }
  }, [accountsInitialised])
}
