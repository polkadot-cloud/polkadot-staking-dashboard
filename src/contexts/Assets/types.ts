import BN from 'bn.js';

export type Asset = {
  collId: number;
  itemId: number;
  status: string;
  created: number;
  metadata: string;
  price: BN;
  tenants: Array<string>;
  proposalHash: string;
};
export interface AssetsContextInterface {
  assets: Array<Asset>;
}
