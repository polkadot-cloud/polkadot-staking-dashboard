import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import { useAccount } from 'contexts/Account';
import { Warning } from 'library/Form/Warning';
import { CardWrapper } from 'library/Graphs/Wrappers';
import PageTitle from 'library/PageTitle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, RowSecondaryWrapper } from 'Wrappers';
import { ManageFund } from './MangeFund';
import { InvestStats } from './Stats';
import { AssetOnboardingVote } from './Vote/AssetOnboarding';

export const InvestorsView = () => {
  const { t } = useTranslation('pages');
  const { isInvestor } = useAccount();
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
  ];

  return (
    <>
      <PageTitle title={t('investors.title')} tabs={tabs} />
      {activeTab === 0 && (
        <>
          {!isInvestor() && (
            <PageRowWrapper className="page-padding" noVerticalSpacer>
              <Warning text="You need the INVESTOR role to withdraw/deposit funds" />
            </PageRowWrapper>
          )}

          <InvestStats />
          <PageRowWrapper className="page-padding" noVerticalSpacer>
            <RowSecondaryWrapper
              hOrder={0}
              vOrder={0}
              thresholdStickyMenu={SideMenuStickyThreshold}
              thresholdFullWidth={SectionFullWidthThreshold}
            >
              <CardWrapper>
                <ManageFund />
              </CardWrapper>
            </RowSecondaryWrapper>
          </PageRowWrapper>
        </>
      )}

      {activeTab === 1 && <AssetOnboardingVote />}
    </>
  );
};
