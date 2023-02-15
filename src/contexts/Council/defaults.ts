import { CouncilContextInterface, defaultCouncilVotes } from './types';

export const defaultCouncilContext: CouncilContextInterface = {
  members: [],
  totalProposals: 0,
  proposals: [],
  fetchCouncilVotes: async () => defaultCouncilVotes,
  isCouncilMember: () => false,
};
