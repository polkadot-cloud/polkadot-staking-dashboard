// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Text } from 'library/StatBoxList/Text';

export const AverageCommission = () => {
  const { avgCommission } = useValidators();

  const params = {
    label: 'Average Commission',
    value: `${String(avgCommission)}%`,
    helpKey: 'Average Commission',
  };
  return <Text {...params} />;
};

export default AverageCommission;
