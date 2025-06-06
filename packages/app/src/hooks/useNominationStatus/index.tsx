// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useBalances } from 'contexts/Balances'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { useTranslation } from 'react-i18next'
import type { AnyJson, BondFor, MaybeAddress } from 'types'

export const useNominationStatus = () => {
  const { t } = useTranslation()
  const { getValidators } = useValidators()
  const { getNominations } = useBalances()
  const { syncing } = useSyncing(['era-stakers'])
  const { activePoolNominations } = useActivePool()
  const { isNominator, eraStakers, getNominationsStatusFromTargets } =
    useStaking()

  // Utility to get an account's nominees alongside their status.
  const getNominationSetStatus = (who: MaybeAddress, type: BondFor) => {
    const nominations =
      type === 'nominator'
        ? getNominations(who)
        : (activePoolNominations?.targets ?? [])

    return getNominationsStatusFromTargets(who, nominations)
  }

  // Utility to get the nominees of a provided nomination status.
  const getNomineesByStatus = (nominees: AnyJson[], status: string) =>
    nominees
      .map(([k, v]) => (v === status ? k : false))
      .filter((v) => v !== false)

  // Utility to get the status of the provided account's nominations, and whether they are earning
  // reards.
  const getNominationStatus = (who: MaybeAddress, type: BondFor) => {
    // Get the sets nominees from the provided account's targets.
    const nominees = Object.entries(getNominationSetStatus(who, type))
    const activeNominees = getNomineesByStatus(nominees, 'active')

    // Determine whether active nominees are earning rewards. This function exists once the
    // eras stakers has synced.
    let earningRewards = false
    if (!syncing) {
      getNomineesByStatus(nominees, 'active').every((nominee) => {
        const validator = getValidators().find(
          ({ address }) => address === nominee
        )

        if (validator) {
          const others =
            eraStakers.stakers.find(({ address }) => address === nominee)
              ?.others || []

          if (others.length) {
            // If the provided account is a part of the validator's backers they are earning
            // rewards.
            earningRewards = true
            return false
          }
        }
        return true
      })
    }

    // Determine the localised message to display based on the nomination status.
    let str
    if (!isNominator || syncing) {
      str = t('notNominating', { ns: 'pages' })
    } else if (!nominees.length) {
      str = t('noNominationsSet', { ns: 'pages' })
    } else if (activeNominees.length) {
      str = t('nominatingAnd', { ns: 'pages' })
      if (earningRewards) {
        str += ` ${t('earningRewards', { ns: 'pages' })}`
      } else {
        str += ` ${t('notEarningRewards', { ns: 'pages' })}`
      }
    } else {
      str = t('waitingForActiveNominations', { ns: 'pages' })
    }

    return {
      nominees: {
        active: activeNominees,
        inactive: getNomineesByStatus(nominees, 'inactive'),
        waiting: getNomineesByStatus(nominees, 'waiting'),
      },
      earningRewards,
      message: str,
    }
  }

  return { getNominationStatus, getNominationSetStatus }
}
