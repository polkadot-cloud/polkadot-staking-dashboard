import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageRowWrapper } from 'Wrappers';
import { OnboardingProposals } from './OnboardingProposals';

export const AssetOnboarding = () => {
  return (
    <>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <OnboardingProposals />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
