// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { PoolState } from 'contexts/Pools/types';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, rmCommas, toFixedIfNecessary } from 'Utils';
import { HeaderWrapper } from './Wrappers';

export const Header = () => {
  const { network } = useApi();
  const { selectedActivePool } = useActivePools();
  const { getMembersOfPool } = usePoolMembers();
  const { t } = useTranslation('pages');

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
      stateDisplay = t('pools.locked');
      break;
    case PoolState.Destroy:
      stateDisplay = t('pools.destroying');
      break;
    default:
      stateDisplay = t('pools.open');
      break;
  }

  return (
    <HeaderWrapper>
      <section>
        <div className="items">
          <div>
            <div className="inner">
              <h2>{stateDisplay}</h2>
              <h4>{t('pools.poolState')}</h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>{poolMembers.length}</h2>
              <h4>{t('pools.poolMembers')}</h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>
                {bonded} {network.unit}
              </h2>
              <h4>{t('pools.totalBonded')}</h4>
            </div>
          </div>
        </div>
      </section>
    </HeaderWrapper>
  );
};
