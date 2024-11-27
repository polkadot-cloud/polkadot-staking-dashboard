// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import {
  addedTo,
  ellipsisFn,
  localStorageOrDefault,
  matchedProperties,
  removedFrom,
  setStateWithRef,
} from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { isSupportedProxy } from 'config/proxies';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useNetwork } from 'contexts/Network';
import { defaultNetwork } from 'contexts/Network/defaults';
import { ApiController } from 'controllers/Api';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { isCustomEvent } from 'controllers/utils';
import { ProxiesQuery } from 'model/Query/ProxiesQuery';
import { AccountProxies } from 'model/Subscribe/AccountProxies';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { AnyApi, MaybeAddress, NetworkName } from 'types';
import { useEventListener } from 'usehooks-ts';
import * as defaults from './defaults';
import type {
  Delegates,
  ProxiedAccounts,
  Proxies,
  ProxiesContextInterface,
  Proxy,
  ProxyDelegate,
} from './types';

export const ProxiesContext = createContext<ProxiesContextInterface>(
  defaults.defaultProxiesContext
);

export const useProxies = () => useContext(ProxiesContext);

export const ProxiesProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const { network } = useNetwork();
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
          SubscriptionsController.remove(network, `accountProxies-${address}`);
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

  const subscribeToProxies = async (address: string) => {
    SubscriptionsController.set(
      network,
      `accountProxies-${address}`,
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
    const pApi = ApiController.getApi(network);
    if (!pApi) {
      return [];
    }

    const result = await new ProxiesQuery(pApi, delegator).fetch();
    const proxy = result[0] || [];

    let addDelegatorAsExternal = false;
    for (const { delegate: newDelegate } of proxy) {
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

  // Handle account proxies events.
  const handleAccountProxies = (e: Event) => {
    if (isCustomEvent(e)) {
      const { address: eventAddress, proxies: eventProxies } = e.detail;

      const newProxies = eventProxies[0];
      const reserved = new BigNumber(eventProxies[1].toString());

      if (newProxies.length) {
        setStateWithRef(
          [...proxiesRef.current]
            .filter(({ delegator }) => delegator !== eventAddress)
            .concat({
              address: eventAddress,
              delegator: eventAddress,
              delegates: newProxies.map((d: AnyApi) => ({
                delegate: d.delegate.toString(),
                proxyType: d.proxy_type.type.toString(),
              })),
              reserved,
            }),
          setProxies,
          proxiesRef
        );
      } else {
        // no proxies: remove stale proxies if already in list.
        setStateWithRef(
          [...proxiesRef.current].filter(
            ({ delegator }) => delegator !== eventAddress
          ),
          setProxies,
          proxiesRef
        );
      }
    }
  };

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

  // Reset active proxy state on network change & unmount.
  useEffectIgnoreInitial(() => {
    setStateWithRef([], setProxies, proxiesRef);
    setActiveProxy(null, false);
  }, [network]);

  const documentRef = useRef<Document>(document);
  useEventListener('new-account-proxies', handleAccountProxies, documentRef);

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
