// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTxMeta } from 'contexts/TxMeta'
import { getUnixTime } from 'date-fns'
import type { SubmittableExtrinsic } from 'dedot'
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { UnbondFeedback } from 'library/Form/Unbond/UnbondFeedback'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { StaticNote } from 'overlay/modals/Utils/StaticNote'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Notes, Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { timeleftAsString } from 'utils'

export const Unbond = () => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { getTxSubmission } = useTxMeta()
  const { activeAddress } = useActiveAccounts()
  const { erasToSeconds } = useErasToTimeLeft()
  const { getPendingPoolRewards } = useBalances()
  const { getSignerWarnings } = useSignerWarnings()
  const { getTransferOptions } = useTransferOptions()
  const { isDepositor, activePool } = useActivePool()
  const {
    serviceApi,
    stakingMetrics: { minNominatorBond: minNominatorBondBigInt },
  } = useApi()
  const {
    setModalStatus,
    setModalResize,
    config: { options },
  } = useOverlay().modal
  const {
    getConsts,
    poolsConfig: { minJoinBond: minJoinBondBn, minCreateBond: minCreateBondBn },
  } = useApi()

  const { bondFor } = options
  const { bondDuration } = getConsts(network)
  const { unit, units } = getStakingChainData(network)
  const pendingRewards = getPendingPoolRewards(activeAddress)

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  )

  const pendingRewardsUnit = planckToUnit(pendingRewards, units)

  const isStaking = bondFor === 'nominator'
  const isPooling = bondFor === 'pool'

  const allTransferOptions = getTransferOptions(activeAddress)
  const { active } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate

  // convert BigNumber values to number
  const freeToUnbond = new BigNumber(planckToUnit(active, units))
  const minJoinBond = new BigNumber(planckToUnit(minJoinBondBn, units))
  const minCreateBond = new BigNumber(planckToUnit(minCreateBondBn, units))
  const minNominatorBond = new BigNumber(
    planckToUnit(minNominatorBondBigInt, units)
  )

  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  })
  const [points, setPoints] = useState<bigint>(0n)

  const [bondValid, setBondValid] = useState<boolean>(false)

  // handler to set bond as a string
  const handleSetBond = async (newBond: { bond: BigNumber }) => {
    if (isPooling && activePool) {
      const balancePoints = await serviceApi.runtimeApi.balanceToPoints(
        activePool.id,
        unitToPlanck(newBond.bond.toString(), units)
      )
      setPoints(balancePoints)
    }
    setBond({ bond: newBond.bond.toString() })
  }

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([])

  // get the max amount available to unbond
  const unbondToMin = isPooling
    ? isDepositor()
      ? BigNumber.max(freeToUnbond.minus(minCreateBond), 0)
      : BigNumber.max(freeToUnbond.minus(minJoinBond), 0)
    : BigNumber.max(freeToUnbond.minus(minNominatorBond), 0)

  const getTx = () => {
    let tx: SubmittableExtrinsic | undefined
    if (!activeAddress) {
      return
    }
    const bondToSubmit = unitToPlanck(!bondValid ? 0 : bond.bond, units)
    if (isPooling) {
      tx = serviceApi.tx.poolUnbond(activeAddress, points)
    } else if (isStaking) {
      tx = serviceApi.tx.stakingUnbond(bondToSubmit)
    }
    return tx
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const fee = getTxSubmission(submitExtrinsic.uid)?.fee || 0n

  const nominatorActiveBelowMin =
    bondFor === 'nominator' && active > 0n && active < minNominatorBondBigInt

  const poolToMin = isDepositor() ? minCreateBondBn : minJoinBondBn
  const poolActiveBelowMin = bondFor === 'pool' && active < poolToMin

  // accumulate warnings.
  const warnings = getSignerWarnings(
    activeAddress,
    isStaking,
    submitExtrinsic.proxySupported
  )

  if (pendingRewards > 0 && bondFor === 'pool') {
    warnings.push(`${t('unbondingWithdraw')} ${pendingRewardsUnit} ${unit}.`)
  }
  if (nominatorActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: minNominatorBond.toFormat(),
        unit,
      })
    )
  }
  if (poolActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: planckToUnit(poolToMin, units),
        unit,
      })
    )
  }
  if (active === 0n) {
    warnings.push(t('unbondErrorNoFunds', { unit }))
  }

  // Update bond value on task change
  useEffect(() => {
    handleSetBond({ bond: unbondToMin })
  }, [freeToUnbond.toString()])

  // Modal resize on form update.
  useEffect(
    () => setModalResize(),
    [bond, feedbackErrors.length, warnings.length]
  )

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('removeBond')}</Title>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        <UnbondFeedback
          bondFor={bondFor}
          listenIsValid={(valid, errors) => {
            setBondValid(valid)
            setFeedbackErrors(errors)
          }}
          setters={[handleSetBond]}
          txFees={fee}
        />
        <Notes withPadding>
          {bondFor === 'pool' ? (
            isDepositor() ? (
              <p>
                {t('notePoolDepositorMinBond', {
                  context: 'depositor',
                  bond: minCreateBond,
                  unit,
                })}
              </p>
            ) : (
              <p>
                {t('notePoolDepositorMinBond', {
                  context: 'member',
                  bond: minJoinBond,
                  unit,
                })}
              </p>
            )
          ) : null}
          <StaticNote
            value={bondDurationFormatted}
            tKey="onceUnbonding"
            valueKey="bondDurationFormatted"
            deps={[bondDuration]}
          />
        </Notes>
      </Padding>
      <SubmitTx
        noMargin
        requiresMigratedController={isStaking}
        valid={bondValid}
        {...submitExtrinsic}
      />
    </>
  )
}
