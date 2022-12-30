// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { useTxFees } from 'contexts/TxFees';
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
  const { txFees } = useTxFees();
  const { getSetupProgress, setActiveAccountSetup } = useSetup();
  const setup = getSetupProgress('stake', activeAccount);
  const { t } = useTranslation('pages');

  // either free to bond or existing setup value
  const initialBondValue = setup.bond === '0' ? '0' : setup.bond;

  // store local bond amount for form control
  const [bond, setBond] = useState({
    bond: initialBondValue,
  });

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // handler for updating bond
  const handleSetupUpdate = (value: any) => {
    setActiveAccountSetup('stake', value);
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
      setActiveAccountSetup('stake', {
        ...setup,
        bond: initialBondValue,
      });
    }
  }, [setup.section]);

  return (
    <>
      <Header
        thisSection={section}
        complete={setup.bond !== '0' && setup.bond !== ''}
        title={t('nominate.bond') || ''}
        helpKey="Bonding"
        setupType="stake"
      />
      <MotionContainer thisSection={section} activeSection={setup.section}>
        <BondFeedback
          syncing={txFees.eq(new BN(0))}
          bondFor="nominator"
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
          txFees={txFees}
          maxWidth
        />
        <NominateStatusBar value={bond.bond} />
        <Footer complete={bondValid} setupType="stake" />
      </MotionContainer>
    </>
  );
};

export default Bond;
