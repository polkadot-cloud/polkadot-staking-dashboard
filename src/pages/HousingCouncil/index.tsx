import { CardWrapper } from 'library/Graphs/Wrappers';
import PageTitle from 'library/PageTitle';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, Separator } from 'Wrappers';
import { CouncilMembers } from './CouncilMembers';
import { CouncilStats } from './CouncilStats';
import { Proposals } from './Proposals';

export const HousingCouncil = () => {
  const { t } = useTranslation('pages');
  return (
    <>
      <PageTitle title={t('governance.housingCouncil')} />
      <Separator />
      <CouncilStats />

      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <CouncilMembers />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Proposals />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
