// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  clipAddress,
  localStorageOrDefault,
  rmCommas,
  setStateWithRef,
} from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { isSupportedProxy } from 'config/proxies';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import type { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, MaybeAccount } from 'types';
import * as defaults from './defaults';
import type {
  DelegateItem,
  Delegates,
  ProxiedAccounts,
  Proxies,
  ProxiesContextInterface,
  Proxy,
  ProxyDelegate,
} from './type';

export const ProxiesContext = React.createContext<ProxiesContextInterface>(
  defaults.defaultProxiesContext
);

export const useProxies = () => React.useContext(ProxiesContext);

export const ProxiesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network } = useApi();
  const { accounts, activeProxy, setActiveProxy, activeAccount } = useConnect();

  // store the proxy accounts of each imported account.
  const [proxies, setProxies] = useState<Proxies>([]);
  const proxiesRef = useRef(proxies);

  // store unsubs for proxy subscriptions.
  const [unsubs, setUnsubs] = useState<AnyApi>([]);
  const unsubsRef = useRef(unsubs);

  // store the delegates and the corresponding delegators
  const [delegates, setDelegates] = useState<Delegates>({});
  const delegatesRef = useRef(delegates);

  const subscribeToProxies = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [[api.query.proxy.proxies, address]],
      async ([result]) => {
        let newProxy: Proxy;

        const data = result.toHuman();
        const newProxies = data[0];
        const reserved = new BigNumber(rmCommas(data[1]));

        if (newProxies.length) {
          newProxy = {
            delegator: address,
            delegates: newProxies.map((d: AnyApi) => ({
              delegate: d.delegate.toString(),
              proxyType: d.proxyType.toString(),
            })),
            reserved,
          };

          setStateWithRef(
            [...proxiesRef.current]
              .filter((d: Proxy) => d.delegator !== address)
              .concat(newProxy),
            setProxies,
            proxiesRef
          );
        } else {
          // no proxies: remove stale proxies if already in list.
          setStateWithRef(
            [...proxiesRef.current].filter(
              (d: Proxy) => d.delegator !== address
            ),
            setProxies,
            proxiesRef
          );
        }
      }
    );

    setStateWithRef(
      unsubsRef.current.concat({ key: address, unsub }),
      setUnsubs,
      unsubsRef
    );
    return unsub;
  };

  // Gets the delegates of the given account
  const getDelegates = (address: MaybeAccount): Proxy | undefined => {
    return (
      proxiesRef.current.find((p: Proxy) => p.delegator === address) ||
      undefined
    );
  };

  // Gets delegators and proxy types for the given delegate address
  const getProxiedAccounts = (address: MaybeAccount) => {
    const delegate = delegatesRef.current[address || ''];
    if (!delegate) {
      return [];
    }
    const proxiedAccounts: ProxiedAccounts = delegate
      .filter(({ proxyType }: DelegateItem) => isSupportedProxy(proxyType))
      .map((d: DelegateItem) => ({
        address: d.delegator,
        name: clipAddress(d.delegator),
        proxyType: d.proxyType,
      }));
    return proxiedAccounts;
  };

  // Gets the delegates and proxy type of an account, if any.
  const getProxyDelegate = (
    delegator: MaybeAccount,
    delegate: MaybeAccount
  ): ProxyDelegate | null =>
    proxiesRef.current
      .find((p: Proxy) => p.delegator === delegator)
      ?.delegates.find((d: ProxyDelegate) => d.delegate === delegate) ?? null;

  // Subscribe new accounts to proxies, and remove accounts that are no longer imported.
  useEffect(() => {
    if (isReady) {
      const newUnsubsProxy = unsubsRef.current;

      // get accounts removed: use these to unsubscribe
      const accountsRemoved = proxiesRef.current.filter(
        (a: Proxy) =>
          !accounts.find((c: ImportedAccount) => c.address === a.delegator)
      );

      const accountsAdded = accounts.filter(
        (c: ImportedAccount) =>
          !proxiesRef.current.find((a: Proxy) => a.delegator === c.address)
      );

      // update proxy state for removal
      const newProxies = proxiesRef.current.filter((l: Proxy) =>
        accounts.find((c: ImportedAccount) => c.address === l.delegator)
      );
      if (newProxies.length < proxiesRef.current.length) {
        accountsRemoved.forEach((p: Proxy) => {
          const unsub = unsubsRef.current.find(
            (u: AnyApi) => u.key === p.delegator
          );
          if (unsub) {
            unsub.unsub();
            newUnsubsProxy.filter((u: AnyApi) => u.key !== p.delegator);
          }
        });
        setStateWithRef(newProxies, setProxies, proxiesRef);
        setStateWithRef(newUnsubsProxy, setUnsubs, unsubsRef);
      }

      // if accounts have changed, update state with new unsubs / accounts
      if (accountsAdded.length) {
        // subscribe to added accounts
        accountsAdded.map((a: ImportedAccount) =>
          subscribeToProxies(a.address)
        );
      }
    }
  }, [accounts, isReady, network]);

  // Listens to `proxies` state updates and reformats the data into a list of delegates.
  useEffect(() => {
    // Reformat proxiesRef.current into a list of delegates.
    const newDelegates: Delegates = {};
    for (const proxy of proxiesRef.current) {
      const { delegator } = proxy;

      // checking if delegator is not null to keep types happy.
      if (delegator) {
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
    }

    setStateWithRef(newDelegates, setDelegates, delegatesRef);
  }, [proxiesRef.current]);

  // If active proxy has not yet been set, check local storage `activeProxy` & set it as active
  // proxy if it is the delegate of `activeAccount`.
  useEffect(() => {
    const localActiveProxy = localStorageOrDefault(
      `${network.name}_active_proxy`,
      null
    );

    if (!localActiveProxy) {
      setActiveProxy(null);
    } else if (
      proxiesRef.current.length &&
      localActiveProxy &&
      !activeProxy &&
      activeAccount
    ) {
      const isActive = (
        proxiesRef.current.find((p: Proxy) => p.delegator === activeAccount)
          ?.delegates || []
      ).find((p: ProxyDelegate) => p.delegate === localActiveProxy);

      if (isActive) {
        setActiveProxy(localActiveProxy);
      }
    }
  }, [accounts, activeAccount, proxiesRef.current, network]);

  // Unsubscribe from proxy subscriptions on unmount.
  useEffect(() => {
    return () =>
      Object.values(unsubsRef.current).forEach(({ unsub }: AnyApi) => {
        unsub();
      });
  }, []);

  return (
    <ProxiesContext.Provider
      value={{
        proxies: proxiesRef.current,
        delegates: delegatesRef.current,
        getDelegates,
        getProxyDelegate,
        getProxiedAccounts,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
};
