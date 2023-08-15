// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, rmCommas } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import type { AnyJson, MaybeAccount } from 'types';

export const useNominationStatus = () => {
  const { t } = useTranslation();
  const { network } = useApi();
  const { isSyncing } = useUi();
  const { meta, validators } = useValidators();
  const { poolNominations } = useActivePools();
  const { getAccountNominations } = useBonded();
  const { inSetup, eraStakers, getNominationsStatusFromTargets } = useStaking();

  // Utility to get the nominees of a provided nomination status.
  const getNomineesByStatus = (nominees: AnyJson[], status: string) =>
    nominees
      .map(([k, v]) => (v === status ? k : false))
      .filter((v) => v !== false);

  // Utility to get the status of the provided account's nominations, and whether they are earning
  // reards.
  const getNominationStatus = (
    who: MaybeAccount,
    type: 'nominator' | 'pool'
  ) => {
    const nominations =
      type === 'nominator'
        ? getAccountNominations(who)
        : poolNominations?.targets ?? [];

    // Get the sets nominees from the provided account's targets.
    const nominees = Object.entries(
      getNominationsStatusFromTargets(who, nominations)
    );
    const activeNominees = getNomineesByStatus(nominees, 'active');

    // Attempt to get validator stake from meta batch (may still be syncing).
    const stake = meta.validators_browse?.stake ?? [];

    // Determine whether active nominees are earning rewards. This function exists once the
    // first reward-earning nominee is found.
    let earningRewards = false;
    if (stake.length > 0) {
      activeNominees.every((nominee) => {
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
              const { lowestReward } = stake[validators.indexOf(validator)];
              if (
                planckToUnit(
                  new BigNumber(rmCommas(stakedValue)),
                  network.units
                ).isGreaterThanOrEqualTo(lowestReward)
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
    if (inSetup() || isSyncing) {
      str = t('nominate.notNominating', { ns: 'pages' });
    } else if (!nominations.length) {
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

  return { getNominationStatus };
};
