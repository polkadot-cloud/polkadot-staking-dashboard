import { ZERO } from 'Utils';
import { InvestContextInterface } from './types';

export const defaultInvestContext: InvestContextInterface = {
  availableBalance: ZERO,
  reservedBalance: ZERO,
  contributedBalance: ZERO,
  totalDeposit: ZERO,
  deposits: [],
  hasWithdrawn: false,
};
