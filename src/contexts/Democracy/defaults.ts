import { DemocracyContextInterface } from './types';

export const defaultDemocracyContext: DemocracyContextInterface = {
  fetchDemocracyVotes: async (index: number) => ({}),
};
