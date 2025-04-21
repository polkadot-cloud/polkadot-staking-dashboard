// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import type { Sync } from '@w3ux/types'
import { shuffle } from '@w3ux/utils'
import { ErasValidatorRewardMulti } from 'api/queryMulti/erasValidatorRewardMulti'
import { ValidatorsMulti } from 'api/queryMulti/validatorsMulti'
import type { ErasRewardPoints } from 'api/subscribe/erasRewardPoints'
import BigNumber from 'bignumber.js'
import type { AnyApi } from 'common-types'
import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { Apis } from 'controllers/Apis'
import { Identities } from 'controllers/Identities'
import { Subscriptions } from 'controllers/Subscriptions'
import { useErasPerDay } from 'hooks/useErasPerDay'
import { fetchActiveValidatorRanks } from 'plugin-staking-api'
import type { ActiveValidatorRank } from 'plugin-staking-api/types'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type {
  ChainId,
  Identity,
  SuperIdentity,
  SystemChainId,
  Validator,
  ValidatorStatus,
} from 'types'
import { perbillToPercent } from 'utils'
import type {
  ValidatorAddresses,
  ValidatorListEntry,
  Validators,
  ValidatorsContextInterface,
} from '../types'
import { getLocalEraValidators, setLocalEraValidators } from '../Utils'
import {
  defaultAverageEraValidatorReward,
  defaultValidatorsData,
} from './defaults'

export const [ValidatorsContext, useValidators] =
  createSafeContext<ValidatorsContextInterface>()

export const ValidatorsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const {
    isReady,
    getConsts,
    serviceApi,
    getApiStatus,
    relayMetrics: { earliestStoredSession },
  } = useApi()
  const { activeEra } = useApi()
  const { pluginEnabled } = usePlugins()
  const { stakers } = useStaking().eraStakers
  const { erasPerDay, maxSupportedDays } = useErasPerDay()

  const { ss58 } = getNetworkData(network)
  const { historyDepth } = getConsts(network)

  // Store validator entries and sync status
  const [validators, setValidators] = useState<Validators>({
    status: 'unsynced',
    validators: [],
  })
  // Setter for validator status
  const setValidatorsFetched = (status: Sync) =>
    setValidators({ ...validators, status })

  // Getter for validator entries
  const getValidators = () => validators.validators

  // Store validator identity data
  const [validatorIdentities, setValidatorIdentities] = useState<
    Record<string, Identity>
  >({})

  // Store validator super identity data
  const [validatorSupers, setValidatorSupers] = useState<
    Record<string, SuperIdentity>
  >({})

  // Stores the currently active validator set
  const [sessionValidators, setSessionValidators] = useState<string[]>([])

  // Stores the currently active parachain validator set
  const [sessionParaValidators, setSessionParaValidators] = useState<string[]>(
    []
  )

  // Stores the average network commission rate
  const [avgCommission, setAvgCommission] = useState<number>(0)

  // Stores active validator ranks
  const [activeValidatorRanks, setActiveValidatorRanks] = useState<
    ActiveValidatorRank[]
  >([])

  // Average rerward rate
  const [averageEraValidatorReward, setAverageEraValidatorReward] = useState<{
    days: number
    reward: BigNumber
  }>(defaultAverageEraValidatorReward)

  // Fetch validator entries and format the returning data
  const getValidatorEntries = async () => {
    if (!isReady) {
      return defaultValidatorsData
    }

    const result = await serviceApi.query.validatorEntries()

    const entries: Validator[] = []
    let notFullCommissionCount = 0
    let totalNonAllCommission = new BigNumber(0)
    result.forEach(([address, { commission, blocked }]) => {
      const commissionAsPercent = perbillToPercent(commission)

      if (!commissionAsPercent.isEqualTo(100)) {
        totalNonAllCommission = totalNonAllCommission.plus(commissionAsPercent)
      } else {
        notFullCommissionCount++
      }

      entries.push({
        address: address.address(ss58),
        prefs: {
          commission: Number(commissionAsPercent.toFixed(2)),
          blocked,
        },
      })
    })

    return { entries, notFullCommissionCount, totalNonAllCommission }
  }

  // Fetches and formats the active validator set, and derives metrics from the result
  const fetchValidators = async () => {
    if (!isReady || validators.status !== 'unsynced') {
      return
    }
    setValidatorsFetched('syncing')

    // If local validator entries exist for the current era, store these values in state. Otherwise,
    // fetch entries from API
    const localEraValidators = getLocalEraValidators(
      network,
      activeEra.index.toString()
    )

    // The validator entries for the current active era
    let validatorEntries: Validator[] = []
    // Average network commission for all non 100% commissioned validators
    let avg = 0

    if (localEraValidators) {
      validatorEntries = localEraValidators.entries
      avg = localEraValidators.avgCommission
    } else {
      const { entries, notFullCommissionCount, totalNonAllCommission } =
        await getValidatorEntries()

      validatorEntries = entries
      avg = notFullCommissionCount
        ? totalNonAllCommission
            .dividedBy(notFullCommissionCount)
            .decimalPlaces(2)
            .toNumber()
        : 0
    }

    // Set entries data for the era to local storage
    setLocalEraValidators(
      network,
      activeEra.index.toString(),
      validatorEntries,
      avg
    )
    setAvgCommission(avg)
    // NOTE: validators are shuffled before committed to state
    setValidators({ status: 'synced', validators: shuffle(validatorEntries) })

    const peopleApiId: ChainId = `people-${network}`
    const peopleApiClient = Apis.getClient(`people-${network}` as SystemChainId)
    if (peopleApiClient) {
      const addresses = validatorEntries.map(({ address }) => address)
      const { identities, supers } = await Identities.fetch(
        peopleApiId,
        addresses
      )
      setValidatorIdentities(identities)
      setValidatorSupers(supers)
    }
  }

  // Subscribe to active session validators
  const fetchSessionValidators = async () => {
    if (!isReady) {
      return
    }
    const result = (await serviceApi.query.sessionValidators()).map((a) =>
      a.address(ss58)
    )
    setSessionValidators(result)
  }

  // Subscribe to active parachain validators
  const getParachainValidators = async () => {
    const sessionAccounts = (
      await serviceApi.query.paraSessionAccounts(earliestStoredSession)
    )?.map((a) => a.address(ss58))

    setSessionParaValidators(sessionAccounts || [])
  }

  // Fetches prefs for a list of validators
  const fetchValidatorPrefs = async (addresses: ValidatorAddresses) => {
    if (!addresses.length) {
      return null
    }

    const v: string[] = []
    const vMulti: [string][] = []
    for (const { address } of addresses) {
      v.push(address)
      vMulti.push([address])
    }

    const resultsMulti =
      (await new ValidatorsMulti(network, vMulti).fetch()) || []

    const formatted: Validator[] = []
    for (let i = 0; i < resultsMulti.length; i++) {
      const prefs: AnyApi = resultsMulti[i]

      if (prefs) {
        formatted.push({
          address: v[i],
          prefs: {
            commission: Number(perbillToPercent(prefs.commission).toString()),
            blocked: prefs.blocked,
          },
        })
      }
    }
    return formatted
  }

  // Formats a list of addresses with validator preferences
  const formatWithPrefs = (addresses: string[]) =>
    addresses.map((address) => ({
      address,
      prefs: getValidators().find((v) => v.address === address)?.prefs || {
        blocked: false,
        commission: 0,
      },
    }))

  // Inject status into validator entries
  const injectValidatorListData = (
    entries: Validator[]
  ): ValidatorListEntry[] => {
    const injected: ValidatorListEntry[] =
      entries.map((entry) => {
        const inEra =
          stakers.find(({ address }) => address === entry.address) || false

        let validatorStatus: ValidatorStatus = 'waiting'
        if (inEra) {
          validatorStatus = 'active'
        }
        return {
          ...entry,
          validatorStatus,
        }
      }) || []

    return injected
  }

  // Gets a validator's total stake, if any
  const getValidatorTotalStake = (address: string): bigint => {
    const entry = getValidators().find((v) => v.address === address)
    if (!entry) {
      return 0n
    }
    const inEra = stakers.find((staker) => staker.address === entry.address)
    if (!inEra) {
      return 0n
    }
    let totalStake = 0n
    const { others, own } = inEra
    if (own) {
      totalStake = totalStake + BigInt(own)
    }
    others.forEach(({ value }) => {
      totalStake = totalStake + BigInt(value)
    })
    return totalStake
  }

  // Gets average validator reward for provided number of days
  const getAverageEraValidatorReward = async () => {
    if (!isReady || activeEra.index === 0) {
      setAverageEraValidatorReward({
        days: 0,
        reward: new BigNumber(0),
      })
      return
    }

    // If max supported days is less than 30, use 15 day average instead
    const days = maxSupportedDays > 30 ? 30 : 15

    // Calculates the number of eras required to calculate required `days`, not surpassing
    // historyDepth
    const endEra = Math.max(
      activeEra.index - erasPerDay * days,
      Math.max(0, activeEra.index - historyDepth)
    )

    const eras: string[] = []
    let thisEra = activeEra.index - 1
    do {
      eras.push(thisEra.toString())
      thisEra = thisEra - 1
    } while (thisEra >= endEra)

    const erasMulti: [number][] = eras.map((e) => [Number(e)])
    const results = await new ErasValidatorRewardMulti(
      network,
      erasMulti
    ).fetch()

    const reward = results
      .map((v) => {
        const value = new BigNumber(!v ? 0 : v)
        if (value.isNaN()) {
          return new BigNumber(0)
        }
        return value
      })
      .reduce((prev, current) => prev.plus(current), new BigNumber(0))
      .div(eras.length)

    setAverageEraValidatorReward({ days, reward })
  }

  const getActiveValidatorRanks = async (): Promise<void> => {
    const result = await fetchActiveValidatorRanks(network)
    setActiveValidatorRanks(result.activeValidatorRanks)
  }

  const getValidatorRank = (validator: string): number | undefined => {
    if (pluginEnabled('staking_api')) {
      return activeValidatorRanks.find((r) => r.validator === validator)?.rank
    } else {
      const sub = Subscriptions.get(
        network,
        'erasRewardPoints'
      ) as ErasRewardPoints
      if (!sub) {
        return undefined
      }
      const rank = sub.getRank(validator)
      if (!rank) {
        return undefined
      }
      return rank
    }
  }

  const getValidatorRankSegment = (validator: string): number => {
    const fallbackSegment = 100
    if (pluginEnabled('staking_api')) {
      const totalValidators = activeValidatorRanks.length
      if (totalValidators === 0) {
        return fallbackSegment
      }
      // Find the rank of the given validator
      const rank = getValidatorRank(validator)
      if (!rank) {
        return fallbackSegment
      }
      const percentile = (rank / totalValidators) * 100
      const segment = Math.ceil(percentile / 10) * 10
      return segment
    } else {
      const sub = Subscriptions.get(
        network,
        'erasRewardPoints'
      ) as ErasRewardPoints

      if (!sub) {
        return fallbackSegment
      }
      const rank = sub.getRank(validator)
      if (!rank) {
        return fallbackSegment
      }
      const percentile = (rank / sub.ranks.length) * 100
      const segment = Math.ceil(percentile / 10) * 10
      return segment
    }
  }

  // Reset validator state data on network change
  useEffectIgnoreInitial(() => {
    setValidators({
      status: 'unsynced',
      validators: [],
    })
    setSessionValidators([])
    setSessionParaValidators([])
    setAvgCommission(0)
    setValidatorIdentities({})
    setValidatorSupers({})
    setAverageEraValidatorReward(defaultAverageEraValidatorReward)
  }, [network])

  // Refetch active validator ranks when network changes
  useEffect(() => {
    if (pluginEnabled('staking_api')) {
      getActiveValidatorRanks()
    }
  }, [network, pluginEnabled('staking_api')])

  // Fetch validators and era reward points when fetched status changes
  useEffect(() => {
    if (isReady && activeEra.index > 0) {
      fetchValidators()
    }
  }, [validators.status, isReady, getApiStatus(`people-${network}`), activeEra])

  // Mark unsynced and fetch session validators and average reward when activeEra changes
  useEffectIgnoreInitial(() => {
    if (isReady && activeEra.index > 0) {
      if (validators.status === 'synced') {
        setValidatorsFetched('unsynced')
      }
      fetchSessionValidators()
      getAverageEraValidatorReward()
    }
  }, [isReady, activeEra])

  // Fetch parachain session validators when `earliestStoredSession` ready
  useEffectIgnoreInitial(() => {
    if (isReady && earliestStoredSession > 0) {
      getParachainValidators()
    }
  }, [isReady, earliestStoredSession.toString()])

  return (
    <ValidatorsContext.Provider
      value={{
        fetchValidatorPrefs,
        injectValidatorListData,
        getValidators,
        validatorIdentities,
        validatorSupers,
        avgCommission,
        sessionValidators,
        sessionParaValidators,
        validatorsFetched: validators.status,
        averageEraValidatorReward,
        formatWithPrefs,
        getValidatorTotalStake,
        getValidatorRank,
        getValidatorRankSegment,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  )
}
