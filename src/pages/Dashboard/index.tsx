// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { ActiveAccount } from './ActiveAccount';
import TotalHousingFund from './Stats/TotalHousingFund';
import TotalUsers from './Stats/TotalUsers';

export const Dashboard = () => {
  const { t } = useTranslation('pages');

  return (
    <>
      <PageTitle title={t('dashboard.dashboard')} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <ActiveAccount />
        </TopBarWrapper>
      </PageRowWrapper>
      <StatBoxList>
        <TotalHousingFund />
        <TotalUsers />
      </StatBoxList>

      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>{/* <ValidatorList /> */}</CardWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Dashboard;
