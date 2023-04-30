// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  addedTo,
  matchedProperties,
  removedFrom,
  rmCommas,
  setStateWithRef,
} from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import type {
  Balances,
  BalancesContextInterface,
} from 'contexts/Accounts/Balances/types';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import type { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, MaybeAccount } from 'types';
import * as defaults from './defaults';

export const BalancesContext = React.createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => React.useContext(BalancesContext);

export const BalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network, consts } = useApi();
  const { accounts, addExternalAccount } = useConnect();

  // Existential amount of unit for an account
  const existentialAmount = consts.existentialDeposit;

  // Balance accounts state.
  const [balances, setBalances] = useState<Array<Balances>>([]);
  const balancesRef = useRef(balances);

  // Balance subscriptions state.
  const unsubs = useRef<AnyApi[]>([]);

  // Syncs existing balance accounts with connect accounts.
  const syncExistingAccounts = () => {
    setStateWithRef(
      matchedProperties(accounts, balancesRef.current, ['address']),
      setBalances,
      balancesRef
    );
  };

  // Subscribes to added accounts.
  const handleAddedAccounts = () => {
    addedTo(accounts, balancesRef.current, ['address'])?.map(({ address }) =>
      subscribeToBalances(address)
    );
  };

  // Handles state and unsubscribe for removed accounts.
  const handleRemovedAccounts = () => {
    const removed = removedFrom(accounts, balancesRef.current, ['address']).map(
      ({ address }) => address
    );
    if (!removed.length) return;

    removed.forEach((address) =>
      unsubs.current.find(({ key }: AnyApi) => key === address)?.unsub()
    );
    unsubs.current = unsubs.current.filter(
      ({ key }: AnyApi) => !removed.includes(key)
    );
  };

  // Handle accounts sync on connected accounts change.
  useEffect(() => {
    if (isReady) {
      handleRemovedAccounts();
      handleAddedAccounts();
      syncExistingAccounts();
    }
  }, [accounts, network, isReady]);

  // Unsubscribe from balance subscriptions on unmount.
  useEffect(() => {
    return () =>
      Object.values(unsubs.current).forEach(({ unsub }: AnyApi) => {
        unsub();
      });
  }, []);

  // Subscribe to account balances, bonded and nominators
  const subscribeToBalances = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [
        [api.query.system.account, address],
        [api.query.balances.locks, address],
        [api.query.staking.bonded, address],
        [api.query.staking.nominators, address],
      ],
      async ([{ data, nonce }, locks, bonded, nominations]): Promise<void> => {
        const newAccount: Balances = {
          address,
        };
        const free = new BigNumber(data.free.toString());
        const reserved = new BigNumber(data.reserved.toString());
        const miscFrozen = new BigNumber(data.miscFrozen.toString());
        const feeFrozen = new BigNumber(data.feeFrozen.toString());
        const freeAfterReserve = BigNumber.max(
          free.minus(existentialAmount),
          0
        );

        // set the account nonce
        newAccount.nonce = nonce.toNumber();

        // set account balances to context
        newAccount.balance = {
          free,
          reserved,
          miscFrozen,
          feeFrozen,
          freeAfterReserve,
        };

        // get account locks
        const newLocks = locks.toHuman().map((l: AnyApi) => {
          return {
            ...l,
            amount: new BigNumber(rmCommas(l.amount)),
            id: l.id.trim(),
          };
        });
        newAccount.locks = newLocks;

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

    unsubs.current = unsubs.current.concat({
      key: address,
      unsub,
    });
    return unsub;
  };

  // get an account's balance metadata
  const getAccountBalance = (address: MaybeAccount) => {
    const account = balancesRef.current.find(
      (a: Balances) => a.address === address
    );
    if (account === undefined) {
      return defaults.balance;
    }
    const { balance } = account;
    if (balance?.free === undefined) {
      return defaults.balance;
    }
    return balance;
  };

  // get an account's locks metadata
  const getAccountLocks = (address: MaybeAccount) => {
    const account = balancesRef.current.find(
      (a: Balances) => a.address === address
    );
    if (account === undefined) {
      return [];
    }

    const locks = account.locks ?? [];
    return locks;
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
        getAccountBalance,
        getAccountLocks,
        getBondedAccount,
        getAccountNominations,
        isController,
        existentialAmount,
        balances: balancesRef.current,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
