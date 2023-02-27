import BN from 'bn.js';

export interface Asset {
  collId: number;
  itemId: number;
  status: string;
  created: number;
  metadata: string;
  price: BN;
  representative: string;
  tenants: Array<string>;
  proposalHash: string;
}
export interface AssetsContextInterface {
  assets: Array<Asset>;
  fetchAssets: () => Promise<void>;
}
