export interface AssetProposals {
  collective: string;
  democracyIndex: number;
}

export const defaultAssetProposal: AssetProposals = {
  collective: '',
  democracyIndex: -1,
};

export interface VotingContextInterface {
  fetchProposals: (hash: string) => Promise<AssetProposals>;
}
