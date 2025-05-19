// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { unitToPlanck } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { MaybeAddress } from 'types'
import { defaultNominatorProgress } from './defaults'
import { getLocalNominatorSetups, setLocalNominatorSetups } from './local'
import type {
  NominatorProgress,
  NominatorSetup,
  NominatorSetups,
  NominatorSetupsContextInterface,
} from './types'

export const [NominatorSetupContext, useNominatorSetups] =
  createSafeContext<NominatorSetupsContextInterface>()

export const NominatorSetupsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { accounts, stringifiedAccountsKey } = useImportedAccounts()
  const { units } = getNetworkData(network)

  // Store all imported accounts nominator setups
  const [nominatorSetups, setNominatorSetupsState] = useState<NominatorSetups>(
    {}
  )

  // Update nominator setups state
  const setNominatorSetups = (setups: NominatorSetups) => {
    setLocalNominatorSetups(setups)
    setNominatorSetupsState(setups)
  }

  // Gets the setup progress for a connected account. Falls back to default setup if progress does
  // not yet exist
  const getNominatorSetup = (address: MaybeAddress): NominatorSetup => {
    const setup = Object.fromEntries(
      Object.entries(nominatorSetups).filter(([k]) => k === address)
    )
    return (
      setup[address || ''] || {
        progress: defaultNominatorProgress,
        section: 1,
        simple: false,
      }
    )
  }

  const setNominatorSetup = (
    progress: NominatorProgress,
    simple: boolean = false
  ) => {
    if (activeAddress) {
      const updatedSetups = updateSetups(
        { ...nominatorSetups },
        progress,
        activeAddress,
        undefined,
        simple
      )
      setNominatorSetups(updatedSetups)
    }
  }

  // Remove setup progress for an account
  const removeNominatorSetup = (address: MaybeAddress) => {
    const updatedSetups = Object.fromEntries(
      Object.entries(nominatorSetups).filter(([k]) => k !== address)
    )
    setNominatorSetups(updatedSetups)
  }

  // Sets a nominator setup section for an address
  const setNominatorSetupSection = (section: number) => {
    if (activeAddress) {
      const newSetups = { ...nominatorSetups }
      const updatedSetups = updateSetups(
        newSetups,
        newSetups[activeAddress]?.progress || defaultNominatorProgress,
        activeAddress,
        section
      )
      setNominatorSetups(updatedSetups)
    }
  }

  // Utility to update the progress item of a nominator setup
  const updateSetups = (
    all: NominatorSetups,
    progress: NominatorProgress,
    account: string,
    maybeSection: number | undefined,
    maybeSimple?: boolean
  ) => {
    const current = Object.assign(all[account] || {})
    const section = maybeSection ?? current.section ?? 1
    const simple = maybeSimple ?? current.simple ?? false

    all[account] = {
      ...current,
      progress,
      section,
      simple,
    }
    return all
  }

  // Gets the stake setup progress as a percentage for an address
  const getNominatorSetupPercent = (address: MaybeAddress) => {
    if (!address) {
      return 0
    }
    const { progress } = getNominatorSetup(address)
    const bond = new BigNumber(unitToPlanck(progress?.bond || '0', units))

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

  // Update setup state when active address, network or imported accounts change
  useEffectIgnoreInitial(() => {
    if (accounts.length) {
      setNominatorSetups(getLocalNominatorSetups())
    }
  }, [activeAddress, network, stringifiedAccountsKey])

  return (
    <NominatorSetupContext.Provider
      value={{
        getNominatorSetup,
        setNominatorSetup,
        removeNominatorSetup,
        getNominatorSetupPercent,
        setNominatorSetupSection,
      }}
    >
      {children}
    </NominatorSetupContext.Provider>
  )
}
