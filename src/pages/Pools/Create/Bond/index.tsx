// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { useUi } from 'contexts/UI';
import { BondInputWithFeedback } from 'library/Form/BondInputWithFeedback';
import { CreatePoolStatusBar } from 'library/Form/CreatePoolStatusBar';
import { BondOptions } from 'contexts/Balances/types';
import { planckBnToUnit } from 'Utils';
import { useApi } from 'contexts/Api';
import { SetupStepProps } from 'library/SetupSteps/types';
import { SetupType } from 'contexts/UI/types';
import { Header } from 'library/SetupSteps/Header';
import { Footer } from 'library/SetupSteps/Footer';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';

export const Bond = (props: SetupStepProps) => {
  const { network } = useApi();
  const { units } = network;
  const { section } = props;
  const { activeAccount } = useConnect();
  const { getBondOptions } = useBalances();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const { freeBalance }: BondOptions = getBondOptions(activeAccount);
  const setup = getSetupProgress(SetupType.Pool, activeAccount);

  // either free to bond or existing setup value
  const initialBondValue =
    setup.bond === 0 ? planckBnToUnit(freeBalance, units) : setup.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState({
    bond: initialBondValue,
  });

  // bond valid
  const [bondValid, setBondValid] = useState<boolean>(false);

  // handler for updating bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup(SetupType.Pool, value);
  };

  // update bond on account change
  useEffect(() => {
    setBond({
      bond: initialBondValue,
    });
  }, [activeAccount]);

  // apply initial bond value to setup progress
  useEffect(() => {
    // only update if Bond is currently active
    if (setup.section === section) {
      setActiveAccountSetup(SetupType.Pool, {
        ...setup,
        bond: initialBondValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.bond !== 0}
        title="Bond"
        assistantPage="stake"
        assistantKey="Bonding"
        setupType={SetupType.Pool}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <BondInputWithFeedback
          bondType="pool"
          inSetup
          unbond={false}
          listenIsValid={setBondValid}
          defaultBond={initialBondValue}
          setters={[
            {
              set: handleSetupUpdate,
              current: setup,
            },
            {
              set: setBond,
              current: bond,
            },
          ]}
        />
        <CreatePoolStatusBar value={bond.bond} />
        <Footer complete={bondValid} setupType={SetupType.Pool} />
      </MotionContainer>
    </>
  );
};
