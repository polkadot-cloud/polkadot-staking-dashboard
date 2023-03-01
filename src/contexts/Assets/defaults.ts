import { AssetsContextInterface } from './types';

export const defaultAssetsContext: AssetsContextInterface = {
  assets: [],
  fetchAssets: async () => {},
  fetchAssetAccount: async (_collId: number, _itemId: number) => null,
};
