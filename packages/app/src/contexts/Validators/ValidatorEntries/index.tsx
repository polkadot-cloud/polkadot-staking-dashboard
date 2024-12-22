// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import type { AnyJson, Sync } from '@w3ux/types'
import { shuffle } from '@w3ux/utils'
import { ValidatorsEntries } from 'api/entries/validatorsEntries'
import { ParaSessionAccounts } from 'api/query/paraSessionAccounts'
import { SessionValidators } from 'api/query/sessionValidators'
import { ErasRewardPointsMulti } from 'api/queryMulti/erasRewardPointsMulti'
import { ErasValidatorRewardMulti } from 'api/queryMulti/erasValidatorRewardMulti'
import { ValidatorsMulti } from 'api/queryMulti/validatorsMulti'
import BigNumber from 'bignumber.js'
import type { AnyApi, ChainId, SystemChainId } from 'common-types'
import { MaxEraRewardPointsEras } from 'consts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { Apis } from 'controllers/Apis'
import { Identities } from 'controllers/Identities'
import { useErasPerDay } from 'hooks/useErasPerDay'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Identity, SuperIdentity } from 'types'
import { perbillToPercent } from 'utils'
import type {
  EraPointsBoundaries,
  ErasRewardPoints,
  Validator,
  ValidatorAddresses,
  ValidatorEraPointHistory,
  ValidatorListEntry,
  ValidatorsContextInterface,
  ValidatorStatus,
} from '../types'
import { getLocalEraValidators, setLocalEraValidators } from '../Utils'
import {
  defaultAverageEraValidatorReward,
  defaultEraPointsBoundaries,
  defaultValidatorsContext,
  defaultValidatorsData,
} from './defaults'

export const ValidatorsContext = createContext<ValidatorsContextInterface>(
  defaultValidatorsContext
)

export const useValidators = () => useContext(ValidatorsContext)

export const ValidatorsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const {
    isReady,
    peopleApiStatus,
    consts: { historyDepth },
    networkMetrics: { earliestStoredSession },
  } = useApi()
  const { activeEra } = useApi()
  const { stakers } = useStaking().eraStakers
  const { erasPerDay, maxSupportedDays } = useErasPerDay()

  // Stores all validator entries
  const [validators, setValidators] = useState<Validator[]>([])

  // Track whether the validator list has been fetched
  const [validatorsFetched, setValidatorsFetched] = useState<Sync>('unsynced')

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

  // Track whether the validator list has been fetched
  const [erasRewardPointsFetched, setErasRewawrdPointsFetched] =
    useState<Sync>('unsynced')

  // Store era reward points, keyed by era
  const [erasRewardPoints, setErasRewardPoints] = useState<ErasRewardPoints>({})

  // Store validator era points history and metrics
  const [validatorEraPointsHistory, setValidatorEraPointsHistory] = useState<
    Record<string, ValidatorEraPointHistory>
  >({})

  // Store era point high and low for `MaxEraPointsEras` eras
  const [eraPointsBoundaries, setEraPointsBoundaries] =
    useState<EraPointsBoundaries>(defaultEraPointsBoundaries)

  // Average rerward rate
  const [averageEraValidatorReward, setAverageEraValidatorReward] = useState<{
    days: number
    reward: BigNumber
  }>(defaultAverageEraValidatorReward)

  // Processes reward points for a given era
  const processEraRewardPoints = (result: AnyJson, era: BigNumber) => {
    if (erasRewardPoints[era.toString()]) {
      return erasRewardPoints[era.toString()]
    }

    return {
      total: result.total.toString(),
      individual: Object.fromEntries(
        result.individual.map(([key, value]: [number, string]) => [
          key,
          (value as string).toString(),
        ])
      ),
    }
  }

  // Get quartile data for validator performance data
  const getQuartile = (qIndex: number, total: number) => {
    const q1 = Math.ceil(total * 0.25)
    const q2 = Math.ceil(total * 0.5)
    const q3 = Math.ceil(total * 0.75)

    if (qIndex <= q1) {
      return 25
    }
    if (qIndex <= q2) {
      return 50
    }
    if (qIndex <= q3) {
      return 75
    }
    return 100
  }

  // Fetches era reward points for eligible eras
  const fetchErasRewardPoints = async () => {
    if (
      !isReady ||
      activeEra.index.isZero() ||
      erasRewardPointsFetched !== 'unsynced'
    ) {
      return
    }

    setErasRewawrdPointsFetched('syncing')

    // start fetching from the current era
    let currentEra = BigNumber.max(activeEra.index.minus(1), 1)
    const endEra = BigNumber.max(
      currentEra.minus(MaxEraRewardPointsEras - 1),
      1
    )

    // Introduce additional safeguard againt looping forever
    const totalEras = new BigNumber(MaxEraRewardPointsEras)
    let erasProcessed = new BigNumber(0)

    // Iterate eras and process reward points
    const eras = []
    do {
      eras.push(currentEra)
      currentEra = currentEra.minus(1)
      erasProcessed = erasProcessed.plus(1)
    } while (
      currentEra.isGreaterThanOrEqualTo(endEra) &&
      erasProcessed.isLessThan(totalEras)
    )

    const erasMulti: [number][] = eras.map((e) => [e.toNumber()])
    const results = await new ErasRewardPointsMulti(network, erasMulti).fetch()

    // Make calls and format reward point results
    const newErasRewardPoints: ErasRewardPoints = {}
    let i = 0
    for (const result of results) {
      const formatted = processEraRewardPoints(result, eras[i])
      if (formatted) {
        newErasRewardPoints[eras[i].toString()] = formatted
      }
      i++
    }

    let newEraPointsHistory: Record<string, ValidatorEraPointHistory> = {}

    // Calculate points per era and total points per era of each validator
    Object.entries(newErasRewardPoints).forEach(([era, { individual }]) => {
      Object.entries(individual).forEach(([address, points]) => {
        if (!newEraPointsHistory[address]) {
          newEraPointsHistory[address] = {
            eras: {},
            totalPoints: new BigNumber(0),
          }
        } else {
          newEraPointsHistory[address].eras[era] = new BigNumber(points)
          newEraPointsHistory[address].totalPoints =
            newEraPointsHistory[address].totalPoints.plus(points)
        }
      })
    })

    // Iterate `newEraPointsHistory` and re-order the object based on its totalPoints, highest
    // first
    newEraPointsHistory = Object.fromEntries(
      Object.entries(newEraPointsHistory)
        .sort(
          (
            a: [string, ValidatorEraPointHistory],
            b: [string, ValidatorEraPointHistory]
          ) => a[1].totalPoints.minus(b[1].totalPoints).toNumber()
        )
        .reverse()
    )

    const totalEntries = Object.entries(newEraPointsHistory).length
    let j = 0
    newEraPointsHistory = Object.fromEntries(
      Object.entries(newEraPointsHistory).map(([k, v]) => {
        j++
        return [k, { ...v, rank: j, quartile: getQuartile(j, totalEntries) }]
      })
    )

    // Commit results to state
    setErasRewardPoints({
      ...newErasRewardPoints,
    })
    setValidatorEraPointsHistory(newEraPointsHistory)
  }

  // Fetch validator entries and format the returning data
  const getValidatorEntries = async () => {
    if (!isReady) {
      return defaultValidatorsData
    }

    const result = await new ValidatorsEntries(network).fetch()
    const entries: Validator[] = []
    let notFullCommissionCount = 0
    let totalNonAllCommission = new BigNumber(0)
    result.forEach(
      ({ keyArgs: [address], value: { commission, blocked } }: AnyApi) => {
        const commissionAsPercent = perbillToPercent(commission)

        if (!commissionAsPercent.isEqualTo(100)) {
          totalNonAllCommission =
            totalNonAllCommission.plus(commissionAsPercent)
        } else {
          notFullCommissionCount++
        }

        entries.push({
          address,
          prefs: {
            commission: Number(commissionAsPercent.toFixed(2)),
            blocked,
          },
        })
      }
    )

    return { entries, notFullCommissionCount, totalNonAllCommission }
  }

  // Fetches and formats the active validator set, and derives metrics from the result
  const fetchValidators = async () => {
    if (!isReady || validatorsFetched !== 'unsynced') {
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
    setValidators(shuffle(validatorEntries))
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

    setValidatorsFetched('synced')
  }

  // Subscribe to active session validators
  const fetchSessionValidators = async () => {
    if (!isReady) {
      return
    }
    setSessionValidators(await new SessionValidators(network).fetch())
  }

  // Subscribe to active parachain validators
  const getParachainValidators = async () => {
    setSessionParaValidators(
      await new ParaSessionAccounts(
        network,
        earliestStoredSession.toNumber()
      ).fetch()
    )
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
      prefs: validators.find((v) => v.address === address)?.prefs || {
        blocked: false,
        commission: 0,
      },
    }))

  // Gets era points for a validator
  const getValidatorPointsFromEras = (startEra: BigNumber, address: string) => {
    startEra = BigNumber.max(startEra, 1)

    // Minus 1 from `MaxRewardPointsEras` to account for the current era
    const endEra = BigNumber.max(startEra.minus(MaxEraRewardPointsEras - 1), 1)

    const points: Record<string, BigNumber> = {}
    let currentEra = startEra
    do {
      const eraPoints = erasRewardPoints[currentEra.toString()]
      if (eraPoints) {
        const validatorPoints = eraPoints.individual[address]
        points[currentEra.toString()] = new BigNumber(validatorPoints || 0)
      } else {
        points[currentEra.toString()] = new BigNumber(0)
      }
      currentEra = currentEra.minus(1)
    } while (currentEra.isGreaterThanOrEqualTo(endEra))

    return points
  }

  // Gets the highest and lowest (non-zero) era points earned `MaxEraRewardPointsEras` timeframe
  const calculateEraPointsBoundaries = () => {
    let high: BigNumber | null = null
    let low: BigNumber | null = null

    Object.entries(erasRewardPoints).forEach(([, { individual }]) => {
      for (const [, points] of Object.entries(individual)) {
        const p = new BigNumber(points)

        if (p.isGreaterThan(high || 0)) {
          high = p
        }
        if (low === null) {
          low = p
        } else if (p.isLessThan(low) && !p.isZero()) {
          low = p
        }
      }
    })

    setEraPointsBoundaries({
      high: high || new BigNumber(0),
      low: low || new BigNumber(0),
    })
    setErasRewawrdPointsFetched('synced')
  }

  // Inject status into validator entries
  const injectValidatorListData = (
    entries: Validator[]
  ): ValidatorListEntry[] => {
    const injected: ValidatorListEntry[] =
      entries.map((entry) => {
        const inEra =
          stakers.find(({ address }) => address === entry.address) || false

        let totalStake = new BigNumber(0)
        let validatorStatus: ValidatorStatus = 'waiting'
        if (inEra) {
          validatorStatus = 'active'
          const { others, own } = inEra
          if (own) {
            totalStake = totalStake.plus(own)
          }
          others.forEach(({ value }) => {
            totalStake = totalStake.plus(value)
          })
        }
        return {
          ...entry,
          totalStake,
          validatorStatus,
        }
      }) || []

    return injected
  }

  // Gets average validator reward for provided number of days
  const getAverageEraValidatorReward = async () => {
    if (!isReady || activeEra.index.isZero()) {
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
    const endEra = BigNumber.max(
      activeEra.index.minus(erasPerDay.multipliedBy(days)),
      BigNumber.max(0, activeEra.index.minus(historyDepth))
    )

    const eras: string[] = []
    let thisEra = activeEra.index.minus(1)
    do {
      eras.push(thisEra.toString())
      thisEra = thisEra.minus(1)
    } while (thisEra.gte(endEra))

    const erasMulti: [number][] = eras.map((e) => [Number(e)])
    const results = await new ErasValidatorRewardMulti(
      network,
      erasMulti
    ).fetch()

    const reward = results
      .map((v) => {
        const value = new BigNumber(!v ? 0 : v.toString())
        if (value.isNaN()) {
          return new BigNumber(0)
        }
        return value
      })
      .reduce((prev, current) => prev.plus(current), new BigNumber(0))
      .div(eras.length)

    setAverageEraValidatorReward({ days, reward })
  }

  // Reset validator state data on network change
  useEffectIgnoreInitial(() => {
    setValidatorsFetched('unsynced')
    setErasRewawrdPointsFetched('unsynced')
    setSessionValidators([])
    setSessionParaValidators([])
    setAvgCommission(0)
    setValidators([])
    setValidatorIdentities({})
    setValidatorSupers({})
    setErasRewardPoints({})
    setEraPointsBoundaries(null)
    setValidatorEraPointsHistory({})
    setAverageEraValidatorReward(defaultAverageEraValidatorReward)
  }, [network])

  // Fetch validators and era reward points when fetched status changes
  useEffect(() => {
    if (isReady && activeEra.index.isGreaterThan(0)) {
      fetchValidators()
      fetchErasRewardPoints()
    }
  }, [
    validatorsFetched,
    erasRewardPointsFetched,
    isReady,
    peopleApiStatus,
    activeEra,
  ])

  // Mark unsynced and fetch session validators and average reward when activeEra changes
  useEffectIgnoreInitial(() => {
    if (isReady && activeEra.index.isGreaterThan(0)) {
      if (erasRewardPointsFetched === 'synced') {
        setErasRewawrdPointsFetched('unsynced')
      }

      if (validatorsFetched === 'synced') {
        setValidatorsFetched('unsynced')
      }
      fetchSessionValidators()
      getAverageEraValidatorReward()
    }
  }, [isReady, activeEra])

  // Fetch era points boundaries when `erasRewardPoints` ready
  useEffectIgnoreInitial(() => {
    if (isReady && Object.values(erasRewardPoints).length) {
      calculateEraPointsBoundaries()
    }
  }, [isReady, erasRewardPoints])

  // Fetch parachain session validators when `earliestStoredSession` ready
  useEffectIgnoreInitial(() => {
    if (isReady && earliestStoredSession.isGreaterThan(0)) {
      getParachainValidators()
    }
  }, [isReady, earliestStoredSession])

  return (
    <ValidatorsContext.Provider
      value={{
        fetchValidatorPrefs,
        getValidatorPointsFromEras,
        injectValidatorListData,
        validators,
        validatorIdentities,
        validatorSupers,
        avgCommission,
        sessionValidators,
        sessionParaValidators,
        erasRewardPoints,
        validatorsFetched,
        eraPointsBoundaries,
        validatorEraPointsHistory,
        erasRewardPointsFetched,
        averageEraValidatorReward,
        formatWithPrefs,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  )
}
