// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { SetupType } from 'contexts/UI/types';
import { BondFeedback } from 'library/Form/Bond/BondFeedback';
import { NominateStatusBar } from 'library/Form/NominateStatusBar';
import { Footer } from 'library/SetupSteps/Footer';
import { Header } from 'library/SetupSteps/Header';
import { MotionContainer } from 'library/SetupSteps/MotionContainer';
import { SetupStepProps } from 'library/SetupSteps/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Bond = (props: SetupStepProps) => {
  const { section } = props;
  const { activeAccount } = useConnect();
  const { getSetupProgress, setActiveAccountSetup } = useUi();
  const setup = getSetupProgress(SetupType.Stake, activeAccount);
  const { t } = useTranslation('common');

  // either free to bond or existing setup value
  const initialBondValue = setup.bond === 0 ? 0 : setup.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState({
    bond: initialBondValue,
  });

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // handler for updating bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup(SetupType.Stake, value);
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
      setActiveAccountSetup(SetupType.Stake, {
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
        title={t('pages.nominate.bond') || ''}
        helpKey="Bonding"
        setupType={SetupType.Stake}
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <BondFeedback
          bondType="stake"
          inSetup
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
        <NominateStatusBar value={bond.bond} />
        <Footer complete={bondValid} setupType={SetupType.Stake} />
      </MotionContainer>
    </>
  );
};

export default Bond;
