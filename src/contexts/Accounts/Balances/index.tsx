// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import {
  BalancesAccount,
  BalancesContextInterface,
} from 'contexts/Accounts/Balances/types';
import { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
import { rmCommas, setStateWithRef } from 'Utils';
import { useApi } from '../../Api';
import { useConnect } from '../../Connect';
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

  // existential amount of unit for an account
  const existentialAmount = consts.existentialDeposit;

  // balance accounts state
  const [balancesAccounts, setBalancesAccounts] = useState<
    Array<BalancesAccount>
  >([]);
  const balancesAccountsRef = useRef(balancesAccounts);

  // balance subscriptions state
  const [unsubsBalances, setUnsubsBalances] = useState<AnyApi>([]);
  const unsubsBalancesRef = useRef<AnyApi>(unsubsBalances);

  // fetch account balances. Remove or add subscriptions
  useEffect(() => {
    if (isReady) {
      // local updated values
      let newAccounts = balancesAccountsRef.current;
      const newUnsubsBalances = unsubsBalancesRef.current;

      // get accounts removed: use these to unsubscribe
      const accountsRemoved = balancesAccountsRef.current.filter(
        (a: BalancesAccount) =>
          !accounts.find((c: ImportedAccount) => c.address === a.address)
      );
      // get accounts added: use these to subscribe
      const accountsAdded = accounts.filter(
        (c: ImportedAccount) =>
          !balancesAccountsRef.current.find(
            (a: BalancesAccount) => a.address === c.address
          )
      );
      // update accounts state for removal
      newAccounts = balancesAccountsRef.current.filter((a: BalancesAccount) =>
        accounts.find((c: ImportedAccount) => c.address === a.address)
      );

      // update accounts state and unsubscribe if accounts have been removed
      if (newAccounts.length < balancesAccountsRef.current.length) {
        // unsubscribe from removed balances
        accountsRemoved.forEach((a: BalancesAccount) => {
          const unsub = unsubsBalancesRef.current.find(
            (u: AnyApi) => u.key === a.address
          );
          if (unsub) {
            unsub.unsub();
            // remove unsub from balances
            newUnsubsBalances.filter((u: AnyApi) => u.key !== a.address);
          }
        });
        // commit state updates
        setStateWithRef(
          newUnsubsBalances,
          setUnsubsBalances,
          unsubsBalancesRef
        );
        setStateWithRef(newAccounts, setBalancesAccounts, balancesAccountsRef);
      }

      // if accounts have changed, update state with new unsubs / accounts
      if (accountsAdded.length) {
        // subscribe to added accounts balances
        accountsAdded.map((a: ImportedAccount) =>
          subscribeToBalances(a.address)
        );
      }
    }
  }, [accounts, network, isReady]);

  // unsubscribe from balance subscriptions on unmount
  useEffect(() => {
    Object.values(unsubsBalancesRef.current).forEach(({ unsub }: AnyApi) => {
      unsub();
    });
  }, []);

  // subscribe to account balances, bonded and nominators
  const subscribeToBalances = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [
        [api.query.system.account, address],
        [api.query.balances.locks, address],
        [api.query.staking.bonded, address],
        [api.query.staking.nominators, address],
      ],
      async ([{ data }, locks, bonded, nominations]): Promise<void> => {
        const newAccount: BalancesAccount = {
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

        // set account balances to context
        newAccount.balance = {
          free,
          reserved,
          miscFrozen,
          feeFrozen,
          freeAfterReserve,
        };

        // get account locks
        const _locks = locks.toHuman();
        for (let i = 0; i < _locks.length; i++) {
          _locks[i].amount = new BigNumber(rmCommas(_locks[i].amount));
        }
        newAccount.locks = _locks;

        // set account bonded (controller) or null
        let _bonded = bonded.unwrapOr(null);
        _bonded =
          _bonded === null ? null : (_bonded.toHuman() as string | null);
        newAccount.bonded = _bonded;

        // add bonded (controller) account as external account if not presently imported
        if (_bonded) {
          if (
            accounts.find((s: ImportedAccount) => s.address === _bonded) ===
            undefined
          ) {
            addExternalAccount(_bonded, 'system');
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
        const newAccounts = Object.values(balancesAccountsRef.current)
          .filter((a: BalancesAccount) => a.address !== address)
          .concat(newAccount);

        setStateWithRef(newAccounts, setBalancesAccounts, balancesAccountsRef);
      }
    );

    setStateWithRef(
      unsubsBalancesRef.current.concat({
        key: address,
        unsub,
      }),
      setUnsubsBalances,
      unsubsBalancesRef
    );
    return unsub;
  };

  // get an account's balance metadata
  const getAccountBalance = (address: MaybeAccount) => {
    const account = balancesAccountsRef.current.find(
      (a: BalancesAccount) => a.address === address
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
    const account = balancesAccountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return [];
    }

    const locks = account.locks ?? [];
    return locks;
  };

  // get an account's bonded (controller) account)
  const getBondedAccount = (address: MaybeAccount) => {
    const account = balancesAccountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return null;
    }
    const bonded = account.bonded ?? null;
    return bonded;
  };

  // get an account's nominations
  const getAccountNominations = (address: MaybeAccount) => {
    const account = balancesAccountsRef.current.find(
      (a: BalancesAccount) => a.address === address
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
    const account = balancesAccountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return null;
    }
    return account;
  };

  // check if an account is a controller account
  const isController = (address: MaybeAccount) => {
    const existsAsController = balancesAccountsRef.current.filter(
      (a: BalancesAccount) => (a?.bonded || '') === address
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
        balancesAccounts: balancesAccountsRef.current,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
