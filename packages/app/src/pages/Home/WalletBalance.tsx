// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { useTransferOptions } from 'contexts/TransferOptions'
import { Balance } from 'library/Balance'
import { BarSegment } from 'library/BarChart/BarSegment'
import { LegendItem } from 'library/BarChart/LegendItem'
import { Bar, BarChartWrapper, Legend } from 'library/BarChart/Wrappers'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'
import { planckToUnitBn } from 'utils'

export const WalletBalance = () => {
  const { t } = useTranslation('pages')
  const {
    networkData: {
      units,
      unit,
      brand: { token: Token },
    },
  } = useNetwork()
  const { currency } = useCurrency()
  const { activeAccount } = useActiveAccounts()
  const { getBalance, getLocks } = useBalances()
  const { feeReserve, getTransferOptions } = useTransferOptions()

  const balance = getBalance(activeAccount)
  const allTransferOptions = getTransferOptions(activeAccount)
  const { edReserved } = allTransferOptions
  const poolBondOpions = allTransferOptions.pool
  const unlockingPools = poolBondOpions.totalUnlocking.plus(
    poolBondOpions.totalUnlocked
  )

  // User's total balance.
  const { free, frozen } = balance
  const totalBalance = planckToUnitBn(
    free.plus(poolBondOpions.active).plus(unlockingPools),
    units
  )

  // Total funds nominating.
  const nominating = planckToUnitBn(
    allTransferOptions.nominate.active
      .plus(allTransferOptions.nominate.totalUnlocking)
      .plus(allTransferOptions.nominate.totalUnlocked),
    units
  )

  // Total funds in pool.
  const inPool = planckToUnitBn(
    allTransferOptions.pool.active
      .plus(allTransferOptions.pool.totalUnlocking)
      .plus(allTransferOptions.pool.totalUnlocked),
    units
  )

  // Check account non-staking locks.
  const { locks } = getLocks(activeAccount)
  const locksStaking = locks.find(({ id }) => id === 'staking')
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0)

  // Total funds available, including existential deposit, minus staking.
  const graphAvailable = planckToUnitBn(
    BigNumber.max(free.minus(lockStakingAmount), 0),
    units
  )
  const notStaking = graphAvailable

  // Graph percentages.
  const graphTotal = nominating.plus(inPool).plus(graphAvailable)
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
  const fundsLockedPlank = BigNumber.max(frozen.minus(lockStakingAmount), 0)
  const fundsLocked = planckToUnitBn(fundsLockedPlank, units)
  let fundsReserved = planckToUnitBn(edReserved.plus(feeReserve), units)

  const fundsFree = planckToUnitBn(
    BigNumber.max(allTransferOptions.freeBalance.minus(fundsLockedPlank), 0),
    units
  )

  // Available balance percentages.
  const graphLocked = fundsLocked.isGreaterThan(0)
    ? fundsLocked.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0)

  const graphFree = fundsFree.isGreaterThan(0)
    ? fundsFree.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0)

  // Total available balance, including reserve and locks
  if (graphAvailable.isLessThan(fundsReserved)) {
    fundsReserved = graphAvailable
  }

  const isNominating = nominating.isGreaterThan(0)
  const isInPool = poolBondOpions.active
    .plus(poolBondOpions.totalUnlocked)
    .plus(poolBondOpions.totalUnlocking)
    .isGreaterThan(0)

  return (
    <>
      <CardHeader>
        <h4>Wallet Balance</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Balance.WithFiat
            Token={<Token />}
            value={totalBalance.toNumber()}
            currency={currency}
          />
// Send logic to go here          
          <ButtonPrimary
            text={t('send')}
            disabled={!activeAccount || totalBalance.isZero()}
            onClick={() => {}}
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          />
        </div>
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
            flexGrow={!inPool && !notStaking && isNominating ? 1 : 0}
            label={`${nominating.decimalPlaces(3).toFormat()} ${unit}`}
          />
          <BarSegment
            dataClass="d2"
            widthPercent={Number(graphInPool.toFixed(2))}
            flexGrow={!isNominating && !notStaking && inPool ? 1 : 0}
            label={`${inPool.decimalPlaces(3).toFormat()} ${unit}`}
          />
          <BarSegment
            dataClass="d4"
            widthPercent={Number(graphNotStaking.toFixed(2))}
            flexGrow={!isNominating && !inPool ? 1 : 0}
            label={`${notStaking.decimalPlaces(3).toFormat()} ${unit}`}
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
              <LegendItem label={t('free')} helpKey="Your Balance" />
            </Legend>
            <Bar>
              <BarSegment
                dataClass="d4"
                widthPercent={100}
                flexGrow={1}
                label={`${fundsFree.decimalPlaces(3).toFormat()} ${unit}`}
              />
            </Bar>
          </div>
          {fundsLocked.isGreaterThan(0) ? (
            <div
              style={{
                flex: 1,
                minWidth: '8.5rem',
                flexBasis: `${
                  graphFree.isGreaterThan(0) && graphLocked.isGreaterThan(0)
                    ? `${graphLocked.toFixed(2)}%`
                    : 'auto'
                }`,
              }}
            >
              <Legend>
                <LegendItem label={t('locked')} helpKey="Locked Balance" />
              </Legend>
              <Bar>
                <BarSegment
                  dataClass="d3"
                  widthPercent={100}
                  flexGrow={1}
                  label={`${fundsLocked.decimalPlaces(3).toFormat()} ${unit}`}
                />
              </Bar>
            </div>
          ) : null}
        </section>
      </BarChartWrapper>
    </>
  )
}
