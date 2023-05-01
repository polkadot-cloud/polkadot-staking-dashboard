// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoidFn } from '@polkadot/api/types';
import {
  addedTo,
  matchedProperties,
  removedFrom,
  setStateWithRef,
} from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import type {
  Balances,
  BalancesContextInterface,
} from 'contexts/Balances/types';
import { useConnect } from 'contexts/Connect';
import type { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, MaybeAccount } from 'types';
import * as defaults from './defaults';

export const BalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network } = useApi();
  const { accounts, addExternalAccount } = useConnect();

  // Balance accounts state.
  const [balances, setBalances] = useState<Array<Balances>>([]);
  const balancesRef = useRef(balances);
  const unsubs = useRef<Record<string, VoidFn>>({});

  // Handle the syncing of accounts on accounts change.
  const handleSyncAccounts = () => {
    // Sync removed accounts.
    const handleRemovedAccounts = () => {
      const removed = removedFrom(accounts, balancesRef.current, [
        'address',
      ]).map(({ address }) => address);

      removed?.forEach((address) => {
        const unsub = unsubs.current[address];
        if (unsub) unsub();
      });

      unsubs.current = Object.fromEntries(
        Object.entries(unsubs.current).filter(([key]) => !removed.includes(key))
      );
    };
    // Sync added accounts.
    const handleAddedAccounts = () => {
      addedTo(accounts, balancesRef.current, ['address'])?.map(({ address }) =>
        subscribeToBalances(address)
      );
    };
    // Sync existing accounts.
    const handleExistingAccounts = () => {
      setStateWithRef(
        matchedProperties(accounts, balancesRef.current, ['address']),
        setBalances,
        balancesRef
      );
    };
    handleRemovedAccounts();
    handleAddedAccounts();
    handleExistingAccounts();
  };

  // Handle accounts sync on connected accounts change.
  useEffect(() => {
    if (isReady) {
      handleSyncAccounts();
    }
  }, [accounts, network, isReady]);

  // Unsubscribe from subscriptions on unmount.
  useEffect(() => {
    return () =>
      Object.values(unsubs.current).forEach((unsub) => {
        unsub();
      });
  }, []);

  // Subscribe to account balances, bonded and nominators
  const subscribeToBalances = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [
        [api.query.staking.bonded, address],
        [api.query.staking.nominators, address],
      ],
      async ([bonded, nominations]): Promise<void> => {
        const newAccount: Balances = {
          address,
        };

        // set account bonded (controller) or null
        let newBonded = bonded.unwrapOr(null);
        newBonded =
          newBonded === null ? null : (newBonded.toHuman() as string | null);
        newAccount.bonded = newBonded;

        // add bonded (controller) account as external account if not presently imported
        if (newBonded) {
          if (
            accounts.find((s: ImportedAccount) => s.address === newBonded) ===
            undefined
          ) {
            addExternalAccount(newBonded, 'system');
          }
        }

        // set account nominations.
        const newNominations = nominations.unwrapOr(null);
        newAccount.nominations =
          newNominations === null
            ? defaults.nominations
            : {
                targets: newNominations.targets.toHuman(),
                submittedIn: newNominations.submittedIn.toHuman(),
              };

        // remove stale account if it's already in list.
        const newBalances = Object.values(balancesRef.current)
          .filter((a: Balances) => a.address !== address)
          .concat(newAccount);

        setStateWithRef(newBalances, setBalances, balancesRef);
      }
    );

    unsubs.current[address] = unsub;
    return unsub;
  };

  // get an account's bonded (controller) account)
  const getBondedAccount = (address: MaybeAccount) => {
    const account = balancesRef.current.find(
      (a: Balances) => a.address === address
    );
    if (account === undefined) {
      return null;
    }
    const bonded = account.bonded ?? null;
    return bonded;
  };

  // get an account's nominations
  const getAccountNominations = (address: MaybeAccount) => {
    const account = balancesRef.current.find(
      (a: Balances) => a.address === address
    );
    if (account === undefined) {
      return [];
    }
    const nominations = account.nominations;
    if (nominations === undefined) {
      return [];
    }

    const targets = nominations.targets ?? [];
    return targets;
  };

  // get an account
  const getAccount = (address: MaybeAccount) => {
    const account = balancesRef.current.find(
      (a: Balances) => a.address === address
    );
    if (account === undefined) {
      return null;
    }
    return account;
  };

  // check if an account is a controller account
  const isController = (address: MaybeAccount) => {
    const existsAsController = balancesRef.current.filter(
      (a: Balances) => (a?.bonded || '') === address
    );
    return existsAsController.length > 0;
  };

  return (
    <BalancesContext.Provider
      value={{
        getAccount,
        getBondedAccount,
        getAccountNominations,
        isController,
        balances: balancesRef.current,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};

export const BalancesContext = React.createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => React.useContext(BalancesContext);
