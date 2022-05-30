// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
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
  const { activeAccount } = useConnect();
  const { getBondOptions }: any = useBalances();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const { freeToBond } = getBondOptions(activeAccount);
  const setup = getSetupProgress(activeAccount);

  // either free to bond or existing setup value
  const initialBondValue = setup.bond === 0 ? freeToBond : setup.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState({
    bond: initialBondValue,
  });

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: setup.bond,
    });
  }, [activeAccount]);

  return (
    <SectionWrapper transparent>
      <Header
        thisSection={section}
        complete={setup.bond !== 0}
        title="Bond"
        assistantPage="stake"
        assistantKey="Bonding"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <BondInputWithFeedback
          subject="stake"
          nominating
          unbond={false}
          listenIsValid={setBondValid}
          defaultBond={initialBondValue}
          setters={[
            {
              set: setActiveAccountSetup,
              current: setup,
            },
            {
              set: setBond,
              current: bond,
            },
          ]}
        />
        <BondStatusBar value={bond.bond} />
        <Footer complete={bondValid} />
      </MotionContainer>
    </SectionWrapper>
  );
};

export default Bond;
