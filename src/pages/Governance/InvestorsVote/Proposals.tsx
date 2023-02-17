import { useAssets } from 'contexts/Assets';
import { Header } from 'library/List';
import { ListWrapper } from '../HousingCouncil/Wrappers';
import { DemocracyProposal } from './DemocracyProposal';
import { ProposalList } from './Wrappers';

export const Proposals = () => {
  const { assets } = useAssets();

  return (
    <>
      <ListWrapper>
        <Header>
          <h4>Proposals</h4>
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
