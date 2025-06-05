// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { maxBigInt, planckToUnit, unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Warning } from '../Warning'
import type { BondFeedbackProps } from '../types'
import { BondInput } from './BondInput'

export const BondFeedback = ({
  bondFor,
  inSetup = false,
  joiningPool = false,
  parentErrors = [],
  setters = [],
  listenIsValid,
  disableTxFeeUpdate = false,
  defaultBond,
  txFees,
  maxWidth,
  syncing = false,
  displayFirstWarningOnly = true,
}: BondFeedbackProps) => {
  const { t } = useTranslation('app')
  const { network } = useNetwork()
  const { isDepositor } = useActivePool()
  const { activeAddress } = useActiveAccounts()
  const {
    poolsConfig: { minJoinBond, minCreateBond },
    stakingMetrics: { minNominatorBond },
  } = useApi()
  const { unit, units } = getStakingChainData(network)
  const { getTransferOptions } = useTransferOptions()
  const allTransferOptions = getTransferOptions(activeAddress)

  const defaultBondStr = defaultBond ? String(defaultBond) : ''

  // get bond options for either staking or pooling.
  const availableBalance =
    bondFor === 'nominator'
      ? allTransferOptions.nominate.totalAdditionalBond
      : allTransferOptions.transferrableBalance

  // the default bond balance. If we are bonding, subtract tx fees from bond amount.
  const freeToBond = !disableTxFeeUpdate
    ? maxBigInt(availableBalance - txFees, 0n)
    : availableBalance

  // store errors
  const [errors, setErrors] = useState<string[]>([])

  // local bond state
  const [bond, setBond] = useState<{ bond: string }>({
    bond: defaultBondStr,
  })

  // handler to set bond as a string
  const handleSetBond = (newBond: { bond: BigNumber }) => {
    setBond({ bond: newBond.bond.toString() })
  }

  // current bond planck value
  const bondBigInt = unitToPlanck(bond.bond, units)

  // whether bond is disabled
  const [bondDisabled, setBondDisabled] = useState<boolean>(false)

  // bond minus tx fees if too much
  const enoughToCoverTxFees = freeToBond - bondBigInt > txFees

  const bondAfterTxFees = enoughToCoverTxFees
    ? bondBigInt
    : maxBigInt(bondBigInt - txFees, 0n)

  // add this component's setBond to setters
  setters.push(handleSetBond)

  // bond amount to minimum threshold.
  const minBond =
    bondFor === 'pool'
      ? inSetup || isDepositor()
        ? minCreateBond
        : minJoinBond
      : minNominatorBond

  const minBondUnit = new BigNumber(planckToUnit(minBond, units))

  // handle error updates
  const handleErrors = () => {
    let disabled = false
    const newErrors = parentErrors
    const decimals = bond.bond.toString().split('.')[1]?.length ?? 0

    // bond errors
    if (freeToBond === 0n) {
      disabled = true
      newErrors.push(`${t('noFree', { unit })}`)
    }

    if (inSetup || joiningPool) {
      if (freeToBond < minBond) {
        disabled = true
        newErrors.push(`${t('notMeet')} ${minBondUnit} ${unit}.`)
      }
      // bond amount must be more than minimum required bond
      if (bond.bond !== '' && bondBigInt < minBond) {
        newErrors.push(`${t('atLeast')} ${minBondUnit} ${unit}.`)
      }
    }

    // bond amount must not surpass freeBalalance
    if (bondBigInt > freeToBond) {
      newErrors.push(t('moreThanBalance'))
    }

    // bond amount must not be smaller than 1 planck
    if (bond.bond !== '' && bondBigInt < 1) {
      newErrors.push(t('tooSmall'))
    }

    // check bond after transaction fees is still valid
    if (bond.bond !== '' && bondAfterTxFees < 0n) {
      newErrors.push(`${t('notEnoughAfter', { unit })}`)
    }

    // bond amount must not surpass network supported units
    if (decimals > units) {
      newErrors.push(`${t('bondDecimalsError', { units })}`)
    }

    const bondValid = !newErrors.length && bond.bond !== ''
    setBondDisabled(disabled)

    if (listenIsValid && typeof listenIsValid === 'function') {
      listenIsValid(bondValid, newErrors)
    }

    setErrors(newErrors)
  }

  // If `displayFirstWarningOnly` is set, filter errors to only the first one.
  const filteredErrors =
    displayFirstWarningOnly && errors.length > 1 ? [errors[0]] : errors

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: defaultBondStr,
    })
  }, [activeAddress])

  // handle errors on input change
  useEffect(() => {
    handleErrors()
  }, [bond, txFees])

  // update max bond after txFee sync
  useEffect(() => {
    if (!disableTxFeeUpdate) {
      if (bondBigInt > freeToBond) {
        setBond({ bond: planckToUnit(freeToBond, units) })
      }
    }
  }, [txFees])

  return (
    <>
      {filteredErrors.map((err, i) => (
        <Warning key={`setup_error_${i}`} text={err} />
      ))}
      <div
        style={{
          width: '100%',
          maxWidth: maxWidth ? '500px' : '100%',
        }}
      >
        <BondInput
          value={String(bond.bond)}
          defaultValue={defaultBondStr}
          syncing={syncing}
          disabled={bondDisabled}
          setters={setters}
          freeToBond={new BigNumber(planckToUnit(freeToBond, units))}
          disableTxFeeUpdate={disableTxFeeUpdate}
        />
      </div>
    </>
  )
}
