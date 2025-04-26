// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useTransferOptions } from 'contexts/TransferOptions'
import { getUnixTime } from 'date-fns'
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { StaticNote } from 'overlay/modals/Utils/StaticNote'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Title, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn, timeleftAsString } from 'utils'

export const LeavePool = ({
  onResize,
  onClick,
}: {
  onResize?: () => void
  onClick?: () => void
}) => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { activePool } = useActivePool()
  const { getConsts, serviceApi } = useApi()
  const { erasToSeconds } = useErasToTimeLeft()
  const { setModalStatus } = useOverlay().modal
  const { activeAddress } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { getTransferOptions } = useTransferOptions()
  const { getStakingLedger, getPendingPoolRewards } = useBalances()

  const { unit, units } = getNetworkData(network)
  const allTransferOptions = getTransferOptions(activeAddress)
  const { active: activeBn } = allTransferOptions.pool
  const { bondDuration } = getConsts(network)
  const pendingRewards = getPendingPoolRewards(activeAddress)
  const { poolMembership } = getStakingLedger(activeAddress)
  const bondDurationFormatted = timeleftAsString(
    t,
    getUnixTime(new Date()) + 1,
    erasToSeconds(bondDuration),
    true
  )
  const freeToUnbond = planckToUnitBn(activeBn, units)
  const pendingRewardsUnit = planckToUnit(pendingRewards, units)

  const [paramsValid, setParamsValid] = useState<boolean>(false)

  useEffect(() => {
    setParamsValid((poolMembership?.points || 0n) > 0 && !!activePool?.id)
  }, [freeToUnbond.toString()])

  const getTx = () => {
    if (!activeAddress || !poolMembership) {
      return
    }
    return serviceApi.tx.poolUnbond(activeAddress, poolMembership.points)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: paramsValid,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  if (pendingRewards > 0) {
    warnings.push(
      `${t('unbondingWithdraw')} ${pendingRewardsUnit.toString()} ${unit}.`
    )
  }

  return (
    <>
      <Padding>
        <Title>{t('leavePool')}</Title>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        <ActionItem
          text={`${t('unbond')} ${freeToUnbond.toString()} ${unit}`}
        />
        <StaticNote
          value={bondDurationFormatted}
          tKey="onceUnbonding"
          valueKey="bondDurationFormatted"
          deps={[bondDuration]}
        />
      </Padding>
      <SubmitTx
        valid={paramsValid}
        buttons={
          onClick
            ? [
                <ButtonSubmitInvert
                  key="button_back"
                  text={t('back')}
                  iconLeft={faChevronLeft}
                  iconTransform="shrink-1"
                  onClick={onClick}
                />,
              ]
            : undefined
        }
        onResize={onResize}
        {...submitExtrinsic}
      />
    </>
  )
}
