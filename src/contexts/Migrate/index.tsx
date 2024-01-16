// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useState } from 'react';
import { NetworkList } from 'config/networks';
import { AppVersion } from 'consts';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { localStorageOrDefault } from '@polkadot-cloud/utils';
import type { ExternalAccount } from '@polkadot-cloud/react/types';

export const MigrateContext = createContext<null>(null);

export const MigrateProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const { isNetworkSyncing } = useUi();
  const { accounts } = useImportedAccounts();

  // The local app version of the current user.
  const localAppVersion = localStorage.getItem('app_version');

  // Store whether the migration check has taken place.
  const [done, setDone] = useState<boolean>(localAppVersion === AppVersion);

  // Removes the previous nominator setup objects from local storage.
  const removeDeprecatedNominatorSetups = () =>
    Object.values(NetworkList).forEach((n) => {
      for (const a of accounts) {
        localStorage.removeItem(`${n.name}_stake_setup_${a.address}`);
      }
    });

  // Removes the previous pool setup objects from local storage.
  const removeDeprecatedPoolSetups = () =>
    Object.values(NetworkList).forEach((n) => {
      for (const a of accounts) {
        localStorage.removeItem(`${n.name}_pool_setup_${a.address}`);
      }
    });

  // Removes the previous active proxies from local storage.
  const removeDeprecatedActiveProxies = () =>
    Object.values(NetworkList).forEach((n) => {
      localStorage.removeItem(`${n.name}_active_proxy`);
    });

  // Removes `system` added external accounts from local storage.
  const removeSystemExternalAccounts = () => {
    const current = localStorageOrDefault('external_accounts', [], true);
    if (!current.length) {
      return;
    }

    const updated =
      (current as ExternalAccount[])?.filter((a) => a.addedBy !== 'system') ||
      [];

    if (!updated.length) {
      localStorage.removeItem('external_accounts');
    } else {
      localStorage.setItem('external_accounts', JSON.stringify(updated));
    }
  };

  // Removes `westend_era_exposures` from local storage.
  const removeWestendEraExposures = () => {
    localStorage.removeItem('westend_era_exposures');
  };

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

        // Added in 1.1.2
        //
        // Remove local `system` external accounts.
        removeSystemExternalAccounts();

        // Added in 1.1.3
        //
        // Remove local `era_exposures`.
        removeWestendEraExposures();

        // Finally,
        //
        // Update local version to current app version.
        localStorage.setItem('app_version', AppVersion);
        setDone(true);
      }
    }
  }, [isReady, isNetworkSyncing]);

  return (
    <MigrateContext.Provider value={null}>{children}</MigrateContext.Provider>
  );
};
