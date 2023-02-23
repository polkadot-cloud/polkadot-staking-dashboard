import { useAssets } from 'contexts/Assets';
import { Header, Wrapper as ListWrapper } from 'library/List';
import { useTranslation } from 'react-i18next';
import { DemocracyProposal } from './DemocracyProposal';
import { ProposalList } from './Wrappers';

export const OnboardingProposals = () => {
  const { assets } = useAssets();
  const { t } = useTranslation('pages');

  return (
    <>
      <ListWrapper>
        <Header>
          <h3>{t('investors.assetOnboarding')}</h3>
        </Header>
        <ProposalList>
          {assets
            .filter((asset) => asset.status === 'VOTING')
            .map((asset, index) => (
              <DemocracyProposal asset={asset} key={index} />
            ))}
        </ProposalList>
      </ListWrapper>
    </>
  );
};
