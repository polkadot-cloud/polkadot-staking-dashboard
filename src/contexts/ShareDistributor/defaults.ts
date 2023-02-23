import { ShareDistributorContextInterface } from './types';

export const defaultShareDistributorContext: ShareDistributorContextInterface =
  {
    fetchAssetShareInfo: async (_collId: number, _itemId: number) => null,
  };
