// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils'
import { StakingChill } from 'api/tx/stakingChill'
import { StakingUnbond } from 'api/tx/stakingUnbond'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
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
import { planckToUnitBn, timeleftAsString } from 'utils'

export const Unstake = () => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { getConsts } = useApi()
  const { newBatchCall } = useBatchCall()
  const { getBondedAccount } = useBonded()
  const { getNominations } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { erasToSeconds } = useErasToTimeLeft()
  const { getSignerWarnings } = useSignerWarnings()
  const { getTransferOptions } = useTransferOptions()
  const { setModalStatus, setModalResize } = useOverlay().modal

  const { bondDuration } = getConsts(network)
  const { unit, units } = getNetworkData(network)
  const controller = getBondedAccount(activeAddress)
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
  const freeToUnbond = planckToUnitBn(active, units)

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
    const tx = null
    if (!activeAddress) {
      return tx
    }
    const bondToSubmit = unitToPlanck(String(!bondValid ? 0 : bond.bond), units)
    if (bondToSubmit == 0n) {
      return new StakingChill(network).tx()
    }
    const txs = [
      new StakingChill(network).tx(),
      new StakingUnbond(network, bondToSubmit).tx(),
    ]
    return newBatchCall(txs, controller)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
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
      <SubmitTx fromController valid={bondValid} {...submitExtrinsic} />
    </>
  )
}
