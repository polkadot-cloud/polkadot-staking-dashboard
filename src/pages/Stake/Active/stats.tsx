// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import { useState, useEffect, useMemo } from 'react';
import { useApi } from '../../../contexts/Api';
import { useStaking } from '../../../contexts/Staking';
import { useNetworkMetrics } from '../../../contexts/Network';
import { useBalances } from '../../../contexts/Balances';
import { useConnect } from '../../../contexts/Connect';
import { useEraTimeLeft } from '../../../library/Hooks/useEraTimeLeft';
import { useSessionEra } from '../../../contexts/SessionEra';

export const useStats = () => {
  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { metrics } = useNetworkMetrics();
  const { getNominationsStatus, eraStakers } = useStaking();
  const { getAccountNominations }: any = useBalances();
  const { sessionEra } = useSessionEra();
  const eraTimeLeft = useEraTimeLeft();

  const { minActiveBond } = eraStakers;
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

  // format era time left
  const _timeleft = moment.duration(eraTimeLeft * 1000, 'milliseconds');
  const timeleft = `${_timeleft.hours()}:${_timeleft.minutes()}:${_timeleft.seconds()}`;

  return [
    {
      format: 'chart-pie',
      params: {
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
      },
    },
    {
      format: 'number',
      params: {
        label: 'Minimum Active Bond',
        value: minActiveBond,
        unit: network.unit,
        assistant: {
          page: 'stake',
          key: 'Bonding',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Active Era',
        stat: {
          value: metrics.activeEra.index,
          unit: '',
        },
        graph: {
          value1: sessionEra.eraProgress,
          value2: sessionEra.eraLength - sessionEra.eraProgress,
        },
        tooltip: timeleft,
        assistant: {
          page: 'validators',
          key: 'Era',
        },
      },
    },
  ];
};
