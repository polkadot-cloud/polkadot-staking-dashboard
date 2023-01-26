// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import useInflation from 'library/Hooks/useInflation';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { humanNumber, toFixedIfNecessary } from 'Utils';
import { InflationWrapper } from './Wrappers';

export const Header = () => {
  const { t } = useTranslation('pages');
  const { metrics } = useNetworkMetrics();
  const { staking } = useStaking();
  const { bondedPools } = useBondedPools();
  const { inflation } = useInflation();
  const { totalNominators, totalValidators } = staking;
  const { totalIssuance } = metrics;

  return (
    <InflationWrapper>
      <section>
        <div className="items">
          <div>
            <div className="inner">
              <h2>{humanNumber(totalValidators.toNumber())}</h2>
              <h4>
                {t('overview.totalValidators')}
                <OpenHelpIcon helpKey="Validator" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>{humanNumber(totalNominators.toNumber())}</h2>
              <h4>
                {t('overview.totalNominators')}{' '}
                <OpenHelpIcon helpKey="Total Nominators" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>{humanNumber(bondedPools.length)}</h2>
              <h4>
                {t('overview.activePools')}
                <OpenHelpIcon helpKey="Active Pools" />
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
                {t('overview.inflationRate')}
                <OpenHelpIcon helpKey="Inflation" />
              </h4>
            </div>
          </div>
        </div>
      </section>
    </InflationWrapper>
  );
};
