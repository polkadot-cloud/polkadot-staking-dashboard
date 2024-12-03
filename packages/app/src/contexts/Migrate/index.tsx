// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useApi } from 'contexts/Api'
import { useSyncing } from 'hooks/useSyncing'
import type { ReactNode } from 'react'
import { createContext, useState } from 'react'
import { version } from '../../../package.json'

export const MigrateContext = createContext<null>(null)

export const MigrateProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi()
  const { syncing } = useSyncing(['initialization'])

  // The local app version of the current user.
  const localAppVersion = localStorage.getItem('app_version')

  // Store whether the migration check has taken place.
  const [done, setDone] = useState<boolean>(localAppVersion === version)

  // Removes local era stakers data and locale data.
  const removeLocalErasAndLocales = () => {
    // Remove local exposure and validator data.
    localStorage.removeItem('polkadot_validators')
    localStorage.removeItem('polkadot_exposures')
    localStorage.removeItem('polkadot_era_exposures')

    localStorage.removeItem('kusama_validators')
    localStorage.removeItem('kusama_exposures')
    localStorage.removeItem('kusama_era_exposures')

    localStorage.removeItem('westend_validators')
    localStorage.removeItem('westend_exposures')
    localStorage.removeItem('westend_era_exposures')

    // Remove locale data.
    localStorage.removeItem('lng_resources')
  }

  useEffectIgnoreInitial(() => {
    if (isReady && !syncing && !done) {
      // Carry out migrations if local version is different to current version.
      if (localAppVersion !== version) {
        // Added in 1.4.3
        //
        // Remove local era stakers data and locale data. Paged rewards are now active and local
        // exposure data is now stale. Over subscribed data has also been removed, so locale data
        // pertaining to over subscribed validators is also stale and causes errors as keys point to
        // undefined data now.
        removeLocalErasAndLocales()

        // Finally,
        //
        // Update local version to current app version.
        localStorage.setItem('app_version', version)
        setDone(true)
      }
    }
  }, [isReady, syncing])

  return (
    <MigrateContext.Provider value={null}>{children}</MigrateContext.Provider>
  )
}
