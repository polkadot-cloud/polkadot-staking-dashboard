import { defaultAssetProposal, VotingContextInterface } from './types';

export const defaultVotingContext: VotingContextInterface = {
  fetchProposals: async (hash: string) => defaultAssetProposal,
};
