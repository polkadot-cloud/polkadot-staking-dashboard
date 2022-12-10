// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useStaking } from 'contexts/Staking';
import { Text } from 'library/StatBoxList/Text';
import { useTranslation } from 'react-i18next';
import { humanNumber } from 'Utils';

export const TotalNominatorsStatBox = () => {
  const { staking } = useStaking();
  const { totalNominators } = staking;
  const { t } = useTranslation('pages');

  const params = {
    label: t('overview.totalNominators'),
    value: humanNumber(totalNominators.toNumber()),
    helpKey: 'Total Nominators',
  };

  return <Text {...params} />;
};

export default TotalNominatorsStatBox;
