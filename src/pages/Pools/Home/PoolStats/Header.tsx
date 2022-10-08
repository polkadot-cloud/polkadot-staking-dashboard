// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { planckBnToUnit, rmCommas, toFixedIfNecessary } from 'Utils';
import { useActivePools } from 'contexts/Pools/ActivePool';
import { PoolState } from 'contexts/Pools/types';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useApi } from 'contexts/Api';
import { HeaderWrapper } from './Wrappers';

export const Header = () => {
  const { network } = useApi();
  const { selectedActivePool } = useActivePools();
  const { getMembersOfPool } = usePoolMembers();

  const { state, points } = selectedActivePool?.bondedPool || {};
  const poolMembers = getMembersOfPool(selectedActivePool?.id ?? 0);

  const bonded = toFixedIfNecessary(
    planckBnToUnit(
      points ? new BN(rmCommas(points)) : new BN(0),
      network.units
    ),
    3
  );

  let stateDisplay;
  switch (state) {
    case PoolState.Block:
      stateDisplay = 'Locked';
      break;
    case PoolState.Destroy:
      stateDisplay = 'Destroying';
      break;
    default:
      stateDisplay = 'Open';
      break;
  }

  return (
    <HeaderWrapper>
      <section>
        <div className="items">
          <div>
            <div className="inner">
              <h2>{stateDisplay}</h2>
              <h4>Pool State</h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>{poolMembers.length}</h2>
              <h4>Pool Members</h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>
                {bonded} {network.unit}
              </h2>
              <h4>Total Bonded</h4>
            </div>
          </div>
        </div>
      </section>
    </HeaderWrapper>
  );
};
