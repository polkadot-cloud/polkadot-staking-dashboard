// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils'
import { PoolBalanceToPoints } from 'api/runtimeApi/poolBalanceToPoints'
import { PoolUnbond } from 'api/tx/poolUnbond'
import { StakingUnbond } from 'api/tx/stakingUnbond'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBonded } from 'contexts/Bonded'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useTxMeta } from 'contexts/TxMeta'
import { Apis } from 'controllers/Apis'
import { getUnixTime } from 'date-fns'
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { UnbondFeedback } from 'library/Form/Unbond/UnbondFeedback'
import { Warning } from 'library/Form/Warning'
import { Close } from 'library/Modal/Close'
import { SubmitTx } from 'library/SubmitTx'
import { StaticNote } from 'overlay/modals/Utils/StaticNote'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import {
  ModalNotes,
  ModalPadding,
  ModalTitle,
  ModalWarnings,
} from 'ui-overlay/structure'
import { planckToUnitBn, timeleftAsString } from 'utils'

export const Unbond = () => {
  const { t } = useTranslation('modals')
  const {
    network,
    networkData: { units, unit },
  } = useNetwork()
  const { getTxSubmission } = useTxMeta()
  const { getBondedAccount } = useBonded()
  const { activeAccount } = useActiveAccounts()
  const { erasToSeconds } = useErasToTimeLeft()
  const { getSignerWarnings } = useSignerWarnings()
  const { getTransferOptions } = useTransferOptions()
  const { isDepositor, activePool } = useActivePool()
  const { minNominatorBond: minNominatorBondBn } = useApi().stakingMetrics
  const {
    setModalStatus,
    setModalResize,
    config: { options },
  } = useOverlay().modal
  const {
    consts,
    poolsConfig: { minJoinBond: minJoinBondBn, minCreateBond: minCreateBondBn },
  } = useApi()

  const { bondFor } = options
  const pendingRewards = activePool?.pendingRewards || 0n
  const controller = getBondedAccount(activeAccount)
  const { bondDuration } = consts

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  )

  const pendingRewardsUnit = planckToUnit(pendingRewards, units)

  const isStaking = bondFor === 'nominator'
  const isPooling = bondFor === 'pool'

  const allTransferOptions = getTransferOptions(activeAccount)
  const { active: activeBn } = isPooling
    ? allTransferOptions.pool
    : allTransferOptions.nominate

  // convert BigNumber values to number
  const freeToUnbond = planckToUnitBn(activeBn, units)
  const minJoinBond = planckToUnitBn(minJoinBondBn, units)
  const minCreateBond = planckToUnitBn(minCreateBondBn, units)
  const minNominatorBond = planckToUnitBn(minNominatorBondBn, units)

  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  })
  const [points, setPoints] = useState<bigint>(0n)

  const [bondValid, setBondValid] = useState<boolean>(false)

  // handler to set bond as a string
  const handleSetBond = async (newBond: { bond: BigNumber }) => {
    if (isPooling && activePool) {
      const balancePoints = await new PoolBalanceToPoints(
        network,
        activePool.id,
        unitToPlanck(newBond.bond.toString(), units)
      ).fetch()
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
    const api = Apis.getApi(network)
    let tx = null
    if (!api || !activeAccount) {
      return tx
    }

    const bondToSubmit = unitToPlanck(!bondValid ? 0 : bond.bond, units)
    if (isPooling) {
      tx = new PoolUnbond(network, activeAccount, points).tx()
    } else if (isStaking) {
      tx = new StakingUnbond(network, bondToSubmit).tx()
    }
    return tx
  }

  const signingAccount = isPooling ? activeAccount : controller

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const fee = getTxSubmission(submitExtrinsic.uid)?.fee || 0n

  const nominatorActiveBelowMin =
    bondFor === 'nominator' &&
    !activeBn.isZero() &&
    activeBn.isLessThan(minNominatorBondBn)

  const poolToMinBn = isDepositor() ? minCreateBondBn : minJoinBondBn
  const poolActiveBelowMin =
    bondFor === 'pool' && activeBn.isLessThan(poolToMinBn)

  // accumulate warnings.
  const warnings = getSignerWarnings(
    activeAccount,
    isStaking,
    submitExtrinsic.proxySupported
  )

  if (pendingRewards > 0 && bondFor === 'pool') {
    warnings.push(`${t('unbondingWithdraw')} ${pendingRewardsUnit} ${unit}.`)
  }
  if (nominatorActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: minNominatorBond,
        unit,
      })
    )
  }
  if (poolActiveBelowMin) {
    warnings.push(
      t('unbondErrorBelowMinimum', {
        bond: planckToUnitBn(poolToMinBn, units),
        unit,
      })
    )
  }
  if (activeBn.isZero()) {
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
      <ModalPadding>
        <ModalTitle>{t('removeBond')}</ModalTitle>
        {warnings.length > 0 ? (
          <ModalWarnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
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
        <ModalNotes withPadding>
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
        </ModalNotes>
      </ModalPadding>
      <SubmitTx
        noMargin
        fromController={isStaking}
        valid={bondValid}
        {...submitExtrinsic}
      />
    </>
  )
}
