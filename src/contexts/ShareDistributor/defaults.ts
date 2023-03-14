import { ShareDistributorContextInterface } from './types';

export const defaultShareDistributorContext: ShareDistributorContextInterface =
  {
    getTokenShares: async () => null,
    fetchAssetShareInfo: async () => null,
  };
