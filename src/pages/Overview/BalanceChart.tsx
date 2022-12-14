// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { Lock } from 'contexts/Balances/types';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import usePrices from 'library/Hooks/usePrices';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import {
  humanNumber,
  planckBnToUnit,
  toFixedIfNecessary,
  usdFormatter,
} from 'Utils';
import { Separator } from 'Wrappers';
import { BalanceChartWrapper } from './Wrappers';

export const BalanceChart = () => {
  const { t } = useTranslation('pages');
  const {
    network: { units, unit, name },
  } = useApi();
  const prices = usePrices();
  const { services } = useUi();
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

  // total funds not staking

  // check account non-staking locks
  const locks = getAccountLocks(activeAccount);
  const locksStaking = locks.find((l: Lock) => l.id.trim() === 'staking');
  const lockStakingAmount = locksStaking ? locksStaking.amount : new BN(0);

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
            {services.includes('binance_spot') && (
              <>&nbsp;{usdFormatter.format(Number(freeFiat))}</>
            )}
          </span>
        </h2>
      </div>
      <BalanceChartWrapper>
        <div className="legend">
          {nominating > 0 ? (
            <section>
              <h4 className="l">
                <span className="d1" /> {t('overview.nominating')}
              </h4>
            </section>
          ) : null}
          {inPool > 0 ? (
            <section>
              <h4 className="l">
                <span className="d2" /> {t('overview.inPool')}
              </h4>
            </section>
          ) : null}
          <section>
            <h4 className="l">
              <span className="d4" /> {t('overview.notStaking')}
            </h4>
          </section>
        </div>
        <div className="chart main">
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
        </div>
        <div className="available">
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
            <div className="l heading">
              <div>
                {t('overview.free')} <OpenHelpIcon helpKey="Your Balance" />
              </div>
            </div>
            <div className="chart">
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
            </div>
          </div>
          {fundsLocked > 0 ? (
            <div
              style={{
                flex: 1,
                minWidth: '8.5rem',
                flexBasis: `${graphLocked.toFixed(2)}%`,
              }}
            >
              <div className="l heading">
                <div>
                  {t('overview.locked')}
                  <OpenHelpIcon helpKey="Reserve Balance" />
                </div>
              </div>
              <div className="chart">
                <div className="d4" style={{ width: '100%' }}>
                  <span>
                    {humanNumber(toFixedIfNecessary(fundsLocked, 3))} {unit}
                  </span>
                </div>
              </div>
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
              <div className="l heading">
                <div>
                  {t('overview.reserve')}
                  <OpenHelpIcon helpKey="Reserve Balance" />
                </div>
              </div>
              <div className="chart">
                <div className="d4" style={{ width: '100%' }}>
                  <span>
                    {`${toFixedIfNecessary(fundsReserved, 4)} ${unit}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="more">
          <Separator />
          <h4>
            {t('overview.moreResources')}
            <OpenHelpIcon helpKey="Reserve Balance" />
          </h4>

          <section>
            <div>
              <ButtonInvertRounded
                onClick={() =>
                  window.open(
                    `https://${name.toLowerCase()}.subscan.io/account/${activeAccount}`,
                    '_blank'
                  )
                }
                lg
                iconRight={faExternalLinkAlt}
                iconTransform="shrink-2"
                text="Subscan"
              />
            </div>
          </section>
        </div>
      </BalanceChartWrapper>
    </>
  );
};
