// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Active } from './Active';
import { NominationGeo } from './NominationGeo';
import { Wrapper } from './Wrappers';
import { PageTitle } from '../../kits/Structure/PageTitle';
import { useTranslation } from 'react-i18next';
import type { PageTitleTabProps } from 'kits/Structure/PageTitleTabs/types';
import { useState } from 'react';

export const Nominate = () => {
  const { t } = useTranslation('pages');
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs: PageTitleTabProps[] = [
    {
      title: t('nominate.overview'),
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
    {
      title: t('nominate.decentralization'),
      active: activeTab === 1,
      onClick: () => setActiveTab(1),
    },
  ];

  return (
    <Wrapper>
      <PageTitle title={t('nominate.nominate', { ns: 'pages' })} tabs={tabs} />
      {activeTab == 0 && <Active />}
      {activeTab == 1 && <NominationGeo />}
    </Wrapper>
  );
};
