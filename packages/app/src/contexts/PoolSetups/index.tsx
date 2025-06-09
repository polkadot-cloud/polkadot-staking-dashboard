// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { useState, type ReactNode } from 'react'
import type { MaybeAddress } from 'types'
import { defaultPoolProgress } from './defaults'
import { getLocalPoolSetups, setLocalPoolSetups } from './local'
import type {
  PoolProgress,
  PoolSetup,
  PoolSetups,
  PoolSetupsContextInterface,
} from './types'

export const [PoolSetupsContext, usePoolSetups] =
  createSafeContext<PoolSetupsContextInterface>()

export const PoolSetupsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { accounts, stringifiedAccountsKey } = useImportedAccounts()
  const { units } = getStakingChainData(network)

  // Store all imported accounts pool creation setups
  const [poolSetups, setPoolSetupsState] = useState<PoolSetups>({})

  // Update setups state depending on type
  const setPoolSetups = (setups: PoolSetups) => {
    setLocalPoolSetups(setups)
    setPoolSetupsState(setups)
  }

  // Gets a pool setup progress for a connected account. Falls back to default setup if progress
  // does not yet exist
  const getPoolSetup = (address: MaybeAddress): PoolSetup => {
    const setup = Object.fromEntries(
      Object.entries(poolSetups).filter(([k]) => k === address)
    )
    return (
      setup[address || ''] || {
        progress: defaultPoolProgress,
        section: 1,
      }
    )
  }

  // Sets pool setup progress for an address
  const setPoolSetup = (progress: PoolProgress) => {
    if (activeAddress) {
      const newSetups = updateSetups({ ...poolSetups }, progress, activeAddress)
      setPoolSetups(newSetups)
    }
  }

  // Remove setup progress for an account
  const removePoolSetup = (address: MaybeAddress) => {
    const updatedSetups = Object.fromEntries(
      Object.entries(poolSetups).filter(([k]) => k !== address)
    )
    setPoolSetups(updatedSetups)
  }

  // Update the progress item of a pool setup
  const updateSetups = (
    all: PoolSetups,
    progress: PoolProgress,
    address: string,
    maybeSection?: number
  ) => {
    const current = Object.assign(all[address] || {})
    const section = maybeSection ?? current.section ?? 1

    all[address] = {
      ...current,
      progress,
      section,
    }
    return all
  }

  // Gets the stake setup progress as a percentage for an address
  const getPoolSetupPercent = (address: MaybeAddress) => {
    if (!address) {
      return 0
    }
    const { progress } = getPoolSetup(address)
    const bond = new BigNumber(unitToPlanck(progress?.bond || '0', units))

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

  // Sets active setup section for an address
  const setPoolSetupSection = (section: number) => {
    if (activeAddress) {
      const newSetups = { ...poolSetups }
      const updatedSetups = updateSetups(
        newSetups,
        newSetups[activeAddress]?.progress ?? defaultPoolProgress,
        activeAddress,
        section
      )
      setPoolSetups(updatedSetups)
    }
  }

  // Update setup state when active address, network or imported accounts change
  useEffectIgnoreInitial(() => {
    if (accounts.length) {
      setPoolSetups(getLocalPoolSetups())
    }
  }, [activeAddress, network, stringifiedAccountsKey])

  return (
    <PoolSetupsContext.Provider
      value={{
        getPoolSetup,
        setPoolSetup,
        removePoolSetup,
        getPoolSetupPercent,
        setPoolSetupSection,
      }}
    >
      {children}
    </PoolSetupsContext.Provider>
  )
}
