// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { CardWrapper } from 'library/Card/Wrappers';
import { StatBoxList } from 'library/StatBoxList';
import { PluginLabel } from 'library/PluginLabel';
import { AccountControls } from './AccountControls';
import { BalanceChart } from './BalanceChart';
import { BalanceLinks } from './BalanceLinks';
import { NetworkStats } from './NetworkSats';
import { Payouts } from './Payouts';
import { StakeStatus } from './StakeStatus';
import { ActiveEraStat } from './Stats/ActiveEraTimeLeft';
import { AverageRewardRateStat } from './Stats/AveragelRewardRate';
import { SupplyStakedStat } from './Stats/SupplyStaked';
import { PageTitle } from 'kits/Structure/PageTitle';
import { PageHeadingWrapper } from 'kits/Structure/PageHeading/Wrapper';
import { PageRow } from 'kits/Structure/PageRow';
import { RowSection } from 'kits/Structure/RowSection';

export const Overview = () => {
  const { t } = useTranslation('pages');

  const PAYOUTS_HEIGHT = 380;

  return (
    <>
      <PageTitle title={t('overview.overview')} />
      <PageRow>
        <PageHeadingWrapper>
          <AccountControls />
        </PageHeadingWrapper>
      </PageRow>
      <StatBoxList>
        <AverageRewardRateStat />
        <SupplyStakedStat />
        <ActiveEraStat />
      </StatBoxList>
      <PageRow>
        <StakeStatus />
      </PageRow>
      <PageRow>
        <RowSection secondary>
          <CardWrapper height={PAYOUTS_HEIGHT}>
            <BalanceChart />
            <BalanceLinks />
          </CardWrapper>
        </RowSection>
        <RowSection hLast vLast>
          <CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }}>
            <PluginLabel plugin="subscan" />
            <Payouts />
          </CardWrapper>
        </RowSection>
      </PageRow>
      <PageRow>
        <NetworkStats />
      </PageRow>
    </>
  );
};
