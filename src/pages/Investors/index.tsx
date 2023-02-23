import PageTitle from 'library/PageTitle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ManageAssets } from './Assets';
import { AssetOnboarding } from './Assets/Onboarding';
import { ManageFund } from './Fund';

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
      title: t('investors.manageAsset'),
      active: activeTab === 1,
      onClick: () => setActiveTab(1),
    },
  ];

  return (
    <>
      <PageTitle title={t('investors.title')} tabs={tabs} />
      {activeTab === 0 && <ManageFund />}
      {activeTab === 1 && (
        <>
          <AssetOnboarding />
          <ManageAssets />
        </>
      )}
    </>
  );
};
