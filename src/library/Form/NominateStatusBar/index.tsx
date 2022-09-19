// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useUi } from 'contexts/UI';
import { planckBnToUnit } from 'Utils';
import { Wrapper } from './Wrapper';
import { NominateStatusBarProps } from '../types';

export const NominateStatusBar = (props: NominateStatusBarProps) => {
  const { value } = props;

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
            <h5>Inactive</h5>
          </div>
        </section>
        <section className={gtMinNominatorBond && !isSyncing ? 'invert' : ''}>
          <h4>
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp; Nominate &nbsp;
            <OpenHelpIcon title="Nominating" />
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
            &nbsp;Active &nbsp;
            <OpenHelpIcon title="Active Bond Threshold" />
          </h4>
          <div className="bar">
            <h5>{isSyncing ? '...' : `${minActiveBond} ${unit}`}</h5>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};
