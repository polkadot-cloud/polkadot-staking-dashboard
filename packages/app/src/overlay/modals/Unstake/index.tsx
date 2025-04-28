// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { getUnixTime } from 'date-fns'
import { useBatchCall } from 'hooks/useBatchCall'
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { StaticNote } from 'overlay/modals/Utils/StaticNote'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding, Title, Warnings } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { timeleftAsString } from 'utils'

export const Unstake = () => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { newBatchCall } = useBatchCall()
  const { getNominations } = useBalances()
  const { getConsts, serviceApi } = useApi()
  const { activeAddress } = useActiveAccounts()
  const { erasToSeconds } = useErasToTimeLeft()
  const { getSignerWarnings } = useSignerWarnings()
  const { getTransferOptions } = useTransferOptions()
  const { setModalStatus, setModalResize } = useOverlay().modal

  const { bondDuration } = getConsts(network)
  const { unit, units } = getNetworkData(network)
  const nominations = getNominations(activeAddress)
  const allTransferOptions = getTransferOptions(activeAddress)
  const { active } = allTransferOptions.nominate

  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  )

  // convert BigNumber values to number
  const freeToUnbond = new BigNumber(planckToUnit(active, units))

  // local bond value
  const [bond, setBond] = useState<{ bond: string }>({
    bond: freeToUnbond.toString(),
  })

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false)

  // unbond all validation
  const isValid = (() => freeToUnbond.isGreaterThan(0))()

  // update bond value on task change
  useEffect(() => {
    setBond({ bond: freeToUnbond.toString() })
    setBondValid(isValid)
  }, [freeToUnbond.toString(), isValid])

  // modal resize on form update
  useEffect(() => setModalResize(), [bond])

  const getTx = () => {
    if (!activeAddress) {
      return
    }
    const bondToSubmit = unitToPlanck(String(!bondValid ? 0 : bond.bond), units)
    if (bondToSubmit == 0n) {
      return serviceApi.tx.stakingChill()
    }
    const txs = [
      serviceApi.tx.stakingChill(),
      serviceApi.tx.stakingUnbond(bondToSubmit),
    ].filter((tx) => tx !== undefined)

    return newBatchCall(txs, activeAddress)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    true,
    submitExtrinsic.proxySupported
  )

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('unstake')} </Title>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        {freeToUnbond.isGreaterThan(0) ? (
          <ActionItem
            text={t('unstakeUnbond', {
              bond: freeToUnbond.toFormat(),
              unit,
            })}
          />
        ) : null}
        {nominations.length > 0 && (
          <ActionItem
            text={t('unstakeStopNominating', { count: nominations.length })}
          />
        )}
        <StaticNote
          value={bondDurationFormatted}
          tKey="onceUnbonding"
          valueKey="bondDurationFormatted"
          deps={[bondDuration]}
        />
      </Padding>
      <SubmitTx
        requiresMigratedController
        valid={bondValid}
        {...submitExtrinsic}
      />
    </>
  )
}
