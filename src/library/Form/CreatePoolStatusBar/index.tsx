// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'contexts/Network';
import type { NominateStatusBarProps } from '../types';
import { Wrapper } from './Wrapper';
import { useApi } from 'contexts/Api';
import { useSyncing } from 'hooks/useSyncing';

export const CreatePoolStatusBar = ({ value }: NominateStatusBarProps) => {
  const { t } = useTranslation('library');
  const { minCreateBond } = useApi().poolsConfig;
  const { unit, units } = useNetwork().networkData;
  const { syncing } = useSyncing(['initialization']);

  const minCreateBondUnit = planckToUnit(minCreateBond, units);
  const sectionClassName =
    value.isGreaterThanOrEqualTo(minCreateBondUnit) && !syncing ? 'invert' : '';

  return (
    <Wrapper>
      <div className="bars">
        <section className={sectionClassName}>
          <h4>&nbsp;</h4>
          <div className="bar">
            <h5>0 {unit}</h5>
          </div>
        </section>
        <section className={sectionClassName}>
          <h4>
            <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
            &nbsp;{t('createPool')}
          </h4>
          <div className="bar">
            <h5>
              {syncing
                ? '...'
                : `${minCreateBondUnit.decimalPlaces(3).toFormat()} ${unit}`}
            </h5>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
