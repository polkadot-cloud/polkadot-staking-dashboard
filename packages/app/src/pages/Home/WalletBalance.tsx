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
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'
import { ButtonTertiary } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const WalletBalanceInner = () => {
  const { t } = useTranslation('pages')
  const { network } = useNetwork()
  const { currency } = useCurrency()
  const { openModal } = useOverlay().modal
  const { getStakingLedger } = useBalances()
  const { getAccountBalance } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { syncing } = useSyncing(['initialization'])
  const { accountHasSigner } = useImportedAccounts()
  const { feeReserve, getTransferOptions } = useTransferOptions()

  // Memoize network-specific data
  const { unit, units, Token } = useMemo(() => {
    const chainData = getStakingChainData(network)
    const chainIcons = getChainIcons(network)
    return {
      unit: chainData.unit,
      units: chainData.units,
      Token: chainIcons.token,
    }
  }, [network])

  // Get account data
  const stakingLedger = useMemo(
    () => getStakingLedger(activeAddress),
    [activeAddress, getStakingLedger]
  )
  const balance = useMemo(
    () => getAccountBalance(activeAddress).balance,
    [activeAddress, getAccountBalance]
  )
  const allTransferOptions = useMemo(
    () => getTransferOptions(activeAddress),
    [activeAddress, getTransferOptions]
  )

  // Memoize all expensive calculations
  const balanceData = useMemo(() => {
    const active = stakingLedger?.ledger?.active || 0n
    const total = stakingLedger?.ledger?.total || 0n
    const poolBondOpions = allTransferOptions.pool
    const unlockingPools =
      poolBondOpions.totalUnlocking + poolBondOpions.totalUnlocked

    // User's total balance
    const { free, frozen, reserved } = balance
    const freeBn = new BigNumber(free)
    const frozenBn = new BigNumber(frozen)
    const reservedBn = new BigNumber(reserved)

    const totalBalance = planckToUnitBn(
      freeBn.plus(total).plus(poolBondOpions.active).plus(unlockingPools),
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

    const graphTotal = nominating.plus(inPool).plus(freeBalanceBn)
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
    const fundsTransferrable = new BigNumber(
      planckToUnit(allTransferOptions.transferrableBalance, units)
    )

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
    const isInPool = new BigNumber(poolBondOpions.active)
      .plus(poolBondOpions.totalUnlocked)
      .plus(poolBondOpions.totalUnlocking)
      .isGreaterThan(0)

    return {
      totalBalance,
      nominating,
      inPool,
      freeBalanceBn,
      graphNominating,
      graphInPool,
      graphNotStaking,
      fundsLocked,
      fundsTransferrable,
      fundsReserved,
      graphLocked,
      graphFree,
      isNominating,
      isInPool,
      poolBondOpions,
    }
  }, [stakingLedger, balance, allTransferOptions, feeReserve, units])

  return (
    <>
      <CardHeader>
        <h4>{t('walletBalance')}</h4>
        <HeaderActions>
          <Balance.WithFiat
            Token={<Token />}
            value={balanceData.totalBalance.toNumber()}
            currency={currency}
          />
        </HeaderActions>
      </CardHeader>
      <BarChartWrapper>
        <Legend>
          {balanceData.isNominating ? (
            <LegendItem dataClass="d1" label={t('nominating')} />
          ) : null}
          {balanceData.inPool.isGreaterThan(0) ? (
            <LegendItem dataClass="d2" label={t('inPool')} />
          ) : null}
          <LegendItem dataClass="d4" label={t('notStaking')} />
        </Legend>
        <Bar>
          <BarSegment
            dataClass="d1"
            widthPercent={Number(balanceData.graphNominating.toFixed(2))}
            flexGrow={
              !balanceData.inPool &&
              !balanceData.freeBalanceBn &&
              balanceData.isNominating
                ? 1
                : 0
            }
            label={`${balanceData.nominating.decimalPlaces(3).toFormat()} ${unit}`}
          />
          <BarSegment
            dataClass="d2"
            widthPercent={Number(balanceData.graphInPool.toFixed(2))}
            flexGrow={
              !balanceData.isNominating &&
              !balanceData.freeBalanceBn &&
              balanceData.inPool
                ? 1
                : 0
            }
            label={`${balanceData.inPool.decimalPlaces(3).toFormat()} ${unit}`}
          />
          <BarSegment
            dataClass="d4"
            widthPercent={Number(balanceData.graphNotStaking.toFixed(2))}
            flexGrow={!balanceData.isNominating && !balanceData.inPool ? 1 : 0}
            label={`${balanceData.freeBalanceBn.decimalPlaces(3).toFormat()} ${unit}`}
            forceShow={!balanceData.isNominating && !balanceData.isInPool}
          />
        </Bar>
        <section className="available">
          <div
            style={{
              flex: 1,
              minWidth: '8.5rem',
              flexBasis: `${
                balanceData.graphFree.isGreaterThan(0) &&
                balanceData.graphLocked.isGreaterThan(0)
                  ? `${balanceData.graphFree.toFixed(2)}%`
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
                label={`${balanceData.fundsTransferrable.decimalPlaces(3).toFormat()} ${unit}`}
              />
            </Bar>
          </div>
          {balanceData.fundsLocked.isGreaterThan(0) ? (
            <div
              style={{
                flex: 1,
                minWidth: '8.5rem',
                flexBasis: `${balanceData.graphLocked.toFixed(2)}%`,
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
                  label={`${balanceData.fundsLocked.decimalPlaces(3).toFormat()} ${unit}`}
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
                label={`${balanceData.fundsReserved.decimalPlaces(3).toFormat()} ${unit}`}
              />
            </Bar>
          </div>
        </section>
      </BarChartWrapper>
    </>
  )
}

export const WalletBalance = memo(WalletBalanceInner)
