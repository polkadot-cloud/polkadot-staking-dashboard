// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useStaking } from 'contexts/Staking';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import type { AnyJson, BondFor, MaybeAddress } from 'types';
import { useNetwork } from 'contexts/Network';
import { useSyncing } from 'hooks/useSyncing';
import { useBalances } from 'contexts/Balances';

export const useNominationStatus = () => {
  const { t } = useTranslation();
  const {
    networkData: { units },
  } = useNetwork();
  const {
    inSetup,
    eraStakers,
    getLowestRewardFromStaker,
    getNominationsStatusFromTargets,
  } = useStaking();
  const { validators } = useValidators();
  const { getNominations } = useBalances();
  const { syncing } = useSyncing(['era-stakers']);
  const { activePoolNominations } = useActivePool();

  // Utility to get an account's nominees alongside their status.
  const getNominationSetStatus = (who: MaybeAddress, type: BondFor) => {
    const nominations =
      type === 'nominator'
        ? getNominations(who)
        : activePoolNominations?.targets ?? [];

    return getNominationsStatusFromTargets(who, nominations);
  };

  // Utility to get the nominees of a provided nomination status.
  const getNomineesByStatus = (nominees: AnyJson[], status: string) =>
    nominees
      .map(([k, v]) => (v === status ? k : false))
      .filter((v) => v !== false);

  // Utility to get the status of the provided account's nominations, and whether they are earning
  // reards.
  const getNominationStatus = (who: MaybeAddress, type: BondFor) => {
    // Get the sets nominees from the provided account's targets.
    const nominees = Object.entries(getNominationSetStatus(who, type));
    const activeNominees = getNomineesByStatus(nominees, 'active');

    // Determine whether active nominees are earning rewards. This function exists once the
    // eras stakers has synced.
    let earningRewards = false;
    if (!syncing) {
      getNomineesByStatus(nominees, 'active').every((nominee) => {
        const validator = validators.find(({ address }) => address === nominee);

        if (validator) {
          const others =
            eraStakers.stakers.find(({ address }) => address === nominee)
              ?.others || [];

          if (others.length) {
            // If the provided account is a part of the validator's backers, check if they are above
            // the lowest reward threshold. If so, they are earning rewards and this iteration can
            // exit.
            const stakedValue =
              others?.find((o) => o.who === who)?.value ?? false;
            if (stakedValue) {
              const { lowest } = getLowestRewardFromStaker(nominee);
              if (
                planckToUnit(
                  new BigNumber(stakedValue),
                  units
                ).isGreaterThanOrEqualTo(lowest)
              ) {
                earningRewards = true;
                return false;
              }
            }
          }
        }
        return true;
      });
    }

    // Determine the localised message to display based on the nomination status.
    let str;
    if (inSetup() || syncing) {
      str = t('nominate.notNominating', { ns: 'pages' });
    } else if (!nominees.length) {
      str = t('nominate.noNominationsSet', { ns: 'pages' });
    } else if (activeNominees.length) {
      str = t('nominate.nominatingAnd', { ns: 'pages' });
      if (earningRewards) {
        str += ` ${t('nominate.earningRewards', { ns: 'pages' })}`;
      } else {
        str += ` ${t('nominate.notEarningRewards', { ns: 'pages' })}`;
      }
    } else {
      str = t('nominate.waitingForActiveNominations', { ns: 'pages' });
    }

    return {
      nominees: {
        active: activeNominees,
        inactive: getNomineesByStatus(nominees, 'inactive'),
        waiting: getNomineesByStatus(nominees, 'waiting'),
      },
      earningRewards,
      message: str,
    };
  };

  return { getNominationStatus, getNominationSetStatus };
};
