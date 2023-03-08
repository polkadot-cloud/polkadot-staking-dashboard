// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
import { rmCommas, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import { Ledger, LedgersContextInterface } from './types';

export const LedgersContext = React.createContext<LedgersContextInterface>(
  defaults.defaultLedgersContext
);

export const useLedgers = () => React.useContext(LedgersContext);

export const LedgersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network } = useApi();
  const { accounts, addExternalAccount } = useConnect();

  // account ledgers to separate storage
  const [ledgers, setLedgers] = useState<Array<Ledger>>([]);
  const ledgersRef = useRef(ledgers);

  // ledger subscriptions state
  const [unsubsLedgers, setUnsubsLedgers] = useState<AnyApi>([]);
  const unsubsLedgersRef = useRef<AnyApi>(unsubsLedgers);

  // fetch account balances & ledgers. Remove or add subscriptions
  useEffect(() => {
    if (isReady) {
      // local updated values
      let newLedgers = ledgersRef.current;
      const newUnsubsLedgers = unsubsLedgersRef.current;

      // get accounts removed: use these to unsubscribe
      const accountsRemoved = ledgersRef.current.filter(
        (a: Ledger) =>
          !accounts.find((c: ImportedAccount) => c.address === a.address)
      );
      // get accounts added: use these to subscribe
      const accountsAdded = accounts.filter(
        (c: ImportedAccount) =>
          !ledgersRef.current.find((a: Ledger) => a.address === c.address)
      );

      // update ledgers state for removal
      newLedgers = ledgersRef.current.filter((l: Ledger) =>
        accounts.find((c: ImportedAccount) => c.address === l.address)
      );

      // update ledgers state and unsubscribe if accounts have been removed
      if (newLedgers.length < ledgersRef.current.length) {
        // unsubscribe from removed ledgers if it exists
        accountsRemoved.forEach((a: Ledger) => {
          const unsub = unsubsLedgersRef.current.find(
            (u: AnyApi) => u.key === a.address
          );
          if (unsub) {
            unsub.unsub();
            // remove unsub from balances
            newUnsubsLedgers.filter((u: AnyApi) => u.key !== a.address);
          }
        });
        // commit state updates
        setStateWithRef(newUnsubsLedgers, setUnsubsLedgers, unsubsLedgersRef);
        setStateWithRef(newLedgers, setLedgers, ledgersRef);
      }

      // if accounts have changed, update state with new unsubs / accounts
      if (accountsAdded.length) {
        // subscribe to account balances and ledgers
        handleSubscribe(accountsAdded);
      }
    }
  }, [accounts, network, isReady]);

  // unsubscribe from everything on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, []);

  // subscribe to added accounts
  const handleSubscribe = async (accountsAdded: Array<ImportedAccount>) => {
    // subscribe to ledgers
    Promise.all(
      accountsAdded.map((a: ImportedAccount) => subscribeToLedger(a.address))
    );
  };

  /*
   * Unsubscrbe ledger subscriptions
   */
  const unsubscribeAll = () => {
    Object.values(unsubsLedgersRef.current).forEach(({ unsub }: AnyApi) => {
      unsub();
    });
  };

  const subscribeToLedger = async (address: string) => {
    if (!api) return;

    const unsub: () => void = await api.queryMulti<AnyApi>(
      [[api.query.staking.ledger, address]],
      async ([l]): Promise<void> => {
        let ledger: Ledger;

        const _ledger = l.unwrapOr(null);
        // fallback to default ledger if not present
        if (_ledger !== null) {
          const { stash, total, active, unlocking } = _ledger;

          // format unlocking chunks
          const _unlocking = [];
          for (const u of unlocking.toHuman()) {
            const { era, value } = u;

            _unlocking.push({
              era: Number(rmCommas(era)),
              value: new BigNumber(rmCommas(value)),
            });
          }

          // add stash as external account if not present
          if (
            accounts.find(
              (s: ImportedAccount) => s.address === stash.toHuman()
            ) === undefined
          ) {
            addExternalAccount(stash.toHuman(), 'system');
          }

          ledger = {
            address,
            stash: stash.toHuman(),
            active: new BigNumber(rmCommas(active.toString())),
            total: new BigNumber(rmCommas(total.toString())),
            unlocking: _unlocking,
          };

          // remove stale account if it's already in list, and concat.
          let _ledgers = Object.values(ledgersRef.current);
          _ledgers = _ledgers
            .filter((_l: Ledger) => _l.stash !== ledger.stash)
            .concat(ledger);

          setStateWithRef(_ledgers, setLedgers, ledgersRef);
        } else {
          // no ledger: remove stale account if it's already in list.
          let _ledgers = Object.values(ledgersRef.current);
          _ledgers = _ledgers.filter((_l: Ledger) => _l.address !== address);
          setStateWithRef(_ledgers, setLedgers, ledgersRef);
        }
      }
    );
    const _unsubs = unsubsLedgersRef.current.concat({
      key: address,
      unsub,
    });
    setStateWithRef(_unsubs, setUnsubsLedgers, unsubsLedgersRef);
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
