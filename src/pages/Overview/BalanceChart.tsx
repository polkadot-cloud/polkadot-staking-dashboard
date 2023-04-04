// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/core-ui';
import BigNumber from 'bignumber.js';
import { useBalances } from 'contexts/Accounts/Balances';
import type { Lock } from 'contexts/Accounts/Balances/types';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { usePlugins } from 'contexts/Plugins';
import { useTransferOptions } from 'contexts/TransferOptions';
import { BarSegment } from 'library/BarChart/BarSegment';
import { LegendItem } from 'library/BarChart/LegendItem';
import { Bar, BarChartWrapper, Legend } from 'library/BarChart/Wrappers';
import { usePrices } from 'library/Hooks/usePrices';
import { useTranslation } from 'react-i18next';
import { greaterThanZero, planckToUnit } from 'Utils';

export const BalanceChart = () => {
  const { t } = useTranslation('pages');
  const {
    network: { units, unit },
  } = useApi();
  const prices = usePrices();
  const { plugins } = usePlugins();
  const { openHelp } = useHelp();
  const { activeAccount } = useConnect();
  const { getAccountBalance, existentialAmount, getAccountLocks } =
    useBalances();
  const { getTransferOptions } = useTransferOptions();
  const balance = getAccountBalance(activeAccount);
  const allTransferOptions = getTransferOptions(activeAccount);
  const poolBondOpions = allTransferOptions.pool;
  const unlockingPools = poolBondOpions.totalUnlocking.plus(
    poolBondOpions.totalUnlocked
  );

  // user's total balance
  const { free, miscFrozen } = balance;
  const totalBalance = planckToUnit(
    free.plus(poolBondOpions.active).plus(unlockingPools),
    units
  );
  // convert balance to fiat value
  const freeFiat = totalBalance.multipliedBy(
    new BigNumber(prices.lastPrice).decimalPlaces(2)
  );

  // total funds nominating
  const nominating = planckToUnit(
    allTransferOptions.nominate.active
      .plus(allTransferOptions.nominate.totalUnlocking)
      .plus(allTransferOptions.nominate.totalUnlocked),
    units
  );
  // total funds in pool
  const inPool = planckToUnit(
    allTransferOptions.pool.active
      .plus(allTransferOptions.pool.totalUnlocking)
      .plus(allTransferOptions.pool.totalUnlocked),
    units
  );

  // check account non-staking locks
  const locks = getAccountLocks(activeAccount);
  const locksStaking = locks.find((l: Lock) => l.id.trim() === 'staking');
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0);

  // total funds available, including existential deposit, minus staking.
  const graphAvailable = planckToUnit(free.minus(lockStakingAmount), units);
  const notStaking = graphAvailable;

  // graph percentages
  const graphTotal = nominating.plus(inPool).plus(graphAvailable);
  const graphNominating = greaterThanZero(nominating)
    ? nominating.dividedBy(graphTotal.multipliedBy(0.01))
    : new BigNumber(0);

  const graphInPool = greaterThanZero(inPool)
    ? inPool.dividedBy(graphTotal.multipliedBy(0.01))
    : new BigNumber(0);

  const graphNotStaking = greaterThanZero(graphTotal)
    ? new BigNumber(100).minus(graphNominating).minus(graphInPool)
    : new BigNumber(0);

  // available balance data
  const fundsLocked = planckToUnit(miscFrozen.minus(lockStakingAmount), units);
  let fundsReserved = planckToUnit(existentialAmount, units);
  const fundsFree = planckToUnit(allTransferOptions.freeBalance, units).minus(
    fundsLocked
  );

  // available balance percentages
  const graphLocked = greaterThanZero(fundsLocked)
    ? fundsLocked.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0);

  const graphFree = greaterThanZero(fundsFree)
    ? fundsFree.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0);

  // get total available balance, including reserve and locks
  if (graphAvailable < fundsReserved) {
    fundsReserved = graphAvailable;
  }

  // formatter for price feed.
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const isNominating = greaterThanZero(nominating);
  const isInPool = greaterThanZero(
    poolBondOpions.active
      .plus(poolBondOpions.totalUnlocked)
      .plus(poolBondOpions.totalUnlocking)
  );

  return (
    <>
      <div className="head">
        <h4>
          {t('overview.balance')}
          <ButtonHelp marginLeft onClick={() => openHelp('Your Balance')} />
        </h4>
        <h2>
          <span className="amount">{totalBalance.toFormat()}</span>&nbsp;
          {unit}
          <span className="fiat">
            {plugins.includes('binance_spot') ? (
              <>&nbsp;{usdFormatter.format(freeFiat.toNumber())}</>
            ) : null}
          </span>
        </h2>
      </div>

      <BarChartWrapper>
        <Legend>
          {isNominating ? (
            <LegendItem dataClass="d1" label={t('overview.nominating')} />
          ) : null}
          {greaterThanZero(inPool) ? (
            <LegendItem dataClass="d2" label={t('overview.inPool')} />
          ) : null}
          <LegendItem dataClass="d4" label={t('overview.notStaking')} />
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
                greaterThanZero(graphFree) && greaterThanZero(graphLocked)
                  ? `${graphFree.toFixed(2)}%`
                  : 'auto'
              }`,
            }}
          >
            <Legend>
              <LegendItem label={t('overview.free')} helpKey="Your Balance" />
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
          {greaterThanZero(fundsLocked) ? (
            <div
              style={{
                flex: 1,
                minWidth: '8.5rem',
                flexBasis: `${graphLocked.toFixed(2)}%`,
              }}
            >
              <Legend>
                <LegendItem
                  label={t('overview.locked')}
                  helpKey="Reserve Balance"
                />
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
          {greaterThanZero(fundsReserved) ? (
            <div
              style={{
                flex: 0,
                minWidth: '8.5rem',
                maxWidth: '8.5rem',
                flexBasis: '50%',
              }}
            >
              <Legend>
                <LegendItem
                  label={t('overview.reserve')}
                  helpKey="Reserve Balance"
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
          ) : null}
        </section>
      </BarChartWrapper>
    </>
  );
};
