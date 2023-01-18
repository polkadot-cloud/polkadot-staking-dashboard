// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';

export const MinimumActiveBondStatBox = () => {
  const { network } = useApi();
  const { eraStakers } = useStaking();
  const { minActiveBond } = eraStakers;
  const { t } = useTranslation('pages');

  const params = {
    label: t('nominate.minimumActiveBond'),
    value: minActiveBond.toNumber(),
    unit: `${network.unit}`,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};

export default MinimumActiveBondStatBox;
