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

export interface ShareDistributorContextInterface {
  fetchAssetShareInfo: (
    collId: number,
    itemId: number
  ) => Promise<SharedAssetResult>;
}
