// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils'
import { StakingChill } from 'api/tx/stakingChill'
import { StakingUnbond } from 'api/tx/stakingUnbond'
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
import { Close } from 'library/Modal/Close'
import { SubmitTx } from 'library/SubmitTx'
import { StaticNote } from 'overlay/modals/Utils/StaticNote'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { ModalPadding, ModalWarnings } from 'ui-overlay/structure'
import { planckToUnitBn, timeleftAsString } from 'utils'

export const Unstake = () => {
  const { t } = useTranslation('modals')
  const {
    network,
    networkData: { units, unit },
  } = useNetwork()
  const { consts } = useApi()
  const { newBatchCall } = useBatchCall()
  const { getBondedAccount } = useBonded()
  const { getNominations } = useBalances()
  const { activeAccount } = useActiveAccounts()
  const { erasToSeconds } = useErasToTimeLeft()
  const { getSignerWarnings } = useSignerWarnings()
  const { getTransferOptions } = useTransferOptions()
  const { setModalStatus, setModalResize } = useOverlay().modal

  const controller = getBondedAccount(activeAccount)
  const nominations = getNominations(activeAccount)
  const { bondDuration } = consts
  const allTransferOptions = getTransferOptions(activeAccount)
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
    if (!activeAccount) {
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
    activeAccount,
    true,
    submitExtrinsic.proxySupported
  )

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded">{t('unstake')} </h2>
        {warnings.length > 0 ? (
          <ModalWarnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
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
      </ModalPadding>
      <SubmitTx fromController valid={bondValid} {...submitExtrinsic} />
    </>
  )
}
