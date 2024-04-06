// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { useOverlay } from 'kits/Overlay/Provider';
import { useTranslation } from 'react-i18next';
import { JoinPoolInterfaceWrapper } from './Wrappers';
import { CanvasTitleWrapper } from 'canvas/Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import BigNumber from 'bignumber.js';
import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import { capitalizeFirstLetter, planckToUnit, rmCommas } from '@w3ux/utils';
import { useNetwork } from 'contexts/Network';
import { useApi } from 'contexts/Api';
import { PoolSyncBar } from 'library/PoolSync/Bar';
import type { PoolRewardPointsKey } from 'contexts/Pools/PoolPerformance/types';

export const Preloader = ({
  performanceKey,
}: {
  performanceKey: PoolRewardPointsKey;
}) => {
  const { t } = useTranslation('pages');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { bondedPools } = useBondedPools();
  const {
    poolsConfig: { counterForPoolMembers },
  } = useApi();
  const { closeCanvas } = useOverlay().canvas;

  let totalPoolPoints = new BigNumber(0);
  bondedPools.forEach((b: BondedPool) => {
    totalPoolPoints = totalPoolPoints.plus(rmCommas(b.points));
  });
  const totalPoolPointsUnit = planckToUnit(totalPoolPoints, units)
    .decimalPlaces(0)
    .toFormat();

  return (
    <>
      <div className="head">
        <ButtonPrimary
          text={t('pools.back', { ns: 'pages' })}
          lg
          onClick={() => closeCanvas()}
          iconLeft={faTimes}
          style={{ marginLeft: '1.1rem' }}
        />
      </div>
      <CanvasTitleWrapper className="padding">
        <div className="inner">
          <div className="empty"></div>
          <div className="standalone">
            <div className="title">
              <h1>{t('pools.joinPool')}</h1>
            </div>
            <div className="labels">
              <h3>
                {t('pools.joinPoolHeading', {
                  totalMembers: new BigNumber(counterForPoolMembers).toFormat(),
                  totalPoolPoints: totalPoolPointsUnit,
                  unit,
                  network: capitalizeFirstLetter(network),
                })}
              </h3>
            </div>
          </div>
        </div>
      </CanvasTitleWrapper>

      <JoinPoolInterfaceWrapper>
        <div className="content" style={{ flexDirection: 'column' }}>
          <h2 className="tip">
            {t('analyzingPoolPerformance', { ns: 'library' })}...
          </h2>

          <h2 className="tip">
            <PoolSyncBar performanceKey={performanceKey} />
          </h2>
        </div>
      </JoinPoolInterfaceWrapper>
    </>
  );
};
