import { ShareDistributorContextInterface } from './types';

export const defaultShareDistributorContext: ShareDistributorContextInterface =
  {
    fetchAssetShareInfo: async (_collId: number, _itemId: number) => null,
    getTokenShares: async (_virtualAccount: string) => null,
  };
