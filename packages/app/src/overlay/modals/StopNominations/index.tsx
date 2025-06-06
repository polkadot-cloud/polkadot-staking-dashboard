// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useActivePool } from 'contexts/Pools/ActivePool'
import type { SubmittableExtrinsic } from 'dedot'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const StopNominations = () => {
  const { t } = useTranslation('modals')
  const { serviceApi } = useApi()
  const { getNominations } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const {
    setModalStatus,
    config: { options },
  } = useOverlay().modal
  const { activePoolNominations, isNominator, isOwner, activePool } =
    useActivePool()

  const { bondFor } = options
  const isPool = bondFor === 'pool'
  const isStaking = bondFor === 'nominator'

  const nominations =
    isPool === true
      ? activePoolNominations?.targets || []
      : getNominations(activeAddress)

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  // ensure selected key is valid
  useEffect(() => {
    setValid(nominations.length > 0)
  }, [nominations])

  // ensure roles are valid
  let isValid = nominations.length > 0
  if (isPool) {
    isValid = (isNominator() || isOwner()) ?? false
  }

  const getTx = () => {
    let tx: SubmittableExtrinsic | undefined
    if (!valid) {
      return
    }
    if (isPool) {
      tx = serviceApi.tx.poolChill(activePool?.id || 0)
    } else if (isStaking) {
      tx = serviceApi.tx.stakingChill()
    }
    return tx
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    isStaking,
    submitExtrinsic.proxySupported
  )

  if (!nominations.length) {
    warnings.push(`${t('noNominationsSet')}`)
  }

  useEffect(() => setValid(isValid), [isValid])

  return (
    <>
      <Close />
      <Padding>
        <Title>
          {t('stop')} {t('allNominations')}
        </Title>
        {warnings.length ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning_${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        <p>{t('changeNomination')}</p>
      </Padding>
      <SubmitTx
        requiresMigratedController={isStaking}
        valid={valid}
        {...submitExtrinsic}
      />
    </>
  )
}
