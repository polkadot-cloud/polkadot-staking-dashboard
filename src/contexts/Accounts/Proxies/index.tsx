// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import type { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi } from 'types';
import { clipAddress, rmCommas, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import type { ProxyAccount, ProxiesContextInterface, Proxy } from './type';

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
  const { accounts } = useConnect();

  // store the proxy accounts of each imported account.
  const [proxies, setProxies] = useState<Array<Proxy>>([]);
  const proxiesRef = useRef(proxies);

  const [unsubs, setUnsubs] = useState<AnyApi>([]);
  const unsubsRef = useRef(unsubs);

  useEffect(() => {
    if (isReady) {
      // local updated values
      let newProxy = proxiesRef.current;
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
      newProxy = proxiesRef.current.filter((l: Proxy) =>
        accounts.find((c: ImportedAccount) => c.address === l.delegator)
      );
      if (newProxy.length < proxiesRef.current.length) {
        accountsRemoved.forEach((p: Proxy) => {
          const unsub = unsubsRef.current.find(
            (u: AnyApi) => u.key === p.delegator
          );
          if (unsub) {
            unsub.unsub();
            newUnsubsProxy.filter((u: AnyApi) => u.key !== p.delegator);
          }
        });
        setStateWithRef(newProxy, setProxies, proxiesRef);
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

  const subscribeToProxies = async (address: string) => {
    if (!api) return;

    const unsub: () => void = await api.queryMulti<AnyApi>(
      [[api.query.proxy.proxies, address]],
      async ([result]): Promise<void> => {
        let updatedProxy: Proxy;

        const data = result.toHuman();
        const newProxies = data[0];
        const reserved = rmCommas(data[1]);

        if (newProxies.length) {
          const newDelegates: Array<ProxyAccount> = [];

          for (const d of newProxies) {
            const { delegate, proxyType } = d;
            newDelegates.push({
              address: delegate.toString(),
              name: clipAddress(delegate.toString()),
              type: proxyType.toString(),
            });
          }

          updatedProxy = {
            delegator: address,
            delegates: newDelegates,
            reserved: new BigNumber(reserved),
          };

          let currentProxy = Object.values(proxiesRef.current);
          currentProxy = currentProxy
            .filter((d: Proxy) => d.delegator !== updatedProxy.delegator)
            .concat(updatedProxy);

          setStateWithRef(currentProxy, setProxies, proxiesRef);
        } else {
          // no proxies: remove stale proxies if already in list.
          let newProxy = Object.values(proxiesRef.current);
          newProxy = newProxy.filter((d: Proxy) => d.delegator !== address);
          setStateWithRef(newProxy, setProxies, proxiesRef);
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

  return (
    <ProxiesContext.Provider
      value={{
        // getProxies,
        // isProxied,
        proxies: proxiesRef.current,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
};