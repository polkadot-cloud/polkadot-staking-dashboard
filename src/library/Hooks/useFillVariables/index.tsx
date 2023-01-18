// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { AnyJson } from 'types';
import { capitalizeFirstLetter, planckToUnit } from 'Utils';

export const useFillVariables = () => {
  const { network, consts } = useApi();
  const { eraStakers } = useStaking();
  const { stats } = usePoolsConfig();
  const {
    maxNominations,
    maxNominatorRewardedPerValidator,
    existentialDeposit,
  } = consts;
  const { minActiveBond } = eraStakers;
  const { minJoinBond, minCreateBond } = stats;

  const fillVariables = (d: AnyJson, keys: Array<string>) => {
    const fields: AnyJson = Object.entries(d).filter(([k]: any) =>
      keys.includes(k)
    );
    const transformed = Object.entries(fields).map(
      ([, [key, val]]: AnyJson) => {
        const varsToValues = [
          ['{NETWORK_UNIT}', network.unit],
          ['{NETWORK_NAME}', capitalizeFirstLetter(network.name)],
          [
            '{MAX_NOMINATOR_REWARDED_PER_VALIDATOR}',
            String(maxNominatorRewardedPerValidator),
          ],
          ['{MAX_NOMINATIONS}', String(maxNominations)],
          ['{MIN_ACTIVE_BOND}', minActiveBond.decimalPlaces(3).toFormat()],
          [
            '{MIN_POOL_JOIN_BOND}',
            planckToUnit(minJoinBond, network.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_CREATE_BOND}',
            planckToUnit(minCreateBond, network.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{EXISTENTIAL_DEPOSIT}',
            planckToUnit(existentialDeposit, network.units).toFormat(),
          ],
        ];

        for (const varToVal of varsToValues) {
          if (val.constructor === Array) {
            val = val.map((_d: string) =>
              _d.replaceAll(varToVal[0], varToVal[1])
            );
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

export default useFillVariables;
