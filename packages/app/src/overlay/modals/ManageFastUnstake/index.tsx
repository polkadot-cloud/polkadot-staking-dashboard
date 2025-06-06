// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTxMeta } from 'contexts/TxMeta'
import type { SubmittableExtrinsic } from 'dedot'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { useUnstaking } from 'hooks/useUnstaking'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Notes, Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const ManageFastUnstake = () => {
  const { t } = useTranslation('modals')
  const {
    getConsts,
    activeEra,
    serviceApi,
    stakingMetrics: { erasToCheckPerBlock },
  } = useApi()
  const { network } = useNetwork()
  const { getTxSubmission } = useTxMeta()
  const { isFastUnstaking } = useUnstaking()
  const { activeAddress } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { setModalResize, setModalStatus } = useOverlay().modal
  const { feeReserve, getTransferOptions } = useTransferOptions()
  const { counterForQueue, queueDeposit, fastUnstakeStatus, exposed } =
    useFastUnstake()

  const { unit, units } = getStakingChainData(network)
  const { bondDuration, fastUnstakeDeposit } = getConsts(network)
  const allTransferOptions = getTransferOptions(activeAddress)
  const { nominate, transferrableBalance } = allTransferOptions
  const { totalUnlockChunks } = nominate
  const enoughForDeposit = transferrableBalance >= fastUnstakeDeposit

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  useEffect(() => {
    setValid(
      erasToCheckPerBlock > 0 &&
        ((!isFastUnstaking &&
          enoughForDeposit &&
          fastUnstakeStatus?.status === 'NOT_EXPOSED' &&
          totalUnlockChunks === 0) ||
          isFastUnstaking)
    )
  }, [
    fastUnstakeStatus?.status,
    erasToCheckPerBlock,
    totalUnlockChunks,
    isFastUnstaking,
    fastUnstakeDeposit,
    transferrableBalance,
    feeReserve,
  ])

  useEffect(
    () => setModalResize(),
    [fastUnstakeStatus?.status, queueDeposit, isFastUnstaking]
  )

  const getTx = () => {
    let tx: SubmittableExtrinsic | undefined
    if (!valid) {
      return
    }
    if (!isFastUnstaking) {
      tx = serviceApi.tx.fastUnstakeRegister()
    } else {
      tx = serviceApi.tx.fastUnstakeDeregister()
    }
    return tx
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: valid,
    callbackInBlock: () => {
      setModalStatus('closing')
    },
  })

  const submitted = getTxSubmission(submitExtrinsic.uid)?.submitted || false

  // warnings
  const warnings = getSignerWarnings(
    activeAddress,
    true,
    submitExtrinsic.proxySupported
  )

  if (!isFastUnstaking) {
    if (!enoughForDeposit) {
      warnings.push(
        `${t('noEnough')} ${planckToUnit(
          fastUnstakeDeposit,
          units
        ).toString()} ${unit}`
      )
    }

    if (totalUnlockChunks > 0) {
      warnings.push(
        `${t('fastUnstakeWarningUnlocksActive', {
          count: totalUnlockChunks,
        })} ${t('fastUnstakeWarningUnlocksActiveMore')}`
      )
    }
  }

  // manage last exposed
  const lastExposedAgo =
    !exposed || !fastUnstakeStatus?.lastExposed
      ? 0
      : activeEra.index - fastUnstakeStatus.lastExposed
  const erasRemaining = BigNumber.max(
    1,
    new BigNumber(bondDuration).minus(lastExposedAgo)
  )

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('fastUnstake', { context: 'title' })}</Title>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning_${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}

        {exposed ? (
          <>
            <ActionItem
              text={t('fastUnstakeExposedAgo', {
                count: lastExposedAgo,
              })}
            />
            <Notes>
              <p>
                {t('fastUnstakeNote1', {
                  bondDuration: bondDuration.toString(),
                })}
              </p>
              <p>
                {t('fastUnstakeNote2', { count: erasRemaining.toNumber() })}
              </p>
            </Notes>
          </>
        ) : !isFastUnstaking ? (
          <>
            <ActionItem text={t('fastUnstake', { context: 'register' })} />
            <Notes>
              <p>
                {t('registerFastUnstake')}{' '}
                {planckToUnit(fastUnstakeDeposit, units).toString()} {unit}.{' '}
                {t('fastUnstakeOnceRegistered')}
              </p>
              <p>
                {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue || 0}</b>
              </p>
            </Notes>
          </>
        ) : (
          <>
            <ActionItem text={t('fastUnstakeRegistered')} />
            <Notes>
              <p>
                {t('fastUnstakeCurrentQueue')}: <b>{counterForQueue || 0}</b>
              </p>
              <p>{t('fastUnstakeUnorderedNote')}</p>
            </Notes>
          </>
        )}
      </Padding>
      {!exposed ? (
        <SubmitTx
          requiresMigratedController
          valid={valid}
          submitText={
            submitted
              ? t('submitting')
              : t('fastUnstakeSubmit', {
                  context: isFastUnstaking ? 'cancel' : 'register',
                })
          }
          {...submitExtrinsic}
        />
      ) : null}
    </>
  )
}
