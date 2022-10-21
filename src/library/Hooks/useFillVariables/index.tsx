// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useStaking } from 'contexts/Staking';
import { AnyJson } from 'types';
import { planckBnToUnit, replaceAll, toFixedIfNecessary } from 'Utils';

export const useFillVariables = () => {
  const { network, consts } = useApi();
  const { eraStakers } = useStaking();
  const { stats } = usePoolsConfig();
  const { maxNominations, maxNominatorRewardedPerValidator } = consts;
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
          ['{NETWORK_NAME}', network.name],
          [
            '{MAX_NOMINATOR_REWARDED_PER_VALIDATOR}',
            String(maxNominatorRewardedPerValidator),
          ],
          ['{MAX_NOMINATIONS}', String(maxNominations)],
          ['{MIN_ACTIVE_BOND}', String(toFixedIfNecessary(minActiveBond, 3))],
          [
            '{MIN_POOL_JOIN_BOND}',
            String(
              toFixedIfNecessary(planckBnToUnit(minJoinBond, network.units), 3)
            ),
          ],
          [
            '{MIN_POOL_CREATE_BOND}',
            String(
              toFixedIfNecessary(
                planckBnToUnit(minCreateBond, network.units),
                3
              )
            ),
          ],
        ];

        for (const varToVal of varsToValues) {
          if (val.constructor === Array) {
            val = val.map((_d: string) =>
              replaceAll(_d, varToVal[0], varToVal[1])
            );
          } else {
            val = replaceAll(val, varToVal[0], varToVal[1]);
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
