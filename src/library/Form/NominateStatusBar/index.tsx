// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { planckBnToUnit } from 'Utils';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrapper';
import { NominateStatusBarProps } from '../types';

export const NominateStatusBar = (props: NominateStatusBarProps) => {
  const { value } = props;
  const { t } = useTranslation('common');

  const { network } = useApi();
  const { staking, eraStakers } = useStaking();
  const { isSyncing } = useUi();
  const { unit, units } = network;
  const { minNominatorBond } = staking;
  const { minActiveBond } = eraStakers;

  const minNominatorBondBase = planckBnToUnit(minNominatorBond, units);
  const gtMinNominatorBond = value >= minNominatorBondBase;
  const gtMinActiveBond = value >= minActiveBond;

  return (
    <Wrapper>
      <div className="bars">
        <section className={gtMinNominatorBond && !isSyncing ? 'invert' : ''}>
          <h4>&nbsp;</h4>
          <div className="bar">
            <h5>{t('library.inactive')}</h5>
          </div>
        </section>
        <section className={gtMinNominatorBond && !isSyncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp; {t('library.nominate')} &nbsp;
            <OpenHelpIcon helpKey="Nominating" />
          </h4>
          <div className="bar">
            <h5>
              {minNominatorBondBase} {unit}
            </h5>
          </div>
        </section>
        <section className={gtMinActiveBond && !isSyncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp;{t('library.active')} &nbsp;
            <OpenHelpIcon helpKey="Active Bond Threshold" />
          </h4>
          <div className="bar">
            <h5>{isSyncing ? '...' : `${minActiveBond} ${unit}`}</h5>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
