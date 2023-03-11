// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import type { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi } from 'types';
import { rmCommas, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import type { Delegate, ProxiesContextInterface, Proxy } from './type';

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
  // if (!api) return;
  // const unsub = api.queryMulti<AnyApi>(
  //   [
  //     [
  //       api.query.proxy.proxies,
  //       '5FADqQ1Qcm2qnbRtSoVshoKwzxzZUeV8nexs2p7eaT4bhgzA',
  //     ],
  //   ],
  //   async ([result]): Promise<void> => {
  //     console.log(result.toHuman());
  //     const newProxies = result.toHuman();
  //     if (newProxies != null) {
  //       const { data, reserved } = newProxies;
  //       console.log(data, reserved);
  //       console.log(newProxies[0]);
  //       console.log(newProxies[1]);
  //       console.log(new BigNumber(rmCommas(newProxies[1].toString())));
  //       const news = [];
  //       for (const proxy of newProxies[0]) {
  //         const { delegate, proxyType } = proxy;
  //         console.log(delegate, proxyType);
  //         newDelegates.push({
  //           accounts: delegate,
  //           type: proxyType,
  //         });
  //       }
  //       console.log(newDelegates);
  //     }
  //   }
  // );

  // proxy accounts state
  const [proxy, setProxy] = useState<Array<Proxy>>([]);
  const proxyRef = useRef(proxy);

  const [unsubs, setUnsubs] = useState<AnyApi>([]);
  const unsubsRef = useRef(unsubs);

  useEffect(() => {
    if (isReady) {
      // local updated values
      let newProxy = proxyRef.current;
      const newUnsubsProxy = unsubsRef.current;

      // get accounts removed: use these to unsubscribe
      const accountsRemoved = proxyRef.current.filter(
        (a: Proxy) =>
          !accounts.find((c: ImportedAccount) => c.address === a.delegator)
      );

      const accountsAdded = accounts.filter(
        (c: ImportedAccount) =>
          !proxyRef.current.find((a: Proxy) => a.delegator === c.address)
      );

      // update proxy state for removal
      newProxy = proxyRef.current.filter((l: Proxy) =>
        accounts.find((c: ImportedAccount) => c.address === l.delegator)
      );
      if (newProxy.length < proxyRef.current.length) {
        accountsRemoved.forEach((p: Proxy) => {
          const unsub = unsubsRef.current.find(
            (u: AnyApi) => u.key === p.delegator
          );
          if (unsub) {
            unsub.unsub();
            newUnsubsProxy.filter((u: AnyApi) => u.key !== p.delegator);
          }
        });
        setStateWithRef(newProxy, setProxy, proxyRef);
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
          const newDelegates: Array<Delegate> = [];

          for (const d of newProxies) {
            const { delegate, proxyType } = d;
            newDelegates.push({
              account: delegate.toString(),
              type: proxyType.toString(),
            });
          }

          updatedProxy = {
            delegator: address,
            delegates: newDelegates,
            reserved: new BigNumber(reserved),
          };

          let currentProxy = Object.values(proxyRef.current);
          currentProxy = currentProxy
            .filter((d: Proxy) => d.delegator !== updatedProxy.delegator)
            .concat(updatedProxy);

          setStateWithRef(currentProxy, setProxy, proxyRef);
        } else {
          // no proxies: remove stale proxies if already in list.
          let newProxy = Object.values(proxyRef.current);
          newProxy = newProxy.filter((d: Proxy) => d.delegator !== address);
          setStateWithRef(newProxy, setProxy, proxyRef);
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
        proxyMeta: proxyRef.current,
      }}
    >
      {children}
    </ProxiesContext.Provider>
  );
};