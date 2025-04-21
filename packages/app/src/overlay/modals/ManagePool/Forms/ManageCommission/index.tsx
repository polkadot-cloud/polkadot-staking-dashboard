// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { PoolSetCommission } from 'api/tx/poolSetCommission'
import { PoolSetCommissionChangeRate } from 'api/tx/poolSetCommissionChangeRate'
import { PoolSetCommissionMax } from 'api/tx/poolSetCommissionMax'
import { PerbillMultiplier } from 'consts'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { AccountId32 } from 'dedot/codecs'
import { useBatchCall } from 'hooks/useBatchCall'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import 'rc-slider/assets/index.css'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { ChangeRate } from './ChangeRate'
import { CommissionCurrent } from './CommissionCurrent'
import { MaxCommission } from './MaxCommission'
import { usePoolCommission } from './provider'

export const ManageCommission = ({
  setSection,
  incrementCalculateHeight,
  onResize,
}: {
  setSection: Dispatch<SetStateAction<number>>
  incrementCalculateHeight: () => void
  onResize: () => void
}) => {
  const { t } = useTranslation('modals')
  const { openHelp } = useHelp()
  const {
    poolsConfig: { globalMaxCommission },
  } = useApi()
  const {
    getInitial,
    getCurrent,
    getEnabled,
    setEnabled,
    hasValue,
    resetAll,
    isUpdated,
  } = usePoolCommission()
  const { network } = useNetwork()
  const { newBatchCall } = useBatchCall()
  const { activeAddress } = useActiveAccounts()
  const { setModalStatus } = useOverlay().modal
  const { isOwner, activePool } = useActivePool()
  const { getSignerWarnings } = useSignerWarnings()
  const { getBondedPool, updateBondedPools } = useBondedPools()

  const poolId = activePool?.id || 0
  const bondedPool = getBondedPool(poolId)

  // Get currently set commission values.
  const commission = getCurrent('commission')
  const payee = getCurrent('payee')
  const maxCommission = getCurrent('max_commission')
  const changeRate = getCurrent('change_rate')

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  // Monitor when input items change.
  const commissionUpdated: boolean = commission !== getInitial('commission')

  // Global form change.
  const noChange: boolean =
    !commissionUpdated &&
    !isUpdated('max_commission') &&
    !isUpdated('change_rate')

  // Monitor when input items are invalid.
  const commissionAboveMax: boolean =
    hasValue('max_commission') && commission > maxCommission
  const commissionAboveGlobal = commission > globalMaxCommission

  const commissionAboveMaxIncrease: boolean =
    hasValue('change_rate') &&
    commission - getInitial('commission') > changeRate.maxIncrease

  const invalidCurrentCommission: boolean =
    commissionUpdated &&
    ((commission === 0 && payee !== null) ||
      (commission !== 0 && payee === null) ||
      commissionAboveMax ||
      commissionAboveMaxIncrease ||
      commission > globalMaxCommission)

  const invalidMaxCommission: boolean =
    hasValue('max_commission') &&
    isUpdated('max_commission') &&
    maxCommission > getInitial('max_commission')

  const maxCommissionAboveGlobal: boolean =
    getEnabled('max_commission') && maxCommission > globalMaxCommission

  // Change rate is invalid if updated is not more restrictive than current.
  const invalidMaxIncrease: boolean =
    getEnabled('change_rate') &&
    isUpdated('change_rate') &&
    changeRate.maxIncrease > getInitial('change_rate').maxIncrease

  const invalidMinDelay: boolean =
    getEnabled('change_rate') &&
    isUpdated('change_rate') &&
    changeRate.minDelay < getInitial('change_rate').minDelay

  const invalidChangeRate: boolean = invalidMaxIncrease || invalidMinDelay

  const currentCommissionSet: boolean = payee && commission !== 0

  // Check there are txs to submit.
  const txsToSubmit =
    commissionUpdated ||
    (isUpdated('max_commission') && getEnabled('max_commission')) ||
    (isUpdated('change_rate') && getEnabled('change_rate'))

  const getTx = () => {
    if (!valid) {
      return null
    }
    const txs = []
    if (commissionUpdated) {
      const commissionPerbill = commission * PerbillMultiplier
      txs.push(
        new PoolSetCommission(
          network,
          poolId,
          currentCommissionSet ? [commissionPerbill, payee] : undefined
        ).tx()
      )
    }
    if (isUpdated('max_commission') && getEnabled('max_commission')) {
      const maxPerbill = maxCommission * PerbillMultiplier
      txs.push(new PoolSetCommissionMax(network, poolId, maxPerbill).tx())
    }
    if (isUpdated('change_rate') && getEnabled('change_rate')) {
      const maxIncreasePerbill = changeRate.maxIncrease * PerbillMultiplier
      txs.push(
        new PoolSetCommissionChangeRate(
          network,
          poolId,
          maxIncreasePerbill,
          changeRate.minDelay
        ).tx()
      )
    }

    if (txs.length === 1) {
      return txs[0]
    }
    return newBatchCall(txs, activeAddress)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
    callbackInBlock: () => {
      const pool = getBondedPool(poolId)
      if (pool) {
        updateBondedPools([
          {
            ...pool,
            commission: {
              ...pool.commission,
              current: currentCommissionSet
                ? [commission * PerbillMultiplier, new AccountId32(payee)]
                : undefined,
              max: isUpdated('max_commission')
                ? maxCommission * PerbillMultiplier
                : pool.commission?.max || undefined,
              changeRate: isUpdated('change_rate')
                ? {
                    maxIncrease: changeRate.maxIncrease * PerbillMultiplier,
                    minDelay: changeRate.minDelay,
                  }
                : pool.commission?.changeRate || undefined,
            },
          },
        ])
      }
    },
  })

  // Commission current meta required for form.
  const commissionCurrentMeta = {
    commissionAboveMax,
    commissionAboveGlobal,
    commissionAboveMaxIncrease,
  }

  // Max commission meta required for form.
  const maxCommissionMeta = {
    invalidMaxCommission,
    maxCommissionAboveGlobal,
  }

  // Change rate meta required for form.
  const changeRateMeta = {
    invalidMaxIncrease,
    invalidMinDelay,
  }

  // Get transaction signer warnings.
  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  // Update whether commission configs are valid on each invalid input, and when tx object changes.
  useEffect(() => {
    setValid(
      isOwner() &&
        !invalidCurrentCommission &&
        !commissionAboveGlobal &&
        !invalidMaxCommission &&
        !maxCommissionAboveGlobal &&
        !invalidChangeRate &&
        !noChange &&
        txsToSubmit
    )
  }, [
    isOwner(),
    invalidCurrentCommission,
    invalidMaxCommission,
    commissionAboveGlobal,
    maxCommissionAboveGlobal,
    invalidChangeRate,
    bondedPool,
    noChange,
    txsToSubmit,
  ])

  // Trigger modal resize when commission options are enabled / disabled.
  useEffect(() => {
    incrementCalculateHeight()
  }, [getEnabled('max_commission'), getEnabled('change_rate')])

  return (
    <>
      <Padding horizontalOnly>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}

        <ActionItem
          text={t('commissionRate')}
          inlineButton={
            <ButtonHelp onClick={() => openHelp('Pool Commission Rate')} />
          }
        />
        <CommissionCurrent {...commissionCurrentMeta} />

        <ActionItem
          style={{
            marginTop: '2rem',
            borderBottomWidth: getEnabled('max_commission') ? '1px' : 0,
          }}
          text={t('maxCommission')}
          toggled={getEnabled('max_commission')}
          onToggle={(val) => setEnabled('max_commission', val)}
          disabled={!!hasValue('max_commission')}
          inlineButton={
            <ButtonHelp onClick={() => openHelp('Pool Max Commission')} />
          }
        />
        <MaxCommission {...maxCommissionMeta} />

        <ActionItem
          style={{
            marginTop: '2rem',
            borderBottomWidth: getEnabled('change_rate') ? '1px' : 0,
          }}
          text={t('changeRate')}
          toggled={getEnabled('change_rate')}
          onToggle={(val) => setEnabled('change_rate', val)}
          disabled={!!hasValue('change_rate')}
          inlineButton={
            <ButtonHelp
              onClick={() => openHelp('Pool Commission Change Rate')}
            />
          }
        />
        <ChangeRate {...changeRateMeta} />
      </Padding>
      <SubmitTx
        valid={valid}
        buttons={[
          <ButtonSubmitInvert
            key="button_back"
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-1"
            onClick={() => {
              setSection(0)
              resetAll()
            }}
          />,
        ]}
        onResize={onResize}
        {...submitExtrinsic}
      />
    </>
  )
}
