// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
import {
  defaultThemes,
  networkColors,
  networkColorsSecondary,
  networkColorsTransparent,
} from 'theme/default';
import { AnySubscan } from 'types';
import { humanNumber } from 'Utils';
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
  const { mode } = useTheme();
  const { name, unit, units } = useApi().network;
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { membership } = usePoolMemberships();
  const { payouts, poolClaims } = useSubscan();
  const { i18n, t } = useTranslation('library');

  // remove slashes from payouts (graph does not support negative values).
  const payoutsNoSlash = payouts.filter(
    (p: AnySubscan) => p.event_id !== 'Slashed'
  );

  const notStaking = !isSyncing && inSetup() && !membership;
  const average = 1;

  const { payoutsByDay, poolClaimsByDay } = formatRewardsForGraphs(
    days,
    average,
    units,
    payoutsNoSlash,
    poolClaims
  );

  // determine color for payouts
  const colorPayouts = notStaking
    ? networkColorsTransparent[`${name}-${mode}`]
    : networkColors[`${name}-${mode}`];

  // determine color for poolClaims
  const colorPoolClaims = notStaking
    ? networkColorsTransparent[`${name}-${mode}`]
    : networkColorsSecondary[`${name}-${mode}`];

  const data = {
    labels: payoutsByDay.map((item: AnySubscan) => {
      const dateObj = format(fromUnixTime(item.block_timestamp), 'do MMM', {
        locale: locales[i18n.resolvedLanguage],
      });
      return `${dateObj}`;
    }),
    datasets: [
      {
        label: t('payout'),
        data: payoutsByDay.map((item: AnySubscan) => item.amount),
        borderColor: colorPayouts,
        backgroundColor: colorPayouts,
        pointRadius: 0,
        borderRadius: 3,
      },
      {
        label: t('pool_claim'),
        data: poolClaimsByDay.map((item: AnySubscan) => item.amount),
        borderColor: colorPoolClaims,
        backgroundColor: colorPoolClaims,
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
          color: defaultThemes.graphs.grid[mode],
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
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        titleColor: defaultThemes.text.invert[mode],
        bodyColor: defaultThemes.text.invert[mode],
        bodyFont: {
          weight: '600',
        },
        callbacks: {
          title: () => [],
          label: (context: any) => `${humanNumber(context.parsed.y)} ${unit}`,
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

export default PayoutBar;
