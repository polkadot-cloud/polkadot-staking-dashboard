// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit, rmCommas } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useBalances } from 'contexts/Accounts/Balances';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { useTranslation } from 'react-i18next';
import type { MaybeAccount } from 'types';

export const useNominationStatus = () => {
  const { t } = useTranslation();
  const { network } = useApi();
  const { isSyncing } = useUi();
  const { meta, validators } = useValidators();
  const { getAccountNominations } = useBalances();
  const { poolNominations } = useActivePools();
  const { inSetup, eraStakers, getNominationsStatusFromTargets } = useStaking();
  const { stakers } = eraStakers;

  const getNominationStatus = (
    who: MaybeAccount,
    type: 'nominator' | 'pool'
  ) => {
    const nominations =
      type === 'nominator'
        ? getAccountNominations(who)
        : poolNominations?.targets ?? [];
    const nominationStatuses = getNominationsStatusFromTargets(
      who,
      nominations
    );
    const stake = meta.validators_browse?.stake ?? [];
    const stakeSynced = stake.length > 0 ?? false;

    const activeNominees = Object.entries(nominationStatuses)
      .map(([k, v]: any) => (v === 'active' ? k : false))
      .filter((v) => v !== false);

    let earningRewards = false;
    if (stakeSynced) {
      for (const nominee of activeNominees) {
        const validator = validators.find((v: any) => v.address === nominee);
        if (validator) {
          const batchIndex = validators.indexOf(validator);
          const nomineeMeta = stake[batchIndex];
          const { lowestReward } = nomineeMeta;

          const validatorInEra =
            stakers.find((s: any) => s.address === nominee) || null;

          if (validatorInEra) {
            const { others } = validatorInEra;
            const stakedValue =
              others?.find((o: any) => o.who === who)?.value ?? false;
            if (stakedValue) {
              const stakedValueUnit = planckToUnit(
                new BigNumber(rmCommas(stakedValue)),
                network.units
              );
              if (stakedValueUnit.isGreaterThanOrEqualTo(lowestReward)) {
                earningRewards = true;
                break;
              }
            }
          }
        }
      }
    }

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
      activeNominees,
      earningRewards,
      message: str,
    };
  };

  return { getNominationStatus };
};
