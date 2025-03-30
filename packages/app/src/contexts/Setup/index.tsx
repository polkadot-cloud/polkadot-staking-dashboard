// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { localStorageOrDefault, unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { createSafeContext } from 'hooks/useSafeContext'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { BondFor, MaybeAddress } from 'types'
import { defaultNominatorProgress, defaultPoolProgress } from './defaults'
import type {
  NominatorProgress,
  NominatorSetup,
  NominatorSetups,
  PoolProgress,
  PoolSetup,
  PoolSetups,
  SetupContextInterface,
} from './types'

export const [SetupContext, useSetup] =
  createSafeContext<SetupContextInterface>()

export const SetupProvider = ({ children }: { children: ReactNode }) => {
  const {
    network,
    networkData: { units },
  } = useNetwork()
  const { accounts } = useImportedAccounts()
  const { activeAccount } = useActiveAccounts()

  // Store all imported accounts nominator setups
  const [nominatorSetups, setNominatorSetups] = useState<NominatorSetups>({})

  // Store all imported accounts pool creation setups
  const [poolSetups, setPoolSetups] = useState<PoolSetups>({})

  // Generates the default setup objects or the currently connected accounts. Refers to local
  // storage to hydrate state, falls back to defaults otherwise
  const refreshSetups = () => {
    setNominatorSetups(localNominatorSetups())
    setPoolSetups(localPoolSetups())
  }

  // Type guard to check if setup is a pool or nominator
  const isPoolSetup = (setup: NominatorSetup | PoolSetup): setup is PoolSetup =>
    (setup as PoolSetup).progress?.metadata !== undefined

  // Utility to get the default progress based on type
  const defaultProgress = (type: BondFor): PoolProgress | NominatorProgress =>
    type === 'nominator'
      ? (defaultNominatorProgress as NominatorProgress)
      : (defaultPoolProgress as PoolProgress)

  // Utility to get the default setup based on type
  const defaultSetup = (type: BondFor): NominatorSetup | PoolSetup =>
    type === 'nominator'
      ? { section: 1, progress: defaultProgress(type) as NominatorProgress }
      : { section: 1, progress: defaultProgress(type) as PoolProgress }

  // Gets the setup progress for a connected account. Falls back to default setup if progress does
  // not yet exist
  const getSetupProgress = (
    type: BondFor,
    address: MaybeAddress
  ): NominatorSetup | PoolSetup => {
    const setup = Object.fromEntries(
      Object.entries(
        type === 'nominator' ? nominatorSetups : poolSetups
      ).filter(([k]) => k === address)
    )
    return (
      setup[address || ''] || {
        progress: defaultProgress(type),
        section: 1,
      }
    )
  }

  // Getter to ensure a nominator setup is returned
  const getNominatorSetup = (address: MaybeAddress): NominatorSetup => {
    const setup = getSetupProgress('nominator', address)
    if (isPoolSetup(setup)) {
      return defaultSetup('nominator') as NominatorSetup
    }
    return setup
  }

  // Getter to ensure a pool setup is returned
  const getPoolSetup = (address: MaybeAddress): PoolSetup => {
    const setup = getSetupProgress('pool', address)
    if (!isPoolSetup(setup)) {
      return defaultSetup('pool') as PoolSetup
    }
    return setup
  }

  // Remove setup progress for an account
  const removeSetupProgress = (type: BondFor, address: MaybeAddress) => {
    const updatedSetups = Object.fromEntries(
      Object.entries(
        type === 'nominator' ? nominatorSetups : poolSetups
      ).filter(([k]) => k !== address)
    )
    setSetups(type, updatedSetups)
  }

  // Sets setup progress for an address. Updates localStorage followed by app state
  const setActiveAccountSetup = (
    type: BondFor,
    progress: NominatorProgress | PoolProgress
  ) => {
    if (!activeAccount) {
      return
    }

    const updatedSetups = updateSetups(
      assignSetups(type),
      progress,
      activeAccount
    )
    setSetups(type, updatedSetups)
  }

  // Sets active setup section for an address
  const setActiveAccountSetupSection = (type: BondFor, section: number) => {
    if (!activeAccount) {
      return
    }

    const setups = assignSetups(type)
    const updatedSetups = updateSetups(
      setups,
      setups[activeAccount]?.progress ?? defaultProgress(type),
      activeAccount,
      section
    )
    setSetups(type, updatedSetups)
  }

  // Utility to update the progress item of either a nominator setup or pool setup
  const updateSetups = <
    T extends NominatorSetups | PoolSetups,
    U extends NominatorProgress | PoolProgress,
  >(
    all: T,
    newSetup: U,
    account: string,
    maybeSection?: number
  ) => {
    const current = Object.assign(all[account] || {})
    const section = maybeSection ?? current.section ?? 1

    all[account] = {
      ...current,
      progress: newSetup,
      section,
    }

    return all
  }

  // Gets the stake setup progress as a percentage for an address
  const getNominatorSetupPercent = (address: MaybeAddress) => {
    if (!address) {
      return 0
    }
    const setup = getSetupProgress('nominator', address) as NominatorSetup
    const { progress } = setup
    const bond = new BigNumber(
      unitToPlanck(progress?.bond || '0', units).toString()
    )

    const p = 33
    let percentage = 0
    if (bond.isGreaterThan(0)) {
      percentage += p
    }
    if (progress.nominations.length) {
      percentage += p
    }
    if (progress.payee.destination !== null) {
      percentage += p
    }
    return percentage
  }

  // Gets the stake setup progress as a percentage for an address
  const getPoolSetupPercent = (address: MaybeAddress) => {
    if (!address) {
      return 0
    }
    const setup = getSetupProgress('pool', address) as PoolSetup
    const { progress } = setup
    const bond = new BigNumber(
      unitToPlanck(progress?.bond || '0', units).toString()
    )

    const p = 25
    let percentage = 0
    if (progress.metadata !== '') {
      percentage += p
    }
    if (bond.isGreaterThan(0)) {
      percentage += p
    }
    if (progress.nominations.length) {
      percentage += p
    }
    if (progress.roles !== null) {
      percentage += p - 1
    }
    return percentage
  }

  // Utility to copy the current setup state based on setup type
  const assignSetups = (type: BondFor) =>
    type === 'nominator' ? { ...nominatorSetups } : { ...poolSetups }

  // Utility to get nominator setups, type casted as NominatorSetups
  const localNominatorSetups = () =>
    localStorageOrDefault('nominator_setups', {}, true) as NominatorSetups

  // Utility to get pool setups, type casted as PoolSetups
  const localPoolSetups = () =>
    localStorageOrDefault('pool_setups', {}, true) as PoolSetups

  // Utility to update setups state depending on type
  const setSetups = (type: BondFor, setups: NominatorSetups | PoolSetups) => {
    setLocalSetups(type, setups)

    if (type === 'nominator') {
      setNominatorSetups(setups as NominatorSetups)
    } else {
      setPoolSetups(setups as PoolSetups)
    }
  }

  // Utility to either update local setups or remove if empty
  const setLocalSetups = (
    type: BondFor,
    setups: NominatorSetups | PoolSetups
  ) => {
    const key = type === 'nominator' ? 'nominator_setups' : 'pool_setups'
    const setupsStr = JSON.stringify(setups)

    if (setupsStr === '{}') {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, setupsStr)
    }
  }

  // Update setup state when activeAccount changes
  useEffectIgnoreInitial(() => {
    if (accounts.length) {
      refreshSetups()
    }
  }, [activeAccount, network, accounts])

  return (
    <SetupContext.Provider
      value={{
        removeSetupProgress,
        getNominatorSetupPercent,
        getPoolSetupPercent,
        setActiveAccountSetup,
        setActiveAccountSetupSection,
        getNominatorSetup,
        getPoolSetup,
      }}
    >
      {children}
    </SetupContext.Provider>
  )
}
