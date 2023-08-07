// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';

export const usePoolCommission = () => {
  const { getBondedPool } = useBondedPools();
  const { stats } = usePoolsConfig();
  const { globalMaxCommission } = stats;

  const getCurrentCommission = (id: number): number =>
    Math.min(
      Number(getBondedPool(id)?.commission?.current?.[0]?.slice(0, -1) || 0),
      globalMaxCommission
    );

  return { getCurrentCommission };
};
