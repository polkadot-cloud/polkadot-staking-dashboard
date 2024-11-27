// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useNetwork } from 'contexts/Network';
import { ActivePoolsController } from 'controllers/ActivePools';
import { ApiController } from 'controllers/Api';
import { BalancesController } from 'controllers/Balances';
import { SyncController } from 'controllers/Sync';
import { isCustomEvent } from 'controllers/utils';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import type { MaybeAddress, SystemChainId } from 'types';
import { useEventListener } from 'usehooks-ts';
import * as defaults from './defaults';
import type { BalancesContextInterface } from './types';

export const BalancesContext = createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => useContext(BalancesContext);

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const { network } = useNetwork();
  const { getBondedAccount } = useBonded();
  const { accounts } = useImportedAccounts();
  const createPoolAccounts = useCreatePoolAccounts();
  const { activeAccount, activeProxy } = useActiveAccounts();
  const controller = getBondedAccount(activeAccount);

  // Listen to balance updates for the active account, active proxy and controller.
  const {
    activeBalances,
    getLocks,
    getBalance,
    getLedger,
    getPayee,
    getPoolMembership,
    getNominations,
  } = useActiveBalances({
    accounts: [activeAccount, activeProxy, controller],
  });

  // Check all accounts have been synced. App-wide syncing state for all accounts.
  const newAccountBalancesCallback = (e: Event) => {
    if (
      isCustomEvent(e) &&
      BalancesController.isValidNewAccountBalanceEvent(e)
    ) {
      // Update whether all account balances have been synced.
      checkBalancesSynced();

      const { address, ...newBalances } = e.detail;
      const { poolMembership } = newBalances;

      // If a pool membership exists, let `ActivePools` know of pool membership to re-sync pool
      // details and nominations.
      if (isReady && poolMembership) {
        const { poolId } = poolMembership;
        const newPools = ActivePoolsController.getformattedPoolItems(
          address
        ).concat({
          id: String(poolId),
          addresses: { ...createPoolAccounts(Number(poolId)) },
        });

        const peopleApi = ApiController.getApi(
          `people-${network}` as SystemChainId
        );
        if (peopleApi) {
          ActivePoolsController.syncPools(network, address, newPools);
        }
      }
    }
  };

  // Check whether all accounts have been synced and update state accordingly.
  const checkBalancesSynced = () => {
    if (Object.keys(BalancesController.accounts).length === accounts.length) {
      SyncController.dispatch('balances', 'complete');
    }
  };

  // Gets an account's nonce directly from `BalanceController`. Used at the time of building a
  // payload.
  const getNonce = (address: MaybeAddress) => {
    if (address) {
      const accountBalances = BalancesController.getAccountBalances(
        network,
        address
      );
      const maybeNonce = accountBalances?.balances?.nonce;
      if (maybeNonce) {
        return maybeNonce;
      }
    }
    return 0;
  };

  const documentRef = useRef<Document>(document);

  // Listen for new account balance events.
  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  );

  // If no accounts are imported, set balances synced to true.
  useEffect(() => {
    if (!accounts.length) {
      SyncController.dispatch('balances', 'complete');
    }
  }, [accounts.length]);

  return (
    <BalancesContext.Provider
      value={{
        activeBalances,
        getNonce,
        getLocks,
        getBalance,
        getLedger,
        getPayee,
        getPoolMembership,
        getNominations,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
