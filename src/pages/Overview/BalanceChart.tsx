// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { ButtonTertiary, Odometer } from '@polkadot-cloud/react';
import {
  greaterThanZero,
  minDecimalPlaces,
  planckToUnit,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useBalances } from 'contexts/Balances';
import { usePlugins } from 'contexts/Plugins';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { BarSegment } from 'library/BarChart/BarSegment';
import { LegendItem } from 'library/BarChart/LegendItem';
import { Bar, BarChartWrapper, Legend } from 'library/BarChart/Wrappers';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { usePrices } from 'library/Hooks/usePrices';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const BalanceChart = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: {
      units,
      unit,
      brand: { token: Token },
    },
  } = useNetwork();
  const prices = usePrices();
  const { plugins } = usePlugins();
  const { isNetworkSyncing } = useUi();
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { accountHasSigner } = useImportedAccounts();
  const { getBalance, getLocks } = useBalances();
  const { feeReserve, getTransferOptions } = useTransferOptions();

  const balance = getBalance(activeAccount);
  const allTransferOptions = getTransferOptions(activeAccount);
  const { edReserved } = allTransferOptions;
  const poolBondOpions = allTransferOptions.pool;
  const unlockingPools = poolBondOpions.totalUnlocking.plus(
    poolBondOpions.totalUnlocked
  );

  // User's total balance.
  const { free, frozen } = balance;
  const totalBalance = planckToUnit(
    free.plus(poolBondOpions.active).plus(unlockingPools),
    units
  );
  // Convert balance to fiat value.
  const freeFiat = totalBalance.multipliedBy(
    new BigNumber(prices.lastPrice).decimalPlaces(2)
  );

  // Total funds nominating.
  const nominating = planckToUnit(
    allTransferOptions.nominate.active
      .plus(allTransferOptions.nominate.totalUnlocking)
      .plus(allTransferOptions.nominate.totalUnlocked),
    units
  );

  // Total funds in pool.
  const inPool = planckToUnit(
    allTransferOptions.pool.active
      .plus(allTransferOptions.pool.totalUnlocking)
      .plus(allTransferOptions.pool.totalUnlocked),
    units
  );

  // Check account non-staking locks.
  const { locks } = getLocks(activeAccount);
  const locksStaking = locks.find(({ id }) => id === 'staking');
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0);

  // Total funds available, including existential deposit, minus staking.
  const graphAvailable = planckToUnit(
    BigNumber.max(free.minus(lockStakingAmount), 0),
    units
  );
  const notStaking = graphAvailable;

  // Graph percentages.
  const graphTotal = nominating.plus(inPool).plus(graphAvailable);
  const graphNominating = greaterThanZero(nominating)
    ? nominating.dividedBy(graphTotal.multipliedBy(0.01))
    : new BigNumber(0);

  const graphInPool = greaterThanZero(inPool)
    ? inPool.dividedBy(graphTotal.multipliedBy(0.01))
    : new BigNumber(0);

  const graphNotStaking = greaterThanZero(graphTotal)
    ? BigNumber.max(
        new BigNumber(100).minus(graphNominating).minus(graphInPool),
        0
      )
    : new BigNumber(0);

  // Available balance data.
  const fundsLockedPlank = BigNumber.max(frozen.minus(lockStakingAmount), 0);
  const fundsLocked = planckToUnit(fundsLockedPlank, units);
  let fundsReserved = planckToUnit(edReserved.plus(feeReserve), units);

  const fundsFree = planckToUnit(
    BigNumber.max(
      allTransferOptions.freeBalance
        .minus(fundsReserved)
        .minus(fundsLockedPlank),
      0
    ),
    units
  );

  // Available balance percentages.
  const graphLocked = greaterThanZero(fundsLocked)
    ? fundsLocked.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0);

  const graphFree = greaterThanZero(fundsFree)
    ? fundsFree.dividedBy(graphAvailable.multipliedBy(0.01))
    : new BigNumber(0);

  // Total available balance, including reserve and locks
  if (graphAvailable.isLessThan(fundsReserved)) {
    fundsReserved = graphAvailable;
  }

  // Formatter for price feed.
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
      <CardHeaderWrapper>
        <h4>{t('overview.balance')}</h4>
        <h2>
          <Token className="networkIcon" />
          <Odometer
            value={minDecimalPlaces(totalBalance.toFormat(), 2)}
            zeroDecimals={2}
          />
          <span className="note">
            {plugins.includes('binance_spot') ? (
              <>&nbsp;{usdFormatter.format(freeFiat.toNumber())}</>
            ) : null}
          </span>
        </h2>
      </CardHeaderWrapper>

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
                      text={t('overview.reserveBalance')}
                      onClick={() =>
                        openModal({ key: 'UpdateReserve', size: 'sm' })
                      }
                      iconRight={
                        isNetworkSyncing
                          ? undefined
                          : !feeReserve.isZero() && !edReserved.isZero()
                            ? faCheckDouble
                            : feeReserve.isZero() && edReserved.isZero()
                              ? undefined
                              : faCheck
                      }
                      iconTransform="shrink-1"
                      disabled={
                        !activeAccount ||
                        isNetworkSyncing ||
                        !accountHasSigner(activeAccount)
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
          ) : null}
        </section>
      </BarChartWrapper>
    </>
  );
};
