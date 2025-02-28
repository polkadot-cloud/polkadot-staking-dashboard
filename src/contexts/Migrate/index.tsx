// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useState } from 'react';
import { AppVersion } from 'consts';
import { useApi } from 'contexts/Api';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { localStorageOrDefault } from '@w3ux/utils';
import type { ExternalAccount } from '@w3ux/react-connect-kit/types';
import { useSyncing } from 'hooks/useSyncing';

export const MigrateContext = createContext<null>(null);

export const MigrateProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const { syncing } = useSyncing(['initialization']);

  // The local app version of the current user.
  const localAppVersion = localStorage.getItem('app_version');

  // Store whether the migration check has taken place.
  const [done, setDone] = useState<boolean>(localAppVersion === AppVersion);

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
    if (isReady && !syncing && !done) {
      // Carry out migrations if local version is different to current version.
      if (localAppVersion !== AppVersion) {
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
  }, [isReady, syncing]);

  return (
    <MigrateContext.Provider value={null}>{children}</MigrateContext.Provider>
  );
};
