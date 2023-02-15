export interface CouncilVotes {
  index: number;
  threshold: number;
  ayes: Array<string>;
  nays: Array<string>;
  end: number;
}

export type CouncilVoteResult = CouncilVotes | null;

export interface CouncilContextInterface {
  members: Array<string>;
  totalProposals: number;
  proposals: Array<string>;
  fetchCouncilVotes: (hash: string) => Promise<CouncilVoteResult>;
  isCouncilMember: (address: string) => boolean;
}
