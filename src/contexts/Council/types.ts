export interface CouncilVotes {
  index: number;
  threshold: number;
  ayes: Array<string>;
  nays: Array<string>;
  end: number;
}

export const defaultCouncilVotes: CouncilVotes = {
  index: 0,
  threshold: 0,
  ayes: [],
  nays: [],
  end: 0,
};

export interface CouncilContextInterface {
  members: Array<string>;
  totalProposals: number;
  proposals: Array<string>;
  fetchCouncilVotes: (hash: string) => Promise<CouncilVotes>;
  isCouncilMember: (address: string) => boolean;
}
