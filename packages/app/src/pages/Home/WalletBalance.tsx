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
  // Get fee reserve from constants
  const feeReserve = 1000000000n // Default fee reserve in planck

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
  // Memoize all expensive calculations
  const balanceData = useMemo(() => {
    const total = stakingLedger?.ledger?.total || 0n

    // User's total balance
    const { free, frozen } = balance
    const freeBn = new BigNumber(free)
    const frozenBn = new BigNumber(frozen)

    // Simple calculations without pool data for now
    const totalBalance = planckToUnitBn(freeBn.plus(total), units)

    // Total funds nominating
    const nominating = planckToUnitBn(new BigNumber(total), units)

    // For simplicity, assume no pool staking for now
    const inPool = new BigNumber(0)

    // Available balance is free minus some buffer for fees
    const freeBalanceBn = planckToUnitBn(freeBn, units)
    const feeBuffer = new BigNumber(planckToUnit(feeReserve, units))
    const fundsTransferrable = BigNumber.max(freeBalanceBn.minus(feeBuffer), 0)

    // Graph percentages
    const graphTotal = nominating.plus(freeBalanceBn)
    const graphNominating =
      nominating.isGreaterThan(0) && graphTotal.isGreaterThan(0)
        ? nominating.dividedBy(graphTotal.multipliedBy(0.01))
        : new BigNumber(0)

    const graphInPool = new BigNumber(0) // No pool support for now

    const graphNotStaking = graphTotal.isGreaterThan(0)
      ? BigNumber.max(
          new BigNumber(100).minus(graphNominating).minus(graphInPool),
          0
        )
      : new BigNumber(100)

    // Available balance data
    const fundsLocked = planckToUnitBn(
      BigNumber.max(frozenBn.minus(total), 0),
      units
    )
    const fundsFree = fundsTransferrable

    // Available balance percentages
    const graphLocked =
      fundsLocked.isGreaterThan(0) && freeBalanceBn.isGreaterThan(0)
        ? fundsLocked.dividedBy(freeBalanceBn.multipliedBy(0.01))
        : new BigNumber(0)

    const graphFree =
      fundsFree.isGreaterThan(0) && freeBalanceBn.isGreaterThan(0)
        ? fundsFree.dividedBy(freeBalanceBn.multipliedBy(0.01))
        : new BigNumber(100)

    const fundsReserved = feeBuffer
    const isNominating = nominating.isGreaterThan(0)
    const isInPool = false

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
    }
  }, [stakingLedger, balance, feeReserve, units])

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
                        : feeReserve > 0n
                          ? faCheckDouble
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
