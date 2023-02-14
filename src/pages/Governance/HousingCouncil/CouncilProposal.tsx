import { Asset } from 'contexts/Assets/types';

interface CouncilProposalProps {
  asset: Asset;
}

export const CouncilProposal = ({ asset }: CouncilProposalProps) => {
  const { proposalHash: hash } = asset;
  return <></>;
};
