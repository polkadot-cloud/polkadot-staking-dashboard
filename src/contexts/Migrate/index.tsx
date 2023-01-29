// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NetworkList } from 'config/networks';
import { AppVersion } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import React, { useEffect, useState } from 'react';

export const MigrateContext = React.createContext<any>(null);

export const MigrateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady } = useApi();
  const { accounts } = useConnect();
  const { networkSyncing } = useUi();

  // The local app version of the current user.
  const localAppVersion = localStorage.getItem('app_version');

  // Store whether the migration check has taken place.
  const [done, setDone] = useState<boolean>(localAppVersion === AppVersion);

  // Removes the previous nominator setup objects from local storage.
  const removeNominatorSetups = () =>
    Object.values(NetworkList).forEach((n: any) => {
      for (const a of accounts)
        localStorage.removeItem(`${n.name}_stake_setup_${a.address}`);
    });

  useEffect(() => {
    if (isReady && !networkSyncing && !done) {
      // Carry out migrations if local version is different to current version.
      if (localAppVersion !== AppVersion) {
        // Added in 1.0.2.
        //
        // Remove local language resources. No expiry.
        localStorage.removeItem('lng_resources');

        // Added in 1.0.4.
        //
        // Remove legacy local nominator setup items.
        removeNominatorSetups();

        // Finally,
        //
        // Update local version to current app version.
        localStorage.setItem('app_version', AppVersion);
        setDone(true);
      }
    }
  }, [networkSyncing]);

  return (
    <MigrateContext.Provider value={{}}>{children}</MigrateContext.Provider>
  );
};
