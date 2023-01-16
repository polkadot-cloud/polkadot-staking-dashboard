import BN from 'bn.js';

export const toReadableNum = (numStr: string): string => {
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseBalance = (balance: BN, decimals: number): BN => {
  const unit = new BN(10, 10).pow(new BN(decimals, 10));
  return balance.div(unit);
};
