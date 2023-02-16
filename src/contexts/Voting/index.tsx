import { useApi } from 'contexts/Api';
import React from 'react';
import { AnyJson } from 'types';
import { defaultVotingContext } from './defaults';
import {
  AssetProposals,
  defaultAssetProposal,
  VotingContextInterface,
} from './types';

export const VotingContext =
  React.createContext<VotingContextInterface>(defaultVotingContext);

export const useVoting = () => React.useContext(VotingContext);

export const VotingProvider = ({ children }: { children: React.ReactNode }) => {
  const { api, isReady } = useApi();
  const fetchProposals = async (hash: string): Promise<AssetProposals> => {
    if (!api || !isReady) return defaultAssetProposal;
    const res = await api.query.votingModule.votingProposals(hash);
    if (res.isEmpty) return defaultAssetProposal;
    const {
      collectiveHash: collective,
      democracyReferendumIndex: democracyIndex,
    }: AnyJson = res.toJSON();
    return { collective, democracyIndex };
  };
  return (
    <VotingContext.Provider value={{ fetchProposals }}>
      {children}
    </VotingContext.Provider>
  );
};
