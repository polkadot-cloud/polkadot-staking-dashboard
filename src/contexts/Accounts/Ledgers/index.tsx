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
import type { Ledger, LedgersContextInterface, UnlockChunkRaw } from './types';

export const LedgersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network } = useApi();
  const { accounts, addExternalAccount, getAccount } = useConnect();

  // Account ledgers to separate storage.
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
      removed?.forEach((address) => unsubs.current[address]());
      unsubs.current = Object.fromEntries(
        Object.entries(unsubs.current).filter(([key]) => !removed.includes(key))
      );
    };
    // Sync added accounts.
    const handleAddedAccounts = () => {
      addedTo(accounts, ledgersRef.current, ['address'])?.map(({ address }) =>
        subscribeToLedger(address)
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

  const subscribeToLedger = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [[api.query.staking.ledger, address]],
      async ([result]) => {
        const newLedger = result.unwrapOr(null);

        // fallback to default ledger if not present
        if (newLedger !== null) {
          const { stash, total, active, unlocking } = newLedger;

          // add stash as external account if not present
          if (!getAccount(stash.toString())) {
            addExternalAccount(stash.toString(), 'system');
          }

          // remove stale account if it's already in list, concat, and add to state.
          setStateWithRef(
            Object.values([...ledgersRef.current])
              .filter((l) => l.stash !== stash.toString())
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
      }
    );
    unsubs.current[address] = unsub;
    return unsub;
  };

  // get a stash account's ledger metadata
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

  // get a controler account's ledger
  // returns null if ledger does not exist.
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
    <LedgersContext.Provider
      value={{
        getLedgerForStash,
        getLedgerForController,
        ledgers: ledgersRef.current,
      }}
    >
      {children}
    </LedgersContext.Provider>
  );
};

export const LedgersContext = React.createContext<LedgersContextInterface>(
  defaults.defaultLedgersContext
);

export const useLedgers = () => React.useContext(LedgersContext);
