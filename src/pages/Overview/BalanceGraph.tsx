// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { usePools } from 'contexts/Pools';
import { useApi } from '../../contexts/Api';
import { useUi } from '../../contexts/UI';
import { useBalances } from '../../contexts/Balances';
import { useConnect } from '../../contexts/Connect';
import { planckToUnit, humanNumber, planckBnToUnit } from '../../Utils';
import { useSize, formatSize } from '../../library/Graphs/Utils';
import { defaultThemes } from '../../theme/default';
import { useTheme } from '../../contexts/Themes';
import { usePrices } from '../../library/Hooks/usePrices';
import { APIContextInterface } from '../../types/api';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

ChartJS.register(ArcElement, Tooltip, Legend);

export const BalanceGraph = () => {
  const { mode } = useTheme();
  const { network } = useApi() as APIContextInterface;
  const { units, features } = network;
  const { activeAccount }: any = useConnect();
  const { getAccountBalance, getBondOptions }: any = useBalances();
  const balance = getAccountBalance(activeAccount);
  const { services } = useUi();
  const prices = usePrices();
  const { freeToStake, freeToUnbond: staked }: any =
    getBondOptions(activeAccount) || {};
  const { getPoolBondOptions } = usePools();

  const poolBondOpions = getPoolBondOptions();

  let { free } = balance;

  // get user's total free balance
  const freeBase = planckToUnit(free.toNumber(), units);
  // convert balance to fiat value
  const freeBalance = Number(freeBase * prices.lastPrice).toFixed(2);
  // get user's pool balance
  const poolBalance = planckBnToUnit(poolBondOpions.active, units);

  // convert to currency unit
  free = planckToUnit(free.toNumber(), units);

  // graph data
  let graphStaked = staked;
  let graphFreeToStake = freeToStake;
  let graphInPool = poolBalance;

  let zeroBalance = false;
  if (graphStaked === 0 && graphFreeToStake === 0) {
    graphStaked = -1;
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
            size: 15,
            weight: '500',
          },
        },
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        bodyColor: defaultThemes.text.invert[mode],
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${
              context.parsed === -1 ? 0 : context.parsed
            } ${network.unit}`;
          },
        },
      },
    },
    cutout: '76%',
  };

  // determine stats from network features
  let _labels = ['Available', 'Staking', 'In Pool'];
  let _data = [graphFreeToStake, graphStaked, graphInPool];
  let _colors = zeroBalance
    ? [
        defaultThemes.graphs.colors[2][mode],
        defaultThemes.graphs.inactive2[mode],
        defaultThemes.graphs.inactive[mode],
      ]
    : [
        defaultThemes.graphs.colors[2][mode],
        defaultThemes.graphs.colors[0][mode],
        defaultThemes.graphs.colors[3][mode],
      ];
  _data = features.pools ? _data : _data.slice(0, 2);
  _colors = features.pools ? _colors : _colors.slice(0, 2);
  _labels = features.pools ? _labels : _labels.slice(0, 2);

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

  const ref: any = React.useRef();
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 240);

  return (
    <>
      <div className="head" style={{ paddingTop: '0' }}>
        <h4>
          Balance
          <OpenAssistantIcon page="overview" title="Your Balance" />
        </h4>
        <h2>
          <span className="amount">{freeBase}</span>&nbsp;{network.unit}
          <span className="fiat">
            {services.includes('binance_spot') && (
              <>&nbsp;${humanNumber(Number(freeBalance))}</>
            )}
          </span>
        </h2>
      </div>
      <div style={{ paddingTop: '20px' }} />
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
      <div style={{ paddingTop: '25px' }} />
    </>
  );
};

export default BalanceGraph;
