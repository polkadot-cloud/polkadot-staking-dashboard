// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { planckToDot, isNumeric } from '../../../Utils';
import { useApi } from '../../../contexts/Api';
import { useConnect } from '../../../contexts/Connect';
import { useBalances } from '../../../contexts/Balances';
import { useStaking } from '../../../contexts/Staking';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { Spacer } from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MotionContainer } from '../MotionContainer';
import { BondInputWrapper, Warning, BondStatus } from './Wrappers';

const RESERVE_AMOUNT = 0.1 ** 10;

export const Bond = (props: any) => {

  // functional props
  const { setup, setSetup, activeSection, setActiveSection, section } = props;

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { staking, eraStakers } = useStaking();
  const { getAccountLedger, getBondedAccount, getAccountBalance }: any = useBalances();

  const { minNominatorBond } = staking;
  const { minActiveBond } = eraStakers;
  const balance = getAccountBalance(activeAccount);
  let { free } = balance;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { total } = ledger;

  let freeAfterReserve: any = free - RESERVE_AMOUNT;
  freeAfterReserve = freeAfterReserve < 0 ? 0 : freeAfterReserve;

  const [bond, setBond] = useState(planckToDot(freeAfterReserve));

  const handleChangeBond = (e: any) => {
    let { value } = e.target;

    // not numeric
    if (!isNumeric(value) && value !== '') {
      return;
    }
    // set local value to update input element
    setBond(value);

    // set setup value if valid amount
    if (value < freeAfterReserve && value !== '') {
      setSetup({
        ...setup,
        bond: value,
      });
    }
  }

  // handle errors

  let errors = [];
  let bondDisabled = false;

  // pre-bond input errors

  if (freeAfterReserve === 0) {
    bondDisabled = true;
    errors.push(`You have no free ${network.unit} to bond.`);
  }

  if (freeAfterReserve < minNominatorBond) {
    bondDisabled = true;
    errors.push(`You do not meet the minimum nominator bond of ${planckToDot(minNominatorBond)} ${network.unit}.`);
  }

  // bond input errors

  if (bond < minNominatorBond && bond !== '' && bond !== 0) {
    errors.push(`Bond amount must be at least ${planckToDot(minNominatorBond)} ${network.unit}.`);
  }

  if (bond > freeAfterReserve) {
    errors.push(`Bond amount is more than your free balance.`);
  }

  const gtMinNominatorBond = bond >= planckToDot(minNominatorBond);
  const gtMinActiveBond = bond >= minActiveBond;

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={section}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        complete={setup.bond !== 0}
        title={`Bond${total > 0 ? `ed` : ``} ${network.unit}`}
        assistantPage='stake'
        assistantKey='Bonding'
      />

      <MotionContainer
        thisSection={section}
        activeSection={activeSection}
      >
        {errors.map((err: any, index: any) =>
          <Warning key={`setup_error_${index}`}>
            <FontAwesomeIcon icon={faExclamationTriangle} transform="shrink-2" />
            <h4>{err}</h4>
          </Warning>
        )}

        {!errors.length &&
          <h4>Available: {planckToDot(freeAfterReserve)} {network.unit}</h4>
        }
        <Spacer />

        <BondInputWrapper>
          <section style={{ opacity: bondDisabled ? 0.5 : 1 }}>
            <h3>Bond Amount</h3>
            <input
              type="text"
              placeholder={`0 ${network.unit}`}
              value={bond}
              onChange={(e) => handleChangeBond(e)}
              disabled={bondDisabled}
            />
          </section>
          <section>

          </section>
        </BondInputWrapper>
        <BondStatus>
          <div className='bars'>
            <section className={gtMinNominatorBond ? `invert` : ``}>
              <h4>&nbsp;</h4>
              <div className='bar'>
                <h5>Inactive</h5>
              </div>
            </section>
            <section className={gtMinNominatorBond ? `invert` : ``}>
              <h4>
                <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
                &nbsp;
                Nominate
              </h4>
              <div className='bar'>
                <h5>{planckToDot(minNominatorBond)} {network.unit}</h5>
              </div>
            </section>
            <section className={gtMinActiveBond ? `invert` : ``}>
              <h4>
                <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
                &nbsp;
                Receive Rewards
              </h4>
              <div className='bar'>
                <h5>{minActiveBond} {network.unit}</h5>
              </div>
            </section>
          </div>
        </BondStatus>
        <Footer
          complete={setup.bond !== 0}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </MotionContainer>
    </SectionWrapper>
  )
}

export default Bond;