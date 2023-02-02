import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useApi } from 'contexts/Api';
import { useInvest } from 'contexts/Invest';
import { useNetworkMetrics } from 'contexts/Network';
import { useTheme } from 'contexts/Themes';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { defaultThemes, networkColors } from 'theme/default';
import { humanNumber, planckBnToUnit } from 'Utils';
import { GraphWrapper } from './Wrappers';

ChartJS.register(ArcElement, Tooltip, Legend);

export const InvestGraph = () => {
  const { t } = useTranslation('pages');

  const { network } = useApi();
  const { mode } = useTheme();
  const { metrics } = useNetworkMetrics();
  const { contributedBalance, availableBalance, reservedBalance } = useInvest();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spacing: 0,
    plugins: {
      legend: {
        padding: {
          right: 20,
        },
        display: true,
        position: 'left' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          color: defaultThemes.text.primary[mode],
          font: {
            size: 12.5,
            weight: '600',
          },
        },
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
          label: (context: any) => {
            return `${
              context.parsed === -1 ? 0 : humanNumber(context.parsed)
            }$`;
          },
        },
      },
    },
    cutout: '65%',
  };
  const _colors = [
    networkColors[`${network.name}-${mode}`],
    defaultThemes.graphs.colors[0][mode],
    defaultThemes.graphs.colors[1][mode],
  ];
  const data = {
    labels: [
      t('investors.contributed'),
      t('investors.reserved'),
      t('investors.withdrawable'),
    ],
    datasets: [
      {
        label: 'FST',
        data: [
          planckBnToUnit(contributedBalance, metrics.decimals),
          planckBnToUnit(reservedBalance, metrics.decimals),
          planckBnToUnit(availableBalance, metrics.decimals),
        ],
        backgroundColor: _colors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <GraphWrapper
      transparent
      noMargin
      style={{ border: 'none', boxShadow: 'none' }}
    >
      <div
        className="graph"
        style={{ flex: 0, paddingRight: '1rem', height: 160 }}
      >
        <Doughnut options={options} data={data} />
      </div>
    </GraphWrapper>
  );
};
