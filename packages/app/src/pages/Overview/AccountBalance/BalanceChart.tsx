// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import { getChainIcons } from 'assets'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { useSyncing } from 'hooks/useSyncing'
import { Balance } from 'library/Balance'
import { BarSegment } from 'library/BarChart/BarSegment'
import { LegendItem } from 'library/BarChart/LegendItem'
import { Bar, BarChartWrapper, Legend } from 'library/BarChart/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonTertiary } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const BalanceChart = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { currency } = useCurrency()
  const { openModal } = useOverlay().modal
  const { activeAddress } = useActiveAccounts()
  const { syncing } = useSyncing(['initialization'])
  const { accountHasSigner } = useImportedAccounts()
  const { getStakingLedger, getAccountBalance } = useBalances()
  const { feeReserve, getTransferOptions } = useTransferOptions()
  const { unit, units } = getStakingChainData(network)
  const Token = getChainIcons(network).token

  const stakingLedger = getStakingLedger(activeAddress)
  const active = stakingLedger?.ledger?.active || 0n
  const total = stakingLedger?.ledger?.total || 0n

  const { balance } = getAccountBalance(activeAddress)
  const allTransferOptions = getTransferOptions(activeAddress)

  const poolBondOptions = allTransferOptions.pool
  const unlockingPools =
    poolBondOptions.totalUnlocking + poolBondOptions.totalUnlocked

  // User's total balance
  const { free, frozen, reserved } = balance
  const freeBn = new BigNumber(free)
  const frozenBn = new BigNumber(frozen)
  const reservedBn = new BigNumber(reserved)

  // freeBn excludes actively bonded funds, so add them back
  const totalBalance = planckToUnitBn(
    freeBn.plus(active).plus(poolBondOptions.active).plus(unlockingPools),
    units
  )

  // Total funds nominating
  const nominating = planckToUnitBn(new BigNumber(total), units)

  // Total funds in pool
  const inPoolPlanck = new BigNumber(allTransferOptions.pool.active)
    .plus(allTransferOptions.pool.totalUnlocking)
    .plus(allTransferOptions.pool.totalUnlocked)

  // Total locked funds (minus actively staking)
  const maxLockedBn = BigNumber.max(frozenBn, reservedBn)
    .minus(active)
    .minus(inPoolPlanck)

  const freeBalancePlanck = new BigNumber(allTransferOptions.freeBalance)

  // Graph percentages
  const inPool = planckToUnitBn(inPoolPlanck, units)
  const freeBalanceBn = planckToUnitBn(freeBalancePlanck, units)
  const fundsTransferrable = new BigNumber(
    planckToUnit(allTransferOptions.transferrableBalance, units)
  )

  const graphTotal = nominating.plus(inPool).plus(fundsTransferrable)
  const graphNominating = nominating.isGreaterThan(0)
    ? nominating.dividedBy(graphTotal.multipliedBy(0.01))
    : new BigNumber(0)

  const graphInPool = inPool.isGreaterThan(0)
    ? inPool.dividedBy(graphTotal.multipliedBy(0.01))
    : new BigNumber(0)

  const graphNotStaking = graphTotal.isGreaterThan(0)
    ? BigNumber.max(
        new BigNumber(100).minus(graphNominating).minus(graphInPool),
        0
      )
    : new BigNumber(0)

  // Available balance data.
  const fundsLocked = planckToUnitBn(maxLockedBn, units)

  const fundsFree = planckToUnitBn(freeBalancePlanck, units)

  // Available balance percentages.
  const graphLocked = fundsLocked.isGreaterThan(0)
    ? fundsLocked.dividedBy(freeBalanceBn.multipliedBy(0.01))
    : new BigNumber(0)

  const graphFree = fundsFree.isGreaterThan(0)
    ? fundsFree.dividedBy(freeBalanceBn.multipliedBy(0.01))
    : new BigNumber(0)

  // Total amount reserved for fees and existential deposit
  let fundsReserved = new BigNumber(
    planckToUnit(allTransferOptions.edReserved + feeReserve, units)
  )
  if (freeBalanceBn.isLessThan(fundsReserved)) {
    fundsReserved = freeBalanceBn
  }

  const isNominating = nominating.isGreaterThan(0)
  const isInPool = new BigNumber(poolBondOptions.active)
    .plus(poolBondOptions.totalUnlocked)
    .plus(poolBondOptions.totalUnlocking)
    .isGreaterThan(0)

  return (
    <>
      <CardHeader>
        <h4>{t('balance')}</h4>
        <Balance.WithFiat
          Token={<Token />}
          value={totalBalance.toNumber()}
          currency={currency}
        />
      </CardHeader>
      <BarChartWrapper>
        <Legend>
          {isNominating ? (
            <LegendItem dataClass="d1" label={t('nominating')} />
          ) : null}
          {inPool.isGreaterThan(0) ? (
            <LegendItem dataClass="d2" label={t('inPool')} />
          ) : null}
          <LegendItem dataClass="d4" label={t('notStaking')} />
        </Legend>
        <Bar>
          <BarSegment
            dataClass="d1"
            widthPercent={Number(graphNominating.toFixed(2))}
            flexGrow={!inPool && !fundsTransferrable && isNominating ? 1 : 0}
            label={`${nominating.decimalPlaces(3).toFormat()} ${unit}`}
          />
          <BarSegment
            dataClass="d2"
            widthPercent={Number(graphInPool.toFixed(2))}
            flexGrow={!isNominating && !fundsTransferrable && inPool ? 1 : 0}
            label={`${inPool.decimalPlaces(3).toFormat()} ${unit}`}
          />
          <BarSegment
            dataClass="d4"
            widthPercent={Number(graphNotStaking.toFixed(2))}
            flexGrow={!isNominating && !inPool ? 1 : 0}
            label={`${fundsTransferrable.decimalPlaces(3).toFormat()} ${unit}`}
            forceShow={!isNominating && !isInPool}
          />
        </Bar>
        <section className="available">
          <div
            style={{
              flex: 1,
              minWidth: '8.5rem',
              flexBasis: `${
                graphFree.isGreaterThan(0) && graphLocked.isGreaterThan(0)
                  ? `${graphFree.toFixed(2)}%`
                  : 'auto'
              }`,
            }}
          >
            <Legend>
              <LegendItem label={t('free')} />
            </Legend>
            <Bar>
              <BarSegment
                dataClass="d4"
                widthPercent={100}
                flexGrow={1}
                label={`${fundsTransferrable.decimalPlaces(3).toFormat()} ${unit}`}
              />
            </Bar>
          </div>
          {fundsLocked.isGreaterThan(0) ? (
            <div
              style={{
                flex: 1,
                minWidth: '8.5rem',
                flexBasis: `${graphLocked.toFixed(2)}%`,
              }}
            >
              <Legend>
                <LegendItem label={t('locked')} />
              </Legend>
              <Bar>
                <BarSegment
                  dataClass="d4"
                  widthPercent={100}
                  flexGrow={1}
                  label={`${fundsLocked.decimalPlaces(3).toFormat()} ${unit}`}
                />
              </Bar>
            </div>
          ) : null}
          <div
            style={{
              flex: 0,
              minWidth: '12.5rem',
              maxWidth: '12.5rem',
              flexBasis: '50%',
            }}
          >
            <Legend className="end">
              <LegendItem
                label=""
                button={
                  <ButtonTertiary
                    text={t('reserveBalance')}
                    onClick={() =>
                      openModal({ key: 'UpdateReserve', size: 'sm' })
                    }
                    iconRight={
                      syncing
                        ? undefined
                        : feeReserve > 0n &&
                            allTransferOptions.edReserved !== 0n
                          ? faCheckDouble
                          : feeReserve === 0n &&
                              allTransferOptions.edReserved === 0n
                            ? undefined
                            : faCheck
                    }
                    iconTransform="shrink-1"
                    disabled={
                      !activeAddress ||
                      syncing ||
                      !accountHasSigner(activeAddress)
                    }
                  />
                }
              />
            </Legend>
            <Bar>
              <BarSegment
                dataClass="d4"
                widthPercent={100}
                flexGrow={1}
                label={`${fundsReserved.decimalPlaces(3).toFormat()} ${unit}`}
              />
            </Bar>
          </div>
        </section>
      </BarChartWrapper>
    </>
  )
}
