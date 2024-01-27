// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHelp } from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useUi } from 'contexts/UI';
import { useNetwork } from 'contexts/Network';
import type { NominateStatusBarProps } from '../types';
import { Wrapper } from './Wrapper';
import { useApi } from 'contexts/Api';

export const NominateStatusBar = ({ value }: NominateStatusBarProps) => {
  const { t } = useTranslation('library');
  const { isSyncing } = useUi();
  const { unit, units } = useNetwork().networkData;
  const {
    networkMetrics: { minimumActiveStake },
    stakingMetrics: { minNominatorBond },
  } = useApi();
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
