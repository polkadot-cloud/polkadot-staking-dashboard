import BN from 'bn.js';
import { useAccount } from 'contexts/Account';
import { Address } from 'contexts/Account/types';
import { useApi } from 'contexts/Api';
import React, { useEffect, useState } from 'react';
import { AnyApi, AnyJson } from 'types';
import { parseHumanBN, ZERO } from 'Utils';
import { defaultInvestContext } from './defaults';
import { InvestContextInterface } from './types';

// context definition
export const InvestContext =
  React.createContext<InvestContextInterface>(defaultInvestContext);

export const useInvest = () => React.useContext(InvestContext);

// wrapper component to provide components with context
export const InvestProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, role } = useAccount();
  const { api, isReady } = useApi();
  const [investContext, setInvestContext] =
    useState<InvestContextInterface>(defaultInvestContext);
  const [unsub, setUnsub] = useState<AnyApi>(undefined);

  const subscribe = async (account: Address) => {
    if (!(address && role === 'INVESTOR')) {
      setInvestContext(defaultInvestContext);
      return;
    }
    if (!api || !isReady) return;
    const _unsub = api.query.housingFundModule.contributions(
      account,
      (res: AnyJson) => {
        const {
          availableBalance,
          reservedBalance,
          contributedBalance,
          contributions,
          hasWithdrawn,
        } = res.toHuman();
        const totalDeposit = contributions.reduce(
          (prev: BN, { amount }: { amount: string }) =>
            prev.add(parseHumanBN(amount)),
          ZERO
        );
        const deposits = contributions.map(
          ({ amount, block }: { amount: string; block: number }) => ({
            block,
            amount: parseHumanBN(amount),
          })
        );
        setInvestContext({
          availableBalance: parseHumanBN(availableBalance),
          reservedBalance: parseHumanBN(reservedBalance),
          contributedBalance: parseHumanBN(contributedBalance),
          deposits,
          hasWithdrawn,
          totalDeposit,
        });
      }
    );
    setUnsub(_unsub);
  };

  useEffect(() => {
    subscribe(address);
    return () => {
      if (unsub) unsub.then();
    };
  }, [address, isReady, role]);

  return (
    <InvestContext.Provider value={investContext}>
      {children}
    </InvestContext.Provider>
  );
};
