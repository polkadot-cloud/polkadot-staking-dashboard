// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FastUnstakeDeregister } from 'api/tx/fastUnstakeDeregister'
import { FastUnstakeRegister } from 'api/tx/fastUnstakeRegister'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBonded } from 'contexts/Bonded'
import { useFastUnstake } from 'contexts/FastUnstake'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTxMeta } from 'contexts/TxMeta'
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
import { planckToUnitBn } from 'utils'

export const ManageFastUnstake = () => {
  const { t } = useTranslation('modals')
  const {
    consts: { bondDuration, fastUnstakeDeposit },
    networkMetrics: { fastUnstakeErasToCheckPerBlock },
    activeEra,
  } = useApi()
  const { network } = useNetwork()
  const { getTxSubmission } = useTxMeta()
  const { getBondedAccount } = useBonded()
  const { isFastUnstaking } = useUnstaking()
  const { activeAccount } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { setModalResize, setModalStatus } = useOverlay().modal
  const { feeReserve, getTransferOptions } = useTransferOptions()
  const { counterForQueue, queueDeposit, fastUnstakeStatus, exposed } =
    useFastUnstake()

  const { unit, units } = getNetworkData(network)
  const controller = getBondedAccount(activeAccount)
  const allTransferOptions = getTransferOptions(activeAccount)
  const { nominate, transferrableBalance } = allTransferOptions
  const { totalUnlockChunks } = nominate

  const enoughForDeposit =
    transferrableBalance.isGreaterThanOrEqualTo(fastUnstakeDeposit)

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  useEffect(() => {
    setValid(
      fastUnstakeErasToCheckPerBlock > 0 &&
        ((!isFastUnstaking &&
          enoughForDeposit &&
          fastUnstakeStatus?.status === 'NOT_EXPOSED' &&
          totalUnlockChunks === 0) ||
          isFastUnstaking)
    )
  }, [
    fastUnstakeStatus?.status,
    fastUnstakeErasToCheckPerBlock,
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
    let tx = null
    if (!valid) {
      return tx
    }
    if (!isFastUnstaking) {
      tx = new FastUnstakeRegister(network).tx()
    } else {
      tx = new FastUnstakeDeregister(network).tx()
    }
    return tx
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: valid,
    callbackInBlock: () => {
      setModalStatus('closing')
    },
  })

  const submitted = getTxSubmission(submitExtrinsic.uid)?.submitted || false

  // warnings
  const warnings = getSignerWarnings(
    activeAccount,
    true,
    submitExtrinsic.proxySupported
  )

  if (!isFastUnstaking) {
    if (!enoughForDeposit) {
      warnings.push(
        `${t('noEnough')} ${planckToUnitBn(
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
      ? new BigNumber(0)
      : activeEra.index.minus(fastUnstakeStatus.lastExposed.toString())

  const erasRemaining = BigNumber.max(1, bondDuration.minus(lastExposedAgo))

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
                count: lastExposedAgo.toNumber(),
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
                {planckToUnitBn(fastUnstakeDeposit, units).toString()} {unit}.{' '}
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
          fromController
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
