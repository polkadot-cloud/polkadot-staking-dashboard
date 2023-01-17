// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { Lock } from 'contexts/Balances/types';
import { useConnect } from 'contexts/Connect';
import { usePlugins } from 'contexts/Plugins';
import { useTransferOptions } from 'contexts/TransferOptions';
import usePrices from 'library/Hooks/usePrices';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { humanNumber, planckToUnit, toFixedIfNecessary } from 'Utils';
import { BarSegment } from './BarSegment';
import { LegendItem } from './LegendItem';
import { BalanceChartWrapper, Bar, Legend } from './Wrappers';

export const BalanceChart = () => {
  const { t } = useTranslation('pages');
  const {
    network: { units, unit },
  } = useApi();
  const prices = usePrices();
  const { plugins } = usePlugins();
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
  const freeFiat = toFixedIfNecessary(
    Number(totalBalance * prices.lastPrice),
    2
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
  const graphTotal = nominating + inPool + graphAvailable;
  const graphNominating = nominating > 0 ? nominating / (graphTotal * 0.01) : 0;
  const graphInPool = inPool > 0 ? inPool / (graphTotal * 0.01) : 0;
  const graphNotStaking =
    graphTotal > 0 ? 100 - graphNominating - graphInPool : 0;

  // available balance data
  const fundsLocked = planckToUnit(miscFrozen.minus(lockStakingAmount), units);
  let fundsReserved = planckToUnit(existentialAmount, units);
  const fundsFree =
    planckToUnit(allTransferOptions.freeBalance, units) - fundsLocked;

  // available balance percentages
  const graphLocked =
    fundsLocked > 0 ? fundsLocked / (graphAvailable * 0.01) : 0;
  const graphFree = fundsFree > 0 ? fundsFree / (graphAvailable * 0.01) : 0;

  // get total available balance, including reserve and locks
  if (graphAvailable < fundsReserved) {
    fundsReserved = graphAvailable;
  }

  // formatter for price feed.
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <>
      <div className="head">
        <h4>
          {t('overview.balance')}
          <OpenHelpIcon helpKey="Your Balance" />
        </h4>
        <h2>
          <span className="amount">{humanNumber(totalBalance)}</span>&nbsp;
          {unit}
          <span className="fiat">
            {plugins.includes('binance_spot') && (
              <>&nbsp;{usdFormatter.format(Number(freeFiat))}</>
            )}
          </span>
        </h2>
      </div>

      <BalanceChartWrapper>
        <Legend>
          {nominating > 0 && (
            <LegendItem dataClass="d1" label={t('overview.nominating')} />
          )}
          {inPool > 0 && (
            <LegendItem dataClass="d2" label={t('overview.inPool')} />
          )}
          <LegendItem dataClass="d4" label={t('overview.notStaking')} />
        </Legend>
        <Bar>
          <BarSegment
            dataClass="d1"
            widthPercent={Number(graphNominating.toFixed(2))}
            flexGrow={!inPool && !notStaking && nominating ? 1 : 0}
            label={`${humanNumber(toFixedIfNecessary(nominating, 3))} ${unit}`}
          />
          <BarSegment
            dataClass="d2"
            widthPercent={Number(graphInPool.toFixed(2))}
            flexGrow={!nominating && !notStaking && inPool ? 1 : 0}
            label={`${humanNumber(toFixedIfNecessary(inPool, 3))} ${unit}`}
          />
          <BarSegment
            dataClass="d4"
            widthPercent={Number(graphNotStaking.toFixed(2))}
            flexGrow={!nominating && !inPool ? 1 : 0}
            label={`${humanNumber(toFixedIfNecessary(notStaking, 3))} ${unit}`}
            forceShowLabel={graphNotStaking === 0}
          />
        </Bar>
        <section className="available">
          <div
            style={{
              flex: 1,
              minWidth: '8.5rem',
              flexBasis: `${
                graphFree > 0 && graphLocked > 0
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
                label={`${humanNumber(
                  toFixedIfNecessary(fundsFree, 3)
                )} ${unit}`}
              />
            </Bar>
          </div>
          {fundsLocked > 0 ? (
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
                  label={`${humanNumber(
                    toFixedIfNecessary(fundsLocked, 3)
                  )} ${unit}`}
                />
              </Bar>
            </div>
          ) : null}
          {fundsReserved > 0 && (
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
                  label={`${humanNumber(
                    toFixedIfNecessary(fundsReserved, 3)
                  )} ${unit}`}
                />
              </Bar>
            </div>
          )}
        </section>
      </BalanceChartWrapper>
    </>
  );
};
