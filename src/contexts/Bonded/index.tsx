// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  addedTo,
  matchedProperties,
  removedFrom,
  setStateWithRef,
} from '@w3ux/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { useApi } from 'contexts/Api';
import type { MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts';
import * as defaults from './defaults';
import type { BondedContextInterface } from './types';
import type { BondedAccount } from 'model/Subscribe/Bonded/types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'controllers/utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { Bonded } from 'model/Subscribe/Bonded';

export const BondedContext = createContext<BondedContextInterface>(
  defaults.defaultBondedContext
);

export const useBonded = () => useContext(BondedContext);

export const BondedProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { api, isReady } = useApi();
  const { accounts } = useImportedAccounts();
  const { addExternalAccount } = useExternalAccounts();
  const { addOrReplaceOtherAccount } = useOtherAccounts();

  // Bonded accounts state.
  const [bondedAccounts, setBondedAccounts] = useState<BondedAccount[]>([]);
  const bondedAccountsRef = useRef(bondedAccounts);

  // Handle the syncing of accounts on accounts change.
  const handleSyncAccounts = () => {
    // Sync removed accounts.
    const handleRemovedAccounts = () => {
      const removed = removedFrom(accounts, bondedAccountsRef.current, [
        'address',
      ]).map(({ address }) => address);

      removed?.forEach((address) => {
        SubscriptionsController.remove(network, `bondedAccount-${address}`);
      });
    };

    // Sync added accounts.
    const handleAddedAccounts = () => {
      const added = addedTo(accounts, bondedAccountsRef.current, ['address']);

      if (added.length) {
        // Subscribe to all newly added accounts bonded and nominator status.
        added.map(({ address }) => subscribeToBondedAccount(address));
      }
    };

    // Sync existing accounts.
    const handleExistingAccounts = () => {
      setStateWithRef(
        matchedProperties(accounts, bondedAccountsRef.current, ['address']),
        setBondedAccounts,
        bondedAccountsRef
      );
    };
    handleRemovedAccounts();
    handleAddedAccounts();
    handleExistingAccounts();
  };

  // Subscribe to account, get controller and nominations.
  const subscribeToBondedAccount = async (address: string) => {
    if (!api) {
      return undefined;
    }

    // Initialise bonded subscription.
    SubscriptionsController.set(
      network,
      `bondedAccount-${address}`,
      new Bonded(network, address)
    );
  };

  // Get bonded account by address.
  const getBondedAccount = (address: MaybeAddress) =>
    bondedAccountsRef.current.find((a) => a.address === address)?.bonded ||
    null;

  // Handle new bonded account event.
  const handleNewBondedAccount = (e: Event) => {
    if (isCustomEvent(e)) {
      const { address, bonded } = e.detail;

      // Add `bonded` (controller) account as external account if not presently imported
      if (bonded) {
        if (accounts.find((s) => s.address === bonded) === undefined) {
          const result = addExternalAccount(bonded, 'system');
          if (result) {
            addOrReplaceOtherAccount(result.account, result.type);
          }
        }
      }

      // Remove stale account if it's already in list.
      const newBonded = Object.values(bondedAccountsRef.current)
        .filter((a) => a.address !== address)
        .concat({ address, bonded });

      setStateWithRef(newBonded, setBondedAccounts, bondedAccountsRef);
    }
  };

  // Listen for new bonded accounts.
  useEventListener(
    'new-bonded-account',
    handleNewBondedAccount,
    useRef<Document>(document)
  );

  // Handle accounts sync on connected accounts change.
  useEffectIgnoreInitial(() => {
    if (isReady) {
      handleSyncAccounts();
    }
  }, [accounts, network, isReady]);

  return (
    <BondedContext.Provider
      value={{
        getBondedAccount,
        bondedAccounts,
      }}
    >
      {children}
    </BondedContext.Provider>
  );
};
