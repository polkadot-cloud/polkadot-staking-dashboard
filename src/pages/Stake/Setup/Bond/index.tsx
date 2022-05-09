// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { planckToUnit, humanNumber } from '../../../../Utils';
import { useApi } from '../../../../contexts/Api';
import { useConnect } from '../../../../contexts/Connect';
import { useBalances } from '../../../../contexts/Balances';
import { useStaking } from '../../../../contexts/Staking';
import { useUi } from '../../../../contexts/UI';
import { SectionWrapper } from '../../../../library/Graphs/Wrappers';
import { Spacer } from '../../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MotionContainer } from '../MotionContainer';
import { Warning, BondStatus } from './Wrappers';
import { BondInput } from '../../../../library/Form/BondInput';
import { OpenAssistantIcon } from '../../../../library/OpenAssistantIcon';

export const Bond = (props: any) => {

  const { section } = props;

  const { network }: any = useApi();
  const { units } = network;
  const { activeAccount } = useConnect();
  const { staking, eraStakers } = useStaking();
  const { getAccountBalance, getAccountLedger, getBondedAccount }: any = useBalances();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { active } = ledger;

  const { minNominatorBond } = staking;
  const { minActiveBond } = eraStakers;
  const balance = getAccountBalance(activeAccount);
  const setup = getSetupProgress(activeAccount);

  let { freeAfterReserve } = balance;
  let freeToBond: any = freeAfterReserve - planckToUnit(active, units);
  freeToBond = freeToBond < 0 ? 0 : freeToBond;

  const initialBondValue = setup.bond === 0
    ? freeAfterReserve
    : setup.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState({
    bond: initialBondValue
  });

  // store errors
  const [errors, setErrors]: any = useState([]);

  // whether bond is disabled
  const [bondDisabled, setBondDisabled] = useState(false);

  // account change - update to latest setup value
  useEffect(() => {
    setBond({
      bond: setup.bond
    });
  }, [activeAccount]);

  useEffect(() => {
    handleErrors();
  }, [bond.bond]);


  const handleErrors = () => {

    let _bondDisabled = false;
    let _errors = [];

    // pre-bond input errors

    if (freeAfterReserve === 0) {
      _bondDisabled = true;
      _errors.push(`You have no free ${network.unit} to bond.`);
    }

    if (freeAfterReserve < planckToUnit(minNominatorBond, units)) {
      _bondDisabled = true;
      _errors.push(`You do not meet the minimum nominator bond of ${planckToUnit(minNominatorBond, units)} ${network.unit}.`);
    }

    // bond input errors

    if (bond.bond < planckToUnit(minNominatorBond, units) && bond.bond !== '' && bond.bond !== 0) {
      _errors.push(`Bond amount must be at least ${planckToUnit(minNominatorBond, units)} ${network.unit}.`);
    }

    if (bond.bond > freeToBond) {
      _errors.push(`Bond amount is more than your free balance.`);
    }

    setBondDisabled(_bondDisabled);
    setErrors(_errors);
  }

  const gtMinNominatorBond = bond.bond >= planckToUnit(minNominatorBond, units);
  const gtMinActiveBond = bond.bond >= minActiveBond;

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={section}
        complete={setup.bond !== 0}
        title='Bond'
        assistantPage='stake'
        assistantKey='Bonding'
      />
      <MotionContainer
        thisSection={section}
        activeSection={setup.section}
      >
        <div className='head'>
          <h4>Available: {humanNumber(freeAfterReserve)} {network.unit}</h4>
        </div>

        {errors.map((err: any, index: any) =>
          <Warning key={`setup_error_${index}`}>
            <FontAwesomeIcon icon={faExclamationTriangle} transform="shrink-2" />
            <h4>{err}</h4>
          </Warning>
        )}
        <Spacer />
        <BondInput
          value={bond.bond}
          defaultValue={setup.bond}
          setParentState={setActiveAccountSetup}
          disabled={bondDisabled}
          setters={[
            {
              set: setActiveAccountSetup,
              current: setup
            }, {
              set: setBond,
              current: bond,
            }
          ]}
        />
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
                <OpenAssistantIcon page='stake' title='Nominating' />
              </h4>
              <div className='bar'>
                <h5>{planckToUnit(minNominatorBond, units)} {network.unit}</h5>
              </div>
            </section>
            <section className={gtMinActiveBond ? `invert` : ``}>
              <h4>
                <FontAwesomeIcon icon={faFlag} transform="shrink-4" />
                &nbsp;
                Active
                <OpenAssistantIcon page='stake' title='Active Bond Threshold' />
              </h4>
              <div className='bar'>
                <h5>{minActiveBond} {network.unit}</h5>
              </div>
            </section>
          </div>
        </BondStatus>
        <Footer complete={!errors.length && bond.bond !== ''} />
      </MotionContainer>
    </SectionWrapper>
  )
}

export default Bond;