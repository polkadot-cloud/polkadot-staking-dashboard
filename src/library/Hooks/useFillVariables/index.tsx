// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { replaceAll } from 'Utils';
import { FillVariableItem } from './types';

export const useFillVariables = () => {
  const { network, consts } = useApi();
  const { maxNominations, maxNominatorRewardedPerValidator } = consts;

  const fillVariables = (d: FillVariableItem) => {
    let { title, description } = d;

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
      title = replaceAll(title, varToVal[0], varToVal[1]);
      description = description.map((_d: string) =>
        replaceAll(_d, varToVal[0], varToVal[1])
      );
    }

    return {
      title,
      description,
    };
  };

  return {
    fillVariables,
  };
};

export default useFillVariables;
