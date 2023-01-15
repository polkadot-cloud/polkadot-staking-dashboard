// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { Lock } from 'contexts/Balances/types';
import { useConnect } from 'contexts/Connect';
import { usePlugins } from 'contexts/Plugins';
import { useTransferOptions } from 'contexts/TransferOptions';
import usePrices from 'library/Hooks/usePrices';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import {
  humanNumber,
  planckBnToUnit,
  toFixedIfNecessary,
  usdFormatter,
} from 'Utils';
import { BalanceChartWrapper, Bar, LegendWrapper } from './Wrappers';

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
  const unlockingPools = poolBondOpions.totalUnlocking.add(
    poolBondOpions.totalUnlocked
  );

  // user's total balance
  const { free, miscFrozen } = balance;
  const totalBalance = planckBnToUnit(
    free.add(poolBondOpions.active).add(unlockingPools),
    units
  );
  // convert balance to fiat value
  const freeFiat = toFixedIfNecessary(
    Number(totalBalance * prices.lastPrice),
    2
  );

  // total funds nominating
  const nominating = planckBnToUnit(
    allTransferOptions.nominate.active
      .add(allTransferOptions.nominate.totalUnlocking)
      .add(allTransferOptions.nominate.totalUnlocked),
    units
  );
  // total funds in pool
  const inPool = planckBnToUnit(
    allTransferOptions.pool.active
      .add(allTransferOptions.pool.totalUnlocking)
      .add(allTransferOptions.pool.totalUnlocked),
    units
  );

  // check account non-staking locks
  const locks = getAccountLocks(activeAccount);
  const locksStaking = locks.find((l: Lock) => l.id.trim() === 'staking');
  const lockStakingAmount = locksStaking ? locksStaking.amount : new BN(0);

  // total funds available, including existential deposit, minus staking.
  const graphAvailable = planckBnToUnit(free.sub(lockStakingAmount), units);
  const notStaking = graphAvailable;

  // graph percentages
  const graphTotal = nominating + inPool + graphAvailable;
  const graphNominating = nominating > 0 ? nominating / (graphTotal * 0.01) : 0;
  const graphInPool = inPool > 0 ? inPool / (graphTotal * 0.01) : 0;
  const graphNotStaking =
    graphTotal > 0 ? 100 - graphNominating - graphInPool : 0;

  // available balance data
  const fundsLocked = planckBnToUnit(miscFrozen.sub(lockStakingAmount), units);
  let fundsReserved = planckBnToUnit(existentialAmount, units);
  const fundsFree =
    planckBnToUnit(allTransferOptions.freeBalance, units) - fundsLocked;

  // available balance percentages
  const graphLocked =
    fundsLocked > 0 ? fundsLocked / (graphAvailable * 0.01) : 0;
  const graphFree = fundsFree > 0 ? fundsFree / (graphAvailable * 0.01) : 0;

  // get total available balance, including reserve and locks
  if (graphAvailable < fundsReserved) {
    fundsReserved = graphAvailable;
  }

  // width threshold (percentage) to display graph values
  const WidthThreshold = 10;

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
        <LegendWrapper>
          {nominating > 0 ? (
            <h4>
              <span className="d1" /> {t('overview.nominating')}
            </h4>
          ) : null}
          {inPool > 0 ? (
            <h4>
              <span className="d2" /> {t('overview.inPool')}
            </h4>
          ) : null}
          <h4>
            <span className="d4" /> {t('overview.notStaking')}
          </h4>
        </LegendWrapper>

        <Bar>
          <div
            className="d1"
            style={{
              width: `${graphNominating.toFixed(2)}%`,
              flexGrow: !inPool && !notStaking && nominating ? 1 : 0,
            }}
          >
            {graphNominating > WidthThreshold ? (
              <span>{`${humanNumber(
                toFixedIfNecessary(nominating, 3)
              )} ${unit}`}</span>
            ) : null}
          </div>
          <div
            className="d2"
            style={{
              width: `${graphInPool.toFixed(2)}%`,
              flexGrow: !nominating && !notStaking && inPool ? 1 : 0,
            }}
          >
            {graphInPool > WidthThreshold ? (
              <span>{`${humanNumber(
                toFixedIfNecessary(inPool, 3)
              )} ${unit}`}</span>
            ) : null}
          </div>
          <div
            className="d4"
            style={{
              width: `${graphNotStaking.toFixed(2)}%`,
              flexGrow: !nominating && !inPool ? 1 : 0,
            }}
          >
            {graphNotStaking > WidthThreshold || graphNotStaking === 0 ? (
              <span>{`${humanNumber(
                toFixedIfNecessary(notStaking, 3)
              )} ${unit}`}</span>
            ) : null}
          </div>
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
            <LegendWrapper>
              <h4>
                {t('overview.free')} <OpenHelpIcon helpKey="Your Balance" />
              </h4>
            </LegendWrapper>
            <Bar>
              <div
                className="d4"
                style={{
                  width: '100%',
                }}
              >
                <span>
                  {humanNumber(toFixedIfNecessary(fundsFree, 3))} {unit}
                </span>
              </div>
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
              <LegendWrapper>
                <h4>
                  {t('overview.locked')}
                  <OpenHelpIcon helpKey="Reserve Balance" />
                </h4>
              </LegendWrapper>
              <Bar>
                <div className="d4" style={{ width: '100%' }}>
                  <span>
                    {humanNumber(toFixedIfNecessary(fundsLocked, 3))} {unit}
                  </span>
                </div>
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
              <LegendWrapper>
                <h4>
                  {t('overview.reserve')}
                  <OpenHelpIcon helpKey="Reserve Balance" />
                </h4>
              </LegendWrapper>
              <Bar>
                <div className="d4" style={{ width: '100%' }}>
                  <span>
                    {`${toFixedIfNecessary(fundsReserved, 4)} ${unit}`}
                  </span>
                </div>
              </Bar>
            </div>
          )}
        </section>
      </BalanceChartWrapper>
    </>
  );
};
