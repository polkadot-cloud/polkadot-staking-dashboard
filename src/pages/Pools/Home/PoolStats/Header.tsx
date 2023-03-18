// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit, rmCommas } from 'Utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTranslation } from 'react-i18next';
import { HeaderWrapper } from './Wrappers';

export const Header = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { selectedActivePool } = useActivePools();
  const { getMembersOfPool } = usePoolMembers();

  const { state, points } = selectedActivePool?.bondedPool || {};
  const poolMembers = getMembersOfPool(selectedActivePool?.id ?? 0);

  const bonded = planckToUnit(
    new BigNumber(points ? rmCommas(points) : 0),
    network.units
  )
    .decimalPlaces(3)
    .toFormat();

  let stateDisplay;
  switch (state) {
    case 'Blocked':
      stateDisplay = t('pools.locked');
      break;
    case 'Destroying':
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
