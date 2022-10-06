// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Text } from 'library/StatBoxList/Text';
import { useValidators } from 'contexts/Validators';

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
