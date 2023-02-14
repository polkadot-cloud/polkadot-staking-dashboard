import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageRowWrapper } from 'Wrappers';
import { CouncilMembers } from './CouncilMembers';
import { CouncilStats } from './CouncilStats';
import { Proposals } from './Proposals';

export const HousingCouncil = () => {
  return (
    <>
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
