import { VotingContextInterface } from './types';

export const defaultVotingContext: VotingContextInterface = {
  fetchProposals: async (hash: string) => ({ collective: '', democracy: '' }),
};
