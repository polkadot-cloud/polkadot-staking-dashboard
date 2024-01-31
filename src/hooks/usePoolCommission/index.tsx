// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api';
import { useBondedPools } from 'contexts/Pools/BondedPools';

export const usePoolCommission = () => {
  const { getBondedPool } = useBondedPools();
  const { globalMaxCommission } = useApi().poolsConfig;

  const getCurrentCommission = (id: number): number =>
    Math.min(
      Number(getBondedPool(id)?.commission?.current?.[0]?.slice(0, -1) || 0),
      globalMaxCommission
    );

  return { getCurrentCommission };
};
