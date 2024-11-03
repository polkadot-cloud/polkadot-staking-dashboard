// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  addedTo,
  ellipsisFn,
  localStorageOrDefault,
  matchedProperties,
  removedFrom,
  setStateWithRef,
} from '@w3ux/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { isSupportedProxy } from 'config/proxies';
import { useApi } from 'contexts/Api';
import type { AnyApi, MaybeAddress, NetworkName } from 'types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts';
import * as defaults from './defaults';
import type {
  Delegates,
  ProxiedAccounts,
  Proxies,
  ProxiesContextInterface,
  Proxy,
  ProxyDelegate,
} from './types';
import { defaultNetwork } from 'contexts/Network/defaults';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { AccountProxies } from 'model/Subscribe/AccountProxies';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'controllers/utils';

export const ProxiesContext = createContext<ProxiesContextInterface>(
  defaults.defaultProxiesContext
);

export const useProxies = () => useContext(ProxiesContext);

export const ProxiesProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { api, isReady } = useApi();
  const { accounts } = useImportedAccounts();
  const { addExternalAccount } = useExternalAccounts();
  const { addOrReplaceOtherAccount } = useOtherAccounts();
  const { activeProxy, setActiveProxy, activeAccount } = useActiveAccounts();

  // Store the proxy accounts of each imported account.
  const [proxies, setProxies] = useState<Proxies>([]);
  const proxiesRef = useRef(proxies);

  // Store the last network proxies were synced on.
  const [lastSyncedNetwork, setLastSyncedNetwork] =
    useState<NetworkName>(defaultNetwork);

  // Reformats proxies into a list of delegates.
  const formatProxiesToDelegates = () => {
    // Reformat proxies into a list of delegates.
    const newDelegates: Delegates = {};
    for (const proxy of proxies) {
      const { delegator } = proxy;
      // checking if delegator is not null to keep types happy.
      if (!delegator) {
        continue;
      }

      // get each delegate of this proxy record.
      for (const { delegate, proxyType } of proxy.delegates) {
        const item = {
          delegator,
          proxyType,
        };
        // check if this delegate exists in `newDelegates`.
        if (Object.keys(newDelegates).includes(delegate)) {
          // append delegator to the existing delegate record if it exists.
          newDelegates[delegate].push(item);
        } else {
          // create a new delegate record if it does not yet exist in `newDelegates`.
          newDelegates[delegate] = [item];
        }
      }
    }
    return newDelegates;
  };

  const delegates = formatProxiesToDelegates();

  // Handle the syncing of accounts on accounts change.
  const handleSyncAccounts = () => {
    // Sync removed accounts.
    const handleRemovedAccounts = () => {
      const removed = removedFrom(accounts, proxies, ['address']).map(
        ({ address }) => address
      );

      removed?.forEach((address) => {
        // if delegates still exist for removed account, re-add the account as a read only system
        // account.
        if (delegates[address]) {
          const importResult = addExternalAccount(address, 'system');
          if (importResult) {
            addOrReplaceOtherAccount(importResult.account, importResult.type);
          }
        } else {
          SubscriptionsController.remove(network, `proxies-${address}`);
        }
      });
    };
    // Sync added accounts.
    const handleAddedAccounts = () => {
      addedTo(accounts, proxies, ['address'])?.map(({ address }) =>
        subscribeToProxies(address)
      );
    };
    // Sync existing accounts.
    const handleExistingAccounts = () => {
      setStateWithRef(
        matchedProperties(accounts, proxies, ['address']),
        setProxies,
        proxiesRef
      );
    };

    // Ensure that accounts from a previous network are not being synced.
    if (lastSyncedNetwork === network) {
      handleRemovedAccounts();
      handleAddedAccounts();
      handleExistingAccounts();
    }

    // Update the last network proxies were synced on.
    setLastSyncedNetwork(network);
  };

  // Initialize account proxies subscription.
  const subscribeToProxies = async (address: string) => {
    SubscriptionsController.set(
      network,
      `proxies-${address}`,
      new AccountProxies(network, address)
    );
  };

  // Gets the delegates of the given account.
  const getDelegates = (address: MaybeAddress): Proxy | undefined =>
    proxies.find(({ delegator }) => delegator === address) || undefined;

  // Gets delegators and proxy types for the given delegate address.
  const getProxiedAccounts = (address: MaybeAddress): ProxiedAccounts => {
    const delegate = delegates[address || ''];
    if (!delegate) {
      return [];
    }

    return delegate
      .filter(({ proxyType }) => isSupportedProxy(proxyType))
      .map(({ delegator, proxyType }) => ({
        address: delegator,
        name: ellipsisFn(delegator),
        proxyType,
      }));
  };

  // Queries the chain to check if the given delegator & delegate pair is valid proxy. Used when a
  // proxy account is being manually declared.
  const handleDeclareDelegate = async (delegator: string) => {
    if (!api) {
      return [];
    }

    const result: AnyApi = (await api.query.proxy.proxies(delegator)).toHuman();

    let addDelegatorAsExternal = false;
    for (const { delegate: newDelegate } of result[0] || []) {
      if (
        accounts.find(({ address }) => address === newDelegate) &&
        !delegates[newDelegate]
      ) {
        subscribeToProxies(delegator);
        addDelegatorAsExternal = true;
      }
    }
    if (addDelegatorAsExternal) {
      const importResult = addExternalAccount(delegator, 'system');
      if (importResult) {
        addOrReplaceOtherAccount(importResult.account, importResult.type);
      }
    }

    return [];
  };

  // Gets the delegates and proxy type of an account, if any.
  const getProxyDelegate = (
    delegator: MaybeAddress,
    delegate: MaybeAddress
  ): ProxyDelegate | null =>
    proxies
      .find((p) => p.delegator === delegator)
      ?.delegates.find((d) => d.delegate === delegate) ?? null;

  // Handle new account proxies event.
  const handleNewAccountProxies = (e: Event) => {
    if (isCustomEvent(e)) {
      const { address, proxies: eventProxies } = e.detail;

      if (eventProxies) {
        // Add address proxies to context state.
        setStateWithRef(
          [...proxiesRef.current]
            .filter(({ delegator }) => delegator !== address)
            .concat(eventProxies),
          setProxies,
          proxiesRef
        );
      } else {
        // no proxies: remove stale proxies if already in list.
        setStateWithRef(
          [...proxiesRef.current].filter(
            ({ delegator }) => delegator !== address
          ),
          setProxies,
          proxiesRef
        );
      }
    }
  };

  // Listen for new bonded accounts.
  useEventListener(
    'new-account-proxies',
    handleNewAccountProxies,
    useRef<Document>(document)
  );

  // If active proxy has not yet been set, check local storage `activeProxy` & set it as active
  // proxy if it is the delegate of `activeAccount`.
  useEffectIgnoreInitial(() => {
    const localActiveProxy = localStorageOrDefault(
      `${network}_active_proxy`,
      null
    );

    if (!localActiveProxy) {
      setActiveProxy(null);
    } else if (
      proxies.length &&
      localActiveProxy &&
      !activeProxy &&
      activeAccount
    ) {
      try {
        const { address, proxyType } = JSON.parse(localActiveProxy);
        // Add proxy address as external account if not imported.
        if (!accounts.find((a) => a.address === address)) {
          const importResult = addExternalAccount(address, 'system');
          if (importResult) {
            addOrReplaceOtherAccount(importResult.account, importResult.type);
          }
        }

        const isActive = (
          proxies.find(({ delegator }) => delegator === activeAccount)
            ?.delegates || []
        ).find((d) => d.delegate === address && d.proxyType === proxyType);
        if (isActive) {
          setActiveProxy({ address, proxyType });
        }
      } catch (e) {
        // Corrupt local active proxy record. Remove it.
        localStorage.removeItem(`${network}_active_proxy`);
      }
    }
  }, [accounts, activeAccount, proxies, network]);

  // Subscribe new accounts to proxies, and remove accounts that are no longer imported.
  useEffectIgnoreInitial(() => {
    if (isReady) {
      handleSyncAccounts();
    }
  }, [accounts, isReady]);

  // Reset active proxy state, unsubscribe from subscriptions on network change & unmount.
  useEffectIgnoreInitial(() => {
    setStateWithRef([], setProxies, proxiesRef);
    setActiveProxy(null, false);
  }, [network]);

  return (
    <ProxiesContext.Provider
      value={{
        handleDeclareDelegate,
        getDelegates,
        getProxyDelegate,
        getProxiedAccounts,
        formatProxiesToDelegates,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
};
