// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import { NetworkList } from 'config/networks';
import { AppVersion } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';

export const MigrateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady } = useApi();
  const { accounts } = useConnect();
  const { isNetworkSyncing } = useUi();

  // The local app version of the current user.
  const localAppVersion = localStorage.getItem('app_version');

  // Store whether the migration check has taken place.
  const [done, setDone] = useState<boolean>(localAppVersion === AppVersion);

  // Removes the previous nominator setup objects from local storage.
  const removeDeprecatedNominatorSetups = () =>
    Object.values(NetworkList).forEach((n: any) => {
      for (const a of accounts)
        localStorage.removeItem(`${n.name}_stake_setup_${a.address}`);
    });

  // Removes the previous pool setup objects from local storage.
  const removeDeprecatedPoolSetups = () =>
    Object.values(NetworkList).forEach((n: any) => {
      for (const a of accounts)
        localStorage.removeItem(`${n.name}_pool_setup_${a.address}`);
    });

  // Removes the previous active proxies from local storage.
  const removeDeprecatedActiveProxies = () =>
    Object.values(NetworkList).forEach((n: any) => {
      localStorage.removeItem(`${n.name}_active_proxy`);
    });

  useEffectIgnoreInitial(() => {
    if (isReady && !isNetworkSyncing && !done) {
      // Carry out migrations if local version is different to current version.
      if (localAppVersion !== AppVersion) {
        // Added in 1.0.2.
        //
        // Remove local language resources. No expiry.
        localStorage.removeItem('lng_resources');

        // Added in 1.0.4.
        //
        // Remove legacy local nominator setup and pool setup items.
        removeDeprecatedNominatorSetups();
        removeDeprecatedPoolSetups();

        // Added in 1.0.8.
        //
        // Remove legacy local active proxy records.
        removeDeprecatedActiveProxies();

        // Finally,
        //
        // Update local version to current app version.
        localStorage.setItem('app_version', AppVersion);
        setDone(true);
      }
    }
  }, [isNetworkSyncing]);

  return (
    <MigrateContext.Provider value={{}}>{children}</MigrateContext.Provider>
  );
};

export const MigrateContext = React.createContext<any>(null);
