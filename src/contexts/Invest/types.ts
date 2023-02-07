import BN from 'bn.js';

export interface InvestContextInterface {
  availableBalance: BN;
  reservedBalance: BN;
  contributedBalance: BN;
  totalDeposit: BN;
  deposits: Array<{
    amount: BN;
    block: number;
  }>;
  hasWithdrawn: boolean;
}
