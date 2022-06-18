// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useUi } from 'contexts/UI';
import { APIContextInterface } from 'types/api';
import { StakingContextInterface } from 'types/staking';
import { Wrapper } from './Wrapper';

export const BondStatusBar = (props: any) => {
  const { value } = props;

  const { network } = useApi() as APIContextInterface;
  const { staking, eraStakers } = useStaking() as StakingContextInterface;
  const { isSyncing } = useUi();
  const { unit, units } = network;
  const { minNominatorBond } = staking;
  const { minActiveBond } = eraStakers;

  const minNominatorBondBase = minNominatorBond
    .div(new BN(10 ** units))
    .toNumber();

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
            &nbsp; Nominate
            <OpenAssistantIcon page="stake" title="Nominating" />
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
            &nbsp; Active
            <OpenAssistantIcon page="stake" title="Active Bond Threshold" />
          </h4>
          <div className="bar">
            <h5>{isSyncing ? '...' : `${minActiveBond} ${unit}`}</h5>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};

export default BondStatusBar;
