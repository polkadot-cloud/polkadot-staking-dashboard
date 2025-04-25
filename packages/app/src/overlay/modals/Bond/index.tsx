// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils'
import { PoolBondExtra } from 'api/tx/poolBondExtra'
import { StakingBondExtra } from 'api/tx/stakingBondExtra'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const Bond = () => {
  const { t } = useTranslation('modals')
  const {
    setModalStatus,
    config: { options },
    setModalResize,
  } = useOverlay().modal
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { getPendingPoolRewards } = useBalances()
  const { getSignerWarnings } = useSignerWarnings()
  const { feeReserve, getTransferOptions } = useTransferOptions()
  const { unit, units } = getNetworkData(network)

  const { bondFor } = options
  const isStaking = bondFor === 'nominator'
  const isPooling = bondFor === 'pool'
  const { nominate, transferrableBalance } = getTransferOptions(activeAddress)

  const freeToBond = planckToUnitBn(
    (bondFor === 'nominator'
      ? nominate.totalAdditionalBond
      : transferrableBalance
    ).minus(feeReserve),
    units
  )

  const largestTxFee = useBondGreatestFee({ bondFor })
  const pendingRewards = getPendingPoolRewards(activeAddress)
  const pendingRewardsUnit = planckToUnit(pendingRewards, units)

  // local bond value.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToBond.toString(),
  })

  // bond valid.
  const [bondValid, setBondValid] = useState<boolean>(false)

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([])

  // handler to set bond as a string
  const handleSetBond = (newBond: { bond: BigNumber }) => {
    setBond({ bond: newBond.bond.toString() })
  }

  // bond minus tx fees.
  const enoughToCoverTxFees: boolean = freeToBond
    .minus(bond.bond)
    .isGreaterThan(planckToUnitBn(largestTxFee, units))

  // bond value after max tx fees have been deducated.
  let bondAfterTxFees: BigNumber

  if (enoughToCoverTxFees) {
    bondAfterTxFees = new BigNumber(unitToPlanck(bond.bond, units))
  } else {
    bondAfterTxFees = BigNumber.max(
      new BigNumber(unitToPlanck(String(bond.bond), units)).minus(largestTxFee),
      0
    )
  }

  // determine whether this is a pool or staking transaction.
  const determineTx = (bondToSubmit: BigNumber) => {
    let tx = null
    const bondAsString = !bondValid
      ? '0'
      : bondToSubmit.isNaN()
        ? '0'
        : bondToSubmit.toString()

    if (isPooling) {
      tx = new PoolBondExtra(network, 'FreeBalance', BigInt(bondAsString)).tx()
    } else if (isStaking) {
      tx = new StakingBondExtra(network, BigInt(bondAsString)).tx()
    }
    return tx
  }

  // the actual bond tx to submit
  const getTx = (bondToSubmit: BigNumber) => {
    if (!activeAddress) {
      return null
    }
    return determineTx(bondToSubmit)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(bondAfterTxFees),
    from: activeAddress,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  // update bond value on task change.
  useEffect(() => {
    handleSetBond({ bond: freeToBond })
  }, [freeToBond.toString()])

  // modal resize on form update
  useEffect(
    () => setModalResize(),
    [bond, bondValid, feedbackErrors.length, warnings.length]
  )

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('addToBond')}</Title>
        {pendingRewards > 0n && bondFor === 'pool' ? (
          <Warnings>
            <Warning
              text={`${t('bondingWithdraw')} ${pendingRewardsUnit} ${unit}.`}
            />
          </Warnings>
        ) : null}
        <BondFeedback
          syncing={largestTxFee.isZero()}
          bondFor={bondFor}
          listenIsValid={(valid, errors) => {
            setBondValid(valid)
            setFeedbackErrors(errors)
          }}
          defaultBond={null}
          setters={[handleSetBond]}
          parentErrors={warnings}
          txFees={BigInt(largestTxFee.toString())}
        />
        <p>{t('newlyBondedFunds')}</p>
      </Padding>
      <SubmitTx valid={bondValid} {...submitExtrinsic} />
    </>
  )
}
