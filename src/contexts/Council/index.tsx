import { useApi } from 'contexts/Api';
import React, { useEffect, useState } from 'react';
import { AnyApi, AnyJson } from 'types';
import { defaultCouncilContext } from './defaults';
import {
  CouncilContextInterface,
  CouncilVotes,
  defaultCouncilVotes,
} from './types';

// context definition
export const CouncilContext = React.createContext<CouncilContextInterface>(
  defaultCouncilContext
);

export const useCouncil = () => React.useContext(CouncilContext);

// wrapper component to provide components with context
export const CouncilProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api } = useApi();
  const [members, setMembers] = useState<string[]>([]);
  const [totalProposals, setTotalProposals] = useState(0);
  const [proposals, setProposals] = useState<string[]>([]);
  const [unsub, setUnsub] = useState<AnyApi>();

  const subscribe = async () => {
    if (!api || !isReady) {
      setMembers([]);
      return;
    }

    const _unsub = api.queryMulti(
      [
        [api.query.council.members],
        [api.query.council.proposalCount],
        [api.query.council.proposals],
      ],
      ([_members, _count, _proposals]) => {
        setMembers(_members.toJSON() as string[]);
        setTotalProposals(_count.toJSON() as number);
        setProposals(_proposals.toJSON() as string[]);
      }
    );
    setUnsub(_unsub);
  };

  const fetchCouncilVotes = async (hash: string): Promise<CouncilVotes> => {
    if (!api) return defaultCouncilVotes;
    const res = await api.query.council.voting(hash);
    if (res.isEmpty) return defaultCouncilVotes;
    return res.toJSON() as AnyJson as CouncilVotes;
  };

  const isCouncilMember = (address: string) => members.indexOf(address) !== -1;

  useEffect(() => {
    subscribe();
    return () => {
      if (unsub) unsub.then();
    };
  }, [isReady, api]);
  return (
    <CouncilContext.Provider
      value={{
        members,
        totalProposals,
        proposals,
        fetchCouncilVotes,
        isCouncilMember,
      }}
    >
      {children}
    </CouncilContext.Provider>
  );
};
