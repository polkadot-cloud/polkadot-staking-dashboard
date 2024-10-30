// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, planckToUnit } from '@w3ux/utils';
import { useApi } from 'contexts/Api';
import { useNetwork } from 'contexts/Network';
import type { AnyJson } from '@w3ux/types';
import { useErasPerDay } from '../useErasPerDay';
import BigNumber from 'bignumber.js';

export const useFillVariables = () => {
  const {
    consts,
    networkMetrics: { minimumActiveStake },
    poolsConfig: { minJoinBond, minCreateBond },
  } = useApi();
  const { networkData } = useNetwork();
  const { maxNominations, maxExposurePageSize, existentialDeposit } = consts;
  const { maxSupportedDays } = useErasPerDay();

  const fillVariables = (d: AnyJson, keys: string[]) => {
    const fields: AnyJson = Object.entries(d).filter(([k]) => keys.includes(k));
    const transformed = Object.entries(fields).map(
      ([, [key, val]]: AnyJson) => {
        const varsToValues = [
          ['{AVERAGE_REWARD_RATE_DAYS}', maxSupportedDays > 30 ? '30' : '15'],
          ['{NETWORK_UNIT}', networkData.unit],
          ['{NETWORK_NAME}', capitalizeFirstLetter(networkData.name)],
          ['{MAX_EXPOSURE_PAGE_SIZE}', maxExposurePageSize.toString()],
          ['{MAX_NOMINATIONS}', maxNominations.toString()],
          [
            '{MIN_ACTIVE_STAKE}',
            new BigNumber(
              planckToUnit(minimumActiveStake.toString(), networkData.units)
            )
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_JOIN_BOND}',
            new BigNumber(
              planckToUnit(minJoinBond.toString(), networkData.units)
            )
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_CREATE_BOND}',
            new BigNumber(
              planckToUnit(minCreateBond.toString(), networkData.units)
            )
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{EXISTENTIAL_DEPOSIT}',
            new BigNumber(
              planckToUnit(existentialDeposit.toString(), networkData.units)
            ).toFormat(),
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
