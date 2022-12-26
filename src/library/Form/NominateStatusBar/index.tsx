// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useSetup } from 'contexts/Setup';
import { useStaking } from 'contexts/Staking';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, toFixedIfNecessary } from 'Utils';
import { NominateStatusBarProps } from '../types';
import { Wrapper } from './Wrapper';

export const NominateStatusBar = ({ value }: NominateStatusBarProps) => {
  const { staking, eraStakers } = useStaking();
  const { isSyncing } = useSetup();
  const { unit, units } = useApi().network;
  const { minNominatorBond } = staking;
  const { minActiveBond } = eraStakers;
  const { t } = useTranslation('library');

  const minNominatorBondBase = planckBnToUnit(minNominatorBond, units);
  const gtMinNominatorBond = value >= minNominatorBondBase;
  const gtMinActiveBond = value >= minActiveBond;

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
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp; {t('nominate')} &nbsp;
            <OpenHelpIcon helpKey="Nominating" />
          </h4>
          <div className="bar">
            <h5>
              {toFixedIfNecessary(minNominatorBondBase, 3)} {unit}
            </h5>
          </div>
        </section>
        <section className={gtMinActiveBond && !isSyncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp;{t('nominateActive')} &nbsp;
            <OpenHelpIcon helpKey="Active Bond Threshold" />
          </h4>
          <div className="bar">
            <h5>
              {isSyncing
                ? '...'
                : `${toFixedIfNecessary(
                    minActiveBond < minNominatorBondBase
                      ? minNominatorBondBase
                      : minActiveBond,
                    3
                  )} ${unit}`}
            </h5>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
