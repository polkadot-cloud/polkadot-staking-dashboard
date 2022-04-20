// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { planckToDot, isNumeric } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useBalances } from '../../contexts/Balances';
import { useStaking } from '../../contexts/Staking';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { HalfWrapper, HalfItem } from '../../library/Layout';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { BondStatus, Spacer } from './Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const RESERVE_AMOUNT = 0.1 ** 10;

export const Bond = (props: any) => {

  // functional props
  const { setup, setSetup } = props;

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { staking } = useStaking();
  const { getAccountLedger, getBondedAccount, getAccountBalance }: any = useBalances();

  const { minNominatorBond } = staking;
  const balance = getAccountBalance(activeAccount);
  let { free } = balance;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { total } = ledger;

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  let freeAfterReserve = free - RESERVE_AMOUNT;
  freeAfterReserve = freeAfterReserve < 0 ? 0 : freeAfterReserve;

  const [bond, setBond] = useState(planckToDot(free));

  const handleChangeBond = (e: any) => {
    let { value } = e.target;

    if (!isNumeric(value) && value !== '') {
      return;
    }

    setBond(value);

    if (value <= freeAfterReserve) {
      setSetup({
        ...setup,
        bond: value,
      });
    }
  }

  return (
    <SectionWrapper transparent>
      <div className='head'>
        <h2>
          Bond{total > 0 && `ed`} {network.unit}
          <OpenAssistantIcon page="stake" title="Bonding" />
        </h2>
      </div>

      {freeAfterReserve === 0
        ? <h4 style={{ margin: 0, }}>You have no free {network.unit} to bond.</h4>
        : <h4>Available: {planckToDot(freeAfterReserve)} {network.unit}</h4>
      }

      <Spacer />
      <HalfWrapper alignItems='flex-end'>
        <HalfItem>
          <input type="text" placeholder={`0 ${network.unit}`} value={bond} onChange={(e) => handleChangeBond(e)} />
        </HalfItem>
        <HalfItem>
        </HalfItem>
      </HalfWrapper>
      <BondStatus>
        <div className='bars'>
          <section>
            <h4>&nbsp;</h4>
            <div className='bar'>
              <h5>Inactive</h5>
            </div>
          </section>
          <section>
            <h4>
              <FontAwesomeIcon icon={bond >= minNominatorBond ? faCheck : faFlag} transform="shrink-4" />&nbsp;Nominating
            </h4>
            <div className='bar'>
              <h5>{planckToDot(minNominatorBond)} {network.unit}</h5>
            </div>
          </section>
          <section>
            <h4>
              <FontAwesomeIcon icon={faFlag} transform="shrink-4" />&nbsp;Receiving Rewards
            </h4>
            <div className='bar'>
              <h5>Coming Soon</h5>
            </div>
          </section>
        </div>
      </BondStatus>
    </SectionWrapper>
  )
}

export default Bond;