// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';
import { NominateStatusBarProps } from '../types';
import { Wrapper } from './Wrapper';

export const NominateStatusBar = ({ value }: NominateStatusBarProps) => {
  const { t } = useTranslation('library');
  const { staking } = useStaking();
  const { isSyncing } = useUi();
  const { unit, units } = useApi().network;
  const { minNominatorBond } = staking;
  const { metrics } = useNetworkMetrics();
  const { minimumActiveStake } = metrics;

  const minNominatorBondUnit = planckToUnit(minNominatorBond, units);
  const gtMinNominatorBond = value.isGreaterThanOrEqualTo(minNominatorBondUnit);
  const gtMinActiveBond = value.isGreaterThanOrEqualTo(minimumActiveStake);

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
            &nbsp; {t('nominate')} &nbsp;
            <OpenHelpIcon helpKey="Nominating" />
          </h4>
          <div className="bar">
            <h5>
              {minNominatorBondUnit.decimalPlaces(3).toFormat()} {unit}
            </h5>
          </div>
        </section>
        <section className={gtMinActiveBond && !isSyncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
            &nbsp;{t('nominateActive')} &nbsp;
            <OpenHelpIcon helpKey="Active Bond Threshold" />
          </h4>
          <div className="bar">
            <h5>
              {isSyncing
                ? '...'
                : `${(minimumActiveStake.isLessThan(minNominatorBondUnit)
                    ? minNominatorBondUnit
                    : minimumActiveStake
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
