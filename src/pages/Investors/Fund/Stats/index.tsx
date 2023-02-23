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
  const { decimals } = useNetworkMetrics();
  return (
    <StatBoxList>
      <Text
        label={t('investors.totalDeposit')}
        value={`$ ${humanNumberBn(totalDeposit, decimals)}`}
      />
      <Text
        label={t('investors.withdrawable')}
        value={`$ ${humanNumberBn(availableBalance, decimals)}`}
      />
      <Text
        label={t('investors.contributedBalance')}
        value={`$ ${humanNumberBn(contributedBalance, decimals)}`}
      />
      <Text
        label={t('investors.reservedBalance')}
        value={`$ ${humanNumberBn(reservedBalance, decimals)}`}
      />
    </StatBoxList>
  );
};
