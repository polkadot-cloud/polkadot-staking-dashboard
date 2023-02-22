import PageTitle from 'library/PageTitle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ManageAssets } from './Management/Assets';
import { ManageFund } from './Management/Fund';
import { AssetOnboardingVote } from './Vote/AssetOnboarding';

export const InvestorsView = () => {
  const { t } = useTranslation('pages');
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: t('investors.manageFund'),
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
    {
      title: t('investors.vote.assetOnboarding'),
      active: activeTab === 1,
      onClick: () => setActiveTab(1),
    },
    {
      title: t('investors.ownedAssets'),
      active: activeTab === 2,
      onClick: () => setActiveTab(2),
    },
  ];

  return (
    <>
      <PageTitle title={t('investors.title')} tabs={tabs} />
      {activeTab === 0 && <ManageFund />}
      {activeTab === 1 && <AssetOnboardingVote />}
      {activeTab === 2 && <ManageAssets />}
    </>
  );
};
