// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useStaking } from 'contexts/Staking'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { useSyncing } from 'hooks/useSyncing'
import { ActionItem } from 'library/ActionItem'
import { SubmitTx } from 'library/SubmitTx'
import { useTranslation } from 'react-i18next'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const SetController = () => {
  const { t } = useTranslation('app')
  const { serviceApi } = useApi()
  const { isBonding } = useStaking()
  const { getStakingLedger } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { setModalStatus } = useOverlay().modal
  const { syncing, accountSynced } = useSyncing()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { controllerUnmigrated } = getStakingLedger(activeAddress)

  const canDeprecateController =
    isBonding &&
    !syncing &&
    accountSynced(activeAddress) &&
    controllerUnmigrated &&
    !isReadOnlyAccount(activeAddress)

  const getTx = () => {
    if (!activeAddress || !canDeprecateController) {
      return
    }
    return serviceApi.tx.setController()
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('migrateController')}</Title>
        <ActionItem text={t('migrateToStash')} />
        <p>{t('migrateControllerDescription')}</p>
      </Padding>
      <SubmitTx requiresMigratedController valid={true} {...submitExtrinsic} />
    </>
  )
}
