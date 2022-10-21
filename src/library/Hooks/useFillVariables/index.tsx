// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { AnyJson } from 'types';
import { replaceAll } from 'Utils';

export const useFillVariables = () => {
  const { network, consts } = useApi();
  const { maxNominations, maxNominatorRewardedPerValidator } = consts;

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
