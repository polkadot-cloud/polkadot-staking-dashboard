// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useApi } from 'contexts/Api';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useSubscan } from 'contexts/Subscan';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { format, fromUnixTime } from 'date-fns';
import { locales } from 'locale';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { graphColors } from 'styles/graphs';
import { AnySubscan } from 'types';
import { PayoutBarProps } from './types';
import { formatRewardsForGraphs } from './Utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutBar = ({ days, height }: PayoutBarProps) => {
  const { i18n, t } = useTranslation('library');
  const { mode } = useTheme();
  const { unit, units, colors } = useApi().network;
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { membership } = usePoolMemberships();
  const { payouts, poolClaims, unclaimedPayouts } = useSubscan();

  // remove slashes from payouts (graph does not support negative values).
  const payoutsNoSlash = payouts.filter(
    (p: AnySubscan) => p.event_id !== 'Slashed'
  );

  const unclaimedPayoutsNoSlash = unclaimedPayouts.filter(
    (p: AnySubscan) => p.event_id !== 'Slashed'
  );

  const notStaking = !isSyncing && inSetup() && !membership;
  const { payoutsByDay, poolClaimsByDay, unclaimPayoutsByDay } =
    formatRewardsForGraphs(
      days,
      units,
      payoutsNoSlash,
      poolClaims,
      unclaimedPayoutsNoSlash
    );

  // determine color for payouts
  const colorPayouts = notStaking
    ? colors.transparent[mode]
    : colors.primary[mode];

  // determine color for poolClaims
  const colorPoolClaims = notStaking
    ? colors.transparent[mode]
    : colors.secondary[mode];

  const data = {
    labels: payoutsByDay.map((item: AnySubscan) => {
      const dateObj = format(fromUnixTime(item.block_timestamp), 'do MMM', {
        locale: locales[i18n.resolvedLanguage],
      });
      return `${dateObj}`;
    }),
    datasets: [
      {
        order: 1,
        label: t('payout'),
        data: payoutsByDay.map((item: AnySubscan) => item.amount),
        borderColor: colorPayouts,
        backgroundColor: colorPayouts,
        pointRadius: 0,
        borderRadius: 3,
      },
      {
        order: 2,
        label: t('poolClaim'),
        data: poolClaimsByDay.map((item: AnySubscan) => item.amount),
        borderColor: colorPoolClaims,
        backgroundColor: colorPoolClaims,
        pointRadius: 0,
        borderRadius: 3,
      },
      {
        order: 3,
        label: t('unclaimedPayouts'),
        data: unclaimPayoutsByDay.map((item: AnySubscan) => item.amount),
        borderColor: colorPayouts,
        backgroundColor: colors.pending[mode],
        pointRadius: 0,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.4,
    maxBarThickness: 13,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        },
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
        grid: {
          color: graphColors.grid[mode],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: graphColors.tooltip[mode],
        titleColor: graphColors.label[mode],
        bodyColor: graphColors.label[mode],
        bodyFont: {
          weight: '600',
        },
        callbacks: {
          title: () => [],
          label: (context: any) =>
            `${
              context.dataset.order === 3 ? `${t('pending')}: ` : ''
            }${new BigNumber(context.parsed.y)
              .decimalPlaces(units)
              .toFormat()} ${unit}`,
        },
      },
    },
  };

  return (
    <div
      style={{
        height: height || 'auto',
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
};
