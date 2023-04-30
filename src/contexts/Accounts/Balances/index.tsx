// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rmCommas, setStateWithRef } from '@polkadotcloud/utils';
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

  // existential amount of unit for an account
  const existentialAmount = consts.existentialDeposit;

  // balance accounts state
  const [balances, setBalances] = useState<Array<Balances>>([]);
  const balancesRef = useRef(balances);

  // balance subscriptions state
  const [unsubs, setUnsubs] = useState<AnyApi>([]);
  const unsubsRef = useRef<AnyApi>(unsubs);

  // fetch account balances. Remove or add subscriptions
  useEffect(() => {
    if (isReady) {
      // local updated values
      let newBalances = balancesRef.current;
      const newUnsubsBalances = unsubsRef.current;

      // get accounts removed: use these to unsubscribe
      const accountsRemoved = balancesRef.current.filter(
        (a) => !accounts.find((c) => c.address === a.address)
      );
      // get accounts added: use these to subscribe
      const accountsAdded = accounts.filter(
        (c) => !balancesRef.current.find((a) => a.address === c.address)
      );
      // update accounts state for removal
      newBalances = balancesRef.current.filter((balanceItem) =>
        accounts.find(
          (accountItem) => accountItem.address === balanceItem.address
        )
      );

      // update accounts state and unsubscribe if accounts have been removed
      if (newBalances.length < balancesRef.current.length) {
        // unsubscribe from removed balances
        accountsRemoved.forEach((a) => {
          const unsub = unsubsRef.current.find(
            (u: AnyApi) => u.key === a.address
          );
          if (unsub) {
            unsub.unsub();
            // remove unsub from balances
            newUnsubsBalances.filter((u: AnyApi) => u.key !== a.address);
          }
        });
        // commit state updates
        setStateWithRef(newUnsubsBalances, setUnsubs, unsubsRef);
        setStateWithRef(newBalances, setBalances, balancesRef);
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
    Object.values(unsubsRef.current).forEach(({ unsub }: AnyApi) => {
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

    setStateWithRef(
      unsubsRef.current.concat({
        key: address,
        unsub,
      }),
      setUnsubs,
      unsubsRef
    );
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
