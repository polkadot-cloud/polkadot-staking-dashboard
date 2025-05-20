// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import type {
  EraStakers,
  Exposure,
  StakingContextInterface,
} from 'contexts/Staking/types'
import { removeSyncing, setSyncing } from 'global-bus'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import type { MaybeAddress, NominationStatus } from 'types'
import Worker from 'workers/stakers?worker'
import type { ProcessExposuresResponse } from 'workers/types'
import { useApi } from '../Api'
import { defaultEraStakers } from './defaults'
import { getLocalEraExposures, setLocalEraExposures } from './Utils'

const worker = new Worker()

export const [StakingContext, useStaking] =
  createSafeContext<StakingContextInterface>()

export const StakingProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { getStakingLedger, getNominations } = useBalances()
  const { isReady, activeEra, getApiStatus, serviceApi } = useApi()
  const { units } = getNetworkData(network)

  // Store eras stakers in state
  const [eraStakers, setEraStakers] = useState<EraStakers>(defaultEraStakers)
  const eraStakersRef = useRef(eraStakers)

  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data }: { data: ProcessExposuresResponse } = message
      const { task, networkName, era } = data

      // Ensure task matches, & era is still the same
      if (
        task !== 'processExposures' ||
        networkName !== network ||
        era !== activeEra.index.toString()
      ) {
        return
      }

      const {
        stakers,
        totalActiveNominators,
        activeValidators,
        activeAccountOwnStake,
        who,
      } = data

      // Check if account hasn't changed since worker started
      if (activeAddress === who) {
        // Syncing current eraStakers is now complete
        removeSyncing('era-stakers')

        setStateWithRef(
          {
            ...eraStakersRef.current,
            stakers,
            totalActiveNominators,
            activeValidators,
            activeAccountOwnStake,
          },
          setEraStakers,
          eraStakersRef
        )
      }
    }
  }

  // Fetches erasStakers exposures for an era, and saves to `localStorage`
  const fetchEraStakers = async (era: string) => {
    if (!isReady || activeEra.index === 0) {
      return []
    }

    let exposures: Exposure[] = []
    const localExposures = getLocalEraExposures(
      network,
      era,
      activeEra.index.toString()
    )

    if (localExposures) {
      exposures = localExposures
    } else {
      exposures = await getPagedErasStakers(era)
    }

    // For resource limitation concerns, only store the current era in local storage
    if (era === activeEra.index.toString()) {
      setLocalEraExposures(network, era, exposures)
    }

    return exposures
  }

  // Fetches the active nominator set and metadata around it
  const fetchActiveEraStakers = async () => {
    if (!isReady || activeEra.index === 0) {
      return
    }
    setSyncing('era-stakers')
    const exposures = await fetchEraStakers(activeEra.index.toString())

    // Worker to calculate stats
    worker.postMessage({
      era: activeEra.index.toString(),
      networkName: network,
      task: 'processExposures',
      activeAccount: activeAddress,
      units,
      exposures,
    })
  }

  // Gets the nomination statuses of passed in nominations
  const getNominationsStatusFromTargets = (
    who: MaybeAddress,
    fromTargets: string[]
  ) => {
    const statuses: Record<string, NominationStatus> = {}

    if (!fromTargets.length) {
      return statuses
    }

    for (const target of fromTargets) {
      const staker = eraStakersRef.current.stakers.find(
        ({ address }) => address === target
      )

      if (staker === undefined) {
        statuses[target] = 'waiting'
        continue
      }

      if (!(staker.others ?? []).find((o) => o.who === who)) {
        statuses[target] = 'inactive'
        continue
      }
      statuses[target] = 'active'
    }
    return statuses
  }

  // Helper function to determine whether the active account is bonding, or is yet to start
  const isBonding = () =>
    (getStakingLedger(activeAddress).ledger?.active || 0n) > 0n

  // Helper function to determine whether the active account
  const isUnlocking = () =>
    (getStakingLedger(activeAddress).ledger?.unlocking || []).length

  // Helper function to determine whether the active account is nominating, or is yet to start
  const isNominating = () => getNominations(activeAddress).length > 0

  // Helper function to determine whether the active account is nominating, or is yet to start
  const inSetup = () =>
    !activeAddress || (!isBonding() && !isNominating() && !isUnlocking())

  // Fetch eras stakers from storage
  const getPagedErasStakers = async (era: string) => {
    const overview = await serviceApi.query.erasStakersOverviewEntries(
      activeEra.index
    )
    const validators: Record<string, { own: bigint; total: bigint }> =
      overview.reduce(
        (prev, [[, validator], { own, total }]) => ({
          ...prev,
          [validator]: { own, total },
        }),
        {}
      )
    const validatorKeys = Object.keys(validators)

    const pagedResults = await Promise.all(
      validatorKeys.map((v) =>
        serviceApi.query.erasStakersPagedEntries(Number(era), v)
      )
    )

    const result: Exposure[] = []
    let i = 0
    for (const pages of pagedResults) {
      // NOTE: Only one page is fetched for each validator for now
      const page = pages[0]

      // NOTE: Some pages turn up as undefined - might be worth exploring further
      if (!page) {
        continue
      }

      const [keyArgs, { others }] = page

      const validator = validatorKeys[i]
      const { own, total } = validators[validator]

      result.push({
        keys: [keyArgs[0].toString(), validator],
        val: {
          total: total.toString(),
          own: own.toString(),
          others: others.map(({ who, value }) => ({
            who,
            value: value.toString(),
          })),
        },
      })
      i++
    }
    return result
  }

  useEffectIgnoreInitial(() => {
    if (getApiStatus(network) === 'connecting') {
      setStateWithRef(defaultEraStakers, setEraStakers, eraStakersRef)
    }
  }, [getApiStatus(network)])

  // Handle syncing with eraStakers
  useEffectIgnoreInitial(() => {
    if (isReady) {
      fetchActiveEraStakers()
    }
  }, [isReady, activeEra.index, activeAddress])

  return (
    <StakingContext.Provider
      value={{
        fetchEraStakers,
        getNominationsStatusFromTargets,
        isBonding,
        isNominating,
        inSetup,
        eraStakers,
        getPagedErasStakers,
      }}
    >
      {children}
    </StakingContext.Provider>
  )
}
