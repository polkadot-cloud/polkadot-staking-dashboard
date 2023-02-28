export interface SharedAsset {
  collId: number;
  itemId: number;
  virtualAccount: string;
  owners: Array<string>;
  created: number;
  tokenId: number;
  rentNbr: number;
}

export type SharedAssetResult = SharedAsset | null;

export interface TokenOwnership {
  owner: string;
  count: number;
}

export interface TokenDistribution {
  createdAt: number;
  supply: number;
  owners: Array<TokenOwnership>;
  tokenId: number;
}

export type TokenDistributionResult = TokenDistribution | null;

export interface ShareDistributorContextInterface {
  fetchAssetShareInfo: (
    collId: number,
    itemId: number
  ) => Promise<SharedAssetResult>;
  getTokenShares: (virtualAccount: string) => Promise<TokenDistributionResult>;
}
