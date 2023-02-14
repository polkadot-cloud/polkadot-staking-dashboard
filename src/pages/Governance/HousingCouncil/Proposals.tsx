import { useAssets } from 'contexts/Assets';
import { Header } from 'library/List';
import { CouncilProposal } from './CouncilProposal';
import { ListWrapper } from './Wrappers';

export const Proposals = () => {
  const { assets } = useAssets();
  return (
    <>
      <ListWrapper>
        <Header>
          <h4>Proposals</h4>
        </Header>
        <div>
          {assets
            .filter((asset) => asset.status === 'REVIEWING')
            .map((asset, index) => (
              <CouncilProposal asset={asset} key={index} />
            ))}
        </div>
      </ListWrapper>
    </>
  );
};
