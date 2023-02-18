import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import { useAccount } from 'contexts/Account';
import { Warning } from 'library/Form/Warning';
import { CardWrapper } from 'library/Graphs/Wrappers';
import PageTitle from 'library/PageTitle';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, RowSecondaryWrapper } from 'Wrappers';
import { ManageFund } from './ManageFund';
import { InvestStats } from './Stats';

export const InvestorsView = () => {
  const { t } = useTranslation('pages');
  const { isInvestor } = useAccount();
  // const [activeTab, setActiveTab] = useState(0);

  // const onOverview = () => {
  //   setActiveTab(0);
  // };

  // const onDeposit = () => {
  //   setActiveTab(1);
  // };

  // const onWithdraw = () => {
  //   setActiveTab(2);
  // };

  // const tabs = [
  //   {
  //     title: t('investors.overview'),
  //     active: activeTab === 0,
  //     onClick: onOverview,
  //   },
  //   {
  //     title: t('investors.deposit'),
  //     active: activeTab === 1,
  //     onClick: onDeposit,
  //   },
  //   {
  //     title: t('investors.withdraw'),
  //     active: activeTab === 2,
  //     onClick: onWithdraw,
  //   },
  // ];

  return (
    <>
      <PageTitle title={t('investors.title')} />
      {!isInvestor() && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <Warning text="You need the investor role to withdraw/deposit funds" />
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
      {/* {activeTab === 1 && (
        <>
          <PageRowWrapper className="page-padding" noVerticalSpacer>
            <PaddingWrapper>
              <h1>Coming soon...</h1>
            </PaddingWrapper>
          </PageRowWrapper>
        </>
      )}
      {activeTab === 2 && (
        <>
          <PageRowWrapper className="page-padding" noVerticalSpacer>
            <PaddingWrapper>
              <h1>Coming soon...</h1>
            </PaddingWrapper>
          </PageRowWrapper>
        </>
      )} */}
    </>
  );
};
