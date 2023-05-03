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
import { getLedger } from './Utils';
import * as defaults from './defaults';
import type {
  Balances,
  BalancesContextInterface,
  Ledger,
  UnlockChunkRaw,
} from './types';

/**
 * @name useBalances
 * @summary A provider that subscribes to an account's balances and wrap app children.
 */
export const BalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network, consts } = useApi();
  const { existentialDeposit } = consts;
  const { accounts, addExternalAccount, getAccount } = useConnect();

  const [balances, setBalances] = useState<Balances[]>([]);
  const balancesRef = useRef(balances);

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

  const handleSubscriptions = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [
        [api.query.staking.ledger, address],
        [api.query.system.account, address],
        [api.query.balances.locks, address],
      ],
      async ([ledger, { data: accountData, nonce }, locks]) => {
        const handleLedger = () => {
          const newLedger = ledger.unwrapOr(null);

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

        const handleAccount = () => {
          const free = new BigNumber(accountData.free.toString());

          let newBalances: Balances = {
            address,
            nonce: nonce.toNumber(),
            balance: {
              free,
              reserved: new BigNumber(accountData.reserved.toString()),
              frozen: new BigNumber(accountData.frozen),
              miscFrozen: undefined,
              feeFrozen: undefined,
              freeAfterReserve: BigNumber.max(
                free.minus(existentialDeposit),
                0
              ),
            },
            locks: locks.toHuman().map((l: AnyApi) => ({
              ...l,
              id: l.id.trim(),
              amount: new BigNumber(rmCommas(l.amount)),
            })),
          };

          if (accountData.miscFrozen && accountData.feeFrozen) {
            newBalances = {
              address,
              nonce: nonce.toNumber(),
              balance: {
                free,
                reserved: new BigNumber(accountData.reserved.toString()),
                frozen: undefined,
                miscFrozen: new BigNumber(accountData.miscFrozen.toString()),
                feeFrozen: new BigNumber(accountData.feeFrozen.toString()),
                freeAfterReserve: BigNumber.max(
                  free.minus(existentialDeposit),
                  0
                ),
              },
              locks: locks.toHuman().map((l: AnyApi) => ({
                ...l,
                id: l.id.trim(),
                amount: new BigNumber(rmCommas(l.amount)),
              })),
            };
          }

          setStateWithRef(
            Object.values(balancesRef.current)
              .filter((a) => a.address !== address)
              .concat(newBalances),
            setBalances,
            balancesRef
          );
        };

        handleLedger();
        handleAccount();
      }
    );
    unsubs.current[address] = unsub;
    return unsub;
  };

  const unsubAll = () => {
    for (const unsub of Object.values(unsubs.current)) {
      unsub();
    }
    unsubs.current = {};
  };

  // fetch account balances & ledgers. Remove or add subscriptions
  useEffect(() => {
    if (isReady) {
      handleSyncAccounts();
    }
  }, [accounts, network, isReady]);

  // Unsubscribe from subscriptions on network change & unmount.
  useEffect(() => {
    unsubAll();
    return () => unsubAll();
  }, [network]);

  // Gets a ledger for a stash address.
  const getStashLedger = (address: MaybeAccount) => {
    return getLedger(ledgersRef.current, 'stash', address);
  };

  // Gets an account's balance metadata.
  const getBalance = (address: MaybeAccount) =>
    balancesRef.current.find((a) => a.address === address)?.balance ||
    defaults.defaultBalance;

  // Gets an account's locks.
  const getLocks = (address: MaybeAccount) =>
    balancesRef.current.find((a) => a.address === address)?.locks ?? [];

  // Gets an account's nonce.
  const getNonce = (address: MaybeAccount) =>
    balancesRef.current.find((a) => a.address === address)?.nonce ?? 0;

  return (
    <BalancesContext.Provider
      value={{
        ledgers: ledgersRef.current,
        balances: balancesRef.current,
        getStashLedger,
        getBalance,
        getLocks,
        getNonce,
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
