export interface AssetProposals {
  collective: string;
  democracy: string;
}

export const defaultAssetProposal: AssetProposals = {
  collective: '',
  democracy: '',
};

export interface VotingContextInterface {
  fetchProposals: (hash: string) => Promise<AssetProposals>;
}
