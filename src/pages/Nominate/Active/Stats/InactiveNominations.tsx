// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useStaking } from 'contexts/Staking';
import { Pie } from 'library/StatBoxList/Pie';
import { useTranslation } from 'react-i18next';

export const ActiveNominationsStatBox = () => {
  const { getNominationsStatus, isNominating } = useStaking();
  const nominationStatuses = getNominationsStatus();
  const { t } = useTranslation('common');

  const total = Object.values(nominationStatuses).length;
  const inactive =
    Object.values(nominationStatuses).filter((_v) => _v === 'inactive')
      .length ?? 0;

  // inactive nominations as percent
  let inactiveAsPercent = 0;
  if (total > 0) {
    inactiveAsPercent = inactive / (total * 0.01);
  }

  const params = {
    label: t('pages.nominate.inactive_nominations'),
    stat: {
      value: inactive,
      total,
      unit: '',
    },
    graph: {
      value1: inactive,
      value2: total - inactive,
    },
    tooltip: isNominating() ? `${inactiveAsPercent}%` : undefined,
    helpKey: 'Inactive Nominations',
    chelpKey: '非活跃提名',
  };

  return <Pie {...params} />;
};

export default ActiveNominationsStatBox;
