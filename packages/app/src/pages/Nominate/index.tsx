// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Active } from './Active';
import { NominationGeo } from './NominationGeo';
import { Wrapper } from './Wrappers';
import { PageTitle } from '../../kits/Structure/PageTitle';
import { useTranslation } from 'react-i18next';
import type { PageTitleTabProps } from 'kits/Structure/PageTitleTabs/types';
import { useEffect, useState } from 'react';
import { usePlugins } from 'contexts/Plugins';

export const Nominate = () => {
  const { t } = useTranslation();
  const { pluginEnabled } = usePlugins();

  const [activeTab, setActiveTab] = useState<number>(0);

  // Only include tabs if the Polkawatch plugin is enabled.
  let tabs: PageTitleTabProps[] | undefined = undefined;
  if (pluginEnabled('polkawatch')) {
    tabs = [
      {
        title: t('overview', { ns: 'base' }),
        active: activeTab === 0,
        onClick: () => setActiveTab(0),
      },
      {
        title: t('decentralization', { ns: 'base' }),
        active: activeTab === 1,
        onClick: () => setActiveTab(1),
      },
    ];
  }

  // Go back to the first tab if the Polkawatch plugin is disabled.
  useEffect(() => {
    if (!pluginEnabled('polkawatch')) {
      setActiveTab(0);
    }
  }, [pluginEnabled('polkawatch')]);

  return (
    <Wrapper>
      <PageTitle title={t('nominate.nominate', { ns: 'pages' })} tabs={tabs} />
      {activeTab == 0 && <Active />}
      {activeTab == 1 && <NominationGeo />}
    </Wrapper>
  );
};
