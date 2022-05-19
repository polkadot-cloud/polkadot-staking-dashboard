// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useMemo } from 'react';
import { useStaking } from '../../../../contexts/Staking';
import { useBalances } from '../../../../contexts/Balances';
import { useConnect } from '../../../../contexts/Connect';
import { Pie } from '../../../../library/StatBoxList/Pie';

export const ActiveNominationsStatBox = () => {
  const { activeAccount } = useConnect();
  const { getNominationsStatus } = useStaking();
  const { getAccountNominations }: any = useBalances();
  const nominations = getAccountNominations(activeAccount);

  // handle nomination statuses
  const [nominationsStatus, setNominationsStatus]: any = useState({
    total: 0,
    inactive: 0,
    active: 0,
  });

  const nominationStatuses = useMemo(
    () => getNominationsStatus(),
    [nominations],
  );

  useEffect(() => {
    const statuses = nominationStatuses;
    const total = Object.values(statuses).length;
    const _active: any = Object.values(statuses).filter(
      (_v: any) => _v === 'active',
    ).length;

    setNominationsStatus({
      total,
      inactive: total - _active,
      active: _active,
    });
  }, [nominationStatuses]);

  const params = {
    label: 'Active Nominations',
    stat: {
      value: nominationsStatus.active,
      total: nominationsStatus.total,
      unit: '',
    },
    graph: {
      value1: nominationsStatus.active,
      value2: nominationsStatus.active ? 0 : 1,
    },
    tooltip: `${nominationsStatus.active ? 'Active' : 'Inactive'}`,
    assistant: {
      page: 'stake',
      key: 'Nominations',
    },
  };

  return <Pie {...params} />;
};

export default ActiveNominationsStatBox;
