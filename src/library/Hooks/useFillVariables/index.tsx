// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, planckToUnit } from '@polkadot-cloud/utils';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import type { AnyJson } from 'types';

export const useFillVariables = () => {
  const { consts } = useApi();
  const { stats } = usePoolsConfig();
  const { networkData } = useNetwork();
  const {
    maxNominations,
    maxNominatorRewardedPerValidator,
    existentialDeposit,
  } = consts;
  const { minJoinBond, minCreateBond } = stats;
  const { metrics } = useNetworkMetrics();
  const { minimumActiveStake } = metrics;

  const fillVariables = (d: AnyJson, keys: string[]) => {
    const fields: AnyJson = Object.entries(d).filter(([k]: any) =>
      keys.includes(k)
    );
    const transformed = Object.entries(fields).map(
      ([, [key, val]]: AnyJson) => {
        const varsToValues = [
          ['{NETWORK_UNIT}', networkData.unit],
          ['{NETWORK_NAME}', capitalizeFirstLetter(networkData.name)],
          [
            '{MAX_NOMINATOR_REWARDED_PER_VALIDATOR}',
            maxNominatorRewardedPerValidator.toString(),
          ],
          ['{MAX_NOMINATIONS}', maxNominations.toString()],
          [
            '{MIN_ACTIVE_STAKE}',
            planckToUnit(minimumActiveStake, networkData.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_JOIN_BOND}',
            planckToUnit(minJoinBond, networkData.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_CREATE_BOND}',
            planckToUnit(minCreateBond, networkData.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{EXISTENTIAL_DEPOSIT}',
            planckToUnit(existentialDeposit, networkData.units).toFormat(),
          ],
        ];

        for (const varToVal of varsToValues) {
          if (val.constructor === Array) {
            val = val.map((_d) => _d.replaceAll(varToVal[0], varToVal[1]));
          } else {
            val = val.replaceAll(varToVal[0], varToVal[1]);
          }
        }
        return [key, val];
      }
    );

    return {
      ...d,
      ...Object.fromEntries(transformed),
    };
  };

  return {
    fillVariables,
  };
};
