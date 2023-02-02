import { useInvest } from 'contexts/Invest';
import { useNetworkMetrics } from 'contexts/Network';
import StatBoxList from 'library/StatBoxList';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';
import { humanNumberBn } from 'Utils';

export const InvestStats = () => {
  const { t } = useTranslation('pages');
  const {
    availableBalance,
    reservedBalance,
    totalDeposit,
    contributedBalance,
  } = useInvest();
  const { metrics } = useNetworkMetrics();
  return (
    <StatBoxList>
      <Text
        label={t('investors.totalDeposit')}
        value={`$ ${humanNumberBn(totalDeposit, metrics.decimals)}`}
      />
      <Text
        label={t('investors.withdrawable')}
        value={`$ ${humanNumberBn(availableBalance, metrics.decimals)}`}
      />
      <Text
        label={t('investors.contributedBalance')}
        value={`$ ${humanNumberBn(contributedBalance, metrics.decimals)}`}
      />
      <Text
        label={t('investors.reservedBalance')}
        value={`$ ${humanNumberBn(reservedBalance, metrics.decimals)}`}
      />
    </StatBoxList>
  );
};
