// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import useInflation from 'library/Hooks/useInflation';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, toFixedIfNecessary } from 'Utils';
import { InflationWrapper } from './Wrappers';

export const Inflation = () => {
  const { units } = useApi().network;
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();
  const { inflation, stakedReturn } = useInflation();
  const { t } = useTranslation('pages');

  const { lastTotalStake } = staking;
  const { totalIssuance } = metrics;

  // total supply as percent
  const totalIssuanceBase = planckBnToUnit(totalIssuance, units);
  const lastTotalStakeBase = planckBnToUnit(lastTotalStake, units);
  const supplyAsPercent =
    lastTotalStakeBase === 0
      ? 0
      : lastTotalStakeBase / (totalIssuanceBase * 0.01);

  return (
    <InflationWrapper>
      <section>
        <div className="items">
          <div>
            <div className="inner">
              <h2>
                {totalIssuance.toString() === '0'
                  ? '0'
                  : toFixedIfNecessary(stakedReturn, 2)}
                %
              </h2>
              <h4>
                {t('overview.historicalRewardsRate')}{' '}
                <OpenHelpIcon helpKey="Historical Rewards Rate" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>
                {totalIssuance.toString() === '0'
                  ? '0'
                  : toFixedIfNecessary(stakedReturn - inflation, 2)}
                %
              </h2>
              <h4>
                {t('overview.adjustedRewardsRate')}{' '}
                <OpenHelpIcon helpKey="Adjusted Rewards Rate" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>
                {totalIssuance.toString() === '0'
                  ? '0'
                  : toFixedIfNecessary(inflation, 2)}
                %
              </h2>
              <h4>
                {t('overview.inflation')} <OpenHelpIcon helpKey="Inflation" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>{toFixedIfNecessary(supplyAsPercent, 2)}%</h2>
              <h4>
                {t('overview.supplyStaked')}{' '}
                <OpenHelpIcon helpKey="Supply Staked" />
              </h4>
            </div>
          </div>
        </div>
      </section>
    </InflationWrapper>
  );
};
