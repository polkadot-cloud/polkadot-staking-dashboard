// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from "bn.js";
import { Wrapper } from "./Wrapper";
import { useApi } from "../../../contexts/Api";
import { useStaking } from "../../../contexts/Staking";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';

export const BondStatusBar = (props: any) => {

  const { value } = props;

  const { network }: any = useApi();
  const { staking, eraStakers } = useStaking();
  const { unit, units } = network;
  const { minNominatorBond } = staking;
  const { minActiveBond } = eraStakers;

  let minNominatorBondBase = minNominatorBond.div(new BN(10 ** units)).toNumber();

  const gtMinNominatorBond = value >= minNominatorBondBase;
  const gtMinActiveBond = value >= minActiveBond;

  return (
    <Wrapper>
      <div className='bars'>
        <section className={gtMinNominatorBond ? `invert` : ``}>
          <h4>&nbsp;</h4>
          <div className='bar'>
            <h5>Inactive</h5>
          </div>
        </section>
        <section className={gtMinNominatorBond ? `invert` : ``}>
          <h4>
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp;
            Nominate
            <OpenAssistantIcon page='stake' title='Nominating' />
          </h4>
          <div className='bar'>
            <h5>{minNominatorBondBase} {unit}</h5>
          </div>
        </section>
        <section className={gtMinActiveBond ? `invert` : ``}>
          <h4>
            <FontAwesomeIcon icon={faFlag as IconProp} transform="shrink-4" />
            &nbsp;
            Active
            <OpenAssistantIcon page='stake' title='Active Bond Threshold' />
          </h4>
          <div className='bar'>
            <h5>{minActiveBond} {unit}</h5>
          </div>
        </section>
      </div>
    </Wrapper>
  )
}

export default BondStatusBar;