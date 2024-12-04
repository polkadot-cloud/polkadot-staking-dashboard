// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useControllerSignerAvailable } from 'hooks/useControllerSignerAvailable'
import { useTranslation } from 'react-i18next'
import type { MaybeAddress } from 'types'

export const useSignerWarnings = () => {
  const { t } = useTranslation('modals')
  const { activeProxy } = useActiveAccounts()
  const { accountHasSigner } = useImportedAccounts()
  const { controllerSignerAvailable } = useControllerSignerAvailable()

  const getSignerWarnings = (
    account: MaybeAddress,
    controller = false,
    proxySupported = false
  ) => {
    const warnings = []

    if (controller) {
      switch (controllerSignerAvailable(account, proxySupported)) {
        case 'controller_not_imported':
          warnings.push(`${t('controllerImported')}`)
          break
        case 'read_only':
          warnings.push(`${t('readOnlyCannotSign')}`)
          break
        default:
          break
      }
    } else if (
      !(
        accountHasSigner(account) ||
        (accountHasSigner(activeProxy) && proxySupported)
      )
    ) {
      warnings.push(`${t('readOnlyCannotSign')}`)
    }

    return warnings
  }

  return { getSignerWarnings }
}
