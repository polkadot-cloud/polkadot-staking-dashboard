// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { PoolBondExtra } from 'api/tx/poolBondExtra'
import { PoolClaimPayout } from 'api/tx/poolClaimPayout'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const ClaimReward = () => {
  const { t } = useTranslation('modals')
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal
  const { network } = useNetwork()
  const { activePool } = useActivePool()
  const { activeAccount } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { unit, units } = getNetworkData(network)
  const { claimType } = options
  const pendingRewards = activePool?.pendingRewards || 0n

  // ensure selected payout is valid
  useEffect(() => {
    if (pendingRewards > 0) {
      setValid(true)
    } else {
      setValid(false)
    }
  }, [activePool])

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  const getTx = () => {
    let tx = null

    if (claimType === 'bond') {
      tx = new PoolBondExtra(network, 'Rewards').tx()
    } else {
      tx = new PoolClaimPayout(network).tx()
    }
    return tx
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  )

  if (pendingRewards === 0n) {
    warnings.push(`${t('noRewards')}`)
  }

  useEffect(() => setModalResize(), [warnings.length])

  return (
    <>
      <Close />
      <Padding>
        <Title>
          {claimType === 'bond' ? t('compound') : t('withdraw')} {t('rewards')}
        </Title>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        <ActionItem
          text={`${t('claim')} ${`${planckToUnit(
            pendingRewards.toString(),
            units
          )} ${unit}`}`}
        />
        {claimType === 'bond' ? (
          <p>{t('claimReward1')}</p>
        ) : (
          <p>{t('claimReward2')}</p>
        )}
      </Padding>
      <SubmitTx valid={valid} {...submitExtrinsic} />
    </>
  )
}
