import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import React from 'react';
import { AnyJson } from 'types';
import { planckBnToUnit } from 'Utils';
import { defaultDemocracyContext } from './defaults';
import { DemocracyContextInterface, DemocracyVotes } from './types';

export const DemocracyContext = React.createContext<DemocracyContextInterface>(
  defaultDemocracyContext
);

export const useDemocracy = () => React.useContext(DemocracyContext);

export const DemocracyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api } = useApi();
  const { decimals } = useNetworkMetrics();

  const fetchDemocracyVotes = async (
    index: number
  ): Promise<DemocracyVotes> => {
    if (!api) {
      return {};
    }
    const res = await api.query.democracy.referendumInfoOf(index);
    if (res.isEmpty) return {};
    const data: AnyJson = res.toJSON();
    if (data?.ongoing) {
      const { tally } = data.ongoing;
      const ayes = planckBnToUnit(new BN(tally.ayes), decimals - 1);
      const nays = planckBnToUnit(new BN(tally.nays), decimals - 1);
      const turnout = planckBnToUnit(new BN(tally.turnout), decimals - 1);
      return { ...data, ongoing: { tally: { ayes, nays, turnout } } };
    }
    return data;
  };

  return (
    <DemocracyContext.Provider value={{ fetchDemocracyVotes }}>
      {children}
    </DemocracyContext.Provider>
  );
};
