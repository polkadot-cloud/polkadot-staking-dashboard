// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useAccount } from 'contexts/Account';
import { useAssets } from 'contexts/Assets';
import { useModal } from 'contexts/Modal';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { HouseList } from 'library/HouseList';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { ActiveAccount } from './ActiveAccount';
import TotalHousingFund from './Stats/TotalHousingFund';
import TotalUsers from './Stats/TotalUsers';
import UserBalance from './Stats/UserBalance';

export const Dashboard = () => {
  const { t } = useTranslation('pages');
  const { assets } = useAssets();
  const { role, address } = useAccount();
  const { openModalWith } = useModal();

  useEffect(() => {
    if (!role) openModalWith('SelectRole', {});
  }, [role]);

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
        <UserBalance />
      </StatBoxList>

      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {role === 'SELLER' && (
            <ButtonPrimary
              text={t('sellers.onboardAsset')}
              iconLeft={faPlus}
              style={{ margin: '10px 0', padding: 10 }}
              onClick={() => openModalWith('OnboardAsset')}
            />
          )}
          <HouseList assets={assets} />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Dashboard;
