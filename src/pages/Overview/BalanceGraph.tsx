// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import {
  usdFormatter,
  planckBnToUnit,
  humanNumber,
  toFixedIfNecessary,
} from 'Utils';
import { useSize, formatSize } from 'library/Graphs/Utils';
import {
  defaultThemes,
  networkColors,
  networkColorsSecondary,
} from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { usePrices } from 'library/Hooks/usePrices';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

export const BalanceGraph = () => {
  const { mode } = useTheme();
  const { network } = useApi();
  const { units } = network;
  const { activeAccount } = useConnect();
  const { getAccountBalance } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const balance = getAccountBalance(activeAccount);
  const { services } = useUi();
  const prices = usePrices();
  const { t } = useTranslation('common');

  const allTransferOptions = getTransferOptions(activeAccount);
  const { freeBalance } = allTransferOptions;

  const {
    freeToUnbond: staked,
    totalUnlocking,
    totalUnlocked,
  } = allTransferOptions.nominate;

  const poolBondOpions = allTransferOptions.pool;
  const unlockingPools = poolBondOpions.totalUnlocking.add(
    poolBondOpions.totalUnlocked
  );

  const unlocking = unlockingPools.add(totalUnlocked).add(totalUnlocking);

  // get user's total balance
  const { free } = balance;
  const freeBase = planckBnToUnit(
    free.add(poolBondOpions.active).add(unlockingPools),
    units
  );

  // convert balance to fiat value
  const freeFiat = toFixedIfNecessary(Number(freeBase * prices.lastPrice), 2);

  // graph data
  let graphStaked = planckBnToUnit(staked, units);
  let graphFreeToStake = planckBnToUnit(freeBalance, units);

  let graphInPool = planckBnToUnit(poolBondOpions.active, units);
  let graphUnlocking = planckBnToUnit(unlocking, units);

  let zeroBalance = false;
  if (
    graphStaked === 0 &&
    graphFreeToStake === 0 &&
    graphUnlocking === 0 &&
    graphInPool === 0
  ) {
    graphStaked = -1;
    graphUnlocking = -1;
    graphFreeToStake = -1;
    graphInPool = -1;
    zeroBalance = true;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spacing: zeroBalance ? 0 : 5,
    plugins: {
      legend: {
        display: true,
        padding: {
          right: 10,
        },
        position: 'left' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          color: defaultThemes.text.primary[mode],
          font: {
            size: 13,
            weight: '600',
          },
        },
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
        bodyFont: {
          weight: '600',
        },
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${
              context.parsed === -1 ? 0 : humanNumber(context.parsed)
            } ${network.unit}`;
          },
        },
      },
    },
    cutout: '78%',
  };

  // determine stats
  const _labels = [
    t('pages.overview.available'),
    t('pages.overview.unlocking'),
    t('pages.overview.staking'),
    t('pages.overview.in_pool'),
  ];
  const _data = [graphFreeToStake, graphUnlocking, graphStaked, graphInPool];
  const _colors = zeroBalance
    ? [
        defaultThemes.graphs.colors[1][mode],
        defaultThemes.graphs.inactive2[mode],
        defaultThemes.graphs.inactive2[mode],
        defaultThemes.graphs.inactive[mode],
      ]
    : [
        defaultThemes.graphs.colors[1][mode],
        defaultThemes.graphs.colors[0][mode],
        networkColors[`${network.name}-${mode}`],
        networkColorsSecondary[`${network.name}-${mode}`],
      ];

  // default to a greyscale 50/50 donut on zero balance
  let dataSet;
  if (zeroBalance) {
    dataSet = {
      label: network.unit,
      data: _data,
      backgroundColor: _colors,
      borderWidth: 0,
    };
  } else {
    dataSet = {
      label: network.unit,
      data: _data,
      backgroundColor: _colors,
      borderWidth: 0,
    };
  }

  const data = {
    labels: _labels,
    datasets: [dataSet],
  };

  const ref = React.useRef<HTMLDivElement>(null);
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 185);

  return (
    <>
      <div className="head">
        <h4>
          {t('pages.overview.balance')}
          <OpenHelpIcon helpKey="Your Balance" />
        </h4>
        <h2>
          <span className="amount">{humanNumber(freeBase)}</span>&nbsp;
          {network.unit}
          <span className="fiat">
            {services.includes('binance_spot') && (
              <>&nbsp;{usdFormatter.format(Number(freeFiat))}</>
            )}
          </span>
        </h2>
      </div>
      <div style={{ paddingTop: '1rem' }} />
      <div className="inner" ref={ref} style={{ minHeight }}>
        <div
          className="graph"
          style={{
            height: `${height}px`,
            width: `${width}px`,
            position: 'absolute',
          }}
        >
          <Doughnut options={options} data={data} />
        </div>
      </div>
      <div style={{ paddingTop: '1rem' }} />
    </>
  );
};

export default BalanceGraph;
