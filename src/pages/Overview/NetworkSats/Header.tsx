// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useNetworkMetrics } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useStaking } from 'contexts/Staking';
import useInflation from 'library/Hooks/useInflation';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
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
              <h2>{totalValidators.toFormat(0)}</h2>
              <h4>
                {t('overview.totalValidators')}
                <OpenHelpIcon helpKey="Validator" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>{totalNominators.toFormat(0)}</h2>
              <h4>
                {t('overview.totalNominators')}{' '}
                <OpenHelpIcon helpKey="Total Nominators" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>{new BigNumber(bondedPools.length).toFormat()}</h2>
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
                  : new BigNumber(inflation).decimalPlaces(2).toFormat()}
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
