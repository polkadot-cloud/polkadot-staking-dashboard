// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import {
  addedTo,
  ellipsisFn,
  localStorageOrDefault,
  matchedProperties,
  removedFrom,
  rmCommas,
  setStateWithRef,
} from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { isSupportedProxy } from 'config/proxies';
import { useApi } from 'contexts/Api';
import type { AnyApi, MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
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
  const unsubs = useRef<Record<string, VoidFn>>({});

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
          const unsub = unsubs.current[address];
          if (unsub) {
            unsub();
          }
        }
      });

      unsubs.current = Object.fromEntries(
        Object.entries(unsubs.current).filter(([key]) => !removed.includes(key))
      );
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
    handleRemovedAccounts();
    handleAddedAccounts();
    handleExistingAccounts();
  };

  const subscribeToProxies = async (address: string) => {
    if (!api) {
      return undefined;
    }

    const unsub = await api.queryMulti<AnyApi>(
      [[api.query.proxy.proxies, address]],
      async ([result]) => {
        const data = result.toHuman();
        const newProxies = data[0];
        const reserved = new BigNumber(rmCommas(data[1]));

        if (newProxies.length) {
          setStateWithRef(
            [...proxiesRef.current]
              .filter(({ delegator }) => delegator !== address)
              .concat({
                address,
                delegator: address,
                delegates: newProxies.map((d: AnyApi) => ({
                  delegate: d.delegate.toString(),
                  proxyType: d.proxyType.toString(),
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
              ({ delegator }) => delegator !== address
            ),
            setProxies,
            proxiesRef
          );
        }
      }
    );

    unsubs.current[address] = unsub;
    return unsub;
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

  // Subscribe new accounts to proxies, and remove accounts that are no longer imported.
  useEffectIgnoreInitial(() => {
    if (isReady) {
      handleSyncAccounts();
    }
  }, [accounts, isReady, network]);

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

  // Reset active proxy state, unsubscribe from subscriptions on network change & unmount.
  useEffectIgnoreInitial(() => {
    setActiveProxy(null, false);
    unsubAll();
    return () => unsubAll();
  }, [network]);

  const unsubAll = () => {
    for (const unsub of Object.values(unsubs.current)) {
      unsub();
    }
    unsubs.current = {};
  };

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
