// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHelp } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';
import type { NominateStatusBarProps } from '../types';
import { Wrapper } from './Wrapper';

export const NominateStatusBar = ({ value }: NominateStatusBarProps) => {
  const { t } = useTranslation('library');
  const { staking } = useStaking();
  const { isSyncing } = useUi();
  const { unit, units } = useApi().network;
  const { minNominatorBond } = staking;
  const { metrics } = useNetworkMetrics();
  const { minimumActiveStake } = metrics;
  const { openHelp } = useHelp();

  const minNominatorBondUnit = planckToUnit(minNominatorBond, units);
  const minimumActiveStakeUnit = planckToUnit(minimumActiveStake, units);
  const gtMinNominatorBond = value.isGreaterThanOrEqualTo(minNominatorBondUnit);
  const gtMinActiveStake = value.isGreaterThanOrEqualTo(minimumActiveStakeUnit);

  return (
    <Wrapper>
      <div className="bars">
        <section className={gtMinNominatorBond && !isSyncing ? 'invert' : ''}>
          <h4>&nbsp;</h4>
          <div className="bar">
            <h5>{t('nominateInactive')}</h5>
          </div>
        </section>
        <section className={gtMinNominatorBond && !isSyncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
            &nbsp; {t('nominate')}
            <ButtonHelp marginLeft onClick={() => openHelp('Nominating')} />
          </h4>
          <div className="bar">
            <h5>
              {minNominatorBondUnit.decimalPlaces(3).toFormat()} {unit}
            </h5>
          </div>
        </section>
        <section className={gtMinActiveStake && !isSyncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
            &nbsp;{t('nominateActive')}
            <ButtonHelp
              marginLeft
              onClick={() => openHelp('Active Stake Threshold')}
            />
          </h4>
          <div className="bar">
            <h5>
              {isSyncing
                ? '...'
                : `${(minimumActiveStakeUnit.isLessThan(minNominatorBondUnit)
                    ? minNominatorBondUnit
                    : minimumActiveStakeUnit
                  )
                    .decimalPlaces(3)
                    .toFormat()} ${unit}`}
            </h5>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
