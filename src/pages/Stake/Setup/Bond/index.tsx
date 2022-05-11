// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { planckToUnit } from '../../../../Utils';
import { useApi } from '../../../../contexts/Api';
import { useConnect } from '../../../../contexts/Connect';
import { useBalances } from '../../../../contexts/Balances';
import { useUi } from '../../../../contexts/UI';
import { SectionWrapper } from '../../../../library/Graphs/Wrappers';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { MotionContainer } from '../MotionContainer';
import { BondInputWithFeedback } from '../../../../library/Form/BondInputWithFeedback';
import { BondStatusBar } from '../../../../library/Form/BondStatusBar';

export const Bond = (props: any) => {

  const { section } = props;

  const { network }: any = useApi();
  const { units } = network;
  const { activeAccount } = useConnect();
  const { getAccountBalance, getAccountLedger, getBondedAccount }: any = useBalances();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { active } = ledger;

  const balance = getAccountBalance(activeAccount);
  const setup = getSetupProgress(activeAccount);

  let { freeAfterReserve } = balance;
  let freeToBond: any = planckToUnit(freeAfterReserve.toNumber(), units) - planckToUnit(active.toNumber(), units);
  freeToBond = freeToBond < 0 ? 0 : freeToBond;

  const initialBondValue = setup.bond === 0
    ? planckToUnit(freeToBond, units)
    : setup.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState({
    bond: initialBondValue
  });

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: setup.bond
    });
  }, [activeAccount]);

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
        <BondInputWithFeedback
          nominating
          unbond={false}
          listenIsValid={setBondValid}
          defaultBond={initialBondValue}
          setters={[{
            set: setActiveAccountSetup,
            current: setup
          }, {
            set: setBond,
            current: bond
          }]}
        />
        <BondStatusBar value={bond.bond} />
        <Footer complete={bondValid} />
      </MotionContainer>
    </SectionWrapper>
  )
}

export default Bond;