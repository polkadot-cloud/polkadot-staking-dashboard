// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { Notifications } from 'controllers/Notifications'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useAccountFromUrl = () => {
  const { t } = useTranslation()
  const { accounts } = useImportedAccounts()
  const { accountsInitialised } = useOtherAccounts()
  const { activeAccount, setActiveAccount } = useActiveAccounts()

  // Set active account if url var present and accounts initialised
  useEffect(() => {
    if (accountsInitialised) {
      const aUrl = extractUrlValue('a')
      if (aUrl) {
        const account = accounts.find((a) => a.address === aUrl)
        if (account && aUrl !== activeAccount) {
          setActiveAccount(account.address || null)

          Notifications.emit({
            title: t('accountConnected', { ns: 'library' }),
            subtitle: `${t('connectedTo', { ns: 'library' })} ${
              account.name || aUrl
            }.`,
          })
        }
      }
    }
  }, [accountsInitialised])
}
