// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import type { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, MaybeAccount } from 'types';
import { clipAddress, rmCommas, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import type {
  Delegate,
  ProxiesContextInterface,
  Proxy,
  ProxyAccount,
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
  const { accounts, activeAccount } = useConnect();

  // store the proxy accounts of each imported account.
  const [proxies, setProxies] = useState<Array<Proxy>>([]);
  const proxiesRef = useRef(proxies);

  const [unsubs, setUnsubs] = useState<AnyApi>([]);
  const unsubsRef = useRef(unsubs);

  const [delegators, setDelegators] = useState<Array<MaybeAccount>>([]);
  const delegatorsRef = useRef(delegators);

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

  // unsubscribe from proxy subscriptions on unmount
  useEffect(() => {
    Object.values(unsubsRef.current).forEach(({ unsub }: AnyApi) => {
      unsub();
    });
  }, []);

  useEffect(() => {
    const allProxies = [];
    const proxiedAccounts = [];
    for (const a of accounts) {
      const proxy = proxiesRef.current.find(
        (p: Proxy) => p.delegator === a.address
      );
      if (proxy) {
        allProxies.push(proxy);
      }
    }
    for (const p of allProxies) {
      if (p.delegates.find((d: Delegate) => d.delegate === activeAccount)) {
        proxiedAccounts.push(p.delegator);
      }
    }
    setStateWithRef(proxiedAccounts, setDelegators, delegatorsRef);
  }, [proxiesRef.current]);

  const subscribeToProxies = async (address: string) => {
    if (!api) return;

    const unsub: () => void = await api.queryMulti<AnyApi>(
      [[api.query.proxy.proxies, address]],
      async ([result]): Promise<void> => {
        let newProxy: Proxy;

        const data = result.toHuman();
        const newProxies = data[0];
        const reserved = new BigNumber(rmCommas(data[1]));

        if (newProxies.length) {
          newProxy = {
            delegator: address,
            delegates: newProxies.map((d: AnyApi) => ({
              delegate: d.delegate.toString(),
              type: d.proxyType.toString(),
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

  // Gets the proxy accounts for a given proxy via the delegate
  const getDelegates = (address: MaybeAccount) => {
    if (!address) {
      return [];
    }
    const proxy = proxiesRef.current.find(
      (p: Proxy) => p.delegator === address
    );
    if (!proxy) {
      return [];
    }
    const delegates: Array<ProxyAccount> = proxy.delegates
      .filter((d: Delegate) => ['Any', 'Staking'].includes(d.type))
      .map((d: Delegate) => ({
        address: d.delegate,
        name: clipAddress(d.delegate),
        type: d.type,
      }));
    return delegates || [];
  };

  return (
    <ProxiesContext.Provider
      value={{
        proxies: proxiesRef.current,
        delegators: delegatorsRef.current,
        getDelegates,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
};
