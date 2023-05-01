// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoidFn } from '@polkadot/api/types';
import {
  addedTo,
  matchedProperties,
  removedFrom,
  rmCommas,
  setStateWithRef,
} from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, MaybeAccount } from 'types';
import * as defaults from './defaults';
import type {
  AccountBalancesContextInterface,
  Ledger,
  UnlockChunkRaw,
} from './types';

/**
 * @name useAccountBalances
 * @summary A provider that subscribes to an account's balances and wrap app children.
 */
export const AccountBalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network } = useApi();
  const { accounts, addExternalAccount, getAccount } = useConnect();

  const [ledgers, setLedgers] = useState<Array<Ledger>>([]);
  const ledgersRef = useRef(ledgers);

  const unsubs = useRef<Record<string, VoidFn>>({});

  // Handle the syncing of accounts on accounts change.
  const handleSyncAccounts = () => {
    // Sync removed accounts.
    const handleRemovedAccounts = () => {
      const removed = removedFrom(accounts, ledgersRef.current, [
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
      addedTo(accounts, ledgersRef.current, ['address'])?.map(({ address }) =>
        handleSubscriptions(address)
      );
    };
    // Sync existing accounts.
    const handleExistingAccounts = () => {
      setStateWithRef(
        matchedProperties(accounts, ledgersRef.current, ['address']),
        setLedgers,
        ledgersRef
      );
    };
    handleRemovedAccounts();
    handleAddedAccounts();
    handleExistingAccounts();
  };

  // fetch account balances & ledgers. Remove or add subscriptions
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

  const handleSubscriptions = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [
        [api.query.staking.ledger, address],
        // [api.query.system.account, address],
        // [api.query.balances.locks, address],
        // [api.query.staking.bonded, address],
      ],
      async ([ledger]) => {
        const handleLedger = (result: AnyApi) => {
          const newLedger = result.unwrapOr(null);

          if (newLedger !== null) {
            const { stash, total, active, unlocking } = newLedger;

            // add stash as external account if not present
            if (!getAccount(stash.toString())) {
              addExternalAccount(stash.toString(), 'system');
            }

            setStateWithRef(
              Object.values([...ledgersRef.current])
                // remove stale account if it's already in list
                .filter((l) => l.stash !== stash.toString())
                // add new ledger record to list.
                .concat({
                  address,
                  stash: stash.toString(),
                  active: new BigNumber(rmCommas(active.toString())),
                  total: new BigNumber(rmCommas(total.toString())),
                  unlocking: unlocking
                    .toHuman()
                    .map(({ era, value }: UnlockChunkRaw) => ({
                      era: Number(rmCommas(era)),
                      value: new BigNumber(rmCommas(value)),
                    })),
                }),
              setLedgers,
              ledgersRef
            );
          } else {
            // no ledger: remove account if it's already in list.
            setStateWithRef(
              Object.values([...ledgersRef.current]).filter(
                (l) => l.address !== address
              ),
              setLedgers,
              ledgersRef
            );
          }
        };

        handleLedger(ledger);
      }
    );
    unsubs.current[address] = unsub;
    return unsub;
  };

  // Get a stash account's ledger metadata
  const getLedgerForStash = (address: MaybeAccount) => {
    const ledger = ledgersRef.current.find((l: Ledger) => l.stash === address);
    if (ledger === undefined) {
      return defaults.ledger;
    }
    if (ledger.stash === undefined) {
      return defaults.ledger;
    }
    return ledger;
  };

  // Get a controler account's ledger returns null if ledger does not exist.
  const getLedgerForController = (address: MaybeAccount) => {
    const ledger = ledgersRef.current.find(
      (l: Ledger) => l.address === address
    );
    if (ledger === undefined) {
      return null;
    }
    if (ledger.address === undefined) {
      return null;
    }
    return ledger;
  };

  return (
    <AccountBalancesContext.Provider
      value={{
        getLedgerForStash,
        getLedgerForController,
        ledgers: ledgersRef.current,
      }}
    >
      {children}
    </AccountBalancesContext.Provider>
  );
};

export const AccountBalancesContext =
  React.createContext<AccountBalancesContextInterface>(
    defaults.defaultAccountBalancesContext
  );

export const useAccountBalances = () =>
  React.useContext(AccountBalancesContext);
