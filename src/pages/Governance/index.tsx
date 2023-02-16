import PageTitle from 'library/PageTitle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HousingCouncil } from './HousingCouncil';
import { InvestorsVote } from './InvestorsVote';

export const Governance = () => {
  const { t } = useTranslation('pages');
  const [activeTab, setActiveTab] = useState(0);

  const onHousingCouncil = () => {
    setActiveTab(0);
  };

  const onInvestorsVote = () => {
    setActiveTab(1);
  };

  const onTenantsSession = () => {
    setActiveTab(2);
  };

  const tabs = [
    {
      title: t('governance.housingCouncil'),
      active: activeTab === 0,
      onClick: onHousingCouncil,
    },
    {
      title: t('governance.investorsVote'),
      active: activeTab === 1,
      onClick: onInvestorsVote,
    },
    {
      title: t('governance.tenantsSession'),
      active: activeTab === 2,
      onClick: onTenantsSession,
    },
  ];

  return (
    <>
      <PageTitle title="Governance" tabs={tabs} />
      {activeTab === 0 && <HousingCouncil />}
      {activeTab === 1 && <InvestorsVote />}
    </>
  );
};
