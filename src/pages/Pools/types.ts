export interface PoolAccountProps {
  address: string | null;
  last?: boolean;
  batchKey: string;
  batchIndex: number;
}

export interface PoolsTabsContextInterface {
  setActiveTab: (t: number) => void;
  activeTab: number;
}

export interface PayoutListContextInterface {
  setListFormat: (v: string) => void;
  listFormat: string;
}
