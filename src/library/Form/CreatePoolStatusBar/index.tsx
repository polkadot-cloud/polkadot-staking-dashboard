// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import { useUi } from 'contexts/UI';
import { planckBnToUnit } from 'Utils';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrapper';
import { NominateStatusBarProps } from '../types';

export const CreatePoolStatusBar = ({ value }: NominateStatusBarProps) => {
  const { minCreateBond } = usePoolsConfig().stats;
  const { isSyncing } = useUi();
  const { unit, units } = useApi().network;
  const { t } = useTranslation('common');

  const minCreateBondBase = planckBnToUnit(minCreateBond, units);
  const sectionClassName =
    value >= minCreateBondBase && !isSyncing ? 'invert' : '';

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
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp;{t('library.create_pool')}
          </h4>
          <div className="bar">
            <h5>{isSyncing ? '...' : `${minCreateBondBase} ${unit}`}</h5>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
